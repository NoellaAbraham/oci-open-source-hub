import {createServer} from 'node:http';
import {randomBytes, timingSafeEqual} from 'node:crypto';
import {mkdir, readFile, readdir, rename, stat, unlink, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(process.env.SERVICE_DATA_DIR || join(root, 'data', 'services'));
const resourceDir = resolve(process.env.RESOURCE_DATA_DIR || join(dirname(dataDir), 'resources'));
const reportDir = resolve(process.env.REPORT_DATA_DIR || join(dirname(dataDir), 'reports'));
const mediaDir = resolve(process.env.MEDIA_DATA_DIR || join(dirname(dataDir), 'media'));
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
const resourceCategories = new Set(['demo', 'github', 'article', 'diagram']);
const mediaTypes = {
  video: {extensions: ['mp4', 'webm'], mime: ['video/mp4', 'video/webm'], limit: 10_000_000},
  html: {extensions: ['html'], mime: ['text/html'], limit: 10_000_000},
  image: {extensions: ['png', 'jpg', 'jpeg', 'webp'], mime: ['image/png', 'image/jpeg', 'image/webp'], limit: 2_000_000},
};
let writes = Promise.resolve();
let startup;
let contentStartup;

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

function optionalText(value, label, max = 1000) {
  const text = String(value || '').trim();
  if (text.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text)) throw new Error(`${label} is too long or contains invalid characters.`);
  return text;
}

function link(value, label, allowMedia = false) {
  const text = optionalText(value, label, 1000);
  if (text && !/^https:\/\/[^\s]+$/i.test(text) && !/^\/(?!\/)[a-z0-9/_?&=.-]+$/i.test(text)) throw new Error(`${label} must be an HTTPS or site URL.`);
  if (text.startsWith('/api/media?') && !allowMedia) throw new Error(`${label} cannot reference an upload.`);
  return text;
}

function date(value) {
  const text = optionalText(value, 'Date', 10);
  if (text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error('Date must use YYYY-MM-DD.');
  return text;
}

function validateResource(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Enter a resource.');
  const title = optionalText(value.title, 'Title', 180);
  const category = optionalText(value.category, 'Category', 20);
  const type = optionalText(value.type, 'Type', 100);
  if (title.length < 3 || !slug(title)) throw new Error('Title must be at least 3 characters.');
  if (!resourceCategories.has(category)) throw new Error('Choose a valid category.');
  if (!type) throw new Error('Enter a card type.');
  const tags = value.tags || [];
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string' || !/^[a-z0-9-]+$/.test(tag)) || tags.length > 20) throw new Error('Choose valid service tags.');
  const order = Number.isInteger(value.order) && value.order >= 0 ? value.order : undefined;
  return {title, category, type, creator: optionalText(value.creator, 'Creator', 180), description: optionalText(value.description, 'Description', 1000),
    url: link(value.url, 'Resource URL'), videoUrl: link(value.videoUrl, 'Video URL'), videoFile: link(value.videoFile, 'Video file', true),
    tags, publishedAt: date(value.publishedAt), updatedAt: date(value.updatedAt),
    ...(optionalText(value.youtubeId, 'YouTube ID', 30) ? {youtubeId: value.youtubeId} : {}), ...(order !== undefined ? {order} : {})};
}

function validateReport(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Enter a report.');
  const title = optionalText(value.title, 'Title', 180);
  const summary = optionalText(value.summary, 'Summary', 1500);
  if (title.length < 3 || !slug(title)) throw new Error('Title must be at least 3 characters.');
  if (!summary) throw new Error('Enter a summary.');
  const order = Number.isInteger(value.order) && value.order >= 0 ? value.order : undefined;
  return {title, creator: optionalText(value.creator, 'Creator', 180), period: optionalText(value.period, 'Period', 80),
    summary, description: optionalText(value.description, 'Description', 1500), publishedAt: date(value.publishedAt),
    coverImage: link(value.coverImage, 'Cover image', true), htmlFile: link(value.htmlFile, 'HTML report', true),
    readOnlinePath: link(value.readOnlinePath, 'Read online path'), pdfUrl: link(value.pdfUrl, 'PDF URL'), slidesUrl: link(value.slidesUrl, 'Slides URL'),
    tags: Array.isArray(value.tags) ? value.tags.filter((tag) => typeof tag === 'string' && /^[a-z0-9-]+$/.test(tag)).slice(0, 20) : [],
    ...(order !== undefined ? {order} : {})};
}

async function seedData() {
  await mkdir(dataDir, {recursive: true});
  const entries = await readdir(dataDir);
  if (entries.includes('.initialized')) return;
  const files = entries.filter((name) => name.endsWith('.json'));
  if (files.length) {
    await writeFile(join(dataDir, '.initialized'), '', {flag: 'wx'});
    return;
  }
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
  await writeFile(join(dataDir, '.initialized'), '', {flag: 'wx'});
}

function initialize() {
  if (!startup) startup = seedData().catch((error) => { startup = undefined; throw error; });
  return startup;
}

async function seedCollection(dir, filename, validate) {
  await mkdir(dir, {recursive: true});
  const entries = await readdir(dir);
  if (entries.includes('.initialized')) return;
  if (entries.some((name) => name.endsWith('.json'))) {
    await writeFile(join(dir, '.initialized'), '', {flag: 'wx'});
    return;
  }
  const items = JSON.parse(await readFile(join(root, filename), 'utf8'));
  for (const item of items) {
    const data = validate(item);
    const id = String(item.id || slug(data.title));
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('Invalid seed ID.');
    await writeFile(join(dir, `${id}.json`), `${JSON.stringify(data, null, 2)}\n`, {flag: 'wx'});
  }
  await writeFile(join(dir, '.initialized'), '', {flag: 'wx'});
}

function initializeContent() {
  if (!contentStartup) contentStartup = Promise.all([
    seedCollection(resourceDir, 'seed-resources.json', validateResource),
    seedCollection(reportDir, 'seed-reports.json', validateReport),
    mkdir(mediaDir, {recursive: true}),
  ]).catch((error) => { contentStartup = undefined; throw error; });
  return contentStartup;
}

const collections = {
  resources: {dir: resourceDir, validate: validateResource, field: 'title'},
  reports: {dir: reportDir, validate: validateReport, field: 'title'},
};

async function listCollection(kind) {
  await initializeContent();
  const {dir, validate} = collections[kind];
  const names = (await readdir(dir)).filter((name) => /^[a-z0-9][a-z0-9-]*\.json$/.test(name));
  const items = await Promise.all(names.map(async (file) => ({id: file.slice(0, -5), ...validate(JSON.parse(await readFile(join(dir, file), 'utf8')))})));
  return items.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '') || (a.order ?? 9999) - (b.order ?? 9999));
}

async function saveCollection(kind, method, value) {
  await initializeContent();
  const {dir, validate, field} = collections[kind];
  const item = validate(value);
  const existing = await listCollection(kind);
  if (method === 'POST' && existing.some((entry) => entry[field].toLowerCase() === item[field].toLowerCase())) return {status: 409, error: 'An item with that title already exists.'};
  let id = value.id;
  if (method === 'POST') {
    id = slug(item[field]);
    let suffix = 2;
    while (existing.some((entry) => entry.id === id)) id = `${slug(item[field])}-${suffix++}`;
  } else if (typeof id !== 'string' || !existing.some((entry) => entry.id === id)) return {status: 404, error: 'Item not found. Reload the catalog.'};
  const file = join(dir, `${id}.json`);
  const temporary = `${file}.${randomBytes(6).toString('hex')}.tmp`;
  await writeFile(temporary, `${JSON.stringify(item, null, 2)}\n`, {mode: 0o600});
  await rename(temporary, file);
  return {status: method === 'POST' ? 201 : 200, item: {id, ...item}};
}

async function deleteCollection(kind, value) {
  const id = value?.id;
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('Choose a valid item.');
  await initializeContent();
  try { await unlink(join(collections[kind].dir, `${id}.json`)); }
  catch (error) {
    if (error.code === 'ENOENT') return {status: 404, error: 'Item not found. Reload the catalog.'};
    throw error;
  }
  return {status: 200, id};
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

async function readUpload(request, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > limit) throw new Error('Upload is too large. Use a URL for larger files.');
    chunks.push(chunk);
  }
  if (!size) throw new Error('Choose a file to upload.');
  return Buffer.concat(chunks);
}

function headers(request) {
  const origin = request.headers.origin;
  return origin === siteOrigin ? {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  } : {Vary: 'Origin'};
}

function send(request, response, status, data) {
  const body = JSON.stringify(data);
  response.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers(request)});
  response.end(body);
}

async function uploadMedia(request, url) {
  await initializeContent();
  const kind = url.searchParams.get('kind');
  const name = url.searchParams.get('name') || '';
  const config = mediaTypes[kind];
  const extension = name.split('.').pop().toLowerCase();
  const mime = String(request.headers['content-type'] || '').split(';')[0].toLowerCase();
  if (!config || !config.extensions.includes(extension) || !config.mime.includes(mime)) throw new Error('Choose a supported HTML, image, or video file.');
  const bytes = await readUpload(request, config.limit);
  if (kind === 'video' && extension === 'mp4' && bytes.toString('ascii', 4, 8) !== 'ftyp') throw new Error('Invalid MP4 file.');
  if (kind === 'video' && extension === 'webm' && bytes.subarray(0, 4).toString('hex') !== '1a45dfa3') throw new Error('Invalid WebM file.');
  if (kind === 'image' && extension === 'png' && bytes.subarray(0, 4).toString('hex') !== '89504e47') throw new Error('Invalid PNG file.');
  if (kind === 'image' && ['jpg', 'jpeg'].includes(extension) && bytes.subarray(0, 3).toString('hex') !== 'ffd8ff') throw new Error('Invalid JPEG file.');
  if (kind === 'image' && extension === 'webp' && bytes.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Invalid WebP file.');
  const filename = `${kind}-${randomBytes(12).toString('hex')}.${extension}`;
  await writeFile(join(mediaDir, filename), bytes, {flag: 'wx', mode: 0o600});
  return {url: `/api/media?file=${filename}`};
}

async function sendMedia(request, response, url) {
  const filename = url.searchParams.get('file') || '';
  if (!/^(video|html|image)-[a-f0-9]{24}\.(mp4|webm|html|png|jpe?g|webp)$/.test(filename)) return send(request, response, 400, {error: 'Invalid file.'});
  await initializeContent();
  const file = join(mediaDir, filename);
  let info;
  try { info = await stat(file); }
  catch (error) {
    if (error.code === 'ENOENT') return send(request, response, 404, {error: 'File not found.'});
    throw error;
  }
  const mime = {mp4: 'video/mp4', webm: 'video/webm', html: 'text/html; charset=utf-8', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp'}[filename.split('.').pop()];
  response.writeHead(200, {'Content-Type': mime, 'Content-Length': info.size, 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff', ...headers(request)});
  response.end(await readFile(file));
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

async function deleteService(value) {
  const id = value?.id;
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('Choose a valid service.');
  await initialize();
  try { await unlink(join(dataDir, `${id}.json`)); }
  catch (error) {
    if (error.code === 'ENOENT') return {status: 404, error: 'Service not found. Reload the catalog.'};
    throw error;
  }
  return {status: 200, id};
}

async function handler(request, response) {
  const url = new URL(request.url || '/', 'http://localhost');
  const path = url.pathname;
  if (request.method === 'GET' && path === '/health') return send(request, response, 200, {status: 'ok'});
  if (request.headers.origin && request.headers.origin !== siteOrigin) return send(request, response, 403, {error: 'Origin is not allowed.'});
  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers(request));
    return response.end();
  }
  if (request.method === 'GET' && path === '/api/services') return send(request, response, 200, {services: await listServices()});
  if (request.method === 'GET' && path === '/api/resources') return send(request, response, 200, {resources: await listCollection('resources')});
  if (request.method === 'GET' && path === '/api/reports') return send(request, response, 200, {reports: await listCollection('reports')});
  if (request.method === 'GET' && path === '/api/media') return sendMedia(request, response, url);
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
  if (request.method === 'DELETE' && path === '/api/services') {
    if (!authorized(request)) return send(request, response, 401, {error: 'Unlock the editor first.'});
    const value = await readJson(request);
    const result = await (writes = writes.catch(() => {}).then(() => deleteService(value)));
    if (result.error) return send(request, response, result.status, {error: result.error});
    return send(request, response, 200, {deleted: result.id});
  }
  const collection = path === '/api/resources' ? 'resources' : path === '/api/reports' ? 'reports' : null;
  if (collection && ['POST', 'PUT', 'DELETE'].includes(request.method)) {
    if (!authorized(request)) return send(request, response, 401, {error: 'Unlock the editor first.'});
    const value = await readJson(request);
    const result = await (writes = writes.catch(() => {}).then(() => request.method === 'DELETE'
      ? deleteCollection(collection, value) : saveCollection(collection, request.method, value)));
    if (result.error) return send(request, response, result.status, {error: result.error});
    return send(request, response, result.status, request.method === 'DELETE' ? {deleted: result.id} : {[collection.slice(0, -1)]: result.item});
  }
  if (request.method === 'POST' && path === '/api/media') {
    if (!authorized(request)) return send(request, response, 401, {error: 'Unlock the editor first.'});
    return send(request, response, 201, await uploadMedia(request, url));
  }
  return send(request, response, 404, {error: 'Not found.'});
}

createServer((request, response) => handler(request, response).catch((error) => {
  const status = /too large/i.test(error.message) ? 413 : error.code ? 500 : 400;
  if (!response.headersSent) send(request, response, status, {error: error.message});
})).listen(port, '0.0.0.0', () => console.log(`Service API listening on ${port}`));
