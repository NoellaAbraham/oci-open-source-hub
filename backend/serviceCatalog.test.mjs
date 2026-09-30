import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {addService, removeTestService, testServices, validateService} from './serviceCatalog.mjs';

const original = `export const services = [\n  {name: 'Existing Service', categories: ['databases'], description: 'Keep this entry.'},\n];\n`;

function form(values) {
  return new URLSearchParams(values);
}

test('validates normal and test service submissions', () => {
  const ordinary = validateService(form({name: 'New Service', category: 'streaming', description: 'A useful managed streaming service.'}));
  assert.deepEqual(ordinary.categories, ['streaming']);
  assert.equal(ordinary.testOnly, undefined);
  const temporary = validateService(form({name: '[TEST] Demo Service', category: 'search', description: 'Temporary service for a safe test.', testOnly: 'on'}));
  assert.equal(temporary.testOnly, true);
  assert.throws(() => validateService(form({name: 'Wrong label', category: 'search', description: 'Temporary service for a safe test.', testOnly: 'on'})), /start with \[TEST\]/);
});

test('adds an entry and deletes only that test entry', () => {
  const entry = validateService(form({name: '[TEST] Demo Service', category: 'search', description: 'Temporary service for a safe test.', testOnly: 'on'}));
  const added = addService(original, entry);
  assert.deepEqual(testServices(added), ['[TEST] Demo Service']);
  assert.match(added, /Existing Service/);
  assert.equal(removeTestService(added, entry.name), original);
});

test('blocks deletion of ordinary services and duplicate additions', () => {
  assert.throws(() => removeTestService(original, 'Existing Service'), /Only services created as test entries/);
  assert.throws(() => addService(original, {name: 'Existing Service', categories: ['databases'], description: 'Duplicate.'}), /already exists/);
});

test('round-trips a test service against the actual website catalog', async () => {
  const source = await readFile(new URL('../src/data/services.js', import.meta.url), 'utf8');
  const entry = validateService(form({name: '[TEST] Safe Catalog Check', category: 'databases', description: 'Temporary service for a safe catalog test.', testOnly: 'on'}));
  assert.equal(removeTestService(addService(source, entry), entry.name), source);
  assert.throws(() => removeTestService(source, 'OCI Cache'), /Only services created as test entries/);
});
