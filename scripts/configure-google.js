const { app, safeStorage } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { resolveGoogleClientId } = require('../src/google-client-config');
const { GoogleClientSecretStore } = require('../src/storage/google-client-secret-store');
const { GoogleUnlockStore } = require('../src/storage/google-unlock-store');
const { AtomicJsonStore } = require('../src/storage/atomic-json-store');
const { normalizeEmail, verifyPassword } = require('../src/auth-crypto');

app.setName('passsa');

async function configure() {
  const credentialPath = process.env.PASSA_GOOGLE_CREDENTIAL_FILE;
  if (!credentialPath) throw new Error('PASSA_GOOGLE_CREDENTIAL_FILE belum diisi.');
  const credential = JSON.parse(await fs.readFile(credentialPath, 'utf8'));
  const installed = credential.installed;
  if (!installed?.client_id || !installed?.client_secret) throw new Error('File bukan credential OAuth Desktop yang valid.');
  const expectedClientId = resolveGoogleClientId();
  if (installed.client_id !== expectedClientId) throw new Error('Client ID file tidak cocok dengan konfigurasi PassSa.');
  const store = new GoogleClientSecretStore(path.join(app.getPath('userData'), 'google-client-secret.json'), safeStorage);
  await store.save(installed.client_id, installed.client_secret);
  const googleEmail = normalizeEmail(process.env.PASSA_GOOGLE_EMAIL || '');
  const localIdentifier = normalizeEmail(process.env.PASSA_LOCAL_IDENTIFIER || '');
  const password = process.env.PASSA_LOCAL_PASSWORD || '';
  if (googleEmail && localIdentifier && password) {
    const authStore = new AtomicJsonStore(path.join(app.getPath('userData'), 'auth.json'), () => ({ version: 1, users: [] }));
    const auth = await authStore.read();
    const localUser = auth.users.find((user) => user.email === localIdentifier);
    if (!localUser || !(await verifyPassword(password, localUser))) throw new Error('Akun atau password vault lokal tidak valid.');
    const unlockStore = new GoogleUnlockStore(path.join(app.getPath('userData'), 'google-unlock.json'), safeStorage);
    await unlockStore.save(googleEmail, { localIdentifier, password });
  }
  console.log('Credential Google Desktop berhasil disimpan menggunakan Windows DPAPI.');
}

app.whenReady()
  .then(configure)
  .then(() => app.quit())
  .catch((error) => {
    console.error(error.message);
    app.exit(1);
  });
