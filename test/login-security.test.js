const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { resolveLoginMethod } = require('../src/services/login-security');

test('password is the default login method until 2FA is configured in Settings', () => {
  assert.equal(resolveLoginMethod(), 'password');
  assert.equal(resolveLoginMethod({ requestedTwoFactor: true }), 'password');
  assert.equal(resolveLoginMethod({ requestedDirectLogin: true }), 'password');
});

test('2FA is required at login once configured in Settings', () => {
  assert.equal(resolveLoginMethod({ twoFactorEnabled: true }), 'two-factor');
});

test('registration immediately enters the app and leaves security choices to Settings', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
  assert.doesNotMatch(html, /register-login-security|register-security-choice/);
  assert.match(html, /langsung masuk\. Metode login dapat diatur nanti melalui Pengaturan/);
  const loginSettings = html.match(/<section class="settings-section settings-section--compact settings-login-section"[\s\S]*?<\/section>/)?.[0] || '';
  assert.match(loginSettings, /Password saja/);
  assert.match(loginSettings, /Google Authenticator/);
  assert.match(loginSettings, /Login langsung/);
  assert.match(loginSettings, /id="settings-2fa-enable"/);
  assert.match(loginSettings, /id="settings-direct-login-enable"/);
  assert.match(loginSettings, /id="settings-2fa-disable-open"/);
});
