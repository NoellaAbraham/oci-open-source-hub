import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createServiceGithubSync} from './github-services.mjs';

const services = [{id: 'example', name: 'Example Service', categories: ['search'], description: 'An example search service.'}];
const content = `${JSON.stringify(services.map(({id, ...service}) => service), null, 2)}\n`;
const file = (text, sha = 'current-sha') => ({sha, encoding: 'base64', content: Buffer.from(text).toString('base64')});
const config = {enabled: true, repository: 'team/hub', token: 'private-test-token', branch: 'main'};

test('service snapshot is committed with a SHA guard and without server credentials or runtime IDs', async () => {
  const requests = [];
  const sync = createServiceGithubSync({...config, fetchImpl: async (url, options) => {
    requests.push({url, ...options});
    return requests.length === 1 ? Response.json(file('[]\n')) : Response.json({}, {status: 200});
  }});
  assert.deepEqual(await sync.sync(services), {status: 'synced'});
  assert.equal(requests[0].url, 'https://api.github.com/repos/team/hub/contents/backend/seed-services.json?ref=main');
  const body = JSON.parse(requests[1].body);
  assert.equal(body.sha, 'current-sha');
  assert.equal(body.branch, 'main');
  assert.equal(Buffer.from(body.content, 'base64').toString(), content);
  assert.ok(!JSON.stringify(body).includes(config.token));
});

test('unchanged catalog does not produce a redundant commit', async () => {
  let calls = 0;
  const sync = createServiceGithubSync({...config, fetchImpl: async () => {
    calls++;
    return Response.json(file(content));
  }});
  assert.deepEqual(await sync.sync(services), {status: 'synced'});
  assert.equal(calls, 1);
});

test('a concurrent commit triggers a fresh read and uses the new file SHA', async () => {
  const requests = [];
  const sync = createServiceGithubSync({...config, fetchImpl: async (url, options) => {
    requests.push(options);
    if (requests.length === 1) return Response.json(file('[]', 'old-sha'));
    if (requests.length === 2) return Response.json({}, {status: 409});
    if (requests.length === 3) return Response.json(file('[]', 'new-sha'));
    return Response.json({});
  }});
  await sync.sync(services);
  assert.equal(JSON.parse(requests[3].body).sha, 'new-sha');
});

test('permission errors are reported without exposing GitHub response bodies', async () => {
  const sync = createServiceGithubSync({...config, fetchImpl: async () => Response.json({message: config.token}, {status: 403})});
  await assert.rejects(sync.sync(services), {message: 'GitHub read failed (HTTP 403).'});
});

test('missing catalog can be created, including an empty catalog after deleting all services', async () => {
  let saved;
  const sync = createServiceGithubSync({...config, fetchImpl: async (url, options) => {
    if (!options.method) return Response.json({}, {status: 404});
    saved = JSON.parse(options.body);
    return Response.json({}, {status: 201});
  }});
  await sync.sync([]);
  assert.equal(saved.sha, undefined);
  assert.equal(Buffer.from(saved.content, 'base64').toString(), '[]\n');
});

test('sync is opt-in and requires complete configuration', async () => {
  assert.deepEqual(await createServiceGithubSync({enabled: false}).sync(services), {status: 'disabled'});
  assert.throws(() => createServiceGithubSync({enabled: true}), /requires GITHUB_TOKEN/);
});
