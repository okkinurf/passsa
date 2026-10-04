const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { PROJECT_ROOT } = require('./lib/runtime');

const root = PROJECT_ROOT;
const staging = path.join(root, '.tauri');
const runtimeDir = path.join(staging, 'runtime');
const frontendDir = path.join(staging, 'frontend');
const isTauriBackend = process.argv.includes('--define-tauri-backend');

function removeIfExists(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function copyFrontend() {
  removeIfExists(frontendDir);
  fs.cpSync(path.join(root, 'src'), frontendDir, {
    recursive: true,
    filter: (source) => !path.relative(path.join(root, 'src'), source).split(path.sep).includes('dev'),
  });

  const fontAwesome = path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free');
  if (!fs.existsSync(fontAwesome)) throw new Error('Font Awesome tidak ditemukan. Jalankan npm ci terlebih dahulu.');
  fs.mkdirSync(path.join(frontendDir, 'vendor'), { recursive: true });
  fs.copyFileSync(path.join(fontAwesome, 'css', 'all.min.css'), path.join(frontendDir, 'vendor', 'fontawesome.min.css'));
  fs.cpSync(path.join(fontAwesome, 'webfonts'), path.join(frontendDir, 'webfonts'), { recursive: true });

  for (const fileName of ['index.html', 'quick-access.html']) {
    const htmlPath = path.join(frontendDir, fileName);
    const html = fs.readFileSync(htmlPath, 'utf8')
      .replace('../node_modules/@fortawesome/fontawesome-free/css/all.min.css', 'vendor/fontawesome.min.css');
    fs.writeFileSync(htmlPath, html, 'utf8');
  }
}

async function buildBackend() {
  removeIfExists(runtimeDir);
  fs.mkdirSync(runtimeDir, { recursive: true });
  const alias = path.join(root, 'src-tauri', 'backend', 'electron-adapter.cjs');
  await esbuild.build({
    entryPoints: [path.join(root, 'main.js')],
    outfile: path.join(runtimeDir, 'backend.cjs'),
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node22',
    packages: 'bundle',
    alias: { electron: alias },
    define: isTauriBackend ? { __PASSSA_TAURI_BACKEND__: 'true' } : {},
    plugins: [{
      name: 'exclude-developer-dummy-data',
      setup(build) {
        build.onResolve({ filter: /dummy-vault-data/ }, (args) => ({ path: args.path, external: true }));
      },
    }],
    sourcemap: false,
    legalComments: 'eof',
    logLevel: 'warning',
  });
  fs.copyFileSync(path.join(root, 'src-tauri', 'backend', 'launcher.cjs'), path.join(runtimeDir, 'launcher.cjs'));
  const runtimeName = process.platform === 'win32' ? 'node.exe' : 'node';
  fs.copyFileSync(process.execPath, path.join(runtimeDir, runtimeName));
  if (process.platform !== 'win32') fs.chmodSync(path.join(runtimeDir, runtimeName), 0o755);

  const bundleText = fs.readFileSync(path.join(runtimeDir, 'backend.cjs'), 'utf8');
  if (bundleText.includes('passsa-dummy') || bundleText.includes('REC-DEMO-') || bundleText.includes('akun dummy untuk pengujian UI')) {
    throw new Error('Fixture dummy development terdeteksi di sidecar Tauri. Build dibatalkan.');
  }
  if (!isTauriBackend) {
    throw new Error('Backend Tauri belum diberi define shell yang benar.');
  }
}

async function main() {
  if (!isTauriBackend) throw new Error('Gunakan flag --define-tauri-backend agar fixture developer dibuang.');
  copyFrontend();
  await buildBackend();
  console.log(`Runtime Tauri disiapkan (${process.platform}-${process.arch}); frontend dan Node sidecar tidak memuat data dummy.`);
}

main().catch((error) => {
  console.error(`Persiapan Tauri gagal: ${error.message}`);
  process.exitCode = 1;
});
