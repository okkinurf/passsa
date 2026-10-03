const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const { AtomicJsonStore } = require('./atomic-json-store');

function normalizeRecoveryCode(value) {
  return String(value || '').replace(/[\s-]/g, '').toUpperCase();
}

function hashRecoveryCode(value) {
  return crypto.createHash('sha256').update(normalizeRecoveryCode(value)).digest('hex');
}

class TotpStore {
  constructor(filePath, safeStorage) {
    this.safeStorage = safeStorage;
    this.store = new AtomicJsonStore(filePath, () => ({ version: 1, users: {} }));
  }

  assertAvailable() {
    if (!this.safeStorage?.isEncryptionAvailable?.()) {
      throw new Error('Penyimpanan aman perangkat tidak tersedia untuk 2FA.');
    }
  }

  encrypt(record) {
    this.assertAvailable();
    return this.safeStorage.encryptString(JSON.stringify(record)).toString('base64');
  }

  decrypt(envelope) {
    this.assertAvailable();
    if (!envelope?.encrypted) return null;
    const plaintext = this.safeStorage.decryptString(Buffer.from(envelope.encrypted, 'base64'));
    return JSON.parse(plaintext);
  }

  async get(userId) {
    const data = await this.store.read();
    const envelope = data.users?.[userId];
    return envelope ? this.decrypt(envelope) : null;
  }

  async status(userId) {
    const record = await this.get(userId);
    if (!record) return { enabled: false };
    return {
      enabled: true,
      enabledAt: record.enabledAt || null,
      account: record.account || null,
      recoveryCodesRemaining: Array.isArray(record.recoveryCodeHashes) ? record.recoveryCodeHashes.length : 0,
    };
  }

  async save(userId, record) {
    if (!userId || !record?.secret) throw new Error('Data 2FA tidak lengkap.');
    await this.store.update((data) => {
      data.users ||= {};
      data.users[userId] = { encrypted: this.encrypt(record) };
      return data;
    });
  }

  async updateRecord(userId, mutator) {
    let result;
    await this.store.update(async (data) => {
      const record = this.decrypt(data.users?.[userId]);
      if (!record) throw new Error('2FA belum diaktifkan untuk akun ini.');
      const outcome = await mutator(record);
      if (outcome?.save !== false) {
        data.users[userId] = { encrypted: this.encrypt(outcome?.record || record) };
      }
      result = outcome?.result;
      return data;
    });
    return result;
  }

  async acceptStep(userId, step) {
    if (!Number.isInteger(step) || step < 0) return false;
    return this.updateRecord(userId, (record) => {
      const previous = Number.isInteger(record.lastAcceptedStep) ? record.lastAcceptedStep : -1;
      if (step <= previous) return { save: false, result: false };
      record.lastAcceptedStep = step;
      return { result: true, record };
    });
  }

  async consumeRecoveryCode(userId, code) {
    const candidate = hashRecoveryCode(code);
    return this.updateRecord(userId, (record) => {
      const codes = Array.isArray(record.recoveryCodeHashes) ? record.recoveryCodeHashes : [];
      const index = codes.findIndex((stored) => {
        const left = Buffer.from(String(stored), 'hex');
        const right = Buffer.from(candidate, 'hex');
        return left.length === right.length && crypto.timingSafeEqual(left, right);
      });
      if (index < 0) return { save: false, result: false };
      codes.splice(index, 1);
      record.recoveryCodeHashes = codes;
      return { result: true, record };
    });
  }

  async remove(userId) {
    await this.store.update((data) => {
      if (data.users) delete data.users[userId];
      return data;
    });
    // Mirror the cleared state so an explicitly disabled seed is not kept in
    // AtomicJsonStore's previous-state backup.
    await fs.copyFile(this.store.filePath, `${this.store.filePath}.bak`).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
}

module.exports = { TotpStore, hashRecoveryCode, normalizeRecoveryCode };
