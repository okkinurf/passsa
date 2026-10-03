const crypto = require('node:crypto');

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const DEFAULT_OPTIONS = Object.freeze({
  algorithm: 'sha1',
  digits: 6,
  period: 30,
});

function normalizeSecret(secret) {
  const normalized = String(secret || '').replace(/[\s-]/g, '').toUpperCase();
  if (!normalized || /[^A-Z2-7]/.test(normalized)) {
    throw new Error('Secret TOTP tidak valid.');
  }
  return normalized;
}

function encodeBase32(value) {
  const buffer = Buffer.from(value);
  let bits = 0;
  let bitCount = 0;
  let output = '';
  for (const byte of buffer) {
    bits = (bits << 8) | byte;
    bitCount += 8;
    while (bitCount >= 5) {
      bitCount -= 5;
      output += BASE32_ALPHABET[(bits >> bitCount) & 31];
    }
  }
  if (bitCount > 0) output += BASE32_ALPHABET[(bits << (5 - bitCount)) & 31];
  return output;
}

function decodeBase32(secret) {
  const normalized = normalizeSecret(secret);
  let bits = 0;
  let bitCount = 0;
  const output = [];
  for (const character of normalized) {
    bits = (bits << 5) | BASE32_ALPHABET.indexOf(character);
    bitCount += 5;
    if (bitCount >= 8) {
      bitCount -= 8;
      output.push((bits >> bitCount) & 0xff);
    }
  }
  return Buffer.from(output);
}

function normalizeOptions(options = {}) {
  const algorithm = String(options.algorithm || DEFAULT_OPTIONS.algorithm).toLowerCase();
  const digits = Number(options.digits || DEFAULT_OPTIONS.digits);
  const period = Number(options.period || DEFAULT_OPTIONS.period);
  if (!['sha1', 'sha256', 'sha512'].includes(algorithm)) throw new Error('Algoritma TOTP tidak didukung.');
  if (![6, 8].includes(digits)) throw new Error('Jumlah digit TOTP tidak didukung.');
  if (!Number.isInteger(period) || period < 15 || period > 120) throw new Error('Periode TOTP tidak valid.');
  return { algorithm, digits, period };
}

function generateSecret() {
  return encodeBase32(crypto.randomBytes(20));
}

function getTimeStep(timestamp = Date.now(), period = DEFAULT_OPTIONS.period) {
  return Math.floor(Math.floor(Number(timestamp) / 1000) / period);
}

function counterBuffer(step) {
  const counter = Buffer.alloc(8);
  counter.writeUInt32BE(Math.floor(step / 0x100000000), 0);
  counter.writeUInt32BE(step >>> 0, 4);
  return counter;
}

function generateTotp(secret, timestamp = Date.now(), options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const key = decodeBase32(secret);
  const step = getTimeStep(timestamp, normalizedOptions.period);
  const digest = crypto.createHmac(normalizedOptions.algorithm, key)
    .update(counterBuffer(step))
    .digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff);
  return String(binary % (10 ** normalizedOptions.digits)).padStart(normalizedOptions.digits, '0');
}

function verifyTotp(secret, code, options = {}) {
  const normalizedOptions = normalizeOptions(options);
  const candidate = String(code || '').replace(/\s/g, '');
  if (!new RegExp(`^\\d{${normalizedOptions.digits}}$`).test(candidate)) return { ok: false };
  const timestamp = Number(options.timestamp ?? Date.now());
  const window = Number.isInteger(options.window) ? Math.max(0, Math.min(options.window, 2)) : 1;
  const currentStep = getTimeStep(timestamp, normalizedOptions.period);
  const candidateBuffer = Buffer.from(candidate);
  for (let delta = -window; delta <= window; delta += 1) {
    const step = currentStep + delta;
    if (step < 0) continue;
    const expectedBuffer = Buffer.from(generateTotp(secret, step * normalizedOptions.period * 1000, normalizedOptions));
    if (crypto.timingSafeEqual(candidateBuffer, expectedBuffer)) return { ok: true, step };
  }
  return { ok: false };
}

function buildOtpAuthUri({ issuer = 'PassSa', account, secret, algorithm = 'SHA1', digits = 6, period = 30 } = {}) {
  const normalizedSecret = normalizeSecret(secret);
  const issuerLabel = String(issuer || 'PassSa').trim() || 'PassSa';
  const accountLabel = String(account || '').trim();
  if (!accountLabel) throw new Error('Akun TOTP tidak valid.');
  const label = encodeURIComponent(`${issuerLabel}:${accountLabel}`);
  const params = new URLSearchParams({
    secret: normalizedSecret,
    issuer: issuerLabel,
    algorithm: String(algorithm).toUpperCase(),
    digits: String(digits),
    period: String(period),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

module.exports = {
  DEFAULT_OPTIONS,
  buildOtpAuthUri,
  decodeBase32,
  encodeBase32,
  generateSecret,
  generateTotp,
  getTimeStep,
  normalizeSecret,
  normalizeOptions,
  verifyTotp,
};
