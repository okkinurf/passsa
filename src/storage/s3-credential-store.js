const fs = require('node:fs/promises');
const path = require('node:path');

class S3CredentialStore {
  constructor(filePath, safeStorage) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
  }

  async readCredentials() {
    if (!this.safeStorage?.isEncryptionAvailable()) return {};
    try {
      const file = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
      const value = JSON.parse(this.safeStorage.decryptString(Buffer.from(file.encrypted, 'base64')));
      return value.version === 1 && value.credentials && typeof value.credentials === 'object'
        ? value.credentials
        : {};
    } catch (error) {
      if (error.code === 'ENOENT') return {};
      throw new Error('Kredensial S3 lokal tidak dapat dibuka. Hubungkan ulang S3.');
    }
  }

  async writeCredentials(credentials) {
    if (!this.safeStorage?.isEncryptionAvailable()) {
      throw new Error('Penyimpanan aman Windows tidak tersedia; kredensial S3 tidak disimpan.');
    }
    const encrypted = this.safeStorage.encryptString(JSON.stringify({ version: 1, credentials })).toString('base64');
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify({ version: 1, encrypted }), { encoding: 'utf8', mode: 0o600 });
  }

  async save(email, config) {
    const key = String(email || '').trim().toLowerCase();
    if (!key) throw new Error('Akun vault lokal tidak tersedia.');
    const credentials = await this.readCredentials();
    credentials[key] = config;
    await this.writeCredentials(credentials);
  }

  async load(email) {
    if (!this.safeStorage?.isEncryptionAvailable()) return null;
    const key = String(email || '').trim().toLowerCase();
    if (!key) return null;
    const credentials = await this.readCredentials();
    return credentials[key] || null;
  }

  async clear(email) {
    const key = String(email || '').trim().toLowerCase();
    const credentials = await this.readCredentials();
    if (!key) {
      await fs.unlink(this.filePath).catch((error) => { if (error.code !== 'ENOENT') throw error; });
      return;
    }
    delete credentials[key];
    if (Object.keys(credentials).length) await this.writeCredentials(credentials);
    else await fs.unlink(this.filePath).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

module.exports = { S3CredentialStore };
