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
      && brandStyle.display === 'none'
      && document.querySelector('.auth-mark img')?.getAttribute('src') === 'assets/passsa-mark.png'
      && !document.querySelector('.auth-mark .fa-lock')
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
  const collapseHit = await win.webContents.executeJavaScript("(() => { const button = document.querySelector('#sidebar-collapse-button'); const rect = button.getBoundingClientRect(); const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2); return { ok: hit === button || button.contains(hit), hit: hit ? `${hit.tagName.toLowerCase()}#${hit.id}.${hit.className}` : 'none', rect: `${Math.round(rect.left)},${Math.round(rect.top)},${Math.round(rect.width)},${Math.round(rect.height)}` }; })()");
  assert(collapseHit.ok, `Hit area panah collapse tertutup elemen lain (${collapseHit.hit}; rect ${collapseHit.rect}).`);
  assert(await win.webContents.executeJavaScript("getComputedStyle(document.querySelector('.sidebar [data-label]')).display === 'none'"), 'Label sidebar tidak tersembunyi saat rail diciutkan.');
  assert(await win.webContents.executeJavaScript("(() => { const rail = document.querySelector('.sidebar').getBoundingClientRect(); return [...document.querySelectorAll('.sidebar-user .sync-button, .sidebar-user .logout-button')].every((node) => node.getBoundingClientRect().right <= rail.right + 1); })()"), 'Ikon user di bagian bawah keluar dari rail sidebar.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=all]').dispatchEvent(new PointerEvent('pointerover', { bubbles: true }))");
  assert(await win.webContents.executeJavaScript("document.querySelector('#sidebar-tooltip').classList.contains('visible') && document.querySelector('#sidebar-tooltip').textContent.includes('Semua Item')"), 'Tooltip ikon sidebar tidak tampil saat rail diciutkan.');
  await win.webContents.executeJavaScript("document.querySelector('.sidebar-link[data-filter=all]').dispatchEvent(new PointerEvent('pointerout', { bubbles: true }))");
  await win.webContents.executeJavaScript("document.querySelector('#sidebar-collapse-button').click(); document.querySelector('.sidebar-link[data-filter=favorites]').click();");
  // Width transitions use a spring curve and can take longer on slower CI or
  // when the OS is under load. Wait for the observable state instead of
  // relying on a fixed sleep that makes the smoke test flaky.
  await waitFor(win, "Math.round(document.querySelector('.sidebar').getBoundingClientRect().width) === 260 && document.querySelector('.sidebar').classList.contains('is-collapsed') === false", 2500);
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
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=notes]').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('.vault-content h2').textContent === 'Noted' && document.querySelector('.sidebar-link[data-filter=notes]').classList.contains('active') && document.querySelector('#item-count').textContent === '0 item'"), 'Insight Noted tidak memfilter secure note atau active state tidak sesuai.');
  await win.webContents.executeJavaScript("document.querySelector('#sidebar-add-note-button').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#item-modal').classList.contains('hidden') && document.querySelector('#item-type').value === 'secure-note'"), 'Tombol New Noted tidak membuka form Secure Note.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const mode = document.querySelector('#note-editor-mode');
    return mode && mode.textContent.includes('Review') && !mode.querySelector('[data-note-mode]')
      && !mode.textContent.includes('Tulis') && !mode.textContent.includes('Preview')
      && !document.querySelector('#note-preview').classList.contains('hidden');
  })()`), 'Editor Secure Note masih menampilkan tab Tulis/Preview atau belum berada di mode Review.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const toolbar = document.querySelector('#note-editor-toolbar');
    const formats = [...toolbar.querySelectorAll('[data-note-format]')].map((button) => button.dataset.noteFormat);
    return formats.includes('undo') && formats.includes('redo') && formats.includes('table')
      && formats.includes('callout') && formats.includes('date')
      && document.querySelector('#item-notes').maxLength === 20000;
  })()`), 'Toolbar editor Secure Note belum lengkap.');
  await win.webContents.executeJavaScript(`(() => {
    const input = document.querySelector('#item-notes');
    input.value = '# Judul QA\\n\\n- [ ] Tugas pertama\\n- [x] Tugas selesai\\n\\n| Kolom | Nilai |\\n| --- | --- |\\n| A | B |';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  assert(await win.webContents.executeJavaScript(`(() => {
    const preview = document.querySelector('#note-preview');
    return preview.querySelector('h1')?.textContent === 'Judul QA'
      && preview.querySelector('.note-preview-table')
      && preview.querySelectorAll('.note-preview-check-toggle').length === 2;
  })()`), 'Preview editor tidak merender heading, checklist, dan tabel.');
  assert(await win.webContents.executeJavaScript("document.querySelector('#note-preview').isContentEditable && document.querySelector('#note-preview').getAttribute('role') === 'textbox'"), 'Preview Secure Note belum dapat diedit langsung.');
  await win.webContents.executeJavaScript(`(() => {
    const heading = document.querySelector('#note-preview h1');
    heading.textContent = 'Judul Diedit';
    heading.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
  })()`);
  assert(await win.webContents.executeJavaScript("document.querySelector('#item-notes').value.includes('# Judul Diedit') && document.querySelector('#item-notes').value.includes('- [ ] Tugas pertama') && document.querySelector('#item-notes').value.includes('| Kolom | Nilai |')"), 'Perubahan langsung dari Preview tidak dikonversi kembali ke Markdown.');
  await win.webContents.executeJavaScript("document.querySelector('.note-preview-check-toggle').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('#item-notes').value.includes('- [x] Tugas pertama')"), 'Checklist Preview tidak memperbarui Markdown note.');
  await win.webContents.executeJavaScript(`(() => {
    const input = document.querySelector('#item-notes');
    input.value = 'Satu\\nDua\\nTiga\\nEmpat';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const preview = document.querySelector('#note-preview');
    const range = document.createRange();
    range.selectNodeContents(preview);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    document.querySelector('[data-note-format=check]').click();
  })()`);
  const checklistValue = await win.webContents.executeJavaScript(`(() => {
    const value = document.querySelector('#item-notes').value;
    return { value, count: (value.match(/^- \\[ \\]/gm) || []).length };
  })()`);
  assert(checklistValue.count === 4, `Checklist toolbar tidak menerapkan checkbox ke semua baris yang dipilih: ${JSON.stringify(checklistValue.value)}`);
  const caretChecklistValue = await win.webContents.executeJavaScript(`(() => {
    const input = document.querySelector('#item-notes');
    input.value = '1\\n2\\n3\\n4';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    const preview = document.querySelector('#note-preview');
    const textNode = [...preview.querySelector('p').childNodes].find((node) => node.nodeType === Node.TEXT_NODE);
    const range = document.createRange();
    range.setStart(textNode, 1);
    range.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    document.querySelector('[data-note-format=check]').click();
    const value = input.value;
    return { value, count: (value.match(/^- \\[ \\]/gm) || []).length };
  })()`);
  assert(caretChecklistValue.count === 4, `Checklist toolbar tidak memecah baris saat caret berada di paragraf: ${JSON.stringify(caretChecklistValue.value)}`);
  await win.webContents.executeJavaScript(`(() => {
    const input = document.querySelector('#item-notes');
    input.value = 'Teks pilihan';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    input.setSelectionRange(0, input.value.length);
    document.querySelector('[data-note-format=bold]').click();
    return input.value;
  })()`);
  const boldValue = await win.webContents.executeJavaScript("document.querySelector('#item-notes').value");
  assert(boldValue === '**Teks pilihan**', `Format bold pada toolbar tidak bekerja: ${JSON.stringify(boldValue)}`);
  await win.webContents.executeJavaScript(`(() => {
    const input = document.querySelector('#item-notes');
    input.value = '';
    document.querySelector('[data-note-format=table]').click();
    document.querySelector('[data-note-format=callout]').click();
    return input.value;
  })()`);
  assert(await win.webContents.executeJavaScript("document.querySelector('#item-notes').value.includes('| Kolom 1 | Kolom 2 |') && document.querySelector('#item-notes').value.includes('Catatan')"), 'Insert tabel dan callout pada editor tidak bekerja.');
  await win.webContents.executeJavaScript("document.querySelector('#cancel-item').click(); document.querySelector('.tree-node[data-filter=all]').click();");
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
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=notes]').click(); document.querySelector('#sidebar-add-note-button').click();");
  await win.webContents.executeJavaScript(`
    document.querySelector('#item-title').value = 'Catatan QA';
    document.querySelector('#item-notes').value = 'Versi pertama note.';
    document.querySelector('#item-tags').value = 'qa, note';
    document.querySelector('#item-form').requestSubmit();
  `);
  await waitFor(win, "document.querySelector('#item-modal').classList.contains('hidden')");
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=all]').click();");
  await waitFor(win, "document.querySelector('.vault-item.note-card')");
  await win.webContents.executeJavaScript("document.querySelector('.vault-item.note-card').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#note-detail-modal').classList.contains('hidden') && document.querySelector('#note-detail-title').textContent === 'Catatan QA'"), 'Secure Note tidak dapat dibuka dari halaman Semua Item.');
  await win.webContents.executeJavaScript("document.querySelector('#close-note-detail').click(); document.querySelector('.tree-node[data-filter=notes]').click();");
  await waitFor(win, "document.querySelectorAll('.vault-item').length === 1");
  await win.webContents.executeJavaScript("document.querySelector('.vault-item').click()");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#note-detail-modal').classList.contains('hidden') && document.querySelector('#note-detail-title').textContent === 'Catatan QA' && document.querySelector('#note-detail-notes').textContent === 'Versi pertama note.'"), 'Secure Note tidak membuka popup detail saat kartunya diklik.');
  await win.webContents.executeJavaScript("document.querySelector('#note-detail-edit').click();");
  await waitFor(win, "!document.querySelector('#item-modal').classList.contains('hidden')");
  assert(await win.webContents.executeJavaScript("document.querySelector('#password-history-title').textContent.includes('Note History') && document.querySelector('#password-history-note').textContent.includes('catatan')"), 'Form Secure Note masih menampilkan Password History.');
  await win.webContents.executeJavaScript("document.querySelector('#item-notes').value = 'Versi kedua note.'; document.querySelector('#item-form').requestSubmit();");
  await waitFor(win, "document.querySelector('#item-modal').classList.contains('hidden')");
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=notes]').click();");
  await waitFor(win, "document.querySelector('.vault-item').textContent.includes('Catatan QA')");
  await win.webContents.executeJavaScript("document.querySelector('.vault-item').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('#note-detail-history-count').textContent.includes('1 versi') && document.querySelector('#note-detail-history-list').textContent.includes('Versi pertama note.')"), 'Riwayat perubahan Secure Note tidak tampil di popup detail.');
  assert(await win.webContents.executeJavaScript(`(() => {
    const entry = document.querySelector('#note-detail-history-list [data-note-history-expand]');
    return entry && entry.getAttribute('aria-expanded') === 'false' && !entry.classList.contains('is-expanded');
  })()`), 'Riwayat Secure Note tidak dimulai dalam keadaan compact.');
  await win.webContents.executeJavaScript("document.querySelector('#note-detail-history-list [data-note-history-expand]').click()");
  assert(await win.webContents.executeJavaScript(`(() => {
    const entry = document.querySelector('#note-detail-history-list [data-note-history-expand]');
    return entry.getAttribute('aria-expanded') === 'true' && entry.classList.contains('is-expanded');
  })()`), 'Riwayat Secure Note tidak dapat diperluas saat diklik.');
  await win.webContents.executeJavaScript("document.querySelector('#note-detail-history-list [data-note-history-expand]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))");
  assert(await win.webContents.executeJavaScript("document.querySelector('#note-detail-history-list [data-note-history-expand]').getAttribute('aria-expanded') === 'false'"), 'Riwayat Secure Note tidak dapat diringkas dengan keyboard.');
  await win.webContents.executeJavaScript("document.querySelector('#close-note-detail').click(); document.querySelector('[data-action=delete]').click();");
  await waitFor(win, "!document.querySelector('#confirm-modal').classList.contains('hidden')");
  await win.webContents.executeJavaScript("document.querySelector('#confirm-accept').click();");
  await waitFor(win, "document.querySelector('#item-count').textContent === '0 item'");
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=all]').click();");
  await win.webContents.executeJavaScript("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', ctrlKey: true, bubbles: true }))");
  assert(await win.webContents.executeJavaScript("!document.querySelector('#item-modal').classList.contains('hidden')"), 'Modal tambah item tidak terbuka.');
  assert(await win.webContents.executeJavaScript(`(() => {
    document.querySelector('#add-custom-field').click();
    const firstRow = document.querySelector('[data-field-row]:last-child');
    firstRow.querySelector('[data-field-label]').value = 'Contoh field';
    const check = (type, placeholder) => {
      const row = document.querySelector('[data-field-row]:last-child');
      const select = row.querySelector('[data-field-type]');
      select.value = type;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      const current = document.querySelector('[data-field-row]:last-child');
      const value = current.querySelector('[data-field-value]');
      return placeholder === undefined || value?.getAttribute('placeholder') === placeholder;
    };
    const text = check('text', 'Contoh: Nomor tiket atau kode akses');
    const secret = check('secret', 'Contoh: PIN atau kode pemulihan')
      && document.querySelector('[data-field-row]:last-child [data-custom-toggle]')?.getAttribute('aria-label') === 'Tampilkan secret field';
    const url = check('url', 'https://contoh.com');
    const email = check('email', 'nama@contoh.com');
    const number = check('number', 'Contoh: 12345')
      && document.querySelector('[data-field-row]:last-child [data-field-value]')?.getAttribute('type') === 'number';
    const boolean = check('boolean')
      && document.querySelector('[data-field-row]:last-child [data-field-value]')?.tagName === 'SELECT'
      && [...document.querySelectorAll('[data-field-row]:last-child [data-field-value] option')].map((option) => option.textContent).join('|') === 'Tidak|Ya';
    return text && secret && url && email && number && boolean;
  })()`), 'Custom field tidak menyesuaikan contoh input berdasarkan tipe yang dipilih.');
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
  assert(await win.webContents.executeJavaScript(`(() => {
    const selectors = ['.items-scroll', '.vault-tree', '.item-modal'];
    return selectors.every((selector) => getComputedStyle(document.querySelector(selector)).scrollBehavior === 'smooth');
  })()`), 'Scroll internal belum memakai perilaku smooth yang konsisten.');
  await win.webContents.executeJavaScript(`
    document.querySelector('#item-title').value = 'Item Baru E2E';
    document.querySelector('#item-username').value = 'e2e-user';
    document.querySelector('#item-password').value = 'e2e-secret-value';
    document.querySelector('#item-form').requestSubmit();
  `);
  await waitFor(win, "document.querySelector('#item-modal').classList.contains('hidden') && document.querySelectorAll('.vault-item').length === 3");
  assert(await win.webContents.executeJavaScript("[...document.querySelectorAll('.vault-item')].some((item) => item.textContent.includes('Item Baru E2E'))"), 'Item baru dari form UI tidak muncul setelah disimpan.');
  await win.webContents.executeJavaScript("document.querySelector('#settings-button').click()");
  assert(await win.webContents.executeJavaScript("document.querySelector('#settings-theme') && document.querySelector('#settings-theme').value === 'system'"), 'Pilihan tema Ikuti Windows tidak tampil sebagai default.');
  await win.webContents.executeJavaScript("(() => { const theme = document.querySelector('#settings-theme'); theme.value = 'dark'; theme.dispatchEvent(new Event('change', { bubbles: true })); })()");
  assert(await win.webContents.executeJavaScript("document.documentElement.dataset.theme === 'dark' && localStorage.getItem('passsa-theme') === 'dark'"), 'Mode tema gelap manual tidak diterapkan atau tidak tersimpan.');
  await win.webContents.executeJavaScript("document.querySelector('#close-settings').click(); document.querySelector('.tree-node[data-filter=tags]').click()");
  assert(await win.webContents.executeJavaScript("(() => { const card = document.querySelector('.tag-overview-card'); return card && getComputedStyle(card).backgroundColor !== 'rgb(255, 255, 255)' && getComputedStyle(document.querySelector('.tag-overview-name')).color !== 'rgb(38, 48, 68)'; })()"), 'Kartu menu Tags belum menyesuaikan tema gelap.');
  await win.webContents.executeJavaScript("document.querySelector('.tree-node[data-filter=all]').click(); document.querySelector('#settings-button').click()");
  await win.webContents.executeJavaScript("(() => { const theme = document.querySelector('#settings-theme'); theme.value = 'light'; theme.dispatchEvent(new Event('change', { bubbles: true })); })()");
  assert(await win.webContents.executeJavaScript("document.documentElement.dataset.theme === 'light'"), 'Mode tema terang manual tidak diterapkan.');
  await win.webContents.executeJavaScript("(() => { const theme = document.querySelector('#settings-theme'); theme.value = 'system'; theme.dispatchEvent(new Event('change', { bubbles: true })); document.querySelector('#close-settings').click(); })()");
  assert(await win.webContents.executeJavaScript("document.documentElement.dataset.themePreference === 'system' && document.querySelector('#settings-modal').classList.contains('hidden')"), 'Mode Ikuti Windows tidak dapat dipulihkan atau pengaturan tidak tertutup.');
  if (!skipGoogle) {
    assert(await win.webContents.executeJavaScript("!document.querySelector('#google-login-button') && document.querySelector('#settings-button')"), 'Google masih tampil sebagai metode login awal.');
    await win.webContents.executeJavaScript("document.querySelector('#settings-button').click()");
    assert(await win.webContents.executeJavaScript("!document.querySelector('#settings-modal').classList.contains('hidden') && document.querySelector('#settings-google-connect').textContent.includes('Hubungkan')"), 'Pengaturan Cloud Sync Google tidak tampil.');
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-startup') && document.querySelector('#settings-minimize-tray') && document.querySelector('#settings-quick-access')"), 'Pengaturan startup, system tray, dan Quick Access tidak tampil.');
    assert(await win.webContents.executeJavaScript("document.querySelector('#settings-autofill-heading')?.closest('.settings-section')?.classList.contains('hidden') && document.querySelector('#settings-hello-heading')?.closest('.settings-section')?.classList.contains('hidden')"), 'Panel Windows Hello dan Autofill Browser belum disembunyikan sementara.');
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
  console.log(`E2E smoke lulus: login lokal, tema system/light/dark, render vault, kategori collapsed, insight Noted/New Noted, pencarian/chip tags, edit credential lama, tambah/simpan item, layout responsive${skipGoogle ? '' : ', dan Google hanya tersedia di Pengaturan Cloud Sync'}.`);
  win.destroy();
  app.quit();
}).catch((error) => {
  console.error(error.stack || error.message);
  app.exit(1);
});
