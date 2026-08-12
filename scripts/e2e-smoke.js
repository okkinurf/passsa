const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const os = require('node:os');

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.disableHardwareAcceleration();
// Keep the smoke test isolated from a running development instance. Electron's
// cache and single-instance lock otherwise make the hidden test window fail to
// load when the app is already open.
app.setPath('userData', path.join(os.tmpdir(), `passsa-e2e-${process.pid}`));
const skipGoogle = process.env.PASSA_E2E_SKIP_GOOGLE === 'true';

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function waitFor(win, expression, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await win.webContents.executeJavaScript(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timeout E2E: ${expression}`);
}

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    show: false, width: 1120, height: 760,
    webPreferences: { preload: path.join(__dirname, 'e2e-preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  await win.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
  assert(await win.webContents.executeJavaScript("!document.querySelector('#auth-view').classList.contains('hidden')"), 'Halaman login tidak tampil.');
  await win.webContents.executeJavaScript(`
    document.querySelector('#email').value = 'qa@example.test';
    document.querySelector('#password').value = 'password-qa';
    document.querySelector('#auth-form').requestSubmit();
  `);
  await waitFor(win, "!document.querySelector('#vault-view').classList.contains('hidden')");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.vault-item').length === 2"), 'Daftar item tidak dirender.');
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('[data-action=copy-url]').length === 2"), 'Aksi copy alamat situs tidak dirender.');
  assert(await win.webContents.executeJavaScript("document.querySelector('.tag-overflow-toggle')?.textContent === '+1'"), 'Ringkasan overflow tags tidak dirender.');
  await win.webContents.executeJavaScript("document.querySelector('.tag-overflow-toggle').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('.tag-overflow-menu').classList.contains('open')"), 'Popover tag overflow tidak terbuka.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const itemStyle = getComputedStyle(document.querySelector('.vault-item'));
    return rootStyle.getPropertyValue('--spring-pop').trim().includes('cubic-bezier')
      && itemStyle.animationName === 'item-rise';
  })()`), 'Sistem motion spring tidak aktif pada tampilan vault.');
  assert(await win.webContents.executeJavaScript("[...document.querySelectorAll('.custom-category-children')].every((node) => node.classList.contains('collapsed'))"), 'Kategori tidak tertutup saat vault dibuka.');
  await win.webContents.executeJavaScript("document.querySelector('.tree-toggle[data-target=\"tags-tree\"]').click()");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.sidebar-tag-chip').length === 4"), 'Chip tags tidak dirender.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const chips = [...document.querySelectorAll('.sidebar-tag-chip')].map((chip) => chip.getBoundingClientRect());
    return chips.length === 4 && chips[1].top > chips[0].top && chips.every((chip) => chip.right <= document.querySelector('#tags-tree').getBoundingClientRect().right + 1);
  })()`), 'Baris tags sidebar tidak mengikuti layout compact Records Table.');
  await win.webContents.executeJavaScript(`
    const tagSearch = document.querySelector('#tag-search-input');
    tagSearch.value = 'wifi';
    tagSearch.dispatchEvent(new Event('input', { bubbles: true }));
  `);
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.sidebar-tag-chip').length === 1 && document.querySelector('.sidebar-tag-chip').dataset.tag === 'wifi'"), 'Pencarian tag tidak memfilter chip.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-tag-chip').click()");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.vault-item').length === 1 && document.querySelector('.vault-item').textContent.includes('WiFi QA')"), 'Chip tag tidak memfilter item vault.');
  assert(await win.webContents.executeJavaScript("!document.querySelector('#clear-filter-button').classList.contains('hidden')"), 'Kontrol reset filter tidak tampil setelah memilih tag.');
  await win.webContents.executeJavaScript("document.querySelector('#clear-filter-button').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('.vault-content h2').textContent === 'Semua Item' && document.querySelectorAll('.vault-item').length === 2"), 'Reset filter tidak mengembalikan semua item.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-tag-chip').click()");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.vault-item').length === 1 && document.querySelector('.vault-item').textContent.includes('WiFi QA')"), 'Filter tag tidak dapat dipakai lagi setelah reset.');
  await win.webContents.executeJavaScript("document.querySelector('[data-action=edit]').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#item-modal').classList.contains('hidden') && document.querySelector('#modal-title').textContent === 'Edit Item' && document.querySelector('#item-title').value === 'WiFi QA'"), 'Credential lama tidak dapat dibuka dalam mode edit.');
  await win.webContents.executeJavaScript("document.querySelector('#cancel-item').click()");
  await win.webContents.executeJavaScript("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true, bubbles: true }))");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#item-modal').classList.contains('hidden')"), 'Modal tambah item tidak terbuka.');
  await win.setBounds({ x: 0, y: 0, width: 880, height: 640 });
  const layout = await win.webContents.executeJavaScript(`(() => {
    const content = document.querySelector('.vault-content').getBoundingClientRect();
    const modal = document.querySelector('.item-modal').getBoundingClientRect();
    const scroll = document.querySelector('.items-scroll');
    return { contentRight: content.right, modalBottom: modal.bottom, width: innerWidth, height: innerHeight, horizontalOverflow: scroll.scrollWidth > scroll.clientWidth + 1 };
  })()`);
  assert(layout.contentRight <= layout.width + 1, 'Konten vault keluar viewport.');
  assert(layout.modalBottom <= layout.height + 1, 'Modal keluar viewport.');
  assert(!layout.horizontalOverflow, 'Daftar vault mengalami overflow horizontal pada ukuran responsive.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const header = document.querySelector('#items-header');
    const row = document.querySelector('.vault-item');
    return getComputedStyle(header).display !== 'none'
      && row.querySelector('.item-tags-cell').offsetParent !== null
      && row.querySelector('.item-login').offsetParent !== null;
  })()`), 'Kolom Item, Tags, Akun, dan Aksi tidak tetap terlihat pada layout responsive.');
  await win.webContents.executeJavaScript(`
    document.querySelector('#item-title').value = 'Item Baru E2E';
    document.querySelector('#item-username').value = 'e2e-user';
    document.querySelector('#item-password').value = 'e2e-secret-value';
    document.querySelector('#item-form').requestSubmit();
  `);
  await waitFor(win, "document.querySelector('#item-modal').classList.contains('hidden') && document.querySelectorAll('.vault-item').length === 3");
  assert(await win.webContents.executeJavaScript("[...document.querySelectorAll('.vault-item')].some((item) => item.textContent.includes('Item Baru E2E'))"), 'Item baru dari form UI tidak muncul setelah disimpan.');
  if (!skipGoogle) {
    await win.webContents.executeJavaScript("document.querySelector('#logout-button').click()");
    await waitFor(win, "!document.querySelector('#auth-view').classList.contains('hidden')");
    await win.webContents.executeJavaScript("document.querySelector('#google-login-button').click()");
    await waitFor(win, "!document.querySelector('#vault-view').classList.contains('hidden')");
    assert(await win.webContents.executeJavaScript("document.querySelector('#user-email').textContent === 'okki' && document.querySelector('.sidebar-user small').textContent === 'Google Drive terhubung'"), 'Auto-login Google tidak langsung membuka vault lokal.');
  }
  console.log(`E2E smoke lulus: login lokal, render vault, kategori collapsed, pencarian/chip tags, edit credential lama, tambah/simpan item, layout responsive${skipGoogle ? '' : ', dan auto-login Google'}.`);
  win.destroy();
  app.quit();
}).catch((error) => {
  console.error(error.stack || error.message);
  app.exit(1);
});
