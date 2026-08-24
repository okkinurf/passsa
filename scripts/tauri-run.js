const { spawnSync } = require('node:child_process');
const { PROJECT_ROOT } = require('./lib/runtime');

const command = process.argv[2];
if (!['dev', 'build'].includes(command)) {
  console.error('Gunakan: node scripts/tauri-run.js <dev|build> [argumen tambahan]');
  process.exit(2);
}

const args = ['tauri', command, ...process.argv.slice(3)];
const result = spawnSync('cargo', args, {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  windowsHide: false,
});

if (result.error?.code === 'ENOENT') {
  console.error('Rust Cargo belum terpasang. Instal Rust toolchain dan Tauri CLI, lalu jalankan `npm run tauri:doctor`.');
  process.exitCode = 1;
} else if (typeof result.status === 'number') {
  process.exitCode = result.status;
} else {
  process.exitCode = 1;
}
