const bundledConfig = require('./config/google-oauth.json');

function resolveGoogleClientId(env = process.env, config = bundledConfig) {
  const clientId = String(env.PASSA_GOOGLE_CLIENT_ID || config.clientId || '').trim();
  if (!clientId) return '';
  if (!/^[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(clientId)) {
    throw new Error('Google OAuth Client ID tidak valid.');
  }
  return clientId;
}

module.exports = { resolveGoogleClientId };
