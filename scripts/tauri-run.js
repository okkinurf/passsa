const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { PROJECT_ROOT } = require('./lib/runtime');

const command = process.argv[2];
if (!['dev', 'build'].includes(command)) {
  console.error('Gunakan: node scripts/tauri-run.js <dev|build> [argumen tambahan]');
  process.exit(2);
}

const cli = path.join(PROJECT_ROOT, 'node_modules', '@tauri-apps', 'cli', 'tauri.js');
const args = [cli, command, ...process.argv.slice(3)];
const result = spawnSync(process.execPath, args, {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  windowsHide: false,
});

if (result.error?.code === 'ENOENT' || !require('node:fs').existsSync(cli)) {
  console.error('Tauri CLI lokal belum terpasang. Jalankan `npm ci`, lalu `npm run tauri:doctor` untuk memeriksa Rust dan dependency native.');
  process.exitCode = 1;
} else if (typeof result.status === 'number') {
  process.exitCode = result.status;
} else {
  process.exitCode = 1;
}
