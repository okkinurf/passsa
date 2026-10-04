const fs = require('node:fs');
const path = require('node:path');
const { PROJECT_ROOT, projectPath, readJson: parseJsonFile } = require('./lib/runtime');

const root = PROJECT_ROOT;
const configPath = projectPath('src-tauri', 'tauri.conf.json');
const capabilityPath = projectPath('src-tauri', 'capabilities', 'default.json');
const mobileCapabilityPath = projectPath('src-tauri', 'capabilities', 'mobile.json');
const cargoPath = projectPath('src-tauri', 'Cargo.toml');

function fail(message) {
  console.error(`Tauri config gagal: ${message}`);
  process.exitCode = 1;
}

function readJson(file) {
  try { return parseJsonFile(file); }
  catch (error) { fail(`${path.relative(root, file)} tidak valid: ${error.message}`); return null; }
}

const config = readJson(configPath);
const capability = readJson(capabilityPath);
const mobileCapability = readJson(mobileCapabilityPath);
if (!config || !capability || !mobileCapability) process.exit(1);
if (config.identifier !== 'id.passsa.desktop') fail('identifier aplikasi tidak sesuai.');
if (config.version !== parseJsonFile(projectPath('package.json')).version) fail('versi Tauri harus sama dengan package.json.');
if (config.build?.frontendDist !== '../.tauri/frontend') fail('frontendDist harus menunjuk ke staging frontend yang disiapkan saat build.');
if (config.app?.withGlobalTauri !== true) fail('app.withGlobalTauri harus aktif untuk bridge migrasi.');
if (config.app?.windows?.[0]?.label !== 'main') fail('window utama harus memiliki label main.');
if (config.app?.windows?.[0]?.decorations !== false) fail('window utama harus frameless.');
if (config.app?.windows?.[0]?.width > 600 || config.app?.windows?.[0]?.height > 650) fail('ukuran awal window harus compact untuk layar login.');
if (!config.bundle?.icon?.length || config.bundle.icon.some((icon) => !fs.existsSync(projectPath('src-tauri', icon)))) fail('icon bundle harus berisi seluruh file ikon lintas platform yang tersedia.');
if (!['nsis', 'appimage', 'deb', 'dmg'].every((target) => config.bundle?.targets?.includes(target))) fail('target installer NSIS, AppImage, deb, dan DMG harus disiapkan.');
if (!config.bundle?.resources?.['../.tauri/runtime/']) fail('runtime Node sidecar harus disertakan dalam bundle.');
if (config.bundle?.windows?.certificateThumbprint || config.bundle?.windows?.signCommand) fail('credential signing tidak boleh ditanam di config; inject hanya pada CI tepercaya.');
if (!config.app?.security?.csp?.includes("object-src 'none'")) fail('Content Security Policy desktop belum membatasi object.');
if (!config.app?.security?.csp?.includes('https://api.github.com')) fail('Content Security Policy belum mengizinkan pemeriksaan rilis GitHub.');
if (!capability.windows?.includes('main') || !capability.windows?.includes('quick_access')) fail('capability harus membatasi akses hanya ke window main dan quick_access.');
if (!capability.permissions?.includes('core:window:allow-start-dragging')) fail('permission drag window belum ada.');
if (!mobileCapability.platforms?.includes('android')) fail('capability Android belum ada.');
if (!fs.existsSync(cargoPath)) fail('Cargo.toml tidak ditemukan.');
if (!fs.existsSync(path.join(root, 'src', 'tauri-bridge.js'))) fail('tauri-bridge.js tidak ditemukan.');
if (!fs.existsSync(path.join(root, 'src-tauri', 'backend', 'electron-adapter.cjs'))) fail('adapter service sidecar tidak ditemukan.');
if (!fs.existsSync(path.join(root, 'scripts', 'prepare-tauri-runtime.js'))) fail('script persiapan sidecar/frontend belum ada.');
const cargo = fs.readFileSync(cargoPath, 'utf8');
if (!cargo.includes('keyring =') || !cargo.includes('tauri-plugin-clipboard-manager') || !cargo.includes('tauri-plugin-opener')) fail('secure storage OS, clipboard native, dan pembuka tautan Tauri wajib diaktifkan.');

if (!process.exitCode) console.log('Tauri v2 config lulus: frontend, Node sidecar, penyimpanan OS, native clipboard, keamanan CSP, capability, dan target Windows/Linux/macOS tervalidasi.');
