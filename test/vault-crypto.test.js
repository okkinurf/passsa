const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { encryptItems, decryptItems, encryptVaultData, decryptVaultData } = require('../src/vault-crypto');

test('item vault dapat dienkripsi dan didekripsi', () => {
  const key = crypto.randomBytes(32);
  const items = [{ id: '1', title: 'Gmail', username: 'user@test.com', password: 'secret' }];
  const encrypted = encryptItems(items, key);
  assert.equal(encrypted.ciphertext.includes('secret'), false);
  assert.deepEqual(decryptItems(encrypted, key), items);
});

test('vault yang dimodifikasi ditolak oleh authentication tag', () => {
  const key = crypto.randomBytes(32);
  const encrypted = encryptItems([{ password: 'secret' }], key);
  const bytes = Buffer.from(encrypted.ciphertext, 'base64');
  bytes[0] ^= 1;
  encrypted.ciphertext = bytes.toString('base64');
  assert.throws(() => decryptItems(encrypted, key));
});

test('vault tidak dapat dibuka menggunakan kunci lain', () => {
  const encrypted = encryptItems([{ password: 'secret' }], crypto.randomBytes(32));
  assert.throws(() => decryptItems(encrypted, crypto.randomBytes(32)));
});

test('format array lama dimigrasikan menjadi dokumen vault tanpa kehilangan item', () => {
  const key = crypto.randomBytes(32);
  const legacy = encryptItems([{ id: 'legacy' }], key);
  assert.deepEqual(decryptVaultData(legacy, key), {
    version: 2,
    items: [{ id: 'legacy' }],
    categories: [],
  });
  const modern = encryptVaultData({ items: [{ id: 'modern' }], categories: [{ id: 'cat' }] }, key);
  assert.equal(decryptVaultData(modern, key).categories[0].id, 'cat');
});
