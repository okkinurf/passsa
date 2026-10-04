const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const packageJson = require('../package.json');

test('release package explicitly excludes development data and QA scripts', () => {
  const files = packageJson.build.files;
  assert.ok(files.includes('src/**/*'));
  assert.ok(files.includes('!src/dev/**/*'));
  assert.ok(files.includes('scripts/windows-hello-helper.exe'));
  assert.ok(!files.includes('scripts/**/*'));
  assert.ok(!files.includes('test/**/*'));
});

test('developer bypass is debug-only and dummy data stays out of Tauri', () => {
  const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  const adapterSource = fs.readFileSync(path.join(root, 'src-tauri', 'backend', 'electron-adapter.cjs'), 'utf8');
  const tauriSource = fs.readFileSync(path.join(root, 'src-tauri', 'src', 'lib.rs'), 'utf8');
  assert.match(mainSource, /const devSkipLoginMode = !app\.isPackaged && \(tauriBackendMode\s*\? app\.devBypassEnabled === true\s*: process\.argv\.includes\('--passsa-dev-skip-login'\)\);/);
  assert.match(mainSource, /!tauriBackendMode && devSkipLoginMode\s*\?\s*require\('\.\/src\/dev\/dummy-vault-data'\)/);
  assert.match(mainSource, /if \(tauriBackendMode \|\| app\.isPackaged \|\| !devSkipLoginMode\) return;/);
  assert.match(adapterSource, /app\.devBypassEnabled = Boolean\(bootstrap\.devBypassEnabled && !bootstrap\.packaged\);/);
  assert.match(tauriSource, /"devBypassEnabled": cfg!\(debug_assertions\)/);
  assert.match(tauriSource, /PassSa-Tauri-Dev-/);
});

test('local Authenticode files and AWS credential directories are ignored', () => {
  const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  assert.match(gitignore, /^\*\.pfx$/m);
  assert.match(gitignore, /^\.aws\/$/m);
});

test('bundled Google OAuth config contains no private credential fields', () => {
  const config = require('../src/config/google-oauth.json');
  assert.deepEqual(Object.keys(config), ['clientId']);
});

test('signed installer build never publishes implicitly through electron-builder', () => {
  assert.match(packageJson.scripts['dist:signed'], /--publish never/);
});

test('Tauri release publisher validates platform artifacts before attaching a prerelease', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-tauri-release-assets.yml'), 'utf8');
  assert.match(workflow, /tauri-desktop-build\.yml/);
  assert.match(workflow, /actions\/download-artifact@v7/);
  assert.match(workflow, /\.dmg/);
  assert.match(workflow, /\.appimage/);
  assert.match(workflow, /\.deb/);
  assert.match(workflow, /gh release upload/);
  assert.match(workflow, /gh release edit/);
  assert.doesNotMatch(workflow, /Cert:\\CurrentUser\\Root/);
});

test('retired Electron publisher cannot overwrite Tauri releases', () => {
  assert.equal(fs.existsSync(path.join(root, '.github', 'workflows', 'publish-windows-release.yml')), false);
});

test('Tauri release pins the untrusted Windows signer without installing a root certificate', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-tauri-release-assets.yml'), 'utf8');
  assert.match(workflow, /Get-AuthenticodeSignature/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_THUMBPRINT/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_SUBJECT/);
  assert.doesNotMatch(workflow, /Cert:\\CurrentUser\\Root/);
  assert.match(workflow, /self-signed/i);
});
