const crypto = require('node:crypto');

function encryptValue(value, key) {
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return {
    nonce: nonce.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

function decryptValue(payload, key) {
  if (!payload) return null;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(payload.nonce, 'base64'),
  );
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, 'base64')),
    decipher.final(),
  ]);
  return JSON.parse(plaintext.toString('utf8'));
}

function encryptItems(items, key) {
  return encryptValue(items, key);
}

function decryptItems(payload, key) {
  const parsed = decryptValue(payload, key) ?? [];
  if (!Array.isArray(parsed)) throw new Error('Format vault tidak valid.');
  return parsed;
}

function encryptVaultData(document, key) {
  return encryptValue({
    version: 2,
    items: Array.isArray(document.items) ? document.items : [],
    categories: Array.isArray(document.categories) ? document.categories : [],
  }, key);
}

function decryptVaultData(payload, key) {
  const parsed = decryptValue(payload, key);
  if (parsed === null) return { version: 2, items: [], categories: [] };
  if (Array.isArray(parsed)) return { version: 2, items: parsed, categories: [] };
  if (!parsed || !Array.isArray(parsed.items) || !Array.isArray(parsed.categories)) {
    throw new Error('Format vault tidak valid.');
  }
  return { version: 2, items: parsed.items, categories: parsed.categories };
}

module.exports = { encryptItems, decryptItems, encryptVaultData, decryptVaultData };
