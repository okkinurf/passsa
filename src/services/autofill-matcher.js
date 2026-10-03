const { URL } = require('node:url');

function parseWebUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  try {
    return new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

function normalizeHost(hostname) {
  return String(hostname ?? '').toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
}

function registrableDomain(hostname) {
  const host = normalizeHost(hostname);
  const parts = host.split('.').filter(Boolean);
  if (parts.length < 2) return host;
  const suffix = parts.slice(-2).join('.');
  const knownSecondLevel = new Set(['co.uk', 'com.au', 'co.jp', 'co.id', 'com.br', 'co.nz']);
  return knownSecondLevel.has(suffix) && parts.length >= 3 ? parts.slice(-3).join('.') : suffix;
}

function matchesUrl(savedUrl, currentUrl, mode = 'host') {
  const saved = parseWebUrl(savedUrl);
  const current = parseWebUrl(currentUrl);
  if (!saved || !current || !['http:', 'https:'].includes(saved.protocol) || !['http:', 'https:'].includes(current.protocol)) return false;
  if (saved.protocol !== current.protocol) return false;
  if (saved.username || saved.password || current.username || current.password) return false;
  const savedHost = normalizeHost(saved.hostname);
  const currentHost = normalizeHost(current.hostname);
  const matchMode = ['exact', 'host', 'base-domain'].includes(mode) ? mode : 'host';
  if (matchMode === 'exact') {
    return saved.protocol === current.protocol && savedHost === currentHost && saved.port === current.port && saved.pathname === current.pathname;
  }
  if (matchMode === 'base-domain') return registrableDomain(savedHost) === registrableDomain(currentHost);
  return savedHost === currentHost && saved.port === current.port;
}

function findAutofillMatches(entries, currentUrl) {
  return (Array.isArray(entries) ? entries : [])
    .filter((entry) => (entry?.type === undefined || entry?.type === 'login') && !entry?.deletedAt && entry?.url && matchesUrl(entry.url, currentUrl, entry.autofillMode || 'host'));
}

module.exports = { findAutofillMatches, matchesUrl, parseWebUrl, registrableDomain };
