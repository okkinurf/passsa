const fs = require('node:fs/promises');
const path = require('node:path');

class DirectLoginStore {
  constructor(filePath, safeStorage) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
  }

  assertAvailable() {
    if (!this.safeStorage?.isEncryptionAvailable?.()) {
      throw new Error('Penyimpanan aman Windows tidak tersedia untuk login langsung.');
    }
  }

  async read() {
    try {
      const value = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
      return value && typeof value === 'object' ? value : { version: 1, activeUserId: null, users: {} };
    } catch (error) {
      if (error.code === 'ENOENT') return { version: 1, activeUserId: null, users: {} };
      throw error;
    }
  }

  async write(value) {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, `${JSON.stringify(value)}\n`, { encoding: 'utf8', mode: 0o600 });
  }

  async save(user, key, kdf) {
    this.assertAvailable();
    if (!user?.id || !Buffer.isBuffer(key) || key.length !== 32) {
      throw new Error('Data login langsung tidak lengkap.');
    }
    const payload = JSON.stringify({ userId: user.id, key: key.toString('base64') });
    const encryptedKey = this.safeStorage.encryptString(payload).toString('base64');
    const data = await this.read();
    data.version = 1;
    data.users = {
      [user.id]: {
        username: user.username || user.email,
        encryptedKey,
        kdf,
        updatedAt: new Date().toISOString(),
      },
    };
    data.activeUserId = user.id;
    await this.write(data);
  }

  async getActive() {
    const data = await this.read();
    const userId = String(data.activeUserId || '');
    const record = userId ? data.users?.[userId] : null;
    return record ? { userId, ...record } : null;
  }

  decrypt(record) {
    this.assertAvailable();
    if (!record?.encryptedKey || !record?.userId) throw new Error('Login langsung belum dikonfigurasi.');
    const payload = JSON.parse(this.safeStorage.decryptString(Buffer.from(record.encryptedKey, 'base64')));
    const key = Buffer.from(String(payload.key || ''), 'base64');
    if (payload.userId !== record.userId || key.length !== 32) {
      key.fill(0);
      throw new Error('Kunci login langsung tidak valid.');
    }
    return key;
  }

  async clear(userId = null) {
    const data = await this.read();
    const targetId = String(userId || data.activeUserId || '');
    if (targetId && data.users) delete data.users[targetId];
    if (!data.users || Object.keys(data.users).length === 0) {
      data.users = {};
      data.activeUserId = null;
    } else if (data.activeUserId === targetId) {
      data.activeUserId = Object.keys(data.users)[0];
    }
    await this.write(data);
    return Boolean(targetId);
  }
}

module.exports = { DirectLoginStore };
