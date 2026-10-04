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

test('self-signed release pins the untrusted signer without installing a root certificate', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-windows-release.yml'), 'utf8');
  const installerQa = fs.readFileSync(path.join(root, 'scripts', 'installer-qa.js'), 'utf8');
  assert.match(workflow, /PASSA_ALLOW_UNTRUSTED_SIGNER: 'true'/);
  assert.match(installerQa, /allowUntrustedSigner && signature\.Status === 'NotTrusted'/);
  assert.match(installerQa, /signature\.Status === 'UnknownError' && knownUntrustedRoot/);
  assert.match(installerQa, /StatusMessage=\$signature\.StatusMessage/);
  assert.doesNotMatch(workflow, /Cert:\\CurrentUser\\Root/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_THUMBPRINT/);
  assert.match(workflow, /self-signed and is not trusted by Windows by default/i);
});
