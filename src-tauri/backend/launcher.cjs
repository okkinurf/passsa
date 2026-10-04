const readline = require('node:readline');

const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
let initialized = false;
lines.on('line', (line) => {
  if (initialized) return;
  initialized = true;
  try {
    globalThis.__PASSSA_TAURI_BOOTSTRAP = JSON.parse(line);
    globalThis.__PASSSA_TAURI_RPC_LINES = lines;
    console.log = (...values) => console.error(...values);
    console.info = (...values) => console.error(...values);
    require('./backend.cjs');
  } catch (error) {
    console.error('PassSa backend gagal diinisialisasi:', error?.message || 'kesalahan tidak diketahui');
    process.exitCode = 1;
  }
});
lines.on('close', () => {
  if (initialized && !process.exitCode) process.exit(0);
});
