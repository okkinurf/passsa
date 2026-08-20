const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');

const APP_DATA = process.env.APPDATA || process.env.LOCALAPPDATA || process.cwd();

function metadataCandidates() {
  const candidates = [
    path.join(APP_DATA, 'PassSa', 'autofill-bridge.json'),
    path.join(APP_DATA, 'passsa', 'autofill-bridge.json'),
  ];
  try {
    for (const entry of fs.readdirSync(APP_DATA, { withFileTypes: true })) {
      if (entry.isDirectory() && /passsa|password saved/i.test(entry.name)) {
        candidates.push(path.join(APP_DATA, entry.name, 'autofill-bridge.json'));
      }
    }
  } catch { /* app data may be unavailable */ }
  return [...new Set(candidates)];
}

function readBridgeMetadata() {
  for (const file of metadataCandidates()) {
    try {
      const metadata = JSON.parse(fs.readFileSync(file, 'utf8'));
      if ((metadata?.port || metadata?.pipe) && metadata?.token) return metadata;
    } catch { /* try next candidate */ }
  }
  return null;
}

function requestBridge(message) {
  return new Promise((resolve) => {
    const metadata = readBridgeMetadata();
    if (!metadata) return resolve({ ok: false, code: 'APP_NOT_RUNNING', message: 'PassSa belum berjalan atau bridge belum siap.' });
    const socket = metadata.port
      ? net.createConnection({ host: metadata.host || '127.0.0.1', port: metadata.port })
      : net.createConnection(metadata.pipe);
    let buffer = '';
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };
    socket.setEncoding('utf8');
    socket.setTimeout(5000, () => finish({ ok: false, code: 'TIMEOUT', message: 'PassSa tidak merespons.' }));
    socket.on('error', () => finish({ ok: false, code: 'APP_NOT_RUNNING', message: 'PassSa belum berjalan atau bridge tidak tersedia.' }));
    socket.on('data', (chunk) => {
      buffer += chunk;
      const newline = buffer.indexOf('\n');
      if (newline < 0) return;
      try { finish(JSON.parse(buffer.slice(0, newline))); } catch { finish({ ok: false, code: 'INVALID_RESPONSE', message: 'Respons bridge tidak valid.' }); }
    });
    socket.on('connect', () => socket.write(`${JSON.stringify({ ...message, token: metadata.token })}\n`));
  });
}

function writeNativeMessage(message) {
  const body = Buffer.from(JSON.stringify(message));
  const header = Buffer.alloc(4);
  header.writeUInt32LE(body.length, 0);
  process.stdout.write(Buffer.concat([header, body]));
}

let inputBuffer = Buffer.alloc(0);
let processing = Promise.resolve();
process.stdin.on('data', (chunk) => {
  inputBuffer = Buffer.concat([inputBuffer, chunk]);
  while (inputBuffer.length >= 4) {
    const size = inputBuffer.readUInt32LE(0);
    if (size > 1024 * 1024) {
      writeNativeMessage({ ok: false, code: 'MESSAGE_TOO_LARGE', message: 'Pesan terlalu besar.' });
      process.exit(1);
    }
    if (inputBuffer.length < size + 4) break;
    const body = inputBuffer.subarray(4, size + 4);
    inputBuffer = inputBuffer.subarray(size + 4);
    processing = processing.then(async () => {
      try {
        const request = JSON.parse(body.toString('utf8'));
        writeNativeMessage(await requestBridge(request));
      } catch (error) {
        writeNativeMessage({ ok: false, code: 'INVALID_REQUEST', message: error.message || 'Permintaan tidak valid.' });
      }
    });
  }
});

process.stdin.on('end', () => processing.finally(() => process.exit(0)));
