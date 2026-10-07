import {createServer} from 'node:http';
import {randomBytes, timingSafeEqual} from 'node:crypto';
import {mkdir, readFile, readdir, rename, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(process.env.SERVICE_DATA_DIR || join(root, 'data', 'services'));
const seedFile = join(root, 'seed-services.json');
const legacyFile = process.env.LEGACY_SERVICE_FILE || join(homedir(), '.local', 'share', 'oci-open-source-hub', 'services.json');
const siteOrigin = process.env.SITE_ORIGIN || 'http://localhost:3000';
const editorPassword = process.env.EDITOR_PASSWORD;
const port = Number(process.env.PORT || 3001);
const sessions = new Map();
const loginAttempts = new Map();
const sessionLifetime = 8 * 60 * 60 * 1000;
const loginWindow = 15 * 60 * 1000;
const categories = new Set(['databases', 'streaming', 'big-data', 'search']);
let writes = Promise.resolve();
let startup;

if (!editorPassword || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Set EDITOR_PASSWORD and a valid PORT before starting.');
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));
  return left.length === right.length && timingSafeEqual(left, right);
}

function slug(name) {
  return name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function validateService(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Enter a service.');
  const name = String(value.name || '').trim();
  const description = String(value.description || '').trim();
  const url = String(value.url || '').trim();
  const image = String(value.image || '').trim();
  const selected = value.categories;
  if (name.length < 3 || name.length > 100 || /[\x00-\x1f]/.test(name) || !slug(name)) throw new Error('Name must be 3–100 characters.');
  if (description.length < 15 || description.length > 400 || /[\x00-\x1f]/.test(description)) throw new Error('Description must be 15–400 characters.');
  if (!Array.isArray(selected) || !selected.length || selected.some((item) => !categories.has(item)) || new Set(selected).size !== selected.length) throw new Error('Choose at least one valid category.');
  if (url && (!/^https:\/\/[^\s]+$/i.test(url) || url.length > 500)) throw new Error('Service URL must start with https://.');
  if (image && (!/^\/img\/services\/[a-z0-9._-]+\.(png|jpe?g|webp|svg)$/i.test(image) || image.includes('..'))) throw new Error('Logo path must be in /img/services/.');
  return {name, categories: selected, description, ...(url ? {url} : {}), ...(image ? {image} : {})};
}

async function seedData() {
  await mkdir(dataDir, {recursive: true});
  const files = (await readdir(dataDir)).filter((name) => name.endsWith('.json'));
  if (files.length) return;
  let seed;
  try { seed = JSON.parse(await readFile(legacyFile, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    seed = JSON.parse(await readFile(seedFile, 'utf8'));
  }
  if (!Array.isArray(seed)) throw new Error('Initial service catalog must be a list.');
  const used = new Set();
  for (const item of seed) {
    const service = validateService(item);
    const base = slug(service.name);
    let id = base;
    let suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    await writeFile(join(dataDir, `${id}.json`), `${JSON.stringify(service, null, 2)}\n`, {flag: 'wx'});
  }
}

function initialize() {
  if (!startup) startup = seedData().catch((error) => { startup = undefined; throw error; });
  return startup;
}

async function listServices() {
  await initialize();
  const names = (await readdir(dataDir)).filter((name) => /^[a-z0-9][a-z0-9-]*\.json$/.test(name)).sort();
  const services = await Promise.all(names.map(async (file) => ({id: file.slice(0, -5), ...validateService(JSON.parse(await readFile(join(dataDir, file), 'utf8')))})));
  return services.sort((a, b) => a.name.localeCompare(b.name));
}

async function readJson(request) {
  if (!String(request.headers['content-type'] || '').startsWith('application/json')) throw new Error('Expected JSON.');
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new Error('Request is too large.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('Invalid JSON.'); }
}

function headers(request) {
  const origin = request.headers.origin;
  return origin === siteOrigin ? {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  } : {Vary: 'Origin'};
}

function send(request, response, status, data) {
  const body = JSON.stringify(data);
  response.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers(request)});
  response.end(body);
}

function authorized(request) {
  const token = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (expiry < Date.now()) { sessions.delete(token); return false; }
  return true;
}

async function addService(value) {
  const service = validateService(value);
  const existing = await listServices();
  if (existing.some((item) => item.name.toLowerCase() === service.name.toLowerCase())) return {status: 409, error: 'A service with that name already exists.'};
  const base = slug(service.name);
  let id = base;
  let suffix = 2;
  while (existing.some((item) => item.id === id)) id = `${base}-${suffix++}`;
  const file = join(dataDir, `${id}.json`);
  const temporary = `${file}.${randomBytes(6).toString('hex')}.tmp`;
  await writeFile(temporary, `${JSON.stringify(service, null, 2)}\n`, {mode: 0o600});
  await rename(temporary, file);
  return {status: 201, service: {id, ...service}};
}

async function handler(request, response) {
  const path = new URL(request.url || '/', 'http://localhost').pathname;
  if (request.method === 'GET' && path === '/health') return send(request, response, 200, {status: 'ok'});
  if (request.headers.origin && request.headers.origin !== siteOrigin) return send(request, response, 403, {error: 'Origin is not allowed.'});
  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers(request));
    return response.end();
  }
  if (request.method === 'GET' && path === '/api/services') return send(request, response, 200, {services: await listServices()});
  if (request.method === 'POST' && path === '/api/editor/verify') {
    const address = request.socket.remoteAddress || 'unknown';
    const previous = loginAttempts.get(address);
    if (previous?.until > Date.now() && previous.count >= 20) return send(request, response, 429, {error: 'Too many attempts. Try again later.'});
    const body = await readJson(request);
    if (!safeEqual(body.password, editorPassword)) {
      const current = previous?.until > Date.now() ? previous : {count: 0, until: Date.now() + loginWindow};
      current.count++;
      loginAttempts.set(address, current);
      return send(request, response, 403, {error: 'Incorrect password.'});
    }
    loginAttempts.delete(address);
    const token = randomBytes(32).toString('hex');
    sessions.set(token, Date.now() + sessionLifetime);
    return send(request, response, 200, {token});
  }
  if (request.method === 'POST' && path === '/api/services') {
    if (!authorized(request)) return send(request, response, 401, {error: 'Unlock the editor first.'});
    const value = await readJson(request);
    const result = await (writes = writes.catch(() => {}).then(() => addService(value)));
    if (result.error) return send(request, response, result.status, {error: result.error});
    return send(request, response, 201, {service: result.service});
  }
  return send(request, response, 404, {error: 'Not found.'});
}

createServer((request, response) => handler(request, response).catch((error) => {
  const status = error.message === 'Request is too large.' ? 413 : error.code ? 500 : 400;
  if (!response.headersSent) send(request, response, status, {error: error.message});
})).listen(port, '0.0.0.0', () => console.log(`Service API listening on ${port}`));
