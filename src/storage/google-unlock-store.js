const fs = require('node:fs/promises');
const path = require('node:path');

class GoogleUnlockStore {
  constructor(filePath, safeStorage) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
  }

  async save(googleEmail, unlock) {
    if (!this.safeStorage?.isEncryptionAvailable()) throw new Error('Penyimpanan aman Windows tidak tersedia.');
    const value = JSON.stringify({ googleEmail: String(googleEmail).toLowerCase(), unlock, savedAt: new Date().toISOString() });
    const encrypted = this.safeStorage.encryptString(value).toString('base64');
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify({ version: 1, encrypted }), { encoding: 'utf8', mode: 0o600 });
  }

  async load(googleEmail) {
    if (!this.safeStorage?.isEncryptionAvailable()) return null;
    try {
      const file = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
      const value = JSON.parse(this.safeStorage.decryptString(Buffer.from(file.encrypted, 'base64')));
      return value.googleEmail === String(googleEmail).toLowerCase() ? value.unlock : null;
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw new Error('Data auto-login Google tidak dapat dibuka.');
    }
  }

  async clear() {
    await fs.unlink(this.filePath).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

module.exports = { GoogleUnlockStore };
