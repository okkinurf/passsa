const crypto = require('node:crypto');
const http = require('node:http');
const { resolveGoogleClientId } = require('./google-client-config');
const { URL } = require('node:url');

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';
const SCOPES = ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/drive.appdata'];

function base64Url(value) {
  return Buffer.from(value).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

function createCodeVerifier() {
  return base64Url(crypto.randomBytes(48));
}

function createCodeChallenge(verifier) {
  return base64Url(crypto.createHash('sha256').update(verifier).digest());
}

function createState() {
  return base64Url(crypto.randomBytes(32));
}

function buildAuthorizationUrl({ clientId, redirectUri, state, codeVerifier }) {
  const url = new URL(AUTH_ENDPOINT);
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    state,
    code_challenge: createCodeChallenge(codeVerifier),
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  });
  return url.toString();
}

function waitForCallback(server, expectedState, timeoutMs = 180000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.close();
      reject(new Error('Waktu login Google habis.'));
    }, timeoutMs);
    server.on('request', (request, response) => {
      const callback = new URL(request.url, 'http://127.0.0.1');
      if (callback.pathname !== '/oauth2callback') {
        response.writeHead(404).end();
        return;
      }
      if (callback.searchParams.get('state') !== expectedState) {
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('<h3>Login Google ditolak.</h3><p>Validasi keamanan gagal. Kembali ke PassSa dan coba lagi.</p>');
        clearTimeout(timer);
        server.close();
        reject(new Error('Validasi OAuth gagal (state tidak cocok).'));
        return;
      }
      const error = callback.searchParams.get('error');
      if (error) {
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('<h3>Login Google dibatalkan.</h3><p>Anda dapat kembali ke PassSa.</p>');
        clearTimeout(timer);
        server.close();
        reject(new Error(`Login Google dibatalkan: ${error}`));
        return;
      }
      const code = callback.searchParams.get('code');
      if (!code) {
        response.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('<h3>Login Google gagal.</h3><p>Authorization code tidak tersedia.</p>');
        clearTimeout(timer);
        server.close();
        reject(new Error('Google tidak mengembalikan authorization code.'));
        return;
      }
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end('<h3>Otorisasi Google diterima.</h3><p>Kembali ke PassSa untuk menyelesaikan login.</p>');
      clearTimeout(timer);
      server.close();
      resolve(code);
    });
    server.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

class GoogleOAuth {
  constructor({ clientId = resolveGoogleClientId(), clientSecret = '', fetchFn = globalThis.fetch } = {}) {
    this.clientId = String(clientId || '').trim();
    this.clientSecret = String(clientSecret || '').trim();
    this.fetch = fetchFn;
  }

  async start(openExternal) {
    if (!this.clientId) {
      return { ok: false, message: 'Google OAuth belum dikonfigurasi. Isi PASSA_GOOGLE_CLIENT_ID terlebih dahulu.' };
    }
    const server = http.createServer();
    await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
    const { port } = server.address();
    const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
    const state = createState();
    const codeVerifier = createCodeVerifier();
    try {
      await openExternal(buildAuthorizationUrl({ clientId: this.clientId, redirectUri, state, codeVerifier }));
      const code = await waitForCallback(server, state);
      const tokenResponse = await this.fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.clientId,
          ...(this.clientSecret ? { client_secret: this.clientSecret } : {}),
          code,
          code_verifier: codeVerifier,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });
      if (!tokenResponse.ok) {
        let detail = '';
        try {
          const payload = await tokenResponse.json();
          detail = payload.error_description || payload.error || '';
        } catch { /* ignore malformed provider response */ }
        throw new Error(`Google menolak OAuth${detail ? `: ${detail}` : '.'}`);
      }
      const tokens = await tokenResponse.json();
      const profileResponse = await this.fetch(USERINFO_ENDPOINT, { headers: { authorization: `Bearer ${tokens.access_token}` } });
      if (!profileResponse.ok) throw new Error(`Profil Google tidak dapat dibaca (HTTP ${profileResponse.status}).`);
      const profile = await profileResponse.json();
      if (!profile.email || profile.email_verified === false) throw new Error('Email Google belum terverifikasi.');
      return {
        ok: true,
        profile: { sub: profile.sub, email: profile.email, name: profile.name, picture: profile.picture },
        tokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
          scope: tokens.scope,
          expires_at: Date.now() + Number(tokens.expires_in || 3600) * 1000,
        },
      };
    } catch (error) {
      server.close();
      return { ok: false, message: error.message || 'Login Google gagal.' };
    }
  }
}

module.exports = { GoogleOAuth, SCOPES, createCodeVerifier, createCodeChallenge, buildAuthorizationUrl };
