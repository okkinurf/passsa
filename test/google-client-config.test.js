const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveGoogleClientId } = require('../src/google-client-config');

test('konfigurasi Google memakai client ID bawaan ketika environment kosong', () => {
  assert.equal(
    resolveGoogleClientId({}, { clientId: '123-demo.apps.googleusercontent.com' }),
    '123-demo.apps.googleusercontent.com',
  );
});

test('environment Google client ID mengoverride konfigurasi bawaan', () => {
  assert.equal(
    resolveGoogleClientId(
      { PASSA_GOOGLE_CLIENT_ID: '456-env.apps.googleusercontent.com' },
      { clientId: '123-demo.apps.googleusercontent.com' },
    ),
    '456-env.apps.googleusercontent.com',
  );
});

test('format client ID Google yang tidak valid ditolak', () => {
  assert.throws(
    () => resolveGoogleClientId({}, { clientId: 'bukan-client-id' }),
    /tidak valid/,
  );
});
