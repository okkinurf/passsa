const crypto = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;
const LEGACY_KDF = Object.freeze({ name: 'scrypt', version: 1, N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const CURRENT_KDF = Object.freeze({ name: 'scrypt', version: 2, N: 32768, r: 8, p: 3, maxmem: 128 * 1024 * 1024 });

function normalizeKdfParams(value, fallback = LEGACY_KDF) {
  if (!value || value.name !== 'scrypt') return { ...fallback };
  const allowed = [LEGACY_KDF, CURRENT_KDF].find((candidate) => (
    candidate.version === value.version
    && candidate.N === value.N
    && candidate.r === value.r
    && candidate.p === value.p
  ));
  return { ...(allowed ?? fallback) };
}

function isCurrentKdf(value) {
  return normalizeKdfParams(value).version === CURRENT_KDF.version;
}

function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

function validateCredentials(email, password) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isUsername = /^[a-z0-9._-]{3,64}$/.test(email);
  if (!isEmail && !isUsername) {
    return 'Gunakan email valid atau username minimal 3 karakter.';
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password minimal 8 karakter.';
  }
  if (password.length > 256) {
    return 'Password terlalu panjang.';
  }
  return null;
}

async function hashPassword(password, salt = crypto.randomBytes(16), kdf = CURRENT_KDF) {
  const params = normalizeKdfParams(kdf, CURRENT_KDF);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem: params.maxmem,
  });
  return {
    salt: salt.toString('base64'),
    hash: Buffer.from(derivedKey).toString('base64'),
    kdf: params,
  };
}

async function verifyPassword(password, user) {
  const calculated = await hashPassword(
    password,
    Buffer.from(user.salt, 'base64'),
    normalizeKdfParams(user.passwordKdf, LEGACY_KDF),
  );
  const actual = Buffer.from(user.passwordHash, 'base64');
  const expected = Buffer.from(calculated.hash, 'base64');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

async function deriveVaultKey(password, salt, kdf = CURRENT_KDF) {
  const params = normalizeKdfParams(kdf, CURRENT_KDF);
  const derivedKey = await scrypt(password, salt, 32, {
    N: params.N,
    r: params.r,
    p: params.p,
    maxmem: params.maxmem,
  });
  return Buffer.from(derivedKey);
}

module.exports = {
  normalizeEmail,
  validateCredentials,
  hashPassword,
  verifyPassword,
  deriveVaultKey,
  normalizeKdfParams,
  isCurrentKdf,
  LEGACY_KDF,
  CURRENT_KDF,
};
