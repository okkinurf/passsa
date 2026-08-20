const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', 'browser-extension');

test('extension autofill memakai permission terbatas dan Native Messaging', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.ok(manifest.permissions.includes('activeTab'));
  assert.ok(manifest.permissions.includes('nativeMessaging'));
  assert.ok(!manifest.permissions.includes('tabs'));
  assert.ok(!manifest.host_permissions);
  for (const file of ['background.js', 'content.js', 'popup.html', 'popup.js', 'popup.css']) assert.ok(fs.existsSync(path.join(root, file)), `${file} tidak ada`);
});
