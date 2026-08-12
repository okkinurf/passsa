const { app, BrowserWindow, clipboard, ipcMain, net, powerMonitor, safeStorage, shell } = require('electron');
const path = require('node:path');
const { AtomicJsonStore } = require('./src/storage/atomic-json-store');
const { AuthService } = require('./src/services/auth-service');
const { VaultService } = require('./src/services/vault-service');
const { GoogleOAuth } = require('./src/google-oauth');
const { resolveGoogleClientId } = require('./src/google-client-config');
const { GoogleAuthSession } = require('./src/services/google-auth-session');
const { GoogleDriveClient } = require('./src/services/google-drive-client');
const { DriveSyncService } = require('./src/services/drive-sync-service');
const { GoogleTokenStore } = require('./src/storage/google-token-store');
const { GoogleClientSecretStore } = require('./src/storage/google-client-secret-store');
const { GoogleUnlockStore } = require('./src/storage/google-unlock-store');

// Keep the desktop build usable on Windows environments where Chromium's GPU process is unavailable.
app.disableHardwareAcceleration();
const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

let authService;
let vaultService;
let googleOAuth;
let googleAuthSession;
let googleTokenStore;
let googleUnlockStore;
let driveSyncService;
let mainWindow;
let mutationQueue = Promise.resolve();
const clipboardTimers = new Set();

function assertTrustedSender(event) {
  if (!mainWindow || mainWindow.isDestroyed() || event.sender !== mainWindow.webContents) {
    throw new Error('Permintaan IPC tidak dipercaya.');
  }
}

function serializeMutation(operation) {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.catch(() => undefined);
  return result;
}

function publicEntry(entry) {
  if (!entry) return entry;
  const { password: _password, history: _history, ...summary } = entry;
  return summary;
}

function publicResult(result) {
  if (!result || typeof result !== 'object') return result;
  return {
    ...result,
    ...(result.item ? { item: publicEntry(result.item) } : {}),
    ...(Array.isArray(result.items) ? { items: result.items.map(publicEntry) } : {}),
  };
}

function scheduleClipboardClear(text) {
  const timer = setTimeout(() => {
    clipboardTimers.delete(timer);
    if (clipboard.readText() === text) clipboard.clear();
  }, 30_000);
  clipboardTimers.add(timer);
}

function clearSensitiveState(reason = 'Vault dikunci.') {
  for (const timer of clipboardTimers) clearTimeout(timer);
  clipboardTimers.clear();
  clipboard.clear();
  authService?.logout();
  googleAuthSession?.clear();
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('session:locked', reason);
}

function registerIpc() {
  const handle = (channel, operation, mutate = false) => {
    ipcMain.handle(channel, (event, ...args) => {
      assertTrustedSender(event);
      const invoke = () => operation(...args);
      return mutate ? serializeMutation(invoke) : invoke();
    });
  };

  const authenticate = async (input, registering) => {
    const result = registering ? await authService.register(input) : await authService.login(input);
    if (!result.ok) return result;
    try {
      await vaultService.configureKey(input.password);
      await vaultService.upgradeKdf(input.password);
      return result;
    } catch (error) {
      authService.logout();
      throw error;
    }
  };

  const authenticateGoogle = async (input) => {
    const pending = googleAuthSession.get(input.challengeId);
    const credentials = { email: pending.profile.email, googleSub: pending.profile.sub, localIdentifier: input.localIdentifier, password: input.password };
    const result = await authService.googleLogin(credentials);
    if (!result.ok) return result;
    googleAuthSession.consume(input.challengeId);
    try {
      await vaultService.configureKey(input.password);
      await vaultService.upgradeKdf(input.password);
      await googleTokenStore.save(pending.profile.email, pending.tokens);
      await googleUnlockStore.save(pending.profile.email, { localIdentifier: result.user.email, password: input.password, googleSub: pending.profile.sub });
      let sync;
      try {
        sync = await driveSyncService.sync({ password: input.password });
      } catch (error) {
        sync = { ok: false, status: 'error', message: error.message };
      }
      return { ...result, sync };
    } catch (error) {
      authService.logout();
      throw error;
    }
  };

  handle('auth:register', (input) => authenticate(input, true), true);
  handle('auth:login', (input) => authenticate(input, false), true);
  handle('auth:google-start', async () => {
    const result = await googleOAuth.start((url) => shell.openExternal(url));
    if (!result.ok) return result;
    const challenge = googleAuthSession.create(result.profile, result.tokens);
    const savedUnlock = await googleUnlockStore.load(result.profile.email);
    if (savedUnlock) {
      const automatic = await authenticateGoogle({ challengeId: challenge.challengeId, ...savedUnlock });
      if (automatic.ok) return { ...automatic, autoCompleted: true };
    }
    return { ok: true, profile: challenge.profile, challengeId: challenge.challengeId, expiresAt: challenge.expiresAt };
  });
  handle('auth:google-complete', (input) => authenticateGoogle(input), true);
  handle('auth:session', async () => {
    const session = authService.session();
    if (session || app.isPackaged || process.env.PASSA_DEV_BYPASS_AUTH !== 'true') return session;
    const email = process.env.PASSA_TEST_USERNAME;
    const password = process.env.PASSA_TEST_PASSWORD;
    if (!email || !password) return null;
    const result = await authenticate({ email, password }, false);
    return result.ok ? result.user : null;
  }, true);
  handle('auth:logout', () => {
    clearSensitiveState('Anda telah keluar.');
    return { ok: true };
  }, true);
  handle('auth:lock', () => {
    clearSensitiveState('Vault otomatis dikunci karena tidak aktif.');
    return { ok: true };
  }, true);
  handle('sync:now', () => driveSyncService.sync(), true);
  handle('sync:disconnect', async () => {
    await googleTokenStore.clear();
    await googleUnlockStore.clear();
    return { ok: true };
  }, true);
  handle('vault:list', async () => (await vaultService.list()).map(publicEntry));
  handle('vault:get', (id) => vaultService.getForEditing(id));
  handle('vault:add', async (input) => publicResult(await vaultService.add(input)), true);
  handle('vault:update', async (input) => publicResult(await vaultService.update(input)), true);
  handle('vault:favorite', async (id) => publicResult(await vaultService.toggleFavorite(id)), true);
  handle('vault:delete', async (id) => publicResult(await vaultService.moveToTrash(id)), true);
  handle('vault:restore', async (id) => publicResult(await vaultService.restore(id)), true);
  handle('vault:purge', (id) => vaultService.purge(id), true);
  handle('vault:bulk-update', async (ids, changes) => publicResult(await vaultService.bulkUpdate(ids, changes)), true);
  handle('vault:bulk-delete', (ids) => vaultService.bulkMoveToTrash(ids), true);
  handle('vault:bulk-restore', (ids) => vaultService.bulkRestore(ids), true);
  handle('vault:bulk-purge', (ids) => vaultService.bulkPurge(ids), true);
  handle('category:list', () => vaultService.listCategories());
  handle('category:icons', () => vaultService.categoryIcons());
  handle('category:create', (input) => vaultService.createCategory(input), true);
  handle('category:update', (input) => vaultService.updateCategory(input), true);
  handle('category:delete', (id) => vaultService.deleteCategory(id), true);
  handle('vault:copy-entry', async (id, field) => {
    const result = await vaultService.useSecret(id, field);
    clipboard.writeText(result.value);
    scheduleClipboardClear(result.value);
    return { ok: true, ...result.usage };
  }, true);
  handle('vault:copy', (value) => {
    authService.context();
    const text = String(value ?? '').slice(0, 1024);
    clipboard.writeText(text);
    scheduleClipboardClear(text);
    return { ok: true };
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 760,
    minWidth: 860,
    minHeight: 620,
    backgroundColor: '#f5f7fb',
    title: 'PassSa',
    icon: path.join(__dirname, 'src', 'assets', 'passsa-mark.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f7f8fa',
      symbolColor: '#536273',
      height: 36,
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow = win;
  win.removeMenu();
  win.webContents.on('will-navigate', (event) => event.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

if (hasSingleInstanceLock) app.whenReady().then(async () => {
  const userData = app.getPath('userData');
  const googleClientId = resolveGoogleClientId();
  const googleClientSecretStore = new GoogleClientSecretStore(path.join(userData, 'google-client-secret.json'), safeStorage);
  const googleClientSecret = await googleClientSecretStore.load(googleClientId);
  const googleFetch = (url, options) => net.fetch(url, options);
  const authStore = new AtomicJsonStore(path.join(userData, 'auth.json'), () => ({ version: 1, users: [] }));
  const vaultStore = new AtomicJsonStore(path.join(userData, 'vault.json'), () => ({ version: 1, vaults: {} }));
  const syncStateStore = new AtomicJsonStore(path.join(userData, 'sync-state.json'), () => ({ version: 1, users: {} }));
  authService = new AuthService(authStore);
  vaultService = new VaultService(vaultStore, authService);
  googleOAuth = new GoogleOAuth({ clientId: googleClientId, clientSecret: googleClientSecret, fetchFn: googleFetch });
  googleAuthSession = new GoogleAuthSession();
  googleTokenStore = new GoogleTokenStore(path.join(userData, 'google-token.json'), safeStorage);
  googleUnlockStore = new GoogleUnlockStore(path.join(userData, 'google-unlock.json'), safeStorage);
  const driveClient = new GoogleDriveClient({ clientId: googleClientId, clientSecret: googleClientSecret, tokenStore: googleTokenStore, fetchFn: googleFetch });
  driveSyncService = new DriveSyncService({ driveClient, vaultService, stateStore: syncStateStore });
  registerIpc();
  powerMonitor.on('lock-screen', () => clearSensitiveState('Vault dikunci karena Windows terkunci.'));
  powerMonitor.on('suspend', () => clearSensitiveState('Vault dikunci karena perangkat masuk mode sleep.'));
  createWindow();
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => clearSensitiveState('Aplikasi ditutup.'));
