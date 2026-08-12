const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { AtomicJsonStore } = require('../src/storage/atomic-json-store');
const { AuthService } = require('../src/services/auth-service');
const { VaultService } = require('../src/services/vault-service');

test('item baru tetap tersimpan setelah service ditutup dan dibuka kembali', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-persistence-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const authPath = path.join(directory, 'auth.json');
  const vaultPath = path.join(directory, 'vault.json');
  const password = 'password-vault-qa';
  const secret = 'secret-yang-harus-terenkripsi';

  const authStore = new AtomicJsonStore(authPath, () => ({ version: 1, users: [] }));
  const vaultStore = new AtomicJsonStore(vaultPath, () => ({ version: 1, vaults: {} }));
  const firstAuth = new AuthService(authStore);
  const firstVault = new VaultService(vaultStore, firstAuth);
  assert.equal((await firstAuth.register({ email: 'qa-persistence', password })).ok, true);
  await firstVault.configureKey(password);
  const created = await firstVault.add({
    title: 'Item Persistensi QA', username: 'qa-user', password: secret,
    url: 'https://example.test', group: 'Internet/QA', notes: 'Harus tetap ada setelah restart.', tags: 'qa, persistence',
  });
  firstAuth.logout();

  const rawVault = await fs.readFile(vaultPath, 'utf8');
  assert.equal(rawVault.includes(secret), false, 'Password bocor sebagai plaintext di file vault.');
  assert.equal(rawVault.includes('Item Persistensi QA'), false, 'Nama item bocor sebagai plaintext di file vault.');

  const reopenedAuth = new AuthService(new AtomicJsonStore(authPath, () => ({ version: 1, users: [] })));
  const reopenedVault = new VaultService(new AtomicJsonStore(vaultPath, () => ({ version: 1, vaults: {} })), reopenedAuth);
  assert.equal((await reopenedAuth.login({ email: 'qa-persistence', password })).ok, true);
  await reopenedVault.configureKey(password);
  const reopened = await reopenedVault.getForEditing(created.item.id);
  assert.equal(reopened.title, 'Item Persistensi QA');
  assert.equal(reopened.username, 'qa-user');
  assert.equal(reopened.password, secret);
  assert.deepEqual(reopened.tags, ['qa', 'persistence']);
});
