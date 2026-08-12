const fs = require('node:fs/promises');
const path = require('node:path');

class GoogleClientSecretStore {
  constructor(filePath, safeStorage) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
  }

  async save(clientId, clientSecret) {
    if (!this.safeStorage?.isEncryptionAvailable()) throw new Error('Penyimpanan aman Windows tidak tersedia.');
    const value = JSON.stringify({ clientId, clientSecret, savedAt: new Date().toISOString() });
    const encrypted = this.safeStorage.encryptString(value).toString('base64');
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify({ version: 1, encrypted }), { encoding: 'utf8', mode: 0o600 });
  }

  async load(clientId) {
    if (!this.safeStorage?.isEncryptionAvailable()) return '';
    try {
      const file = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
      const value = JSON.parse(this.safeStorage.decryptString(Buffer.from(file.encrypted, 'base64')));
      return value.clientId === clientId ? String(value.clientSecret || '') : '';
    } catch (error) {
      if (error.code === 'ENOENT') return '';
      throw new Error('Credential Google lokal tidak dapat dibuka. Impor ulang credential Google.');
    }
  }
}

module.exports = { GoogleClientSecretStore };
