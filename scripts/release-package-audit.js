const fs = require('node:fs');
const path = require('node:path');
const { extractFile, listPackage } = require('@electron/asar');

const root = path.resolve(__dirname, '..');
const appDirectory = path.join(root, 'dist', 'win-unpacked');
const archivePath = path.join(appDirectory, 'resources', 'app.asar');
const helperPath = path.join(appDirectory, 'resources', 'app.asar.unpacked', 'scripts', 'windows-hello-helper.exe');

const forbiddenPathRules = [
  /^(?:src\/dev|test|tests|__tests__|fixtures)(?:\/|$)/i,
  /^scripts\/(?!windows-hello-helper\.exe$)/i,
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
];

function fail(message) {
  throw new Error(`Release package audit gagal: ${message}`);
}

function listFiles(directory, parent = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(parent, entry.name);
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) return [relative];
    return entry.isDirectory() ? listFiles(absolute, relative) : [relative];
  });
}

async function extractArchiveText(archive, relativePath) {
  const candidates = [
    relativePath,
    relativePath.replaceAll('/', '\\'),
    `/${relativePath}`,
    `\\${relativePath.replaceAll('/', '\\')}`,
  ];
  let lastError;
  for (const candidate of candidates) {
    try {
      return await extractFile(archive, candidate);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function main() {
  if (!fs.existsSync(archivePath)) fail('app.asar tidak ditemukan; jalankan packaging terlebih dahulu.');
  if (!fs.existsSync(helperPath)) fail('Windows Hello helper yang dibutuhkan runtime tidak ditemukan.');

  const archiveEntries = await listPackage(archivePath);
  const entryPaths = archiveEntries.map((entry) => entry.replaceAll('\\', '/').replace(/^\/+/, ''));
  const entries = entryPaths;
  const requiredEntries = [
    'main.js',
    'preload.js',
    'quick-access-preload.js',
    'src/index.html',
    'src/renderer.js',
    'scripts/windows-hello-helper.exe',
  ];
  for (const entry of requiredEntries) {
    if (!entries.includes(entry)) fail(`file runtime wajib tidak ada: ${entry}`);
  }

  for (const entry of entries) {
    if (forbiddenPathRules.some((rule) => rule.test(entry))) {
      fail(`file development atau credential ikut terpaket: ${entry}`);
    }
  }

  const packageFiles = listFiles(appDirectory).map((entry) => entry.replaceAll('\\', '/'));
  for (const entry of packageFiles) {
    if (forbiddenPathRules.some((rule) => rule.test(entry))) {
      fail(`file development atau credential berada di folder hasil packaging: ${entry}`);
    }
  }

  const sourceEntries = entries.filter((entry) => (
    /^(?:main\.js|preload\.js|quick-access-preload\.js|src\/|browser-extension\/)/.test(entry)
    && /\.(?:js|json|html|css|txt|md|svg)$/i.test(entry)
  ));
  for (const entry of sourceEntries) {
    const content = (await extractArchiveText(archivePath, entry)).toString('utf8');
    const marker = forbiddenDevelopmentMarkers.find((candidate) => content.includes(candidate));
    if (marker) fail(`data/fixture development terdeteksi di ${entry} (${marker}).`);
  }

  const oauthConfigPath = 'src/config/google-oauth.json';
  if (entries.includes(oauthConfigPath)) {
    const oauthConfig = JSON.parse((await extractArchiveText(archivePath, oauthConfigPath)).toString('utf8'));
    if (Object.keys(oauthConfig).some((key) => /secret|token|password|access.?key/i.test(key))) {
      fail('konfigurasi OAuth berisi field credential privat.');
    }
  }

  console.log(`Release package audit lulus: ${entries.length} file, helper runtime tersedia, tidak ada file credential atau fixture development.`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
