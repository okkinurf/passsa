const crypto = require('node:crypto');
const {
  normalizeEmail,
  validateCredentials,
  hashPassword,
  verifyPassword,
  deriveVaultKey,
  normalizeKdfParams,
  isCurrentKdf,
  LEGACY_KDF,
  CURRENT_KDF,
} = require('../auth-crypto');

class AuthService {
  constructor(store) {
    this.store = store;
    this.currentUser = null;
    this.currentUserRecord = null;
    this.vaultKey = null;
    this.currentVaultKdf = null;
  }

  session() {
    return this.currentUser;
  }

  context() {
    if (!this.currentUser || !this.vaultKey) {
      throw new Error('Sesi telah berakhir. Silakan masuk kembali.');
    }
    return { user: this.currentUser, key: this.vaultKey };
  }

  async register(input = {}) {
    const email = normalizeEmail(input.email);
    const error = validateCredentials(email, input.password);
    if (error) return { ok: false, message: error };
    const password = await hashPassword(input.password);
    const user = {
      id: crypto.randomUUID(),
      email,
      salt: password.salt,
      passwordHash: password.hash,
      passwordKdf: password.kdf,
      vaultSalt: crypto.randomBytes(32).toString('base64'),
      createdAt: new Date().toISOString(),
    };
    let duplicate = false;
    await this.store.update((auth) => {
      auth.users ||= [];
      if (auth.users.some((candidate) => candidate.email === email)) duplicate = true;
      else auth.users.push(user);
      return auth;
    });
    if (duplicate) return { ok: false, message: 'Email sudah terdaftar.' };
    await this.openSession(user, input.password, CURRENT_KDF);
    return { ok: true, user: this.currentUser };
  }

  async login(input = {}) {
    const email = normalizeEmail(input.email);
    if (validateCredentials(email, input.password)) {
      return { ok: false, message: 'Email atau password salah.' };
    }
    const auth = await this.store.read();
    const user = auth.users.find((candidate) => candidate.email === email);
    if (!user || !(await verifyPassword(input.password, user))) {
      return { ok: false, message: 'Email atau password salah.' };
    }
    let changed = false;
    if (!user.vaultSalt) {
      user.vaultSalt = crypto.randomBytes(32).toString('base64');
      changed = true;
    }
    if (!isCurrentKdf(user.passwordKdf)) {
      const upgraded = await hashPassword(input.password);
      user.salt = upgraded.salt;
      user.passwordHash = upgraded.hash;
      user.passwordKdf = upgraded.kdf;
      user.updatedAt = new Date().toISOString();
      changed = true;
    }
    if (changed) await this.store.update((latest) => {
      const index = latest.users.findIndex((candidate) => candidate.id === user.id);
      if (index < 0) throw new Error('Akun tidak lagi tersedia.');
      latest.users[index] = { ...latest.users[index], ...user };
      return latest;
    });
    await this.openSession(user, input.password, user.vaultKdf ?? LEGACY_KDF);
    return { ok: true, user: this.currentUser };
  }

  async verifyCurrentPassword(password) {
    if (!this.currentUserRecord) return false;
    return verifyPassword(String(password || ''), this.currentUserRecord);
  }

  async googleLogin(input = {}) {
    const googleEmail = normalizeEmail(input.email);
    const localIdentifier = normalizeEmail(input.localIdentifier || googleEmail);
    const googleSub = String(input.googleSub || '').trim();
    const error = validateCredentials(localIdentifier, input.password);
    if (error) return { ok: false, message: error };
    if (!googleSub) return { ok: false, message: 'Identitas Google tidak valid.' };
    const auth = await this.store.read();
    const existing = auth.users.find((user) => user.googleSub === googleSub)
      || auth.users.find((user) => user.email === localIdentifier)
      || auth.users.find((user) => user.email === googleEmail);
    if (existing?.googleSub && existing.googleSub !== googleSub) {
      return { ok: false, message: 'Identitas Google tidak cocok dengan akun lokal.' };
    }
    const result = existing
      ? await this.login({ email: existing.email, password: input.password })
      : await this.register({ email: googleEmail, password: input.password });
    if (!result.ok) return result;
    await this.store.update((latest) => {
      const user = latest.users.find((candidate) => candidate.id === result.user.id);
      if (!user) throw new Error('Akun tidak lagi tersedia.');
      if (user.googleSub && user.googleSub !== googleSub) throw new Error('Identitas Google tidak cocok dengan akun lokal.');
      user.googleSub = googleSub;
      user.googleEmail = googleEmail;
      user.googleLinkedAt ||= new Date().toISOString();
      return latest;
    });
    this.currentUserRecord.googleSub = googleSub;
    this.currentUserRecord.googleEmail = googleEmail;
    this.currentUser = { ...this.currentUser, provider: 'google', googleEmail };
    return { ok: true, user: this.currentUser };
  }

  async linkGoogleToSession(input = {}) {
    if (!this.currentUserRecord || !this.vaultKey) {
      return { ok: false, message: 'Vault lokal belum terbuka. Masuk terlebih dahulu.' };
    }
    const googleEmail = normalizeEmail(input.email);
    const googleSub = String(input.googleSub || '').trim();
    if (!googleSub) return { ok: false, message: 'Identitas Google tidak valid.' };

    const userId = this.currentUserRecord.id;
    const auth = await this.store.read();
    const conflict = auth.users.find((candidate) => candidate.id !== userId && (
      candidate.googleSub === googleSub
      || candidate.googleEmail === googleEmail
      || (!candidate.googleSub && candidate.email === googleEmail)
    ));
    if (conflict) return { ok: false, message: 'Akun Google sudah terhubung ke vault lokal lain.' };
    if (this.currentUserRecord.googleSub && this.currentUserRecord.googleSub !== googleSub) {
      return { ok: false, message: 'Vault ini sudah terhubung ke akun Google lain.' };
    }

    await this.store.update((latest) => {
      const user = latest.users.find((candidate) => candidate.id === userId);
      if (!user) throw new Error('Akun tidak lagi tersedia.');
      user.googleSub = googleSub;
      user.googleEmail = googleEmail;
      user.googleLinkedAt ||= new Date().toISOString();
      return latest;
    });
    this.currentUserRecord.googleSub = googleSub;
    this.currentUserRecord.googleEmail = googleEmail;
    this.currentUser = { ...this.currentUser, provider: 'google', googleEmail };
    return { ok: true, user: this.currentUser };
  }

  async changePassword(input = {}, rekeyVault) {
    if (!this.currentUserRecord || !this.vaultKey) {
      return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    }
    const currentPassword = String(input.currentPassword || '');
    const newPassword = String(input.newPassword || '');
    if (!(await verifyPassword(currentPassword, this.currentUserRecord))) {
      return { ok: false, message: 'Password saat ini salah.' };
    }
    const validation = validateCredentials(this.currentUserRecord.email, newPassword);
    if (validation) return { ok: false, message: validation };
    if (currentPassword === newPassword) {
      return { ok: false, message: 'Password baru harus berbeda dari password saat ini.' };
    }

    const userId = this.currentUserRecord.id;
    const previous = {
      salt: this.currentUserRecord.salt,
      passwordHash: this.currentUserRecord.passwordHash,
      passwordKdf: this.currentUserRecord.passwordKdf,
      updatedAt: this.currentUserRecord.updatedAt,
    };
    const nextPassword = await hashPassword(newPassword, undefined, CURRENT_KDF);
    const nextKey = await deriveVaultKey(newPassword, Buffer.from(this.currentUserRecord.vaultSalt, 'base64'), CURRENT_KDF);
    await this.store.update((latest) => {
      const user = latest.users.find((candidate) => candidate.id === userId);
      if (!user) throw new Error('Akun tidak lagi tersedia.');
      Object.assign(user, {
        salt: nextPassword.salt,
        passwordHash: nextPassword.hash,
        passwordKdf: nextPassword.kdf,
        updatedAt: new Date().toISOString(),
      });
      return latest;
    });
    try {
      if (typeof rekeyVault !== 'function') throw new Error('Vault tidak dapat dienkripsi ulang.');
      await rekeyVault(nextKey, CURRENT_KDF);
    } catch (error) {
      await this.store.update((latest) => {
        const user = latest.users.find((candidate) => candidate.id === userId);
        if (user) Object.assign(user, previous);
        return latest;
      });
      nextKey.fill(0);
      throw error;
    }
    this.currentUserRecord.salt = nextPassword.salt;
    this.currentUserRecord.passwordHash = nextPassword.hash;
    this.currentUserRecord.passwordKdf = nextPassword.kdf;
    this.currentUserRecord.updatedAt = new Date().toISOString();
    this.replaceVaultKey(nextKey, CURRENT_KDF);
    return { ok: true, user: this.currentUser };
  }

  async openSession(user, password, vaultKdf = CURRENT_KDF, provider = 'local') {
    this.currentUser = { id: user.id, email: user.email, provider, ...(user.googleEmail ? { googleEmail: user.googleEmail } : {}) };
    this.currentUserRecord = user;
    await this.unlockVault(password, vaultKdf);
  }

  openSessionWithKey(user, key, vaultKdf = CURRENT_KDF, provider = 'local') {
    this.currentUser = { id: user.id, email: user.email, provider, ...(user.googleEmail ? { googleEmail: user.googleEmail } : {}) };
    this.currentUserRecord = user;
    this.replaceVaultKey(Buffer.from(key), vaultKdf);
  }

  async unlockVault(password, vaultKdf) {
    if (!this.currentUserRecord) throw new Error('Sesi autentikasi tidak tersedia.');
    const params = normalizeKdfParams(vaultKdf, CURRENT_KDF);
    const nextKey = await deriveVaultKey(
      password,
      Buffer.from(this.currentUserRecord.vaultSalt, 'base64'),
      params,
    );
    this.replaceVaultKey(nextKey, params);
  }

  replaceVaultKey(nextKey, vaultKdf) {
    this.vaultKey?.fill(0);
    this.vaultKey = nextKey;
    this.currentVaultKdf = normalizeKdfParams(vaultKdf, CURRENT_KDF);
  }

  vaultKdf() {
    return this.currentVaultKdf ?? CURRENT_KDF;
  }

  vaultSalt() {
    if (!this.currentUserRecord?.vaultSalt) throw new Error('Salt vault tidak tersedia.');
    return this.currentUserRecord.vaultSalt;
  }

  async disconnectGoogle() {
    if (!this.currentUserRecord) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    const userId = this.currentUserRecord.id;
    await this.store.update((latest) => {
      const user = latest.users.find((candidate) => candidate.id === userId);
      if (!user) throw new Error('Akun tidak lagi tersedia.');
      delete user.googleSub;
      delete user.googleEmail;
      delete user.googleLinkedAt;
      return latest;
    });
    delete this.currentUser.googleEmail;
    this.currentUser.provider = 'local';
    delete this.currentUserRecord.googleSub;
    delete this.currentUserRecord.googleEmail;
    delete this.currentUserRecord.googleLinkedAt;
    return { ok: true, user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    this.currentUserRecord = null;
    this.vaultKey?.fill(0);
    this.vaultKey = null;
    this.currentVaultKdf = null;
    return { ok: true };
  }
}

module.exports = { AuthService };
