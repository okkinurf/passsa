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
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#message');
const submitButton = document.querySelector('#submit-button');
const togglePassword = document.querySelector('#toggle-password');
const helloLoginButton = document.querySelector('#hello-login-button');
const directLoginButton = document.querySelector('#direct-login-button');
const directLoginHelp = document.querySelector('#direct-login-help');
const registerSecurityNote = document.querySelector('#register-security-note');
const devBypassButton = document.querySelector('#dev-bypass-button');
const devBypassHelp = document.querySelector('#dev-bypass-help');
const helloLoginMessage = document.querySelector('#message');
const syncButton = document.querySelector('#sync-button');
const settingsButton = document.querySelector('#settings-button');
const logoutButton = document.querySelector('#logout-button');
const itemModal = document.querySelector('#item-modal');
const noteDetailModal = document.querySelector('#note-detail-modal');
const authenticatorDetailModal = document.querySelector('#authenticator-detail-modal');
const credentialDetailModal = document.querySelector('#credential-detail-modal');
const credentialDetailTitle = document.querySelector('#credential-detail-title');
const credentialDetailSubtitle = document.querySelector('#credential-detail-subtitle');
const credentialDetailUrl = document.querySelector('#credential-detail-url');
const credentialDetailUsername = document.querySelector('#credential-detail-username');
const credentialDetailPassword = document.querySelector('#credential-detail-password');
const credentialDetailGroup = document.querySelector('#credential-detail-group');
const credentialDetailUsage = document.querySelector('#credential-detail-usage');
const credentialDetailNotes = document.querySelector('#credential-detail-notes');
const closeCredentialDetailButton = document.querySelector('#close-credential-detail');
const credentialDetailCopyUrlButton = document.querySelector('#credential-detail-copy-url');
const credentialDetailCopyUsernameButton = document.querySelector('#credential-detail-copy-username');
const credentialDetailCopyPasswordButton = document.querySelector('#credential-detail-copy-password');
const toggleCredentialDetailPasswordButton = document.querySelector('#toggle-credential-detail-password');
const credentialDetailCloseSecondaryButton = document.querySelector('#credential-detail-close-secondary');
const credentialDetailEditButton = document.querySelector('#credential-detail-edit');
const authenticatorDetailTitle = document.querySelector('#authenticator-detail-title');
const authenticatorDetailSubtitle = document.querySelector('#authenticator-detail-subtitle');
const authenticatorDetailCode = document.querySelector('#authenticator-detail-code');
const authenticatorDetailTimer = document.querySelector('#authenticator-detail-timer');
const authenticatorDetailUsage = document.querySelector('#authenticator-detail-usage');
const authenticatorDetailIssuer = document.querySelector('#authenticator-detail-issuer');
const authenticatorDetailAccount = document.querySelector('#authenticator-detail-account');
const authenticatorDetailGroup = document.querySelector('#authenticator-detail-group');
const authenticatorDetailConfig = document.querySelector('#authenticator-detail-config');
const authenticatorDetailNotes = document.querySelector('#authenticator-detail-notes');
const closeAuthenticatorDetailButton = document.querySelector('#close-authenticator-detail');
const authenticatorDetailCopyButton = document.querySelector('#authenticator-detail-copy');
const authenticatorDetailEditButton = document.querySelector('#authenticator-detail-edit');
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
const authenticatorFields = document.querySelector('#authenticator-fields');
const itemTotpIssuer = document.querySelector('#item-totp-issuer');
const itemTotpAccount = document.querySelector('#item-totp-account');
const itemTotpSecret = document.querySelector('#item-totp-secret');
const toggleItemTotpSecret = document.querySelector('#toggle-item-totp-secret');
const itemTotpUri = document.querySelector('#item-totp-uri');
const itemTotpAlgorithm = document.querySelector('#item-totp-algorithm');
const itemTotpDigits = document.querySelector('#item-totp-digits');
const itemTotpPeriod = document.querySelector('#item-totp-period');
const itemTotpMessage = document.querySelector('#item-totp-message');
const itemNotesLabel = document.querySelector('#item-notes-label');
const itemNotesInput = document.querySelector('#item-notes');
const noteEditor = document.querySelector('#note-editor');
const noteEditorToolbar = document.querySelector('#note-editor-toolbar');
const noteEditorMode = document.querySelector('#note-editor-mode');
const notePreview = document.querySelector('#note-preview');
const noteHeadingLevel = document.querySelector('#note-heading-level');
const noteEditorStatus = document.querySelector('#note-editor-status');
const noteEditorSaveState = document.querySelector('#note-editor-save-state');
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
const sidebarAddAuthenticatorButton = document.querySelector('#sidebar-add-authenticator-button');
const sidebarAddTagButton = document.querySelector('#sidebar-add-tag-button');
const settingsModal = document.querySelector('#settings-modal');
const closeSettingsButton = document.querySelector('#close-settings');
const closeSettingsSecondaryButton = document.querySelector('#close-settings-secondary');
const settingsGoogleConnect = document.querySelector('#settings-google-connect');
const twoFactorModal = document.querySelector('#two-factor-modal');
const twoFactorForm = document.querySelector('#two-factor-form');
const twoFactorTitle = document.querySelector('#two-factor-title');
const twoFactorSetupPanel = document.querySelector('#two-factor-setup-panel');
const twoFactorManualKey = document.querySelector('#two-factor-manual-key');
const copyTwoFactorManualKeyButton = document.querySelector('#copy-two-factor-manual-key');
const twoFactorKeySourceInputs = [...document.querySelectorAll('input[name="two-factor-key-source"]')];
const twoFactorGeneratedKeyBlock = document.querySelector('#two-factor-generated-key-block');
const twoFactorExistingKeyPanel = document.querySelector('#two-factor-existing-key-panel');
const twoFactorExistingKey = document.querySelector('#two-factor-existing-key');
const toggleTwoFactorExistingKeyButton = document.querySelector('#toggle-two-factor-existing-key');
const twoFactorUriDetails = document.querySelector('#two-factor-uri-details');
const twoFactorOtpAuthUri = document.querySelector('#two-factor-otpauth-uri');
const twoFactorInstructions = document.querySelector('#two-factor-instructions');
const twoFactorCodeLabel = document.querySelector('#two-factor-code-label');
const twoFactorCode = document.querySelector('#two-factor-code');
const twoFactorRecoveryToggle = document.querySelector('#two-factor-recovery-toggle');
const twoFactorRecoveryField = document.querySelector('#two-factor-recovery-field');
const twoFactorRecoveryCode = document.querySelector('#two-factor-recovery-code');
const twoFactorMessage = document.querySelector('#two-factor-message');
const twoFactorRecoveryPanel = document.querySelector('#two-factor-recovery-panel');
const twoFactorRecoveryCodes = document.querySelector('#two-factor-recovery-codes');
const copyTwoFactorRecoveryCodesButton = document.querySelector('#copy-two-factor-recovery-codes');
const twoFactorRecoveryConfirm = document.querySelector('#two-factor-recovery-confirm');
const twoFactorSubmit = document.querySelector('#two-factor-submit');
const twoFactorFinish = document.querySelector('#two-factor-finish');
const closeTwoFactorButton = document.querySelector('#close-two-factor');
const cancelTwoFactorButton = document.querySelector('#cancel-two-factor');

const modalFocusOrigins = new WeakMap();
let titlebarSyncStatusRequestId = 0;
const focusableModalSelector = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

function rememberModalFocus(modal) {
  const active = document.activeElement;
  if (active instanceof HTMLElement && active !== document.body) modalFocusOrigins.set(modal, active);
}

function restoreModalFocus(modal) {
  const origin = modalFocusOrigins.get(modal);
  modalFocusOrigins.delete(modal);
  if (origin?.isConnected) requestAnimationFrame(() => origin.focus({ preventScroll: true }));
}

function constrainModalFocus(event) {
  if (event.key !== 'Tab') return;
  const modal = [confirmModal, itemModal, noteDetailModal, authenticatorDetailModal, credentialDetailModal, settingsModal, categoryModal, bulkModal, twoFactorModal]
    .find((candidate) => !candidate.classList.contains('hidden'));
  if (!modal) return;
  const controls = [...modal.querySelectorAll(focusableModalSelector)]
    .filter((element) => element.getClientRects().length > 0);
  if (!controls.length) return;
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
const settingsGoogleDisconnect = document.querySelector('#settings-google-disconnect');
const settingsGooglePassword = document.querySelector('#settings-google-password');
const settingsGooglePasswordLabel = document.querySelector('#settings-google-password-label');
const settingsGoogleStatus = document.querySelector('#settings-google-status');
const settingsGoogleDetails = document.querySelector('#settings-google-details');
const settingsGoogleEmail = document.querySelector('#settings-google-email');
const settingsGoogleSize = document.querySelector('#settings-google-size');
const settingsGoogleMessage = document.querySelector('#settings-google-message');
const settingsS3Status = document.querySelector('#settings-s3-status');
const settingsS3Details = document.querySelector('#settings-s3-details');
const settingsS3Location = document.querySelector('#settings-s3-location');
const settingsS3Account = document.querySelector('#settings-s3-account');
const settingsS3Form = document.querySelector('#settings-s3-form');
const settingsS3Endpoint = document.querySelector('#settings-s3-endpoint');
const settingsS3Region = document.querySelector('#settings-s3-region');
const settingsS3Bucket = document.querySelector('#settings-s3-bucket');
const settingsS3Prefix = document.querySelector('#settings-s3-prefix');
const settingsS3AccessKey = document.querySelector('#settings-s3-access-key');
const settingsS3SecretKey = document.querySelector('#settings-s3-secret-key');
const settingsS3SessionToken = document.querySelector('#settings-s3-session-token');
const settingsS3Message = document.querySelector('#settings-s3-message');
const settingsS3Connect = document.querySelector('#settings-s3-connect');
const settingsS3Sync = document.querySelector('#settings-s3-sync');
const settingsS3Disconnect = document.querySelector('#settings-s3-disconnect');
const settingsS3PasswordPanel = document.querySelector('#settings-s3-password-panel');
const settingsS3UnlockPassword = document.querySelector('#settings-s3-unlock-password');
const settingsS3Unlock = document.querySelector('#settings-s3-unlock');
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
const settingsTwoFactorEnable = document.querySelector('#settings-2fa-enable');
const settingsLoginMethodStatus = document.querySelector('#settings-login-method-status');
const settingsPasswordMethodStatus = document.querySelector('#settings-password-method-status');
const settingsTwoFactorDisableOpen = document.querySelector('#settings-2fa-disable-open');
const settingsTwoFactorDisablePanel = document.querySelector('#settings-2fa-disable-panel');
const settingsTwoFactorPassword = document.querySelector('#settings-2fa-current-password');
const settingsTwoFactorCode = document.querySelector('#settings-2fa-current-code');
const settingsTwoFactorMessage = document.querySelector('#settings-2fa-message');
const settingsTwoFactorDisableSubmit = document.querySelector('#settings-2fa-disable-submit');
const settingsTwoFactorDisableCancel = document.querySelector('#settings-2fa-disable-cancel');
const settingsDirectLoginStatus = document.querySelector('#settings-direct-login-status');
const settingsDirectLoginDetails = document.querySelector('#settings-direct-login-details');
const settingsDirectLoginEnable = document.querySelector('#settings-direct-login-enable');
const settingsDirectLoginDisable = document.querySelector('#settings-direct-login-disable');
const settingsDirectLoginPanel = document.querySelector('#settings-direct-login-panel');
const settingsDirectLoginPassword = document.querySelector('#settings-direct-login-password');
const settingsDirectLoginMessage = document.querySelector('#settings-direct-login-message');
const settingsDirectLoginConfirm = document.querySelector('#settings-direct-login-confirm');
const settingsDirectLoginCancel = document.querySelector('#settings-direct-login-cancel');
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
const settingsOpacity = document.querySelector('#settings-opacity');
const settingsOpacityValue = document.querySelector('#settings-opacity-value');
const settingsAboutVersion = document.querySelector('#settings-about-version');
const settingsAboutRuntime = document.querySelector('#settings-about-runtime');
const settingsAboutLatestVersion = document.querySelector('#settings-about-latest-version');
const settingsAboutCheckedAt = document.querySelector('#settings-about-checked-at');
const settingsAboutUpdateStatus = document.querySelector('#settings-about-update-status');
const settingsAboutReleaseSummary = document.querySelector('#settings-about-release-summary');
const settingsAboutCheckUpdates = document.querySelector('#settings-about-check-updates');
const settingsAboutDownloadUpdate = document.querySelector('#settings-about-download-update');
const settingsAboutGithub = document.querySelector('#settings-about-github');
const settingsAboutReleases = document.querySelector('#settings-about-releases');
const settingsPaletteInputs = [...document.querySelectorAll('input[name="settings-palette"]')];
const settingsPaletteHelp = document.querySelector('#settings-palette-help');
const THEME_STORAGE_KEY = 'passsa-theme';
const PALETTE_STORAGE_KEY = 'passsa-palette';
const OPACITY_STORAGE_KEY = 'passsa-opacity';
const UPDATE_CHECK_STORAGE_KEY = 'passsa-update-check-v1';
const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const GITHUB_RELEASES_API = 'https://api.github.com/repos/okkinurf/passsa/releases?per_page=100';
const PALETTE_LABELS = {
  rose: 'Rosewood',
  ocean: 'Ocean',
  forest: 'Forest',
  violet: 'Violet',
  sunset: 'Sunset',
  amber: 'Amber',
  teal: 'Teal',
  indigo: 'Indigo',
  coral: 'Coral',
  slate: 'Slate',
};
const systemThemeQuery = typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null;
let currentAppVersion = '';
let appInfoPromise = null;
let updateCheckPromise = null;
let latestReleaseUrl = 'releases';
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
let settingsTwoFactorEnabled = null;
let settingsDirectLoginEnabled = null;
let settingsGoogleChallengeId = null;
let twoFactorChallengeId = null;
let twoFactorSetupMode = false;
let twoFactorRecoveryMode = false;
let twoFactorCompletedResult = null;
let currentFilter = 'all';
let currentGroup = null;
let currentGroupPrefix = null;
let currentTag = null;
let noteDetailCurrentId = null;
let noteDetailHistoryEntries = [];
let authenticatorDetailCurrentId = null;
let authenticatorDetailRefreshTimer = null;
let authenticatorDetailRefreshInFlight = false;
let authenticatorDetailCopyFeedbackTimer = null;
let authenticatorDetailCopyRequestId = 0;
let credentialDetailCurrentItem = null;
let credentialDetailOpenRequestId = 0;
let credentialDetailCopyFeedbackTimer = null;
let credentialDetailCopyRequestId = 0;
let formNoteHistoryEntries = [];
let idleLockTimer;
let initializeSidebarCollapsed = true;
let sidebarCountsDirty = true;
let sidebarTreeDirty = true;
let tagTreeDirty = true;
let renderItemsFrame = null;
let virtualItemsFrame = null;
let renderedVirtualRange = null;
let totpRefreshInFlight = false;

const VIRTUALIZE_ITEM_THRESHOLD = 300;
const VIRTUAL_ITEM_HEIGHT = 88;
const VIRTUAL_ITEM_OVERSCAN = 8;

function normalizeRendererItem(item) {
  const tags = Array.isArray(item?.tags)
    ? item.tags
    : String(item?.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const searchText = [
    item?.title,
    item?.username,
    item?.url,
    item?.notes,
    item?.group,
    item?.totp?.issuer,
    item?.totp?.account,
    ...tags,
    ...(Array.isArray(item?.fields) ? item.fields.map((field) => field?.label) : []),
  ].map((value) => String(value ?? '').toLowerCase()).filter(Boolean).join('\u0001');
  return { ...item, tags, _searchText: searchText };
}

function markItemDataDirty() {
  sidebarCountsDirty = true;
  tagTreeDirty = true;
}

function markCategoryDataDirty() {
  sidebarTreeDirty = true;
}

function replaceRendererItem(nextItem) {
  if (!nextItem?.id) return;
  const index = items.findIndex((item) => item.id === nextItem.id);
  if (index < 0) return;
  items[index] = normalizeRendererItem(nextItem);
  markItemDataDirty();
}

function scheduleRenderItems() {
  if (renderItemsFrame !== null) return;
  renderItemsFrame = requestAnimationFrame(() => {
    renderItemsFrame = null;
    renderItems();
  });
}

function scheduleVirtualItemsRender() {
  if (virtualItemsFrame !== null) return;
  const scrollContainer = document.querySelector('.items-scroll');
  if (!scrollContainer || !itemsList.classList.contains('is-virtualized') || !renderedVirtualRange) return;

  // Keep the current DOM window while the viewport is still inside its
  // overscan buffer. Rebuilding every row on every wheel event causes visible
  // flashes and repeatedly restarts row entrance animations.
  const visibleStart = Math.floor(scrollContainer.scrollTop / VIRTUAL_ITEM_HEIGHT);
  const visibleEnd = Math.ceil((scrollContainer.scrollTop + scrollContainer.clientHeight) / VIRTUAL_ITEM_HEIGHT);
  // Leave a few rows of hysteresis so scrolling through the overscan window
  // does not rebuild the DOM on every row boundary.
  const edgeBuffer = 2;
  const nearTopEdge = renderedVirtualRange.start > 0
    && visibleStart <= renderedVirtualRange.start + edgeBuffer;
  const nearBottomEdge = renderedVirtualRange.end < visibleItems.length
    && visibleEnd >= renderedVirtualRange.end - edgeBuffer;
  if (!nearTopEdge && !nearBottomEdge) return;

  virtualItemsFrame = requestAnimationFrame(() => {
    virtualItemsFrame = null;
    renderItems({ virtualScroll: true });
  });
}

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

function normalizeOpacityPreference(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 100;
  return Math.min(100, Math.max(70, Math.round(numericValue)));
}

function getOpacityPreference() {
  try {
    const value = localStorage.getItem(OPACITY_STORAGE_KEY);
    return value === null ? 100 : normalizeOpacityPreference(value);
  } catch {
    return 100;
  }
}

function applyOpacity(preference = getOpacityPreference()) {
  const normalized = normalizeOpacityPreference(preference);
  document.documentElement.style.setProperty('--passsa-opacity', `${normalized}%`);
  if (settingsOpacity) settingsOpacity.value = String(normalized);
  if (settingsOpacityValue) settingsOpacityValue.value = `${normalized}%`;
  try {
    localStorage.setItem(OPACITY_STORAGE_KEY, String(normalized));
  } catch { /* Opasitas tetap diterapkan jika penyimpanan preferensi tidak tersedia. */ }
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

function normalizePalettePreference(value) {
  return Object.hasOwn(PALETTE_LABELS, value) ? value : 'rose';
}

function getPalettePreference() {
  try {
    return normalizePalettePreference(localStorage.getItem(PALETTE_STORAGE_KEY));
  } catch {
    return 'rose';
  }
}

function applyPalette(preference = getPalettePreference(), resolvedTheme = document.documentElement.dataset.theme || resolveTheme(getThemePreference())) {
  const normalized = normalizePalettePreference(preference);
  document.documentElement.dataset.palette = normalized;
  settingsPaletteInputs.forEach((input) => {
    const selected = input.value === normalized;
    input.checked = selected;
    input.closest('.theme-palette-option')?.classList.toggle('selected', selected);
  });
  if (settingsPaletteHelp) settingsPaletteHelp.textContent = `${PALETTE_LABELS[normalized]} · ikon ikut warna tema`;
  try {
    const nativeThemeUpdate = window.passsa.setTheme?.(resolvedTheme, normalized);
    nativeThemeUpdate?.catch?.(() => undefined);
  } catch { /* Palet Quick Access tetap diperbarui saat bridge native belum siap. */ }
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, normalized);
  } catch { /* Preferensi warna tetap diterapkan jika storage tidak tersedia. */ }
}

function applyTheme(preference = getThemePreference()) {
  const normalized = normalizeThemePreference(preference);
  const resolved = resolveTheme(normalized);
  document.documentElement.dataset.themePreference = normalized;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
  applyPalette(getPalettePreference(), resolved);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, normalized);
  } catch { /* Preferensi tema tetap diterapkan jika storage tidak tersedia. */ }
  if (settingsTheme) settingsTheme.value = normalized;
  updateThemeHelp(normalized, resolved);
}

applyTheme();
applyOpacity();
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
  usernameInput.readOnly = false;
  const registering = mode === 'register';
  registerSecurityNote?.classList.toggle('hidden', !registering);
  document.querySelector('.tabs').dataset.mode = registering ? 'register' : 'login';
  loginTab.classList.toggle('active', !registering);
  registerTab.classList.toggle('active', registering);
  loginTab.setAttribute('aria-selected', String(!registering));
  registerTab.setAttribute('aria-selected', String(registering));
  title.textContent = registering ? 'Buat akun PassSa' : 'Masuk ke PassSa';
  subtitle.textContent = registering
    ? 'Disimpan di perangkat ini.'
    : 'Buka vault lokal Anda.';
  submitButton.textContent = registering ? 'Buat Akun' : 'Masuk';
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  form.reset();
  setMessage('');
  helloLoginButton?.classList.add('hidden');
  usernameInput.focus();
}

function setMessage(text, success = false) {
  setInlineMessage(message, text, success);
}

function resetTwoFactorModalFields() {
  twoFactorChallengeId = null;
  twoFactorSetupMode = false;
  twoFactorRecoveryMode = false;
  twoFactorCompletedResult = null;
  twoFactorForm.reset();
  twoFactorManualKey.textContent = '';
  twoFactorExistingKey.value = '';
  twoFactorExistingKey.type = 'password';
  updateSecretToggle(toggleTwoFactorExistingKeyButton, false);
  const generatedKeyInput = twoFactorKeySourceInputs.find((input) => input.value === 'generated');
  if (generatedKeyInput) generatedKeyInput.checked = true;
  twoFactorGeneratedKeyBlock.classList.remove('hidden');
  twoFactorExistingKeyPanel.classList.add('hidden');
  twoFactorExistingKey.required = false;
  twoFactorUriDetails.classList.remove('hidden');
  twoFactorOtpAuthUri.textContent = '';
  twoFactorRecoveryCodes.replaceChildren();
  twoFactorRecoveryConfirm.checked = false;
  twoFactorSetupPanel.classList.add('hidden');
  twoFactorRecoveryPanel.classList.add('hidden');
  twoFactorRecoveryField.classList.add('hidden');
  twoFactorCode.classList.remove('hidden');
  twoFactorCodeLabel.classList.remove('hidden');
  twoFactorCode.required = true;
  twoFactorRecoveryCode.required = false;
  twoFactorRecoveryToggle.classList.remove('hidden');
  twoFactorSubmit.classList.remove('hidden');
  twoFactorFinish.classList.add('hidden');
  closeTwoFactorButton.disabled = false;
  cancelTwoFactorButton.disabled = false;
  setInlineMessage(twoFactorMessage, '');
}

function isUsingExistingTwoFactorKey() {
  return twoFactorKeySourceInputs.find((input) => input.checked)?.value === 'existing';
}

function updateTwoFactorKeySource() {
  const useExisting = isUsingExistingTwoFactorKey();
  twoFactorGeneratedKeyBlock.classList.toggle('hidden', useExisting);
  twoFactorExistingKeyPanel.classList.toggle('hidden', !useExisting);
  twoFactorExistingKey.required = useExisting;
  twoFactorUriDetails.classList.toggle('hidden', useExisting);
  if (useExisting) twoFactorExistingKey.focus();
}

function openTwoFactorModal(result) {
  const setup = Boolean(result?.requires2faSetup);
  const challenge = result?.twoFactor;
  if (!challenge?.challengeId) {
    setMessage('Sesi 2FA tidak valid. Silakan mulai login kembali.');
    return;
  }
  resetTwoFactorModalFields();
  twoFactorChallengeId = challenge.challengeId;
  twoFactorSetupMode = setup;
  twoFactorTitle.textContent = setup ? 'Aktifkan Google Authenticator' : 'Verifikasi Google Authenticator';
  twoFactorInstructions.textContent = setup
    ? 'Masukkan kode pertama dari Authenticator untuk mengaktifkan 2FA.'
    : 'Masukkan kode 6 digit yang sedang tampil di Google Authenticator. Kode ini hanya berlaku sebentar.';
  if (setup) {
    twoFactorSetupPanel.classList.remove('hidden');
    twoFactorManualKey.textContent = challenge.manualKey || '';
    twoFactorOtpAuthUri.textContent = challenge.otpAuthUri || '';
    twoFactorCodeLabel.textContent = 'Kode 6 digit';
  } else {
    twoFactorCodeLabel.textContent = 'Kode 6 digit';
  }
  rememberModalFocus(twoFactorModal);
  twoFactorModal.classList.remove('hidden');
  requestAnimationFrame(() => twoFactorCode.focus());
}

function closeTwoFactorModal() {
  if (twoFactorCompletedResult) return;
  resetTwoFactorModalFields();
  twoFactorModal.classList.add('hidden');
  restoreModalFocus(twoFactorModal);
}

async function finishTwoFactorResult(result) {
  twoFactorCompletedResult = null;
  closeTwoFactorModal();
  await showVault(result.user);
  await loadTwoFactorStatus();
  await loadDirectLoginStatus();
  if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
}

function renderRecoveryCodes(codes) {
  twoFactorRecoveryCodes.replaceChildren(...(codes || []).map((code) => {
    const item = document.createElement('li');
    const value = document.createElement('code');
    value.textContent = code;
    item.append(value);
    return item;
  }));
}

copyTwoFactorRecoveryCodesButton?.addEventListener('click', async () => {
  const codes = [...twoFactorRecoveryCodes.querySelectorAll('code')]
    .map((code) => code.textContent.trim())
    .filter(Boolean);
  if (!codes.length) return;

  copyTwoFactorRecoveryCodesButton.disabled = true;
  try {
    const result = await window.passsa.copySecret(codes.join('\n'));
    if (!result?.ok) throw new Error(result?.message || 'Recovery code tidak dapat disalin.');
    const icon = copyTwoFactorRecoveryCodesButton.querySelector('i');
    const label = copyTwoFactorRecoveryCodesButton.querySelector('span');
    icon?.classList.replace('fa-copy', 'fa-check');
    if (label) label.textContent = 'Tersalin';
    copyTwoFactorRecoveryCodesButton.setAttribute('aria-label', 'Semua recovery code tersalin');
    setInlineMessage(twoFactorMessage, 'Semua recovery code disalin. Clipboard dibersihkan dalam 30 detik.', true);
    setTimeout(() => {
      icon?.classList.replace('fa-check', 'fa-copy');
      if (label) label.textContent = 'Salin semua';
      copyTwoFactorRecoveryCodesButton.setAttribute('aria-label', 'Salin semua recovery code');
    }, 1800);
  } catch (error) {
    setInlineMessage(twoFactorMessage, error.message || 'Recovery code tidak dapat disalin.');
  } finally {
    copyTwoFactorRecoveryCodesButton.disabled = false;
  }
});

async function loadTwoFactorStatus() {
  const status = document.querySelector('#settings-2fa-status');
  const details = document.querySelector('#settings-2fa-details');
  if (!status || !window.passsa.twoFactorStatus) return;
  try {
    const result = await window.passsa.twoFactorStatus();
    if (!result.ok) {
      settingsTwoFactorEnabled = null;
      status.textContent = 'Tidak tersedia';
      if (details) details.textContent = result.message || 'Status 2FA tidak dapat dibaca.';
      settingsTwoFactorEnable?.classList.add('hidden');
      settingsTwoFactorDisableOpen?.classList.add('hidden');
      updateSettingsLoginMethodSummary();
      return;
    }
    settingsTwoFactorEnabled = Boolean(result.enabled);
    status.textContent = result.enabled ? 'Aktif' : 'Belum aktif';
    const configurable = result.supported !== false;
    settingsTwoFactorEnable?.classList.toggle('hidden', !configurable || result.enabled);
    settingsTwoFactorDisableOpen?.classList.toggle('hidden', !configurable || !result.enabled);
    if (!result.enabled) settingsTwoFactorDisablePanel?.classList.add('hidden');
    if (details) {
      details.textContent = result.enabled
        ? `Password + kode 6 digit. Recovery code tersisa: ${result.recoveryCodesRemaining ?? 0}.`
        : 'Mode login menggunakan password saja. Authenticator dapat diaktifkan kapan saja.';
    }
    updateSettingsLoginMethodSummary();
  } catch (error) {
    settingsTwoFactorEnabled = null;
    status.textContent = 'Tidak tersedia';
    if (details) details.textContent = error.message || 'Status 2FA tidak dapat dibaca.';
    settingsTwoFactorEnable?.classList.add('hidden');
    settingsTwoFactorDisableOpen?.classList.add('hidden');
    updateSettingsLoginMethodSummary();
  }
}

function updateSettingsLoginMethodSummary() {
  if (settingsTwoFactorEnabled === null || settingsDirectLoginEnabled === null) {
    if (settingsLoginMethodStatus) settingsLoginMethodStatus.textContent = 'Status tidak tersedia';
    if (settingsPasswordMethodStatus) settingsPasswordMethodStatus.textContent = 'Status tidak tersedia';
    return;
  }
  const method = settingsTwoFactorEnabled
    ? 'password-2fa'
    : settingsDirectLoginEnabled
      ? 'direct-login'
      : 'password';
  if (settingsLoginMethodStatus) {
    settingsLoginMethodStatus.textContent = method === 'password-2fa'
      ? 'Password + 2FA'
      : method === 'direct-login'
        ? 'Login langsung'
        : 'Password saja';
    settingsLoginMethodStatus.dataset.state = 'active';
  }
  if (settingsPasswordMethodStatus) {
    settingsPasswordMethodStatus.textContent = method === 'password' ? 'Aktif' : 'Nonaktif';
    settingsPasswordMethodStatus.dataset.state = method === 'password' ? 'active' : 'inactive';
  }
}

async function loadDirectLoginStatus() {
  if (!window.passsa.directLoginStatus) {
    settingsDirectLoginEnabled = null;
    updateSettingsLoginMethodSummary();
    return;
  }
  try {
    const result = await window.passsa.directLoginStatus();
    const enabled = result?.ok && result.enabled === true;
    const supported = result?.supported === true;
    const hasTwoFactor = result?.twoFactorEnabled === true;
    settingsDirectLoginEnabled = enabled;
    if (result && typeof result.twoFactorEnabled === 'boolean') settingsTwoFactorEnabled = hasTwoFactor;
    directLoginButton?.classList.toggle('hidden', !enabled);
    directLoginHelp?.classList.toggle('hidden', !enabled);
    if (directLoginButton && enabled && result.username) {
      directLoginButton.textContent = `Masuk langsung sebagai ${result.username}`;
      directLoginButton.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-unlock-keyhole" aria-hidden="true"></i> ');
    }
    if (settingsDirectLoginStatus) settingsDirectLoginStatus.textContent = enabled ? 'Aktif di perangkat ini' : hasTwoFactor ? 'Tidak tersedia saat 2FA aktif' : 'Nonaktif';
    settingsDirectLoginEnable?.classList.toggle('hidden', !supported || enabled || hasTwoFactor);
    settingsDirectLoginDisable?.classList.toggle('hidden', !enabled);
    if (settingsDirectLoginDetails) {
      settingsDirectLoginDetails.textContent = enabled
        ? `Login langsung aktif untuk ${result.username || 'akun ini'}. Vault akan dibuka otomatis pada perangkat ini.`
        : hasTwoFactor
          ? 'Nonaktif selama Authenticator aktif.'
          : supported
            ? 'Buka vault tanpa memasukkan password setiap kali.'
            : 'Fitur login langsung memerlukan penyimpanan aman Windows.';
    }
    if (!enabled) settingsDirectLoginPanel?.classList.add('hidden');
    updateSettingsLoginMethodSummary();
    return result;
  } catch (error) {
    settingsDirectLoginEnabled = null;
    directLoginButton?.classList.add('hidden');
    directLoginHelp?.classList.add('hidden');
    if (settingsDirectLoginStatus) settingsDirectLoginStatus.textContent = 'Tidak tersedia';
    if (settingsDirectLoginDetails) settingsDirectLoginDetails.textContent = error.message || 'Status login langsung tidak dapat dibaca.';
    settingsDirectLoginEnable?.classList.add('hidden');
    settingsDirectLoginDisable?.classList.add('hidden');
    updateSettingsLoginMethodSummary();
    return null;
  }
}

async function refreshHelloLoginState() {
  if (!helloLoginButton || mode !== 'login' || !window.passsa.helloStatus) return;
  try {
    const result = await window.passsa.helloStatus(usernameInput.value);
    helloLoginButton.classList.toggle('hidden', !result?.supported || !result.enabled);
  } catch {
    helloLoginButton.classList.add('hidden');
  }
}

async function refreshHelloSettingsState() {
  if (!settingsHelloStatus || !window.passsa.helloStatus) return;
  try {
    const result = await window.passsa.helloStatus(currentUser?.username || currentUser?.email);
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

const RENDERER_BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function generateRendererTotpSecret() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  let buffer = 0;
  let bits = 0;
  let secret = '';
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      secret += RENDERER_BASE32_ALPHABET[(buffer >> bits) & 31];
    }
  }
  if (bits > 0) secret += RENDERER_BASE32_ALPHABET[(buffer << (5 - bits)) & 31];
  return secret;
}

function parseTotpUri(value) {
  const source = String(value || '').trim();
  if (!source) throw new Error('Tempel URI otpauth terlebih dahulu.');
  let parsed;
  try {
    parsed = new URL(source);
  } catch {
    throw new Error('URI otpauth tidak valid.');
  }
  if (parsed.protocol !== 'otpauth:' || parsed.hostname.toLowerCase() !== 'totp') {
    throw new Error('URI harus menggunakan format otpauth://totp/.');
  }
  const label = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
  const separator = label.indexOf(':');
  const labelIssuer = separator >= 0 ? label.slice(0, separator) : '';
  const labelAccount = separator >= 0 ? label.slice(separator + 1) : label;
  const secret = parsed.searchParams.get('secret') || '';
  if (!secret) throw new Error('URI tidak memiliki secret Base32.');
  return {
    issuer: parsed.searchParams.get('issuer') || labelIssuer,
    account: parsed.searchParams.get('account') || labelAccount,
    secret,
    algorithm: String(parsed.searchParams.get('algorithm') || 'SHA1').toLowerCase(),
    digits: Number(parsed.searchParams.get('digits') || 6),
    period: Number(parsed.searchParams.get('period') || 30),
  };
}

function updateTotpPeriodOption(period) {
  if (!itemTotpPeriod) return;
  const value = String(period);
  if (![...itemTotpPeriod.options].some((option) => option.value === value)) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = `${value} detik`;
    itemTotpPeriod.append(option);
  }
  itemTotpPeriod.value = value;
}

function applyTotpUriToForm() {
  try {
    const parsed = parseTotpUri(itemTotpUri?.value);
    itemTotpIssuer.value = parsed.issuer || '';
    itemTotpAccount.value = parsed.account || '';
    itemTotpSecret.value = parsed.secret;
    itemTotpSecret.type = 'password';
    updateSecretToggle(toggleItemTotpSecret, false, 'kunci setup');
    itemTotpAlgorithm.value = parsed.algorithm;
    itemTotpDigits.value = String(parsed.digits);
    updateTotpPeriodOption(parsed.period);
    setInlineMessage(itemTotpMessage, 'URI berhasil digunakan. Periksa data lalu simpan item.', true);
    itemTotpSecret.focus();
  } catch (error) {
    setInlineMessage(itemTotpMessage, error.message || 'URI otpauth tidak dapat digunakan.');
  }
}

function resetTotpFormFields() {
  if (!itemTotpIssuer) return;
  itemTotpIssuer.value = '';
  itemTotpAccount.value = '';
  itemTotpSecret.value = '';
  itemTotpSecret.type = 'password';
  itemTotpUri.value = '';
  itemTotpAlgorithm.value = 'sha1';
  itemTotpDigits.value = '6';
  updateTotpPeriodOption(30);
  updateSecretToggle(toggleItemTotpSecret, false, 'kunci setup');
  setInlineMessage(itemTotpMessage, '');
}

async function copyTotpSecretFromForm() {
  const secret = String(itemTotpSecret?.value || '').trim();
  if (!secret) {
    setInlineMessage(itemTotpMessage, 'Isi atau generate kunci setup terlebih dahulu.');
    itemTotpSecret?.focus();
    return;
  }
  try {
    const result = await window.passsa.copySecret(secret);
    if (result?.ok === false) throw new Error(result.message || 'Kunci setup gagal disalin.');
    setInlineMessage(itemTotpMessage, 'Kunci setup disalin. Clipboard dibersihkan dalam 30 detik.', true);
  } catch (error) {
    setInlineMessage(itemTotpMessage, error.message || 'Kunci setup gagal disalin.');
  }
}

function renderSidebarSyncAction(user, s3Status) {
  if (!syncButton) return;
  const hasProvider = Boolean(user?.googleEmail || (s3Status?.available && s3Status.connected));
  syncButton.classList.toggle('hidden', !hasProvider);
  syncButton.closest('.sidebar-user')?.classList.toggle('sync-action-hidden', !hasProvider);
  if (!hasProvider) {
    syncButton.removeAttribute('title');
    syncButton.setAttribute('aria-label', 'Sinkronkan vault');
    return;
  }

  let label = 'Sinkronkan vault';
  const providers = [];
  if (user.googleEmail) providers.push('Google Drive');
  if (s3Status?.available && s3Status.connected) providers.push('S3');
  if (providers.length) label = `Sinkronkan ${providers.join(' dan ')}`;
  syncButton.title = label;
  syncButton.setAttribute('aria-label', label);
}

function renderTitlebarSyncStatus(user, s3Status) {
  if (!titlebarSyncStatus) return;
  renderSidebarSyncAction(user, s3Status);
  const googleEmail = String(user?.googleEmail || '').trim();
  const driveConnected = Boolean(googleEmail);
  const icon = titlebarSyncStatus.querySelector('i');
  const label = titlebarSyncStatus.querySelector('span');
  let text;
  let detail;
  let iconClass;

  if (!user) {
    text = 'Masuk untuk melihat sinkronisasi';
    detail = 'Masuk ke vault untuk melihat status Google Drive dan S3.';
    iconClass = 'fa-solid fa-cloud';
  } else if (!s3Status.available && !driveConnected) {
    text = 'Status sinkronisasi tidak tersedia';
    detail = 'Status Google Drive dan S3 belum dapat diperiksa.';
    iconClass = 'fa-solid fa-cloud';
  } else if (!driveConnected && !s3Status.connected) {
    text = 'Google Drive / S3 belum terhubung';
    detail = 'Belum ada penyedia sinkronisasi yang terhubung.';
    iconClass = 'fa-solid fa-cloud-slash';
  } else if (driveConnected && s3Status.connected) {
    text = 'Google Drive + S3 terhubung';
    detail = `Google Drive terhubung sebagai ${googleEmail}; S3 juga terhubung.`;
    iconClass = 'fa-solid fa-cloud';
  } else if (driveConnected) {
    text = 'Google Drive terhubung';
    detail = `Google Drive terhubung sebagai ${googleEmail}.`;
    iconClass = 'fa-brands fa-google';
  } else {
    text = 'S3 terhubung';
    detail = 'Sinkronisasi S3 terhubung.';
    iconClass = 'fa-solid fa-database';
  }

  const connected = driveConnected || (s3Status.available && s3Status.connected);
  titlebarSyncStatus.classList.toggle('connected', connected);
  titlebarSyncStatus.classList.toggle('disconnected', !connected);
  titlebarSyncStatus.title = detail;
  titlebarSyncStatus.setAttribute('aria-label', text);
  if (label) label.textContent = text;
  if (icon) icon.className = iconClass;
}

async function updateTitlebarSyncStatus(user = currentUser, s3StatusOverride) {
  const requestId = ++titlebarSyncStatusRequestId;
  if (!user) {
    renderTitlebarSyncStatus(null, { available: false, connected: false });
    return;
  }
  if (s3StatusOverride) {
    renderTitlebarSyncStatus(user, s3StatusOverride);
    return;
  }

  try {
    const result = await window.passsa.s3SyncInfo?.();
    if (requestId !== titlebarSyncStatusRequestId) return;
    if (!result?.ok) throw new Error(result?.message || 'Status S3 tidak tersedia.');
    renderTitlebarSyncStatus(user, { available: true, connected: Boolean(result.connected) });
  } catch {
    if (requestId !== titlebarSyncStatusRequestId) return;
    renderTitlebarSyncStatus(user, { available: false, connected: false });
  }
}

function userAvatarLabel(user) {
  const source = String(user?.displayName || user?.name || user?.username || user?.email || 'User')
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
  return (source.replace(/\s+/g, '').slice(0, 2) || 'U').toUpperCase();
}

function updateSidebarUser(user) {
  const avatar = document.querySelector('#user-avatar');
  const username = document.querySelector('#user-username');
  const plan = document.querySelector('.sidebar-user small');
  const displayUsername = user?.username || user?.email || 'username';
  if (username) username.textContent = displayUsername;
  if (avatar) {
    const initials = userAvatarLabel(user);
    avatar.textContent = initials;
    avatar.dataset.initials = String(initials.length);
    avatar.dataset.sidebarTooltip = `Akun: ${displayUsername}`;
    avatar.setAttribute('aria-label', `Akun ${displayUsername}`);
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
  sidebarCountsDirty = true;
  sidebarTreeDirty = true;
  tagTreeDirty = true;
  if (renderItemsFrame !== null) {
    cancelAnimationFrame(renderItemsFrame);
    renderItemsFrame = null;
  }
  if (virtualItemsFrame !== null) {
    cancelAnimationFrame(virtualItemsFrame);
    virtualItemsFrame = null;
  }
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
  twoFactorModal.classList.add('hidden');
  resetTwoFactorModalFields();
  settingsGooglePassword.value = '';
  setSettingsMessage('');
  vaultNotice.classList.add('hidden');
  closeAuthenticatorDetail();
  closeCredentialDetail();
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
  loadDirectLoginStatus();
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

async function refreshAuthenticatorCodes() {
  if (totpRefreshInFlight || vaultView.classList.contains('hidden')) return;
  const ids = visibleItems
    .filter((item) => item.type === 'authenticator' && !item.deletedAt)
    .map((item) => item.id);
  if (!ids.length || typeof window.passsa.listTotpCodes !== 'function') return;
  totpRefreshInFlight = true;
  try {
    const codes = await window.passsa.listTotpCodes(ids);
    for (const [id, data] of Object.entries(codes || {})) {
      const row = [...itemsList.querySelectorAll('.authenticator-item')]
        .find((candidate) => candidate.dataset.id === id);
      if (!row || !data?.code) continue;
      const code = String(data.code);
      const midpoint = Math.ceil(code.length / 2);
      const codeElement = row.querySelector('[data-totp-code]');
      const timerElement = row.querySelector('[data-totp-timer]');
      if (codeElement) {
        codeElement.textContent = `${code.slice(0, midpoint)} ${code.slice(midpoint)}`;
        codeElement.setAttribute('aria-label', `Kode 2FA ${code}`);
      }
      if (timerElement) timerElement.textContent = `${Math.max(0, Number(data.remaining) || 0)}s`;
    }
  } catch {
    // The vault can be locked while the list is visible. Keep the last safe UI
    // state and let the session-lock event take care of clearing the view.
  } finally {
    totpRefreshInFlight = false;
  }
}

function renderItems({ preserveScroll = true, virtualScroll = false } = {}) {
  if (renderItemsFrame !== null) {
    cancelAnimationFrame(renderItemsFrame);
    renderItemsFrame = null;
  }
  const scrollContainer = document.querySelector('.items-scroll');
  const scrollTop = preserveScroll ? (scrollContainer?.scrollTop ?? 0) : 0;
  const restoreScroll = () => {
    if (preserveScroll && scrollContainer) scrollContainer.scrollTop = scrollTop;
  };
  if (sidebarCountsDirty) {
    renderSidebarCounts();
    sidebarCountsDirty = false;
  }
  if (sidebarTreeDirty) {
    renderCustomCategories();
    sidebarTreeDirty = false;
  }
  filterSidebarNavigation();
  if (currentFilter === 'tags' && !currentTag) {
    renderTagsOverview();
    syncBulkToolbar();
    if (tagTreeDirty) {
      renderTagTree();
      tagTreeDirty = false;
    }
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
        && (currentFilter !== 'authenticator' || item.type === 'authenticator')
        && (currentFilter !== 'tags' || (item.tags ?? []).length > 0)
        && (!currentGroup || item.group === currentGroup)
        && (!currentGroupPrefix || item.group === currentGroupPrefix || item.group.startsWith(`${currentGroupPrefix}/`))
        && (!currentTag || (item.tags ?? []).some((tag) => tag.toLowerCase() === currentTag.toLowerCase()));
    const matchesSearch = !query || item._searchText.includes(query);
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
    emptyState.querySelector('h3').textContent = items.length
      ? 'Item tidak ditemukan'
      : currentFilter === 'authenticator' ? 'Belum ada authenticator' : 'Vault Anda masih kosong';
    emptyState.querySelector('p').textContent = items.length
      ? 'Coba gunakan kata pencarian yang berbeda.'
      : currentFilter === 'authenticator'
        ? 'Tambahkan item Authenticator untuk membuat kode 2FA secara lokal.'
        : 'Tambahkan login pertama Anda. Data akan dienkripsi dan disimpan hanya di komputer ini.';
  }
  const virtualized = filtered.length > VIRTUALIZE_ITEM_THRESHOLD;
  const viewportHeight = scrollContainer?.clientHeight || 640;
  const startIndex = virtualized
    ? Math.max(0, Math.floor(scrollTop / VIRTUAL_ITEM_HEIGHT) - VIRTUAL_ITEM_OVERSCAN)
    : 0;
  const visibleCount = virtualized
    ? Math.ceil(viewportHeight / VIRTUAL_ITEM_HEIGHT) + (VIRTUAL_ITEM_OVERSCAN * 2)
    : filtered.length;
  const endIndex = Math.min(filtered.length, startIndex + visibleCount);
  const renderedItems = filtered.slice(startIndex, endIndex);
  renderedVirtualRange = virtualized ? { start: startIndex, end: endIndex } : null;
  const beforeHeight = virtualized ? startIndex * VIRTUAL_ITEM_HEIGHT : 0;
  const afterHeight = virtualized ? Math.max(0, (filtered.length - endIndex) * VIRTUAL_ITEM_HEIGHT) : 0;
  itemsList.classList.toggle('is-virtualized', virtualized);
  itemsList.innerHTML = `${virtualized && beforeHeight ? '<div class="virtual-list-spacer" aria-hidden="true">&#8203;</div>' : ''}${renderedItems.map((item, offset) => renderVaultItem(item, startIndex + offset)).join('')}${virtualized && afterHeight ? '<div class="virtual-list-spacer" aria-hidden="true">&#8203;</div>' : ''}`;
  if (virtualized) {
    const spacerHeights = [beforeHeight, afterHeight].filter((height) => height > 0);
    itemsList.querySelectorAll('.virtual-list-spacer').forEach((spacer, index) => {
      const height = spacerHeights[index] ?? 0;
      spacer.style.height = `${height}px`;
      spacer.style.minHeight = `${height}px`;
    });
  }
  syncBulkToolbar();
  if (tagTreeDirty) {
    renderTagTree();
    tagTreeDirty = false;
  }
  filterSidebarNavigation();
  refreshAuthenticatorCodes();
  if (!virtualScroll) restoreScroll();
}

function renderVaultItem(item, index) {
  const isNote = item.type === 'secure-note';
  const isAuthenticator = item.type === 'authenticator';
  const isCredential = !isNote && !isAuthenticator;
  const rowLabel = isNote
    ? `Buka catatan ${item.title}`
    : isAuthenticator
      ? `Buka authenticator ${item.title}`
      : `Buka detail credential ${item.title}`;
  const typeIcon = isNote
    ? '<i class="fa-solid fa-note-sticky item-type-icon" aria-hidden="true"></i>'
    : isAuthenticator
      ? '<i class="fa-solid fa-shield-halved item-type-icon" aria-hidden="true"></i>'
      : '';
  const itemSubtitle = isNote
    ? 'Secure Note'
    : isAuthenticator
      ? `${item.totp?.issuer || 'Authenticator'} · ${item.group || 'Umum'}`
      : `${item.group || 'Umum'} · ${item.url || 'Login lokal'}`;
  const accountLabel = isNote
    ? 'Catatan aman'
    : isAuthenticator
      ? (item.totp?.account || 'Tanpa akun')
      : (item.username || 'Tanpa username');
  return `
    <article class="vault-item ${selectedIds.has(item.id) ? 'selected' : ''} ${isNote ? 'note-card' : ''} ${isAuthenticator ? 'authenticator-item' : ''} ${isCredential ? 'credential-card' : ''}" data-id="${escapeHtml(item.id)}" data-item-index="${Math.min(index, 10)}" tabindex="0" role="button" aria-label="${escapeHtml(rowLabel)}">
      <input class="item-select" type="checkbox" data-select-id="${escapeHtml(item.id)}" aria-label="Pilih ${escapeHtml(item.title)}" ${selectedIds.has(item.id) ? 'checked' : ''} />
      <div class="item-main"><strong>${item.favorite ? '★ ' : ''}${typeIcon}${typeIcon ? ' ' : ''}${escapeHtml(item.title)}</strong><small>${escapeHtml(itemSubtitle)}</small>${isAuthenticator ? `<small class="authenticator-account"><i class="fa-solid fa-user" aria-hidden="true"></i>${escapeHtml(accountLabel)}</small>` : ''}</div>
      <div class="item-tags-cell">${(item.tags ?? []).length ? `<div class="item-tags">${item.tags.slice(0, 2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}${item.tags.length > 2 ? `<button class="tag-overflow-toggle" type="button" data-tag-overflow="true" aria-expanded="false" aria-label="Lihat ${item.tags.length - 2} tags lainnya">+${item.tags.length - 2}</button><span class="tag-overflow-menu" role="listbox">${item.tags.slice(2).map((tag) => `<button class="tag-chip tone-${tagTone(tag)}" type="button" data-tag-filter="${escapeHtml(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</button>`).join('')}</span>` : ''}</div>` : '<span class="item-muted">—</span>'}</div>
      <div class="item-login">${isAuthenticator ? `<div class="totp-code-panel"><span class="totp-code-label">KODE 2FA</span><div class="totp-code-wrap"><span class="totp-code" data-totp-code aria-label="Kode 2FA ${escapeHtml(item.title)}">••• •••</span><small class="totp-timer" data-totp-timer>—</small></div><small class="item-usage">Dipakai ${item.usageCount ?? 0} kali</small></div>` : `<span>${escapeHtml(accountLabel)}</span><small class="item-usage">${isNote ? 'Terenkripsi di vault' : `Dipakai ${item.usageCount ?? 0} kali`}</small>`}</div>
      <div class="item-actions">
        ${item.deletedAt ? `
          <button class="item-action" data-action="restore" title="Pulihkan" aria-label="Pulihkan ${escapeHtml(item.title)}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></button>
          <button class="item-action danger" data-action="purge" title="Hapus permanen" aria-label="Hapus permanen ${escapeHtml(item.title)}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        ` : `
          <button class="item-action" data-action="favorite" title="Favorit" aria-label="${item.favorite ? 'Hapus dari' : 'Tambahkan ke'} favorit: ${escapeHtml(item.title)}"><i class="fa-${item.favorite ? 'solid' : 'regular'} fa-star" aria-hidden="true"></i></button>
          ${isNote ? '' : isAuthenticator ? `
          <button class="item-action" data-action="copy-totp" title="Salin kode 2FA" aria-label="Salin kode 2FA ${escapeHtml(item.title)}"><i class="fa-solid fa-copy" aria-hidden="true"></i></button>` : `
          <button class="item-action" data-action="copy-user" title="Salin username" aria-label="Salin username ${escapeHtml(item.title)}"><i class="fa-solid fa-user" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-password" title="Salin password" aria-label="Salin password ${escapeHtml(item.title)}"><i class="fa-solid fa-key" aria-hidden="true"></i></button>
          <button class="item-action" data-action="copy-url" title="Salin alamat situs" aria-label="Salin alamat situs ${escapeHtml(item.title)}"><i class="fa-solid fa-link" aria-hidden="true"></i></button>`}
          <button class="item-action" data-action="edit" title="Edit" aria-label="Edit ${escapeHtml(item.title)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>
          <button class="item-action danger" data-action="delete" title="Pindah ke Sampah" aria-label="Pindahkan ${escapeHtml(item.title)} ke Sampah"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        `}
      </div>
      <div class="item-description ${isAuthenticator ? 'authenticator-description' : ''}">
        <span>${escapeHtml(item.notes || (isAuthenticator ? 'Kode 2FA tersimpan terenkripsi' : 'Tidak ada deskripsi'))}</span>
      </div>
    </article>
  `;
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
  const counts = {
    all: 0,
    favorites: 0,
    trash: 0,
    notes: 0,
    authenticator: 0,
    tags: new Set(),
  };
  for (const item of items) {
    if (item.deletedAt) {
      counts.trash += 1;
      continue;
    }
    counts.all += 1;
    if (item.favorite) counts.favorites += 1;
    if (item.type === 'secure-note') counts.notes += 1;
    if (item.type === 'authenticator') counts.authenticator += 1;
    for (const tag of item.tags ?? []) counts.tags.add(tag);
  }
  const setCount = (id, value) => {
    const element = document.querySelector(`#${id}`);
    if (!element) return;
    element.textContent = value > 0 ? String(value) : '';
    element.dataset.zero = String(value <= 0);
  };
  setCount('sidebar-all-count', counts.all);
  setCount('sidebar-favorites-count', counts.favorites);
  setCount('sidebar-trash-count', counts.trash);
  setCount('sidebar-notes-count', counts.notes);
  setCount('sidebar-authenticator-count', counts.authenticator);
  setCount('sidebar-tags-count', counts.tags.size);
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

function noteHistoryPreview(value, maxLength = 280) {
  const source = String(value || 'Tidak ada isi catatan.').replace(/\r\n?/g, '\n').trim();
  if (source.length <= maxLength) return source;
  return `${source.slice(0, maxLength).trimEnd()}…`;
}

function renderNoteHistoryEntry(entry, version, {
  includeTitle = false,
  renderMarkdown = false,
  source = '',
  historyIndex = -1,
} = {}) {
  const notes = renderMarkdown
    ? renderNoteMarkdown(entry.notes || 'Tidak ada isi catatan.')
    : `<p>${escapeHtml(noteHistoryPreview(entry.notes))}</p>`;
  const tags = Array.isArray(entry.tags) ? entry.tags : [];
  const sourceAttributes = source && historyIndex >= 0
    ? ` data-note-history-source="${escapeHtml(source)}" data-note-history-index="${historyIndex}"`
    : '';
  return `
    <div class="note-history-entry" data-note-history-expand${sourceAttributes} tabindex="0" role="button" aria-expanded="false" aria-label="Buka Versi ${version}">
      <div class="note-history-entry-meta">
        <strong>Versi ${version}</strong>
        <small>${escapeHtml(formatHistoryDate(entry.savedAt))}</small>
        <span class="note-history-expand-hint">
          <span class="note-history-expand-collapsed">Klik untuk melihat penuh</span>
          <span class="note-history-expand-expanded">Klik untuk meringkas</span>
          <i class="fa-solid fa-chevron-down note-history-expand-icon" aria-hidden="true"></i>
        </span>
      </div>
      <div class="note-history-entry-content">
        ${includeTitle ? `<strong>${escapeHtml(entry.title || 'Catatan')}</strong>` : ''}
        <div class="note-history-markdown">${notes}</div>
        ${tags.length ? `<div class="item-tags">${tags.map((tag) => `<span class="tag-chip tone-${tagTone(tag)}"><span class="tag-dot" aria-hidden="true"></span>#${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </div>
    </div>
  `;
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
  noteDetailHistoryEntries = history;
  noteDetailHistoryCount.textContent = history.length ? `(${history.length} versi)` : '';
  noteDetailHistoryList.classList.toggle('is-scrollable', history.length > 3);
  noteDetailHistoryList.innerHTML = history.length
    ? history.map((entry, index) => renderNoteHistoryEntry(entry, history.length - index, {
      includeTitle: true,
      source: 'detail',
      historyIndex: index,
    })).join('')
    : '<p class="note-history-empty">Belum ada perubahan pada catatan ini.</p>';
}

async function openNoteDetail(id) {
  try {
    const item = await window.passsa.getItem(id);
    if (!item || item.type !== 'secure-note') return;
    rememberModalFocus(noteDetailModal);
    noteDetailCurrentId = id;
    renderNoteDetail(item);
    noteDetailModal.classList.remove('hidden');
    requestAnimationFrame(() => closeNoteDetailButton.focus());
  } catch (error) {
    showVaultNotice(error.message || 'Detail catatan tidak dapat dibuka.', true);
  }
}

function closeNoteDetail() {
  noteDetailCurrentId = null;
  noteDetailHistoryEntries = [];
  noteDetailModal.classList.add('hidden');
  restoreModalFocus(noteDetailModal);
}

function formatAuthenticatorCode(code) {
  const value = String(code ?? '').replace(/\s+/g, '');
  if (!value) return '••• •••';
  const midpoint = Math.ceil(value.length / 2);
  return `${value.slice(0, midpoint)} ${value.slice(midpoint)}`;
}

function renderAuthenticatorDetail(item) {
  if (!item) return;
  const totp = item.totp || {};
  const issuer = String(totp.issuer || 'Authenticator');
  const account = String(totp.account || item.username || 'Tanpa akun');
  const group = String(item.group || 'Umum');
  const digits = Number(totp.digits) || 6;
  const period = Number(totp.period) || 30;
  const algorithm = String(totp.algorithm || 'sha1').toUpperCase().replace(/^SHA(\d+)$/, 'SHA-$1');

  authenticatorDetailTitle.textContent = item.title || 'Authenticator';
  authenticatorDetailSubtitle.textContent = `${issuer} · ${account}`;
  authenticatorDetailIssuer.textContent = issuer;
  authenticatorDetailAccount.textContent = account;
  authenticatorDetailGroup.textContent = group;
  authenticatorDetailConfig.textContent = `${digits} digit · ${algorithm} · ${period} detik`;
  authenticatorDetailUsage.textContent = `Dipakai ${item.usageCount ?? 0} kali`;
  authenticatorDetailNotes.textContent = item.notes || '';
  authenticatorDetailNotes.classList.toggle('hidden', !item.notes);
  authenticatorDetailCode.textContent = '••• •••';
  authenticatorDetailCode.setAttribute('aria-label', `Kode 2FA ${item.title || 'Authenticator'} sedang dimuat`);
  authenticatorDetailTimer.textContent = '—';
}

async function refreshAuthenticatorDetail() {
  const id = authenticatorDetailCurrentId;
  if (!id || authenticatorDetailModal.classList.contains('hidden') || authenticatorDetailRefreshInFlight) return;
  if (typeof window.passsa.listTotpCodes !== 'function') return;
  authenticatorDetailRefreshInFlight = true;
  try {
    const data = (await window.passsa.listTotpCodes([id]))?.[id];
    if (id !== authenticatorDetailCurrentId) return;
    if (!data?.code) {
      authenticatorDetailCode.textContent = '••• •••';
      authenticatorDetailCode.setAttribute('aria-label', 'Kode 2FA tidak tersedia');
      authenticatorDetailTimer.textContent = '—';
      return;
    }
    const code = String(data.code);
    authenticatorDetailCode.textContent = formatAuthenticatorCode(code);
    authenticatorDetailCode.setAttribute('aria-label', `Kode 2FA ${code}`);
    authenticatorDetailTimer.textContent = `${Math.max(0, Number(data.remaining) || 0)}s`;
  } catch {
    // A locked session clears the vault view. Keep this modal quiet if the
    // session changes between two refresh ticks.
  } finally {
    if (id === authenticatorDetailCurrentId) authenticatorDetailRefreshInFlight = false;
  }
}

function resetAuthenticatorDetailCopyButton() {
  if (!authenticatorDetailCopyButton) return;
  authenticatorDetailCopyButton.disabled = false;
  authenticatorDetailCopyButton.removeAttribute('aria-busy');
  authenticatorDetailCopyButton.classList.remove('copy-success');
  authenticatorDetailCopyButton.innerHTML = '<i class="fa-solid fa-copy" aria-hidden="true"></i> Salin kode';
}

async function copyAuthenticatorDetailCode() {
  const id = authenticatorDetailCurrentId;
  if (!id || !authenticatorDetailCopyButton) return;
  const requestId = ++authenticatorDetailCopyRequestId;
  authenticatorDetailCopyButton.disabled = true;
  authenticatorDetailCopyButton.setAttribute('aria-busy', 'true');
  authenticatorDetailCopyButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Menyalin…';
  try {
    const usage = await window.passsa.copyTotpCode(id);
    const item = items.find((candidate) => candidate.id === id);
    if (item) {
      item.usageCount = usage.usageCount;
      item.lastUsedAt = usage.lastUsedAt;
    }
    const row = [...itemsList.querySelectorAll('.authenticator-item')]
      .find((candidate) => candidate.dataset.id === id);
    const rowCopyButton = row?.querySelector('[data-action="copy-totp"]');
    if (row && rowCopyButton) updateCopiedRow(row, rowCopyButton, usage, 'Kode 2FA');
    if (id === authenticatorDetailCurrentId && Number.isFinite(Number(usage?.usageCount))) {
      authenticatorDetailUsage.textContent = `Dipakai ${usage.usageCount} kali`;
    }
    if (id !== authenticatorDetailCurrentId || requestId !== authenticatorDetailCopyRequestId) return;
    authenticatorDetailCopyButton.classList.add('copy-success');
    authenticatorDetailCopyButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Tersalin';
    showVaultNotice('Kode 2FA disalin. Clipboard dibersihkan dalam 30 detik.');
    window.clearTimeout(authenticatorDetailCopyFeedbackTimer);
    authenticatorDetailCopyFeedbackTimer = window.setTimeout(resetAuthenticatorDetailCopyButton, 1200);
  } catch (error) {
    if (id === authenticatorDetailCurrentId && requestId === authenticatorDetailCopyRequestId) {
      resetAuthenticatorDetailCopyButton();
      showVaultNotice(error.message || 'Kode 2FA tidak dapat disalin.', true);
    }
  } finally {
    if (requestId !== authenticatorDetailCopyRequestId) return;
    if (!authenticatorDetailCopyButton.classList.contains('copy-success')) {
      authenticatorDetailCopyButton.disabled = false;
      authenticatorDetailCopyButton.removeAttribute('aria-busy');
    }
  }
}

function openAuthenticatorDetail(item) {
  if (!item || item.type !== 'authenticator' || item.deletedAt) return;
  rememberModalFocus(authenticatorDetailModal);
  authenticatorDetailCurrentId = item.id;
  renderAuthenticatorDetail(item);
  authenticatorDetailModal.classList.remove('hidden');
  window.clearInterval(authenticatorDetailRefreshTimer);
  refreshAuthenticatorDetail();
  authenticatorDetailRefreshTimer = window.setInterval(refreshAuthenticatorDetail, 1000);
  requestAnimationFrame(() => authenticatorDetailCopyButton.focus());
}

function closeAuthenticatorDetail() {
  authenticatorDetailCurrentId = null;
  authenticatorDetailCopyRequestId += 1;
  window.clearInterval(authenticatorDetailRefreshTimer);
  authenticatorDetailRefreshTimer = null;
  window.clearTimeout(authenticatorDetailCopyFeedbackTimer);
  resetAuthenticatorDetailCopyButton();
  authenticatorDetailModal.classList.add('hidden');
  restoreModalFocus(authenticatorDetailModal);
}

function resetCredentialDetailCopyButtons() {
  const buttons = [
    [credentialDetailCopyUrlButton, 'Salin alamat situs'],
    [credentialDetailCopyUsernameButton, 'Salin username'],
    [credentialDetailCopyPasswordButton, 'Salin password'],
  ];
  for (const [button, label] of buttons) {
    if (!button) continue;
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.classList.remove('copy-success');
    button.innerHTML = '<i class="fa-solid fa-copy" aria-hidden="true"></i>';
    button.setAttribute('aria-label', label);
    button.title = label;
  }
}

function renderCredentialDetail(item) {
  if (!item) return;
  const url = String(item.url ?? '').trim();
  const username = String(item.username ?? '').trim();
  const password = String(item.password ?? '');
  const group = String(item.group || 'Umum');

  credentialDetailTitle.textContent = item.title || 'Credential';
  credentialDetailSubtitle.textContent = `${group} · ${url || 'Login lokal'}`;
  credentialDetailUrl.textContent = url || 'Tidak ada alamat situs';
  credentialDetailUsername.textContent = username || 'Tidak ada username';
  credentialDetailPassword.value = password;
  credentialDetailPassword.type = 'password';
  updateSecretToggle(toggleCredentialDetailPasswordButton, false);
  toggleCredentialDetailPasswordButton.disabled = !password;
  credentialDetailGroup.textContent = group;
  credentialDetailUsage.textContent = `Dipakai ${item.usageCount ?? 0} kali`;
  credentialDetailNotes.textContent = item.notes || '';
  credentialDetailNotes.classList.toggle('hidden', !item.notes);
  credentialDetailCopyUrlButton.disabled = !url;
  credentialDetailCopyUsernameButton.disabled = !username;
  credentialDetailCopyPasswordButton.disabled = !password;
  resetCredentialDetailCopyButtons();
  credentialDetailCopyUrlButton.disabled = !url;
  credentialDetailCopyUsernameButton.disabled = !username;
  credentialDetailCopyPasswordButton.disabled = !password;
}

async function openCredentialDetail(id) {
  const requestId = ++credentialDetailOpenRequestId;
  try {
    const item = await window.passsa.getItem(id);
    if (requestId !== credentialDetailOpenRequestId) return;
    if (!item || item.type !== 'login' || item.deletedAt) return;
    rememberModalFocus(credentialDetailModal);
    credentialDetailCurrentItem = item;
    renderCredentialDetail(item);
    credentialDetailModal.classList.remove('hidden');
    requestAnimationFrame(() => closeCredentialDetailButton.focus());
  } catch (error) {
    if (requestId === credentialDetailOpenRequestId) {
      showVaultNotice(error.message || 'Detail credential tidak dapat dibuka.', true);
    }
  }
}

function closeCredentialDetail() {
  credentialDetailOpenRequestId += 1;
  credentialDetailCopyRequestId += 1;
  credentialDetailCurrentItem = null;
  window.clearTimeout(credentialDetailCopyFeedbackTimer);
  credentialDetailCopyFeedbackTimer = null;
  resetCredentialDetailCopyButtons();
  credentialDetailPassword.value = '';
  credentialDetailPassword.type = 'password';
  updateSecretToggle(toggleCredentialDetailPasswordButton, false);
  toggleCredentialDetailPasswordButton.disabled = false;
  credentialDetailModal.classList.add('hidden');
  restoreModalFocus(credentialDetailModal);
}

function toggleCredentialDetailPassword() {
  if (!credentialDetailCurrentItem || !credentialDetailPassword.value) return;
  const visible = credentialDetailPassword.type === 'text';
  credentialDetailPassword.type = visible ? 'password' : 'text';
  updateSecretToggle(toggleCredentialDetailPasswordButton, !visible);
}

async function copyCredentialDetailField(field) {
  const item = credentialDetailCurrentItem;
  const button = field === 'url'
    ? credentialDetailCopyUrlButton
    : field === 'username' ? credentialDetailCopyUsernameButton : credentialDetailCopyPasswordButton;
  const value = String(item?.[field] ?? '');
  if (!item || !button || !value.trim()) return;

  const requestId = ++credentialDetailCopyRequestId;
  const label = field === 'url' ? 'Link' : field === 'username' ? 'Username' : 'Password';
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>';
  try {
    const usage = await window.passsa.copyEntrySecret(item.id, field);
    const listItem = items.find((candidate) => candidate.id === item.id);
    if (listItem) {
      listItem.usageCount = usage.usageCount;
      listItem.lastUsedAt = usage.lastUsedAt;
    }
    const row = [...itemsList.querySelectorAll('.credential-card')]
      .find((candidate) => candidate.dataset.id === item.id);
    const rowCopyButton = row?.querySelector(`[data-action="copy-${field}"]`);
    if (row && rowCopyButton) updateCopiedRow(row, rowCopyButton, usage, label);
    if (item.id !== credentialDetailCurrentItem?.id || requestId !== credentialDetailCopyRequestId) return;

    item.usageCount = usage.usageCount;
    item.lastUsedAt = usage.lastUsedAt;
    credentialDetailUsage.textContent = `Dipakai ${usage.usageCount} kali`;
    button.classList.add('copy-success');
    button.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
    button.setAttribute('aria-label', `${label} berhasil disalin`);
    button.title = `${label} berhasil disalin`;
    showVaultNotice(`${label} disalin. Clipboard dibersihkan dalam 30 detik.`);
    window.clearTimeout(credentialDetailCopyFeedbackTimer);
    credentialDetailCopyFeedbackTimer = window.setTimeout(resetCredentialDetailCopyButtons, 1200);
  } catch (error) {
    if (item.id === credentialDetailCurrentItem?.id && requestId === credentialDetailCopyRequestId) {
      resetCredentialDetailCopyButtons();
      showVaultNotice(error.message || `${label} tidak dapat disalin.`, true);
    }
  } finally {
    if (requestId !== credentialDetailCopyRequestId) return;
    if (!button.classList.contains('copy-success')) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }
}

function updateHistoryHeader(note = false) {
  passwordHistoryTitle.innerHTML = `<i class="fa-solid fa-clock-rotate-left" aria-hidden="true"></i> ${note ? 'Note History' : 'Password History'}`;
  passwordHistoryNote.textContent = note ? 'Versi catatan tersimpan terenkripsi' : 'Versi lama tersimpan terenkripsi';
}

function renderPasswordHistory(history, showSection = true) {
  const entries = Array.isArray(history)
    ? history.filter((entry) => typeof entry?.password === 'string').slice().reverse()
    : [];
  formNoteHistoryEntries = [];
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
  formNoteHistoryEntries = entries;
  updateHistoryHeader(true);
  passwordHistory.classList.toggle('hidden', !showSection);
  passwordHistoryCount.textContent = entries.length ? `(${entries.length} versi)` : '';
  passwordHistoryList.classList.toggle('is-scrollable', entries.length > 3);
  passwordHistoryList.innerHTML = entries.length ? entries.map((entry, index) => `
    ${renderNoteHistoryEntry(entry, entries.length - index, { includeTitle: true, source: 'form', historyIndex: index })}
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
    // Checklist syntax is intentionally displayed as plain text. Secure
    // Notes no longer expose an interactive checklist editor.
    const plainChecklist = trimmed.match(/^[-*+]\s+\[[ xX]\]\s+(.+)$/);
    if (plainChecklist) {
      closeList();
      paragraph.push(line);
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

let noteEditorModeValue = 'preview';

function updateNoteEditorStatus(value = itemNotesInput?.value ?? '') {
  if (!noteEditorStatus) return;
  const length = String(value).length;
  const limit = Number(itemNotesInput?.maxLength) || 20000;
  noteEditorStatus.textContent = `${length.toLocaleString('id-ID')} / ${limit.toLocaleString('id-ID')} karakter`;
}

function updateNoteEditorSaveState(state = 'ready') {
  if (!noteEditorSaveState) return;
  const labels = {
    ready: 'Siap disimpan',
    dirty: 'Perubahan belum disimpan',
    saving: 'Menyimpan…',
  };
  noteEditorSaveState.textContent = labels[state] || labels.ready;
  noteEditorSaveState.dataset.state = state;
}

function resizeNoteInput() {
  if (!itemNotesInput || itemNotesInput.classList.contains('hidden')) return;
  const minHeight = itemTypeInput?.value === 'secure-note' ? 220 : 70;
  const maxHeight = itemTypeInput?.value === 'secure-note' ? 360 : 220;
  itemNotesInput.style.height = 'auto';
  const nextHeight = Math.min(Math.max(itemNotesInput.scrollHeight, minHeight), maxHeight);
  itemNotesInput.style.height = `${nextHeight}px`;
  itemNotesInput.style.overflowY = itemNotesInput.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function serializeNoteInlineNode(node) {
  if (!node) return '';
  if (node.nodeType === 3) return node.nodeValue.replace(/\u00a0/g, ' ');
  if (node.nodeType !== 1) return '';
  const tag = node.tagName.toLowerCase();
  if (tag === 'br') return '\n';
  if (tag === 'button' && node.classList.contains('note-preview-check-toggle')) return '';
  const content = Array.from(node.childNodes).map(serializeNoteInlineNode).join('');
  if (tag === 'strong' || tag === 'b') return `**${content}**`;
  if (tag === 'em' || tag === 'i') return `*${content}*`;
  if (tag === 'u') return `++${content}++`;
  if (tag === 'del' || tag === 's' || tag === 'strike') return `~~${content}~~`;
  if (tag === 'mark') return `==${content}==`;
  if (tag === 'code' && node.parentElement?.tagName.toLowerCase() !== 'pre') return `\`${content}\``;
  if (tag === 'a') {
    const href = node.getAttribute('href') || '';
    return /^(https?:\/\/|mailto:)/i.test(href) ? `[${content}](${href})` : content;
  }
  if (tag === 'div') return Array.from(node.childNodes).map(serializeNoteInlineNode).join('\n');
  return content;
}

function serializeNoteTable(table) {
  if (!table) return '';
  const rows = Array.from(table.querySelectorAll('tr')).map((row) => Array.from(row.querySelectorAll('th, td'))
    .map((cell) => serializeNoteInlineNode(cell).replace(/\|/g, '\\|').trim()));
  const headers = rows[0] || [];
  if (headers.length < 2) return '';
  const separator = headers.map(() => '---');
  return [
    `| ${headers.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    ...rows.slice(1).map((row) => `| ${headers.map((_header, index) => row[index] || '').join(' | ')} |`),
  ].join('\n');
}

function serializeNoteBlock(node) {
  if (!node || node.nodeType !== 1) return node?.textContent?.trim() || '';
  const tag = node.tagName.toLowerCase();
  if (node.classList.contains('note-preview-empty') && node.textContent.trim() === 'Belum ada isi catatan.') return '';
  if (node.classList.contains('note-preview-table-wrap')) return serializeNoteTable(node.querySelector('table'));
  if (tag === 'pre') return '```\n' + serializeNoteInlineNode(node).replace(/\n+$/g, '') + '\n```';
  if (tag === 'hr') return '---';
  if (/^h[1-3]$/.test(tag)) return `${'#'.repeat(Number(tag[1]))} ${serializeNoteInlineNode(node).trim()}`;
  if (tag === 'blockquote') {
    const content = serializeNoteInlineNode(node).trim();
    return content.split('\n').map((line) => line ? `> ${line}` : '>').join('\n');
  }
  if (tag === 'ul' || tag === 'ol') {
    const ordered = tag === 'ol';
    return Array.from(node.children).filter((child) => child.tagName?.toLowerCase() === 'li').map((li, index) => {
      const toggle = Array.from(li.children).find((child) => child.classList?.contains('note-preview-check-toggle'));
      const contentNode = Array.from(li.children).find((child) => child !== toggle) || li;
      const content = serializeNoteInlineNode(contentNode).trim();
      if (!content) return '';
      if (toggle || li.classList.contains('note-preview-check')) return `- [${toggle?.textContent.trim() ? 'x' : ' '}] ${content}`;
      return `${ordered ? `${index + 1}.` : '-'} ${content}`;
    }).filter(Boolean).join('\n');
  }
  const blockChildren = Array.from(node.children).filter((child) => /^(p|h[1-3]|ul|ol|blockquote|pre|hr)$/.test(child.tagName?.toLowerCase() || '') || child.classList?.contains('note-preview-table-wrap'));
  if (blockChildren.length) {
    const blockSet = new Set(blockChildren);
    const inline = Array.from(node.childNodes)
      .filter((child) => !blockSet.has(child))
      .map(serializeNoteInlineNode)
      .join('')
      .trim();
    return [inline, ...blockChildren.map(serializeNoteBlock).filter(Boolean)].filter(Boolean).join('\n\n');
  }
  return serializeNoteInlineNode(node).trim();
}

function serializeNotePreview() {
  if (!notePreview) return '';
  return Array.from(notePreview.childNodes)
    .map(serializeNoteBlock)
    .filter(Boolean)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function syncNoteInputFromPreview() {
  if (!notePreview || !itemNotesInput) return;
  const limit = Number(itemNotesInput.maxLength) || 20000;
  itemNotesInput.value = serializeNotePreview().slice(0, limit);
  updateNoteEditorStatus();
}

function insertNotePreviewListBreak() {
  if (!notePreview) return;
  notePreviewSuppressInput = true;
  try {
    document.execCommand('insertParagraph');
  } finally {
    notePreviewSuppressInput = false;
  }
  notePreview.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertParagraph' }));
}

function updateNotePreview() {
  if (!notePreview || !itemNotesInput) return;
  notePreview.innerHTML = renderNoteMarkdown(itemNotesInput.value);
  notePreviewSelectionRange = null;
  updateNoteEditorStatus();
}

function clearNotePreviewPlaceholder() {
  if (!notePreview || noteEditorModeValue !== 'preview') return;
  const placeholder = notePreview.querySelector('.note-preview-empty');
  if (!placeholder) return;
  const placeholderText = 'Belum ada isi catatan.';
  const text = placeholder.textContent || '';
  if (!text.includes(placeholderText)) return;
  placeholder.classList.remove('note-preview-empty');
  placeholder.textContent = text.replace(placeholderText, '');
}

function setNoteEditorMode(nextMode = 'preview', options = {}) {
  noteEditorModeValue = nextMode === 'preview' ? 'preview' : 'write';
  const preview = noteEditorModeValue === 'preview';
  if (!preview && options.sync !== false && notePreview?.isContentEditable) syncNoteInputFromPreview();
  itemNotesInput?.classList.toggle('hidden', preview);
  notePreview?.classList.toggle('hidden', !preview);
  if (notePreview) {
    if (preview) {
      notePreview.setAttribute('contenteditable', 'true');
      notePreview.setAttribute('role', 'textbox');
      notePreview.setAttribute('aria-multiline', 'true');
      notePreview.setAttribute('aria-label', 'Review Secure Note, klik teks untuk mengedit');
      notePreview.classList.add('is-editable');
    } else {
      notePreview.removeAttribute('contenteditable');
      notePreview.removeAttribute('aria-multiline');
      notePreview.setAttribute('role', 'region');
      notePreview.setAttribute('aria-label', 'Review Secure Note');
      notePreview.classList.remove('is-editable');
    }
  }
  noteEditorMode?.querySelectorAll('[data-note-mode]').forEach((button) => {
    const active = button.dataset.noteMode === noteEditorModeValue;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (preview) updateNotePreview();
  resizeNoteInput();
}

function replaceNoteSelection(replacement, selectionStart, selectionEnd) {
  if (!itemNotesInput) return;
  itemNotesInput.focus();
  itemNotesInput.setRangeText(replacement, selectionStart, selectionEnd, 'select');
  itemNotesInput.dispatchEvent(new Event('input', { bubbles: true }));
}

let notePreviewSelectionRange = null;
let notePreviewSuppressInput = false;

function rememberNotePreviewSelection() {
  if (!notePreview || !window.getSelection) return;
  const selection = window.getSelection();
  if (!selection?.rangeCount || !notePreview.contains(selection.anchorNode) || !notePreview.contains(selection.focusNode)) return;
  notePreviewSelectionRange = selection.getRangeAt(0).cloneRange();
}

function getNotePreviewSelection() {
  if (!notePreview || !notePreviewSelectionRange) return null;
  const range = notePreviewSelectionRange;
  if (!notePreview.contains(range.startContainer) || !notePreview.contains(range.endContainer)) {
    notePreviewSelectionRange = null;
    return null;
  }
  return range.cloneRange();
}

function reviewSelectionWithBlockFallback() {
  const range = getNotePreviewSelection();
  if (!range) return null;
  if (range.toString().trim()) return range;
  const container = range.startContainer.nodeType === 1
    ? range.startContainer
    : range.startContainer.parentElement;
  const block = container?.closest('p, li, h1, h2, h3, blockquote, pre');
  if (!block || !notePreview.contains(block)) return range;
  const blockRange = document.createRange();
  blockRange.selectNodeContents(block);
  return blockRange;
}

function replaceReviewSelection(replacement, range) {
  if (!notePreview || !range) return false;
  notePreview.focus();
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  range.deleteContents();
  const textNode = document.createTextNode(replacement);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  notePreview.dispatchEvent(new Event('input', { bubbles: true }));
  updateNotePreview();
  return true;
}

function getReviewSelectedText(range) {
  if (!range) return '';
  const container = document.createElement('div');
  container.appendChild(range.cloneContents());
  const blockTags = new Set(['address', 'blockquote', 'div', 'h1', 'h2', 'h3', 'li', 'ol', 'p', 'pre', 'ul']);
  const readNode = (node) => {
    if (node.nodeType === 3) return node.nodeValue || '';
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    if (tag === 'br') return '\n';
    const content = Array.from(node.childNodes).map(readNode).join('');
    return blockTags.has(tag) ? `${content}\n` : content;
  };
  const selected = readNode(container).replace(/\r\n?/g, '\n');
  return selected.replace(/\n{3,}/g, '\n\n').replace(/^\n+|\n+$/g, '');
}

function applyReviewNoteFormat(format) {
  const range = reviewSelectionWithBlockFallback();
  if (!range) return false;
  const selected = range.toString();
  notePreview.focus();
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  if (format === 'undo' || format === 'redo') {
    document.execCommand(format);
    syncNoteInputFromPreview();
    return true;
  }
  const commandMap = {
    bold: ['bold'],
    italic: ['italic'],
    underline: ['underline'],
    strike: ['strikeThrough'],
    bullet: ['insertUnorderedList'],
    number: ['insertOrderedList'],
    quote: ['formatBlock', 'blockquote'],
    'heading-1': ['formatBlock', 'h1'],
    'heading-2': ['formatBlock', 'h2'],
    'heading-3': ['formatBlock', 'h3'],
    paragraph: ['formatBlock', 'p'],
    'code-block': ['formatBlock', 'pre'],
    clear: ['removeFormat'],
  };
  if (commandMap[format]) {
    const [command, value] = commandMap[format];
    document.execCommand(command, false, value);
    syncNoteInputFromPreview();
    return true;
  }
  if (format === 'code') return replaceReviewSelection(`\`${selected || 'kode'}\``, range);
  if (format === 'link') return replaceReviewSelection(`[${selected || 'teks tautan'}](https://contoh.com)`, range);
  if (format === 'table') return replaceReviewSelection('| Kolom 1 | Kolom 2 |\n| --- | --- |\n| Isi | Isi |', range);
  if (format === 'callout') return replaceReviewSelection(`> **Catatan:** ${selected || 'Tulis catatan penting di sini.'}`, range);
  if (format === 'date') {
    const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date());
    return replaceReviewSelection(date, range);
  }
  if (format === 'rule') return replaceReviewSelection('---', range);
  return false;
}

function applyNoteFormat(format) {
  if (!itemNotesInput) return;
  if (noteEditorModeValue === 'preview' && notePreview?.isContentEditable && applyReviewNoteFormat(format)) return;
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
  const authenticator = itemTypeInput?.value === 'authenticator';
  itemLoginFields.forEach((field) => field.classList.toggle('hidden', secureNote || authenticator));
  const password = document.querySelector('#item-password');
  password.required = !secureNote && !authenticator;
  document.querySelector('#generate-password').classList.toggle('hidden', secureNote || authenticator);
  authenticatorFields?.classList.toggle('hidden', !authenticator);
  itemTotpAccount.required = authenticator;
  itemTotpSecret.required = authenticator;
  itemNotesLabel.textContent = secureNote ? 'Isi Catatan' : authenticator ? 'Catatan (opsional)' : 'Deskripsi';
  itemNotesInput.placeholder = secureNote
    ? 'Tulis catatan rahasia Anda…'
    : authenticator ? 'Catatan tambahan (opsional)' : 'Keterangan singkat item (opsional)';
  itemNotesInput.setAttribute('aria-describedby', authenticator ? 'note-editor-status' : 'note-editor-help note-editor-status');
  noteEditor?.classList.toggle('secure-note-editor', secureNote);
  noteEditor?.classList.toggle('keep-note-editor', secureNote);
  // Secure Notes use a focused, plain-text Keep-style surface. The legacy
  // Markdown renderer remains available for reading existing notes, but the
  // form editor no longer intercepts typing with a contenteditable preview.
  noteEditorToolbar.classList.add('hidden');
  noteEditorMode.classList.add('hidden');
  document.querySelector('#note-editor-help').classList.toggle('hidden', !secureNote);
  noteEditorStatus?.classList.toggle('hidden', !secureNote);
  noteEditorSaveState?.classList.toggle('hidden', !secureNote);
  document.querySelector('#custom-fields-section')?.classList.toggle('hidden', authenticator);
  passwordHistory.classList.toggle('hidden', authenticator);
  setNoteEditorMode('write');
  updateNoteEditorSaveState('ready');
  resizeNoteInput();
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
      : item.type === 'authenticator'
        ? `${item.totp?.issuer || 'Authenticator'} · ${item.totp?.account || 'Tanpa akun'}`
      : `${item.username || 'Tanpa username'}${item.url ? ` · ${item.url}` : ''}`;
    const icon = item.type === 'secure-note' ? 'fa-note-sticky' : item.type === 'authenticator' ? 'fa-shield-halved' : 'fa-key';
    return `<div class="confirm-modal-item" style="--confirm-index:${Math.min(index, 8)}" role="listitem">
      <span class="confirm-modal-item-icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></span>
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

function formatDataSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return 'Tidak tersedia';
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB'];
  let size = value;
  let unit = -1;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toLocaleString('id-ID', { maximumFractionDigits: 2 })} ${units[unit]}`;
}

async function loadGoogleDriveInfo() {
  const connected = Boolean(currentUser?.googleEmail);
  settingsGoogleDetails?.classList.toggle('hidden', !connected);
  if (!connected) {
    if (settingsGoogleEmail) settingsGoogleEmail.textContent = '—';
    if (settingsGoogleSize) settingsGoogleSize.textContent = '—';
    return;
  }
  if (settingsGoogleEmail) settingsGoogleEmail.textContent = currentUser.googleEmail;
  if (settingsGoogleSize) settingsGoogleSize.textContent = 'Menghitung…';
  try {
    const result = await window.passsa.syncInfo?.();
    if (!result?.ok) throw new Error(result?.message || 'Ukuran data tidak tersedia.');
    if (settingsGoogleSize) settingsGoogleSize.textContent = formatDataSize(result.sizeBytes);
  } catch {
    if (settingsGoogleSize) settingsGoogleSize.textContent = 'Tidak tersedia';
  }
}

vaultNoticeDismiss.addEventListener('click', () => {
  clearTimeout(noticeTimer);
  vaultNotice.classList.add('hidden');
});

function refreshSettingsGoogleState() {
  const connected = Boolean(currentUser?.googleEmail);
  const pending = Boolean(settingsGoogleChallengeId);
  settingsGoogleStatus.textContent = pending ? 'Menunggu password' : connected ? 'Terhubung' : 'Belum terhubung';
  settingsGooglePasswordLabel.classList.toggle('hidden', connected && !pending);
  settingsGooglePassword.classList.toggle('hidden', connected && !pending);
  settingsGoogleConnect.classList.toggle('hidden', connected && !pending);
  settingsGoogleDisconnect.classList.toggle('hidden', !connected || pending);
  settingsGoogleConnect.textContent = pending ? 'Selesaikan koneksi' : 'Hubungkan Google';
  loadGoogleDriveInfo();
}

async function refreshSettingsS3State() {
  if (!settingsS3Status) return;
  settingsS3Status.textContent = 'Memuat…';
  try {
    const result = await window.passsa.s3SyncInfo?.();
    if (!result?.ok) throw new Error(result?.message || 'Status S3 tidak tersedia.');
    const connected = Boolean(result.connected);
    updateTitlebarSyncStatus(currentUser, { available: true, connected });
    const config = result.config || {};
    settingsS3Status.textContent = connected ? 'Terhubung' : 'Belum terhubung';
    settingsS3Details.classList.toggle('hidden', !connected);
    settingsS3Form.classList.toggle('hidden', connected);
    settingsS3Connect.classList.toggle('hidden', connected);
    settingsS3Sync.classList.toggle('hidden', !connected);
    settingsS3Disconnect.classList.toggle('hidden', !connected);
    settingsS3PasswordPanel.classList.add('hidden');
    settingsS3UnlockPassword.value = '';
    if (connected) {
      settingsS3Endpoint.value = config.endpoint || '';
      settingsS3Region.value = config.region || '';
      settingsS3Bucket.value = config.bucket || '';
      settingsS3Prefix.value = config.prefix || 'PassSa';
      settingsS3AccessKey.value = '';
      settingsS3SecretKey.value = '';
      settingsS3SessionToken.value = '';
      settingsS3Location.textContent = `${config.bucket || '—'} / ${config.prefix || 'PassSa'}`;
      settingsS3Account.textContent = `${config.region || '—'}${config.accessKeyHint ? ` / ••••${config.accessKeyHint}` : ''}`;
    } else {
      settingsS3Region.value ||= 'us-east-1';
      settingsS3Prefix.value ||= 'PassSa';
      settingsS3Location.textContent = '—';
      settingsS3Account.textContent = '—';
    }
  } catch (error) {
    updateTitlebarSyncStatus(currentUser, { available: false, connected: false });
    settingsS3Status.textContent = 'Tidak tersedia';
    settingsS3Details.classList.add('hidden');
    settingsS3Form.classList.remove('hidden');
    settingsS3Connect.classList.remove('hidden');
    settingsS3Sync.classList.add('hidden');
    settingsS3Disconnect.classList.add('hidden');
    setInlineMessage(settingsS3Message, error.message || 'Status S3 tidak tersedia.');
  }
}

async function loadAppSettings() {
  if (!window.passsa.getAppSettings || !settingsStartup || !settingsMinimizeTray || !settingsQuickAccess) return;
  try {
    const settings = await window.passsa.getAppSettings();
    settingsStartup.checked = Boolean(settings.startWithWindows);
    settingsMinimizeTray.checked = Boolean(settings.minimizeToTray);
    settingsQuickAccess.checked = settings.quickAccessEnabled !== false;
    setInlineMessage(settingsAppMessage, settings.quickAccessEnabled !== false && settings.quickAccessRegistered === false
      ? 'Quick Access aktif, tetapi shortcut global belum tersedia. Coba gunakan Alt + Shift + P setelah PassSa dibuka ulang.'
      : '');
  } catch (error) {
    setInlineMessage(settingsAppMessage, error.message || 'Pengaturan aplikasi gagal dibaca.');
  }
}

async function loadAboutAppInfo() {
  if (appInfoPromise) return appInfoPromise;
  appInfoPromise = (async () => {
    try {
      const info = await window.passsa.appInfo?.();
      currentAppVersion = info?.version || '';
      if (settingsAboutVersion) settingsAboutVersion.textContent = currentAppVersion || 'Tidak tersedia';
      if (settingsAboutRuntime) {
        settingsAboutRuntime.textContent = info?.runtime === 'tauri-v2'
          ? 'Tauri v2'
          : (info?.runtime || 'Desktop');
      }
      return info || null;
    } catch {
      if (settingsAboutVersion) settingsAboutVersion.textContent = 'Tidak tersedia';
      if (settingsAboutRuntime) settingsAboutRuntime.textContent = 'Desktop';
      return null;
    }
  })();
  return appInfoPromise;
}

function formatUpdateCheckTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Belum pernah'
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

function readCachedUpdateCheck() {
  try {
    const cached = JSON.parse(localStorage.getItem(UPDATE_CHECK_STORAGE_KEY) || 'null');
    return cached && Number.isFinite(cached.checkedAt) ? cached : null;
  } catch {
    return null;
  }
}

function setAboutUpdateStatus(message, state = '') {
  if (!settingsAboutUpdateStatus) return;
  settingsAboutUpdateStatus.textContent = message;
  settingsAboutUpdateStatus.classList.remove('is-update-available', 'is-update-up-to-date', 'is-update-error');
  if (state) settingsAboutUpdateStatus.classList.add(`is-update-${state}`);
}

function renderUpdateCheck(cached, { checkedNow = false } = {}) {
  if (!cached) return;
  if (settingsAboutLatestVersion) settingsAboutLatestVersion.textContent = cached.version || 'Tidak ditemukan';
  if (settingsAboutCheckedAt) settingsAboutCheckedAt.textContent = formatUpdateCheckTime(cached.checkedAt);
  if (settingsAboutReleaseSummary) {
    const summary = String(cached.summary || '').trim();
    settingsAboutReleaseSummary.textContent = summary;
    settingsAboutReleaseSummary.classList.toggle('hidden', !summary);
  }
  latestReleaseUrl = 'releases';
  const comparison = window.PassSaUpdates?.compareVersions(currentAppVersion, cached.version);
  if (comparison !== null && comparison < 0) {
    setAboutUpdateStatus(`Versi baru tersedia: ${cached.version}${cached.prerelease ? ' (prerelease)' : ''}.`, 'available');
    settingsAboutDownloadUpdate?.classList.remove('hidden');
  } else {
    settingsAboutDownloadUpdate?.classList.add('hidden');
    if (comparison !== null && comparison > 0) {
      setAboutUpdateStatus(`Versi lokal ${currentAppVersion} lebih baru daripada rilis publik ${cached.version}.`, 'up-to-date');
    } else if (comparison === 0) {
      setAboutUpdateStatus(checkedNow ? 'Anda sudah menggunakan versi terbaru.' : 'Versi yang digunakan sudah terbaru.', 'up-to-date');
    } else {
      setAboutUpdateStatus(`Rilis GitHub terbaru: ${cached.version}. Versi aplikasi belum dapat dibandingkan.`);
    }
  }
}

async function checkAppUpdates({ force = false } = {}) {
  if (updateCheckPromise) return updateCheckPromise;
  if (!window.passsa?.isTauri) {
    setAboutUpdateStatus('Pemeriksaan versi tersedia saat PassSa dijalankan sebagai aplikasi desktop.');
    return null;
  }
  const cached = readCachedUpdateCheck();
  if (!force && cached && Date.now() - cached.checkedAt < UPDATE_CHECK_INTERVAL_MS) {
    renderUpdateCheck(cached);
    return cached;
  }
  updateCheckPromise = (async () => {
    if (settingsAboutCheckUpdates) settingsAboutCheckUpdates.disabled = true;
    setAboutUpdateStatus('Memeriksa versi terbaru di GitHub…');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(GITHUB_RELEASES_API, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2026-03-10',
        },
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`GitHub merespons ${response.status}`);
      const releases = await response.json();
      if (!Array.isArray(releases)) throw new Error('Daftar rilis tidak valid.');
      const candidates = releases
        .filter((release) => !release.draft && window.PassSaUpdates?.parseVersion(release.tag_name))
        .sort((left, right) => window.PassSaUpdates.compareVersions(right.tag_name, left.tag_name));
      const release = candidates[0];
      if (!release) throw new Error('Belum ada rilis dengan nomor versi yang valid.');
      const summary = String(release.body || release.name || '')
        .replace(/\r/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[`*_>#]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240);
      const result = {
        version: release.tag_name.replace(/^v/, ''),
        prerelease: Boolean(release.prerelease),
        summary,
        checkedAt: Date.now(),
      };
      try { localStorage.setItem(UPDATE_CHECK_STORAGE_KEY, JSON.stringify(result)); } catch { /* local cache is optional */ }
      renderUpdateCheck(result, { checkedNow: true });
      return result;
    } catch {
      if (cached) renderUpdateCheck(cached);
      setAboutUpdateStatus(cached
        ? 'Pemeriksaan gagal. Menampilkan informasi pemeriksaan terakhir; coba lagi saat online.'
        : 'Tidak dapat memeriksa versi sekarang. Periksa koneksi lalu coba lagi.', 'error');
      return null;
    } finally {
      window.clearTimeout(timeout);
      if (settingsAboutCheckUpdates) settingsAboutCheckUpdates.disabled = false;
      updateCheckPromise = null;
    }
  })();
  return updateCheckPromise;
}

async function openAboutLink(destination) {
  try {
    const result = await window.passsa.openExternal?.(destination);
    if (result?.ok === false) throw new Error(result.message || 'Tautan tidak dapat dibuka.');
  } catch (error) {
    setAboutUpdateStatus(error.message || 'Tautan tidak dapat dibuka.', 'error');
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
    setInlineMessage(settingsAppMessage, result.quickAccessEnabled && result.quickAccessRegistered === false
      ? 'Pengaturan disimpan, tetapi shortcut global belum tersedia. Shortcut mungkin sedang dipakai aplikasi lain.'
      : 'Pengaturan aplikasi disimpan.', result.quickAccessEnabled !== true || result.quickAccessRegistered !== false);
  } catch (error) {
    setInlineMessage(settingsAppMessage, error.message || 'Pengaturan aplikasi gagal disimpan.');
  } finally {
    settingsStartup.disabled = false;
    settingsMinimizeTray.disabled = false;
    settingsQuickAccess.disabled = false;
  }
}

function openSettings({ s3UnlockMessage = '', s3NoticeMessage = '' } = {}) {
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
  settingsDirectLoginPassword.value = '';
  settingsDirectLoginPanel?.classList.add('hidden');
  setInlineMessage(settingsDirectLoginMessage, '');
  updateTransferFormatFields();
  setSettingsMessage('');
  applyTheme(getThemePreference());
  applyOpacity(getOpacityPreference());
  applyPalette(getPalettePreference());
  loadAboutAppInfo().then(() => {
    const cachedUpdateCheck = readCachedUpdateCheck();
    if (cachedUpdateCheck) renderUpdateCheck(cachedUpdateCheck);
  });
  refreshSettingsGoogleState();
  const s3Refresh = refreshSettingsS3State();
  if (s3UnlockMessage || s3NoticeMessage) {
    s3Refresh.then(() => {
      if (s3UnlockMessage) settingsS3PasswordPanel.classList.remove('hidden');
      setInlineMessage(settingsS3Message, s3UnlockMessage || s3NoticeMessage);
      if (s3UnlockMessage) requestAnimationFrame(() => settingsS3UnlockPassword.focus());
    });
  }
  rememberModalFocus(settingsModal);
  settingsModal.classList.remove('hidden');
  loadAppSettings();
  refreshHelloSettingsState();
  loadTwoFactorStatus();
  loadDirectLoginStatus();
  requestAnimationFrame(() => closeSettingsButton.focus());
}

function closeSettings() {
  settingsGoogleChallengeId = null;
  settingsGooglePassword.value = '';
  settingsHelloPassword.value = '';
  settingsDirectLoginPassword.value = '';
  settingsDirectLoginPanel?.classList.add('hidden');
  changePasswordForm.reset();
  setInlineMessage(settingsPasswordMessage, '');
  setInlineMessage(settingsTransferMessage, '');
  setInlineMessage(settingsAppMessage, '');
  setSettingsMessage('');
  settingsModal.classList.add('hidden');
  restoreModalFocus(settingsModal);
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

function showAuthenticators() {
  currentFilter = 'authenticator';
  currentGroup = null;
  currentGroupPrefix = null;
  currentTag = null;
  selectedIds.clear();
  const authenticatorButton = document.querySelector('.tree-node[data-filter="authenticator"]');
  document.querySelectorAll('.tree-node').forEach((node) => node.classList.toggle('active', node === authenticatorButton));
  document.querySelector('.vault-content h2').textContent = 'Authenticator';
  clearFilterButton.textContent = '← Semua item';
  clearFilterButton.setAttribute('aria-label', 'Kembali ke semua item');
  clearFilterButton.classList.remove('hidden');
  searchInput.value = '';
  searchInput.placeholder = 'Cari layanan atau akun...';
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
    items = loadedItems.map(normalizeRendererItem);
    categories = loadedCategories;
    categoryIcons = loadedIcons;
    sidebarCountsDirty = true;
    sidebarTreeDirty = true;
    tagTreeDirty = true;
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
  const typeLabel = document.querySelector('#item-type-label');
  document.querySelector('#modal-title').textContent = item ? 'Edit Item' : 'Tambah Item';
  document.querySelector('#item-id').value = item?.id ?? '';
  itemTypeInput.value = item?.type ?? 'login';
  typeLabel?.classList.toggle('hidden', !item);
  itemTypeInput.classList.toggle('hidden', !item);
  document.querySelector('#item-title').value = item?.title ?? '';
  document.querySelector('#item-username').value = item?.username ?? '';
  document.querySelector('#item-password').value = item?.password ?? '';
  document.querySelector('#item-password').type = 'password';
  updateSecretToggle(document.querySelector('#toggle-item-password'), false);
  document.querySelector('#item-url').value = item?.url ?? '';
  itemTotpIssuer.value = item?.totp?.issuer ?? '';
  itemTotpAccount.value = item?.totp?.account ?? '';
  itemTotpSecret.value = item?.totp?.secret ?? '';
  itemTotpSecret.type = 'password';
  itemTotpUri.value = '';
  itemTotpAlgorithm.value = item?.totp?.algorithm ?? 'sha1';
  itemTotpDigits.value = String(item?.totp?.digits ?? 6);
  updateTotpPeriodOption(item?.totp?.period ?? 30);
  updateSecretToggle(toggleItemTotpSecret, false, 'kunci setup');
  setInlineMessage(itemTotpMessage, '');
  document.querySelector('#item-group').value = item?.group ?? currentGroup ?? currentGroupPrefix ?? 'Internet/Coding';
  document.querySelector('#item-favorite').checked = item ? Boolean(item.favorite) : currentFilter === 'favorites';
  document.querySelector('#item-notes').value = item?.notes ?? '';
  document.querySelector('#item-tags').value = item ? (item.tags ?? []).join(', ') : (currentTag ?? '');
  setNoteEditorMode('write', { sync: false });
  renderCustomFields(item?.fields ?? []);
  updateItemTypeUi();
  updateNoteEditorSaveState('ready');
  resizeNoteInput();
  if (item?.type === 'secure-note') renderNoteHistory(item.noteHistory ?? [], Boolean(item));
  else if (item?.type === 'authenticator') renderPasswordHistory([], false);
  else renderPasswordHistory(item?.passwordHistory ?? [], Boolean(item));
  rememberModalFocus(itemModal);
  itemModal.classList.remove('hidden');
  resizeNoteInput();
  document.querySelector('#item-title').focus();
}

function closeItemModal() {
  document.querySelector('#item-password').value = '';
  resetTotpFormFields();
  tagSuggestions.classList.add('hidden');
  itemModal.classList.add('hidden');
  itemForm.reset();
  renderCustomFields([]);
  setNoteEditorMode('write', { sync: false });
  updateItemTypeUi();
  renderPasswordHistory([], false);
  formNoteHistoryEntries = [];
  restoreModalFocus(itemModal);
}

loginTab.addEventListener('click', () => setMode('login'));
registerTab.addEventListener('click', () => setMode('register'));
usernameInput.addEventListener('input', () => { refreshHelloLoginState(); });
helloLoginButton?.addEventListener('click', async () => {
  helloLoginButton.disabled = true;
  setMessage('Memverifikasi Windows Hello…');
  try {
    const result = await window.passsa.helloUnlock(usernameInput.value);
    if (!result.ok) {
      setMessage(result.message || 'Windows Hello gagal membuka vault.');
      return;
    }
    if (result.requires2fa || result.requires2faSetup) {
      passwordInput.value = '';
      openTwoFactorModal(result);
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

directLoginButton?.addEventListener('click', async () => {
  directLoginButton.disabled = true;
  setMessage('Membuka vault di perangkat ini…');
  try {
    const result = await window.passsa.directLoginUnlock();
    if (!result?.ok || !result.user) {
      setMessage(result?.message || 'Login langsung tidak dapat membuka vault.');
      await loadDirectLoginStatus();
      return;
    }
    setMessage('');
    await showVault(result.user);
    showVaultNotice('Vault dibuka menggunakan login langsung perangkat ini.');
  } catch (error) {
    setMessage(error.message || 'Login langsung tidak dapat membuka vault.');
  } finally {
    directLoginButton.disabled = false;
  }
});

devBypassButton?.addEventListener('click', async () => {
  devBypassButton.disabled = true;
  devBypassButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Membuka profil development…';
  setMessage('');
  try {
    const result = await window.passsa.devBypassLogin();
    if (!result?.ok || !result.user) {
      setMessage(result?.message || 'Sesi pengembangan tidak dapat dibuka.');
      return;
    }
    await showVault(result.user);
    showVaultNotice('Sesi pengembangan aktif. Data memakai profil sementara yang terpisah.');
  } catch (error) {
    setMessage(error.message || 'Sesi pengembangan tidak dapat dibuka.');
  } finally {
    devBypassButton.disabled = false;
    devBypassButton.innerHTML = '<i class="fa-solid fa-flask" aria-hidden="true"></i> Lewati login (mode pengembangan)';
  }
});

if (window.passsa.devBypassStatus) {
  window.passsa.devBypassStatus().then((status) => {
    const available = status?.enabled === true;
    devBypassButton?.classList.toggle('hidden', !available);
    devBypassHelp?.classList.toggle('hidden', !available);
  }).catch(() => undefined);
}

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
    const result = mode === 'register'
      ? await window.passsa.register(usernameInput.value, passwordInput.value)
      : await window.passsa.login(usernameInput.value, passwordInput.value);
    passwordInput.value = '';
    if (result.ok) {
      if (result.requires2fa || result.requires2faSetup) {
        openTwoFactorModal(result);
      } else {
        await showVault(result.user);
        if (result.directLogin?.enabled) showVaultNotice('Login langsung aktif: vault ini hanya terbuka otomatis di perangkat ini.');
        else if (result.directLogin?.message) showVaultNotice(result.directLogin.message, true);
        if (result.sync?.message) showVaultNotice(result.sync.message, !result.sync.ok);
      }
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

twoFactorRecoveryToggle.addEventListener('click', () => {
  twoFactorRecoveryMode = !twoFactorRecoveryMode;
  twoFactorRecoveryField.classList.toggle('hidden', !twoFactorRecoveryMode);
  twoFactorCode.classList.toggle('hidden', twoFactorRecoveryMode);
  twoFactorCodeLabel.classList.toggle('hidden', twoFactorRecoveryMode);
  twoFactorCode.required = !twoFactorRecoveryMode;
  twoFactorRecoveryCode.required = twoFactorRecoveryMode;
  twoFactorRecoveryToggle.textContent = twoFactorRecoveryMode
    ? 'Gunakan kode Google Authenticator'
    : 'Gunakan recovery code';
  (twoFactorRecoveryMode ? twoFactorRecoveryCode : twoFactorCode).focus();
});

copyTwoFactorManualKeyButton?.addEventListener('click', async () => {
  if (!twoFactorManualKey.textContent.trim() || !twoFactorChallengeId) return;

  copyTwoFactorManualKeyButton.disabled = true;
  try {
    const result = await window.passsa.copyTwoFactorSetupKey(twoFactorChallengeId);
    if (!result?.ok) throw new Error(result?.message || 'Kunci setup tidak dapat disalin.');
    const icon = copyTwoFactorManualKeyButton.querySelector('i');
    icon?.classList.replace('fa-copy', 'fa-check');
    copyTwoFactorManualKeyButton.setAttribute('aria-label', 'Kunci setup tersalin');
    setInlineMessage(twoFactorMessage, 'Kunci setup disalin. Clipboard dibersihkan dalam 30 detik.', true);
    setTimeout(() => {
      icon?.classList.replace('fa-check', 'fa-copy');
      copyTwoFactorManualKeyButton.setAttribute('aria-label', 'Salin kunci setup');
    }, 1800);
  } catch (error) {
    setInlineMessage(twoFactorMessage, error.message || 'Kunci setup tidak dapat disalin.');
  } finally {
    copyTwoFactorManualKeyButton.disabled = false;
  }
});

twoFactorKeySourceInputs.forEach((input) => input.addEventListener('change', updateTwoFactorKeySource));

toggleTwoFactorExistingKeyButton?.addEventListener('click', () => {
  const visible = twoFactorExistingKey.type === 'text';
  twoFactorExistingKey.type = visible ? 'password' : 'text';
  updateSecretToggle(toggleTwoFactorExistingKeyButton, !visible);
});

twoFactorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!twoFactorChallengeId || !twoFactorSubmit || !twoFactorForm.reportValidity()) return;
  twoFactorSubmit.disabled = true;
  setInlineMessage(twoFactorMessage, 'Memverifikasi kode…');
  try {
    const code = twoFactorRecoveryMode ? twoFactorRecoveryCode.value : twoFactorCode.value;
    const setupSecret = twoFactorSetupMode && isUsingExistingTwoFactorKey() ? twoFactorExistingKey.value : '';
    const result = await window.passsa.twoFactorComplete(twoFactorChallengeId, code, twoFactorRecoveryMode, setupSecret);
    if (!result.ok) {
      setInlineMessage(twoFactorMessage, result.message || 'Kode 2FA tidak valid.');
      (twoFactorRecoveryMode ? twoFactorRecoveryCode : twoFactorCode).select();
      return;
    }
    if (result.recoveryCodes?.length) {
      twoFactorCompletedResult = result;
      renderRecoveryCodes(result.recoveryCodes);
      twoFactorRecoveryPanel.classList.remove('hidden');
      twoFactorCode.required = false;
      twoFactorSubmit.classList.add('hidden');
      twoFactorFinish.classList.remove('hidden');
      twoFactorRecoveryToggle.classList.add('hidden');
      twoFactorTitle.textContent = 'Simpan recovery code';
      twoFactorInstructions.textContent = '2FA berhasil diaktifkan. Simpan recovery code berikut di tempat aman sebelum membuka vault.';
      closeTwoFactorButton.disabled = true;
      cancelTwoFactorButton.disabled = true;
      setInlineMessage(twoFactorMessage, '2FA aktif. Vault akan dibuka setelah Anda mengonfirmasi recovery code.', true);
      twoFactorRecoveryConfirm.focus();
      return;
    }
    await finishTwoFactorResult(result);
  } catch (error) {
    setInlineMessage(twoFactorMessage, error.message || 'Verifikasi 2FA gagal.');
  } finally {
    twoFactorSubmit.disabled = false;
  }
});

twoFactorFinish.addEventListener('click', async () => {
  if (!twoFactorCompletedResult || !twoFactorRecoveryConfirm.checked) {
    setInlineMessage(twoFactorMessage, 'Konfirmasi bahwa recovery code sudah disimpan di luar PassSa.');
    twoFactorRecoveryConfirm.focus();
    return;
  }
  twoFactorFinish.disabled = true;
  try {
    await finishTwoFactorResult(twoFactorCompletedResult);
  } catch (error) {
    setInlineMessage(twoFactorMessage, error.message || 'Vault gagal dibuka.');
    twoFactorFinish.disabled = false;
  }
});

closeTwoFactorButton.addEventListener('click', closeTwoFactorModal);
cancelTwoFactorButton.addEventListener('click', closeTwoFactorModal);
twoFactorModal.addEventListener('click', (event) => {
  if (event.target === twoFactorModal) closeTwoFactorModal();
});

syncButton.addEventListener('click', async () => {
  syncButton.disabled = true;
  syncButton.setAttribute('aria-busy', 'true');
  const originalIcon = syncButton.innerHTML;
  let s3Status = { available: false, connected: false };
  syncButton.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin" aria-hidden="true"></i>';
  syncButton.title = 'Memeriksa penyedia sinkronisasi…';
  syncButton.setAttribute('aria-label', 'Memeriksa penyedia sinkronisasi');
  try {
    const driveConnected = Boolean(currentUser?.googleEmail);
    let s3StatusError = '';
    try {
      const status = await window.passsa.s3SyncInfo?.();
      if (!status?.ok) throw new Error(status?.message || 'Status S3 tidak tersedia.');
      s3Status = { available: true, connected: Boolean(status.connected) };
    } catch (error) {
      s3StatusError = error.message || 'Status S3 tidak tersedia.';
    }
    renderTitlebarSyncStatus(currentUser, s3Status);

    const providers = [];
    if (driveConnected) providers.push('Google Drive');
    if (s3Status.connected) providers.push('S3');
    if (!providers.length) {
      const message = s3StatusError
        ? 'Status sinkronisasi tidak tersedia. Periksa koneksi Google Drive atau S3 di Pengaturan.'
        : 'Google Drive atau S3 belum terhubung. Hubungkan salah satu penyedia di sini.';
      openSettings({ s3NoticeMessage: message });
      return;
    }

    const outcomes = [];
    for (const provider of providers) {
      try {
        const result = provider === 'Google Drive'
          ? await window.passsa.syncNow()
          : await window.passsa.s3SyncNow();
        if (provider === 'S3' && result?.status === 'requires-password') {
          const message = result.message || 'Masukkan password vault untuk melanjutkan sinkronisasi S3.';
          const priorResults = outcomes.map((outcome) => `${outcome.provider}: ${outcome.message}`);
          showVaultNotice([...priorResults, `S3: ${message}`].join(' · '), true);
          openSettings({ s3UnlockMessage: message });
          return;
        }
        if (!result?.ok && result?.status !== 'conflict') {
          throw new Error(result?.message || `Sinkronisasi ${provider} gagal.`);
        }
        if (result.status === 'downloaded') await loadItems();
        outcomes.push({
          provider,
          ok: Boolean(result.ok),
          message: result.message || (result.ok ? 'sinkronisasi selesai' : 'perlu penanganan'),
        });
      } catch (error) {
        outcomes.push({ provider, ok: false, message: error.message || 'sinkronisasi gagal' });
      }
    }
    showVaultNotice(
      outcomes.map((outcome) => `${outcome.provider}: ${outcome.message}`).join(' · '),
      outcomes.some((outcome) => !outcome.ok),
    );
  } catch (error) {
    showVaultNotice(error.message || 'Sinkronisasi gagal.', true);
  } finally {
    syncButton.innerHTML = originalIcon;
    syncButton.removeAttribute('aria-busy');
    renderSidebarSyncAction(currentUser, s3Status);
    syncButton.disabled = false;
  }
});

settingsButton.addEventListener('click', openSettings);
settingsAboutCheckUpdates?.addEventListener('click', () => checkAppUpdates({ force: true }));
settingsAboutDownloadUpdate?.addEventListener('click', () => openAboutLink(latestReleaseUrl));
settingsAboutGithub?.addEventListener('click', () => openAboutLink('repository'));
settingsAboutReleases?.addEventListener('click', () => openAboutLink('releases'));
settingsTheme?.addEventListener('change', () => applyTheme(settingsTheme.value));
settingsOpacity?.addEventListener('input', () => applyOpacity(settingsOpacity.value));
settingsPaletteInputs.forEach((input) => input.addEventListener('change', () => applyPalette(input.value)));
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
      if (result.requires2fa || result.requires2faSetup) {
        closeSettings();
        openTwoFactorModal(result);
        return;
      }
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
    if (result.requires2fa || result.requires2faSetup) {
      closeSettings();
      openTwoFactorModal(result);
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

settingsS3Connect.addEventListener('click', async () => {
  settingsS3Connect.disabled = true;
  setInlineMessage(settingsS3Message, '');
  try {
    const result = await window.passsa.connectS3({
      endpoint: settingsS3Endpoint.value,
      region: settingsS3Region.value,
      bucket: settingsS3Bucket.value,
      prefix: settingsS3Prefix.value,
      accessKeyId: settingsS3AccessKey.value,
      secretAccessKey: settingsS3SecretKey.value,
      sessionToken: settingsS3SessionToken.value,
    });
    if (!result?.ok) throw new Error(result?.message || 'Koneksi S3 gagal.');
    settingsS3SecretKey.value = '';
    settingsS3SessionToken.value = '';
    await refreshSettingsS3State();
    setInlineMessage(settingsS3Message, result.message || 'Koneksi S3 berhasil diuji.', true);
  } catch (error) {
    setInlineMessage(settingsS3Message, error.message || 'Koneksi S3 gagal.');
  } finally {
    settingsS3Connect.disabled = false;
  }
});

async function syncS3(password = '') {
  settingsS3Sync.disabled = true;
  settingsS3Unlock.disabled = true;
  const originalText = settingsS3Sync.innerHTML;
  settingsS3Sync.innerHTML = '<i class="fa-solid fa-arrows-rotate" aria-hidden="true"></i> Menyinkronkan…';
  setInlineMessage(settingsS3Message, '');
  try {
    const result = await window.passsa.s3SyncNow(password);
    if (result?.status === 'requires-password') {
      settingsS3Sync.classList.add('hidden');
      settingsS3PasswordPanel.classList.remove('hidden');
      setInlineMessage(settingsS3Message, result.message || 'Masukkan password vault untuk melanjutkan.');
      settingsS3UnlockPassword.focus();
      return;
    }
    if (!result?.ok && result?.status !== 'conflict') throw new Error(result?.message || 'Sinkronisasi S3 gagal.');
    settingsS3PasswordPanel.classList.add('hidden');
    settingsS3Sync.classList.remove('hidden');
    settingsS3UnlockPassword.value = '';
    if (result.status === 'downloaded') await loadItems();
    setInlineMessage(settingsS3Message, result.message || 'Sinkronisasi S3 selesai.', result.ok);
  } catch (error) {
    setInlineMessage(settingsS3Message, error.message || 'Sinkronisasi S3 gagal.');
  } finally {
    settingsS3Sync.disabled = false;
    settingsS3Unlock.disabled = false;
    settingsS3Sync.innerHTML = originalText;
  }
}

settingsS3Sync.addEventListener('click', () => syncS3());
settingsS3Unlock.addEventListener('click', () => syncS3(settingsS3UnlockPassword.value));
settingsS3UnlockPassword.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') syncS3(settingsS3UnlockPassword.value);
});

settingsS3Disconnect.addEventListener('click', async () => {
  settingsS3Disconnect.disabled = true;
  setInlineMessage(settingsS3Message, '');
  try {
    const result = await window.passsa.disconnectS3();
    if (!result?.ok) throw new Error(result?.message || 'Koneksi S3 gagal diputus.');
    await refreshSettingsS3State();
    setInlineMessage(settingsS3Message, result.message || 'Koneksi S3 diputus.', true);
  } catch (error) {
    setInlineMessage(settingsS3Message, error.message || 'Koneksi S3 gagal diputus.');
  } finally {
    settingsS3Disconnect.disabled = false;
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

settingsTwoFactorEnable?.addEventListener('click', async () => {
  settingsTwoFactorEnable.disabled = true;
  setInlineMessage(settingsTwoFactorMessage, '');
  try {
    const result = await window.passsa.twoFactorSetupStart();
    if (!result?.ok || !result.requires2faSetup) throw new Error(result?.message || 'Setup Authenticator tidak dapat dimulai.');
    openTwoFactorModal(result);
  } catch (error) {
    setInlineMessage(settingsTwoFactorMessage, error.message || 'Setup Authenticator tidak dapat dimulai.');
  } finally {
    settingsTwoFactorEnable.disabled = false;
  }
});

settingsTwoFactorDisableOpen?.addEventListener('click', () => {
  settingsTwoFactorDisablePanel.classList.remove('hidden');
  setInlineMessage(settingsTwoFactorMessage, '');
  settingsTwoFactorPassword.focus();
});

settingsTwoFactorDisableCancel?.addEventListener('click', () => {
  settingsTwoFactorDisablePanel.classList.add('hidden');
  settingsTwoFactorPassword.value = '';
  settingsTwoFactorCode.value = '';
  setInlineMessage(settingsTwoFactorMessage, '');
});

settingsTwoFactorDisableSubmit?.addEventListener('click', async () => {
  const password = settingsTwoFactorPassword.value;
  const code = settingsTwoFactorCode.value.replace(/\s/g, '');
  setInlineMessage(settingsTwoFactorMessage, '');
  if (!password || !/^\d{6}$/.test(code)) {
    setInlineMessage(settingsTwoFactorMessage, 'Masukkan password vault dan kode Authenticator 6 digit yang terbaru.');
    return;
  }
  settingsTwoFactorDisableSubmit.disabled = true;
  try {
    const result = await window.passsa.twoFactorDisable(password, code);
    if (!result?.ok) throw new Error(result?.message || '2FA tidak dapat dinonaktifkan.');
    settingsTwoFactorPassword.value = '';
    settingsTwoFactorCode.value = '';
    settingsTwoFactorDisablePanel.classList.add('hidden');
    await loadTwoFactorStatus();
    await loadDirectLoginStatus();
    setInlineMessage(settingsTwoFactorMessage, result.message || '2FA dinonaktifkan.', true);
  } catch (error) {
    setInlineMessage(settingsTwoFactorMessage, error.message || '2FA tidak dapat dinonaktifkan.');
    settingsTwoFactorCode.focus();
  } finally {
    settingsTwoFactorDisableSubmit.disabled = false;
  }
});

settingsDirectLoginEnable?.addEventListener('click', () => {
  settingsDirectLoginPassword.value = '';
  setInlineMessage(settingsDirectLoginMessage, '');
  settingsDirectLoginPanel.classList.remove('hidden');
  settingsDirectLoginPassword.focus();
});

settingsDirectLoginCancel?.addEventListener('click', () => {
  settingsDirectLoginPassword.value = '';
  settingsDirectLoginPanel.classList.add('hidden');
  setInlineMessage(settingsDirectLoginMessage, '');
});

settingsDirectLoginConfirm?.addEventListener('click', async () => {
  const password = settingsDirectLoginPassword.value;
  setInlineMessage(settingsDirectLoginMessage, '');
  if (!password) {
    setInlineMessage(settingsDirectLoginMessage, 'Masukkan password vault saat ini untuk mengaktifkan login langsung.');
    settingsDirectLoginPassword.focus();
    return;
  }
  settingsDirectLoginConfirm.disabled = true;
  try {
    const result = await window.passsa.directLoginEnable(password);
    if (!result?.ok) throw new Error(result?.message || 'Login langsung tidak dapat diaktifkan.');
    settingsDirectLoginPassword.value = '';
    settingsDirectLoginPanel.classList.add('hidden');
    await loadDirectLoginStatus();
    setInlineMessage(settingsDirectLoginMessage, result.message || 'Login langsung aktif di perangkat ini.', true);
  } catch (error) {
    setInlineMessage(settingsDirectLoginMessage, error.message || 'Login langsung tidak dapat diaktifkan.');
  } finally {
    settingsDirectLoginConfirm.disabled = false;
  }
});

settingsDirectLoginDisable?.addEventListener('click', async () => {
  settingsDirectLoginDisable.disabled = true;
  setInlineMessage(settingsDirectLoginMessage, '');
  try {
    const result = await window.passsa.directLoginDisable();
    if (!result?.ok) throw new Error(result?.message || 'Login langsung tidak dapat dimatikan.');
    await loadDirectLoginStatus();
    setInlineMessage(settingsDirectLoginMessage, result.message || 'Login langsung dimatikan.', true);
  } catch (error) {
    setInlineMessage(settingsDirectLoginMessage, error.message || 'Login langsung tidak dapat dimatikan.');
  } finally {
    settingsDirectLoginDisable.disabled = false;
  }
});

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
  const result = await window.passsa.logout();
  if (!vaultView.classList.contains('hidden')) showAuth('Anda telah keluar.');
  if (!result?.ok) setMessage(result?.message || 'Sesi ditutup, tetapi login langsung mungkin masih aktif di perangkat ini.');
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
sidebarAddAuthenticatorButton?.addEventListener('click', () => {
  openItemModal();
  itemTypeInput.value = 'authenticator';
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
searchInput.addEventListener('input', scheduleRenderItems);
document.querySelector('.items-scroll')?.addEventListener('scroll', () => {
  if (itemsList.classList.contains('is-virtualized')) scheduleVirtualItemsRender();
}, { passive: true });
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
  if (button.dataset.filter === 'authenticator') {
    showAuthenticators();
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
  rememberModalFocus(categoryModal);
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
  restoreModalFocus(categoryModal);
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
  rememberModalFocus(bulkModal);
  bulkModal.classList.remove('hidden');
  document.querySelector('#bulk-group').focus();
}

function closeBulkModal() {
  bulkModal.classList.add('hidden');
  bulkForm.reset();
  restoreModalFocus(bulkModal);
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

toggleItemTotpSecret?.addEventListener('click', (event) => {
  const visible = itemTotpSecret.type === 'text';
  itemTotpSecret.type = visible ? 'password' : 'text';
  updateSecretToggle(event.currentTarget, !visible, 'kunci setup');
});

document.querySelector('#generate-totp-secret')?.addEventListener('click', () => {
  itemTotpSecret.value = generateRendererTotpSecret();
  itemTotpSecret.type = 'password';
  updateSecretToggle(toggleItemTotpSecret, false, 'kunci setup');
  setInlineMessage(itemTotpMessage, 'Kunci setup baru dibuat. Simpan item untuk mengaktifkannya.', true);
  itemTotpSecret.focus();
});

document.querySelector('#copy-totp-secret')?.addEventListener('click', copyTotpSecretFromForm);
document.querySelector('#apply-totp-uri')?.addEventListener('click', applyTotpUriToForm);

itemTypeInput.addEventListener('change', () => {
  updateItemTypeUi();
  if (itemTypeInput.value === 'secure-note') renderNoteHistory([], false);
  else renderPasswordHistory([], false);
});
noteEditorToolbar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-note-format]');
  if (button) applyNoteFormat(button.dataset.noteFormat);
});
noteEditorToolbar.addEventListener('mousedown', (event) => {
  if (noteEditorModeValue === 'preview' && event.target.closest('button[data-note-format]')) event.preventDefault();
});
noteEditorMode.addEventListener('click', (event) => {
  const button = event.target.closest('[data-note-mode]');
  if (button) setNoteEditorMode(button.dataset.noteMode);
});
noteHeadingLevel?.addEventListener('change', (event) => {
  applyNoteFormat(event.currentTarget.value);
  event.currentTarget.value = 'paragraph';
});
itemNotesInput.addEventListener('input', () => {
  updateNotePreview();
  resizeNoteInput();
  if (itemTypeInput?.value === 'secure-note') updateNoteEditorSaveState('dirty');
});
itemNotesInput.addEventListener('focus', () => { notePreviewSelectionRange = null; });
itemNotesInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    itemForm.requestSubmit();
    return;
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = itemNotesInput.selectionStart ?? 0;
    const end = itemNotesInput.selectionEnd ?? start;
    replaceNoteSelection('  ', start, end);
    return;
  }
});
notePreview?.addEventListener('click', (event) => {
  if (noteEditorModeValue === 'preview' && event.target.closest('a')) event.preventDefault();
});
notePreview?.addEventListener('focus', clearNotePreviewPlaceholder);
notePreview?.addEventListener('beforeinput', clearNotePreviewPlaceholder);
notePreview?.addEventListener('keydown', (event) => {
  if (noteEditorModeValue !== 'preview' || event.key !== 'Enter') return;
  const selection = window.getSelection();
  if (!selection?.rangeCount || !notePreview.contains(selection.anchorNode) || !notePreview.contains(selection.focusNode)) return;
  const block = (selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement)
    ?.closest('li, blockquote, pre, td, th');
  if (block?.tagName.toLowerCase() === 'li') {
    event.preventDefault();
    // Let Chromium split a regular list item, then sync the resulting text.
    insertNotePreviewListBreak();
    return;
  }
  event.preventDefault();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const breakNode = document.createElement('br');
  range.insertNode(breakNode);
  range.setStartAfter(breakNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  notePreview.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertLineBreak' }));
});
notePreview?.addEventListener('input', () => {
  if (noteEditorModeValue !== 'preview') return;
  if (notePreviewSuppressInput) return;
  clearNotePreviewPlaceholder();
  syncNoteInputFromPreview();
});
document.addEventListener('selectionchange', rememberNotePreviewSelection);
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

function toggleNoteHistoryEntry(entry) {
  if (!entry) return;
  const expanded = !entry.classList.contains('is-expanded');
  if (expanded && entry.dataset.noteHistoryRendered !== 'true') {
    const index = Number(entry.dataset.noteHistoryIndex);
    const sourceEntries = entry.dataset.noteHistorySource === 'detail'
      ? noteDetailHistoryEntries
      : formNoteHistoryEntries;
    const historyEntry = Number.isInteger(index) ? sourceEntries[index] : null;
    const markdown = entry.querySelector('.note-history-markdown');
    if (historyEntry && markdown) {
      // History previews stay cheap during the initial modal render. Parse
      // Markdown only when the user explicitly expands a version.
      markdown.innerHTML = renderNoteMarkdown(historyEntry.notes || 'Tidak ada isi catatan.');
      entry.dataset.noteHistoryRendered = 'true';
    }
  }
  entry.classList.toggle('is-expanded', expanded);
  entry.setAttribute('aria-expanded', String(expanded));
}

function handleNoteHistoryEntryClick(event) {
  const entry = event.target.closest('[data-note-history-expand]');
  if (!entry || !event.currentTarget.contains(entry)) return;
  if (event.target.closest('a, button, input, select, textarea')) return;
  toggleNoteHistoryEntry(entry);
}

function handleNoteHistoryEntryKeydown(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const entry = event.target.closest('[data-note-history-expand]');
  if (!entry || !event.currentTarget.contains(entry)) return;
  event.preventDefault();
  toggleNoteHistoryEntry(entry);
}

passwordHistoryList.addEventListener('click', handleNoteHistoryEntryClick);
passwordHistoryList.addEventListener('keydown', handleNoteHistoryEntryKeydown);
noteDetailHistoryList?.addEventListener('click', handleNoteHistoryEntryClick);
noteDetailHistoryList?.addEventListener('keydown', handleNoteHistoryEntryKeydown);

itemModal.addEventListener('click', (event) => {
  if (event.target === itemModal) closeItemModal();
});

closeNoteDetailButton?.addEventListener('click', closeNoteDetail);
noteDetailCloseSecondaryButton?.addEventListener('click', closeNoteDetail);
noteDetailModal?.addEventListener('click', (event) => {
  if (event.target === noteDetailModal) closeNoteDetail();
});
closeAuthenticatorDetailButton?.addEventListener('click', closeAuthenticatorDetail);
authenticatorDetailModal?.addEventListener('click', (event) => {
  if (event.target === authenticatorDetailModal) closeAuthenticatorDetail();
});
authenticatorDetailCopyButton?.addEventListener('click', copyAuthenticatorDetailCode);
authenticatorDetailEditButton?.addEventListener('click', async () => {
  const id = authenticatorDetailCurrentId;
  if (!id) return;
  try {
    const item = await window.passsa.getItem(id);
    closeAuthenticatorDetail();
    if (item) openItemModal(item);
  } catch (error) {
    showVaultNotice(error.message || 'Authenticator tidak dapat diedit.', true);
  }
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
closeCredentialDetailButton?.addEventListener('click', closeCredentialDetail);
credentialDetailCloseSecondaryButton?.addEventListener('click', closeCredentialDetail);
credentialDetailModal?.addEventListener('click', (event) => {
  if (event.target === credentialDetailModal) closeCredentialDetail();
});
toggleCredentialDetailPasswordButton?.addEventListener('click', toggleCredentialDetailPassword);
credentialDetailCopyUrlButton?.addEventListener('click', () => copyCredentialDetailField('url'));
credentialDetailCopyUsernameButton?.addEventListener('click', () => copyCredentialDetailField('username'));
credentialDetailCopyPasswordButton?.addEventListener('click', () => copyCredentialDetailField('password'));
credentialDetailEditButton?.addEventListener('click', async () => {
  const id = credentialDetailCurrentItem?.id;
  if (!id) return;
  try {
    const item = await window.passsa.getItem(id);
    closeCredentialDetail();
    if (item) openItemModal(item);
  } catch (error) {
    showVaultNotice(error.message || 'Credential tidak dapat diedit.', true);
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
  if (payload.type === 'authenticator') {
    payload.totp = {
      issuer: itemTotpIssuer.value,
      account: itemTotpAccount.value,
      secret: itemTotpSecret.value,
      algorithm: itemTotpAlgorithm.value,
      digits: Number(itemTotpDigits.value),
      period: Number(itemTotpPeriod.value),
    };
  }
  const creating = !payload.id;
  saveButton.disabled = true;
  saveButton.textContent = 'Menyimpan…';
  updateNoteEditorSaveState('saving');
  try {
    const result = payload.id
      ? await window.passsa.updateItem(payload)
      : await window.passsa.addItem(payload);
    closeItemModal();
    const updatedIndex = items.findIndex((item) => item.id === result.item.id);
    if (creating) {
      showAllItems();
      items.push(normalizeRendererItem(result.item));
      markItemDataDirty();
    } else if (updatedIndex >= 0) {
      // Reflect the successful IPC response immediately. A subsequent reload
      // still refreshes the encrypted vault and categories from disk.
      items[updatedIndex] = normalizeRendererItem({ ...items[updatedIndex], ...result.item });
      markItemDataDirty();
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
    if (!itemModal.classList.contains('hidden')) updateNoteEditorSaveState('dirty');
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
    if (rowItem?.type === 'authenticator' && !rowItem.deletedAt) {
      openAuthenticatorDetail(rowItem);
      return;
    }
    if (rowItem?.type === 'login' && !rowItem.deletedAt) {
      openCredentialDetail(rowItem.id);
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
      replaceRendererItem(result.item);
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
    if (action === 'copy-totp') {
      const usage = await window.passsa.copyTotpCode(item.id);
      item.usageCount = usage.usageCount;
      item.lastUsedAt = usage.lastUsedAt;
      updateCopiedRow(row, button, usage, 'Kode 2FA');
      showVaultNotice('Kode 2FA disalin. Clipboard dibersihkan dalam 30 detik.');
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
        replaceRendererItem(result.item);
        renderItems();
      }
    }
    if (action === 'restore') {
      const result = await window.passsa.restoreItem(item.id);
      replaceRendererItem(result.item);
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
        markItemDataDirty();
        renderItems();
      }
    }
  } catch (error) {
    showVaultNotice(error.message || 'Operasi item gagal.', true);
  }
});

itemsList.addEventListener('keydown', (event) => {
  if (!['Enter', ' '].includes(event.key)) return;
  const row = event.target.closest('.note-card, .authenticator-item, .credential-card');
  if (!row || event.target.closest('button, input, a')) return;
  event.preventDefault();
  const item = items.find((candidate) => candidate.id === row.dataset.id);
  if (item?.type === 'secure-note') openNoteDetail(row.dataset.id);
  else if (item?.type === 'authenticator') {
    openAuthenticatorDetail(item);
  } else if (item?.type === 'login') {
    openCredentialDetail(item.id);
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
  constrainModalFocus(event);
  if (event.defaultPrevented) return;
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
  if (!twoFactorModal.classList.contains('hidden')) closeTwoFactorModal();
  else if (!noteDetailModal.classList.contains('hidden')) closeNoteDetail();
  else if (!authenticatorDetailModal.classList.contains('hidden')) closeAuthenticatorDetail();
  else if (!credentialDetailModal.classList.contains('hidden')) closeCredentialDetail();
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
    else if (item.type === 'authenticator') openAuthenticatorDetail(item);
    else openItemModal(item);
  } catch (error) {
    showVaultNotice(error.message || 'Credential tidak dapat dibuka.', true);
  }
});

window.passsa.session().then((user) => {
  if (user) return showVault(user);
  return window.passsa.setWindowMode?.('auth');
}).catch(() => window.passsa.setWindowMode?.('auth'));
loadDirectLoginStatus();
