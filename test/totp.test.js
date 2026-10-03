const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  buildOtpAuthUri,
  decodeBase32,
  encodeBase32,
  generateTotp,
  verifyTotp,
} = require('../src/totp');
const { TotpStore, hashRecoveryCode } = require('../src/storage/totp-store');

const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

test('base32 encoding and decoding round trip', () => {
  const source = Buffer.from('Hello!');
  assert.deepEqual(decodeBase32(encodeBase32(source)), source);
});

test('TOTP matches RFC 6238 SHA-1 vectors', () => {
  const vectors = [
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037'],
    [20000000000, '353130'],
  ];
  for (const [seconds, expected] of vectors) {
    assert.equal(generateTotp(RFC_SECRET, seconds * 1000), expected);
  }
});

test('TOTP verifies within the clock-skew window', () => {
  const timestamp = 1_700_000_000_000;
  const code = generateTotp(RFC_SECRET, timestamp);
  assert.deepEqual(verifyTotp(RFC_SECRET, code, { timestamp }), { ok: true, step: Math.floor(1_700_000_000 / 30) });
  assert.deepEqual(verifyTotp(RFC_SECRET, '000000', { timestamp, window: 0 }), { ok: false });
});

test('otpauth URI carries the Google Authenticator setup parameters', () => {
  const uri = buildOtpAuthUri({ issuer: 'PassSa', account: 'user@example.com', secret: RFC_SECRET });
  assert.match(uri, /^otpauth:\/\/totp\/PassSa%3Auser%40example\.com\?/);
  assert.match(uri, /secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ/);
  assert.match(uri, /issuer=PassSa/);
  assert.match(uri, /digits=6/);
  assert.match(uri, /period=30/);
});

test('TOTP store encrypts the seed and never persists the transient code', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-totp-'));
  const filePath = path.join(directory, 'totp.json');
  const safeStorage = {
    isEncryptionAvailable: () => true,
    encryptString: (value) => Buffer.from(value, 'utf8'),
    decryptString: (value) => Buffer.from(value).toString('utf8'),
  };
  const store = new TotpStore(filePath, safeStorage);
  await store.save('user-1', {
    version: 1,
    secret: RFC_SECRET,
    issuer: 'PassSa',
    account: 'user@example.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    lastAcceptedStep: 1,
    recoveryCodeHashes: [hashRecoveryCode('AAAAA-BBBBB-CCCCC-DDDDD')],
  });
  const raw = await fs.readFile(filePath, 'utf8');
  assert.doesNotMatch(raw, /287082/);
  assert.equal((await store.status('user-1')).enabled, true);
  assert.equal(await store.consumeRecoveryCode('user-1', 'AAAAA-BBBBB-CCCCC-DDDDD'), true);
  assert.equal(await store.consumeRecoveryCode('user-1', 'AAAAA-BBBBB-CCCCC-DDDDD'), false);
  await store.remove('user-1');
  assert.equal((await store.status('user-1')).enabled, false);
  const backup = JSON.parse(await fs.readFile(`${filePath}.bak`, 'utf8'));
  assert.equal(backup.users['user-1'], undefined);
  await fs.rm(directory, { recursive: true, force: true });
});
