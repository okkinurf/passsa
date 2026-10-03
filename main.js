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
const { resolveLoginMethod } = require('./src/services/login-security');
const devSkipLoginMode = !app.isPackaged && process.argv.includes('--passsa-dev-skip-login');
const { createDummyVaultData, DUMMY_SOURCE } = devSkipLoginMode
  ? require('./src/dev/dummy-vault-data')
  : {};
const { GoogleOAuth } = require('./src/google-oauth');
const { resolveGoogleClientId } = require('./src/google-client-config');
const { GoogleAuthSession } = require('./src/services/google-auth-session');
const { GoogleDriveClient } = require('./src/services/google-drive-client');
const { DriveSyncService } = require('./src/services/drive-sync-service');
const { S3SyncService } = require('./src/services/s3-sync-service');
const { GoogleTokenStore } = require('./src/storage/google-token-store');
const { GoogleClientSecretStore } = require('./src/storage/google-client-secret-store');
const { GoogleUnlockStore } = require('./src/storage/google-unlock-store');
const { S3CredentialStore } = require('./src/storage/s3-credential-store');
const { WindowsHelloStore } = require('./src/storage/windows-hello-store');
const { DirectLoginStore } = require('./src/storage/direct-login-store');
const { TotpStore, hashRecoveryCode } = require('./src/storage/totp-store');
const { buildOtpAuthUri, generateSecret, normalizeSecret, verifyTotp } = require('./src/totp');
const { findAutofillMatches } = require('./src/services/autofill-matcher');
const { assertTrustedSender, createMutationSerializer } = require('./src/main/ipc-helpers');
const {
  MAX_IMPORT_BYTES,
  csvToDocument,
  decryptExport,
  documentToCsv,
  encryptExport,
  mergeDocuments,
} = require('./src/services/vault-transfer-service');

const nativeHostMode = process.argv.some((arg) => arg === '--passsa-native-host' || arg.startsWith('--parent-window='));
// Development-only launch modes use isolated profiles and never affect the
// packaged app's profile or login behavior.
const previewMode = process.argv.includes('--passsa-preview');
if (previewMode || devSkipLoginMode) {
  const profileLabel = devSkipLoginMode ? 'Dev' : 'Preview';
  app.setName(`PassSa ${profileLabel} ${process.pid}`);
  app.setAppUserModelId(`id.passsa.${profileLabel.toLowerCase()}.${process.pid}`);
  app.setPath('userData', path.join(app.getPath('temp'), `PassSa-${profileLabel}-${process.pid}`));
}
// Keep the desktop build usable on Windows environments where Chromium's GPU process is unavailable.
if (!app.isPackaged || previewMode) {
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-gpu-compositing');
  app.commandLine.appendSwitch('no-sandbox');
}
app.disableHardwareAcceleration();
const hasSingleInstanceLock = nativeHostMode || previewMode || devSkipLoginMode ? true : app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) app.quit();

let authService;
let vaultService;
let googleOAuth;
let googleAuthSession;
let googleTokenStore;
let googleUnlockStore;
let windowsHelloStore;
let directLoginStore;
let totpStore;
let driveSyncService;
let s3SyncService;
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
let devBypassCredentials = null;
const QUICK_ACCESS_SHORTCUT = 'Alt+Shift+P';
let activeTheme = 'light';
let activePalette = 'rose';
const THEME_PALETTES = new Set(['rose', 'ocean', 'forest', 'violet', 'sunset', 'amber', 'teal', 'indigo', 'coral', 'slate']);
const serializeMutation = createMutationSerializer();
const clipboardTimers = new Set();
const twoFactorChallenges = new Map();
const TWO_FACTOR_CHALLENGE_TTL_MS = 5 * 60 * 1000;

function removeTwoFactorChallenge(challengeId) {
  const challenge = twoFactorChallenges.get(challengeId);
  if (!challenge) return;
  challenge.key?.fill(0);
  challenge.key = null;
  challenge.password = null;
  challenge.secret = null;
  challenge.recoveryCodes = null;
  twoFactorChallenges.delete(challengeId);
}

function clearTwoFactorChallenges() {
  for (const challengeId of twoFactorChallenges.keys()) removeTwoFactorChallenge(challengeId);
}

function createTwoFactorChallenge(payload) {
  const challengeId = nodeCrypto.randomUUID();
  twoFactorChallenges.set(challengeId, {
    ...payload,
    challengeId,
    createdAt: Date.now(),
    expiresAt: Date.now() + TWO_FACTOR_CHALLENGE_TTL_MS,
    attempts: 0,
  });
  return challengeId;
}

function getTwoFactorChallenge(challengeId) {
  const challenge = twoFactorChallenges.get(String(challengeId || ''));
  if (!challenge) return null;
  if (challenge.expiresAt <= Date.now()) {
    removeTwoFactorChallenge(challenge.challengeId);
    return null;
  }
  return challenge;
}

function generateRecoveryCodes(count = 10) {
  return Array.from({ length: count }, () => {
    const raw = nodeCrypto.randomBytes(10).toString('hex').toUpperCase();
    return `${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15)}`;
  });
}

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

function publicEntry(entry) {
  if (!entry) return entry;
  const { password: _password, history: _history, noteHistory: _noteHistory, totp: rawTotp, ...summary } = entry;
  if (Array.isArray(summary.fields)) {
    summary.fields = summary.fields.map(({ id, label, type, required }) => ({ id, label, type, required: Boolean(required) }));
  }
  if (rawTotp) {
    const { secret: _secret, ...totp } = rawTotp;
    summary.totp = totp;
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
  vaultService?.clearCache();
  clearTwoFactorChallenges();
  authService?.logout();
  googleAuthSession?.clear();
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('session:locked', reason);
}

async function unlockWithDirectLogin() {
  const record = await directLoginStore.getActive();
  if (!record) return { ok: false, code: 'NOT_CONFIGURED', message: 'Login langsung belum diaktifkan di perangkat ini.' };
  let key;
  try {
    const user = await authService.findUserById(record.userId);
    if (!user) {
      await directLoginStore.clear(record.userId);
      return { ok: false, code: 'NOT_CONFIGURED', message: 'Akun login langsung tidak ditemukan. Masuk dengan username dan password.' };
    }
    if (await totpStore.get(user.id)) {
      await directLoginStore.clear(user.id);
      return { ok: false, code: 'TWO_FACTOR_ENABLED', message: 'Akun ini memakai 2FA. Masuk dengan username, password, dan kode Authenticator.' };
    }
    key = directLoginStore.decrypt(record);
    authService.openSessionWithKey(user, key, record.kdf, 'local');
    await vaultService.document();
    return { ok: true, user: authService.session(), directLogin: true };
  } catch (error) {
    vaultService.clearCache();
    authService.logout();
    await directLoginStore.clear(record.userId).catch(() => undefined);
    return { ok: false, message: error.message || 'Login langsung gagal. Silakan masuk dengan username dan password.' };
  } finally {
    key?.fill(0);
  }
}

function publicQuickAccessEntry(entry) {
  const result = {
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
  if (entry.totp) {
    const { secret: _secret, ...totp } = entry.totp;
    result.totp = totp;
  }
  return result;
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

function syncQuickAccessTheme() {
  if (!quickAccessWindow || quickAccessWindow.isDestroyed() || quickAccessWindow.webContents.isLoading()) return;
  quickAccessWindow.webContents.send('quick-access:theme', { theme: activeTheme, palette: activePalette });
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
  quickAccessWindow.webContents.on('did-finish-load', syncQuickAccessTheme);
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
  syncQuickAccessTheme();
  window.webContents.send('quick-access:refresh');
}

function setQuickAccessHotkey(enabled) {
  quickAccessEnabled = enabled === true;
  globalShortcut.unregister(QUICK_ACCESS_SHORTCUT);
  quickAccessHotkeyRegistered = quickAccessEnabled && globalShortcut.register(QUICK_ACCESS_SHORTCUT, toggleQuickAccess);
  if (quickAccessEnabled && !quickAccessHotkeyRegistered) console.warn(`Quick Access shortcut ${QUICK_ACCESS_SHORTCUT} tidak dapat didaftarkan; fallback jendela aktif digunakan.`);
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
      assertTrustedSender(event, mainWindow);
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
  handle('window:minimize', () => {
    mainWindow?.minimize();
    return { ok: true };
  });
  handle('window:toggle-maximize', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return { ok: false };
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
    return { ok: true, maximized: mainWindow.isMaximized() };
  });
  handle('window:close', () => {
    if (!mainWindow || mainWindow.isDestroyed()) return { ok: false };
    mainWindow.close();
    return { ok: true };
  });
  ipcMain.on('quick-access:close', (event) => {
    assertTrustedSender(event, quickAccessWindow);
    quickAccessWindow?.hide();
  });

  const startTwoFactorSetup = async (pendingAuth) => {
    const issuer = 'PassSa';
    const account = pendingAuth.account || pendingAuth.user.email;
    const secret = generateSecret();
    const algorithm = 'SHA1';
    const digits = 6;
    const period = 30;
    const otpAuthUri = buildOtpAuthUri({ issuer, account, secret, algorithm, digits, period });
    const recoveryCodes = generateRecoveryCodes();
    const challengeId = createTwoFactorChallenge({
      ...pendingAuth,
      kind: 'setup',
      secret,
      account,
      issuer,
      algorithm,
      digits,
      period,
      recoveryCodes,
    });
    return {
      ok: true,
      requires2faSetup: true,
      user: authService.publicUser(pendingAuth.user, pendingAuth.provider || 'local'),
      twoFactor: {
        challengeId,
        expiresAt: twoFactorChallenges.get(challengeId).expiresAt,
        issuer,
        account,
        manualKey: secret,
        otpAuthUri,
        digits,
        period,
      },
    };
  };

  const startTwoFactorVerification = (pendingAuth) => {
    const challengeId = createTwoFactorChallenge({ ...pendingAuth, kind: 'verify' });
    return {
      ok: true,
      requires2fa: true,
      user: authService.publicUser(pendingAuth.user, pendingAuth.provider || 'local'),
      twoFactor: {
        challengeId,
        expiresAt: twoFactorChallenges.get(challengeId).expiresAt,
      },
    };
  };

  const beginPasswordAuthentication = async (input, registering) => {
    const result = registering
      ? await authService.register(input, { openSession: false })
      : await authService.login(input, { openSession: false });
    if (!result.ok) return result;
    const pendingAuth = {
      method: 'password',
      userId: result.user.id,
      user: result.user,
      password: String(input.password || ''),
      provider: result.user.provider || 'local',
    };
    const twoFactor = await totpStore.get(result.user.id);
    const loginMethod = resolveLoginMethod({
      twoFactorEnabled: Boolean(twoFactor),
    });
    if (loginMethod === 'two-factor') return startTwoFactorVerification(pendingAuth);
    return finalizePasswordAuthentication(pendingAuth);
  };

  const finalizePasswordAuthentication = async (pendingAuth) => {
    try {
      await authService.openSessionForUser(pendingAuth.userId, pendingAuth.password, pendingAuth.provider || 'local');
      await vaultService.configureKey(pendingAuth.password);
      await vaultService.upgradeKdf(pendingAuth.password);
      let sync;
      if (pendingAuth.googleChallengeId) {
        const googlePending = googleAuthSession.get(pendingAuth.googleChallengeId);
        googleAuthSession.consume(pendingAuth.googleChallengeId);
        await googleTokenStore.save(googlePending.profile.email, googlePending.tokens);
        await googleUnlockStore.save(googlePending.profile.email, {
          localIdentifier: authService.session().email,
          password: pendingAuth.password,
          googleSub: googlePending.profile.sub,
        });
        try {
          sync = await driveSyncService.sync({ password: pendingAuth.password });
        } catch (error) {
          sync = { ok: false, status: 'error', message: error.message };
        }
      }
      let directLogin;
      if (pendingAuth.enableDirectLogin) {
        try {
          const context = authService.context();
          if (await totpStore.get(context.user.id)) throw new Error('Akun dengan 2FA tidak dapat memakai login langsung.');
          await directLoginStore.save(context.user, context.key, authService.vaultKdf());
          directLogin = { enabled: true };
        } catch (error) {
          directLogin = { enabled: false, message: error.message || 'Login langsung tidak dapat diaktifkan.' };
        }
      }
      return {
        ok: true,
        user: authService.session(),
        twoFactorEnabled: false,
        ...(directLogin ? { directLogin } : {}),
        ...(sync ? { sync } : {}),
      };
    } catch (error) {
      vaultService.clearCache();
      authService.logout();
      throw error;
    }
  };

  const finalizeTwoFactorAuthentication = async (pendingAuth) => {
    if (pendingAuth.method === 'hello') {
      try {
        authService.openSessionWithKey(pendingAuth.user, pendingAuth.key, pendingAuth.kdf, pendingAuth.provider || 'local');
        await vaultService.document();
        return { ok: true, user: authService.session() };
      } catch (error) {
        vaultService.clearCache();
        authService.logout();
        throw error;
      }
    }
    if (pendingAuth.method === 'session') return { ok: true, user: authService.session(), twoFactorEnabled: true };
    return finalizePasswordAuthentication(pendingAuth);
  };

  const authenticate = (input, registering) => beginPasswordAuthentication(input, registering);

  const seedDevelopmentVault = async () => {
    if (app.isPackaged || !devSkipLoginMode) return;
    const document = await vaultService.document();
    if (document.items.some((item) => item.source === DUMMY_SOURCE)) return;

    const { items, categories } = createDummyVaultData();
    const categoryPaths = new Set(document.categories.map((category) => String(category.path || '').toLowerCase()));
    document.items.push(...items);
    document.categories.push(...categories.filter((category) => {
      const pathKey = category.path.toLowerCase();
      if (categoryPaths.has(pathKey)) return false;
      categoryPaths.add(pathKey);
      return true;
    }));
    await vaultService.writeDocument(document);
  };

  const startDevBypassSession = async () => {
    if (app.isPackaged || !devSkipLoginMode) {
      return { ok: false, message: 'Lewati login hanya tersedia lewat perintah development.' };
    }
    if (authService.session()) return { ok: true, user: authService.session(), devMode: true };

    let result;
    if (!devBypassCredentials) {
      devBypassCredentials = {
        username: 'developer',
        password: nodeCrypto.randomBytes(36).toString('base64url'),
      };
      result = await authService.register(devBypassCredentials);
    } else {
      result = await authService.login(devBypassCredentials);
    }
    if (!result.ok) return result;

    try {
      await vaultService.configureKey(devBypassCredentials.password);
      await vaultService.ensureInitialized();
      await vaultService.document();
      await seedDevelopmentVault();
      return { ok: true, user: authService.session(), devMode: true };
    } catch (error) {
      vaultService.clearCache();
      authService.logout();
      throw error;
    }
  };

  const authenticateGoogle = async (input) => {
    const pending = googleAuthSession.get(input.challengeId);
    const credentials = {
      email: pending.profile.email,
      googleSub: pending.profile.sub,
      localIdentifier: input.localIdentifier,
      password: input.password,
    };
    const result = await authService.googleLogin(credentials, { openSession: false, provider: 'google' });
    if (!result.ok) return result;
    const pendingAuth = {
      method: 'password',
      userId: result.user.id,
      user: result.user,
      password: String(input.password || ''),
      provider: 'google',
      googleChallengeId: input.challengeId,
      account: pending.profile.email,
    };
    const twoFactor = await totpStore.get(result.user.id);
    return twoFactor
      ? startTwoFactorVerification(pendingAuth)
      : finalizePasswordAuthentication(pendingAuth);
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
  handle('auth:dev-bypass-status', () => ({ enabled: devSkipLoginMode && !app.isPackaged }));
  handle('auth:dev-bypass-login', () => startDevBypassSession(), true);
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
      if (automatic.ok && !automatic.requires2fa && !automatic.requires2faSetup) return { ...automatic, autoCompleted: true };
      if (automatic.ok && (automatic.requires2fa || automatic.requires2faSetup)) return automatic;
    }
    return { ok: true, profile: challenge.profile, challengeId: challenge.challengeId, expiresAt: challenge.expiresAt };
  });
  handle('auth:google-complete', (input) => authenticateGoogle(input), true);
  handle('auth:2fa-copy-setup-key', (input = {}) => {
    const challenge = getTwoFactorChallenge(input.challengeId);
    if (!challenge || challenge.kind !== 'setup') {
      return { ok: false, code: 'TWO_FACTOR_EXPIRED', message: 'Sesi setup 2FA sudah kedaluwarsa. Silakan mulai login kembali.' };
    }
    const secret = String(challenge.secret || '');
    if (!secret) return { ok: false, message: 'Kunci setup tidak tersedia.' };
    clipboard.writeText(secret);
    scheduleClipboardClear(secret);
    return { ok: true };
  }, true);
  handle('auth:2fa-complete', async (input = {}) => {
    const challenge = getTwoFactorChallenge(input.challengeId);
    if (!challenge) return { ok: false, code: 'TWO_FACTOR_EXPIRED', message: 'Sesi 2FA sudah kedaluwarsa. Silakan mulai login kembali.' };
    const recovery = Boolean(input.recovery);
    let accepted = false;
    if (challenge.kind === 'setup') {
      let setupSecret = challenge.secret;
      if (input.setupSecret) {
        try {
          setupSecret = normalizeSecret(input.setupSecret);
        } catch {
          return { ok: false, code: 'TWO_FACTOR_SECRET_INVALID', message: 'Kunci Base32 tidak valid. Gunakan hanya huruf A–Z dan angka 2–7.' };
        }
        if (setupSecret.length < 16) {
          return { ok: false, code: 'TWO_FACTOR_SECRET_TOO_SHORT', message: 'Kunci Base32 terlalu pendek. Gunakan secret minimal 16 karakter.' };
        }
      }
      const verification = verifyTotp(setupSecret, input.code, {
        algorithm: challenge.algorithm,
        digits: challenge.digits,
        period: challenge.period,
        window: 1,
      });
      accepted = verification.ok;
      if (accepted) {
        await totpStore.save(challenge.userId, {
          version: 1,
          secret: setupSecret,
          issuer: challenge.issuer,
          account: challenge.account,
          algorithm: challenge.algorithm,
          digits: challenge.digits,
          period: challenge.period,
          enabledAt: new Date().toISOString(),
          lastAcceptedStep: verification.step,
          recoveryCodeHashes: challenge.recoveryCodes.map(hashRecoveryCode),
        });
        await directLoginStore.clear(challenge.userId).catch(() => undefined);
      }
    } else if (challenge.kind === 'verify') {
      if (recovery) {
        accepted = await totpStore.consumeRecoveryCode(challenge.userId, input.code);
      } else {
        const record = await totpStore.get(challenge.userId);
        if (record) {
          const verification = verifyTotp(record.secret, input.code, {
            algorithm: record.algorithm,
            digits: record.digits,
            period: record.period,
            window: 1,
          });
          accepted = verification.ok && await totpStore.acceptStep(challenge.userId, verification.step);
        }
      }
    }

    if (!accepted) {
      challenge.attempts += 1;
      if (challenge.attempts >= 5) removeTwoFactorChallenge(challenge.challengeId);
      return {
        ok: false,
        code: 'TWO_FACTOR_INVALID',
        message: challenge.attempts >= 5
          ? 'Terlalu banyak percobaan. Silakan mulai login kembali.'
          : recovery ? 'Recovery code tidak valid atau sudah digunakan.' : 'Kode Google Authenticator salah atau sudah digunakan.',
      };
    }

    const recoveryCodes = challenge.kind === 'setup' ? [...challenge.recoveryCodes] : null;
    let result;
    try {
      result = await finalizeTwoFactorAuthentication(challenge);
    } catch (error) {
      removeTwoFactorChallenge(challenge.challengeId);
      throw error;
    }
    removeTwoFactorChallenge(challenge.challengeId);
    return {
      ...result,
      twoFactorEnabled: true,
      ...(recoveryCodes ? { recoveryCodes } : {}),
    };
  }, true);
  handle('auth:2fa-status', async () => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    return { ok: true, supported: true, ...(await totpStore.status(session.id)) };
  });
  handle('auth:direct-login-status', async () => {
    const record = await directLoginStore.getActive();
    const session = authService.session();
    const matchingSession = !session || session.id === record?.userId;
    const user = record ? await authService.findUserById(record.userId) : null;
    const twoFactorEnabled = Boolean(user && await totpStore.get(user.id));
    return {
      ok: true,
      supported: process.platform === 'win32' && safeStorage.isEncryptionAvailable(),
      enabled: Boolean(record && user && !twoFactorEnabled && matchingSession),
      twoFactorEnabled,
      username: record?.username || user?.username || user?.email || null,
    };
  });
  handle('auth:direct-login-enable', async (input = {}) => {
    const context = authService.context();
    if (!(await authService.verifyCurrentPassword(input.password))) {
      return { ok: false, message: 'Password vault saat ini salah.' };
    }
    if (await totpStore.get(context.user.id)) {
      return { ok: false, message: 'Nonaktifkan 2FA terlebih dahulu. Login langsung tidak meminta kode Authenticator.' };
    }
    await directLoginStore.save(context.user, context.key, authService.vaultKdf());
    return { ok: true, enabled: true, message: 'Login langsung aktif di perangkat ini.' };
  }, true);
  handle('auth:direct-login-disable', async () => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    await directLoginStore.clear(session.id);
    return { ok: true, enabled: false, message: 'Login langsung dinonaktifkan di perangkat ini.' };
  }, true);
  handle('auth:direct-login-unlock', () => unlockWithDirectLogin(), true);
  handle('auth:2fa-setup-start', async () => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    if (await totpStore.get(session.id)) return { ok: false, message: 'Google Authenticator sudah aktif.' };
    return startTwoFactorSetup({
      method: 'session',
      userId: session.id,
      user: authService.currentUserRecord,
      provider: session.provider || 'local',
      account: session.email,
    });
  }, true);
  handle('auth:2fa-disable', async (input = {}) => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    if (!(await authService.verifyCurrentPassword(input.password))) {
      return { ok: false, message: 'Password atau kode Authenticator salah.' };
    }
    const record = await totpStore.get(session.id);
    if (!record) return { ok: false, message: 'Google Authenticator tidak aktif.' };
    const verification = verifyTotp(record.secret, input.code, {
      algorithm: record.algorithm,
      digits: record.digits,
      period: record.period,
      window: 1,
    });
    if (!verification.ok || !(await totpStore.acceptStep(session.id, verification.step))) {
      return { ok: false, message: 'Password atau kode Authenticator salah atau sudah digunakan.' };
    }
    await totpStore.remove(session.id);
    return { ok: true, enabled: false, message: '2FA dinonaktifkan. Login berikutnya menggunakan password saja.' };
  }, true);
  handle('auth:session', async () => {
    const session = authService.session();
    if (session || app.isPackaged || process.env.PASSA_DEV_BYPASS_AUTH !== 'true') return session;
    const email = process.env.PASSA_TEST_USERNAME;
    const password = process.env.PASSA_TEST_PASSWORD;
    if (!email || !password) return null;
    const result = await authenticate({ email, password }, false);
    return result.ok && !result.requires2fa && !result.requires2faSetup ? result.user : null;
  }, true);
  handle('auth:logout', async () => {
    const session = authService.session();
    let directLoginCleared = true;
    if (session) {
      try {
        await directLoginStore.clear(session.id);
      } catch {
        directLoginCleared = false;
      }
    }
    clearSensitiveState('Anda telah keluar.');
    return {
      ok: directLoginCleared,
      ...(directLoginCleared ? {} : { message: 'Sesi ditutup, tetapi preferensi login langsung belum dapat dihapus. Periksa kembali Pengaturan sebelum menutup aplikasi.' }),
    };
  }, true);
  handle('auth:lock', () => {
    clearSensitiveState('Vault otomatis dikunci karena tidak aktif.');
    return { ok: true };
  }, true);
  handle('auth:hello-status', async (input = {}) => {
    const requestedUsername = String(input.username || input.email || '').trim().toLowerCase();
    const session = authService.session();
    const username = requestedUsername || session?.username || session?.email;
    if (!username) return { ok: true, supported: process.platform === 'win32', enabled: false };
    const auth = await authService.store.read();
    const user = auth.users.find((candidate) => (candidate.username || candidate.email) === username);
    const record = user ? await windowsHelloStore.get(user.id) : null;
    const twoFactor = user ? await totpStore.status(user.id) : { enabled: false };
    return {
      ok: true,
      supported: process.platform === 'win32',
      enabled: Boolean(record),
      twoFactorEnabled: twoFactor.enabled,
      username,
    };
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
    const username = String(input.username || input.email || '').trim().toLowerCase();
    if (!username) return { ok: false, message: 'Masukkan username terlebih dahulu.' };
    const auth = await authService.store.read();
    const user = auth.users.find((candidate) => (candidate.username || candidate.email) === username);
    const record = user ? await windowsHelloStore.get(user.id) : null;
    if (!user || !record) return { ok: false, code: 'NOT_CONFIGURED', message: 'Windows Hello belum diaktifkan untuk akun ini.' };
    const verification = await verifyWindowsHelloDevice();
    if (!verification.ok) return verification;
    let key;
    try {
      key = windowsHelloStore.decrypt(record);
      const pendingAuth = { method: 'hello', user, userId: user.id, key, kdf: record.kdf };
      const twoFactor = await totpStore.get(user.id);
      const result = twoFactor
        ? startTwoFactorVerification(pendingAuth)
        : await finalizeTwoFactorAuthentication(pendingAuth);
      key = null;
      return result;
    } catch (error) {
      vaultService.clearCache();
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
    const directRecord = await directLoginStore.getActive().catch(() => null);
    if (directRecord?.userId === result.user.id) {
      try {
        const context = authService.context();
        await directLoginStore.save(context.user, context.key, authService.vaultKdf());
      } catch {
        await directLoginStore.clear(result.user.id).catch(() => undefined);
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
  handle('window:set-theme', (input) => {
    const theme = typeof input === 'string' ? input : input?.theme;
    const palette = typeof input === 'object' && input ? input.palette : activePalette;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    activeTheme = nextTheme;
    activePalette = THEME_PALETTES.has(palette) ? palette : 'rose';
    mainWindow.setBackgroundColor(nextTheme === 'dark' ? '#170d15' : '#fbf7f9');
    syncQuickAccessTheme();
    return { ok: true, theme: nextTheme, palette: activePalette };
  });
  handle('settings:get-app', async () => {
    const settings = await appSettingsStore.read();
    let startWithWindows = false;
    try { startWithWindows = Boolean(app.getLoginItemSettings().openAtLogin); } catch { /* unsupported platform */ }
    return {
      startWithWindows,
      minimizeToTray: Boolean(settings.minimizeToTray),
      quickAccessEnabled: settings.quickAccessEnabled !== false,
      quickAccessRegistered: quickAccessHotkeyRegistered,
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
    const quickAccessRegistered = setQuickAccessHotkey(nextQuickAccessEnabled);
    refreshTrayMenu();
    return { ok: true, startWithWindows, minimizeToTray: nextMinimizeToTray, quickAccessEnabled: nextQuickAccessEnabled, quickAccessRegistered };
  }, true);
  handle('sync:now', () => driveSyncService.sync(), true);
  handle('sync:info', async () => {
    const session = authService.session();
    if (!session) return { ok: false, message: 'Sesi telah berakhir. Silakan masuk kembali.' };
    const snapshot = await vaultService.exportEncryptedSnapshot();
    return {
      ok: true,
      email: session.googleEmail || null,
      sizeBytes: Buffer.byteLength(JSON.stringify(snapshot), 'utf8'),
    };
  });
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
  handle('s3:info', () => s3SyncService.info());
  handle('s3:connect', (input) => s3SyncService.connect(input), true);
  handle('s3:sync-now', (input = {}) => s3SyncService.sync({ password: input.password }), true);
  handle('s3:disconnect', () => s3SyncService.disconnect(), true);
  handle('vault:list', async () => (await vaultService.list()).map(publicEntry));
  handle('vault:get', (id) => vaultService.getForEditing(id));
  handle('vault:totp-codes', (ids) => vaultService.getTotpCodes(ids), true);
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
  handle('vault:copy-totp', async (id) => {
    const result = await vaultService.useTotpCode(id);
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
    const items = entries.filter((entry) => !entry.deletedAt).map(publicQuickAccessEntry);
    const totpCodes = await vaultService.getTotpCodes(items.filter((entry) => entry.type === 'authenticator').map((entry) => entry.id));
    return {
      ok: true,
      items: items.map((entry) => entry.type === 'authenticator'
        ? { ...entry, totpCode: totpCodes[entry.id]?.code || '', totpRemaining: totpCodes[entry.id]?.remaining || 0 }
        : entry),
    };
  });
  quickHandle('quick-access:totp-codes', async (ids) => {
    if (!authService?.session()) return {};
    return vaultService.getTotpCodes(ids);
  });
  quickHandle('quick-access:clear-recent', async () => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    return vaultService.clearRecentUsage();
  }, true);
  quickHandle('quick-access:toggle-pin', async (id) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    const result = await vaultService.toggleQuickPinned(String(id || ''));
    return { ...result, item: publicQuickAccessEntry(result.item) };
  }, true);
  quickHandle('quick-access:get-note', async (id) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    const item = await vaultService.getForEditing(String(id || ''));
    if (!item || item.type !== 'secure-note') return { ok: false, message: 'Secure Note tidak ditemukan.' };
    return {
      ok: true,
      note: {
        id: item.id,
        title: item.title || 'Catatan',
        group: item.group || 'Umum',
        notes: item.notes || '',
        tags: Array.isArray(item.tags) ? item.tags.slice(0, 20) : [],
      },
    };
  });
  quickHandle('quick-access:use-note', async (id) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    return vaultService.useNote(String(id || ''));
  }, true);
  quickHandle('quick-access:open-item', async (id) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Buka PassSa untuk membuka credential.' };
    const item = await vaultService.getForEditing(String(id || ''));
    if (!item?.id) return { ok: false, message: 'Credential tidak ditemukan.' };
    showMainWindow();
    const sendOpenEvent = () => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('quick-access:open-item', item.id);
    };
    if (mainWindow?.webContents.isLoading()) mainWindow.webContents.once('did-finish-load', sendOpenEvent);
    else sendOpenEvent();
    quickAccessWindow?.hide();
    return { ok: true };
  });
  quickHandle('quick-access:copy', async ({ id, field } = {}) => {
    if (!authService?.session()) return { ok: false, code: 'LOCKED', message: 'Vault sedang terkunci.' };
    const allowedFields = new Set(['url', 'username', 'password', 'totp']);
    if (!allowedFields.has(field)) return { ok: false, message: 'Aksi copy tidak valid.' };
    const result = field === 'totp'
      ? await vaultService.useTotpCode(String(id || ''))
      : await vaultService.useSecret(String(id || ''), field);
    if (!result.value) return { ok: false, message: field === 'url' ? 'Item ini belum memiliki alamat situs.' : 'Field credential ini masih kosong.' };
    clipboard.writeText(result.value);
    scheduleClipboardClear(result.value);
    const label = field === 'totp' ? 'Kode 2FA' : field === 'url' ? 'Alamat situs' : field === 'username' ? 'Username' : 'Password';
    return { ok: true, field, usage: result.usage, message: `${label} disalin. Clipboard dibersihkan dalam 30 detik.` };
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
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: app.isPackaged && !previewMode,
    },
  });
  mainWindow = win;
  win.removeMenu();
  if (devSkipLoginMode) {
    win.once('ready-to-show', () => {
      if (win.isDestroyed()) return;
      win.setAlwaysOnTop(true);
      win.show();
      win.focus();
      setTimeout(() => {
        if (!win.isDestroyed()) win.setAlwaysOnTop(false);
      }, 1200);
    });
  }
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
  const s3SyncStateStore = new AtomicJsonStore(path.join(userData, 's3-sync-state.json'), () => ({ version: 1, users: {} }));
  const s3CredentialStore = new S3CredentialStore(path.join(userData, 's3-credentials.json'), safeStorage);
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
  directLoginStore = new DirectLoginStore(path.join(userData, 'direct-login.json'), safeStorage);
  totpStore = new TotpStore(path.join(userData, 'totp.json'), safeStorage);
  const driveClient = new GoogleDriveClient({ clientId: googleClientId, clientSecret: googleClientSecret, tokenStore: googleTokenStore, fetchFn: googleFetch });
  driveSyncService = new DriveSyncService({ driveClient, vaultService, stateStore: syncStateStore });
  s3SyncService = new S3SyncService({ vaultService, credentialStore: s3CredentialStore, stateStore: s3SyncStateStore });
  registerIpc();
  await startAutofillBridge();
  const directLoginResult = await unlockWithDirectLogin().catch((error) => ({ ok: false, message: error.message }));
  if (!directLoginResult.ok && directLoginResult.code !== 'NOT_CONFIGURED') {
    console.warn(directLoginResult.message || 'Login langsung tidak dapat dibuka.');
  }
  powerMonitor.on('lock-screen', () => clearSensitiveState('Vault dikunci karena Windows terkunci.'));
  powerMonitor.on('suspend', () => clearSensitiveState('Vault dikunci karena perangkat masuk mode sleep.'));
  createWindow();
  if (app.isPackaged && !previewMode) createTray();
  if (!previewMode) setQuickAccessHotkey(quickAccessEnabled);
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
}).catch((error) => {
  console.error(error);
  app.quit();
});

app.on('window-all-closed', () => {
  if (nativeHostMode) return;
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => { isQuitting = true; clearSensitiveState('Aplikasi ditutup.'); quickAccessWindow?.destroy(); globalShortcut.unregisterAll(); tray?.destroy(); stopAutofillBridge(); });
