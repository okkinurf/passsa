const fs = require('node:fs/promises');
const path = require('node:path');

class GoogleTokenStore {
  constructor(filePath, safeStorage) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
  }

  async save(email, tokens) {
    if (!this.safeStorage?.isEncryptionAvailable()) throw new Error('Penyimpanan aman Windows tidak tersedia; token Google tidak disimpan.');
    const value = JSON.stringify({ email: String(email).toLowerCase(), tokens, savedAt: new Date().toISOString() });
    const encrypted = this.safeStorage.encryptString(value).toString('base64');
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify({ version: 1, encrypted }), { encoding: 'utf8', mode: 0o600 });
  }

  async load(email) {
    if (!this.safeStorage?.isEncryptionAvailable()) return null;
    try {
      const file = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
      const value = JSON.parse(this.safeStorage.decryptString(Buffer.from(file.encrypted, 'base64')));
      return value.email === String(email).toLowerCase() ? value.tokens : null;
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw new Error('Token Google tidak dapat dibuka. Silakan login Google kembali.');
    }
  }

  async clear() {
    await fs.unlink(this.filePath).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

module.exports = { GoogleTokenStore };
