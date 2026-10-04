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

test('Tauri release publisher only runs for published prereleases and validates platform artifacts', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-tauri-release.yml'), 'utf8');
  assert.match(workflow, /tauri-desktop-build\.yml/);
  assert.match(workflow, /release:\s*\n\s+types:\s+\[published\]/);
  assert.doesNotMatch(workflow, /^\s{2}workflow_dispatch:/m);
  assert.match(workflow, /actions\/download-artifact@[0-9a-f]{40}\s+# v8/);
  assert.match(workflow, /head_branch -eq 'main'/);
  assert.match(workflow, /head_sha -eq \$tagCommit/);
  assert.match(workflow, /\.dmg/);
  assert.match(workflow, /\.appimage/);
  assert.match(workflow, /\.deb/);
  assert.match(workflow, /gh release upload/);
  assert.match(workflow, /gh release edit/);
  assert.doesNotMatch(workflow, /Cert:\\CurrentUser\\Root/);
});

test('Windows signing is isolated to the protected-main environment', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'tauri-desktop-build.yml'), 'utf8');
  const unsignedJob = workflow.split('  windows-signed:')[0];
  const signedJob = workflow.split('  windows-signed:')[1].split('  macos:')[0];
  assert.match(unsignedJob, /if: github\.ref != 'refs\/heads\/main'/);
  assert.doesNotMatch(unsignedJob, /WINDOWS_CERTIFICATE_(?:BASE64|PASSWORD)/);
  assert.match(signedJob, /if: github\.ref == 'refs\/heads\/main'/);
  assert.match(signedJob, /name: windows-signing/);
  assert.match(signedJob, /secrets\.WINDOWS_CERTIFICATE_BASE64/);
  assert.match(signedJob, /secrets\.WINDOWS_CERTIFICATE_PASSWORD/);
});

test('release CI commands cannot overwrite an earlier failure status', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'tauri-desktop-build.yml'), 'utf8');
  assert.doesNotMatch(workflow, /npm test\s*\r?\n\s*npm run qa:tauri/);
  assert.equal((workflow.match(/run: npm test/g) || []).length, 4);
  assert.equal((workflow.match(/run: npm run qa:tauri/g) || []).length, 4);
});

test('GitHub Actions are pinned to immutable commit SHAs', () => {
  const workflowsDirectory = path.join(root, '.github', 'workflows');
  const workflowFiles = fs.readdirSync(workflowsDirectory).filter((file) => file.endsWith('.yml') || file.endsWith('.yaml'));
  for (const file of workflowFiles) {
    const source = fs.readFileSync(path.join(workflowsDirectory, file), 'utf8');
    for (const match of source.matchAll(/^\s*uses:\s*([^#\r\n]+)/gm)) {
      assert.match(match[1].trim(), /^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+@[a-f0-9]{40}$/, `${file} has a mutable or unpinned action ref: ${match[1].trim()}`);
    }
  }
});

test('release audit loads the asar v4 ESM API on the declared Node runtime', async () => {
  const asar = await import('@electron/asar');
  assert.equal(typeof asar.extractFile, 'function');
  assert.equal(typeof asar.listPackage, 'function');
  assert.match(packageJson.engines.node, />=22\.12\.0/);
});

test('retired Electron publisher cannot overwrite Tauri releases', () => {
  assert.equal(fs.existsSync(path.join(root, '.github', 'workflows', 'publish-windows-release.yml')), false);
});

test('Tauri release pins the untrusted Windows signer without installing a root certificate', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-tauri-release.yml'), 'utf8');
  assert.match(workflow, /Get-AuthenticodeSignature/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_THUMBPRINT/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_SUBJECT/);
  assert.doesNotMatch(workflow, /Cert:\\CurrentUser\\Root/);
  assert.match(workflow, /self-signed/i);
});
