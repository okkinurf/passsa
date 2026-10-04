const fs = require('node:fs');
const path = require('node:path');
const { PROJECT_ROOT } = require('./lib/runtime');

const stagingRoot = path.join(PROJECT_ROOT, '.tauri');
const stagedRoots = ['frontend', 'runtime'].map((name) => path.join(stagingRoot, name));
const forbiddenPathRules = [
  /(?:^|\/)dev(?:\/|$)/i,
  /(?:^|\/)\.env(?:\.[^/]*)?$/i,
  /(?:^|\/)(?:auth|vault|google-token|google-unlock|s3-credentials|totp|direct-login)\.json$/i,
  /(?:^|\/)client_secret[^/]*\.json$/i,
  /\.(?:pfx|p12|pem|key|secret)$/i,
  /(?:^|\/)\.aws(?:\/|$)/i,
];
const forbiddenDevelopmentMarkers = [
  'passsa-dummy',
  'Demo-Only!',
  'REC-DEMO-',
  'qa@example.test',
  'password-qa',
  'akun dummy untuk pengujian UI',
];
const textExtensions = new Set(['.cjs', '.css', '.html', '.js', '.json', '.md', '.svg', '.txt', '.xml']);
const credentialPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
];

function fail(message) {
  throw new Error(`Audit staging Tauri gagal: ${message}`);
}

function collectFiles(directory, parent = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(parent, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`symlink tidak diizinkan di runtime/frontend: ${relative}`);
    return entry.isDirectory()
      ? collectFiles(absolute, relative)
      : [{ absolute, relative }];
  });
}

function main() {
  for (const directory of stagedRoots) {
    if (!fs.existsSync(directory)) fail(`folder staging tidak ditemukan: ${path.relative(stagingRoot, directory)}`);
  }

  let scanned = 0;
  for (const directory of stagedRoots) {
    for (const file of collectFiles(directory)) {
      const normalized = file.relative.replaceAll('\\', '/');
      if (forbiddenPathRules.some((rule) => rule.test(normalized))) {
        fail(`file development/credential terdeteksi: ${normalized}`);
      }
      if (!textExtensions.has(path.extname(file.absolute).toLowerCase())) continue;
      const contents = fs.readFileSync(file.absolute, 'utf8');
      const dummyMarker = forbiddenDevelopmentMarkers.find((marker) => contents.includes(marker));
      if (dummyMarker) fail(`fixture data development terdeteksi di ${normalized} (${dummyMarker})`);
      if (credentialPatterns.some((pattern) => pattern.test(contents))) {
        fail(`pola credential berisiko terdeteksi di ${normalized}`);
      }
      scanned += 1;
    }
  }

  console.log(`Audit staging Tauri lulus: ${scanned} file teks diperiksa; fixture dummy, file credential, dan pola secret tidak ditemukan.`);
}

try { main(); }
catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
