const readline = require('node:readline');

const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
let initialized = false;
lines.on('line', (line) => {
  if (initialized) return;
  initialized = true;
  try {
    globalThis.__PASSSA_TAURI_BOOTSTRAP = JSON.parse(line);
    globalThis.__PASSSA_TAURI_RPC_LINES = lines;
    // stdout is reserved for the RPC protocol; suppress backend logs instead
    // of redirecting arbitrary vault/runtime values to stderr.
    console.log = () => {};
    console.info = () => {};
    require('./backend.cjs');
  } catch {
    console.error('PassSa backend gagal diinisialisasi.');
    process.exitCode = 1;
  }
});
lines.on('close', () => {
  if (initialized && !process.exitCode) process.exit(0);
});
