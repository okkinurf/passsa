const test = require('node:test');
const assert = require('node:assert/strict');
const {
  csvToDocument,
  decryptExport,
  documentToCsv,
  encryptExport,
  mergeDocuments,
} = require('../src/services/vault-transfer-service');

const document = {
  version: 2,
  categories: [{ id: 'cat-1', name: 'Internet', path: 'Internet', parentPath: '', icon: 'globe' }],
  items: [{
    id: 'item-1',
    title: 'Mail, kantor',
    username: 'okki@example.test',
    password: 'secret-export',
    url: 'https://mail.example.test',
    notes: 'Catatan\nrahasia',
    group: 'Internet',
    tags: ['kerja', 'demo'],
    favorite: true,
    history: [{ password: 'old-secret', savedAt: '2026-01-01T00:00:00.000Z' }],
    deletedAt: null,
  }],
};

test('backup PassSa terenkripsi dapat dipulihkan tanpa membuka plaintext', async () => {
  const exported = await encryptExport(document, 'backup-password');
  assert.equal(exported.format, 'passsa');
  assert.equal(exported.ciphertext.includes('secret-export'), false);
  assert.equal((await decryptExport(exported, 'backup-password')).items[0].password, 'secret-export');
  await assert.rejects(() => decryptExport(exported, 'password-salah'), /Password backup salah/);
});

test('CSV portable menjaga field umum dan escaping', () => {
  const csv = documentToCsv(document);
  assert.match(csv, /"Mail, kantor"/);
  const imported = csvToDocument(csv);
  assert.equal(imported.items.length, 1);
  assert.equal(imported.items[0].password, 'secret-export');
  assert.equal(imported.items[0].notes, 'Catatan\nrahasia');
  assert.deepEqual(imported.items[0].tags, ['kerja', 'demo']);
});

test('CSV portable membawa authenticator tanpa mengubah secret menjadi field login', () => {
  const csv = documentToCsv({
    version: 2,
    categories: [],
    items: [{
      title: 'GitHub 2FA',
      type: 'authenticator',
      username: '',
      password: '',
      url: '',
      notes: '',
      group: 'Internet',
      tags: [],
      favorite: false,
      totp: {
        secret: 'JBSWY3DPEHPK3PXP',
        issuer: 'GitHub',
        account: 'okki@example.test',
        algorithm: 'sha1',
        digits: 6,
        period: 30,
      },
    }],
  });
  const imported = csvToDocument(csv);
  assert.equal(imported.items[0].type, 'authenticator');
  assert.equal(imported.items[0].password, '');
  assert.equal(imported.items[0].totp.secret, 'JBSWY3DPEHPK3PXP');
  assert.equal(imported.items[0].totp.account, 'okki@example.test');
});

test('merge import melewati duplikat berdasarkan title, username, dan website', () => {
  const merged = mergeDocuments(document, document, 'merge');
  assert.equal(merged.added, 0);
  assert.equal(merged.skipped, 1);
  assert.equal(merged.document.items.length, 1);
});
