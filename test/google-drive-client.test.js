const test = require('node:test');
const assert = require('node:assert/strict');
const { GoogleDriveClient } = require('../src/services/google-drive-client');

test('Drive client me-refresh access token tanpa mengekspos refresh token ke URL', async () => {
  const calls = [];
  let saved;
  const tokenStore = {
    load: async () => ({ refresh_token: 'refresh-secret', access_token: 'expired', expires_at: 0 }),
    save: async (_email, tokens) => { saved = tokens; },
  };
  const fetchFn = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    if (String(url).includes('oauth2.googleapis.com')) {
      return { ok: true, json: async () => ({ access_token: 'new-access', expires_in: 3600, token_type: 'Bearer' }) };
    }
    return { ok: true, json: async () => ({ files: [] }) };
  };
  const client = new GoogleDriveClient({ clientId: 'client.apps.googleusercontent.com', tokenStore, fetchFn });
  assert.deepEqual(await client.listVaultFiles('okki@example.test'), []);
  assert.equal(saved.refresh_token, 'refresh-secret');
  assert.equal(calls[1].options.headers.authorization, 'Bearer new-access');
  assert.equal(calls[1].url.includes('refresh-secret'), false);
});
