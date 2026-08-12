const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

class AtomicJsonStore {
  constructor(filePath, fallbackFactory) {
    this.filePath = filePath;
    this.fallbackFactory = fallbackFactory;
    this.writeQueue = Promise.resolve();
  }

  async read() {
    return this.readUnlocked();
  }

  async readUnlocked() {
    try {
      return JSON.parse(await fs.readFile(this.filePath, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') return this.fallbackFactory();
      try {
        return JSON.parse(await fs.readFile(`${this.filePath}.bak`, 'utf8'));
      } catch {
        throw error;
      }
    }
  }

  async write(value) {
    const operation = this.writeQueue.then(async () => {
      await this.withFileLock(() => this.writeUnlocked(value));
    });
    this.writeQueue = operation.catch(() => undefined);
    return operation;
  }

  async update(mutator) {
    const operation = this.writeQueue.then(() => this.withFileLock(async () => {
      const current = await this.readUnlocked();
      const next = await mutator(structuredClone(current));
      const value = next === undefined ? current : next;
      await this.writeUnlocked(value);
      return structuredClone(value);
    }));
    this.writeQueue = operation.catch(() => undefined);
    return operation;
  }

  async writeUnlocked(value) {
    const temporary = `${this.filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      await fs.writeFile(temporary, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600 });
      try {
        await fs.copyFile(this.filePath, `${this.filePath}.bak`);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
      await fs.rename(temporary, this.filePath);
    } catch (error) {
      await fs.unlink(temporary).catch(() => undefined);
      throw error;
    }
  }

  async withFileLock(operation) {
    const lockPath = `${this.filePath}.lock`;
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const deadline = Date.now() + 10_000;
    let handle;
    while (!handle) {
      try {
        handle = await fs.open(lockPath, 'wx', 0o600);
        await handle.writeFile(JSON.stringify({ pid: process.pid, createdAt: new Date().toISOString() }));
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
        const stat = await fs.stat(lockPath).catch(() => null);
        if (stat && Date.now() - stat.mtimeMs > 30_000) await fs.unlink(lockPath).catch(() => undefined);
        if (Date.now() >= deadline) throw new Error(`Penyimpanan sedang digunakan proses lain: ${path.basename(this.filePath)}`);
        await new Promise((resolve) => setTimeout(resolve, 40));
      }
    }
    try {
      return await operation();
    } finally {
      await handle.close().catch(() => undefined);
      await fs.unlink(lockPath).catch(() => undefined);
    }
  }
}

module.exports = { AtomicJsonStore };
