const test = require('node:test');
const assert = require('node:assert/strict');
const { S3SyncService, normalizeConfig } = require('../src/services/s3-sync-service');

const config = {
  region: 'us-east-1', bucket: 'passsa-test', prefix: 'PassSa',
  accessKeyId: 'AKIA1234', secretAccessKey: 'super-secret', endpoint: '', sessionToken: '',
};

function memoryStore(initial = { version: 1, users: {} }) {
  let value = structuredClone(initial);
  return {
    read: async () => structuredClone(value),
    update: async (mutator) => { value = await mutator(structuredClone(value)); return structuredClone(value); },
  };
}

function createVault(snapshot, { empty = false } = {}) {
  let current = structuredClone(snapshot);
  return {
    exportEncryptedSnapshot: async () => structuredClone(current),
    isEmpty: async () => empty,
    importEncryptedSnapshot: async (remote) => { current = structuredClone(remote); },
    setSnapshot: (next) => { current = structuredClone(next); },
  };
}

function snapshot(ciphertext) {
  return { email: 'okki@example.test', schemaVersion: 1, vaultSalt: 'salt', envelope: { ciphertext } };
}

function createObjectClient({ remote = null } = {}) {
  const writes = [];
  const objects = new Map();
  const client = {
    verifyBucket: async () => undefined,
    getJson: async (_bucket, key) => {
      const value = objects.get(key) || remote;
      if (!value) throw Object.assign(new Error('missing'), { name: 'NoSuchKey', $metadata: { httpStatusCode: 404 } });
      return { value: structuredClone(value), etag: 'etag' };
    },
    putJson: async (_bucket, key, value) => { writes.push({ key, value: structuredClone(value) }); objects.set(key, structuredClone(value)); remote = null; },
    close: () => undefined,
    writes,
    getRemote: (key) => structuredClone(objects.get(key) || remote),
    setRemote: (value, key) => { if (key) objects.set(key, structuredClone(value)); else remote = structuredClone(value); },
  };
  return client;
}

test('S3 hanya menyimpan konfigurasi setelah bucket berhasil diuji; kredensial tak dikembalikan', async () => {
  const vault = createVault(snapshot('local'));
  let saved = null;
  let verified = false;
  const client = createObjectClient();
  client.verifyBucket = async (bucket) => { verified = bucket === config.bucket; };
  const service = new S3SyncService({
    vaultService: vault,
    credentialStore: { save: async (_email, value) => { assert.equal(verified, true); saved = value; }, load: async () => saved },
    stateStore: memoryStore(),
    clientFactory: () => client,
  });

  const result = await service.connect(config);

  assert.equal(result.ok, true);
  assert.equal(result.config.accessKeyHint, '1234');
  assert.equal(JSON.stringify(result).includes(config.secretAccessKey), false);
  assert.equal(saved.secretAccessKey, config.secretAccessKey);
  assert.match(result.message, /belum diunggah/);
});

test('sinkronisasi pertama mengunggah snapshot terenkripsi ke jalur tanpa email mentah', async () => {
  const vault = createVault(snapshot('ciphertext'));
  const client = createObjectClient();
  const service = new S3SyncService({
    vaultService: vault,
    credentialStore: { load: async () => config },
    stateStore: memoryStore(),
    clientFactory: () => client,
    now: () => new Date('2026-10-03T00:00:00.000Z'),
  });

  const result = await service.sync();

  assert.equal(result.status, 'uploaded');
  assert.equal(client.writes.length, 1);
  assert.match(client.writes[0].key, /^PassSa\/vaults\/[a-f0-9]{24}\/passsa-vault\.json$/);
  assert.equal(client.writes[0].key.includes('okki'), false);
  assert.equal(client.writes[0].value.envelope.ciphertext, 'ciphertext');
});

test('vault lokal kosong mengunduh snapshot S3 terenkripsi', async () => {
  const remote = { ...snapshot('remote-ciphertext'), revision: 4 };
  const vault = createVault(snapshot('empty'), { empty: true });
  const client = createObjectClient({ remote });
  const service = new S3SyncService({
    vaultService: vault,
    credentialStore: { load: async () => config },
    stateStore: memoryStore(),
    clientFactory: () => client,
  });

  const result = await service.sync();

  assert.equal(result.status, 'downloaded');
  assert.equal((await vault.exportEncryptedSnapshot()).envelope.ciphertext, 'remote-ciphertext');
  assert.equal(client.writes.length, 0);
});

test('perangkat baru meminta password vault untuk membuka dan membungkus ulang snapshot', async () => {
  let local = snapshot('empty-local');
  const remote = { ...snapshot('encrypted-on-device-a'), revision: 2 };
  const vault = {
    exportEncryptedSnapshot: async () => structuredClone(local),
    isEmpty: async () => true,
    importEncryptedSnapshot: async (value, password) => {
      if (!password) throw new Error('Password vault diperlukan untuk membuka data Google Drive.');
      if (password !== 'correct-local-password') throw new Error('Password vault tidak dapat membuka data Google Drive.');
      local = structuredClone(value);
    },
  };
  const client = createObjectClient({ remote });
  const service = new S3SyncService({
    vaultService: vault,
    credentialStore: { load: async () => config },
    stateStore: memoryStore(),
    clientFactory: () => client,
  });

  const prompt = await service.sync();
  assert.equal(prompt.status, 'requires-password');
  await assert.rejects(service.sync({ password: 'wrong-password' }), /Password vault tidak dapat membuka snapshot S3/);
  const result = await service.sync({ password: 'correct-local-password' });

  assert.equal(result.status, 'downloaded');
  assert.equal((await vault.exportEncryptedSnapshot()).envelope.ciphertext, 'encrypted-on-device-a');
});

test('konflik menyimpan backup tanpa menimpa snapshot utama', async () => {
  const vault = createVault(snapshot('version-1'));
  const client = createObjectClient();
  const stateStore = memoryStore();
  const service = new S3SyncService({
    vaultService: vault,
    credentialStore: { load: async () => config },
    stateStore,
    clientFactory: () => client,
    now: () => new Date('2026-10-03T00:00:00.000Z'),
  });
  await service.sync();
  const mainKey = client.writes[0].key;
  const originalMainObject = client.getRemote(mainKey);
  client.setRemote({ ...snapshot('remote-version'), revision: 2 }, mainKey);
  vault.setSnapshot(snapshot('local-version'));

  const result = await service.sync();

  assert.equal(result.status, 'conflict');
  assert.equal(client.getRemote(mainKey).envelope.ciphertext, 'remote-version');
  assert.equal(client.writes.length, 2);
  assert.match(client.writes[1].key, /conflicts\/passsa-vault-conflict-/);
  assert.equal(originalMainObject.envelope.ciphertext, 'version-1');
});

test('validasi endpoint melarang HTTP publik dan kredensial dalam URL', () => {
  assert.throws(() => normalizeConfig({ ...config, endpoint: 'http://s3.example.test' }), /HTTPS/);
  assert.throws(() => normalizeConfig({ ...config, endpoint: 'https://user:pass@s3.example.test' }), /tidak boleh memuat/);
  assert.equal(normalizeConfig({ ...config, endpoint: 'http://localhost:9000' }).endpoint, 'http://localhost:9000');
});
