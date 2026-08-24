/*
 * Compatibility boundary for the Tauri v2 migration.
 * Electron exposes the production bridge as window.passsa from preload.js.
 * Tauri does not expose Node/Electron IPC, so this file keeps the renderer
 * bootable until each service has been ported behind a typed Rust command.
 * It never replaces the Electron bridge and never stores credentials.
 */
(() => {
  if (window.passsa) return;

  const tauri = window.__TAURI__;
  const invoke = tauri?.core?.invoke || tauri?.invoke;
  const isTauri = typeof invoke === 'function';
  const pending = (feature) => ({
    ok: false,
    code: 'TAURI_BRIDGE_PENDING',
    message: `${feature} belum dipetakan ke backend Tauri v2.`
  });
  const invokeCommand = (command, args) => isTauri
    ? invoke(command, args)
    : Promise.resolve(pending(command));

  window.passsa = {
    runtime: isTauri ? 'tauri-v2' : 'browser-preview',
    isTauri,
    onLocked: () => undefined,
    session: async () => null,
    login: async () => pending('Login lokal'),
    register: async () => pending('Registrasi lokal'),
    googleLogin: async () => pending('Google OAuth'),
    googleComplete: async () => pending('Google OAuth'),
    logout: async () => ({ ok: true }),
    lock: async () => ({ ok: true }),
    setWindowMode: async () => ({ ok: true }),
    minimizeWindow: async () => pending('Kontrol window'),
    toggleMaximizeWindow: async () => pending('Kontrol window'),
    closeWindow: async () => pending('Kontrol window'),
    setTheme: async () => ({ ok: true }),
    helloStatus: async () => ({ ok: true, supported: false, enabled: false }),
    helloEnable: async () => pending('Windows Hello'),
    helloDisable: async () => pending('Windows Hello'),
    helloUnlock: async () => pending('Windows Hello'),
    getAppSettings: async () => ({ startWithWindows: false, minimizeToTray: false, quickAccessEnabled: true }),
    setAppSettings: async () => pending('Startup dan system tray'),
    changePassword: async () => pending('Ganti password'),
    exportVault: async () => pending('Export vault'),
    importVault: async () => pending('Import vault'),
    syncNow: async () => pending('Google Drive sync'),
    disconnectGoogle: async () => pending('Google Drive sync'),
    listItems: async () => [],
    getItem: async () => pending('Vault item'),
    addItem: async () => pending('Tambah item'),
    updateItem: async () => pending('Edit item'),
    toggleFavorite: async () => pending('Favorit'),
    deleteItem: async () => pending('Hapus item'),
    restoreItem: async () => pending('Restore item'),
    purgeItem: async () => pending('Hapus permanen'),
    bulkUpdate: async () => pending('Bulk edit'),
    bulkDelete: async () => pending('Bulk delete'),
    bulkRestore: async () => pending('Bulk restore'),
    bulkPurge: async () => pending('Bulk purge'),
    copyEntrySecret: async () => pending('Copy credential'),
    copySecret: async () => pending('Copy credential'),
    listCategories: async () => [],
    listCategoryIcons: async () => [],
    createCategory: async () => pending('Kategori custom'),
    updateCategory: async () => pending('Kategori custom'),
    deleteCategory: async () => pending('Kategori custom'),
    appInfo: () => invokeCommand('app_info'),
    platformCapabilities: () => invokeCommand('platform_capabilities'),
  };
})();
