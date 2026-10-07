import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp, readFile, readdir, rm} from 'node:fs/promises';
import {createServer} from 'node:net';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';

async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function start(port, dir) {
  const child = spawn(process.execPath, [fileURLToPath(new URL('./server.mjs', import.meta.url))], {
    env: {...process.env, PORT: String(port), SERVICE_DATA_DIR: dir, LEGACY_SERVICE_FILE: join(dir, 'previous-catalog.json'), SITE_ORIGIN: 'http://localhost:3000', EDITOR_PASSWORD: 'test-password'},
    stdio: 'pipe',
  });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error('API exited before startup.');
    try { if ((await fetch(`${base}/health`)).ok) return {child, base}; } catch { /* Startup is pending. */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  child.kill();
  throw new Error('API did not start.');
}

async function stop(child) {
  child.kill();
  await new Promise((resolve) => child.once('exit', resolve));
}

test('editor authorization, service creation, duplicate rejection, and persistence', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hub-services-'));
  const port = await freePort();
  let server;
  try {
    server = await start(port, dir);
    const request = (path, method, body, token) => fetch(`${server.base}${path}`, {
      method,
      headers: {'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...(token ? {Authorization: `Bearer ${token}`} : {})},
      body: JSON.stringify(body),
    });
    const initial = await (await fetch(`${server.base}/api/services`)).json();
    assert.equal(initial.services.length, 9);
    assert.equal((await request('/api/editor/verify', 'POST', {password: 'wrong'})).status, 403);
    const unlock = await request('/api/editor/verify', 'POST', {password: 'test-password'});
    assert.equal(unlock.status, 200);
    const {token} = await unlock.json();
    const item = {name: 'Example Service', categories: ['search'], description: 'A useful example search service.', url: 'https://example.com'};
    assert.equal((await request('/api/services', 'POST', item)).status, 401);
    const created = await request('/api/services', 'POST', item, token);
    assert.equal(created.status, 201);
    assert.equal((await created.json()).service.id, 'example-service');
    assert.equal((await request('/api/services', 'POST', item, token)).status, 409);
    assert.equal((await request('/api/services', 'POST', {...item, categories: ['invalid']}, token)).status, 400);
    assert.equal((await fetch(`${server.base}/api/services`, {headers: {Origin: 'https://wrong.example'}})).status, 403);
    assert.equal((await readdir(dir)).filter((name) => name.endsWith('.json')).length, 10);
    assert.equal(JSON.parse(await readFile(join(dir, 'example-service.json'), 'utf8')).name, item.name);
    await stop(server.child);
    server = await start(port, dir);
    const reloaded = await (await fetch(`${server.base}/api/services`)).json();
    assert.equal(reloaded.services.length, 10);
    assert.ok(reloaded.services.some((service) => service.name === item.name));
  } finally {
    if (server && server.child.exitCode === null) await stop(server.child);
    await rm(dir, {recursive: true, force: true});
  }
});
