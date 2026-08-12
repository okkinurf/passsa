const test = require('node:test');
const assert = require('node:assert/strict');
const { DriveSyncService } = require('../src/services/drive-sync-service');

class MemoryStore {
  constructor(value) { this.value = structuredClone(value); }
  async read() { return structuredClone(this.value); }
  async update(mutator) { this.value = await mutator(structuredClone(this.value)); return this.read(); }
}

function snapshot(ciphertext = 'local') {
  return { schemaVersion: 1, email: 'okki@example.test', vaultSalt: 'c2FsdA==', envelope: { ciphertext, nonce: 'n', tag: 't', kdf: { version: 2 } } };
}

test('sync pertama mengunggah snapshot terenkripsi ke appDataFolder', async () => {
  let uploaded;
  const service = new DriveSyncService({
    driveClient: {
      listVaultFiles: async () => [],
      createJson: async (_email, name, value) => { uploaded = { name, value }; return { id: 'drive-1' }; },
    },
    vaultService: { exportEncryptedSnapshot: async () => snapshot(), isEmpty: async () => false },
    stateStore: new MemoryStore({ users: {} }),
  });
  const result = await service.sync({ password: 'password' });
  assert.equal(result.status, 'uploaded');
  assert.equal(uploaded.name, 'passsa-vault.json');
  assert.equal(uploaded.value.envelope.ciphertext, 'local');
});

test('perubahan dua arah membuat backup konflik tanpa menimpa remote utama', async () => {
  const state = new MemoryStore({ users: { 'okki@example.test': { localHash: 'old-local', remoteHash: 'old-remote' } } });
  const created = [];
  const service = new DriveSyncService({
    driveClient: {
      listVaultFiles: async () => [{ id: 'drive-main' }],
      downloadJson: async () => ({ ...snapshot('remote-new'), revision: 3 }),
      createJson: async (_email, name, value) => { created.push({ name, value }); return { id: 'backup' }; },
      updateJson: async () => { throw new Error('remote utama tidak boleh ditimpa'); },
    },
    vaultService: { exportEncryptedSnapshot: async () => snapshot('local-new'), isEmpty: async () => false },
    stateStore: state,
    now: () => new Date('2026-07-24T00:00:00.000Z'),
  });
  const result = await service.sync({ password: 'password' });
  assert.equal(result.status, 'conflict');
  assert.match(created[0].name, /passsa-vault-conflict/);
});

test('baseline sinkron tidak dianggap konflik walau enkripsi lokal dan remote berbeda', async () => {
  const { contentHash } = require('../src/services/drive-sync-service');
  const local = snapshot('local-reencrypted');
  const remote = { ...snapshot('remote-original'), revision: 2 };
  const state = new MemoryStore({ users: { 'okki@example.test': { localHash: contentHash(local), remoteHash: contentHash(remote) } } });
  let backupCreated = false;
  const service = new DriveSyncService({
    driveClient: {
      listVaultFiles: async () => [{ id: 'drive-main' }],
      downloadJson: async () => remote,
      createJson: async () => { backupCreated = true; },
    },
    vaultService: { exportEncryptedSnapshot: async () => local, isEmpty: async () => false },
    stateStore: state,
  });
  assert.equal((await service.sync()).status, 'current');
  assert.equal(backupCreated, false);
});
