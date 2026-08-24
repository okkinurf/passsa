const authView = document.querySelector('#auth-view');
const vaultView = document.querySelector('#vault-view');
const titlebarSyncStatus = document.querySelector('#titlebar-sync-status');
const titlebarDragRegion = document.querySelector('.app-titlebar-drag-region');
const windowMinimizeButton = document.querySelector('#window-minimize');
const windowMaximizeButton = document.querySelector('#window-maximize');
const windowCloseButton = document.querySelector('#window-close');
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
const helloLoginButton = document.querySelector('#hello-login-button');
const helloLoginMessage = document.querySelector('#message');
const syncButton = document.querySelector('#sync-button');
const settingsButton = document.querySelector('#settings-button');
const logoutButton = document.querySelector('#logout-button');
const itemModal = document.querySelector('#item-modal');
const noteDetailModal = document.querySelector('#note-detail-modal');
const noteDetailTitle = document.querySelector('#note-detail-title');
const noteDetailMeta = document.querySelector('#note-detail-meta');
const noteDetailNotes = document.querySelector('#note-detail-notes');
const noteDetailGroup = document.querySelector('#note-detail-group');
const noteDetailTags = document.querySelector('#note-detail-tags');
const noteDetailFieldsSection = document.querySelector('#note-detail-fields-section');
const noteDetailFields = document.querySelector('#note-detail-fields');
const noteDetailHistoryCount = document.querySelector('#note-detail-history-count');
const noteDetailHistoryList = document.querySelector('#note-detail-history-list');
const closeNoteDetailButton = document.querySelector('#close-note-detail');
const noteDetailCloseSecondaryButton = document.querySelector('#note-detail-close-secondary');
const noteDetailEditButton = document.querySelector('#note-detail-edit');
const itemForm = document.querySelector('#item-form');
const itemsList = document.querySelector('#items-list');
const tagsOverview = document.querySelector('#tags-overview');
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
const vaultNoticeText = vaultNotice.querySelector('.vault-notice-text');
const vaultNoticeIcon = vaultNotice.querySelector('.vault-notice-icon i');
const vaultNoticeDismiss = vaultNotice.querySelector('.vault-notice-dismiss');
const sortSelect = document.querySelector('#sort-select');
const sortFilterLabel = document.querySelector('.filter-control');
const confirmModal = document.querySelector('#confirm-modal');
const confirmModalEyebrow = document.querySelector('#confirm-modal-eyebrow');
const confirmModalTitle = document.querySelector('#confirm-modal-title');
const confirmModalMessage = document.querySelector('#confirm-modal-message');
const confirmModalList = document.querySelector('#confirm-modal-list');
const confirmCancelButton = document.querySelector('#confirm-cancel');
const confirmAcceptButton = document.querySelector('#confirm-accept');
const categoryModal = document.querySelector('#category-modal');
const categoryForm = document.querySelector('#category-form');
const tagInput = document.querySelector('#item-tags');
const tagSuggestions = document.querySelector('#tag-suggestions');
const itemTypeInput = document.querySelector('#item-type');
const itemNotesLabel = document.querySelector('#item-notes-label');
const itemNotesInput = document.querySelector('#item-notes');
const noteEditor = document.querySelector('#note-editor');
const noteEditorToolbar = document.querySelector('#note-editor-toolbar');
const noteEditorMode = document.querySelector('#note-editor-mode');
const notePreview = document.querySelector('#note-preview');
const noteHeadingLevel = document.querySelector('#note-heading-level');
const noteEditorStatus = document.querySelector('#note-editor-status');
const itemLoginFields = [...document.querySelectorAll('.item-login-fields')];
const customFieldsList = document.querySelector('#custom-fields-list');
const addCustomFieldButton = document.querySelector('#add-custom-field');
const passwordHistory = document.querySelector('#password-history');
const passwordHistoryTitle = document.querySelector('#password-history-title');
const passwordHistoryNote = document.querySelector('.password-history-note');
const passwordHistoryCount = document.querySelector('#password-history-count');
const passwordHistoryList = document.querySelector('#password-history-list');
const tagSearchInput = document.querySelector('#tag-search-input');
const tagList = document.querySelector('#tag-list');
const tagEmpty = document.querySelector('#tag-empty');
const sidebarResizer = document.querySelector('#sidebar-resizer');
const sidebar = document.querySelector('[data-sidebar]');
const sidebarCollapseButton = document.querySelector('#sidebar-collapse-button');
const sidebarNavigationSearch = document.querySelector('#sidebar-navigation-search');
const sidebarTooltip = document.querySelector('#sidebar-tooltip');
const sidebarAddItemButton = document.querySelector('#sidebar-add-item-button');
const sidebarAddNoteButton = document.querySelector('#sidebar-add-note-button');
const sidebarAddTagButton = document.querySelector('#sidebar-add-tag-button');
const settingsModal = document.querySelector('#settings-modal');
const closeSettingsButton = document.querySelector('#close-settings');
const closeSettingsSecondaryButton = document.querySelector('#close-settings-secondary');
const settingsGoogleConnect = document.querySelector('#settings-google-connect');
const settingsGoogleDisconnect = document.querySelector('#settings-google-disconnect');
const settingsGooglePassword = document.querySelector('#settings-google-password');
const settingsGooglePasswordLabel = document.querySelector('#settings-google-password-label');
const settingsGoogleStatus = document.querySelector('#settings-google-status');
const settingsGoogleMessage = document.querySelector('#settings-google-message');
const changePasswordForm = document.querySelector('#change-password-form');
const settingsCurrentPassword = document.querySelector('#settings-current-password');
const settingsNewPassword = document.querySelector('#settings-new-password');
const settingsConfirmPassword = document.querySelector('#settings-confirm-password');
const settingsPasswordSubmit = document.querySelector('#settings-password-submit');
const settingsPasswordMessage = document.querySelector('#settings-password-message');
const settingsHelloStatus = document.querySelector('#settings-hello-status');
const settingsHelloPassword = document.querySelector('#settings-hello-password');
const settingsHelloMessage = document.querySelector('#settings-hello-message');
const settingsHelloEnable = document.querySelector('#settings-hello-enable');
const settingsHelloDisable = document.querySelector('#settings-hello-disable');
const settingsExportFormat = document.querySelector('#settings-export-format');
const settingsExportPasswordFields = document.querySelector('#settings-export-password-fields');
const settingsExportPassword = document.querySelector('#settings-export-password');
const settingsExportPasswordConfirm = document.querySelector('#settings-export-password-confirm');
const settingsExportCsvConfirmLabel = document.querySelector('#settings-export-csv-confirm-label');
const settingsExportCsvConfirm = document.querySelector('#settings-export-csv-confirm');
const settingsExportButton = document.querySelector('#settings-export-button');
const settingsImportMode = document.querySelector('#settings-import-mode');
const settingsImportPassword = document.querySelector('#settings-import-password');
const settingsImportCsvConfirm = document.querySelector('#settings-import-csv-confirm');
const settingsImportButton = document.querySelector('#settings-import-button');
const settingsTransferMessage = document.querySelector('#settings-transfer-message');
const settingsStartup = document.querySelector('#settings-startup');
const settingsMinimizeTray = document.querySelector('#settings-minimize-tray');
const settingsQuickAccess = document.querySelector('#settings-quick-access');
const settingsAppMessage = document.querySelector('#settings-app-message');
const settingsTheme = document.querySelector('#settings-theme');
const settingsThemeHelp = document.querySelector('#settings-theme-help');
const THEME_STORAGE_KEY = 'passsa-theme';
const systemThemeQuery = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;
const SIDEBAR_WIDTH_KEY = 'passsa-sidebar-width';
const SIDEBAR_EXPANDED_WIDTH_KEY = 'passsa-sidebar-expanded-width';
const DEFAULT_SIDEBAR_WIDTH = 260;
const COLLAPSED_SIDEBAR_WIDTH = 72;
const MIN_SIDEBAR_WIDTH = 260;
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
let currentUser = null;
let settingsGoogleChallengeId = null;
let currentFilter = 'all';
let currentGroup = null;
let currentGroupPrefix = null;
let currentTag = null;
let noteDetailCurrentId = null;
let idleLockTimer;
let initializeSidebarCollapsed = true;

function updateMaximizeControl(maximized) {
  if (!windowMaximizeButton) return;
  const icon = windowMaximizeButton.querySelector('i');
  if (icon) icon.className = `fa-regular ${maximized ? 'fa-window-restore' : 'fa-square'}`;
  windowMaximizeButton.setAttribute('aria-label', maximized ? 'Pulihkan ukuran' : 'Maksimalkan');
  windowMaximizeButton.title = maximized ? 'Pulihkan ukuran' : 'Maksimalkan';
}

windowMinimizeButton?.addEventListener('click', () => window.passsa.minimizeWindow?.());
windowMaximizeButton?.addEventListener('click', async () => {
  const result = await window.passsa.toggleMaximizeWindow?.();
  updateMaximizeControl(Boolean(result?.maximized));
});
windowCloseButton?.addEventListener('click', () => window.passsa.closeWindow?.());
titlebarDragRegion?.addEventListener('dblclick', async () => {
  const result = await window.passsa.toggleMaximizeWindow?.();
  updateMaximizeControl(Boolean(result?.maximized));
});

function normalizeThemePreference(value) {
  return ['system', 'light', 'dark'].includes(value) ? value : 'system';
}

function getThemePreference() {
  try {
    return normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

function resolveTheme(preference) {
  return preference === 'system'
    ? (systemThemeQuery?.matches ? 'dark' : 'light')
    : preference;
}

function updateThemeHelp(preference, resolved = resolveTheme(preference)) {
  if (!settingsThemeHelp) return;
  settingsThemeHelp.textContent = preference === 'system'
    ? `Mengikuti Windows — saat ini mode ${resolved === 'dark' ? 'gelap' : 'terang'}.`
    : `Mode ${resolved === 'dark' ? 'gelap' : 'terang'} dipilih secara manual.`;
}

function applyTheme(preference = getThemePreference()) {
  const normalized = normalizeThemePreference(preference);
  const resolved = resolveTheme(normalized);
  document.documentElement.dataset.themePreference = normalized;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  try {
    const nativeThemeUpdate = window.passsa.setTheme?.(resolved);
    nativeThemeUpdate?.catch?.(() => undefined);
  } catch { /* Renderer tetap dapat berganti tema jika native overlay belum siap. */ }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch { /* Preferensi tema tetap diterapkan jika storage tidak tersedia. */ }
  if (settingsTheme) settingsTheme.value = normalized;
  updateThemeHelp(normalized, resolved);
}

applyTheme();
const handleSystemThemeChange = () => {
  if (getThemePreference() === 'system') applyTheme('system');
};
if (systemThemeQuery?.addEventListener) systemThemeQuery.addEventListener('change', handleSystemThemeChange);
else systemThemeQuery?.addListener?.(handleSystemThemeChange);

function clampSidebarWidth(width) {
  const availableWidth = Math.max(MIN_SIDEBAR_WIDTH, window.innerWidth - 520);
  return Math.min(Math.max(width, MIN_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH, availableWidth);
}

function setSidebarWidth(width, persist = false) {
  const requested = Number(width);
  const collapsed = requested > 0 && requested <= COLLAPSED_SIDEBAR_WIDTH + 8;
  const nextWidth = collapsed ? COLLAPSED_SIDEBAR_WIDTH : clampSidebarWidth(requested || DEFAULT_SIDEBAR_WIDTH);
  vaultView.style.setProperty('--sidebar-width', `${nextWidth}px`);
  // Keep the explicit grid track in sync as well. This avoids a stale track
  // in Chromium when the rail is toggled after a responsive media-query pass.
  vaultView.style.setProperty('grid-template-columns', `${nextWidth}px minmax(0, 1fr)`, 'important');
  vaultView.classList.toggle('sidebar-collapsed', collapsed);
  sidebar?.classList.toggle('is-collapsed', collapsed);
  sidebar?.setAttribute('data-collapsed', String(collapsed));
  sidebarCollapseButton?.setAttribute('aria-expanded', String(!collapsed));
  sidebarCollapseButton?.setAttribute('aria-label', collapsed ? 'Buka sidebar' : 'Ciutkan sidebar');
  sidebarCollapseButton?.setAttribute('title', collapsed ? 'Buka sidebar' : 'Ciutkan sidebar');
  if (sidebarCollapseButton) sidebarCollapseButton.dataset.sidebarTooltip = collapsed ? 'Buka sidebar' : 'Ciutkan sidebar';
  sidebarResizer.setAttribute('aria-valuemin', String(MIN_SIDEBAR_WIDTH));
  sidebarResizer.setAttribute('aria-valuemax', String(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, window.innerWidth - 520))));
  sidebarResizer.setAttribute('aria-valuenow', String(nextWidth));
  if (persist) {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(nextWidth));
    if (!collapsed) localStorage.setItem(SIDEBAR_EXPANDED_WIDTH_KEY, String(nextWidth));
  }
}

function setupSidebarResize() {
  const storedWidth = Number(localStorage.getItem(SIDEBAR_WIDTH_KEY));
  setSidebarWidth(storedWidth || DEFAULT_SIDEBAR_WIDTH);

  sidebarCollapseButton?.addEventListener('click', () => {
    const collapsed = sidebar?.classList.contains('is-collapsed');
    hideSidebarTooltip();
    if (collapsed) {
      const restored = Number(localStorage.getItem(SIDEBAR_EXPANDED_WIDTH_KEY)) || DEFAULT_SIDEBAR_WIDTH;
      setSidebarWidth(restored, true);
    } else {
      const expanded = document.querySelector('.sidebar')?.offsetWidth || DEFAULT_SIDEBAR_WIDTH;
      localStorage.setItem(SIDEBAR_EXPANDED_WIDTH_KEY, String(clampSidebarWidth(expanded)));
      setSidebarWidth(COLLAPSED_SIDEBAR_WIDTH, true);
    }
  });

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
    if (sidebar?.classList.contains('is-collapsed')) return;
    const currentWidth = document.querySelector('.sidebar').offsetWidth;
    const nextWidth = event.key === 'Home'
      ? MIN_SIDEBAR_WIDTH
      : event.key === 'End'
        ? MAX_SIDEBAR_WIDTH
        : currentWidth + (event.key === 'ArrowRight' ? 12 : -12);
    setSidebarWidth(nextWidth, true);
  });

  window.addEventListener('resize', () => {
    if (sidebar?.classList.contains('is-collapsed')) return;
    setSidebarWidth(document.querySelector('.sidebar').offsetWidth);
  });
}

setupSidebarResize();

function tooltipLabelFor(target) {
  if (!target) return '';
  return target.dataset.sidebarTooltip
    || target.dataset.title
    || target.getAttribute('aria-label')
    || target.getAttribute('title')
    || target.querySelector('[data-label]')?.textContent?.trim()
    || '';
}

function hideSidebarTooltip() {
  sidebarTooltip?.classList.remove('visible');
  sidebarTooltip?.setAttribute('aria-hidden', 'true');
}

function showSidebarTooltip(target) {
  if (!sidebarTooltip || !sidebar?.classList.contains('is-collapsed')) return;
  const label = tooltipLabelFor(target);
  if (!label) return;
  const rect = target.getBoundingClientRect();
  sidebarTooltip.textContent = label;
  sidebarTooltip.style.left = `${Math.min(window.innerWidth - 232, rect.right + 10)}px`;
  sidebarTooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - 36, rect.top + (rect.height - 28) / 2))}px`;
  sidebarTooltip.classList.add('visible');
  sidebarTooltip.setAttribute('aria-hidden', 'false');
}

function sidebarTooltipTarget(eventTarget) {
  return eventTarget?.closest?.('.tree-node, .sidebar-create-button, .sidebar-collapse, .sync-button, .logout-button, .avatar, .category-edit');
}

sidebar?.addEventListener('pointerover', (event) => {
  const target = sidebarTooltipTarget(event.target);
  if (target) showSidebarTooltip(target);
});
sidebar?.addEventListener('pointerout', (event) => {
  const target = sidebarTooltipTarget(event.target);
  const next = sidebarTooltipTarget(event.relatedTarget);
  if (target && target !== next) hideSidebarTooltip();
});
sidebar?.addEventListener('focusin', (event) => {
  const target = sidebarTooltipTarget(event.target);
  if (target) showSidebarTooltip(target);
});
sidebar?.addEventListener('focusout', () => hideSidebarTooltip());
window.addEventListener('resize', hideSidebarTooltip);

function setSidebarGroupOpen(header, open) {
  const listId = header?.dataset.group;
  const list = listId ? document.getElementById(listId) : null;
  if (!list) return;
  const group = header.closest('.sidebar-group');
  list.classList.toggle('hidden', !open);
  group?.classList.toggle('is-collapsed', !open);
  header.setAttribute('aria-expanded', String(open));
}

document.querySelectorAll('.sidebar-group-header').forEach((header) => {
  header.addEventListener('click', () => {
    setSidebarGroupOpen(header, header.getAttribute('aria-expanded') !== 'true');
  });
});

function filterSidebarNavigation() {
  const query = sidebarNavigationSearch?.value.trim().toLowerCase() || '';
  const groups = [...document.querySelectorAll('.sidebar-group')];
  for (const group of groups) {
    const header = group.querySelector('.sidebar-group-header');
    const list = header?.dataset.group ? document.getElementById(header.dataset.group) : null;
    if (!list) continue;
    const rows = [...list.querySelectorAll('.tree-row')];
    if (!query) {
      rows.forEach((row) => row.classList.remove('sidebar-nav-hidden'));
      group.classList.remove('sidebar-search-empty');
      continue;
    }
    let visible = false;
    rows.forEach((row) => {
      const node = row.querySelector('.tree-node');
      const text = node?.textContent?.toLowerCase() || '';
      const matches = text.includes(query);
      row.classList.toggle('sidebar-nav-hidden', !matches);
      visible ||= matches;
    });
    group.classList.toggle('sidebar-search-empty', !visible);
    if (visible && header.getAttribute('aria-expanded') !== 'true') setSidebarGroupOpen(header, true);
  }
}

sidebarNavigationSearch?.addEventListener('input', filterSidebarNavigation);
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey
      && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
    event.preventDefault();
    sidebarNavigationSearch?.focus();
  }
});

function setMode(nextMode) {
  mode = nextMode;
  emailInput.readOnly = false;
  const registering = mode === 'register';
  document.querySelector('.tabs').dataset.mode = registering ? 'register' : 'login';
  loginTab.classList.toggle('active', !registering);
  registerTab.classList.toggle('active', registering);
  loginTab.setAttribute('aria-selected', String(!registering));
  registerTab.setAttribute('aria-selected', String(registering));
  title.textContent = registering ? 'Buat akun testing' : 'Selamat datang kembali';
  subtitle.textContent = registering
    ? 'Akun ini hanya tersimpan di komputer Anda.'
    : 'Masuk ke vault lokal Anda.';
  submitButton.textContent = registering ? 'Buat Akun' : 'Masuk';
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  form.reset();
  setMessage('');
  helloLoginButton?.classList.add('hidden');
  emailInput.focus();
}

function setMessage(text, success = false) {
  setInlineMessage(message, text, success);
}

async function refreshHelloLoginState() {
  if (!helloLoginButton || mode !== 'login' || !window.passsa.helloStatus) return;
  try {
    const result = await window.passsa.helloStatus(emailInput.value);
    helloLoginButton.classList.toggle('hidden', !result?.supported || !result.enabled);
  } catch {
    helloLoginButton.classList.add('hidden');
  }
}

async function refreshHelloSettingsState() {
  if (!settingsHelloStatus || !window.passsa.helloStatus) return;
  try {
    const result = await window.passsa.helloStatus(currentUser?.email);
    if (!result.supported) {
      settingsHelloStatus.textContent = 'Windows Hello hanya tersedia pada Windows 10/11 dengan perangkat autentikasi yang aktif.';
      settingsHelloEnable.disabled = true;
      settingsHelloDisable.classList.add('hidden');
      return;
    }
    const enabled = Boolean(result.enabled);
    settingsHelloStatus.textContent = enabled
      ? 'Windows Hello aktif di perangkat ini. Anda dapat memakainya pada layar login setelah vault dikunci.'
      : 'Gunakan PIN, sidik jari, atau Windows Hello untuk membuka vault di perangkat ini setelah login password pertama.';
    settingsHelloEnable.classList.toggle('hidden', enabled);
    settingsHelloDisable.classList.toggle('hidden', !enabled);
    settingsHelloPassword.classList.toggle('hidden', enabled);
  } catch (error) {
    setInlineMessage(settingsHelloMessage, error.message || 'Status Windows Hello gagal dibaca.');
  }
}

function setInlineMessage(element, text = '', success = false) {
  element.textContent = text || '';
  element.classList.toggle('success', Boolean(success));
  element.classList.toggle('has-message', Boolean(text));
}

function updateSecretToggle(button, visible, label = 'password') {
  if (!button) return;
  const action = visible ? 'Sembunyikan' : 'Tampilkan';
  const icon = button.querySelector('i');
  if (icon) icon.className = `fa-solid fa-eye${visible ? '-slash' : ''}`;
  button.setAttribute('aria-label', `${action} ${label}`);
  button.title = `${action} ${label}`;
  button.dataset.visible = String(Boolean(visible));
}

function updateTitlebarSyncStatus(user = currentUser) {
  const connected = Boolean(user?.googleEmail);
  titlebarSyncStatus.classList.toggle('connected', connected);
  titlebarSyncStatus.classList.toggle('disconnected', !connected);
  titlebarSyncStatus.title = connected ? `Google Drive terhubung sebagai ${user.googleEmail}` : 'Google Drive belum terhubung';
  titlebarSyncStatus.querySelector('span').textContent = connected ? 'Google Drive terhubung' : 'Google Drive belum terhubung';
}

function userAvatarLabel(user) {
  const source = String(user?.displayName || user?.name || user?.email || 'User')
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
  return (source.replace(/\s+/g, '').slice(0, 2) || 'U').toUpperCase();
}

function updateSidebarUser(user) {
  const avatar = document.querySelector('#user-avatar');
  const email = document.querySelector('#user-email');
  const plan = document.querySelector('.sidebar-user small');
  if (email) email.textContent = user?.email || 'user@email.com';
  if (avatar) {
    const initials = userAvatarLabel(user);
    avatar.textContent = initials;
    avatar.dataset.initials = String(initials.length);
    avatar.dataset.sidebarTooltip = `Akun: ${user?.email || 'lokal'}`;
    avatar.setAttribute('aria-label', `Akun ${user?.email || 'lokal'}`);
  }
  if (plan) plan.textContent = user?.provider === 'google' ? 'Google Drive terhubung' : 'Vault lokal';
}

async function showVault(user) {
  currentUser = user;
  await window.passsa.setWindowMode?.('vault');
  updateTitlebarSyncStatus(user);
  updateSidebarUser(user);
  authView.classList.add('hidden');
  vaultView.classList.remove('hidden');
  initializeSidebarCollapsed = true;
  await loadItems();
  resetIdleLock();
}

function clearVaultState() {
  clearTimeout(idleLockTimer);
  currentUser = null;
  updateTitlebarSyncStatus(null);
  settingsGoogleChallengeId = null;
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
  renderPasswordHistory([], false);
  bulkForm.reset();
  categoryForm.reset();
  document.querySelector('#item-password').value = '';
  itemsList.replaceChildren();
  tagsOverview.replaceChildren();
  tagsOverview.classList.add('hidden');
  document.querySelector('#custom-categories-tree').replaceChildren();
  clearFilterButton.classList.add('hidden');
  if (tagSearchInput) tagSearchInput.value = '';
  tagList?.replaceChildren();
  tagEmpty?.classList.add('hidden');
  itemModal.classList.add('hidden');
  closeNoteDetail();
  bulkModal.classList.add('hidden');
  categoryModal.classList.add('hidden');
  settingsModal.classList.add('hidden');
  settingsGooglePassword.value = '';
  setSettingsMessage('');
  vaultNotice.classList.add('hidden');
}

function collapseAllSidebarBranches() {
  collapsedBranches.clear();
  const parentPaths = new Set(categories.map((category) => category.parentPath).filter(Boolean));
  for (const category of categories) {
    if (parentPaths.has(category.path)) collapsedBranches.add(`category-branch-${category.id}`);
  }
}

function showAuth(reason = '') {
  clearVaultState();
  window.passsa.setWindowMode?.('auth');
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

function renderItems({ preserveScroll = true } = {}) {
  const scrollContainer = document.querySelector('.items-scroll');
  const scrollTop = preserveScroll ? (scrollContainer?.scrollTop ?? 0) : 0;
  const restoreScroll = () => {
    if (preserveScroll && scrollContainer) scrollContainer.scrollTop = scrollTop;
  };
  renderSidebarCounts();
  filterSidebarNavigation();
  if (currentFilter === 'tags' && !currentTag) {
    renderTagsOverview();
    syncBulkToolbar();
    renderTagTree();
    renderCustomCategories();
    filterSidebarNavigation();
    restoreScroll();
    return;
  }
  const query = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const belongsToView = currentFilter === 'trash'
      ? Boolean(item.deletedAt)
      : !item.deletedAt
        && (currentFilter !== 'favorites' || item.favorite)
        && (currentFilter !== 'notes' || item.type === 'secure-note')
        && (currentFilter !== 'tags' || (item.tags ?? []).length > 0)
        && (!currentGroup || item.group === currentGroup)
        && (!currentGroupPrefix || item.group === currentGroupPrefix || item.group.startsWith(`${currentGroupPrefix}/`))
        && (!currentTag || (item.tags ?? []).some((tag) => tag.toLowerCase() === currentTag.toLowerCase()));
    const matchesSearch = [item.title, item.username, item.url, item.notes, item.group, ...(item.tags ?? []), ...(item.fields ?? []).map((field) => field.label)]
      .some((value) => String(value).toLowerCase().includes(query));
    return belongsToView && matchesSearch;
  }).sort(compareItems);
  visibleItems = filtered;
  tagsOverview.classList.add('hidden');
  sortFilterLabel?.classList.remove('hidden');
  sortSelect.classList.remove('hidden');
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
    <article class="vault-item ${selectedIds.has(item.id) ? 'selected' : ''} ${item.type === 'secure-note' ? 'note-card' : ''}" data-id="${escapeHtml(item.id)}" data-item-index="${Math.min(index, 10)}" ${item.type === 'secure-note' ? `tabindex="0" role="button" aria-label="Buka catatan ${escapeHtml(item.title)}"` : ''}>
      <input class="item-select" type="checkbox" data-select-id="${escapeHtml(item.id)}" aria-label="Pilih ${escapeHtml(item.title)}" ${selectedIds.has(item.id) ? 'checked' : ''} />
      <div class="item-main"><strong>${item.favorite ? '★ ' : ''}${item.type === 'secure-note' ? '<i class="fa-solid fa-note-sticky item-type-icon" aria-hidden="true"></i> ' : ''}${escapeHtml(item.title)}</strong><small>${item.type === 'secure-note' ? 'Secure Note' : escapeHtml(item.group || 'Umum')} · ${escapeHtml(item.type === 'secure-note' ? 'Catatan terenkripsi' : (item.url || 'Login lokal'))}</small></div>
      <div class="item-tags-cell">${(item.tags ?? []).length ? `<div class="item-tags">${item.tags.slice(0, 2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}${item.tags.length > 2 ? `<button class="tag-overflow-toggle" type="button" data-tag-overflow="true" aria-expanded="false" aria-label="Lihat ${item.tags.length - 2} tags lainnya">+${item.tags.length - 2}</button><span class="tag-overflow-menu" role="listbox">${item.tags.slice(2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}</span>` : ''}</div>` : '<span class="item-muted">—</span>'}</div>
      <div class="item-login"><span>${escapeHtml(item.type === 'secure-note' ? 'Catatan aman' : (item.username || 'Tanpa username'))}</span><small class="item-usage">${item.type === 'secure-note' ? 'Terenkripsi di vault' : `Dipakai ${item.usageCount ?? 0} kali`}</small></div>
      <div class="item-actions">
        ${item.deletedAt ? `
          <button class="item-action" data-action="restore" title="Pulihkan" aria-label="Pulihkan ${escapeHtml(item.title)}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button>
          <button class="item-action danger" data-action="purge" title="Hapus permanen" aria-label="Hapus permanen ${escapeHtml(item.title)}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        ` : `
          <button class="item-action" data-action="favorite" title="Favorit" aria-label="${item.favorite ? 'Hapus dari' : 'Tambahkan ke'} favorit: ${escapeHtml(item.title)}"><i class="fa-${item.favorite ? 'solid' : 'regular'} fa-star" aria-hidden="true"></i></button>
          ${item.type === 'secure-note' ? '' : `
          <button class="item-action" data-action="copy-user" title="Salin username" aria-label="Salin username ${escapeHtml(item.title)}"><i class="fa-solid fa-user" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-password" title="Salin password" aria-label="Salin password ${escapeHtml(item.title)}"><i class="fa-solid fa-key" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-url" title="Salin alamat situs" aria-label="Salin alamat situs ${escapeHtml(item.title)}"><i class="fa-solid fa-link" aria-hidden="true"></i></button>`}
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
  filterSidebarNavigation();
  restoreScroll();
}

function renderTagsOverview() {
  const query = searchInput.value.trim().toLowerCase();
  const counts = new Map();
  for (const item of items) {
    if (item.deletedAt) continue;
    for (const tag of item.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const matches = [...counts.entries()]
    .filter(([tag]) => !query || tag.toLowerCase().includes(query))
    .sort(([left], [right]) => left.localeCompare(right, 'id', { sensitivity: 'base' }));
  itemCount.textContent = `${matches.length} tag`;
  clearFilterButton.classList.add('hidden');
  sortFilterLabel?.classList.add('hidden');
  sortSelect.classList.add('hidden');
  emptyState.classList.add('hidden');
  itemsHeader.classList.add('hidden');
  itemsList.classList.add('hidden');
  tagsOverview.classList.remove('hidden');
  tagsOverview.innerHTML = matches.length
    ? `<div class="tags-overview-grid">${matches.map(([tag, count]) => `
        <button class="tag-overview-card tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}" title="Buka item dengan tag #${escapeHtml(tag)}">
          <span class="tag-overview-icon"><i class="fa-solid fa-tag" aria-hidden="true"></i></span>
          <span class="tag-overview-name">#${escapeHtml(tag)}</span>
          <span class="tag-overview-count">${count} item</span>
          <i class="fa-solid fa-arrow-right tag-overview-arrow" aria-hidden="true"></i>
        </button>`).join('')}</div>`
    : `<div class="tags-overview-empty"><i class="fa-solid fa-tags" aria-hidden="true"></i><strong>${counts.size ? 'Tag tidak ditemukan' : 'Belum ada tag'}</strong><span>${counts.size ? 'Coba kata pencarian lain.' : 'Tambahkan tag pada credential untuk melihatnya di sini.'}</span></div>`;
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
  if (!tagSearchInput || !tagList || !tagEmpty) return;
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

function renderSidebarCounts() {
  const activeItems = items.filter((item) => !item.deletedAt);
  const setCount = (id, value) => {
    const element = document.querySelector(`#${id}`);
    if (!element) return;
    element.textContent = value > 0 ? String(value) : '';
    element.dataset.zero = String(value <= 0);
  };
  setCount('sidebar-all-count', activeItems.length);
  setCount('sidebar-favorites-count', activeItems.filter((item) => item.favorite).length);
  setCount('sidebar-trash-count', items.filter((item) => item.deletedAt).length);
  setCount('sidebar-notes-count', activeItems.filter((item) => item.type === 'secure-note').length);
  setCount('sidebar-tags-count', new Set(activeItems.flatMap((item) => item.tags ?? [])).size);
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

function formatHistoryDate(value) {
  const timestamp = Date.parse(value ?? '');
  if (!timestamp) return 'Waktu tidak diketahui';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
}

function renderNoteDetail(item) {
  if (!item) return;
  noteDetailTitle.textContent = item.title || 'Catatan';
  noteDetailMeta.textContent = `${item.group || 'Umum'} · Catatan terenkripsi`;
  noteDetailNotes.innerHTML = renderNoteMarkdown(item.notes || 'Tidak ada isi catatan.');
  noteDetailGroup.textContent = item.group || 'Umum';
  const tags = Array.isArray(item.tags) ? item.tags : [];
  noteDetailTags.innerHTML = tags.length
    ? tags.map((tag) => `<span class="tag-chip tone-${tagTone(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</span>`).join('')
    : '<span class="item-muted">Tidak ada tags</span>';

  const fields = Array.isArray(item.fields) ? item.fields : [];
  noteDetailFieldsSection.classList.toggle('hidden', fields.length === 0);
  noteDetailFields.innerHTML = fields.map((field) => {
    const value = field?.type === 'boolean'
      ? (field.value ? 'Ya' : 'Tidak')
      : String(field?.value ?? '');
    return `<div class="note-detail-field"><strong>${escapeHtml(field?.label || 'Field')}</strong><span>${escapeHtml(value || '—')}</span></div>`;
  }).join('');

  const history = Array.isArray(item.noteHistory) ? item.noteHistory.slice().reverse() : [];
  noteDetailHistoryCount.textContent = history.length ? `(${history.length} versi)` : '';
  noteDetailHistoryList.classList.toggle('is-scrollable', history.length > 3);
  noteDetailHistoryList.innerHTML = history.length
    ? history.map((entry, index) => `
      <div class="note-history-entry">
        <div class="note-history-entry-meta"><strong>Versi ${history.length - index}</strong><small>${escapeHtml(formatHistoryDate(entry.savedAt))}</small></div>
        <div class="note-history-entry-content">
          <strong>${escapeHtml(entry.title || 'Catatan')}</strong>
          <div class="note-history-markdown">${renderNoteMarkdown(entry.notes || 'Tidak ada isi catatan.')}</div>
          ${(entry.tags ?? []).length ? `<div class="item-tags">${entry.tags.map((tag) => `<span class="tag-chip tone-${tagTone(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
    `).join('')
    : '<p class="note-history-empty">Belum ada perubahan pada catatan ini.</p>';
}

async function openNoteDetail(id) {
  try {
    const item = await window.passsa.getItem(id);
    if (!item || item.type !== 'secure-note') return;
    noteDetailCurrentId = id;
    renderNoteDetail(item);
    noteDetailModal.classList.remove('hidden');
  } catch (error) {
    showVaultNotice(error.message || 'Detail catatan tidak dapat dibuka.', true);
  }
}

function closeNoteDetail() {
  noteDetailCurrentId = null;
  noteDetailModal.classList.add('hidden');
}

function updateHistoryHeader(note = false) {
  passwordHistoryTitle.innerHTML = `<i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${note ? 'Note History' : 'Password History'}`;
  passwordHistoryNote.textContent = note ? 'Versi catatan tersimpan terenkripsi' : 'Versi lama tersimpan terenkripsi';
}

function renderPasswordHistory(history, showSection = true) {
  const entries = Array.isArray(history)
    ? history.filter((entry) => typeof entry?.password === 'string').slice().reverse()
    : [];
  updateHistoryHeader(false);
  passwordHistory.classList.toggle('hidden', !showSection);
  passwordHistoryCount.textContent = entries.length ? `(${entries.length} versi)` : '';
  passwordHistoryList.classList.toggle('is-scrollable', entries.length > 3);
  passwordHistoryList.innerHTML = entries.length ? entries.map((entry, index) => `
    <div class="password-history-entry">
      <div class="password-history-meta"><strong>Versi ${entries.length - index}</strong><small>${escapeHtml(formatHistoryDate(entry.savedAt))}</small></div>
      <div class="password-history-value">
        <input type="password" value="${escapeHtml(entry.password)}" readonly autocomplete="off" aria-label="Password versi ${entries.length - index}" />
        <button class="text-button history-toggle secret-toggle" type="button" data-history-toggle="true" aria-label="Tampilkan password versi ${entries.length - index}" title="Tampilkan password versi ${entries.length - index}"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
      </div>
    </div>
  `).join('') : '<p class="password-history-empty">Belum ada perubahan password.</p>';
}

function renderNoteHistory(history, showSection = true) {
  const entries = Array.isArray(history)
    ? history.filter((entry) => entry && typeof entry === 'object').slice().reverse()
    : [];
  updateHistoryHeader(true);
  passwordHistory.classList.toggle('hidden', !showSection);
  passwordHistoryCount.textContent = entries.length ? `(${entries.length} versi)` : '';
  passwordHistoryList.classList.toggle('is-scrollable', entries.length > 3);
  passwordHistoryList.innerHTML = entries.length ? entries.map((entry, index) => `
    <div class="note-history-entry">
      <div class="note-history-entry-meta"><strong>Versi ${entries.length - index}</strong><small>${escapeHtml(formatHistoryDate(entry.savedAt))}</small></div>
      <div class="note-history-entry-content">
        <strong>${escapeHtml(entry.title || 'Catatan')}</strong>
        <p>${escapeHtml(entry.notes || 'Tidak ada isi catatan.')}</p>
        ${(entry.tags ?? []).length ? `<div class="item-tags">${entry.tags.map((tag) => `<span class="tag-chip tone-${tagTone(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </div>
    </div>
  `).join('') : '<p class="note-history-empty">Belum ada perubahan catatan.</p>';
}

const customFieldTypes = [
  ['text', 'Text'],
  ['secret', 'Secret'],
  ['url', 'URL'],
  ['email', 'Email'],
  ['number', 'Angka'],
  ['boolean', 'Ya / Tidak'],
];

function customFieldTypeOptions(selected) {
  return customFieldTypes.map(([value, label]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`).join('');
}

const customFieldTypeConfig = {
  text: { inputType: 'text', placeholder: 'Contoh: Nomor tiket atau kode akses' },
  secret: { inputType: 'password', placeholder: 'Contoh: PIN atau kode pemulihan' },
  url: { inputType: 'url', placeholder: 'https://contoh.com' },
  email: { inputType: 'email', placeholder: 'nama@contoh.com' },
  number: { inputType: 'number', placeholder: 'Contoh: 12345', inputmode: 'decimal', step: 'any' },
};

function readCustomFieldRow(row) {
  const type = row.querySelector('[data-field-type]')?.value || 'text';
  const valueInput = row.querySelector('[data-field-value]');
  return {
    id: row.dataset.fieldId || crypto.randomUUID(),
    label: row.querySelector('[data-field-label]')?.value || '',
    type,
    value: type === 'boolean' ? valueInput?.value === 'true' : (valueInput?.value || ''),
  };
}

function renderCustomFields(fields = []) {
  if (!customFieldsList) return;
  const normalized = Array.isArray(fields) ? fields : [];
  customFieldsList.innerHTML = normalized.map((field, index) => {
    const type = customFieldTypes.some(([value]) => value === field?.type) ? field.type : 'text';
    const boolean = type === 'boolean';
    const value = boolean ? (field.value === true || String(field.value).toLowerCase() === 'true') : String(field?.value ?? '');
    const config = customFieldTypeConfig[type] || customFieldTypeConfig.text;
    const inputAttributes = [
      `type="${config.inputType}"`,
      'maxlength="5000"',
      `value="${escapeHtml(value)}"`,
      `placeholder="${escapeHtml(config.placeholder)}"`,
      'aria-label="Nilai custom field"',
      config.inputmode ? `inputmode="${config.inputmode}"` : '',
      config.step ? `step="${config.step}"` : '',
      type === 'url' || type === 'email' ? 'spellcheck="false"' : '',
    ].filter(Boolean).join(' ');
    return `<div class="custom-field-row" data-field-row data-field-id="${escapeHtml(field?.id || `field-${index}`)}">
      <div class="custom-field-label"><input data-field-label type="text" maxlength="80" value="${escapeHtml(field?.label ?? '')}" placeholder="Nama field (contoh: PIN)" aria-label="Nama custom field" /></div>
      <select data-field-type aria-label="Tipe custom field">${customFieldTypeOptions(type)}</select>
      <div class="custom-field-value">${boolean
        ? `<select class="custom-field-boolean-value" data-field-value aria-label="Nilai Ya atau Tidak"><option value="false" ${value ? '' : 'selected'}>Tidak</option><option value="true" ${value ? 'selected' : ''}>Ya</option></select>`
        : `<input data-field-value ${inputAttributes} />${type === 'secret' ? '<button class="text-button custom-field-toggle secret-toggle" type="button" data-custom-toggle aria-label="Tampilkan secret field" title="Tampilkan secret field"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>' : ''}`}</div>
      <button class="icon-button custom-field-remove" type="button" data-remove-custom-field aria-label="Hapus custom field"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
    </div>`;
  }).join('');
}

function collectCustomFields() {
  return [...(customFieldsList?.querySelectorAll('[data-field-row]') ?? [])]
    .map(readCustomFieldRow)
    .filter((field) => field.label.trim());
}

function markdownInline(value) {
  let html = escapeHtml(value);
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, href) => {
    const safeHref = /^(https?:\/\/|mailto:)/i.test(href) ? href : '#';
    return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noreferrer">${label}</a>`;
  });
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
  html = html.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');
  html = html.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
  html = html.replace(/\+\+([^+\n]+)\+\+/g, '<u>$1</u>');
  html = html.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  html = html.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
  return html;
}

function renderNoteMarkdown(value) {
  const sourceLines = String(value ?? '').replace(/\r\n?/g, '\n').split('\n');
  const splitTableCells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
  const isTableSeparator = (row) => {
    const cells = splitTableCells(row || '');
    return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };
  const lines = [];
  for (let index = 0; index < sourceLines.length; index += 1) {
    const line = sourceLines[index];
    if (line.includes('|') && isTableSeparator(sourceLines[index + 1])) {
      const rows = [splitTableCells(line)];
      let rowIndex = index + 2;
      while (rowIndex < sourceLines.length && sourceLines[rowIndex].includes('|') && sourceLines[rowIndex].trim()) {
        rows.push(splitTableCells(sourceLines[rowIndex]));
        rowIndex += 1;
      }
      lines.push({ table: rows, lineIndex: index });
      index = rowIndex - 1;
    } else {
      lines.push({ line, lineIndex: index });
    }
  }
  const html = [];
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLines = [];
  const closeList = () => {
    if (listType) html.push(`</${listType}>`);
    listType = null;
  };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.map((line) => markdownInline(line)).join('<br>')}</p>`);
    paragraph = [];
  };
  lines.forEach((entry) => {
    if (entry.table) {
      flushParagraph();
      closeList();
      const rows = entry.table;
      const headers = rows[0] || [];
      const body = rows.slice(1);
      html.push('<div class="note-preview-table-wrap"><table class="note-preview-table"><thead><tr>'
        + headers.map((cell) => `<th>${markdownInline(cell)}</th>`).join('')
        + '</tr></thead><tbody>'
        + body.map((row) => `<tr>${headers.map((_header, cellIndex) => `<td>${markdownInline(row[cellIndex] || '')}</td>`).join('')}</tr>`).join('')
        + '</tbody></table></div>');
      return;
    }
    const line = entry.line;
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      flushParagraph();
      closeList();
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) {
      codeLines.push(line);
      return;
    }
    if (!trimmed) {
      flushParagraph();
      closeList();
      return;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${markdownInline(heading[2])}</h${level}>`);
      return;
    }
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      flushParagraph();
      closeList();
      html.push('<hr />');
      return;
    }
    const check = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
    if (check) {
      flushParagraph();
      if (listType !== 'ul') { closeList(); html.push('<ul class="note-preview-list">'); listType = 'ul'; }
      const checked = check[1].toLowerCase() === 'x';
      html.push(`<li class="note-preview-check"><button type="button" class="note-preview-check-toggle" data-note-line="${entry.lineIndex}" aria-label="${checked ? 'Tandai belum selesai' : 'Tandai selesai'}">${checked ? '✓' : ''}</button><span class="${checked ? 'is-checked' : ''}">${markdownInline(check[2])}</span></li>`);
      return;
    }
    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listType !== 'ul') { closeList(); html.push('<ul class="note-preview-list">'); listType = 'ul'; }
      html.push(`<li>${markdownInline(unordered[1])}</li>`);
      return;
    }
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType !== 'ol') { closeList(); html.push('<ol class="note-preview-list">'); listType = 'ol'; }
      html.push(`<li>${markdownInline(ordered[1])}</li>`);
      return;
    }
    if (trimmed.startsWith('>')) {
      flushParagraph();
      closeList();
      html.push(`<blockquote>${markdownInline(trimmed.replace(/^>\s?/, ''))}</blockquote>`);
      return;
    }
    closeList();
    paragraph.push(line);
  });
  flushParagraph();
  if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  closeList();
  return html.join('') || '<p class="note-preview-empty">Belum ada isi catatan.</p>';
}

let noteEditorModeValue = 'write';

function updateNotePreview() {
  if (!notePreview || !itemNotesInput) return;
  notePreview.innerHTML = renderNoteMarkdown(itemNotesInput.value);
  if (noteEditorStatus) {
    const length = itemNotesInput.value.length;
    const limit = Number(itemNotesInput.maxLength) || 20000;
    noteEditorStatus.textContent = `${length.toLocaleString('id-ID')} / ${limit.toLocaleString('id-ID')} karakter`;
  }
}

function setNoteEditorMode(nextMode = 'write') {
  noteEditorModeValue = nextMode === 'preview' ? 'preview' : 'write';
  const preview = noteEditorModeValue === 'preview';
  itemNotesInput?.classList.toggle('hidden', preview);
  notePreview?.classList.toggle('hidden', !preview);
  noteEditorMode?.querySelectorAll('[data-note-mode]').forEach((button) => {
    const active = button.dataset.noteMode === noteEditorModeValue;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (preview) updateNotePreview();
}

function replaceNoteSelection(replacement, selectionStart, selectionEnd) {
  if (!itemNotesInput) return;
  itemNotesInput.focus();
  itemNotesInput.setRangeText(replacement, selectionStart, selectionEnd, 'select');
  itemNotesInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function applyNoteFormat(format) {
  if (!itemNotesInput) return;
  if (format === 'undo' || format === 'redo') {
    itemNotesInput.focus();
    document.execCommand(format);
    updateNotePreview();
    return;
  }
  const value = itemNotesInput.value;
  const start = itemNotesInput.selectionStart ?? 0;
  const end = itemNotesInput.selectionEnd ?? start;
  const selected = value.slice(start, end);
  if (format === 'clear') {
    replaceNoteSelection(selected
      .replace(/(^|\n)\s{0,3}#{1,3}\s+/g, '$1')
      .replace(/(^|\n)\s*[-*+]\s+(?:\[[ xX]\]\s+)?/g, '$1')
      .replace(/(^|\n)\s*\d+[.)]\s+/g, '$1')
      .replace(/(^|\n)\s*>\s?/g, '$1')
      .replace(/\*\*|__|~~|`|\+\+/g, ''), start, end);
    return;
  }
  const wrappers = { bold: ['**', '**'], italic: ['*', '*'], underline: ['++', '++'], strike: ['~~', '~~'], code: ['`', '`'] };
  if (wrappers[format]) {
    const [left, right] = wrappers[format];
    replaceNoteSelection(`${left}${selected || 'teks'}${right}`, start, end);
    return;
  }
  if (format === 'link') {
    replaceNoteSelection(`[${selected || 'teks tautan'}](https://contoh.com)`, start, end);
    return;
  }
  if (format === 'code-block') {
    replaceNoteSelection(`\`\`\`\n${selected || 'kode'}\n\`\`\``, start, end);
    return;
  }
  if (format === 'table') {
    replaceNoteSelection(`| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Isi | Isi |`, start, end);
    return;
  }
  if (format === 'callout') {
    replaceNoteSelection(`> **Catatan:** ${selected || 'Tulis catatan penting di sini.'}`, start, end);
    return;
  }
  if (format === 'date') {
    const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
    replaceNoteSelection(date, start, end);
    return;
  }
  if (format === 'rule') {
    replaceNoteSelection(`${start > 0 && value[start - 1] !== '\n' ? '\n' : ''}---\n`, start, end);
    return;
  }
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
  const lineEndIndex = value.indexOf('\n', end);
  const lineEnd = lineEndIndex < 0 ? value.length : lineEndIndex;
  const block = value.slice(lineStart, lineEnd);
  const prefixes = {
    heading: '# ',
    'heading-1': '# ',
    'heading-2': '## ',
    'heading-3': '### ',
    paragraph: '',
    bullet: '- ',
    number: '1. ',
    check: '- [ ] ',
    quote: '> ',
  };
  const prefix = prefixes[format];
  if (prefix === undefined) return;
  const lines = block.split('\n');
  const stripped = lines.map((line) => line.replace(/^\s*(?:#{1,3}\s+|[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+|>\s?)/, ''));
  const already = prefix && lines.every((line) => line.startsWith(prefix));
  const nextBlock = already || format === 'paragraph' ? stripped.join('\n') : stripped.map((line) => `${prefix}${line}`).join('\n');
  replaceNoteSelection(nextBlock, lineStart, lineEnd);
}

function updateItemTypeUi() {
  const secureNote = itemTypeInput?.value === 'secure-note';
  itemLoginFields.forEach((field) => field.classList.toggle('hidden', secureNote));
  const password = document.querySelector('#item-password');
  password.required = !secureNote;
  document.querySelector('#generate-password').classList.toggle('hidden', secureNote);
  itemNotesLabel.textContent = secureNote ? 'Isi Catatan' : 'Deskripsi';
  itemNotesInput.placeholder = secureNote ? 'Tulis catatan rahasia Anda…' : 'Keterangan singkat item (opsional)';
  noteEditor?.classList.toggle('secure-note-editor', secureNote);
  noteEditorToolbar.classList.toggle('hidden', !secureNote);
  noteEditorMode.classList.toggle('hidden', !secureNote);
  document.querySelector('#note-editor-help').classList.toggle('hidden', !secureNote);
  noteEditorStatus?.classList.toggle('hidden', !secureNote);
  if (!secureNote) setNoteEditorMode('write');
  updateNotePreview();
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
            <button class="tree-node sidebar-link ${active}" type="button" data-group-prefix="${escapeHtml(category.path)}" data-title="${escapeHtml(category.name)}"><i class="fa-solid fa-${escapeHtml(category.icon)}"></i><span data-label>${escapeHtml(category.name)}</span></button>
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
  vaultNoticeText.textContent = text || '';
  vaultNoticeIcon.className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
  vaultNotice.classList.remove('notice-pop');
  void vaultNotice.offsetWidth;
  vaultNotice.classList.remove('hidden');
  vaultNotice.classList.toggle('error', isError);
  vaultNotice.classList.add('notice-pop');
  noticeTimer = setTimeout(() => vaultNotice.classList.add('hidden'), 4000);
}

let confirmResolver = null;
let confirmPreviousFocus = null;
let confirmClosing = false;

function finishConfirm(value, resolve) {
  confirmResolver = null;
  confirmClosing = false;
  confirmModal.classList.add('hidden');
  confirmModal.removeAttribute('data-danger');
  confirmModal.removeAttribute('data-has-list');
  confirmModalList.classList.remove('is-removing');
  confirmModalList.classList.add('hidden');
  confirmModalList.replaceChildren();
  resolve(Boolean(value));
  if (confirmPreviousFocus?.isConnected) confirmPreviousFocus.focus({ preventScroll: true });
  confirmPreviousFocus = null;
}

function resolveConfirm(value) {
  if (!confirmResolver || confirmClosing) return;
  const resolve = confirmResolver;
  if (value && confirmModalList.children.length) {
    confirmClosing = true;
    confirmModalList.classList.add('is-removing');
    window.setTimeout(() => finishConfirm(true, resolve), 3200);
    return;
  }
  finishConfirm(value, resolve);
}

function askConfirm(text, { title = 'Konfirmasi tindakan', eyebrow = 'KONFIRMASI', confirmLabel = 'Lanjutkan', danger = false, items = [] } = {}) {
  if (confirmResolver) resolveConfirm(false);
  confirmPreviousFocus = document.activeElement;
  confirmModalEyebrow.textContent = eyebrow;
  confirmModalTitle.textContent = title;
  confirmModalMessage.textContent = text;
  confirmAcceptButton.textContent = confirmLabel;
  confirmModal.toggleAttribute('data-danger', Boolean(danger));
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  confirmModal.toggleAttribute('data-has-list', list.length > 0);
  confirmModalList.classList.toggle('hidden', list.length === 0);
  confirmModalList.classList.remove('is-removing');
  confirmModalList.innerHTML = list.map((item, index) => {
    const titleText = String(item.title || 'Item tanpa nama');
    const detail = item.type === 'secure-note'
      ? 'Secure Note · Catatan terenkripsi'
      : `${item.username || 'Tanpa username'}${item.url ? ` · ${item.url}` : ''}`;
    return `<div class="confirm-modal-item" style="--confirm-index:${Math.min(index, 8)}" role="listitem">
      <span class="confirm-modal-item-icon" aria-hidden="true"><i class="fa-solid ${item.type === 'secure-note' ? 'fa-note-sticky' : 'fa-key'}"></i></span>
      <span class="confirm-modal-item-copy"><strong>${escapeHtml(titleText)}</strong><small>${escapeHtml(detail)}</small><span class="confirm-modal-item-status"><i class="fa-solid fa-spinner" aria-hidden="true"></i> Menghapus…</span></span>
    </div>`;
  }).join('');
  confirmModal.classList.remove('hidden');
  requestAnimationFrame(() => confirmAcceptButton.focus());
  return new Promise((resolve) => { confirmResolver = resolve; });
}

confirmCancelButton.addEventListener('click', () => resolveConfirm(false));
confirmAcceptButton.addEventListener('click', () => resolveConfirm(true));
confirmModal.addEventListener('click', (event) => {
  if (event.target === confirmModal) resolveConfirm(false);
});

function updateCopiedRow(row, button, usage, fieldLabel) {
  const usageText = row.querySelector('.item-usage');
  if (usageText && Number.isFinite(Number(usage?.usageCount))) {
    usageText.textContent = `Dipakai ${usage.usageCount} kali`;
  }
  const originalHtml = button.innerHTML;
  const originalAria = button.getAttribute('aria-label');
  button.classList.add('copy-success');
  button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
  button.setAttribute('aria-label', `${fieldLabel} berhasil disalin`);
  window.setTimeout(() => {
    if (!button.isConnected) return;
    button.classList.remove('copy-success');
    button.innerHTML = originalHtml;
    if (originalAria) button.setAttribute('aria-label', originalAria);
  }, 850);
}

function setSettingsMessage(text, success = false) {
  setInlineMessage(settingsGoogleMessage, text, success);
}

vaultNoticeDismiss.addEventListener('click', () => {
  clearTimeout(noticeTimer);
  vaultNotice.classList.add('hidden');
});

function refreshSettingsGoogleState() {
  const connected = Boolean(currentUser?.googleEmail);
  const pending = Boolean(settingsGoogleChallengeId);
  settingsGoogleStatus.textContent = pending
    ? 'Identitas Google terverifikasi. Masukkan password vault lokal untuk menyelesaikan koneksi.'
    : connected
      ? `Terhubung sebagai ${currentUser.googleEmail}. Vault tetap dibuka dengan password lokal.`
      : 'Setiap pengguna dapat menghubungkan akun Google miliknya. Login Google dilakukan langsung di halaman resmi Google.';
  settingsGooglePasswordLabel.classList.toggle('hidden', connected && !pending);
  settingsGooglePassword.classList.toggle('hidden', connected && !pending);
  settingsGoogleConnect.classList.toggle('hidden', connected && !pending);
  settingsGoogleDisconnect.classList.toggle('hidden', !connected || pending);
  settingsGoogleConnect.textContent = pending ? 'Selesaikan koneksi' : 'Hubungkan Google';
}

async function loadAppSettings() {
  if (!window.passsa.getAppSettings || !settingsStartup || !settingsMinimizeTray || !settingsQuickAccess) return;
  try {
    const settings = await window.passsa.getAppSettings();
    settingsStartup.checked = Boolean(settings.startWithWindows);
    settingsMinimizeTray.checked = Boolean(settings.minimizeToTray);
    settingsQuickAccess.checked = settings.quickAccessEnabled !== false;
    setInlineMessage(settingsAppMessage, '');
  } catch (error) {
    setInlineMessage(settingsAppMessage, error.message || 'Pengaturan aplikasi gagal dibaca.');
  }
}

async function saveAppSettings() {
  if (!window.passsa.setAppSettings || !settingsStartup || !settingsMinimizeTray || !settingsQuickAccess) return;
  settingsStartup.disabled = true;
  settingsMinimizeTray.disabled = true;
  settingsQuickAccess.disabled = true;
  try {
    const result = await window.passsa.setAppSettings({
      startWithWindows: settingsStartup.checked,
      minimizeToTray: settingsMinimizeTray.checked,
      quickAccessEnabled: settingsQuickAccess.checked,
    });
    if (!result.ok) throw new Error(result.message || 'Pengaturan aplikasi gagal disimpan.');
    setInlineMessage(settingsAppMessage, 'Pengaturan aplikasi disimpan.', true);
  } catch (error) {
    setInlineMessage(settingsAppMessage, error.message || 'Pengaturan aplikasi gagal disimpan.');
  } finally {
    settingsStartup.disabled = false;
    settingsMinimizeTray.disabled = false;
    settingsQuickAccess.disabled = false;
  }
}

function openSettings() {
  settingsGoogleChallengeId = null;
  settingsGooglePassword.value = '';
  changePasswordForm.reset();
  setInlineMessage(settingsPasswordMessage, '');
  settingsExportFormat.value = 'passsa';
  settingsExportPassword.value = '';
  settingsExportPasswordConfirm.value = '';
  settingsExportCsvConfirm.checked = false;
  settingsImportMode.value = 'merge';
  settingsImportPassword.value = '';
  settingsImportCsvConfirm.checked = false;
  setInlineMessage(settingsTransferMessage, '');
  setInlineMessage(settingsAppMessage, '');
  updateTransferFormatFields();
  setSettingsMessage('');
  applyTheme(getThemePreference());
  refreshSettingsGoogleState();
  settingsModal.classList.remove('hidden');
  loadAppSettings();
  refreshHelloSettingsState();
}

function closeSettings() {
  settingsGoogleChallengeId = null;
  settingsGooglePassword.value = '';
  settingsHelloPassword.value = '';
  changePasswordForm.reset();
  setInlineMessage(settingsPasswordMessage, '');
  setInlineMessage(settingsTransferMessage, '');
  setInlineMessage(settingsAppMessage, '');
  setSettingsMessage('');
  settingsModal.classList.add('hidden');
}

function updateTransferFormatFields() {
  const csv = settingsExportFormat.value === 'csv';
  settingsExportPasswordFields.classList.toggle('hidden', csv);
  settingsExportCsvConfirmLabel.classList.toggle('hidden', !csv);
  settingsExportPassword.required = !csv;
  settingsExportPasswordConfirm.required = !csv;
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
  searchInput.placeholder = 'Cari nama, username, atau alamat situs…';
}

function showAllTags() {
  currentFilter = 'tags';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = null;
  selectedIds.clear();
  const tagsButton = document.querySelector('.tree-node[data-filter="tags"]');
  document.querySelectorAll('.tree-node').forEach((node) => node.classList.toggle('active', node === tagsButton));
  document.querySelector('.vault-content h2').textContent = 'Semua Tags';
  clearFilterButton.classList.add('hidden');
  searchInput.value = '';
  searchInput.placeholder = 'Cari tag...';
}

function showNotes() {
  currentFilter = 'notes';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = null;
  selectedIds.clear();
  const notesButton = document.querySelector('.tree-node[data-filter="notes"]');
  document.querySelectorAll('.tree-node').forEach((node) => node.classList.toggle('active', node === notesButton));
  document.querySelector('.vault-content h2').textContent = 'Noted';
  clearFilterButton.textContent = '← Semua item';
  clearFilterButton.setAttribute('aria-label', 'Kembali ke semua item');
  clearFilterButton.classList.remove('hidden');
  searchInput.value = '';
  searchInput.placeholder = 'Cari catatan...';
}

function showTagItems(tag) {
  currentFilter = 'tag';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = tag;
  selectedIds.clear();
  document.querySelectorAll('.sidebar-link').forEach((node) => node.classList.toggle('active', node.dataset.filter === 'tags'));
  document.querySelector('.vault-content h2').textContent = `Tag: ${currentTag}`;
  clearFilterButton.textContent = '← Semua Tags';
  clearFilterButton.setAttribute('aria-label', 'Kembali ke semua tags');
  clearFilterButton.classList.remove('hidden');
  searchInput.placeholder = 'Cari nama, username, atau alamat situs…';
}

async function loadItems() {
  try {
    const [loadedItems, loadedCategories, loadedIcons] = await Promise.all([
      window.passsa.listItems(),
      window.passsa.listCategories(),
      categoryIcons.length ? Promise.resolve(categoryIcons) : window.passsa.listCategoryIcons(),
    ]);
    items = loadedItems.map((item) => ({
      ...item,
      tags: Array.isArray(item.tags)
        ? item.tags
        : String(item.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
    }));
    categories = loadedCategories;
    categoryIcons = loadedIcons;
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
  setInlineMessage(itemMessage, '');
  document.querySelector('#modal-title').textContent = item ? 'Edit Item' : 'Tambah Item';
  document.querySelector('#item-id').value = item?.id ?? '';
  itemTypeInput.value = item?.type ?? 'login';
  document.querySelector('#item-title').value = item?.title ?? '';
  document.querySelector('#item-username').value = item?.username ?? '';
  document.querySelector('#item-password').value = item?.password ?? '';
  document.querySelector('#item-password').type = 'password';
  updateSecretToggle(document.querySelector('#toggle-item-password'), false);
  document.querySelector('#item-url').value = item?.url ?? '';
  document.querySelector('#item-group').value = item?.group ?? currentGroup ?? currentGroupPrefix ?? 'Internet/Coding';
  document.querySelector('#item-favorite').checked = item ? Boolean(item.favorite) : currentFilter === 'favorites';
  document.querySelector('#item-notes').value = item?.notes ?? '';
  document.querySelector('#item-tags').value = item ? (item.tags ?? []).join(', ') : (currentTag ?? '');
  setNoteEditorMode('write');
  renderCustomFields(item?.fields ?? []);
  updateItemTypeUi();
  if (item?.type === 'secure-note') renderNoteHistory(item.noteHistory ?? [], Boolean(item));
  else renderPasswordHistory(item?.passwordHistory ?? [], Boolean(item));
  itemModal.classList.remove('hidden');
  document.querySelector('#item-title').focus();
}

function closeItemModal() {
  document.querySelector('#item-password').value = '';
  tagSuggestions.classList.add('hidden');
  itemModal.classList.add('hidden');
  itemForm.reset();
  renderCustomFields([]);
  setNoteEditorMode('write');
  updateItemTypeUi();
  renderPasswordHistory([], false);
}

loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));
emailInput.addEventListener('input', () => { refreshHelloLoginState(); });
helloLoginButton?.addEventListener('click', async () => {
  helloLoginButton.disabled = true;
  setMessage('Memverifikasi Windows Hello…');
  try {
    const result = await window.passsa.helloUnlock(emailInput.value);
    if (!result.ok) {
      setMessage(result.message || 'Windows Hello gagal membuka vault.');
      return;
    }
    passwordInput.value = '';
    await showVault(result.user);
  } catch (error) {
    setMessage(error.message || 'Windows Hello gagal membuka vault.');
  } finally {
    helloLoginButton.disabled = false;
  }
});

togglePassword.addEventListener('click', () => {
  const visible = passwordInput.type === 'text';
  passwordInput.type = visible ? 'password' : 'text';
  updateSecretToggle(togglePassword, !visible);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = mode === 'register' ? 'Membuat akun…' : 'Memeriksa…';
  try {
    const result = await (mode === 'register' ? window.passsa.register : window.passsa.login)(emailInput.value, passwordInput.value);
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
    submitButton.textContent = mode === 'register' ? 'Buat Akun' : 'Masuk';
  }
});

syncButton.addEventListener('click', async () => {
  if (!currentUser?.googleEmail) {
    showVaultNotice('Hubungkan Google Drive melalui Pengaturan terlebih dahulu.', true);
    return;
  }
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

settingsButton.addEventListener('click', openSettings);
settingsTheme?.addEventListener('change', () => applyTheme(settingsTheme.value));
closeSettingsButton.addEventListener('click', closeSettings);
closeSettingsSecondaryButton.addEventListener('click', closeSettings);
settingsModal.addEventListener('click', (event) => {
  if (event.target === settingsModal) closeSettings();
});

settingsGoogleConnect.addEventListener('click', async () => {
  settingsGoogleConnect.disabled = true;
  setSettingsMessage('');
  try {
    if (settingsGoogleChallengeId) {
      const password = settingsGooglePassword.value;
      if (!password) {
        setSettingsMessage('Masukkan password vault lokal terlebih dahulu.');
        return;
      }
      const result = await window.passsa.googleComplete(settingsGoogleChallengeId, password, currentUser?.email);
      if (!result.ok) {
        setSettingsMessage(result.message || 'Google gagal dihubungkan.');
        return;
      }
      settingsGoogleChallengeId = null;
      await showVault(result.user);
      closeSettings();
      if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
      return;
    }

    const result = await window.passsa.googleLogin();
    if (!result.ok) {
      setSettingsMessage(result.message || 'Login Google gagal.');
      return;
    }
    if (result.autoCompleted) {
      await showVault(result.user);
      closeSettings();
      if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
      return;
    }
    settingsGoogleChallengeId = result.challengeId;
    settingsGooglePassword.value = '';
    refreshSettingsGoogleState();
    setSettingsMessage('Identitas Google terverifikasi.', true);
    settingsGooglePassword.focus();
  } catch (error) {
    setSettingsMessage(error.message || 'Google gagal dihubungkan.');
  } finally {
    settingsGoogleConnect.disabled = false;
  }
});

settingsGoogleDisconnect.addEventListener('click', async () => {
  settingsGoogleDisconnect.disabled = true;
  try {
    const result = await window.passsa.disconnectGoogle();
    if (!result.ok) {
      setSettingsMessage(result.message || 'Google gagal diputuskan.');
      return;
    }
    currentUser = { ...currentUser, provider: 'local', googleEmail: undefined };
    updateTitlebarSyncStatus(currentUser);
    document.querySelector('.sidebar-user small').textContent = 'Vault lokal';
    refreshSettingsGoogleState();
    showVaultNotice('Logout Google berhasil. Token lokal dihapus dan vault kembali menjadi lokal.');
  } catch (error) {
    setSettingsMessage(error.message || 'Google gagal diputuskan.');
  } finally {
    settingsGoogleDisconnect.disabled = false;
  }
});

changePasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setInlineMessage(settingsPasswordMessage, '');
  if (!changePasswordForm.reportValidity()) return;
  if (settingsNewPassword.value !== settingsConfirmPassword.value) {
    setInlineMessage(settingsPasswordMessage, 'Konfirmasi password baru tidak cocok.');
    settingsConfirmPassword.focus();
    return;
  }
  settingsPasswordSubmit.disabled = true;
  settingsPasswordSubmit.textContent = 'Menyimpan…';
  try {
    const result = await window.passsa.changePassword({
      currentPassword: settingsCurrentPassword.value,
      newPassword: settingsNewPassword.value,
    });
    if (!result.ok) {
      setInlineMessage(settingsPasswordMessage, result.message || 'Password gagal diubah.');
      return;
    }
    changePasswordForm.reset();
    setInlineMessage(settingsPasswordMessage, 'Password berhasil diubah dan vault sudah dienkripsi ulang.', true);
    if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
  } catch (error) {
    setInlineMessage(settingsPasswordMessage, error.message || 'Password gagal diubah.');
  } finally {
    settingsPasswordSubmit.disabled = false;
    settingsPasswordSubmit.textContent = 'Simpan Password';
  }
});

settingsExportFormat.addEventListener('change', updateTransferFormatFields);
settingsStartup?.addEventListener('change', saveAppSettings);
settingsMinimizeTray?.addEventListener('change', saveAppSettings);
settingsQuickAccess?.addEventListener('change', saveAppSettings);

settingsHelloEnable?.addEventListener('click', async () => {
  settingsHelloEnable.disabled = true;
  setInlineMessage(settingsHelloMessage, 'Memverifikasi Windows Hello…');
  try {
    const result = await window.passsa.helloEnable(settingsHelloPassword.value);
    if (!result.ok) {
      setInlineMessage(settingsHelloMessage, result.message || 'Windows Hello gagal diaktifkan.');
      return;
    }
    settingsHelloPassword.value = '';
    setInlineMessage(settingsHelloMessage, result.message, true);
    await refreshHelloSettingsState();
  } catch (error) {
    setInlineMessage(settingsHelloMessage, error.message || 'Windows Hello gagal diaktifkan.');
  } finally {
    settingsHelloEnable.disabled = false;
  }
});

settingsHelloDisable?.addEventListener('click', async () => {
  settingsHelloDisable.disabled = true;
  try {
    const result = await window.passsa.helloDisable();
    if (!result.ok) {
      setInlineMessage(settingsHelloMessage, result.message || 'Windows Hello gagal dinonaktifkan.');
      return;
    }
    setInlineMessage(settingsHelloMessage, result.message, true);
    await refreshHelloSettingsState();
    await refreshHelloLoginState();
  } catch (error) {
    setInlineMessage(settingsHelloMessage, error.message || 'Windows Hello gagal dinonaktifkan.');
  } finally {
    settingsHelloDisable.disabled = false;
  }
});

settingsExportButton.addEventListener('click', async () => {
  setInlineMessage(settingsTransferMessage, '');
  const format = settingsExportFormat.value;
  if (format === 'passsa' && settingsExportPassword.value !== settingsExportPasswordConfirm.value) {
    setInlineMessage(settingsTransferMessage, 'Konfirmasi password backup tidak cocok.');
    settingsExportPasswordConfirm.focus();
    return;
  }
  if (format === 'csv' && !settingsExportCsvConfirm.checked) {
    setInlineMessage(settingsTransferMessage, 'Centang konfirmasi bahwa CSV berisi password plaintext.');
    return;
  }
  settingsExportButton.disabled = true;
  settingsExportButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Menyiapkan…';
  try {
    const result = await window.passsa.exportVault({
      format,
      password: settingsExportPassword.value,
      allowPlaintext: settingsExportCsvConfirm.checked,
    });
    if (result.canceled) return;
    if (!result.ok) {
      setInlineMessage(settingsTransferMessage, result.message || 'Export vault gagal.');
      return;
    }
    setInlineMessage(settingsTransferMessage, `${result.message} ${result.itemCount} item diproses.`, true);
    showVaultNotice(result.message, false);
    settingsExportPassword.value = '';
    settingsExportPasswordConfirm.value = '';
  } catch (error) {
    setInlineMessage(settingsTransferMessage, error.message || 'Export vault gagal.');
  } finally {
    settingsExportButton.disabled = false;
    settingsExportButton.innerHTML = '<i class="fa-solid fa-download" aria-hidden="true"></i> Export';
  }
});

settingsImportButton.addEventListener('click', async () => {
  setInlineMessage(settingsTransferMessage, '');
  if (settingsImportMode.value === 'replace' && !(await askConfirm(
    'Mode “Ganti item aktif” akan mengganti item aktif yang ada. Lanjutkan?',
    { title: 'Ganti item aktif?', eyebrow: 'IMPORT VAULT', confirmLabel: 'Lanjutkan', danger: true },
  ))) return;
  settingsImportButton.disabled = true;
  settingsImportButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Memeriksa…';
  try {
    const result = await window.passsa.importVault({
      mode: settingsImportMode.value,
      password: settingsImportPassword.value,
      allowPlaintext: settingsImportCsvConfirm.checked,
    });
    if (result.canceled) return;
    if (!result.ok) {
      setInlineMessage(settingsTransferMessage, result.message || 'Import vault gagal.');
      return;
    }
    await loadItems();
    setInlineMessage(settingsTransferMessage, result.message, true);
    showVaultNotice(result.sync?.message || result.message, result.sync ? !result.sync.ok : false);
    settingsImportPassword.value = '';
  } catch (error) {
    setInlineMessage(settingsTransferMessage, error.message || 'Import vault gagal.');
  } finally {
    settingsImportButton.disabled = false;
    settingsImportButton.innerHTML = '<i class="fa-solid fa-upload" aria-hidden="true"></i> Import File';
  }
});

logoutButton.addEventListener('click', async () => {
  await window.passsa.logout();
  if (!vaultView.classList.contains('hidden')) showAuth('Anda telah keluar.');
});

document.querySelector('#close-modal').addEventListener('click', closeItemModal);
document.querySelector('#cancel-item').addEventListener('click', closeItemModal);
sidebarAddItemButton.addEventListener('click', () => openItemModal());
sidebarAddNoteButton?.addEventListener('click', () => {
  openItemModal();
  itemTypeInput.value = 'secure-note';
  updateItemTypeUi();
  document.querySelector('#item-title')?.focus();
});
sidebarAddTagButton.addEventListener('click', () => {
  openItemModal();
  requestAnimationFrame(() => {
    setInlineMessage(itemMessage, 'Tambahkan tag baru pada credential ini.', true);
    tagInput.focus();
  });
});
searchInput.addEventListener('input', renderItems);
tagSearchInput?.addEventListener('input', renderTagTree);
sortSelect.addEventListener('change', renderItems);
clearFilterButton.addEventListener('click', () => {
  if (currentFilter === 'tag') showAllTags();
  else showAllItems();
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
  if (button.dataset.filter === 'notes') {
    showNotes();
    renderItems();
    return;
  }
    currentFilter = button.dataset.filter ?? 'group';
    currentGroup = button.dataset.group ?? null;
    currentGroupPrefix = button.dataset.groupPrefix ?? null;
    currentTag = button.dataset.tag ?? null;
    selectedIds.clear();
    document.querySelectorAll('.tree-node').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelector('.vault-content h2').textContent = button.dataset.title;
    clearFilterButton.textContent = '← Semua item';
    clearFilterButton.setAttribute('aria-label', 'Kembali ke semua item');
    clearFilterButton.classList.toggle('hidden', currentFilter === 'all' || currentFilter === 'tags');
    searchInput.placeholder = currentFilter === 'tags' ? 'Cari tag...' : 'Cari nama, username, atau alamat situs…';
    renderItems();
});

tagsOverview.addEventListener('click', (event) => {
  const tagButton = event.target.closest('[data-tag-filter]');
  if (!tagButton) return;
  showTagItems(tagButton.dataset.tagFilter);
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
  setInlineMessage(document.querySelector('#category-message'), '');
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
    setInlineMessage(document.querySelector('#category-message'), error.message || 'Kategori gagal disimpan.');
  }
});

document.querySelector('#delete-category').addEventListener('click', async () => {
  const id = document.querySelector('#category-id').value;
  const category = categories.find((item) => item.id === id);
  if (!category) return;
  const confirmed = await askConfirm(
    `Hapus kategori “${category.name}”? Subkategori juga dihapus dan item dipindahkan ke parent.`,
    { title: 'Hapus kategori?', eyebrow: 'KATEGORI CUSTOM', confirmLabel: 'Hapus Kategori', danger: true },
  );
  if (!confirmed) return;
  try {
    await window.passsa.deleteCategory(id);
    closeCategoryModal();
    showAllItems();
    await loadItems();
    showVaultNotice(`Kategori “${category.name}” dihapus.`);
  } catch (error) {
    setInlineMessage(document.querySelector('#category-message'), error.message || 'Kategori gagal dihapus.');
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
  setInlineMessage(document.querySelector('#bulk-message'), '');
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
    setInlineMessage(document.querySelector('#bulk-message'), 'Pilih minimal satu perubahan.');
    return;
  }
  if (['add', 'remove'].includes(changes.tagMode) && !changes.tags.trim()) {
    setInlineMessage(document.querySelector('#bulk-message'), 'Isi tags yang ingin ditambah atau dihapus.');
    return;
  }
  try {
    await window.passsa.bulkUpdate([...selectedIds], changes);
    closeBulkModal();
    await loadItems();
  } catch (error) {
    setInlineMessage(document.querySelector('#bulk-message'), error.message || 'Edit bulk gagal.');
  }
});

document.querySelector('#bulk-delete-button').addEventListener('click', async () => {
  const ids = [...selectedIds];
  if (!ids.length) return;
  const permanent = currentFilter === 'trash';
  const prompt = permanent
    ? `Apakah Anda yakin ingin menghapus permanen ${ids.length} item? Data yang dihapus tidak dapat dipulihkan.`
    : `Pindahkan ${ids.length} item ke Recycle Bin?`;
  const selectedItems = ids
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);
  if (!(await askConfirm(prompt, {
    title: permanent ? 'Apakah Anda yakin?' : 'Pindahkan ke Recycle Bin?',
    eyebrow: permanent ? 'KONFIRMASI PERMANEN' : 'AKSI MASSAL',
    confirmLabel: permanent ? 'Hapus Permanen' : 'Pindahkan',
    danger: true,
    items: selectedItems,
  }))) return;
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
  updateSecretToggle(event.currentTarget, !visible);
});

document.querySelector('#generate-password').addEventListener('click', () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
  const bytes = new Uint32Array(20);
  crypto.getRandomValues(bytes);
  document.querySelector('#item-password').value = Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('');
  document.querySelector('#item-password').type = 'text';
  updateSecretToggle(document.querySelector('#toggle-item-password'), true);
});

itemTypeInput.addEventListener('change', () => {
  updateItemTypeUi();
  if (itemTypeInput.value === 'secure-note') renderNoteHistory([], false);
  else renderPasswordHistory([], false);
});
noteEditorToolbar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-note-format]');
  if (button) applyNoteFormat(button.dataset.noteFormat);
});
noteEditorMode.addEventListener('click', (event) => {
  const button = event.target.closest('[data-note-mode]');
  if (button) setNoteEditorMode(button.dataset.noteMode);
});
noteHeadingLevel?.addEventListener('change', (event) => {
  applyNoteFormat(event.currentTarget.value);
  event.currentTarget.value = 'paragraph';
});
itemNotesInput.addEventListener('input', updateNotePreview);
itemNotesInput.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (event.ctrlKey && ['b', 'i', 'u'].includes(key)) {
    event.preventDefault();
    applyNoteFormat({ b: 'bold', i: 'italic', u: 'underline' }[key]);
    return;
  }
  if (event.ctrlKey && key === 'y') {
    event.preventDefault();
    applyNoteFormat('redo');
    return;
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = itemNotesInput.selectionStart ?? 0;
    const end = itemNotesInput.selectionEnd ?? start;
    replaceNoteSelection('  ', start, end);
    return;
  }
  if (event.key !== 'Enter' || event.shiftKey) return;
  const start = itemNotesInput.selectionStart ?? 0;
  const lineStart = itemNotesInput.value.lastIndexOf('\n', Math.max(0, start - 1)) + 1;
  const currentLine = itemNotesInput.value.slice(lineStart, start);
  const continuation = currentLine.match(/^(\s*(?:[-*+]\s+\[[ xX]\]\s+|[-*+]\s+|\d+[.)]\s+|>\s?))(.*)$/);
  if (!continuation || !continuation[2].trim()) return;
  event.preventDefault();
  replaceNoteSelection(`\n${continuation[1]}`, start, start);
});
notePreview?.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-note-line]');
  if (!toggle || !itemNotesInput) return;
  const lineIndex = Number(toggle.dataset.noteLine);
  const lines = itemNotesInput.value.replace(/\r\n?/g, '\n').split('\n');
  const line = lines[lineIndex] || '';
  const match = line.match(/^(\s*[-*+]\s+\[)([ xX])(\]\s+.*)$/);
  if (!match) return;
  lines[lineIndex] = `${match[1]}${match[2].toLowerCase() === 'x' ? ' ' : 'x'}${match[3]}`;
  itemNotesInput.value = lines.join('\n');
  itemNotesInput.dispatchEvent(new Event('input', { bubbles: true }));
});
addCustomFieldButton.addEventListener('click', () => {
  const fields = collectCustomFields();
  fields.push({ id: crypto.randomUUID(), label: '', type: 'text', value: '' });
  renderCustomFields(fields);
  customFieldsList.querySelector('[data-field-row]:last-child [data-field-label]')?.focus();
});

customFieldsList.addEventListener('click', (event) => {
  const remove = event.target.closest('[data-remove-custom-field]');
  if (remove) {
    remove.closest('[data-field-row]')?.remove();
    return;
  }
  const toggle = event.target.closest('[data-custom-toggle]');
  if (toggle) {
    const input = toggle.closest('.custom-field-value')?.querySelector('[data-field-value]');
    if (!input) return;
    const visible = input.type === 'text';
    input.type = visible ? 'password' : 'text';
    updateSecretToggle(toggle, !visible, 'secret field');
  }
});

customFieldsList.addEventListener('change', (event) => {
  const select = event.target.closest('[data-field-type]');
  if (!select) return;
  const rows = [...customFieldsList.querySelectorAll('[data-field-row]')];
  const fields = rows.map(readCustomFieldRow);
  const row = select.closest('[data-field-row]');
  const index = rows.indexOf(row);
  if (index < 0 || !fields[index]) return;
  const previousType = fields[index].type;
  fields[index].type = select.value;
  if (select.value === 'boolean') {
    fields[index].value = ['true', '1', 'yes', 'ya', 'on'].includes(String(fields[index].value).trim().toLowerCase());
  } else if (previousType === 'boolean') {
    fields[index].value = fields[index].value ? 'true' : 'false';
  }
  renderCustomFields(fields);
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

passwordHistoryList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-history-toggle]');
  if (!button) return;
  const input = button.parentElement?.querySelector('input');
  if (!input) return;
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  const version = button.closest('.password-history-entry')?.querySelector('.password-history-meta strong')?.textContent || 'password';
  updateSecretToggle(button, !visible, version.toLowerCase());
});

itemModal.addEventListener('click', (event) => {
  if (event.target === itemModal) closeItemModal();
});

closeNoteDetailButton?.addEventListener('click', closeNoteDetail);
noteDetailCloseSecondaryButton?.addEventListener('click', closeNoteDetail);
noteDetailModal?.addEventListener('click', (event) => {
  if (event.target === noteDetailModal) closeNoteDetail();
});
noteDetailEditButton?.addEventListener('click', async () => {
  const id = noteDetailCurrentId;
  if (!id) return;
  try {
    const item = await window.passsa.getItem(id);
    closeNoteDetail();
    if (item) openItemModal(item);
  } catch (error) {
    showVaultNotice(error.message || 'Catatan tidak dapat diedit.', true);
  }
});

itemForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!itemForm.reportValidity()) return;
  setInlineMessage(itemMessage, '');
  const saveButton = document.querySelector('#save-item');
  const payload = {
    id: document.querySelector('#item-id').value,
    type: itemTypeInput.value,
    title: document.querySelector('#item-title').value,
    username: document.querySelector('#item-username').value,
    password: document.querySelector('#item-password').value,
    url: document.querySelector('#item-url').value,
    group: document.querySelector('#item-group').value,
    favorite: document.querySelector('#item-favorite').checked,
    notes: document.querySelector('#item-notes').value,
    tags: document.querySelector('#item-tags').value,
    fields: collectCustomFields(),
  };
  const creating = !payload.id;
  saveButton.disabled = true;
  saveButton.textContent = 'Menyimpan…';
  try {
    const result = payload.id
      ? await window.passsa.updateItem(payload)
      : await window.passsa.addItem(payload);
    closeItemModal();
    const updatedIndex = items.findIndex((item) => item.id === result.item.id);
    if (creating) {
      showAllItems();
      items.push(result.item);
    } else if (updatedIndex >= 0) {
      // Reflect the successful IPC response immediately. A subsequent reload
      // still refreshes the encrypted vault and categories from disk.
      items[updatedIndex] = { ...items[updatedIndex], ...result.item };
    }
    renderItems();
    await loadItems();
    showVaultNotice(creating
      ? `Item “${result.item.title}” berhasil ditambahkan.`
      : `Item “${result.item.title}” berhasil diperbarui.`);
  } catch (error) {
    setInlineMessage(itemMessage, error.message || 'Item gagal disimpan.');
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
    showTagItems(tagButton.dataset.tagFilter);
    renderItems();
    return;
  }
  if (row && !event.target.closest('button, input, a')) {
    const rowItem = items.find((candidate) => candidate.id === row.dataset.id);
    if (rowItem?.type === 'secure-note' && !rowItem.deletedAt) {
      openNoteDetail(row.dataset.id);
      return;
    }
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
      updateCopiedRow(row, button, usage, field === 'username' ? 'Username' : 'Password');
      showVaultNotice(`${field === 'username' ? 'Username' : 'Password'} disalin. Clipboard dibersihkan dalam 30 detik.`);
    }
    if (action === 'copy-url') {
      const url = String(item.url ?? '').trim();
      if (!url) {
        showVaultNotice('Item ini belum memiliki alamat situs.', true);
        return;
      }
      const usage = await window.passsa.copyEntrySecret(item.id, 'url');
      item.usageCount = usage.usageCount;
      item.lastUsedAt = usage.lastUsedAt;
      updateCopiedRow(row, button, usage, 'Alamat situs');
      showVaultNotice('Alamat situs disalin. Clipboard dibersihkan dalam 30 detik.');
    }
    if (action === 'delete') {
      const confirmed = await askConfirm(`Hapus “${item.title}” dan pindahkan ke Recycle Bin?`, {
        title: 'Pindahkan item?',
        eyebrow: 'RECYCLE BIN',
        confirmLabel: 'Pindahkan',
        danger: true,
      });
      if (confirmed) {
        const result = await window.passsa.deleteItem(item.id);
        items[items.findIndex((candidate) => candidate.id === item.id)] = result.item;
        renderItems();
      }
    }
    if (action === 'restore') {
      const result = await window.passsa.restoreItem(item.id);
      items[items.findIndex((candidate) => candidate.id === item.id)] = result.item;
      renderItems();
    }
    if (action === 'purge') {
      const confirmed = await askConfirm(`Apakah Anda yakin ingin menghapus permanen “${item.title}”? Data yang dihapus tidak dapat dipulihkan.`, {
        title: 'Apakah Anda yakin?',
        eyebrow: 'KONFIRMASI PERMANEN',
        confirmLabel: 'Hapus Permanen',
        danger: true,
      });
      if (confirmed) {
        await window.passsa.purgeItem(item.id);
        items = items.filter((candidate) => candidate.id !== item.id);
        renderItems();
      }
    }
  } catch (error) {
    showVaultNotice(error.message || 'Operasi item gagal.', true);
  }
});

itemsList.addEventListener('keydown', (event) => {
  if (!['Enter', ' '].includes(event.key)) return;
  const row = event.target.closest('.note-card');
  if (!row || event.target.closest('button, input, a')) return;
  event.preventDefault();
  openNoteDetail(row.dataset.id);
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
  if (!confirmModal.classList.contains('hidden')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      resolveConfirm(false);
    }
    return;
  }
  if (event.key !== 'Escape') return;
  if (!noteDetailModal.classList.contains('hidden')) closeNoteDetail();
  else if (!settingsModal.classList.contains('hidden')) closeSettings();
  else if (!categoryModal.classList.contains('hidden')) closeCategoryModal();
  else if (!bulkModal.classList.contains('hidden')) closeBulkModal();
  else if (!itemModal.classList.contains('hidden')) closeItemModal();
});

window.passsa.onLocked((reason) => showAuth(reason || 'Vault dikunci.'));
window.passsa.onQuickAccessOpen(async (id) => {
  try {
    const item = await window.passsa.getItem(String(id || ''));
    if (!item) {
      showVaultNotice('Credential tidak ditemukan.', true);
      return;
    }
    if (item.type === 'secure-note') await openNoteDetail(item.id);
    else openItemModal(item);
  } catch (error) {
    showVaultNotice(error.message || 'Credential tidak dapat dibuka.', true);
  }
});

window.passsa.session().then((user) => {
  if (user) showVault(user);
});
