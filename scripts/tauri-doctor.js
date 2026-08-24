const fs = require('node:fs');
const { PROJECT_ROOT, commandExists, projectPath } = require('./lib/runtime');

const root = PROJECT_ROOT;
const checks = [];
function check(label, result, required = false) {
  checks.push({ label, ...result, required });
  const prefix = result.ok ? 'OK' : required ? 'BLOCKED' : 'WARN';
  console.log(`[${prefix}] ${label}${result.output ? ` — ${result.output.split(/\r?\n/)[0]}` : ''}`);
}

check('Tauri config', { ok: fs.existsSync(projectPath('src-tauri', 'tauri.conf.json')) }, true);
check('Rust cargo', commandExists('cargo'), false);
check('Rust compiler', commandExists('rustc'), false);
check('Tauri CLI', commandExists('cargo', ['tauri', '--version']), false);
check('Android SDK', {
  ok: Boolean(process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT),
  output: process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || 'ANDROID_HOME/ANDROID_SDK_ROOT belum diatur',
}, false);
check('Android Java', commandExists('java'), false);

console.log('');
console.log('PassSa tetap dapat diuji dengan Electron tanpa prerequisite native Tauri.');
if (checks.some((item) => item.required && !item.ok)) process.exitCode = 1;
