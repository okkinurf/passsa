const assert = require('node:assert/strict');
const test = require('node:test');
const { createCodeVerifier, createCodeChallenge, buildAuthorizationUrl, SCOPES } = require('../src/google-oauth');

test('Google OAuth membuat verifier dan challenge PKCE yang valid', () => {
  const verifier = createCodeVerifier();
  const challenge = createCodeChallenge(verifier);
  assert.ok(verifier.length >= 43);
  assert.match(challenge, /^[A-Za-z0-9_-]+$/);
});

test('URL OAuth memakai loopback, state, PKCE, dan scope Drive file terbatas', () => {
  const url = new URL(buildAuthorizationUrl({
    clientId: 'client.apps.googleusercontent.com',
    redirectUri: 'http://127.0.0.1:4567/oauth2callback',
    state: 'state-value',
    codeVerifier: 'verifier-value',
  }));
  assert.equal(url.hostname, 'accounts.google.com');
  assert.equal(url.searchParams.get('redirect_uri'), 'http://127.0.0.1:4567/oauth2callback');
  assert.equal(url.searchParams.get('state'), 'state-value');
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256');
  assert.ok(url.searchParams.get('scope').includes(SCOPES.at(-1)));
});
