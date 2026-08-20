const test = require('node:test');
const assert = require('node:assert/strict');
const { buildEntry, normalizeEntry, normalizeTags, normalizeCustomFields, MAX_HISTORY } = require('../src/core/vault-entry');

test('entry lama dinormalisasi tanpa menghilangkan data', () => {
  const old = { id: '1', title: 'Lama', password: 'secret', username: '', url: '', notes: '' };
  const normalized = normalizeEntry(old);
  assert.equal(normalized.group, 'Umum');
  assert.equal(normalized.favorite, false);
  assert.equal(normalized.deletedAt, null);
  assert.deepEqual(normalized.history, []);
  assert.deepEqual(normalized.tags, []);
  assert.equal(normalized.usageCount, 0);
  assert.equal(normalized.lastUsedAt, null);
});

test('tags dinormalisasi, dideduplikasi, dan dibatasi', () => {
  assert.deepEqual(normalizeTags('Kerja, penting, kerja,  Email  '), ['Kerja', 'penting', 'Email']);
});

test('custom fields fleksibel dinormalisasi dan dibatasi tanpa menghilangkan tipe', () => {
  const fields = normalizeCustomFields([
    { id: 'pin', label: ' PIN ', type: 'secret', value: '1234' },
    { id: 'enabled', label: 'Aktif', type: 'boolean', value: 'true' },
    { id: 'pin-duplicate', label: 'pin', type: 'text', value: 'lain' },
  ]);
  assert.deepEqual(fields.map(({ label, type, value }) => ({ label, type, value })), [
    { label: 'PIN', type: 'secret', value: '1234' },
    { label: 'Aktif', type: 'boolean', value: true },
  ]);
});

test('secure note tidak memerlukan password login dan tetap menyimpan fields', () => {
  const note = buildEntry({ type: 'secure-note', title: 'Kode pemulihan', notes: 'Simpan offline.', fields: [{ label: 'Kode', type: 'secret', value: 'ABC' }] });
  assert.equal(note.type, 'secure-note');
  assert.equal(note.password, '');
  assert.equal(note.fields[0].value, 'ABC');
});

test('perubahan entry menyimpan versi sebelumnya dalam history', () => {
  const first = buildEntry({ title: 'Gmail', password: 'first' });
  const metadataOnly = buildEntry({ ...first, title: 'Gmail Baru' }, first);
  assert.equal(metadataOnly.history.length, 0);
  const second = buildEntry({ ...metadataOnly, password: 'second' }, metadataOnly);
  assert.equal(second.history.length, 1);
  assert.equal(second.history[0].password, 'first');
  assert.equal(second.id, first.id);
});

test('history dibatasi agar vault tidak tumbuh tanpa batas', () => {
  let entry = buildEntry({ title: 'Item', password: 'version-0' });
  for (let index = 1; index <= MAX_HISTORY + 4; index += 1) {
    entry = buildEntry({ ...entry, password: `version-${index}` }, entry);
  }
  assert.equal(entry.history.length, MAX_HISTORY);
  assert.equal(entry.history.at(-1).password, `version-${MAX_HISTORY + 3}`);
});
