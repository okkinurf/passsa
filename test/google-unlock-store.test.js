const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { GoogleUnlockStore } = require('../src/storage/google-unlock-store');

const fakeSafeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: (value) => Buffer.from(value.split('').reverse().join('')),
  decryptString: (value) => value.toString().split('').reverse().join(''),
};

test('auto-login Google menyimpan credential vault hanya dalam bentuk terenkripsi', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-google-unlock-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'unlock.json');
  const store = new GoogleUnlockStore(target, fakeSafeStorage);
  await store.save('google@example.test', { localIdentifier: 'okki', password: 'vault-secret' });
  const raw = await fs.readFile(target, 'utf8');
  assert.equal(raw.includes('vault-secret'), false);
  assert.equal((await store.load('google@example.test')).localIdentifier, 'okki');
  assert.equal(await store.load('other@example.test'), null);
});
