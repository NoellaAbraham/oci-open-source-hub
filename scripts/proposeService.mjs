import {appendFileSync} from 'node:fs';
import {addService, validateService} from './serviceCatalog.mjs';

const token = process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');

if (!token || !owner || !repo) throw new Error('Missing GitHub Actions repository context.');

async function github(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'oci-open-source-hub-service-proposal',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? {'Content-Type': 'application/json'} : {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}: ${data.message || 'request failed'}`);
  return data;
}

const form = new URLSearchParams({
  name: process.env.SERVICE_NAME || '',
  category: process.env.SERVICE_CATEGORY || '',
  description: process.env.SERVICE_DESCRIPTION || '',
  url: process.env.SERVICE_URL || '',
  image: process.env.SERVICE_IMAGE || '',
});
const service = validateService(form);
const repositoryPath = `/repos/${owner}/${repo}`;
const {default_branch: base} = await github(repositoryPath);
const baseRef = await github(`${repositoryPath}/git/ref/heads/${encodeURIComponent(base)}`);
const branch = `service-proposal-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}`;
const catalogPath = 'src/data/services.js';
const original = await github(`${repositoryPath}/contents/${catalogPath}?ref=${baseRef.object.sha}`);
const current = Buffer.from(original.content, 'base64').toString('utf8');
const updated = addService(current, service);

await github(`${repositoryPath}/git/refs`, {
  method: 'POST',
  body: JSON.stringify({ref: `refs/heads/${branch}`, sha: baseRef.object.sha}),
});

await github(`${repositoryPath}/contents/${catalogPath}`, {
  method: 'PUT',
  body: JSON.stringify({
    message: `Add ${service.name} service`,
    content: Buffer.from(updated).toString('base64'),
    sha: original.sha,
    branch,
  }),
});

const pull = await github(`${repositoryPath}/pulls`, {
  method: 'POST',
  body: JSON.stringify({
    title: `Add service: ${service.name}`,
    head: branch,
    base,
    body: `Service proposal submitted by @${process.env.GITHUB_ACTOR}.\n\nPlease review before merging. The website updates after this pull request is merged.`,
  }),
});

appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Pull request created: ${pull.html_url}\n`);
console.log(`Created pull request: ${pull.html_url}`);