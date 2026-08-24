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
if (config.identifier !== 'id.passsa.app') fail('identifier aplikasi tidak sesuai.');
if (config.build?.frontendDist !== '../src') fail('frontendDist harus menunjuk ke ../src.');
if (config.app?.withGlobalTauri !== true) fail('app.withGlobalTauri harus aktif untuk bridge migrasi.');
if (config.app?.windows?.[0]?.label !== 'main') fail('window utama harus memiliki label main.');
if (config.app?.windows?.[0]?.decorations !== false) fail('window utama harus frameless.');
if (!config.bundle?.icon?.length) fail('icon bundle belum dikonfigurasi.');
if (!capability.windows?.includes('main')) fail('capability belum mengizinkan window main.');
if (!capability.permissions?.includes('core:window:allow-start-dragging')) fail('permission drag window belum ada.');
if (!mobileCapability.platforms?.includes('android')) fail('capability Android belum ada.');
if (!fs.existsSync(cargoPath)) fail('Cargo.toml tidak ditemukan.');
if (!fs.existsSync(path.join(root, 'src', 'tauri-bridge.js'))) fail('tauri-bridge.js tidak ditemukan.');

if (!process.exitCode) console.log('Tauri v2 config lulus: config, capability, Cargo manifest, bridge, frameless window, dan icon tervalidasi.');
