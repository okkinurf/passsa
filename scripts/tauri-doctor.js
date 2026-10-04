const fs = require('node:fs');
const path = require('node:path');
const { PROJECT_ROOT, commandExists, projectPath } = require('./lib/runtime');

const checks = [];
function check(label, result, required = false) {
  checks.push({ label, ...result, required });
  const prefix = result.ok ? 'OK' : required ? 'BLOCKED' : 'WARN';
  console.log(`[${prefix}] ${label}${result.output ? ` — ${result.output.split(/\r?\n/)[0]}` : ''}`);
}

check('Tauri v2 config', { ok: fs.existsSync(projectPath('src-tauri', 'tauri.conf.json')) }, true);
check('Rust Cargo', commandExists('cargo'), true);
check('Rust compiler', commandExists('rustc'), true);
check('Tauri CLI (npm)', commandExists(process.execPath, [projectPath('node_modules', '@tauri-apps', 'cli', 'tauri.js'), '--version']), true);

const host = commandExists('rustc', ['-vV']);
check('Rust host target', { ok: host.ok && /host:/.test(host.output), output: host.output.match(/host: .+/)?.[0] || host.output }, true);

if (process.platform === 'win32') {
  const webViewCandidates = [
    path.join(process.env.PROGRAMFILES || '', 'Microsoft', 'EdgeWebView', 'Application'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Microsoft', 'EdgeWebView', 'Application'),
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'EdgeWebView', 'Application'),
  ];
  check('WebView2 Runtime', { ok: webViewCandidates.some((candidate) => fs.existsSync(candidate)) }, false);
} else if (process.platform === 'darwin') {
  check('Xcode command-line tools', commandExists('xcrun'), false);
} else {
  check('Linux GTK/WebKit build dependencies', commandExists('pkg-config', ['--exists', 'webkit2gtk-4.1', 'gtk+-3.0']), false);
  check('Linux Secret Service session', { ok: Boolean(process.env.DBUS_SESSION_BUS_ADDRESS), output: process.env.DBUS_SESSION_BUS_ADDRESS ? 'DBus session ditemukan' : 'runtime keyring memerlukan sesi desktop Secret Service' }, false);
}

console.log('');
if (checks.some((item) => item.required && !item.ok)) process.exitCode = 1;
else console.log(`Host ${process.platform}-${process.arch} siap untuk memeriksa/build Tauri. Dependensi platform yang berstatus WARN dapat membatasi packaging atau penyimpanan secret.`);
