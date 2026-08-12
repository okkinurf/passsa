const crypto = require('node:crypto');

const MAX_HISTORY = 10;

function clean(value, maxLength, trim = true) {
  const result = String(value ?? '').slice(0, maxLength);
  return trim ? result.trim() : result;
}

function snapshot(entry) {
  return {
    title: entry.title,
    username: entry.username,
    password: entry.password,
    url: entry.url,
    notes: entry.notes,
    group: entry.group,
    favorite: entry.favorite,
    tags: entry.tags,
    savedAt: entry.updatedAt,
  };
}

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value ?? '').split(',');
  const seen = new Set();
  const tags = [];
  for (const candidate of raw) {
    const tag = String(candidate).trim().replace(/\s+/g, ' ').slice(0, 32);
    const key = tag.toLowerCase();
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length === 20) break;
  }
  return tags;
}

function normalizeEntry(entry) {
  return {
    ...entry,
    type: entry.type ?? 'login',
    group: entry.group ?? 'Umum',
    favorite: Boolean(entry.favorite),
    deletedAt: entry.deletedAt ?? null,
    history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY) : [],
    tags: normalizeTags(entry.tags),
    usageCount: Number.isSafeInteger(entry.usageCount) && entry.usageCount >= 0 ? entry.usageCount : 0,
    lastUsedAt: entry.lastUsedAt ?? null,
  };
}

function buildEntry(input = {}, existing = null) {
  const title = clean(input.title, 120);
  const username = clean(input.username, 320);
  const password = clean(input.password, 1024, false);
  const url = clean(input.url, 2048);
  const notes = clean(input.notes, 5000);
  const group = clean(input.group ?? existing?.group ?? 'Umum', 80) || 'Umum';
  if (!title) throw new Error('Nama item wajib diisi.');
  if (!password) throw new Error('Password wajib diisi.');

  const previousHistory = existing ? [...normalizeEntry(existing).history, snapshot(normalizeEntry(existing))] : [];
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    type: 'login',
    title,
    username,
    password,
    url,
    notes,
    group,
    favorite: input.favorite === undefined ? Boolean(existing?.favorite) : Boolean(input.favorite),
    tags: input.tags === undefined ? normalizeTags(existing?.tags) : normalizeTags(input.tags),
    usageCount: existing?.usageCount ?? 0,
    lastUsedAt: existing?.lastUsedAt ?? null,
    deletedAt: existing?.deletedAt ?? null,
    history: previousHistory.slice(-MAX_HISTORY),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...(existing?.source ? { source: existing.source } : {}),
  };
}

module.exports = { buildEntry, normalizeEntry, normalizeTags, MAX_HISTORY };
