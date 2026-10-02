import test from 'node:test';
import assert from 'node:assert/strict';
import {addService, validateService} from './serviceCatalog.mjs';

const catalog = `export const services = [\n  {name: 'Existing Service', categories: ['databases'], description: 'Existing catalog entry.'},\n];\n`;

test('validates and adds a service proposal', () => {
  const service = validateService(new URLSearchParams({
    name: 'New Service',
    category: 'streaming',
    description: 'A managed service for streaming events.',
    url: 'https://example.com',
    image: '/img/services/new-service.svg',
  }));
  const updated = addService(catalog, service);
  assert.match(updated, /New Service/);
  assert.match(updated, /new-service\.svg/);
  assert.match(updated, /Existing Service/);
});

test('rejects invalid values and duplicate service names', () => {
  assert.throws(() => validateService(new URLSearchParams({
    name: 'Bad Category',
    category: 'unknown',
    description: 'A managed service description.',
  })), /valid category/);
  assert.throws(() => validateService(new URLSearchParams({
    name: 'Unsafe URL',
    category: 'databases',
    description: 'A managed service description.',
    url: 'http://example.com',
  })), /https/);
  assert.throws(() => addService(catalog, {name: 'Existing Service'}), /already exists/);
});