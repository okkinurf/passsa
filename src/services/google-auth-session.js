const crypto = require('node:crypto');

class GoogleAuthSession {
  constructor({ ttlMs = 5 * 60 * 1000, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.pending = new Map();
  }

  create(profile, tokens) {
    this.clearExpired();
    const challengeId = crypto.randomBytes(32).toString('base64url');
    this.pending.set(challengeId, { profile: structuredClone(profile), tokens: structuredClone(tokens), expiresAt: this.now() + this.ttlMs });
    return { challengeId, profile: structuredClone(profile), expiresAt: this.now() + this.ttlMs };
  }

  get(challengeId) {
    const key = String(challengeId || '');
    const value = this.pending.get(key);
    if (!value || value.expiresAt < this.now()) {
      this.pending.delete(key);
      throw new Error('Sesi Google tidak valid atau sudah kedaluwarsa. Ulangi login Google.');
    }
    return value;
  }

  consume(challengeId) {
    const value = this.get(challengeId);
    this.pending.delete(String(challengeId || ''));
    return value;
  }

  clearExpired() {
    for (const [key, value] of this.pending) if (value.expiresAt < this.now()) this.pending.delete(key);
  }

  clear() {
    this.pending.clear();
  }
}

module.exports = { GoogleAuthSession };
