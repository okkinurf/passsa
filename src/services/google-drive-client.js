const crypto = require('node:crypto');

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';

class GoogleDriveClient {
  constructor({ clientId, clientSecret = '', tokenStore, fetchFn = globalThis.fetch }) {
    this.clientId = String(clientId || '').trim();
    this.clientSecret = String(clientSecret || '').trim();
    this.tokenStore = tokenStore;
    this.fetch = fetchFn;
  }

  async accessToken(email) {
    if (!this.clientId) throw new Error('Google OAuth belum dikonfigurasi.');
    const tokens = await this.tokenStore.load(email);
    if (!tokens) throw new Error('Token Google tidak tersedia. Login dengan Google kembali.');
    if (tokens.access_token && Number(tokens.expires_at || 0) > Date.now() + 60_000) return tokens.access_token;
    if (!tokens.refresh_token) throw new Error('Refresh token Google tidak tersedia. Login dengan Google kembali.');
    const response = await this.fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.clientId,
        ...(this.clientSecret ? { client_secret: this.clientSecret } : {}),
        refresh_token: tokens.refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    if (!response.ok) throw new Error(`Refresh token Google gagal (HTTP ${response.status}).`);
    const refreshed = await response.json();
    const next = {
      ...tokens,
      access_token: refreshed.access_token,
      token_type: refreshed.token_type || tokens.token_type || 'Bearer',
      scope: refreshed.scope || tokens.scope,
      expires_at: Date.now() + Number(refreshed.expires_in || 3600) * 1000,
    };
    await this.tokenStore.save(email, next);
    return next.access_token;
  }

  async request(email, url, options = {}) {
    const accessToken = await this.accessToken(email);
    const response = await this.fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      let detail = '';
      try { detail = (await response.json()).error?.message || ''; } catch { /* provider response may be empty */ }
      throw new Error(`Google Drive gagal (HTTP ${response.status})${detail ? `: ${detail}` : ''}`);
    }
    return response;
  }

  async listVaultFiles(email, name = 'passsa-vault.json') {
    const query = new URLSearchParams({
      spaces: 'appDataFolder',
      q: `name = '${name.replaceAll("'", "\\'")}' and trashed = false`,
      fields: 'files(id,name,modifiedTime,size)',
      orderBy: 'modifiedTime desc',
      pageSize: '20',
    });
    const response = await this.request(email, `${DRIVE_API}/files?${query}`);
    return (await response.json()).files || [];
  }

  async downloadJson(email, fileId) {
    const response = await this.request(email, `${DRIVE_API}/files/${encodeURIComponent(fileId)}?alt=media`);
    return response.json();
  }

  multipartBody(metadata, content) {
    const boundary = `passsa_${crypto.randomBytes(16).toString('hex')}`;
    const body = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(content)}\r\n`,
      `--${boundary}--`,
    ].join('');
    return { body, contentType: `multipart/related; boundary=${boundary}` };
  }

  async createJson(email, name, content) {
    const multipart = this.multipartBody({ name, parents: ['appDataFolder'], mimeType: 'application/json' }, content);
    const response = await this.request(email, `${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id,name,modifiedTime`, {
      method: 'POST', headers: { 'content-type': multipart.contentType }, body: multipart.body,
    });
    return response.json();
  }

  async updateJson(email, fileId, content) {
    const multipart = this.multipartBody({ mimeType: 'application/json' }, content);
    const response = await this.request(email, `${DRIVE_UPLOAD_API}/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime`, {
      method: 'PATCH', headers: { 'content-type': multipart.contentType }, body: multipart.body,
    });
    return response.json();
  }
}

module.exports = { GoogleDriveClient };
