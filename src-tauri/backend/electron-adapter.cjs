// Electron compatibility surface for the Tauri-hosted PassSa service layer.
// This module deliberately implements only the main-process APIs used by
// main.js. Renderer access remains behind Tauri commands and an IPC allowlist.
const { EventEmitter } = require('node:events');
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const os = require('node:os');
const path = require('node:path');

const bootstrap = globalThis.__PASSSA_TAURI_BOOTSTRAP || {};
const handlers = new Map();
const eventHandlers = new Map();
const pendingEvents = [];
let clipboardText = '';
let clipboardWrite = null;
let clipboardClearRequested = false;
let nextWindowId = 0;
const windows = new Set();
const output = process.stdout.write.bind(process.stdout);

function safeStorageKey() {
  const encoded = String(bootstrap.secureStorageKeyHex || '');
  const key = encoded ? Buffer.from(encoded, 'hex') : Buffer.alloc(0);
  return key.length === 32 ? key : null;
}

const secureKey = safeStorageKey();
const safeStorage = {
  isEncryptionAvailable: () => Boolean(secureKey),
  encryptString(value) {
    if (!secureKey) throw new Error('Penyimpanan aman perangkat belum tersedia.');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', secureKey, iv);
    const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
    return Buffer.concat([Buffer.from('PS2\0'), iv, cipher.getAuthTag(), encrypted]);
  },
  decryptString(value) {
    if (!secureKey) throw new Error('Penyimpanan aman perangkat belum tersedia.');
    const payload = Buffer.from(value);
    if (payload.length < 32 || payload.subarray(0, 4).toString('binary') !== 'PS2\0') {
      throw new Error('Data terenkripsi berasal dari penyimpanan versi lain.');
    }
    const decipher = crypto.createDecipheriv('aes-256-gcm', secureKey, payload.subarray(4, 16));
    decipher.setAuthTag(payload.subarray(16, 32));
    return Buffer.concat([decipher.update(payload.subarray(32)), decipher.final()]).toString('utf8');
  },
};

class FakeWebContents extends EventEmitter {
  send(event, payload) { pendingEvents.push({ event, payload }); }
  setWindowOpenHandler() {}
  setPermissionRequestHandler() {}
}

class BrowserWindow extends EventEmitter {
  constructor(options = {}) {
    super();
    this.id = ++nextWindowId;
    this.options = options;
    this.webContents = new FakeWebContents();
    this.webContents.session = { setPermissionRequestHandler() {} };
    this.bounds = { x: 0, y: 0, width: options.width || 1120, height: options.height || 760 };
    this.destroyed = false;
    this.minimized = false;
    this.maximized = false;
    this.visible = options.show !== false;
    windows.add(this);
  }
  static getAllWindows() { return [...windows].filter((window) => !window.destroyed); }
  isDestroyed() { return this.destroyed; }
  isMinimized() { return this.minimized; }
  isMaximized() { return this.maximized; }
  isVisible() { return this.visible; }
  getBounds() { return { ...this.bounds }; }
  getSize() { return [this.bounds.width, this.bounds.height]; }
  setSize(width, height) { this.bounds.width = width; this.bounds.height = height; }
  setMinimumSize() {}
  setBackgroundColor() {}
  setAlwaysOnTop() {}
  setPosition(x, y) { this.bounds.x = x; this.bounds.y = y; }
  removeMenu() {}
  show() { this.visible = true; }
  hide() { this.visible = false; }
  focus() {}
  restore() { this.minimized = false; this.visible = true; }
  minimize() { this.minimized = true; }
  maximize() { this.maximized = true; }
  unmaximize() { this.maximized = false; }
  close() { this.emit('close', { preventDefault() {} }); this.destroy(); }
  destroy() { this.destroyed = true; windows.delete(this); this.emit('closed'); }
  loadFile() { return Promise.resolve(); }
}

const app = new EventEmitter();
app.isPackaged = Boolean(bootstrap.packaged);
app.devBypassEnabled = Boolean(bootstrap.devBypassEnabled && !bootstrap.packaged);
app.commandLine = { appendSwitch() {} };
app.whenReady = () => Promise.resolve();
app.requestSingleInstanceLock = () => true;
app.disableHardwareAcceleration = () => undefined;
app.setName = () => undefined;
app.setAppUserModelId = () => undefined;
app.setPath = () => undefined;
app.quit = () => process.exit(1);
app.getPath = (name) => {
  if (name === 'userData') return String(bootstrap.userDataDir || path.join(os.homedir(), '.config', 'PassSa'));
  if (name === 'downloads') return path.join(os.homedir(), 'Downloads');
  if (name === 'temp') return os.tmpdir();
  return app.getPath('userData');
};
app.getLoginItemSettings = () => ({ openAtLogin: false, wasOpenedAtLogin: false });
app.setLoginItemSettings = () => undefined;

const ipcMain = new EventEmitter();
ipcMain.handle = (channel, handler) => handlers.set(channel, handler);
ipcMain.on = (channel, handler) => {
  const callbacks = eventHandlers.get(channel) || [];
  callbacks.push(handler);
  eventHandlers.set(channel, callbacks);
};

const clipboard = {
  writeText(value) {
    clipboardText = String(value ?? '');
    clipboardWrite = clipboardText;
    clipboardClearRequested = false;
  },
  readText: () => clipboardText,
  clear() {
    clipboardText = '';
    clipboardWrite = null;
    clipboardClearRequested = true;
  },
};

const dialog = {
  showSaveDialog: async () => ({ canceled: true, filePath: undefined }),
  showOpenDialog: async () => ({ canceled: true, filePaths: [] }),
  // Tauri has already shown the platform-native confirmation before routing
  // file transfer operations through the existing service handlers.
  showMessageBox: async () => ({ response: 0, checkboxChecked: false }),
};

const globalShortcut = { register: () => false, unregister() {}, unregisterAll() {} };
const Menu = { buildFromTemplate: (template) => template };
const nativeImage = { createFromPath: () => ({ isEmpty: () => true }) };
const powerMonitor = new EventEmitter();
const screen = {
  getCursorScreenPoint: () => ({ x: 0, y: 0 }),
  getDisplayNearestPoint: () => ({ workArea: { x: 0, y: 0, width: 1120, height: 760 } }),
};
class Tray extends EventEmitter {
  setToolTip() {}
  setContextMenu() {}
  destroy() {}
}

const net = { fetch: (...args) => globalThis.fetch(...args) };
const shell = {
  async openExternal(value) {
    const url = new URL(String(value));
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Hanya tautan web yang dapat dibuka.');
    const command = process.platform === 'win32' ? 'rundll32.exe'
      : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url.href] : [url.href];
    const child = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true });
    child.unref();
  },
};

async function startTauriRpcServer(settings = {}) {
  const input = globalThis.__PASSSA_TAURI_RPC_LINES;
  if (!input?.on) throw new Error('Saluran RPC Tauri belum disiapkan.');
  const writeResponse = (response) => output(`${JSON.stringify(response)}\n`);
  const execute = async (request) => {
    const id = request?.id;
    const channel = String(request?.channel || '');
    const args = Array.isArray(request?.args) ? request.args : [];
    const handler = handlers.get(channel);
    if (!handler) return writeResponse({ id, error: { message: `Operasi PassSa tidak dikenal: ${channel}` } });
    const sourceWindow = channel.startsWith('quick-access:')
      ? [...windows].find((window) => window.options?.title === 'PassSa Quick Access')
      : [...windows].find((window) => window.options?.title === 'PassSa');
    const sender = sourceWindow?.webContents;
    if (!sender) return writeResponse({ id, error: { message: 'Jendela PassSa belum siap.' } });
    clipboardWrite = null;
    clipboardClearRequested = false;
    pendingEvents.length = 0;
    try {
      const result = await handler({ sender }, ...args);
      writeResponse({
        id,
        result: result === undefined ? null : result,
        events: pendingEvents.splice(0),
        ...(clipboardWrite !== null ? { clipboardText: clipboardWrite } : {}),
        ...(clipboardClearRequested ? { clearClipboard: true } : {}),
      });
    } catch (error) {
      writeResponse({ id, error: { message: String(error?.message || 'Operasi PassSa gagal.') } });
    }
  };
  let requestQueue = Promise.resolve();
  input.on('line', (line) => {
    if (Buffer.byteLength(line, 'utf8') > 1_048_576) {
      writeResponse({ error: { message: 'Permintaan terlalu besar.' } });
      return;
    }
    requestQueue = requestQueue.then(async () => {
      let request;
      try { request = JSON.parse(line); }
      catch { return writeResponse({ error: { message: 'Permintaan RPC tidak valid.' } }); }
      await execute(request);
    }).catch(() => writeResponse({ error: { message: 'Backend PassSa mengalami kesalahan.' } }));
  });
  writeResponse({
    type: 'ready',
    quickAccessEnabled: settings.quickAccessEnabled !== false,
    minimizeToTray: settings.minimizeToTray === true,
  });
}

module.exports = {
  app,
  BrowserWindow,
  clipboard,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  net,
  powerMonitor,
  safeStorage,
  screen,
  shell,
  Tray,
  startTauriRpcServer,
};
