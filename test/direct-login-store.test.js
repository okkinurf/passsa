const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { DirectLoginStore } = require('../src/storage/direct-login-store');

test('direct login wraps the vault key and can be disabled for its device profile', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-direct-login-'));
  try {
    const filePath = path.join(directory, 'direct-login.json');
    const safeStorage = {
      isEncryptionAvailable: () => true,
      encryptString: (value) => Buffer.from(`wrapped:${value}`, 'utf8'),
      decryptString: (value) => String(value.toString('utf8')).replace(/^wrapped:/, ''),
    };
    const store = new DirectLoginStore(filePath, safeStorage);
    const key = Buffer.alloc(32, 7);
    await store.save({ id: 'user-1', username: 'okki' }, key, { version: 1 });

    const raw = await fs.readFile(filePath, 'utf8');
    assert.equal(raw.includes(key.toString('base64')), false);
    assert.equal(raw.includes('password'), false);
    const record = await store.getActive();
    assert.equal(record.userId, 'user-1');
    assert.equal(record.username, 'okki');
    const restored = store.decrypt(record);
    assert.deepEqual(restored, key);
    restored.fill(0);

    await store.clear('user-1');
    assert.equal(await store.getActive(), null);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
