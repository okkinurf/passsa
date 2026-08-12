const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { AuthService } = require('../src/services/auth-service');
const { VaultService } = require('../src/services/vault-service');
const { hashPassword, deriveVaultKey, LEGACY_KDF, CURRENT_KDF } = require('../src/auth-crypto');
const { encryptVaultData } = require('../src/vault-crypto');

class MemoryStore {
  constructor(value) { this.value = structuredClone(value); }
  async read() { return structuredClone(this.value); }
  async write(value) { this.value = structuredClone(value); }
  async update(mutator) { this.value = await mutator(structuredClone(this.value)); return this.read(); }
}

test('login lama memigrasikan hash dan enkripsi vault ke KDF terbaru', async () => {
  const password = 'password-testing';
  const passwordData = await hashPassword(password, undefined, LEGACY_KDF);
  const vaultSalt = crypto.randomBytes(32);
  const legacyKey = await deriveVaultKey(password, vaultSalt, LEGACY_KDF);
  const user = {
    id: 'legacy-user',
    email: 'legacy',
    salt: passwordData.salt,
    passwordHash: passwordData.hash,
    vaultSalt: vaultSalt.toString('base64'),
  };
  const authStore = new MemoryStore({ version: 1, users: [user] });
  const vaultStore = new MemoryStore({
    version: 1,
    vaults: {
      [user.id]: encryptVaultData({
        items: [{ id: 'item-1', title: 'Lama', password: 'secret' }],
        categories: [],
      }, legacyKey),
    },
  });
  legacyKey.fill(0);

  const auth = new AuthService(authStore);
  const vault = new VaultService(vaultStore, auth);
  assert.equal((await auth.login({ email: 'legacy', password })).ok, true);
  await vault.configureKey(password);
  assert.equal((await vault.list())[0].password, 'secret');
  assert.equal(await vault.upgradeKdf(password), true);
  assert.equal(vaultStore.value.vaults[user.id].kdf.version, CURRENT_KDF.version);
  assert.equal(authStore.value.users[0].passwordKdf.version, CURRENT_KDF.version);

  auth.logout();
  assert.equal((await auth.login({ email: 'legacy', password })).ok, true);
  await vault.configureKey(password);
  assert.equal((await vault.list())[0].title, 'Lama');
});

test('akun Google terikat ke subject stabil dan menolak subject berbeda', async () => {
  const store = new MemoryStore({ version: 1, users: [] });
  const auth = new AuthService(store);
  const input = { email: 'okki@example.test', password: 'password-testing', googleSub: 'google-sub-1' };
  const created = await auth.googleLogin(input);
  assert.equal(created.ok, true);
  assert.equal(created.user.provider, 'google');
  auth.logout();
  const rejected = await auth.googleLogin({ ...input, googleSub: 'google-sub-lain' });
  assert.equal(rejected.ok, false);
  assert.match(rejected.message, /tidak cocok/);
});

test('akun Google dapat membuka vault lokal yang sudah dipetakan tanpa membuat akun baru', async () => {
  const password = 'password-testing';
  const passwordData = await hashPassword(password);
  const store = new MemoryStore({ version: 1, users: [{
    id: 'local-okki', email: 'okki', salt: passwordData.salt, passwordHash: passwordData.hash,
    passwordKdf: passwordData.kdf, vaultSalt: crypto.randomBytes(32).toString('base64'),
  }] });
  const auth = new AuthService(store);
  const result = await auth.googleLogin({
    email: 'google@example.test', localIdentifier: 'okki', password, googleSub: 'google-sub-okki',
  });
  assert.equal(result.ok, true);
  assert.equal(result.user.id, 'local-okki');
  assert.equal(result.user.email, 'okki');
  assert.equal(result.user.googleEmail, 'google@example.test');
  assert.equal(store.value.users.length, 1);
  assert.equal(store.value.users[0].googleSub, 'google-sub-okki');
});
