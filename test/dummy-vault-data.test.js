const test = require('node:test');
const assert = require('node:assert/strict');
const { createDummyVaultData, DUMMY_SOURCE } = require('../src/dev/dummy-vault-data');

test('development dummy dataset has 200 varied entries covering PassSa features', () => {
  const { items, categories } = createDummyVaultData();
  const counts = items.reduce((result, item) => {
    result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {});

  assert.equal(items.length, 200);
  assert.deepEqual(counts, { login: 120, 'secure-note': 40, authenticator: 40 });
  assert.equal(new Set(items.map((item) => item.id)).size, 200);
  assert.ok(items.every((item) => item.source === DUMMY_SOURCE));
  assert.ok(items.every((item) => item.title && item.tags.length && item.group));

  const credentials = items.filter((item) => item.type === 'login');
  assert.ok(credentials.every((item) => item.password.startsWith('Demo-Only!')));
  assert.ok(credentials.some((item) => item.history.length > 0));
  const fieldTypes = new Set(credentials.flatMap((item) => item.fields.map((field) => field.type)));
  assert.deepEqual(fieldTypes, new Set(['secret', 'text', 'boolean', 'url', 'email', 'number']));

  const notes = items.filter((item) => item.type === 'secure-note');
  assert.ok(notes.every((item) => item.noteHistory.length > 0 && item.notes.includes('dummy')));
  assert.ok(notes.some((item) => item.notes.includes('```')));
  assert.ok(notes.some((item) => item.notes.includes('| ---')));

  const authenticators = items.filter((item) => item.type === 'authenticator');
  assert.ok(authenticators.every((item) => /^[A-Z2-7]+$/.test(item.totp.secret)));
  assert.ok(new Set(authenticators.map((item) => item.totp.algorithm)).size > 1);
  assert.ok(authenticators.some((item) => item.totp.digits === 8));
  assert.ok(new Set(authenticators.map((item) => item.totp.period)).size > 1);

  assert.ok(items.some((item) => item.favorite));
  assert.ok(items.some((item) => item.quickPinned));
  assert.ok(items.some((item) => item.usageCount > 0 && item.recentUseHistory.length > 0));
  assert.ok(items.some((item) => item.deletedAt));
  assert.ok(categories.length >= 10);
});
