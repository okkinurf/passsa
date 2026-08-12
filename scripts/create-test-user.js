const { app } = require('electron');
const crypto = require('node:crypto');
const path = require('node:path');
const { AtomicJsonStore } = require('../src/storage/atomic-json-store');
const {
  normalizeEmail,
  validateCredentials,
  hashPassword,
} = require('../src/auth-crypto');

// Script Electron mandiri memakai nama "Electron" secara default. Samakan
// dengan aplikasi utama supaya keduanya membaca folder userData yang sama.
app.setName('passsa');

async function main() {
  const username = normalizeEmail(process.env.PASSA_TEST_USERNAME);
  const password = process.env.PASSA_TEST_PASSWORD ?? '';
  const validationError = validateCredentials(username, password);
  if (validationError) throw new Error(validationError);

  const store = new AtomicJsonStore(path.join(app.getPath('userData'), 'auth.json'), () => ({ version: 1, users: [] }));
  const passwordData = await hashPassword(password);
  await store.update((auth) => {
    auth.users ||= [];
    const existing = auth.users.find((user) => user.email === username);
    if (existing) {
      existing.salt = passwordData.salt;
      existing.passwordHash = passwordData.hash;
      existing.passwordKdf = passwordData.kdf;
      existing.vaultSalt ??= crypto.randomBytes(32).toString('base64');
      existing.updatedAt = new Date().toISOString();
    } else {
      auth.users.push({
        id: crypto.randomUUID(), email: username, salt: passwordData.salt,
        passwordHash: passwordData.hash, passwordKdf: passwordData.kdf,
        vaultSalt: crypto.randomBytes(32).toString('base64'), createdAt: new Date().toISOString(),
      });
    }
    return auth;
  });
  console.log(`Akun testing '${username}' siap digunakan.`);
}

app.whenReady()
  .then(main)
  .then(() => app.quit())
  .catch((error) => {
    console.error(error.message);
    app.exit(1);
  });
