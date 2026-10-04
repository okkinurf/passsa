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
    const requestUrl = new URL(String(url));
    if (requestUrl.protocol === 'https:' && requestUrl.hostname === 'oauth2.googleapis.com' && requestUrl.pathname === '/token') {
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

test('Drive client memakai folder PassSa yang sudah ada dan tidak membuat duplikat', async () => {
  const calls = [];
  const tokenStore = { load: async () => ({ access_token: 'access', expires_at: Date.now() + 3600_000 }) };
  const fetchFn = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    return { ok: true, json: async () => ({ files: [{ id: 'folder-1', name: 'PassSa' }] }) };
  };
  const client = new GoogleDriveClient({ clientId: 'client.apps.googleusercontent.com', tokenStore, fetchFn });
  const folder = await client.ensureFolder('okki@example.test');
  assert.equal(folder.id, 'folder-1');
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /mimeType/);
});

test('Drive client mencabut token Google saat logout tanpa memasukkan token ke URL', async () => {
  const calls = [];
  const tokenStore = { load: async () => ({ refresh_token: 'refresh-secret' }) };
  const fetchFn = async (url, options = {}) => {
    calls.push({ url: String(url), options });
    return { ok: true, status: 200, json: async () => ({}) };
  };
  const client = new GoogleDriveClient({ clientId: 'client.apps.googleusercontent.com', tokenStore, fetchFn });
  assert.equal(await client.revoke('okki@example.test'), true);
  assert.equal(calls[0].url.includes('refresh-secret'), false);
  assert.equal(calls[0].options.body.toString().includes('refresh-secret'), true);
});
