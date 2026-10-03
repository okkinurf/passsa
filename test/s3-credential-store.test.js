const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { S3CredentialStore } = require('../src/storage/s3-credential-store');

const fakeSafeStorage = {
  isEncryptionAvailable: () => true,
  encryptString: (value) => Buffer.from(value.split('').reverse().join('')),
  decryptString: (value) => value.toString().split('').reverse().join(''),
};

test('kredensial S3 terenkripsi dan terisolasi per akun lokal', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-s3-credentials-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'credentials.json');
  const store = new S3CredentialStore(target, fakeSafeStorage);
  const config = { region: 'us-east-1', bucket: 'private-bucket', accessKeyId: 'AKIA1234', secretAccessKey: 'very-secret' };

  await store.save('Okki@example.test', config);

  const savedFile = await fs.readFile(target, 'utf8');
  assert.equal(savedFile.includes('very-secret'), false);
  assert.equal(savedFile.includes('AKIA1234'), false);
  assert.deepEqual(await store.load('okki@example.test'), config);
  assert.equal(await store.load('another@example.test'), null);
  await store.clear('OKKI@example.test');
  assert.equal(await store.load('okki@example.test'), null);
});

test('kredensial S3 tidak disimpan saat enkripsi OS tidak tersedia', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-s3-no-crypto-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const store = new S3CredentialStore(path.join(directory, 'credentials.json'), {
    isEncryptionAvailable: () => false,
  });
  await assert.rejects(store.save('okki@example.test', { secretAccessKey: 'secret' }), /Penyimpanan aman Windows tidak tersedia/);
});
