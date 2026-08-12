const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { GoogleTokenStore } = require('../src/storage/google-token-store');

const fakeSafeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: (value) => Buffer.from(value.split('').reverse().join('')),
  decryptString: (value) => value.toString().split('').reverse().join(''),
};

test('token Google tersimpan dalam bentuk terenkripsi dan terikat email', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-token-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'token.json');
  const store = new GoogleTokenStore(target, fakeSafeStorage);
  await store.save('okki@example.test', { refresh_token: 'very-secret' });
  const raw = await fs.readFile(target, 'utf8');
  assert.equal(raw.includes('very-secret'), false);
  assert.equal((await store.load('okki@example.test')).refresh_token, 'very-secret');
  assert.equal(await store.load('other@example.test'), null);
});
