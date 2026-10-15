import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {test} from 'node:test';
import {createCollectionGithubSync, createGithubFileSync} from './github-content.mjs';

const config = {enabled: true, repository: 'team/hub', token: 'test-only-token', branch: 'main'};
const filename = `html-${'a'.repeat(24)}.html`;
const html = Buffer.from('<!doctype html><h1>Report</h1>');
const upload = `/api/media?file=${filename}`;

function recordingFetch(commits) {
  return async (url, options) => {
    if (!options.method) return Response.json({}, {status: 404});
    const body = JSON.parse(options.body);
    commits.push({path: new URL(url).pathname.split('/contents/')[1], bytes: Buffer.from(body.content, 'base64'), body});
    return Response.json({}, {status: 201});
  };
}

test('report media is backed up before catalog, offline links are rewritten, IDs and live objects preserved', async () => {
  const commits = [];
  const sync = createCollectionGithubSync({...config, fetchImpl: recordingFetch(commits)});
  const item = {id: 'report-id', title: 'Report', htmlFile: upload, pdfUrl: 'https://example.com/report.pdf'};
  assert.deepEqual(await sync.sync('reports', [item], async (name) => {assert.equal(name, filename); return html;}), {status: 'synced'});
  assert.deepEqual(commits.map((commit) => commit.path), [`static/uploads/${filename}`, 'backend/seed-reports.json']);
  assert.ok(commits[0].bytes.equals(html));
  assert.deepEqual(JSON.parse(commits[1].bytes), [{...item, htmlFile: `/uploads/${filename}`}]);
  assert.equal(item.htmlFile, upload);
  assert.ok(!commits.some(({body}) => JSON.stringify(body).includes(config.token)));
});

test('resource videos are backed up, reused media is not reuploaded and empty catalogs sync deletions', async () => {
  const commits = [];
  const sync = createCollectionGithubSync({...config, fetchImpl: recordingFetch(commits)});
  const video = `video-${'b'.repeat(24)}.mp4`;
  const resource = {id: 'demo', title: 'Demo', videoFile: `/api/media?file=${video}`};
  await sync.sync('resources', [resource], async () => Buffer.from('video'));
  await sync.sync('resources', [{...resource, title: 'Updated Demo'}], async () => {throw new Error('Should use already synced media.');});
  await sync.sync('resources', [], async () => {});
  assert.equal(commits.filter(({path}) => path.startsWith('static/')).length, 1);
  assert.equal(JSON.parse(commits[1].bytes)[0].videoFile, `/uploads/${video}`);
  assert.equal(JSON.parse(commits[2].bytes)[0].id, 'demo');
  assert.deepEqual(JSON.parse(commits[3].bytes), []);
});

test('failed or missing media blocks catalog publication and is retried on the next sync', async () => {
  const commits = [];
  let fail = true;
  const writer = recordingFetch(commits);
  const sync = createCollectionGithubSync({...config, fetchImpl: async (url, options) => {
    if (fail && options.method) return Response.json({}, {status: 403});
    return writer(url, options);
  }});
  const item = {id: 'report', htmlFile: upload};
  await assert.rejects(sync.sync('reports', [item], async () => {throw new Error('Missing media.');}), /Missing media/);
  await assert.rejects(sync.sync('reports', [item], async () => html), /HTTP 403/);
  assert.equal(commits.length, 0);
  fail = false;
  await sync.sync('reports', [item], async () => html);
  assert.equal(commits.length, 2);
});

test('existing large uploads use blob SHA metadata instead of base64 content', async () => {
  const bytes = Buffer.alloc(1_100_000, 3);
  const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  let calls = 0;
  const sync = createGithubFileSync({...config, fetchImpl: async () => {
    calls++;
    return Response.json({sha, content: '', encoding: 'none'});
  }});
  assert.deepEqual(await sync.syncFile('static/uploads/video.mp4', bytes, 'Backup'), {status: 'synced'});
  assert.equal(calls, 1);
});

test('concurrent file changes retry with the updated SHA; permissions do not leak response bodies', async () => {
  const requests = [];
  const writer = createGithubFileSync({...config, fetchImpl: async (url, options) => {
    requests.push(options);
    if (requests.length === 1) return Response.json({sha: 'old'});
    if (requests.length === 2) return Response.json({}, {status: 409});
    if (requests.length === 3) return Response.json({sha: 'new'});
    return Response.json({});
  }});
  await writer.syncFile('backend/seed-reports.json', '[]', 'Update');
  assert.equal(JSON.parse(requests[3].body).sha, 'new');
  const forbidden = createGithubFileSync({...config, fetchImpl: async () => Response.json({message: config.token}, {status: 403})});
  await assert.rejects(forbidden.syncFile('backend/seed-reports.json', '[]', 'Update'), {message: 'GitHub read failed (HTTP 403).'});
});

test('unsafe media paths never reach the filesystem; disabled sync never reads uploads', async () => {
  const sync = createCollectionGithubSync({...config, fetchImpl: async () => {throw new Error('Should not fetch.');}});
  await assert.rejects(sync.sync('reports', [{htmlFile: '/api/media?file=../../secret'}], async () => {throw new Error('Should not read.');}), /Invalid uploaded media/);
  const disabled = createCollectionGithubSync({enabled: false});
  assert.deepEqual(await disabled.sync('reports', [{htmlFile: upload}], async () => {throw new Error('Should not read.');}), {status: 'disabled'});
});
