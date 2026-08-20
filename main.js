const { app, BrowserWindow, clipboard, dialog, globalShortcut, ipcMain, Menu, nativeImage, net, powerMonitor, safeStorage, screen, shell, Tray } = require('electron');
const { spawn } = require('node:child_process');
const nodeFs = require('node:fs');
const fs = require('node:fs/promises');
const nodeNet = require('node:net');
const nodeCrypto = require('node:crypto');
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
const { WindowsHelloStore } = require('./src/storage/windows-hello-store');
const { findAutofillMatches } = require('./src/services/autofill-matcher');
const {
  MAX_IMPORT_BYTES,
  csvToDocument,
  decryptExport,
  documentToCsv,
  encryptExport,
  mergeDocuments,
} = require('./src/services/vault-transfer-service');

const nativeHostMode = process.argv.some((arg) => arg === '--passsa-native-host' || arg.startsWith('--parent-window='));
// Keep the desktop build usable on Windows environments where Chromium's GPU process is unavailable.
app.disableHardwareAcceleration();
const hasSingleInstanceLock = nativeHostMode ? true : app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

let authService;
let vaultService;
let googleOAuth;
let googleAuthSession;
let googleTokenStore;
let googleUnlockStore;
let windowsHelloStore;
let driveSyncService;
let appSettingsStore;
let mainWindow;
let quickAccessWindow;
let tray;
let autofillServer;
let autofillBridgePath;
let autofillBridgeToken;
let minimizeToTray = false;
let isQuitting = false;
let quickAccessHotkeyRegistered = false;
let quickAccessEnabled = true;
let mutationQueue = Promise.resolve();
const clipboardTimers = new Set();

function nativeHostMetadataCandidates() {
  const appData = process.env.APPDATA || process.env.LOCALAPPDATA || process.cwd();
  const candidates = [path.join(appData, 'PassSa', 'autofill-bridge.json'), path.join(appData, 'passsa', 'autofill-bridge.json')];
  try {
    for (const entry of require('node:fs').readdirSync(appData, { withFileTypes: true })) {
      if (entry.isDirectory() && /passsa|password saved/i.test(entry.name)) candidates.push(path.join(appData, entry.name, 'autofill-bridge.json'));
    }
  } catch { /* app data unavailable */ }
  return [...new Set(candidates)];
}

function runNativeHostMode() {
  const readMetadata = () => {
    for (const file of nativeHostMetadataCandidates()) {
      try {
        const metadata = JSON.parse(require('node:fs').readFileSync(file, 'utf8'));
        if ((metadata?.port || metadata?.pipe) && metadata?.token) return metadata;
      } catch { /* try next candidate */ }
    }
    return null;
  };
  const requestBridge = (message) => new Promise((resolve) => {
    const metadata = readMetadata();
    if (!metadata) return resolve({ ok: false, code: 'APP_NOT_RUNNING', message: 'PassSa belum berjalan.' });
    const socket = metadata.port
      ? nodeNet.createConnection({ host: metadata.host || '127.0.0.1', port: metadata.port })
      : nodeNet.createConnection(metadata.pipe);
    let buffer = '';
    let settled = false;
    const finish = (result) => { if (settled) return; settled = true; socket.destroy(); resolve(result); };
    socket.setEncoding('utf8');
    socket.setTimeout(5000, () => finish({ ok: false, code: 'TIMEOUT', message: 'PassSa tidak merespons.' }));
    socket.on('error', () => finish({ ok: false, code: 'APP_NOT_RUNNING', message: 'PassSa belum berjalan.' }));
    socket.on('data', (chunk) => { buffer += chunk; const index = buffer.indexOf('\n'); if (index >= 0) { try { finish(JSON.parse(buffer.slice(0, index))); } catch { finish({ ok: false, code: 'INVALID_RESPONSE', message: 'Respons tidak valid.' }); } } });
    socket.on('connect', () => socket.write(`${JSON.stringify({ ...message, token: metadata.token })}\n`));
  });
  let input = Buffer.alloc(0);
  let queue = Promise.resolve();
  const send = (message) => { const body = Buffer.from(JSON.stringify(message)); const header = Buffer.alloc(4); header.writeUInt32LE(body.length, 0); process.stdout.write(Buffer.concat([header, body])); };
  process.stdin.on('data', (chunk) => {
    input = Buffer.concat([input, chunk]);
    while (input.length >= 4) {
      const size = input.readUInt32LE(0);
      if (size > 1024 * 1024) { send({ ok: false, code: 'MESSAGE_TOO_LARGE', message: 'Pesan terlalu besar.' }); process.exit(1); }
      if (input.length < size + 4) break;
      const body = input.subarray(4, size + 4); input = input.subarray(size + 4);
      queue = queue.then(async () => { try { send(await requestBridge(JSON.parse(body.toString('utf8')))); } catch (error) { send({ ok: false, code: 'INVALID_REQUEST', message: error.message }); } });
    }
  });
  process.stdin.on('end', () => queue.finally(() => process.exit(0)));
}

if (nativeHostMode) runNativeHostMode();

function assertTrustedSender(event, sourceWindow = mainWindow) {
  if (!sourceWindow || sourceWindow.isDestroyed() || event.sender !== sourceWindow.webContents) {
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
  if (Array.isArray(summary.fields)) {
    summary.fields = summary.fields.map(({ id, label, type, required }) => ({ id, label, type, required: Boolean(required) }));
  }
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

function windowsHelloHelperPath() {
  const candidates = [
    path.join(process.resourcesPath || '', 'app.asar.unpacked', 'scripts', 'windows-hello-helper.exe'),
    path.join(__dirname, 'scripts', 'windows-hello-helper.exe'),
  ];
  return candidates.find((candidate) => candidate && nodeFs.existsSync(candidate)) || null;
}

function windowsHandleArgument() {
  if (!mainWindow || mainWindow.isDestroyed()) throw new Error('Jendela PassSa belum siap.');
  const handle = mainWindow.getNativeWindowHandle();
  if (!handle?.length) throw new Error('Handle jendela Windows tidak tersedia.');
  const value = handle.length >= 8 ? handle.readBigUInt64LE(0) : BigInt(handle.readUInt32LE(0));
  return value.toString(16);
}

function verifyWindowsHelloDevice() {
  if (process.platform !== 'win32') return Promise.resolve({ ok: false, code: 'UNSUPPORTED', message: 'Windows Hello hanya tersedia di Windows.' });
  const helper = windowsHelloHelperPath();
  if (!helper) return Promise.resolve({ ok: false, code: 'HELPER_MISSING', message: 'Komponen Windows Hello belum terpasang.' });
  let hwnd;
  try { hwnd = windowsHandleArgument(); } catch (error) { return Promise.resolve({ ok: false, code: 'WINDOW_UNAVAILABLE', message: error.message }); }
  return new Promise((resolve) => {
    const child = spawn(helper, ['--verify', hwnd], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    let errorOutput = '';
    let settled = false;
    const finish = (result) => { if (settled) return; settled = true; resolve(result); };
    const timer = setTimeout(() => { child.kill(); finish({ ok: false, code: 'TIMEOUT', message: 'Verifikasi Windows Hello timeout.' }); }, 30_000);
    child.stdout.on('data', (chunk) => { output += chunk.toString('utf8'); });
    child.stderr.on('data', (chunk) => { errorOutput += chunk.toString('utf8'); });
    child.on('error', (error) => { clearTimeout(timer); finish({ ok: false, code: 'HELPER_ERROR', message: error.message }); });
    child.on('close', (code) => {
      clearTimeout(timer);
      const status = output.trim().split(/\s+/).at(-1) || '';
      if (status === 'VERIFIED' && code === 0) return finish({ ok: true });
      const messages = {
        DEVICE_NOT_PRESENT: 'Perangkat Windows Hello tidak ditemukan.',
        NOT_CONFIGURED: 'Windows Hello belum dikonfigurasi untuk akun Windows ini.',
        DISABLED_BY_POLICY: 'Windows Hello dinonaktifkan oleh kebijakan perangkat.',
        RETRIES_EXHAUSTED: 'Percobaan Windows Hello terlalu banyak. Coba lagi nanti.',
        CANCELED: 'Verifikasi Windows Hello dibatalkan.',
        DEVICE_BUSY: 'Perangkat Windows Hello sedang digunakan.',
      };
      finish({ ok: false, code: status || 'UNAVAILABLE', message: messages[status] || errorOutput.trim() || 'Windows Hello tidak tersedia.' });
    });
  });
}

function scheduleClipboardClear(text) {
  const timer = setTimeout(() => {
    clipboardTimers.delete(timer);
    if (clipboard.readText() === text) clipboard.clear();
  }, 30_000);
  clipboardTimers.add(timer);
}

function transferDate() {
  return new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
}

async function chooseTransferPath(format) {
  const extension = format === 'csv' ? 'csv' : 'passsa';
  const result = await dialog.showSaveDialog(mainWindow, {
    title: format === 'csv' ? 'Export CSV PassSa' : 'Export backup terenkripsi PassSa',
    defaultPath: path.join(app.getPath('downloads'), `PassSa-vault-${transferDate()}.${extension}`),
    filters: format === 'csv'
      ? [{ name: 'CSV', extensions: ['csv'] }]
      : [{ name: 'PassSa Encrypted Backup', extensions: ['passsa'] }],
    properties: ['createDirectory'],
  });
  return result.canceled ? null : result.filePath;
}

async function writeTransferFile(filePath, content) {
  try {
    await fs.access(filePath);
    const confirmation = await dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'File sudah ada',
      message: 'File tujuan sudah ada. Ganti file tersebut?',
      detail: 'File lama akan ditimpa setelah Anda mengonfirmasi.',
      buttons: ['Ganti File', 'Batal'],
      defaultId: 1,
      cancelId: 1,
      noLink: true,
    });
    if (confirmation.response !== 0) return false;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await fs.writeFile(filePath, content, { encoding: 'utf8', mode: 0o600 });
  return true;
}

function clearSensitiveState(reason = 'Vault dikunci.') {
  for (const timer of clipboardTimers) clearTimeout(timer);
  clipboardTimers.clear();
  clipboard.clear();
  quickAccessWindow?.hide();
  authService?.logout();
  googleAuthSession?.clear();
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('session:locked', reason);
}

function publicQuickAccessEntry(entry) {
  return {
    id: entry.id,
    type: entry.type,
    title: entry.title,
    username: entry.username || '',
    url: entry.url || '',
    group: entry.group || '',
    tags: Array.isArray(entry.tags) ? entry.tags.slice(0, 20) : [],
    favorite: Boolean(entry.favorite),
    quickPinned: Boolean(entry.quickPinned),
    usageCount: entry.usageCount ?? 0,
    lastUsedAt: entry.lastUsedAt ?? null,
    recentUseHistory: Array.isArray(entry.recentUseHistory) ? entry.recentUseHistory.slice(-12) : [],
  };
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function positionQuickAccessWindow() {
  if (!quickAccessWindow || quickAccessWindow.isDestroyed()) return;
  const point = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(point);
  const workArea = display.workArea;
  const [width, height] = quickAccessWindow.getSize();
  const gap = 12;
  const x = Math.min(Math.max(point.x + gap, workArea.x + 8), workArea.x + workArea.width - width - 8);
  const y = Math.min(Math.max(point.y + gap, workArea.y + 8), workArea.y + workArea.height - height - 8);
  quickAccessWindow.setPosition(Math.round(x), Math.round(y), false);
}

function createQuickAccessWindow() {
  if (quickAccessWindow && !quickAccessWindow.isDestroyed()) return quickAccessWindow;
  quickAccessWindow = new BrowserWindow({
    width: 420,
    height: 560,
    minWidth: 360,
    maxWidth: 520,
    minHeight: 300,
    maxHeight: 720,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    title: 'PassSa Quick Access',
    icon: path.join(__dirname, 'src', 'assets', 'passsa-mark.png'),
    webPreferences: {
      preload: path.join(__dirname, 'quick-access-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  quickAccessWindow.setAlwaysOnTop(true, 'floating');
  quickAccessWindow.loadFile(path.join(__dirname, 'src', 'quick-access.html'));
  quickAccessWindow.on('blur', () => quickAccessWindow?.hide());
  quickAccessWindow.on('closed', () => { quickAccessWindow = null; });
  return quickAccessWindow;
}

function toggleQuickAccess() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (!quickAccessEnabled) return;
  const window = createQuickAccessWindow();
  if (window.isVisible()) {
    window.hide();
    return;
  }
  positionQuickAccessWindow();
  window.show();
  window.focus();
  window.webContents.send('quick-access:refresh');
}

function setQuickAccessHotkey(enabled) {
  quickAccessEnabled = enabled === true;
  globalShortcut.unregister('Alt+Shift+P');
  quickAccessHotkeyRegistered = quickAccessEnabled && globalShortcut.register('Alt+Shift+P', toggleQuickAccess);
  if (quickAccessEnabled && !quickAccessHotkeyRegistered) console.warn('Quick Access shortcut Alt+Shift+P tidak dapat didaftarkan; fallback jendela aktif digunakan.');
  if (!quickAccessEnabled) quickAccessWindow?.hide();
  return quickAccessHotkeyRegistered;
}

function publicAutofillEntry(entry) {
  return {
    id: entry.id,
    title: entry.title,
    username: entry.username || '',
    url: entry.url || '',
    group: entry.group || '',
    favorite: Boolean(entry.favorite),
  };
}

async function autofillBridgeRequest(request) {
  if (!request || request.token !== autofillBridgeToken) return { ok: false, code: 'UNAUTHORIZED', message: 'Bridge autofill tidak terautorisasi.' };
  const origin = String(request.url || '').slice(0, 2048);
  if (request.action === 'status') return { ok: true, unlocked: true };
  if (request.action === 'open') { showMainWindow(); return { ok: true }; }
  if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Buka PassSa dan unlock vault terlebih dahulu.' };
  const entries = await vaultService.list();
  if (request.action === 'list') {
    const matches = findAutofillMatches(entries, origin).map(publicAutofillEntry);
    return { ok: true, matches };
  }
  if (request.action === 'get') {
    const entry = findAutofillMatches(entries, origin).find((candidate) => candidate.id === request.id);
    if (!entry) return { ok: false, code: 'NO_MATCH', message: 'Credential tidak cocok dengan domain aktif.' };
    const editable = await vaultService.getForEditing(entry.id);
    return {
      ok: true,
      credential: {
        id: editable.id,
        title: editable.title,
        username: editable.username || '',
        password: editable.password || '',
        fields: (editable.fields ?? []).map((field) => ({ label: field.label, type: field.type, value: field.value })),
      },
    };
  }
  return { ok: false, code: 'INVALID_ACTION', message: 'Aksi autofill tidak dikenal.' };
}

function startAutofillBridge() {
  autofillBridgeToken = nodeCrypto.randomBytes(32).toString('base64url');
  autofillBridgePath = path.join(app.getPath('userData'), 'autofill-bridge.json');
  autofillServer = nodeNet.createServer((socket) => {
    let buffer = '';
    socket.setEncoding('utf8');
    socket.on('data', (chunk) => {
      buffer += chunk;
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        Promise.resolve()
          .then(() => autofillBridgeRequest(JSON.parse(line)))
          .catch((error) => ({ ok: false, code: 'ERROR', message: error.message || 'Autofill gagal.' }))
          .then((result) => socket.write(`${JSON.stringify(result)}\n`));
      }
    });
  });
  autofillServer.on('error', (error) => { console.error('Autofill bridge error:', error.message); });
  return new Promise((resolve, reject) => {
    autofillServer.once('listening', () => {
      const address = autofillServer.address();
      fs.writeFile(autofillBridgePath, `${JSON.stringify({ version: 1, host: '127.0.0.1', port: address.port, token: autofillBridgeToken, pid: process.pid })}\n`, { encoding: 'utf8', mode: 0o600 }).then(resolve, reject);
    });
    autofillServer.listen(0, '127.0.0.1');
  });
}

async function stopAutofillBridge() {
  if (autofillServer) {
    await new Promise((resolve) => autofillServer.close(() => resolve()));
    autofillServer = null;
  }
  if (autofillBridgePath) await fs.rm(autofillBridgePath, { force: true }).catch(() => undefined);
  autofillBridgeToken = null;
}

function refreshTrayMenu() {
  if (!tray) return;
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Buka PassSa', click: showMainWindow },
    { label: 'Sembunyikan ke Tray', click: () => mainWindow?.hide() },
    { type: 'separator' },
    { label: 'Kunci Vault', click: () => { clearSensitiveState('Vault dikunci dari system tray.'); mainWindow?.hide(); } },
    { type: 'separator' },
    { label: 'Keluar PassSa', click: () => { isQuitting = true; app.quit(); } },
  ]));
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, 'src', 'assets', 'passsa-mark.png'));
  tray = new Tray(icon);
  tray.setToolTip('PassSa');
  refreshTrayMenu();
  tray.on('click', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isVisible()) mainWindow.hide();
    else showMainWindow();
  });
}

function registerIpc() {
  const handle = (channel, operation, mutate = false) => {
    ipcMain.handle(channel, (event, ...args) => {
      assertTrustedSender(event);
      const invoke = () => operation(...args);
      return mutate ? serializeMutation(invoke) : invoke();
    });
  };
  const quickHandle = (channel, operation, mutate = false) => {
    ipcMain.handle(channel, (event, ...args) => {
      assertTrustedSender(event, quickAccessWindow);
      const invoke = () => operation(...args);
      return mutate ? serializeMutation(invoke) : invoke();
    });
  };
  ipcMain.on('quick-access:close', (event) => {
    assertTrustedSender(event, quickAccessWindow);
    quickAccessWindow?.hide();
  });

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

  const authenticateGoogleForSession = async (input) => {
    const pending = googleAuthSession.get(input.challengeId);
    const result = await authService.linkGoogleToSession({ email: pending.profile.email, googleSub: pending.profile.sub });
    if (!result.ok) return result;
    googleAuthSession.consume(input.challengeId);
    await googleTokenStore.save(pending.profile.email, pending.tokens);
    let sync;
    try {
      sync = await driveSyncService.sync();
    } catch (error) {
      sync = { ok: false, status: 'error', message: error.message };
    }
    return { ...result, sync, autoCompleted: true };
  };

  handle('auth:register', (input) => authenticate(input, true), true);
  handle('auth:login', (input) => authenticate(input, false), true);
  handle('auth:google-start', async () => {
    const result = await googleOAuth.start((url) => shell.openExternal(url));
    if (!result.ok) return result;
    const challenge = googleAuthSession.create(result.profile, result.tokens);
    if (authService.session()) {
      const automatic = await authenticateGoogleForSession({ challengeId: challenge.challengeId });
      if (automatic.ok) return automatic;
      return automatic;
    }
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
  handle('auth:hello-status', async (input = {}) => {
    const requestedEmail = String(input.email || '').trim().toLowerCase();
    const session = authService.session();
    const email = requestedEmail || session?.email;
    if (!email) return { ok: true, supported: process.platform === 'win32', enabled: false };
    const auth = await authService.store.read();
    const user = auth.users.find((candidate) => candidate.email === email);
    const record = user ? await windowsHelloStore.get(user.id) : null;
    return { ok: true, supported: process.platform === 'win32', enabled: Boolean(record), email };
  });
  handle('auth:hello-enable', async (input = {}) => {
    const context = authService.context();
    if (!(await authService.verifyCurrentPassword(input.currentPassword))) {
      return { ok: false, message: 'Password vault saat ini salah.' };
    }
    const verification = await verifyWindowsHelloDevice();
    if (!verification.ok) return verification;
    await windowsHelloStore.save(context.user, context.key, authService.vaultKdf());
    return { ok: true, enabled: true, message: 'Windows Hello berhasil diaktifkan untuk perangkat ini.' };
  }, true);
  handle('auth:hello-disable', async () => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    await windowsHelloStore.clear(session.id);
    return { ok: true, enabled: false, message: 'Unlock Windows Hello dinonaktifkan.' };
  }, true);
  handle('auth:hello-unlock', async (input = {}) => {
    const email = String(input.email || '').trim().toLowerCase();
    if (!email) return { ok: false, message: 'Masukkan email atau username terlebih dahulu.' };
    const auth = await authService.store.read();
    const user = auth.users.find((candidate) => candidate.email === email);
    const record = user ? await windowsHelloStore.get(user.id) : null;
    if (!user || !record) return { ok: false, code: 'NOT_CONFIGURED', message: 'Windows Hello belum diaktifkan untuk akun ini.' };
    const verification = await verifyWindowsHelloDevice();
    if (!verification.ok) return verification;
    let key;
    try {
      key = windowsHelloStore.decrypt(record);
      authService.openSessionWithKey(user, key, record.kdf);
      await vaultService.document();
      return { ok: true, user: authService.session() };
    } catch (error) {
      authService.logout();
      return { ok: false, message: 'Vault tidak dapat dibuka dengan kunci Windows Hello.' };
    } finally {
      key?.fill(0);
    }
  }, true);
  handle('auth:change-password', async (input) => {
    const result = await authService.changePassword(input, (nextKey, kdf) => vaultService.rekey(nextKey, kdf));
    if (!result.ok) return result;
    const helloRecord = await windowsHelloStore.get(result.user.id);
    if (helloRecord) {
      try {
        const context = authService.context();
        await windowsHelloStore.save(context.user, context.key, authService.vaultKdf());
      } catch {
        // Password change remains successful; user can re-enable Windows Hello from Settings.
      }
    }
    const session = authService.session();
    let sync;
    if (session?.googleEmail) {
      try {
        await googleUnlockStore.save(session.googleEmail, {
          localIdentifier: session.email,
          password: input.newPassword,
          googleSub: authService.currentUserRecord?.googleSub,
        });
      } catch {
        sync = {
          ok: false,
          status: 'warning',
          message: 'Password berubah, tetapi auto-login Google perlu dihubungkan ulang dari Pengaturan.',
        };
      }
      if (!sync) {
        try {
          sync = await driveSyncService.sync({ password: input.newPassword });
        } catch (error) {
          sync = { ok: false, status: 'error', message: error.message };
        }
      }
    }
    return { ...result, sync };
  }, true);
  handle('vault:export', async (input = {}) => {
    const format = input.format === 'csv' ? 'csv' : 'passsa';
    if (format === 'csv' && input.allowPlaintext !== true) {
      return { ok: false, message: 'Konfirmasi export CSV plaintext terlebih dahulu.' };
    }
    const filePath = await chooseTransferPath(format);
    if (!filePath) return { ok: false, canceled: true };
    try {
      const document = await vaultService.document();
      const content = format === 'csv'
        ? documentToCsv(document)
        : `${JSON.stringify(await encryptExport(document, input.password), null, 2)}\n`;
      const written = await writeTransferFile(filePath, content);
      if (!written) return { ok: false, canceled: true };
      return {
        ok: true,
        format,
        filePath,
        itemCount: document.items.filter((item) => !item.deletedAt).length,
        message: format === 'csv'
          ? 'CSV berhasil diekspor. File ini berisi password dalam bentuk plaintext.'
          : 'Backup terenkripsi berhasil diekspor.',
      };
    } catch (error) {
      return { ok: false, message: error.message || 'Export vault gagal.' };
    }
  }, true);
  handle('vault:import', async (input = {}) => {
    const openResult = await dialog.showOpenDialog(mainWindow, {
      title: 'Import data ke PassSa',
      properties: ['openFile'],
      filters: [
        { name: 'PassSa Backup atau CSV', extensions: ['passsa', 'csv'] },
        { name: 'Semua file', extensions: ['*'] },
      ],
    });
    if (openResult.canceled || !openResult.filePaths[0]) return { ok: false, canceled: true };
    const filePath = openResult.filePaths[0];
    const extension = path.extname(filePath).toLowerCase();
    const format = input.format === 'csv' || extension === '.csv' ? 'csv' : 'passsa';
    if (format === 'csv' && input.allowPlaintext !== true) {
      return { ok: false, message: 'Konfirmasi import CSV plaintext terlebih dahulu.' };
    }
    try {
      const stat = await fs.stat(filePath);
      if (stat.size > MAX_IMPORT_BYTES) throw new Error('File import terlalu besar (maksimal 25 MB).');
      const text = (await fs.readFile(filePath)).toString('utf8');
      const imported = format === 'csv'
        ? csvToDocument(text)
        : await decryptExport(JSON.parse(text), input.password);
      const current = await vaultService.document();
      if (format === 'csv' && input.mode === 'replace') imported.categories = current.categories;
      const mode = input.mode === 'replace' ? 'replace' : 'merge';
      const merged = mergeDocuments(current, imported, mode);
      const confirmation = await dialog.showMessageBox(mainWindow, {
        type: mode === 'replace' ? 'warning' : 'question',
        title: mode === 'replace' ? 'Ganti isi vault?' : 'Konfirmasi import',
        message: mode === 'replace' ? 'Import ini akan mengganti item aktif di vault.' : 'Import data ke vault PassSa?',
        detail: mode === 'replace'
          ? `${imported.items.length} item akan dimasukkan dan item aktif lama akan diganti.`
          : `${imported.items.length} item ditemukan. ${merged.added} item baru akan ditambahkan${merged.skipped ? `, ${merged.skipped} duplikat dilewati` : ''}.`,
        buttons: ['Import Data', 'Batal'],
        defaultId: 0,
        cancelId: 1,
        noLink: true,
      });
      if (confirmation.response !== 0) return { ok: false, canceled: true };
      await vaultService.writeDocument(merged.document);
      let sync;
      if (authService.session()?.googleEmail) {
        try {
          sync = await driveSyncService.sync();
        } catch (error) {
          sync = { ok: false, status: 'error', message: error.message };
        }
      }
      return {
        ok: true,
        format,
        mode,
        itemCount: imported.items.length,
        added: merged.added,
        skipped: merged.skipped,
        sync,
        message: mode === 'replace'
          ? `Import selesai. ${imported.items.length} item dimasukkan ke vault.`
          : `Import selesai. ${merged.added} item baru ditambahkan${merged.skipped ? `, ${merged.skipped} duplikat dilewati` : ''}.`,
      };
    } catch (error) {
      return { ok: false, message: error.message || 'Import vault gagal.' };
    }
  }, true);
  handle('window:set-mode', (mode) => {
    const nextMode = mode === 'vault' ? 'vault' : 'auth';
    const bounds = mainWindow.getBounds();
    const width = nextMode === 'vault' ? 1120 : 520;
    const minWidth = nextMode === 'vault' ? 860 : 480;
    mainWindow.setMinimumSize(minWidth, 620);
    mainWindow.setSize(width, Math.max(bounds.height, 620), true);
    return { ok: true, mode: nextMode, width };
  });
  handle('settings:get-app', async () => {
    const settings = await appSettingsStore.read();
    let startWithWindows = false;
    try { startWithWindows = Boolean(app.getLoginItemSettings().openAtLogin); } catch { /* unsupported platform */ }
    return {
      startWithWindows,
      minimizeToTray: Boolean(settings.minimizeToTray),
      quickAccessEnabled: settings.quickAccessEnabled !== false,
    };
  });
  handle('settings:set-app', async (input = {}) => {
    const startWithWindows = input.startWithWindows === true;
    const nextMinimizeToTray = input.minimizeToTray === true;
    const nextQuickAccessEnabled = input.quickAccessEnabled !== false;
    await appSettingsStore.update((settings) => ({
      ...settings,
      version: 1,
      minimizeToTray: nextMinimizeToTray,
      quickAccessEnabled: nextQuickAccessEnabled,
      updatedAt: new Date().toISOString(),
    }));
    try {
      const loginItemSettings = { openAtLogin: startWithWindows, openAsHidden: nextMinimizeToTray };
      // Electron's default app needs the executable and app path explicitly for development startup.
      if (process.defaultApp) {
        loginItemSettings.path = process.execPath;
        loginItemSettings.args = [path.resolve(process.argv[1])];
      }
      app.setLoginItemSettings(loginItemSettings);
    } catch { /* startup settings are unavailable on unsupported platforms */ }
    minimizeToTray = nextMinimizeToTray;
    setQuickAccessHotkey(nextQuickAccessEnabled);
    refreshTrayMenu();
    return { ok: true, startWithWindows, minimizeToTray: nextMinimizeToTray, quickAccessEnabled: nextQuickAccessEnabled };
  }, true);
  handle('sync:now', () => driveSyncService.sync(), true);
  handle('sync:disconnect', async () => {
    const session = authService.session();
    const googleAccount = session?.googleEmail || session?.email;
    try {
      await driveClient.revoke(googleAccount);
    } catch {
      // Local logout must still complete if the revoke endpoint is offline.
    }
    await googleTokenStore.clear();
    await googleUnlockStore.clear();
    return authService.disconnectGoogle();
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
  quickHandle('quick-access:list', async () => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Buka PassSa untuk membuka Quick Access.' };
    const entries = await vaultService.list();
    return { ok: true, items: entries.filter((entry) => !entry.deletedAt).map(publicQuickAccessEntry) };
  });
  quickHandle('quick-access:toggle-pin', async (id) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    const result = await vaultService.toggleQuickPinned(String(id || ''));
    return { ...result, item: publicQuickAccessEntry(result.item) };
  }, true);
  quickHandle('quick-access:copy', async ({ id, field } = {}) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    const allowedFields = new Set(['url', 'username', 'password']);
    if (!allowedFields.has(field)) return { ok: false, message: 'Aksi copy tidak valid.' };
    const result = await vaultService.useSecret(String(id || ''), field);
    if (!result.value) return { ok: false, message: field === 'url' ? 'Item ini belum memiliki alamat situs.' : 'Field credential ini masih kosong.' };
    clipboard.writeText(result.value);
    scheduleClipboardClear(result.value);
    return { ok: true, field, usage: result.usage, message: `${field === 'url' ? 'Alamat situs' : field === 'username' ? 'Username' : 'Password'} disalin. Clipboard dibersihkan dalam 30 detik.` };
  }, true);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 520,
    height: 760,
    minWidth: 480,
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
  win.webContents.on('before-input-event', (event, input) => {
    const modifiers = Array.isArray(input.modifiers) ? input.modifiers : [];
    if (quickAccessEnabled
      && !quickAccessHotkeyRegistered
      && input.type === 'keyDown'
      && String(input.key || '').toLowerCase() === 'p'
      && modifiers.includes('alt')
      && modifiers.includes('shift')) {
      event.preventDefault();
      toggleQuickAccess();
    }
  });
  win.webContents.on('will-navigate', (event) => event.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  win.on('minimize', (event) => {
    if (!minimizeToTray || isQuitting) return;
    event.preventDefault();
    win.hide();
  });
  win.on('close', (event) => {
    if (!minimizeToTray || isQuitting) return;
    event.preventDefault();
    win.hide();
  });
  win.on('closed', () => {
    if (mainWindow === win) mainWindow = null;
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

if (hasSingleInstanceLock && !nativeHostMode) app.whenReady().then(async () => {
  const userData = app.getPath('userData');
  const googleClientId = resolveGoogleClientId();
  const googleClientSecretStore = new GoogleClientSecretStore(path.join(userData, 'google-client-secret.json'), safeStorage);
  const googleClientSecret = await googleClientSecretStore.load(googleClientId);
  const googleFetch = (url, options) => net.fetch(url, options);
  const authStore = new AtomicJsonStore(path.join(userData, 'auth.json'), () => ({ version: 1, users: [] }));
  const vaultStore = new AtomicJsonStore(path.join(userData, 'vault.json'), () => ({ version: 1, vaults: {} }));
  const syncStateStore = new AtomicJsonStore(path.join(userData, 'sync-state.json'), () => ({ version: 1, users: {} }));
  appSettingsStore = new AtomicJsonStore(path.join(userData, 'app-settings.json'), () => ({ version: 1, minimizeToTray: false, quickAccessEnabled: true }));
  const appSettings = await appSettingsStore.read();
  minimizeToTray = Boolean(appSettings.minimizeToTray);
  quickAccessEnabled = appSettings.quickAccessEnabled !== false;
  authService = new AuthService(authStore);
  vaultService = new VaultService(vaultStore, authService);
  googleOAuth = new GoogleOAuth({ clientId: googleClientId, clientSecret: googleClientSecret, fetchFn: googleFetch });
  googleAuthSession = new GoogleAuthSession();
  googleTokenStore = new GoogleTokenStore(path.join(userData, 'google-token.json'), safeStorage);
  googleUnlockStore = new GoogleUnlockStore(path.join(userData, 'google-unlock.json'), safeStorage);
  windowsHelloStore = new WindowsHelloStore(path.join(userData, 'windows-hello.json'), safeStorage, fs);
  const driveClient = new GoogleDriveClient({ clientId: googleClientId, clientSecret: googleClientSecret, tokenStore: googleTokenStore, fetchFn: googleFetch });
  driveSyncService = new DriveSyncService({ driveClient, vaultService, stateStore: syncStateStore });
  registerIpc();
  await startAutofillBridge();
  powerMonitor.on('lock-screen', () => clearSensitiveState('Vault dikunci karena Windows terkunci.'));
  powerMonitor.on('suspend', () => clearSensitiveState('Vault dikunci karena perangkat masuk mode sleep.'));
  createWindow();
  createTray();
  setQuickAccessHotkey(quickAccessEnabled);
  try {
    if (minimizeToTray && app.getLoginItemSettings().wasOpenedAtLogin) mainWindow.hide();
  } catch { /* startup metadata is unavailable in development */ }
  app.on('second-instance', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    showMainWindow();
  });
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (nativeHostMode) return;
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => { isQuitting = true; clearSensitiveState('Aplikasi ditutup.'); quickAccessWindow?.destroy(); globalShortcut.unregisterAll(); tray?.destroy(); stopAutofillBridge(); });
