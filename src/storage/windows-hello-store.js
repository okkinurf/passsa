class WindowsHelloStore {
  constructor(filePath, safeStorage, fsPromises) {
    this.filePath = filePath;
    this.safeStorage = safeStorage;
    this.fs = fsPromises;
  }

  async read() {
    try {
      const text = await this.fs.readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' ? parsed : { version: 1, users: {} };
    } catch (error) {
      if (error.code === 'ENOENT') return { version: 1, users: {} };
      throw error;
    }
  }

  async write(value) {
    await this.fs.mkdir(require('node:path').dirname(this.filePath), { recursive: true });
    await this.fs.writeFile(this.filePath, `${JSON.stringify(value)}\n`, { encoding: 'utf8', mode: 0o600 });
  }

  async get(userId) {
    const file = await this.read();
    return file.users?.[userId] ?? null;
  }

  async save(user, key, kdf) {
    if (!this.safeStorage?.isEncryptionAvailable?.()) throw new Error('Perlindungan perangkat Windows belum tersedia.');
    const keyBuffer = Buffer.from(key);
    try {
      const encrypted = this.safeStorage.encryptString(keyBuffer.toString('base64'));
      const file = await this.read();
      file.version = 1;
      file.users ||= {};
      file.users[user.id] = {
        email: user.email,
        encryptedKey: encrypted.toString('base64'),
        kdf,
        updatedAt: new Date().toISOString(),
      };
      await this.write(file);
    } finally {
      keyBuffer.fill(0);
    }
  }

  decrypt(record) {
    if (!record?.encryptedKey) throw new Error('Unlock Windows Hello belum dikonfigurasi.');
    const encoded = this.safeStorage.decryptString(Buffer.from(record.encryptedKey, 'base64'));
    const key = Buffer.from(encoded, 'base64');
    if (key.length !== 32) {
      key.fill(0);
      throw new Error('Kunci Windows Hello tidak valid.');
    }
    return key;
  }

  async clear(userId) {
    const file = await this.read();
    if (!file.users?.[userId]) return false;
    delete file.users[userId];
    await this.write(file);
    return true;
  }
}

module.exports = { WindowsHelloStore };
