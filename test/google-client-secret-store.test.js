const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { GoogleClientSecretStore } = require('../src/storage/google-client-secret-store');

const fakeSafeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: (value) => Buffer.from(value.split('').reverse().join('')),
  decryptString: (value) => value.toString().split('').reverse().join(''),
};

test('client secret Google disimpan terenkripsi dan terikat client ID', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-google-client-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'credential.json');
  const store = new GoogleClientSecretStore(target, fakeSafeStorage);
  await store.save('client-1', 'secret-value');
  assert.equal((await fs.readFile(target, 'utf8')).includes('secret-value'), false);
  assert.equal(await store.load('client-1'), 'secret-value');
  assert.equal(await store.load('client-lain'), '');
});
