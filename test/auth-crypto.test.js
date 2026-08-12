const test = require('node:test');
const assert = require('node:assert/strict');
const {
  normalizeEmail,
  validateCredentials,
  hashPassword,
  verifyPassword,
  LEGACY_KDF,
  CURRENT_KDF,
} = require('../src/auth-crypto');

test('email dinormalisasi untuk pencocokan akun', () => {
  assert.equal(normalizeEmail('  User@Test.COM '), 'user@test.com');
});

test('kredensial yang tidak valid ditolak', () => {
  assert.equal(
    validateCredentials('x', 'password123'),
    'Gunakan email valid atau username minimal 3 karakter.',
  );
  assert.equal(validateCredentials('user@test.com', 'pendek'), 'Password minimal 8 karakter.');
  assert.equal(validateCredentials('user@test.com', 'password123'), null);
  assert.equal(validateCredentials('okki', 'password123'), null);
});

test('password yang sama menghasilkan hash berbeda karena salt acak', async () => {
  const first = await hashPassword('password-testing');
  const second = await hashPassword('password-testing');
  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.hash, second.hash);
});

test('verifikasi hanya menerima password yang benar', async () => {
  const stored = await hashPassword('password-testing');
  const user = { salt: stored.salt, passwordHash: stored.hash, passwordKdf: stored.kdf };
  assert.equal(await verifyPassword('password-testing', user), true);
  assert.equal(await verifyPassword('password-salah', user), false);
});

test('hash lama tetap dapat diverifikasi dan KDF baru memakai parameter lebih kuat', async () => {
  const legacy = await hashPassword('password-testing', undefined, LEGACY_KDF);
  const user = { salt: legacy.salt, passwordHash: legacy.hash };
  assert.equal(await verifyPassword('password-testing', user), true);
  assert.equal(CURRENT_KDF.p > LEGACY_KDF.p, true);
});
