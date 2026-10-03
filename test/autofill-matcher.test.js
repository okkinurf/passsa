const test = require('node:test');
const assert = require('node:assert/strict');
const { findAutofillMatches, matchesUrl } = require('../src/services/autofill-matcher');

test('autofill default hanya cocok dengan host dan port yang sama', () => {
  assert.equal(matchesUrl('https://accounts.example.com/login', 'https://accounts.example.com/sign-in'), true);
  assert.equal(matchesUrl('https://accounts.example.com', 'https://evil.example.com'), false);
  assert.equal(matchesUrl('https://example.com', 'https://accounts.example.com'), false);
  assert.equal(matchesUrl('https://example.com', 'http://example.com'), false);
});

test('autofill base-domain harus dipilih secara eksplisit', () => {
  assert.equal(matchesUrl('https://example.com', 'https://accounts.example.com', 'base-domain'), true);
  assert.equal(matchesUrl('https://example.co.uk', 'https://login.example.co.uk', 'base-domain'), true);
  assert.equal(matchesUrl('https://example.com', 'https://example.net', 'base-domain'), false);
});

test('daftar autofill hanya mengembalikan entry aktif yang cocok', () => {
  const entries = [
    { id: 'a', title: 'Example', url: 'https://example.com' },
    { id: 'note', title: 'Secure note', type: 'secure-note', url: 'https://example.com' },
    { id: 'totp', title: 'Authenticator', type: 'authenticator', url: 'https://example.com' },
    { id: 'b', title: 'Other', url: 'https://other.com' },
    { id: 'c', title: 'Deleted', url: 'https://example.com', deletedAt: new Date().toISOString() },
  ];
  assert.deepEqual(findAutofillMatches(entries, 'https://example.com/login').map((entry) => entry.id), ['a']);
});
