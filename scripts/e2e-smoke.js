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
  assert(await win.webContents.executeJavaScript(`(() => {
    const layout = document.querySelector('#auth-view');
    const brand = document.querySelector('.brand-panel');
    const card = document.querySelector('.auth-card');
    const layoutStyle = getComputedStyle(layout);
    const brandStyle = getComputedStyle(brand);
    return layoutStyle.display === 'flex'
      && layoutStyle.flexDirection === 'column'
      && brandStyle.display !== 'none'
      && card.getBoundingClientRect().width <= 420;
  })()`), 'Layout login sederhana vertikal tidak sesuai.');
  await win.webContents.executeJavaScript(`
    document.querySelector('#email').value = 'qa@example.test';
    document.querySelector('#password').value = 'password-qa';
    document.querySelector('#auth-form').requestSubmit();
  `);
  await waitFor(win, "!document.querySelector('#vault-view').classList.contains('hidden')");
  assert(await win.webContents.executeJavaScript(`(() => {
    const sidebar = document.querySelector('.sidebar');
    const workspace = document.querySelector('.sidebar-group-header[data-group="workspace-list"]');
    const insights = document.querySelector('.sidebar-group-header[data-group="insights-list"]');
    return sidebar && Math.round(sidebar.getBoundingClientRect().width) === 260
      && workspace?.getAttribute('aria-expanded') === 'true'
      && insights?.getAttribute('aria-controls') === 'insights-list'
      && document.querySelector('[data-label]');
  })()`), 'Sidebar rail 260px atau metadata grup tidak sesuai.');
  await win.webContents.executeJavaScript(`
    const group = document.querySelector('.sidebar-group-header[data-group="workspace-list"]');
    group.click();
  `);
  assert(await win.webContents.executeJavaScript("document.querySelector('.sidebar-group-header[data-group=workspace-list]').getAttribute('aria-expanded') === 'false' && document.querySelector('#workspace-list').classList.contains('hidden')"), 'Toggle grup sidebar tidak menutup list.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-group-header[data-group=workspace-list]').click(); document.querySelector('#sidebar-collapse-button').click();");
  await new Promise((resolve) => setTimeout(resolve, 1200));
  assert(await win.webContents.executeJavaScript("Math.round(document.querySelector('.sidebar').getBoundingClientRect().width) === 72 && document.querySelector('.sidebar').classList.contains('is-collapsed') && document.querySelector('#sidebar-collapse-button').getAttribute('aria-expanded') === 'false' && localStorage.getItem('passsa-sidebar-width') === '72'"), 'Sidebar tidak dapat diciutkan menjadi rail 72px atau tidak tersimpan.');
  assert(await win.webContents.executeJavaScript("(() => { const rail = document.querySelector('.sidebar').getBoundingClientRect(); const arrow = document.querySelector('#sidebar-collapse-button').getBoundingClientRect(); return arrow.left >= rail.right - 8 && arrow.left <= rail.right + 2 && getComputedStyle(document.querySelector('#sidebar-collapse-button')).borderLeftColor !== 'rgb(159, 18, 57)'; })()"), 'Panah collapse tidak berada di garis rail atau masih memakai aksen lama.');
  assert(await win.webContents.executeJavaScript("getComputedStyle(document.querySelector('.sidebar [data-label]')).display === 'none'"), 'Label sidebar tidak tersembunyi saat rail diciutkan.');
  assert(await win.webContents.executeJavaScript("(() => { const rail = document.querySelector('.sidebar').getBoundingClientRect(); return [...document.querySelectorAll('.sidebar-user .sync-button, .sidebar-user .logout-button')].every((node) => node.getBoundingClientRect().right <= rail.right + 1); })()"), 'Ikon user di bagian bawah keluar dari rail sidebar.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=all]').dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))");
  assert(await win.webContents.executeJavaScript("document.querySelector('#sidebar-tooltip').classList.contains('visible') && document.querySelector('#sidebar-tooltip').textContent.includes('Semua Item')"), 'Tooltip ikon sidebar tidak tampil saat rail diciutkan.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=all]').dispatchEvent(new PointerEvent('pointerout', { bubbles: true }))");
  await win.webContents.executeJavaScript("document.querySelector('#sidebar-collapse-button').click(); document.querySelector('.sidebar-link[data-filter=favorites]').click();");
  await new Promise((resolve) => setTimeout(resolve, 350));
  assert(await win.webContents.executeJavaScript("Math.round(document.querySelector('.sidebar').getBoundingClientRect().width) === 260 && document.querySelector('.sidebar-link[data-filter=favorites]').classList.contains('active') && !document.querySelector('.sidebar-link[data-filter=all]').classList.contains('active')"), 'Sidebar tidak mengembalikan lebar atau active state link.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=all]').click(); document.querySelector('#sidebar-navigation-search').value = 'favorit'; document.querySelector('#sidebar-navigation-search').dispatchEvent(new Event('input', { bubbles: true }));");
  assert(await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=favorites]').closest('.tree-row').classList.contains('sidebar-nav-hidden') === false && document.querySelector('.sidebar-link[data-filter=all]').closest('.tree-row').classList.contains('sidebar-nav-hidden')"), 'Pencarian navigasi sidebar tidak memfilter link.');
  await win.webContents.executeJavaScript("document.querySelector('#sidebar-navigation-search').value = ''; document.querySelector('#sidebar-navigation-search').dispatchEvent(new Event('input', { bubbles: true })); document.querySelector('.sidebar-link[data-filter=all]').click();");
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
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=tags]').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#tags-overview').classList.contains('hidden') && document.querySelectorAll('.tag-overview-card').length === 4 && document.querySelector('#items-list').classList.contains('hidden') && !document.querySelector('.tree-toggle[data-target=tags-tree]')"), 'Halaman Semua Tags masih menampilkan dropdown atau daftar credential.');
  await win.webContents.executeJavaScript(`
    const tagSearch = document.querySelector('#search-input');
    tagSearch.value = 'wifi';
    tagSearch.dispatchEvent(new Event('input', { bubbles: true }));
  `);
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.tag-overview-card').length === 1 && document.querySelector('.tag-overview-card').dataset.tagFilter === 'wifi'"), 'Pencarian tag tidak memfilter daftar tag.');
  await win.webContents.executeJavaScript("document.querySelector('.tag-overview-card').click()");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.vault-item').length === 1 && document.querySelector('.vault-item').textContent.includes('WiFi QA')"), 'Tag tidak memfilter item vault.');
  assert(await win.webContents.executeJavaScript("!document.querySelector('#clear-filter-button').classList.contains('hidden')"), 'Kontrol reset filter tidak tampil setelah memilih tag.');
  await win.webContents.executeJavaScript("document.querySelector('#clear-filter-button').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('.vault-content h2').textContent === 'Semua Tags' && !document.querySelector('#tags-overview').classList.contains('hidden') && document.querySelector('#items-list').classList.contains('hidden')"), 'Reset filter tidak mengembalikan halaman utama Tags.');
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=all]').click()");
  await win.webContents.executeJavaScript("document.querySelector('#search-input').value = 'tidak-ada'; document.querySelector('#search-input').dispatchEvent(new Event('input', { bubbles: true }))");
  assert(await win.webContents.executeJavaScript("document.querySelector('#empty-state').classList.contains('hidden') === false && document.querySelector('#items-header').classList.contains('hidden') && getComputedStyle(document.querySelector('#items-header')).display === 'none'"), 'State kosong masih menampilkan header tabel di bagian bawah.');
  await win.webContents.executeJavaScript("document.querySelector('#search-input').value = ''; document.querySelector('#search-input').dispatchEvent(new Event('input', { bubbles: true }))");
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=tags]').click(); document.querySelector('.tag-overview-card[data-tag-filter=wifi]').click()");
  assert(await win.webContents.executeJavaScript("document.querySelectorAll('.vault-item').length === 1 && document.querySelector('.vault-item').textContent.includes('WiFi QA')"), 'Filter tag tidak dapat dipakai lagi setelah reset.');
  await win.webContents.executeJavaScript("document.querySelector('[data-action=edit]').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#item-modal').classList.contains('hidden') && document.querySelector('#modal-title').textContent === 'Edit Item' && document.querySelector('#item-title').value === 'WiFi QA'"), 'Credential lama tidak dapat dibuka dalam mode edit.');
  assert(await win.webContents.executeJavaScript("Number(getComputedStyle(document.querySelector('#item-modal')).zIndex) > Number(getComputedStyle(document.querySelector('#sidebar-collapse-button')).zIndex)"), 'Modal edit masih berada di bawah tombol collapse sidebar.');
  assert(await win.webContents.executeJavaScript("!document.querySelector('#password-history').classList.contains('hidden') && document.querySelector('#password-history-count').textContent.includes('1 versi') && document.querySelector('.password-history-value input').type === 'password' && document.querySelector('[data-history-toggle]').offsetParent !== null && document.querySelector('[data-history-toggle] i').classList.contains('fa-eye')"), 'Password history tidak tampil tersamarkan dengan ikon mata.');
  await win.webContents.executeJavaScript("document.querySelector('[data-history-toggle]').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('.password-history-value input').type === 'text' && document.querySelector('.password-history-value input').value === 'qa-previous-secret' && document.querySelector('[data-history-toggle] i').classList.contains('fa-eye-slash')"), 'Password history tidak dapat dilihat manual dengan ikon mata.' );
  await win.webContents.executeJavaScript(`
    document.querySelector('#item-title').value = 'WiFi QA Diedit';
    document.querySelector('#item-password').value = 'qa-home-updated';
    document.querySelector('#item-form').requestSubmit();
  `);
  await waitFor(win, "document.querySelector('#item-modal').classList.contains('hidden') && document.querySelector('.vault-item').textContent.includes('WiFi QA Diedit')");
  assert(await win.webContents.executeJavaScript("document.querySelector('.vault-item').textContent.includes('WiFi QA Diedit')"), 'Perubahan credential lama tidak tersimpan setelah klik Simpan Item.');
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
    assert(await win.webContents.executeJavaScript("!document.querySelector('#google-login-button') && document.querySelector('#settings-button')"), 'Google masih tampil sebagai metode login awal.');
    await win.webContents.executeJavaScript("document.querySelector('#settings-button').click()");
    assert(await win.webContents.executeJavaScript("!document.querySelector('#settings-modal').classList.contains('hidden') && document.querySelector('#settings-google-connect').textContent.includes('Hubungkan')"), 'Pengaturan Cloud Sync Google tidak tampil.');
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-startup') && document.querySelector('#settings-minimize-tray') && document.querySelector('#settings-quick-access')"), 'Pengaturan startup, system tray, dan Quick Access tidak tampil.');
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-autofill-heading') && document.querySelector('#settings-autofill-heading').textContent.includes('Autofill Browser')"), 'Pengaturan Browser Autofill tidak tampil.');
    await waitFor(win, "document.querySelector('#settings-startup').disabled === false");
    await win.webContents.executeJavaScript("document.querySelector('#settings-startup').click();");
    await waitFor(win, "document.querySelector('#settings-app-message').classList.contains('success')");
    await win.webContents.executeJavaScript("document.querySelector('#settings-minimize-tray').click();");
    await waitFor(win, "document.querySelector('#settings-app-message').classList.contains('success') && document.querySelector('#settings-minimize-tray').checked");
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-startup').checked && document.querySelector('#settings-minimize-tray').checked"), 'Perubahan startup dan system tray tidak tersimpan dari Pengaturan.');
    await win.webContents.executeJavaScript("document.querySelector('#settings-quick-access').click();");
    await waitFor(win, "document.querySelector('#settings-app-message').classList.contains('success') && !document.querySelector('#settings-quick-access').checked");
    await win.webContents.executeJavaScript("document.querySelector('#settings-quick-access').click();");
    await waitFor(win, "document.querySelector('#settings-app-message').classList.contains('success') && document.querySelector('#settings-quick-access').checked");
    assert(await win.webContents.executeJavaScript("document.querySelector('#titlebar-sync-status').textContent.includes('belum terhubung')"), 'Indikator Google Drive lokal tidak sesuai.');
    await win.webContents.executeJavaScript("document.querySelector('#settings-google-connect').click()");
    assert(await win.webContents.executeJavaScript("document.querySelector('#titlebar-sync-status').textContent.includes('terhubung') && document.querySelector('#titlebar-sync-status').classList.contains('connected')"), 'Indikator Google Drive terhubung tidak tampil.');
    await win.webContents.executeJavaScript("document.querySelector('#settings-button').click(); document.querySelector('#settings-google-disconnect').click()");
    await waitFor(win, "document.querySelector('#titlebar-sync-status').classList.contains('disconnected')");
    assert(await win.webContents.executeJavaScript("document.querySelector('#titlebar-sync-status').textContent.includes('belum terhubung') && document.querySelector('#titlebar-sync-status').classList.contains('disconnected')"), 'Indikator tidak kembali ke status lokal setelah Google diputuskan.');
    await win.webContents.executeJavaScript("document.querySelector('#close-settings').click()");
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-modal').classList.contains('hidden')"), 'Modal pengaturan tidak dapat ditutup.');
  }
  console.log(`E2E smoke lulus: login lokal, render vault, kategori collapsed, pencarian/chip tags, edit credential lama, tambah/simpan item, layout responsive${skipGoogle ? '' : ', dan Google hanya tersedia di Pengaturan Cloud Sync'}.`);
  win.destroy();
  app.quit();
}).catch((error) => {
  console.error(error.stack || error.message);
  app.exit(1);
});
