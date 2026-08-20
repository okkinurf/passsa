const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { WindowsHelloStore } = require('../src/storage/windows-hello-store');

test('Windows Hello store membungkus kunci vault dan dapat dihapus per user', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-hello-'));
  const filePath = path.join(directory, 'windows-hello.json');
  const safeStorage = {
    isEncryptionAvailable: () => true,
    encryptString: (value) => Buffer.from(`wrapped:${value}`, 'utf8'),
    decryptString: (value) => String(value.toString('utf8')).replace(/^wrapped:/, ''),
  };
  const store = new WindowsHelloStore(filePath, safeStorage, fs);
  const key = Buffer.alloc(32, 7);
  const user = { id: 'user-1', email: 'okki@example.test' };
  await store.save(user, key, { version: 1 });
  const raw = await fs.readFile(filePath, 'utf8');
  assert.equal(raw.includes('07070707'), false);
  const restored = store.decrypt(await store.get(user.id));
  assert.deepEqual(restored, key);
  restored.fill(0);
  assert.equal(await store.clear(user.id), true);
  assert.equal(await store.get(user.id), null);
  await fs.rm(directory, { recursive: true, force: true });
});
