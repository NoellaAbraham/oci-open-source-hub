import {createServer} from 'node:http';
import {randomBytes, timingSafeEqual} from 'node:crypto';
import {addService, removeTestService, testServices, validateService} from './serviceCatalog.mjs';

const config = {
  origin: process.env.PUBLIC_ORIGIN?.replace(/\/$/, ''),
  siteUrl: process.env.SITE_URL || 'https://noellaabraham.github.io/oci-open-source-hub/services',
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  owner: process.env.GITHUB_OWNER || 'NoellaAbraham',
  repo: process.env.GITHUB_REPO || 'oci-open-source-hub',
  port: Number(process.env.PORT || 3000),
};

const sessions = new Map();
const sessionLifetimeMs = 8 * 60 * 60 * 1000;
const stateLifetimeMs = 10 * 60 * 1000;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
}

function cookieValue(request, name) {
  const cookie = request.headers.cookie || '';
  const match = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

function cookie(name, value, maxAge) {
  return `${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function equalSecret(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function send(response, status, body, type = 'text/html; charset=utf-8', headers = {}) {
  const content = String(body);
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    'Referrer-Policy': 'no-referrer',
    ...headers,
  });
  response.end(content);
}

function redirect(response, location, headers = {}) {
  send(response, 302, '', 'text/plain; charset=utf-8', {Location: location, ...headers});
}

function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} · OCI Open Source Hub</title><style>
  :root{color-scheme:dark}*{box-sizing:border-box}body{font:16px/1.5 Arial,sans-serif;background:#161513;color:#fff;margin:0}main{width:min(100% - 2rem,720px);margin:4rem auto}a{color:#fff}a:hover{color:#e15a47}h1{font-size:clamp(2rem,5vw,3rem);font-weight:400}p{color:#b7b0ac}label{display:block;margin:1.2rem 0 .35rem}input,select,textarea{display:block;width:100%;padding:.7rem;background:#211f1d;border:1px solid #67605b;color:#fff;font:inherit}textarea{min-height:7rem;resize:vertical}button,.button{display:inline-block;margin-top:1.4rem;padding:.75rem 1.1rem;background:#c74634;border:1px solid #c74634;color:#fff;text-decoration:none;font:inherit;cursor:pointer}button:hover,.button:hover{background:#a93425;color:#fff}.muted{color:#aaa}.error{color:#ff9788}header{border-bottom:1px solid #383431;padding:1rem 2rem}header a{text-decoration:none;font-weight:700}
  </style></head><body><header><a href="${escapeHtml(config.siteUrl)}">OCI Open Source Hub</a></header><main>${body}</main></body></html>`;
}

async function github(path, token, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'oci-open-source-hub-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? {'Content-Type': 'application/json'} : {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof data.message === 'string' ? `: ${data.message}` : '';
    const error = new Error(`GitHub returned ${response.status}${detail}`);
    error.status = response.status;
    error.githubRequestId = response.headers.get('x-github-request-id');
    throw error;
  }
  return data;
}

async function collaboratorPermission(token, login) {
  const path = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/collaborators/${encodeURIComponent(login)}/permission`;
  try {
    const data = await github(path, token);
    return data.permission;
  } catch (error) {
    if (error.status === 404) return 'none';
    throw error;
  }
}

function maySubmit(permission) {
  return ['write', 'maintain', 'admin'].includes(permission);
}

async function currentSession(request) {
  const id = cookieValue(request, 'hub_session');
  const session = id && sessions.get(id);
  if (!session || session.expiresAt < Date.now()) {
    if (id) sessions.delete(id);
    return null;
  }
  // Recheck repository access on every privileged request; revocation takes effect immediately.
  let permission;
  try {
    permission = await collaboratorPermission(session.token, session.login);
  } catch (error) {
    if (error.status !== 401) throw error;
    sessions.delete(id);
    return null;
  }
  if (!maySubmit(permission)) {
    sessions.delete(id);
    return null;
  }
  return session;
}

function serviceForm(session, deletable = [], message = '') {
  const options = [
    ['databases', 'Databases & Data Stores'],
    ['streaming', 'Streaming & Messaging'],
    ['big-data', 'Big Data & Processing'],
    ['search', 'Search'],
  ];
  return page('Add Service', `<h1>Add Service</h1><p>Signed in as ${escapeHtml(session.login)}. Submit a service for review; this creates a pull request, not an immediate website change.</p>${message ? `<p class="error">${escapeHtml(message)}</p>` : ''}<form method="post" action="/admin/services">
    <input type="hidden" name="csrf" value="${escapeHtml(session.csrf)}">
    <label for="name">Service name</label><input id="name" name="name" maxlength="100" required>
    <label for="category">Category</label><select id="category" name="category">${options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select>
    <label for="description">Short description</label><textarea id="description" name="description" maxlength="400" required></textarea>
    <label for="url">Service URL (optional)</label><input id="url" name="url" type="url" maxlength="500" placeholder="https://">
    <label for="image">Logo path already in the website (optional)</label><input id="image" name="image" maxlength="200" placeholder="/img/services/example.svg"><p class="muted">A new logo can be added to the same pull request manually before merging.</p>
    <label><input type="checkbox" name="testOnly" style="display:inline;width:auto;margin-right:.5rem"> Temporary test service (name starts with [TEST] )</label>
    <button type="submit">Create pull request</button>
  </form>${deletable.length ? `<hr style="border:0;border-top:1px solid #383431;margin:3rem 0"><h2>Remove a test service</h2><p>This creates a deletion pull request. Existing services cannot be selected.</p><form method="post" action="/admin/services/delete"><input type="hidden" name="csrf" value="${escapeHtml(session.csrf)}"><label for="deleteName">Test service</label><select id="deleteName" name="name">${deletable.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}</select><button type="submit">Create deletion pull request</button></form>` : ''}`);
}

async function readForm(request) {
  if (!String(request.headers['content-type'] || '').startsWith('application/x-www-form-urlencoded')) throw new Error('Unsupported form submission.');
  let body = '';
  for await (const chunk of request) {
    body += chunk.toString('utf8');
    if (body.length > 8192) throw new Error('Form is too large.');
  }
  return new URLSearchParams(body);
}

async function currentCatalog(session) {
  const repoPath = `/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}`;
  const repo = await github(repoPath, session.token);
  const base = repo.default_branch;
  const original = await github(`${repoPath}/contents/src/data/services.js?ref=${encodeURIComponent(base)}`, session.token);
  const content = Buffer.from(original.content, 'base64').toString('utf8');
  return {repoPath, base, original, content};
}

async function createServicePullRequest(operation, name, updated, session, catalog) {
  const {repoPath, base, original} = catalog;
  const baseRef = await github(`${repoPath}/git/ref/heads/${encodeURIComponent(base)}`, session.token);
  const branch = `${operation}-service/${Date.now()}-${randomBytes(4).toString('hex')}`;
  console.log(`[pull-request] creating branch ${branch} for ${session.login}`);
  await github(`${repoPath}/git/refs`, session.token, {method: 'POST', body: JSON.stringify({ref: `refs/heads/${branch}`, sha: baseRef.object.sha})});
  console.log(`[pull-request] updating service catalog on ${branch}`);
  await github(`${repoPath}/contents/src/data/services.js`, session.token, {
    method: 'PUT',
    body: JSON.stringify({message: `${operation === 'add' ? 'Add' : 'Remove'} ${name} service`, content: Buffer.from(updated).toString('base64'), sha: original.sha, branch}),
  });
  console.log(`[pull-request] opening pull request from ${branch} into ${base}`);
  const pull = await github(`${repoPath}/pulls`, session.token, {
    method: 'POST',
    body: JSON.stringify({title: `${operation === 'add' ? 'Add' : 'Remove'} service: ${name}`, head: branch, base, body: `Submitted through the OCI Open Source Hub by @${session.login}.\n\nPlease review before merging.`}),
  });
  console.log(`[pull-request] created ${pull.html_url}`);
  return pull.html_url;
}

async function handler(request, response) {
  const url = new URL(request.url || '/', config.origin);
  if (request.method === 'GET' && url.pathname === '/health') return send(response, 200, JSON.stringify({status: 'ok'}), 'application/json; charset=utf-8');
  if (request.method === 'GET' && url.pathname === '/') return redirect(response, '/admin/services');

  if (request.method === 'GET' && url.pathname === '/auth/github') {
    const state = randomBytes(24).toString('hex');
    const expires = Date.now() + stateLifetimeMs;
    const authorization = new URL('https://github.com/login/oauth/authorize');
    authorization.searchParams.set('client_id', config.clientId);
    authorization.searchParams.set('redirect_uri', `${config.origin}/auth/callback`);
    authorization.searchParams.set('state', state);
    return redirect(response, authorization.toString(), {'Set-Cookie': cookie('hub_oauth_state', `${state}.${expires}`, 600)});
  }

  if (request.method === 'GET' && url.pathname === '/auth/callback') {
    const saved = cookieValue(request, 'hub_oauth_state') || '';
    const [state, expires] = saved.split('.');
    if (!equalSecret(state, url.searchParams.get('state')) || Number(expires) < Date.now() || !url.searchParams.get('code')) {
      return send(response, 400, page('Sign-in failed', '<h1>Sign-in failed</h1><p>The sign-in request expired. Please try again.</p>'));
    }
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'oci-open-source-hub-admin'},
      body: JSON.stringify({client_id: config.clientId, client_secret: config.clientSecret, code: url.searchParams.get('code'), redirect_uri: `${config.origin}/auth/callback`}),
      signal: AbortSignal.timeout(15000),
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error('GitHub sign-in failed.');
    const user = await github('/user', tokenData.access_token);
    const permission = await collaboratorPermission(tokenData.access_token, user.login);
    if (!maySubmit(permission)) return send(response, 403, page('Access denied', '<h1>Access denied</h1><p>Only repository collaborators with write access can add services.</p>'), undefined, {'Set-Cookie': cookie('hub_oauth_state', '', 0)});
    const id = randomBytes(32).toString('hex');
    sessions.set(id, {login: user.login, token: tokenData.access_token, csrf: randomBytes(24).toString('hex'), expiresAt: Date.now() + sessionLifetimeMs});
    return redirect(response, '/admin/services', {'Set-Cookie': [cookie('hub_oauth_state', '', 0), cookie('hub_session', id, 8 * 60 * 60)]});
  }

  if (url.pathname === '/admin/services' || url.pathname === '/admin/services/delete') {
    const session = await currentSession(request);
    if (!session) return redirect(response, '/auth/github', {'Set-Cookie': cookie('hub_session', '', 0)});
    if (request.method === 'GET' && url.pathname === '/admin/services') {
      const catalog = await currentCatalog(session);
      return send(response, 200, serviceForm(session, testServices(catalog.content)));
    }
    if (request.method === 'POST') {
      let form;
      let service;
      try {
        form = await readForm(request);
        if (!equalSecret(form.get('csrf'), session.csrf)) return send(response, 403, page('Invalid request', '<h1>Invalid request</h1><p>Reload the form and try again.</p>'));
        if (url.pathname === '/admin/services') service = validateService(form);
        else if (!String(form.get('name') || '').startsWith('[TEST] ')) throw new Error('Only test services can be removed.');
      } catch (error) {
        const catalog = await currentCatalog(session);
        return send(response, 400, serviceForm(session, testServices(catalog.content), error.message));
      }
      const catalog = await currentCatalog(session);
      const operation = url.pathname === '/admin/services' ? 'add' : 'remove';
      const name = operation === 'add' ? service.name : String(form.get('name'));
      let updated;
      try {
        updated = operation === 'add' ? addService(catalog.content, service) : removeTestService(catalog.content, name);
      } catch (error) {
        return send(response, 400, serviceForm(session, testServices(catalog.content), error.message));
      }
      let pullUrl;
      try {
        pullUrl = await createServicePullRequest(operation, name, updated, session, catalog);
      } catch (error) {
        console.error(`[pull-request] failed for ${session.login}:`, error);
        const requestId = error.githubRequestId ? ` GitHub request ID: ${error.githubRequestId}.` : '';
        return send(response, 502, serviceForm(session, testServices(catalog.content), `The pull request could not be created. ${error.message}.${requestId}`));
      }
      // A normal 200 response with an explicit Content-Length is the most reliable
      // response shape when this service is proxied through OCI API Gateway.
      return send(response, 200, page('Submitted', `<h1>${operation === 'add' ? 'Service' : 'Test service removal'} submitted</h1><p>Your proposal is ready for review. The website will update only after the pull request is merged and deployed.</p><a class="button" href="${escapeHtml(pullUrl)}">View pull request</a>`));
    }
  }
  return send(response, 404, page('Not found', '<h1>Not found</h1>'));
}

if (!config.origin?.startsWith('https://') || !config.clientId || !config.clientSecret || !Number.isInteger(config.port)) {
  console.error('Set PUBLIC_ORIGIN (https://), GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and PORT before starting.');
  process.exit(1);
}

createServer((request, response) => {
  console.log(`[request] ${request.method} ${request.url}`);
  handler(request, response).catch((error) => {
    console.error(`[request] ${request.method} ${request.url} failed:`, error);
    if (!response.headersSent) send(response, 500, page('Server error', '<h1>Something went wrong</h1><p>Please try again later.</p>'));
  });
}).listen(config.port, '0.0.0.0', () => console.log(`Admin backend listening on port ${config.port}`));
