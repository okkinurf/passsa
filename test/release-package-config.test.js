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

test('development dummy data is loaded only by the unpackaged skip-login profile', () => {
  const mainSource = fs.readFileSync(path.join(root, 'main.js'), 'utf8');
  assert.match(mainSource, /const devSkipLoginMode = !app\.isPackaged && process\.argv\.includes\('--passsa-dev-skip-login'\);/);
  assert.match(mainSource, /devSkipLoginMode\s*\?\s*require\('\.\/src\/dev\/dummy-vault-data'\)/);
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

test('self-signed release trusts the certificate only on the ephemeral runner and warns users', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish-windows-release.yml'), 'utf8');
  assert.match(workflow, /Cert:\\CurrentUser\\Root/);
  assert.match(workflow, /Cert:\\CurrentUser\\TrustedPublisher/);
  assert.match(workflow, /PASSA_SIGNING_CERT_THUMBPRINT/);
  assert.match(workflow, /WINDOWS_CERTIFICATE_THUMBPRINT/);
  assert.match(workflow, /1\.3\.6\.1\.5\.5\.7\.3\.3/);
  assert.match(workflow, /self-signed and is not trusted by Windows by default/i);
});
