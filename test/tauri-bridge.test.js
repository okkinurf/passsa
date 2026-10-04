const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'tauri-bridge.js'), 'utf8');
const quickSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'quick-access-tauri-bridge.js'), 'utf8');
const quickThemeSource = fs.readFileSync(path.join(__dirname, '..', 'src', 'quick-access-theme.js'), 'utf8');

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
  assert.equal((await bridge.session()).code, 'TAURI_BRIDGE_PENDING');
  assert.equal((await bridge.listItems()).code, 'TAURI_BRIDGE_PENDING');
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

test('Tauri bridge membuka hanya tujuan eksternal yang ditentukan renderer', async () => {
  const calls = [];
  const bridge = load({
    __TAURI__: { core: { invoke: async (...args) => { calls.push(args); return { ok: true }; } } },
  });
  assert.deepEqual(await bridge.openExternal('repository'), { ok: true });
  assert.equal(calls[0][0], 'open_external_destination');
  assert.equal(JSON.stringify(calls[0][1]), JSON.stringify({ destination: 'repository' }));
});

test('Tauri bridge meneruskan autentikasi dan operasi vault hanya melalui command backend', async () => {
  const calls = [];
  const bridge = load({
    __TAURI__: {
      core: {
        invoke: async (...args) => {
          calls.push(args);
          if (args[0] === 'backend_request') return { ok: true, user: { username: 'okki' } };
          return null;
        },
      },
    },
  });
  const result = await bridge.login('okki', 'correct horse battery staple');
  assert.deepEqual(result, { ok: true, user: { username: 'okki' } });
  assert.equal(calls[0][0], 'backend_request');
  assert.equal(JSON.stringify(calls[0][1]), JSON.stringify({
    channel: 'auth:login', args: [{ username: 'okki', password: 'correct horse battery staple' }],
  }));
  await bridge.listItems();
  assert.equal(calls[1][1].channel, 'vault:list');
});

test('Tauri bridge memakai kontrol native window dan tidak mengekspos secret dari saluran backend', async () => {
  const calls = [];
  const bridge = load({
    __TAURI__: { core: { invoke: async (...args) => { calls.push(args); return { ok: true }; } } },
  });
  await bridge.minimizeWindow();
  await bridge.copyEntrySecret('entry-1', 'password');
  assert.equal(calls[0][0], 'window_minimize');
  assert.equal(calls[1][0], 'backend_request');
  assert.equal(JSON.stringify(calls[1][1]), JSON.stringify({ channel: 'vault:copy-entry', args: ['entry-1', 'password'] }));
});

test('perubahan tema meneruskan palet ke backend dan state Quick Access Tauri', async () => {
  const calls = [];
  const bridge = load({
    __TAURI__: { core: { invoke: async (...args) => { calls.push(args); return { ok: true }; } } },
  });
  await bridge.setTheme('dark', 'ocean');
  assert.equal(JSON.stringify(calls), JSON.stringify([
    ['backend_request', { channel: 'window:set-theme', args: [{ theme: 'dark', palette: 'ocean' }] }],
    ['set_quick_access_theme', { theme: 'dark', palette: 'ocean' }],
  ]));
});

test('Quick Access mengabaikan snapshot tema native kosong agar tidak menimpa tema tersimpan', async () => {
  const calls = [];
  let onThemeEvent;
  const window = {
    __TAURI__: {
      core: {
        invoke: async (...args) => {
          calls.push(args);
          if (args[0] === 'quick_access_theme') return null;
          return { ok: true };
        },
      },
      event: {
        listen: async (name, callback) => {
          calls.push(['listen', name]);
          onThemeEvent = callback;
          return () => undefined;
        },
      },
    },
  };
  vm.runInNewContext(quickSource, { window, console });
  const received = [];
  await window.passsaQuick.onTheme((theme) => received.push(theme));
  assert.deepEqual(calls, [['listen', 'quick-access:theme'], ['quick_access_theme']]);
  assert.deepEqual(received, []);
  onThemeEvent({ payload: { theme: 'light', palette: 'coral' } });
  assert.deepEqual(received, [{ theme: 'light', palette: 'coral' }]);
});

test('Quick Access memuat tema native terakhir setelah listener aktif', async () => {
  const calls = [];
  const window = {
    __TAURI__: {
      core: {
        invoke: async (...args) => {
          calls.push(args);
          return { theme: 'dark', palette: 'ocean' };
        },
      },
      event: { listen: async (name) => { calls.push(['listen', name]); return () => undefined; } },
    },
  };
  vm.runInNewContext(quickSource, { window, console });
  const received = [];
  await window.passsaQuick.onTheme((theme) => received.push(theme));
  assert.deepEqual(calls, [['listen', 'quick-access:theme'], ['quick_access_theme']]);
  assert.deepEqual(received, [{ theme: 'dark', palette: 'ocean' }]);
});

test('tema dan palet tersimpan diterapkan sebelum stylesheet Quick Access ditampilkan', () => {
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(quickThemeSource, {
    window: { matchMedia: () => ({ matches: false }) },
    document: { documentElement: root },
    localStorage: { getItem: (key) => ({ 'passsa-theme': 'dark', 'passsa-palette': 'ocean' })[key] ?? null },
  });
  assert.equal(root.dataset.theme, 'dark');
  assert.equal(root.dataset.palette, 'ocean');
  assert.equal(root.style.colorScheme, 'dark');
});
