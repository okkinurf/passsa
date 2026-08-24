const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'tauri-bridge.js'), 'utf8');

function load(initial = {}) {
  const window = { ...initial };
  vm.runInNewContext(source, { window, console });
  return window.passsa;
}

test('Tauri bridge tidak menggantikan preload Electron', () => {
  const existing = { session: () => 'electron' };
  const bridge = load({ passsa: existing });
  assert.equal(bridge, existing);
});

test('Tauri bridge fallback membuat renderer tetap bootable tanpa menyentuh secret', async () => {
  const bridge = load();
  assert.equal(bridge.isTauri, false);
  assert.equal((await bridge.session()), null);
  assert.equal((await bridge.listItems()).length, 0);
  assert.equal((await bridge.login('demo', 'password')).code, 'TAURI_BRIDGE_PENDING');
});

test('Tauri bridge meneruskan command non-secret ke invoke global', async () => {
  const calls = [];
  const bridge = load({
    __TAURI__: { core: { invoke: async (...args) => { calls.push(args); return { ok: true }; } } },
  });
  assert.equal(bridge.isTauri, true);
  assert.deepEqual(await bridge.appInfo(), { ok: true });
  assert.deepEqual(calls, [['app_info', undefined]]);
});
