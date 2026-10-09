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
    env: {...process.env, PORT: String(port), SERVICE_DATA_DIR: dir, RESOURCE_DATA_DIR: join(dir, 'resources'), REPORT_DATA_DIR: join(dir, 'reports'), MEDIA_DATA_DIR: join(dir, 'media'), LEGACY_SERVICE_FILE: join(dir, 'previous-catalog.json'), SITE_ORIGIN: 'http://localhost:3000', EDITOR_PASSWORD: 'test-password'},
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

test('editor authorization, service creation, deletion, and persistence', async () => {
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
    assert.equal((await request('/api/services', 'DELETE', {id: 'oci-cache'})).status, 401);
    const created = await request('/api/services', 'POST', item, token);
    assert.equal(created.status, 201);
    assert.equal((await created.json()).service.id, 'example-service');
    assert.equal((await request('/api/services', 'POST', item, token)).status, 409);
    assert.equal((await request('/api/services', 'POST', {...item, categories: ['invalid']}, token)).status, 400);
    assert.equal((await request('/api/services', 'DELETE', {id: '../seed-services'}, token)).status, 400);
    assert.equal((await request('/api/services', 'DELETE', {id: 'missing'}, token)).status, 404);
    assert.equal((await fetch(`${server.base}/api/services`, {headers: {Origin: 'https://wrong.example'}})).status, 403);
    assert.equal((await readdir(dir)).filter((name) => name.endsWith('.json')).length, 10);
    assert.equal(JSON.parse(await readFile(join(dir, 'example-service.json'), 'utf8')).name, item.name);
    await stop(server.child);
    server = await start(port, dir);
    const reloaded = await (await fetch(`${server.base}/api/services`)).json();
    assert.equal(reloaded.services.length, 10);
    assert.ok(reloaded.services.some((service) => service.name === item.name));
    const secondUnlock = await request('/api/editor/verify', 'POST', {password: 'test-password'});
    const secondToken = (await secondUnlock.json()).token;
    for (const service of reloaded.services) {
      assert.equal((await request('/api/services', 'DELETE', {id: service.id}, secondToken)).status, 200);
    }
    assert.equal((await (await fetch(`${server.base}/api/services`)).json()).services.length, 0);
    await stop(server.child);
    server = await start(port, dir);
    assert.equal((await (await fetch(`${server.base}/api/services`)).json()).services.length, 0);
  } finally {
    if (server && server.child.exitCode === null) await stop(server.child);
    await rm(dir, {recursive: true, force: true});
  }
});

test('resource and report editing, upload, and persistence', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hub-content-'));
  const port = await freePort();
  let server;
  try {
    server = await start(port, dir);
    const base = server.base;
    const initialResources = await (await fetch(`${base}/api/resources`)).json();
    const initialReports = await (await fetch(`${base}/api/reports`)).json();
    assert.equal(initialResources.resources.length, 59);
    assert.equal(initialReports.reports.length, 2);
    const unlock = await fetch(`${base}/api/editor/verify`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password: 'test-password'})});
    const {token} = await unlock.json();
    const json = (path, method, body) => fetch(`${base}${path}`, {method, headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify(body)});
    assert.equal((await json('/api/resources', 'POST', {title: 'New Demo', category: 'demo', type: 'Demo', url: 'https://example.com', creator: 'Editor'})).status, 201);
    const updated = await json('/api/resources', 'PUT', {id: 'new-demo', title: 'Updated Demo', category: 'demo', type: 'Demo', url: 'https://example.com'});
    assert.equal(updated.status, 200);
    assert.equal((await updated.json()).resource.title, 'Updated Demo');
    assert.equal((await json('/api/resources', 'DELETE', {id: 'new-demo'})).status, 200);
    const html = '<!doctype html><title>Test report</title><h1>Test report</h1>' + ' '.repeat(5_500_000);
    assert.equal((await fetch(`${base}/api/media?kind=html&name=report.html`, {method: 'POST', headers: {'Content-Type': 'text/html'}, body: html})).status, 401);
    const upload = await fetch(`${base}/api/media?kind=html&name=report.html`, {method: 'POST', headers: {'Content-Type': 'text/html', Authorization: `Bearer ${token}`}, body: html});
    assert.equal(upload.status, 201);
    const {url} = await upload.json();
    assert.equal(await (await fetch(`${base}${url}`)).text(), html);
    const videoBytes = Buffer.from('000000186674797069736f6d', 'hex');
    const videoUpload = await fetch(`${base}/api/media?kind=video&name=demo.mp4`, {method: 'POST', headers: {'Content-Type': 'video/mp4', Authorization: `Bearer ${token}`}, body: videoBytes});
    assert.equal(videoUpload.status, 201);
    const {url: videoUrl} = await videoUpload.json();
    assert.equal((await fetch(`${base}${videoUrl}`)).headers.get('content-type'), 'video/mp4');
    const report = await json('/api/reports', 'POST', {title: 'Test Report', summary: 'A report summary.', htmlFile: url, publishedAt: '2026-10-09'});
    assert.equal(report.status, 201);
    assert.equal((await report.json()).report.htmlFile, url);
    assert.equal((await json('/api/reports', 'PUT', {id: 'test-report', title: 'Test Report', summary: 'An updated summary.', htmlFile: url})).status, 200);
    await stop(server.child);
    server = await start(port, dir);
    assert.ok((await (await fetch(`${base}/api/reports`)).json()).reports.some((item) => item.title === 'Test Report'));
  } finally {
    if (server && server.child.exitCode === null) await stop(server.child);
    await rm(dir, {recursive: true, force: true});
  }
});
