const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { AtomicJsonStore } = require('../src/storage/atomic-json-store');

test('penulisan berurutan membuat backup dan file utama yang valid', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-store-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'vault.json');
  const store = new AtomicJsonStore(target, () => ({ version: 1 }));

  await store.write({ value: 'lama' });
  await store.write({ value: 'baru' });

  assert.deepEqual(await store.read(), { value: 'baru' });
  assert.deepEqual(JSON.parse(await fs.readFile(`${target}.bak`, 'utf8')), { value: 'lama' });
});

test('backup digunakan ketika file utama rusak', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-recovery-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'auth.json');
  const store = new AtomicJsonStore(target, () => ({ users: [] }));

  await store.write({ users: ['backup'] });
  await store.write({ users: ['utama'] });
  await fs.writeFile(target, '{rusak', 'utf8');

  assert.deepEqual(await store.read(), { users: ['backup'] });
});

test('update lintas instance tidak kehilangan perubahan concurrent', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'passsa-concurrent-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const target = path.join(directory, 'vault.json');
  const first = new AtomicJsonStore(target, () => ({ count: 0 }));
  const second = new AtomicJsonStore(target, () => ({ count: 0 }));
  await Promise.all(Array.from({ length: 12 }, (_, index) => (
    (index % 2 ? first : second).update((value) => ({ count: value.count + 1 }))
  )));
  assert.deepEqual(await first.read(), { count: 12 });
});
