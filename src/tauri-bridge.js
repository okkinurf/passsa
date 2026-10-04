/*
 * Runtime API boundary shared by the renderer and the Tauri v2 desktop shell.
 * Electron continues to provide its existing preload bridge unchanged.
 */
(() => {
  if (window.passsa) return;

  const tauri = window.__TAURI__;
  const invoke = tauri?.core?.invoke || tauri?.invoke;
  const isTauri = typeof invoke === 'function';
  const pending = (feature) => ({
    ok: false,
    code: 'TAURI_BRIDGE_PENDING',
    message: `${feature} belum dipetakan ke backend Tauri v2.`,
  });
  const invokeCommand = (command, args) => isTauri
    ? invoke(command, args)
    : Promise.resolve(pending(command));
  const backend = (channel, ...args) => isTauri
    ? invoke('backend_request', { channel, args })
    : Promise.resolve(pending(channel));
  const windowCommand = (command, args) => isTauri
    ? invoke(command, args)
    : Promise.resolve(pending(command));
  const subscribe = (name, callback) => {
    if (!isTauri || typeof callback !== 'function' || !tauri.event?.listen) return () => undefined;
    let unlisten = () => undefined;
    tauri.event.listen(name, (event) => callback(event.payload))
      .then((stop) => { unlisten = stop; })
      .catch(() => undefined);
    return () => unlisten();
  };

  window.passsa = {
    runtime: isTauri ? 'tauri-v2' : 'browser-preview',
    isTauri,
    onLocked: (callback) => subscribe('session:locked', callback),
    onQuickAccessOpen: (callback) => subscribe('quick-access:open-item', callback),
    session: () => backend('auth:session'),
    login: (username, password) => backend('auth:login', { username, password }),
    register: (username, password) => backend('auth:register', { username, password }),
    devBypassStatus: () => backend('auth:dev-bypass-status'),
    devBypassLogin: () => backend('auth:dev-bypass-login'),
    googleLogin: () => backend('auth:google-start'),
    googleComplete: (challengeId, password, localIdentifier) => backend('auth:google-complete', { challengeId, password, localIdentifier }),
    twoFactorComplete: (challengeId, code, recovery = false, setupSecret = '') => backend('auth:2fa-complete', { challengeId, code, recovery, setupSecret }),
    twoFactorStatus: () => backend('auth:2fa-status'),
    twoFactorSetupStart: () => backend('auth:2fa-setup-start'),
    twoFactorDisable: (password, code) => backend('auth:2fa-disable', { password, code }),
    directLoginStatus: () => backend('auth:direct-login-status'),
    directLoginEnable: (password) => backend('auth:direct-login-enable', { password }),
    directLoginDisable: () => backend('auth:direct-login-disable'),
    directLoginUnlock: () => backend('auth:direct-login-unlock'),
    logout: () => backend('auth:logout'),
    lock: () => backend('auth:lock'),
    setWindowMode: async (mode) => {
      const value = await windowCommand('set_window_mode', { mode });
      if (value?.code) return value;
      await backend('window:set-mode', mode);
      return { ok: true, mode };
    },
    minimizeWindow: () => windowCommand('window_minimize'),
    toggleMaximizeWindow: () => windowCommand('window_toggle_maximize'),
    closeWindow: () => windowCommand('window_close'),
    setTheme: async (theme, palette) => {
      const [backendResult] = await Promise.all([
        backend('window:set-theme', { theme, palette }),
        invokeCommand('set_quick_access_theme', { theme, palette }),
      ]);
      return backendResult;
    },
    helloStatus: () => Promise.resolve({ ok: true, supported: false, enabled: false }),
    helloEnable: async () => ({ ok: false, code: 'UNSUPPORTED', message: 'Windows Hello belum tersedia di versi Tauri.' }),
    helloDisable: async () => ({ ok: false, code: 'UNSUPPORTED', message: 'Windows Hello belum tersedia di versi Tauri.' }),
    helloUnlock: async () => ({ ok: false, code: 'UNSUPPORTED', message: 'Windows Hello belum tersedia di versi Tauri.' }),
    getAppSettings: async () => {
      const settings = await backend('settings:get-app');
      if (!settings || settings.ok === false) return settings;
      const [startWithWindows, quickAccess] = await Promise.all([
        invokeCommand('startup_status'),
        invokeCommand('quick_access_status'),
      ]);
      return {
        ...settings,
        startWithWindows: startWithWindows === true,
        minimizeToTray: false,
        quickAccessEnabled: quickAccess?.enabled === true,
        quickAccessRegistered: quickAccess?.registered === true,
      };
    },
    setAppSettings: async (input) => {
      const result = await backend('settings:set-app', input);
      if (!result || result.ok === false) return result;
      const [startWithWindows, quickAccess] = await Promise.all([
        invokeCommand('set_startup_enabled', { enabled: input?.startWithWindows === true }),
        invokeCommand('set_quick_access_enabled', { enabled: input?.quickAccessEnabled !== false }),
      ]);
      return {
        ...result,
        startWithWindows: startWithWindows === true,
        minimizeToTray: false,
        quickAccessEnabled: quickAccess?.quickAccessEnabled === true,
        quickAccessRegistered: quickAccess?.quickAccessRegistered === true,
      };
    },
    changePassword: (input) => backend('auth:change-password', input),
    exportVault: async (input = {}) => {
      if (!isTauri) return pending('Export vault');
      const selected = await invokeCommand('pick_vault_export_file', { format: input.format || 'passsa' });
      if (selected !== true) return { ok: false, canceled: true };
      return backend('vault:export', input);
    },
    importVault: async (input = {}) => {
      if (!isTauri) return pending('Import vault');
      const selected = await invokeCommand('pick_vault_import_file', { mode: input.mode || 'merge' });
      if (selected !== true) return { ok: false, canceled: true };
      return backend('vault:import', input);
    },
    syncNow: () => backend('sync:now'),
    syncInfo: () => backend('sync:info'),
    disconnectGoogle: () => backend('sync:disconnect'),
    s3SyncInfo: () => backend('s3:info'),
    connectS3: (input) => backend('s3:connect', input),
    s3SyncNow: (password = '') => backend('s3:sync-now', { password }),
    disconnectS3: () => backend('s3:disconnect'),
    listItems: () => backend('vault:list'),
    getItem: (id) => backend('vault:get', id),
    listTotpCodes: (ids) => backend('vault:totp-codes', ids),
    addItem: (item) => backend('vault:add', item),
    updateItem: (item) => backend('vault:update', item),
    toggleFavorite: (id) => backend('vault:favorite', id),
    deleteItem: (id) => backend('vault:delete', id),
    restoreItem: (id) => backend('vault:restore', id),
    purgeItem: (id) => backend('vault:purge', id),
    bulkUpdate: (ids, changes) => backend('vault:bulk-update', ids, changes),
    bulkDelete: (ids) => backend('vault:bulk-delete', ids),
    bulkRestore: (ids) => backend('vault:bulk-restore', ids),
    bulkPurge: (ids) => backend('vault:bulk-purge', ids),
    copyEntrySecret: (id, field) => backend('vault:copy-entry', id, field),
    copyTotpCode: (id) => backend('vault:copy-totp', id),
    copySecret: (value) => backend('vault:copy', value),
    listCategories: () => backend('category:list'),
    listCategoryIcons: () => backend('category:icons'),
    createCategory: (category) => backend('category:create', category),
    updateCategory: (category) => backend('category:update', category),
    deleteCategory: (id) => backend('category:delete', id),
    appInfo: () => invokeCommand('app_info'),
    openExternal: (destination) => invokeCommand('open_external_destination', { destination }),
    platformCapabilities: () => invokeCommand('platform_capabilities'),
  };
})();
