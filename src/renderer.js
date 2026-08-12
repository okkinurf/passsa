const authView = document.querySelector('#auth-view');
const vaultView = document.querySelector('#vault-view');
const form = document.querySelector('#auth-form');
const loginTab = document.querySelector('#login-tab');
const registerTab = document.querySelector('#register-tab');
const title = document.querySelector('#form-title');
const subtitle = document.querySelector('#form-subtitle');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#message');
const submitButton = document.querySelector('#submit-button');
const togglePassword = document.querySelector('#toggle-password');
const googleLoginButton = document.querySelector('#google-login-button');
const syncButton = document.querySelector('#sync-button');
const logoutButton = document.querySelector('#logout-button');
const itemModal = document.querySelector('#item-modal');
const itemForm = document.querySelector('#item-form');
const itemsList = document.querySelector('#items-list');
const itemsHeader = document.querySelector('#items-header');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search-input');
const itemCount = document.querySelector('#item-count');
const itemMessage = document.querySelector('#item-message');
const clearFilterButton = document.querySelector('#clear-filter-button');
const bulkToolbar = document.querySelector('#bulk-toolbar');
const selectedCount = document.querySelector('#selected-count');
const selectAll = document.querySelector('#select-all');
const bulkModal = document.querySelector('#bulk-modal');
const bulkForm = document.querySelector('#bulk-form');
const vaultNotice = document.querySelector('#vault-notice');
const sortSelect = document.querySelector('#sort-select');
const categoryModal = document.querySelector('#category-modal');
const categoryForm = document.querySelector('#category-form');
const tagInput = document.querySelector('#item-tags');
const tagSuggestions = document.querySelector('#tag-suggestions');
const tagSearchInput = document.querySelector('#tag-search-input');
const tagList = document.querySelector('#tag-list');
const tagEmpty = document.querySelector('#tag-empty');
const sidebarResizer = document.querySelector('#sidebar-resizer');
const sidebarAddItemButton = document.querySelector('#sidebar-add-item-button');
const sidebarAddTagButton = document.querySelector('#sidebar-add-tag-button');
const SIDEBAR_WIDTH_KEY = 'passsa-sidebar-width';
const MIN_SIDEBAR_WIDTH = 190;
const MAX_SIDEBAR_WIDTH = 420;
const IDLE_LOCK_MS = 5 * 60 * 1000;
let items = [];
let categories = [];
let categoryIcons = [];
let selectedCategoryIcon = 'folder';
let visibleItems = [];
const selectedIds = new Set();
const collapsedBranches = new Set();
let mode = 'login';
let googleEmail = null;
let googleChallengeId = null;
let currentFilter = 'all';
let currentGroup = null;
let currentGroupPrefix = null;
let currentTag = null;
let idleLockTimer;
let initializeSidebarCollapsed = true;

function clampSidebarWidth(width) {
  const availableWidth = Math.max(MIN_SIDEBAR_WIDTH, window.innerWidth - 520);
  return Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH, availableWidth);
}

function setSidebarWidth(width, persist = false) {
  const nextWidth = clampSidebarWidth(Number(width) || 210);
  vaultView.style.setProperty('--sidebar-width', `${nextWidth}px`);
  sidebarResizer.setAttribute('aria-valuemin', String(MIN_SIDEBAR_WIDTH));
  sidebarResizer.setAttribute('aria-valuemax', String(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, window.innerWidth - 520))));
  sidebarResizer.setAttribute('aria-valuenow', String(nextWidth));
  if (persist) localStorage.setItem(SIDEBAR_WIDTH_KEY, String(nextWidth));
}

function setupSidebarResize() {
  setSidebarWidth(localStorage.getItem(SIDEBAR_WIDTH_KEY) || 210);

  sidebarResizer.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    sidebarResizer.setPointerCapture(event.pointerId);
    document.body.classList.add('resizing-sidebar');
  });

  sidebarResizer.addEventListener('pointermove', (event) => {
    if (!sidebarResizer.hasPointerCapture(event.pointerId)) return;
    setSidebarWidth(event.clientX);
  });

  sidebarResizer.addEventListener('pointerup', (event) => {
    if (!sidebarResizer.hasPointerCapture(event.pointerId)) return;
    sidebarResizer.releasePointerCapture(event.pointerId);
    document.body.classList.remove('resizing-sidebar');
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(document.querySelector('.sidebar').offsetWidth));
  });

  sidebarResizer.addEventListener('pointercancel', () => {
    document.body.classList.remove('resizing-sidebar');
  });

  sidebarResizer.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentWidth = document.querySelector('.sidebar').offsetWidth;
    const nextWidth = event.key === 'Home'
      ? MIN_SIDEBAR_WIDTH
      : event.key === 'End'
        ? MAX_SIDEBAR_WIDTH
        : currentWidth + (event.key === 'ArrowRight' ? 12 : -12);
    setSidebarWidth(nextWidth, true);
  });

  window.addEventListener('resize', () => setSidebarWidth(document.querySelector('.sidebar').offsetWidth));
}

setupSidebarResize();

function setMode(nextMode) {
  mode = nextMode;
  googleEmail = null;
  googleChallengeId = null;
  emailInput.readOnly = false;
  const registering = mode === 'register';
  document.querySelector('.tabs').dataset.mode = registering ? 'register' : 'login';
  loginTab.classList.toggle('active', !registering);
  registerTab.classList.toggle('active', registering);
  loginTab.setAttribute('aria-selected', String(!registering));
  registerTab.setAttribute('aria-selected', String(registering));
  title.textContent = registering ? 'Buat akun testing' : 'Selamat datang';
  subtitle.textContent = registering
    ? 'Akun ini hanya tersimpan di komputer Anda.'
    : 'Masuk menggunakan akun testing Anda.';
  submitButton.textContent = registering ? 'Buat Akun' : 'Masuk';
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  form.reset();
  setMessage('');
  emailInput.focus();
}

function setMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle('success', success);
}

async function showVault(user) {
  document.querySelector('#user-email').textContent = user.email;
  document.querySelector('#user-avatar').textContent = user.email.charAt(0).toUpperCase();
  document.querySelector('.sidebar-user small').textContent = user.provider === 'google' ? 'Google Drive terhubung' : 'Vault lokal';
  authView.classList.add('hidden');
  vaultView.classList.remove('hidden');
  initializeSidebarCollapsed = true;
  await loadItems();
  resetIdleLock();
}

function clearVaultState() {
  clearTimeout(idleLockTimer);
  items = [];
  categories = [];
  visibleItems = [];
  selectedIds.clear();
  currentFilter = 'all';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = null;
  collapsedBranches.clear();
  initializeSidebarCollapsed = true;
  itemForm.reset();
  bulkForm.reset();
  categoryForm.reset();
  document.querySelector('#item-password').value = '';
  itemsList.replaceChildren();
  document.querySelector('#custom-categories-tree').replaceChildren();
  clearFilterButton.classList.add('hidden');
  tagSearchInput.value = '';
  tagList.replaceChildren();
  tagEmpty.classList.add('hidden');
  itemModal.classList.add('hidden');
  bulkModal.classList.add('hidden');
  categoryModal.classList.add('hidden');
  vaultNotice.classList.add('hidden');
}

function collapseAllSidebarBranches() {
  collapsedBranches.clear();
  collapsedBranches.add('tags-tree');
  const parentPaths = new Set(categories.map((category) => category.parentPath).filter(Boolean));
  for (const category of categories) {
    if (parentPaths.has(category.path)) collapsedBranches.add(`category-branch-${category.id}`);
  }
  const tagsTree = document.querySelector('#tags-tree');
  const tagsToggle = document.querySelector('.tree-toggle[data-target="tags-tree"]');
  tagsTree.classList.add('collapsed');
  tagsToggle?.classList.add('collapsed');
  tagsToggle?.setAttribute('aria-expanded', 'false');
}

function showAuth(reason = '') {
  clearVaultState();
  vaultView.classList.add('hidden');
  authView.classList.remove('hidden');
  setMode('login');
  if (reason) setMessage(reason);
}

function resetIdleLock() {
  clearTimeout(idleLockTimer);
  if (vaultView.classList.contains('hidden')) return;
  idleLockTimer = setTimeout(() => window.passsa.lock(), IDLE_LOCK_MS);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function tagTone(tag) {
  const hash = [...String(tag)].reduce((total, character) => total + character.charCodeAt(0), 0);
  return ['rose', 'amber', 'teal', 'blue', 'violet'][hash % 5];
}

function renderItems() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const belongsToView = currentFilter === 'trash'
      ? Boolean(item.deletedAt)
      : !item.deletedAt
        && (currentFilter !== 'favorites' || item.favorite)
        && (currentFilter !== 'tags' || (item.tags ?? []).length > 0)
        && (!currentGroup || item.group === currentGroup)
        && (!currentGroupPrefix || item.group === currentGroupPrefix || item.group.startsWith(`${currentGroupPrefix}/`))
        && (!currentTag || (item.tags ?? []).some((tag) => tag.toLowerCase() === currentTag.toLowerCase()));
    const matchesSearch = [item.title, item.username, item.url, item.notes, item.group, ...(item.tags ?? [])]
      .some((value) => String(value).toLowerCase().includes(query));
    return belongsToView && matchesSearch;
  }).sort(compareItems);
  visibleItems = filtered;
  itemCount.textContent = `${filtered.length} item`;
  emptyState.classList.toggle('hidden', filtered.length > 0);
  itemsList.classList.toggle('hidden', filtered.length === 0);
  itemsHeader.classList.toggle('hidden', filtered.length === 0);
  if (filtered.length === 0) {
    emptyState.querySelector('h3').textContent = items.length ? 'Item tidak ditemukan' : 'Vault Anda masih kosong';
    emptyState.querySelector('p').textContent = items.length
      ? 'Coba gunakan kata pencarian yang berbeda.'
      : 'Tambahkan login pertama Anda. Data akan dienkripsi dan disimpan hanya di komputer ini.';
  }
  itemsList.innerHTML = filtered.map((item, index) => `
    <article class="vault-item ${selectedIds.has(item.id) ? 'selected' : ''}" data-id="${escapeHtml(item.id)}" style="--item-index: ${Math.min(index, 10)}">
      <input class="item-select" type="checkbox" data-select-id="${escapeHtml(item.id)}" aria-label="Pilih ${escapeHtml(item.title)}" ${selectedIds.has(item.id) ? 'checked' : ''} />
      <div class="item-logo">${escapeHtml(item.title.charAt(0).toUpperCase())}</div>
      <div class="item-main"><strong>${item.favorite ? '★ ' : ''}${escapeHtml(item.title)}</strong><small>${escapeHtml(item.group || 'Umum')} · ${escapeHtml(item.url || 'Login lokal')}</small></div>
      <div class="item-tags-cell">${(item.tags ?? []).length ? `<div class="item-tags">${item.tags.slice(0, 2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}${item.tags.length > 2 ? `<button class="tag-overflow-toggle" type="button" data-tag-overflow="true" aria-expanded="false" aria-label="Lihat ${item.tags.length - 2} tags lainnya">+${item.tags.length - 2}</button><span class="tag-overflow-menu" role="listbox">${item.tags.slice(2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}</span>` : ''}</div>` : '<span class="item-muted">—</span>'}</div>
      <div class="item-login"><span>${escapeHtml(item.username || 'Tanpa username')}</span><small class="item-usage">Dipakai ${item.usageCount ?? 0} kali</small></div>
      <div class="item-actions">
        ${item.deletedAt ? `
          <button class="item-action" data-action="restore" title="Pulihkan" aria-label="Pulihkan ${escapeHtml(item.title)}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button>
          <button class="item-action danger" data-action="purge" title="Hapus permanen" aria-label="Hapus permanen ${escapeHtml(item.title)}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        ` : `
          <button class="item-action" data-action="favorite" title="Favorit" aria-label="${item.favorite ? 'Hapus dari' : 'Tambahkan ke'} favorit: ${escapeHtml(item.title)}"><i class="fa-${item.favorite ? 'solid' : 'regular'} fa-star" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-user" title="Salin username" aria-label="Salin username ${escapeHtml(item.title)}"><i class="fa-solid fa-user" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-password" title="Salin password" aria-label="Salin password ${escapeHtml(item.title)}"><i class="fa-solid fa-key" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-url" title="Salin alamat situs" aria-label="Salin alamat situs ${escapeHtml(item.title)}"><i class="fa-solid fa-link" aria-hidden="true"></i></button>
          <button class="item-action" data-action="edit" title="Edit" aria-label="Edit ${escapeHtml(item.title)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>
          <button class="item-action danger" data-action="delete" title="Pindah ke Sampah" aria-label="Pindahkan ${escapeHtml(item.title)} ke Sampah"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        `}
      </div>
      <div class="item-description">
        <span>${escapeHtml(item.notes || 'Tidak ada deskripsi')}</span>
      </div>
    </article>
  `).join('');
  syncBulkToolbar();
  renderTagTree();
  renderCustomCategories();
}

function compareItems(left, right) {
  const time = (value) => value ? Date.parse(value) || 0 : 0;
  if (sortSelect.value === 'frequent') {
    return (right.usageCount ?? 0) - (left.usageCount ?? 0)
      || time(right.lastUsedAt) - time(left.lastUsedAt)
      || time(right.updatedAt) - time(left.updatedAt);
  }
  if (sortSelect.value === 'newest') {
    return time(right.createdAt) - time(left.createdAt)
      || time(right.updatedAt) - time(left.updatedAt);
  }
  if (sortSelect.value === 'recently-used') {
    return time(right.lastUsedAt) - time(left.lastUsedAt)
      || (right.usageCount ?? 0) - (left.usageCount ?? 0);
  }
  if (sortSelect.value === 'tags') {
    return (left.tags ?? []).join(',').localeCompare((right.tags ?? []).join(','), 'id', { sensitivity: 'base' });
  }
  return left.title.localeCompare(right.title, 'id', { sensitivity: 'base' });
}

function renderTagTree() {
  const counts = new Map();
  for (const item of items) {
    if (item.deletedAt) continue;
    for (const tag of item.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const query = tagSearchInput.value.trim().toLowerCase();
  const matches = [...counts.entries()]
    .filter(([tag]) => !query || tag.toLowerCase().includes(query))
    .sort(([left], [right]) => left.localeCompare(right))
  tagList.innerHTML = matches
    .map(([tag, count]) => `<button class="sidebar-tag-chip tone-${tagTone(tag)} ${currentTag === tag ? 'active' : ''}" type="button" data-tag="${escapeHtml(tag)}" data-title="Tag: ${escapeHtml(tag)}" title="#${escapeHtml(tag)} (${count})"><span>#${escapeHtml(tag)}</span><small>${count}</small></button>`)
    .join('');
  tagEmpty.textContent = counts.size === 0 ? 'Belum ada tag.' : 'Tag tidak ditemukan.';
  tagEmpty.classList.toggle('hidden', matches.length > 0);
}

function knownTags() {
  return [...new Set(items
    .filter((item) => !item.deletedAt)
    .flatMap((item) => item.tags ?? []))]
    .sort((left, right) => left.localeCompare(right, 'id', { sensitivity: 'base' }));
}

function renderTagSuggestions() {
  if (!tagSuggestions || itemModal.classList.contains('hidden')) return;
  const value = tagInput.value;
  const current = value.slice(value.lastIndexOf(',') + 1).trim().toLowerCase();
  const selected = new Set(value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean));
  const matches = knownTags()
    .filter((tag) => !selected.has(tag.toLowerCase()) && (!current || tag.toLowerCase().includes(current)))
    .slice(0, 8);
  tagSuggestions.innerHTML = matches.map((tag) => `<button class="tag-suggestion" type="button" role="option" data-tag-suggestion="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`).join('');
  tagSuggestions.classList.toggle('hidden', matches.length === 0);
}

function renderCustomCategories() {
  const tree = document.querySelector('#custom-categories-tree');
  const childrenByParent = new Map();
  const knownPaths = new Set(categories.map((category) => category.path));
  for (const category of categories) {
    const parent = category.parentPath && knownPaths.has(category.parentPath) ? category.parentPath : '';
    if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
    childrenByParent.get(parent).push(category);
  }

  const renderBranch = (parentPath = '') => (childrenByParent.get(parentPath) ?? [])
    .sort((left, right) => left.name.localeCompare(right.name, 'id'))
    .map((category) => {
      const children = childrenByParent.get(category.path) ?? [];
      const branchId = `category-branch-${category.id}`;
      const active = currentGroupPrefix === category.path ? 'active' : '';
      const collapsed = collapsedBranches.has(branchId);
      return `
        <div class="custom-category">
          <div class="tree-row custom-tree-row">
            ${children.length
              ? `<button class="tree-toggle ${collapsed ? 'collapsed' : ''}" type="button" data-target="${escapeHtml(branchId)}" aria-label="Buka atau tutup ${escapeHtml(category.name)}" aria-expanded="${String(!collapsed)}">▾</button>`
              : '<span class="tree-spacer"></span>'}
            <button class="tree-node ${active}" type="button" data-group-prefix="${escapeHtml(category.path)}" data-title="${escapeHtml(category.name)}"><i class="fa-solid fa-${escapeHtml(category.icon)}"></i><span>${escapeHtml(category.name)}</span></button>
            <button class="category-edit" type="button" data-category-id="${escapeHtml(category.id)}" title="Edit kategori" aria-label="Edit kategori ${escapeHtml(category.name)}"><i class="fa-solid fa-ellipsis"></i></button>
          </div>
          ${children.length ? `<div id="${escapeHtml(branchId)}" class="custom-category-children ${collapsed ? 'collapsed' : ''}">${renderBranch(category.path)}</div>` : ''}
        </div>`;
    }).join('');

  tree.innerHTML = renderBranch();

  const datalist = document.querySelector('#group-options');
  datalist.querySelectorAll('[data-custom-option]').forEach((option) => option.remove());
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category.path;
    option.dataset.customOption = 'true';
    datalist.append(option);
  }
}

function syncBulkToolbar() {
  const selectedVisible = visibleItems.filter((item) => selectedIds.has(item.id));
  selectedCount.textContent = `${selectedIds.size} dipilih`;
  bulkToolbar.classList.toggle('hidden', selectedIds.size === 0);
  const allVisibleSelected = visibleItems.length > 0 && selectedVisible.length === visibleItems.length;
  selectAll.checked = allVisibleSelected;
  selectAll.indeterminate = selectedVisible.length > 0 && !allVisibleSelected;
  const trashMode = currentFilter === 'trash';
  document.querySelector('#bulk-edit-button').classList.toggle('hidden', trashMode);
  document.querySelector('#bulk-restore-button').classList.toggle('hidden', !trashMode);
  document.querySelector('#bulk-delete-button').textContent = trashMode ? 'Hapus Permanen' : 'Pindah ke Sampah';
}

function clearSelection() {
  selectedIds.clear();
  renderItems();
}

let noticeTimer;
function showVaultNotice(text, isError = false) {
  clearTimeout(noticeTimer);
  vaultNotice.textContent = text;
  vaultNotice.classList.remove('notice-pop');
  void vaultNotice.offsetWidth;
  vaultNotice.classList.remove('hidden');
  vaultNotice.classList.toggle('error', isError);
  vaultNotice.classList.add('notice-pop');
  noticeTimer = setTimeout(() => vaultNotice.classList.add('hidden'), 4000);
}

function showAllItems() {
  currentFilter = 'all';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = null;
  document.querySelectorAll('.tree-node').forEach((node) => node.classList.remove('active'));
  document.querySelector('.tree-node[data-filter="all"]').classList.add('active');
  document.querySelector('.vault-content h2').textContent = 'Semua Item';
  clearFilterButton.classList.add('hidden');
}

async function loadItems() {
  try {
    [items, categories, categoryIcons] = await Promise.all([
      window.passsa.listItems(),
      window.passsa.listCategories(),
      categoryIcons.length ? Promise.resolve(categoryIcons) : window.passsa.listCategoryIcons(),
    ]);
    if (initializeSidebarCollapsed) {
      collapseAllSidebarBranches();
      initializeSidebarCollapsed = false;
    }
    selectedIds.clear();
    renderItems();
  } catch (error) {
    showVaultNotice(error.message || 'Vault tidak dapat dibuka.', true);
  }
}

function openItemModal(item = null) {
  itemForm.reset();
  itemMessage.textContent = '';
  document.querySelector('#modal-title').textContent = item ? 'Edit Item' : 'Tambah Item';
  document.querySelector('#item-id').value = item?.id ?? '';
  document.querySelector('#item-title').value = item?.title ?? '';
  document.querySelector('#item-username').value = item?.username ?? '';
  document.querySelector('#item-password').value = item?.password ?? '';
  document.querySelector('#item-password').type = 'password';
  document.querySelector('#toggle-item-password').textContent = 'Lihat';
  document.querySelector('#item-url').value = item?.url ?? '';
  document.querySelector('#item-group').value = item?.group ?? currentGroup ?? currentGroupPrefix ?? 'Internet/Coding';
  document.querySelector('#item-favorite').checked = item ? Boolean(item.favorite) : currentFilter === 'favorites';
  document.querySelector('#item-notes').value = item?.notes ?? '';
  document.querySelector('#item-tags').value = item ? (item.tags ?? []).join(', ') : (currentTag ?? '');
  itemModal.classList.remove('hidden');
  document.querySelector('#item-title').focus();
}

function closeItemModal() {
  document.querySelector('#item-password').value = '';
  tagSuggestions.classList.add('hidden');
  itemModal.classList.add('hidden');
  itemForm.reset();
}

loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));

googleLoginButton.addEventListener('click', async () => {
  googleLoginButton.disabled = true;
  googleLoginButton.textContent = 'Membuka Google…';
  setMessage('');
  try {
    const result = await window.passsa.googleLogin();
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    if (result.autoCompleted) {
      await showVault(result.user);
      if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
      return;
    }
    googleEmail = result.profile.email;
    googleChallengeId = result.challengeId;
    emailInput.value = googleEmail;
    emailInput.readOnly = true;
    title.textContent = 'Buka vault';
    subtitle.textContent = 'Google terverifikasi. Masukkan password vault lokal Anda.';
    submitButton.textContent = 'Buka Vault';
    setMessage('Identitas Google terverifikasi.', true);
    passwordInput.focus();
  } catch {
    setMessage('Login Google gagal. Silakan coba lagi.');
  } finally {
    googleLoginButton.disabled = false;
    googleLoginButton.innerHTML = '<span class="google-g">G</span> Lanjutkan dengan Google';
  }
});

togglePassword.addEventListener('click', () => {
  const visible = passwordInput.type === 'text';
  passwordInput.type = visible ? 'password' : 'text';
  togglePassword.textContent = visible ? 'Lihat' : 'Sembunyi';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = mode === 'register' ? 'Membuat akun…' : googleEmail ? 'Membuka vault…' : 'Memeriksa…';
  try {
    const result = googleEmail
      ? await window.passsa.googleComplete(googleChallengeId, passwordInput.value)
      : await (mode === 'register' ? window.passsa.register : window.passsa.login)(emailInput.value, passwordInput.value);
    passwordInput.value = '';
    if (result.ok) {
      await showVault(result.user);
      if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
    } else {
      setMessage(result.message);
    }
  } catch {
    setMessage('Terjadi kesalahan. Silakan coba lagi.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = mode === 'register' ? 'Buat Akun' : googleEmail ? 'Buka Vault' : 'Masuk';
  }
});

syncButton.addEventListener('click', async () => {
  syncButton.disabled = true;
  try {
    const result = await window.passsa.syncNow();
    showVaultNotice(result.message || 'Sinkronisasi selesai.', !result.ok);
    if (result.status === 'downloaded') await loadItems();
  } catch (error) {
    showVaultNotice(error.message || 'Sinkronisasi Google Drive gagal.', true);
  } finally {
    syncButton.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  await window.passsa.logout();
  if (!vaultView.classList.contains('hidden')) showAuth('Anda telah keluar.');
});

document.querySelector('#close-modal').addEventListener('click', closeItemModal);
document.querySelector('#cancel-item').addEventListener('click', closeItemModal);
sidebarAddItemButton.addEventListener('click', () => openItemModal());
sidebarAddTagButton.addEventListener('click', () => {
  openItemModal();
  requestAnimationFrame(() => {
    itemMessage.textContent = 'Tambahkan tag baru pada credential ini.';
    tagInput.focus();
  });
});
searchInput.addEventListener('input', renderItems);
tagSearchInput.addEventListener('input', renderTagTree);
sortSelect.addEventListener('change', renderItems);
clearFilterButton.addEventListener('click', () => {
  showAllItems();
  searchInput.value = '';
  document.querySelector('.items-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  renderItems();
});
document.querySelector('#items-header').addEventListener('click', (event) => {
  const button = event.target.closest('[data-sort-column]');
  if (!button) return;
  sortSelect.value = button.dataset.sortColumn;
  renderItems();
});
document.querySelector('.vault-tree').addEventListener('click', (event) => {
  const toggleButton = event.target.closest('.tree-toggle');
  if (toggleButton) {
    const target = toggleButton.dataset.target;
    const branch = document.querySelector(`#${target}`);
    branch?.classList.toggle('collapsed');
    toggleButton.classList.toggle('collapsed');
    toggleButton.setAttribute('aria-expanded', String(!branch?.classList.contains('collapsed')));
    if (branch?.classList.contains('collapsed')) collapsedBranches.add(target);
    else collapsedBranches.delete(target);
    return;
  }
  const editButton = event.target.closest('[data-category-id]');
  if (editButton) {
    const category = categories.find((item) => item.id === editButton.dataset.categoryId);
    if (category) openCategoryModal(category);
    return;
  }
  const button = event.target.closest('.tree-node, .sidebar-tag-chip');
  if (!button) return;
    currentFilter = button.dataset.filter ?? 'group';
    currentGroup = button.dataset.group ?? null;
    currentGroupPrefix = button.dataset.groupPrefix ?? null;
    currentTag = button.dataset.tag ?? null;
    selectedIds.clear();
    document.querySelectorAll('.tree-node').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelector('.vault-content h2').textContent = button.dataset.title;
    clearFilterButton.classList.toggle('hidden', currentFilter === 'all');
    renderItems();
});

function populateCategoryParents(category = null) {
  const select = document.querySelector('#category-parent');
  const blockedPath = category?.path ?? '';
  const paths = categories.map((item) => item.path)
    .filter((path) => !blockedPath || (path !== blockedPath && !path.startsWith(`${blockedPath}/`)))
    .sort((left, right) => left.localeCompare(right));
  select.innerHTML = '<option value="">Tanpa parent</option>'
    + paths.map((path) => `<option value="${escapeHtml(path)}">${escapeHtml(path)}</option>`).join('');
}

function openCategoryModal(category = null) {
  categoryForm.reset();
  document.querySelector('#category-message').textContent = '';
  document.querySelector('#category-modal-title').textContent = category ? 'Edit Kategori' : 'Buat Kategori';
  document.querySelector('#category-id').value = category?.id ?? '';
  document.querySelector('#category-name').value = category?.name ?? '';
  populateCategoryParents(category);
  document.querySelector('#category-parent').value = category?.parentPath ?? currentGroup ?? currentGroupPrefix ?? '';
  document.querySelector('#delete-category').classList.toggle('hidden', !category);
  selectedCategoryIcon = category?.icon ?? 'folder';
  document.querySelector('#icon-search').value = '';
  renderIconPicker();
  categoryModal.classList.remove('hidden');
  document.querySelector('#category-name').focus();
}

function renderIconPicker() {
  const query = document.querySelector('#icon-search').value.trim().toLowerCase();
  const matches = categoryIcons.filter((icon) => !query || icon.includes(query));
  const visible = matches
    .sort((left, right) => left === selectedCategoryIcon ? -1 : right === selectedCategoryIcon ? 1 : left.localeCompare(right))
    .slice(0, 180);
  document.querySelector('#icon-result-count').textContent = `${matches.length} ikon ditemukan${matches.length > visible.length ? ` · menampilkan ${visible.length}` : ''}`;
  document.querySelector('#icon-picker').innerHTML = visible.map((icon) => `
    <label class="icon-option" title="${escapeHtml(icon)}">
      <input type="radio" name="category-icon" value="${escapeHtml(icon)}" ${icon === selectedCategoryIcon ? 'checked' : ''} />
      <span><i class="fa-solid fa-${escapeHtml(icon)}"></i></span>
    </label>
  `).join('');
}

document.querySelector('#icon-search').addEventListener('input', renderIconPicker);
document.querySelector('#icon-picker').addEventListener('change', (event) => {
  if (event.target.name === 'category-icon') selectedCategoryIcon = event.target.value;
});

function closeCategoryModal() {
  categoryModal.classList.add('hidden');
  categoryForm.reset();
}

document.querySelector('#add-category-button').addEventListener('click', () => openCategoryModal());
document.querySelector('#close-category-modal').addEventListener('click', closeCategoryModal);
document.querySelector('#cancel-category').addEventListener('click', closeCategoryModal);
categoryModal.addEventListener('click', (event) => {
  if (event.target === categoryModal) closeCategoryModal();
});

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!categoryForm.reportValidity()) return;
  const payload = {
    id: document.querySelector('#category-id').value,
    name: document.querySelector('#category-name').value,
    parentPath: document.querySelector('#category-parent').value,
    icon: selectedCategoryIcon,
  };
  try {
    if (payload.id) await window.passsa.updateCategory(payload);
    else await window.passsa.createCategory(payload);
    closeCategoryModal();
    await loadItems();
    showVaultNotice(`Kategori “${payload.name}” berhasil disimpan.`);
  } catch (error) {
    document.querySelector('#category-message').textContent = error.message || 'Kategori gagal disimpan.';
  }
});

document.querySelector('#delete-category').addEventListener('click', async () => {
  const id = document.querySelector('#category-id').value;
  const category = categories.find((item) => item.id === id);
  if (!category || !confirm(`Hapus kategori “${category.name}”? Subkategori juga dihapus dan item dipindahkan ke parent.`)) return;
  try {
    await window.passsa.deleteCategory(id);
    closeCategoryModal();
    showAllItems();
    await loadItems();
    showVaultNotice(`Kategori “${category.name}” dihapus.`);
  } catch (error) {
    document.querySelector('#category-message').textContent = error.message || 'Kategori gagal dihapus.';
  }
});

selectAll.addEventListener('change', () => {
  for (const item of visibleItems) {
    if (selectAll.checked) selectedIds.add(item.id);
    else selectedIds.delete(item.id);
  }
  renderItems();
});

itemsList.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-select-id]');
  if (!checkbox) return;
  if (checkbox.checked) selectedIds.add(checkbox.dataset.selectId);
  else selectedIds.delete(checkbox.dataset.selectId);
  renderItems();
});

document.querySelector('#clear-selection').addEventListener('click', clearSelection);

function openBulkModal() {
  bulkForm.reset();
  document.querySelector('#bulk-message').textContent = '';
  bulkModal.classList.remove('hidden');
  document.querySelector('#bulk-group').focus();
}

function closeBulkModal() {
  bulkModal.classList.add('hidden');
  bulkForm.reset();
}

document.querySelector('#bulk-edit-button').addEventListener('click', openBulkModal);
document.querySelector('#close-bulk-modal').addEventListener('click', closeBulkModal);
document.querySelector('#cancel-bulk').addEventListener('click', closeBulkModal);
bulkModal.addEventListener('click', (event) => {
  if (event.target === bulkModal) closeBulkModal();
});

bulkForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const favoriteValue = document.querySelector('#bulk-favorite').value;
  const changes = {
    group: document.querySelector('#bulk-group').value.trim() || undefined,
    favorite: favoriteValue === 'unchanged' ? undefined : favoriteValue === 'true',
    tagMode: document.querySelector('#bulk-tag-mode').value,
    tags: document.querySelector('#bulk-tags').value,
  };
  if (changes.group === undefined && changes.favorite === undefined && changes.tagMode === 'unchanged') {
    document.querySelector('#bulk-message').textContent = 'Pilih minimal satu perubahan.';
    return;
  }
  if (['add', 'remove'].includes(changes.tagMode) && !changes.tags.trim()) {
    document.querySelector('#bulk-message').textContent = 'Isi tags yang ingin ditambah atau dihapus.';
    return;
  }
  try {
    await window.passsa.bulkUpdate([...selectedIds], changes);
    closeBulkModal();
    await loadItems();
  } catch (error) {
    document.querySelector('#bulk-message').textContent = error.message || 'Edit bulk gagal.';
  }
});

document.querySelector('#bulk-delete-button').addEventListener('click', async () => {
  const ids = [...selectedIds];
  if (!ids.length) return;
  const permanent = currentFilter === 'trash';
  const prompt = permanent
    ? `Hapus permanen ${ids.length} item? Tindakan ini tidak dapat dibatalkan.`
    : `Pindahkan ${ids.length} item ke Recycle Bin?`;
  if (!confirm(prompt)) return;
  try {
    if (permanent) await window.passsa.bulkPurge(ids);
    else await window.passsa.bulkDelete(ids);
    await loadItems();
  } catch (error) {
    showVaultNotice(error.message || 'Item gagal dihapus.', true);
  }
});

document.querySelector('#bulk-restore-button').addEventListener('click', async () => {
  const ids = [...selectedIds];
  if (!ids.length) return;
  try {
    await window.passsa.bulkRestore(ids);
    await loadItems();
  } catch (error) {
    showVaultNotice(error.message || 'Item gagal dipulihkan.', true);
  }
});

document.querySelector('#toggle-item-password').addEventListener('click', (event) => {
  const input = document.querySelector('#item-password');
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? 'Lihat' : 'Sembunyi';
});

document.querySelector('#generate-password').addEventListener('click', () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  const bytes = new Uint32Array(20);
  crypto.getRandomValues(bytes);
  document.querySelector('#item-password').value = Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('');
  document.querySelector('#item-password').type = 'text';
  document.querySelector('#toggle-item-password').textContent = 'Sembunyi';
});

tagInput.addEventListener('input', renderTagSuggestions);
tagInput.addEventListener('focus', renderTagSuggestions);
tagSuggestions.addEventListener('pointerdown', (event) => {
  const suggestion = event.target.closest('[data-tag-suggestion]');
  if (!suggestion) return;
  event.preventDefault();
  const value = tagInput.value;
  const comma = value.lastIndexOf(',');
  const prefix = comma >= 0 ? `${value.slice(0, comma + 1).trimEnd()} ` : '';
  tagInput.value = `${prefix}${suggestion.dataset.tagSuggestion}, `;
  tagInput.focus();
  renderTagSuggestions();
});

itemModal.addEventListener('click', (event) => {
  if (event.target === itemModal) closeItemModal();
});

itemForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!itemForm.reportValidity()) return;
  itemMessage.textContent = '';
  const saveButton = document.querySelector('#save-item');
  const payload = {
    id: document.querySelector('#item-id').value,
    title: document.querySelector('#item-title').value,
    username: document.querySelector('#item-username').value,
    password: document.querySelector('#item-password').value,
    url: document.querySelector('#item-url').value,
    group: document.querySelector('#item-group').value,
    favorite: document.querySelector('#item-favorite').checked,
    notes: document.querySelector('#item-notes').value,
    tags: document.querySelector('#item-tags').value,
  };
  const creating = !payload.id;
  saveButton.disabled = true;
  saveButton.textContent = 'Menyimpan…';
  try {
    const result = payload.id
      ? await window.passsa.updateItem(payload)
      : await window.passsa.addItem(payload);
    closeItemModal();
    if (creating) showAllItems();
    await loadItems();
    showVaultNotice(creating
      ? `Item “${result.item.title}” berhasil ditambahkan.`
      : `Item “${result.item.title}” berhasil diperbarui.`);
  } catch (error) {
    itemMessage.textContent = error.message || 'Item gagal disimpan.';
    showVaultNotice(itemMessage.textContent, true);
    itemMessage.scrollIntoView({ block: 'nearest' });
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Simpan Item';
  }
});

itemsList.addEventListener('click', async (event) => {
  const row = event.target.closest('[data-id]');
  const overflowToggle = event.target.closest('[data-tag-overflow]');
  if (overflowToggle && row) {
    document.querySelectorAll('.tag-overflow-menu.open').forEach((menu) => {
      menu.classList.remove('open', 'flip-up');
      menu.closest('.vault-item')?.classList.remove('tag-menu-open');
    });
    document.querySelectorAll('[data-tag-overflow][aria-expanded="true"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    const menu = row.querySelector('.tag-overflow-menu');
    const isOpen = menu?.classList.toggle('open') ?? false;
    overflowToggle.setAttribute('aria-expanded', String(isOpen));
    row.classList.toggle('tag-menu-open', isOpen);
    if (isOpen && menu) {
      // Keep the popover inside the scrolling viewport. Rows near the bottom
      // open upward so the menu cannot be hidden behind the next cards.
      const scroll = document.querySelector('.items-scroll');
      const scrollRect = scroll?.getBoundingClientRect();
      const toggleRect = overflowToggle.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const canFlipUp = scrollRect && toggleRect.top - scrollRect.top > menuRect.height + 10;
      menu.classList.toggle('flip-up', Boolean(scrollRect && menuRect.bottom > scrollRect.bottom - 4 && canFlipUp));
    } else {
      menu?.classList.remove('flip-up');
    }
    return;
  }
  const tagButton = event.target.closest('[data-tag-filter]');
  if (tagButton) {
    currentFilter = 'tag';
    currentGroup = null;
    currentGroupPrefix = null;
    currentTag = tagButton.dataset.tagFilter;
    selectedIds.clear();
    document.querySelectorAll('.tree-node').forEach((node) => node.classList.remove('active'));
    document.querySelector('.vault-content h2').textContent = `Tag: ${currentTag}`;
    clearFilterButton.classList.remove('hidden');
    renderItems();
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button || !row) return;
  const item = items.find((candidate) => candidate.id === row.dataset.id);
  if (!item) return;
  const action = button.dataset.action;
  try {
    if (action === 'edit') openItemModal(await window.passsa.getItem(item.id));
    if (action === 'favorite') {
      const result = await window.passsa.toggleFavorite(item.id);
      items[items.findIndex((candidate) => candidate.id === item.id)] = result.item;
      renderItems();
    }
    if (action === 'copy-user' || action === 'copy-password') {
      const field = action === 'copy-user' ? 'username' : 'password';
      const usage = await window.passsa.copyEntrySecret(item.id, field);
      item.usageCount = usage.usageCount;
      item.lastUsedAt = usage.lastUsedAt;
      button.classList.add('copy-success');
      button.textContent = '✓';
      button.setAttribute('aria-label', `${field === 'username' ? 'Username' : 'Password'} berhasil disalin`);
      setTimeout(renderItems, 850);
      showVaultNotice(`${field === 'username' ? 'Username' : 'Password'} disalin. Clipboard dibersihkan dalam 30 detik.`);
    }
    if (action === 'copy-url') {
      const url = String(item.url ?? '').trim();
      if (!url) {
        showVaultNotice('Item ini belum memiliki alamat situs.', true);
        return;
      }
      await window.passsa.copySecret(url);
      button.classList.add('copy-success');
      button.innerHTML = '✓';
      button.setAttribute('aria-label', `Alamat situs berhasil disalin untuk ${item.title}`);
      setTimeout(renderItems, 850);
      showVaultNotice('Alamat situs disalin. Clipboard dibersihkan dalam 30 detik.');
    }
    if (action === 'delete' && confirm(`Hapus ${item.title}?`)) {
      const result = await window.passsa.deleteItem(item.id);
      items[items.findIndex((candidate) => candidate.id === item.id)] = result.item;
      renderItems();
    }
    if (action === 'restore') {
      const result = await window.passsa.restoreItem(item.id);
      items[items.findIndex((candidate) => candidate.id === item.id)] = result.item;
      renderItems();
    }
    if (action === 'purge' && confirm(`Hapus permanen ${item.title}? Tindakan ini tidak dapat dibatalkan.`)) {
      await window.passsa.purgeItem(item.id);
      items = items.filter((candidate) => candidate.id !== item.id);
      renderItems();
    }
  } catch (error) {
    showVaultNotice(error.message || 'Operasi item gagal.', true);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.tag-overflow-menu, [data-tag-overflow]')) return;
  document.querySelectorAll('.tag-overflow-menu.open').forEach((menu) => {
    menu.classList.remove('open', 'flip-up');
    menu.closest('.vault-item')?.classList.remove('tag-menu-open');
  });
  document.querySelectorAll('[data-tag-overflow][aria-expanded="true"]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
});

for (const eventName of ['pointerdown', 'keydown']) {
  window.addEventListener(eventName, resetIdleLock, { passive: true });
}

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n' && !vaultView.classList.contains('hidden')) {
    event.preventDefault();
    openItemModal();
    return;
  }
  if (event.key !== 'Escape') return;
  if (!categoryModal.classList.contains('hidden')) closeCategoryModal();
  else if (!bulkModal.classList.contains('hidden')) closeBulkModal();
  else if (!itemModal.classList.contains('hidden')) closeItemModal();
});

window.passsa.onLocked((reason) => showAuth(reason || 'Vault dikunci.'));

window.passsa.session().then((user) => {
  if (user) showVault(user);
});
