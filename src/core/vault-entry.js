const crypto = require('node:crypto');

const MAX_HISTORY = 10;
const MAX_NOTE_HISTORY = 20;
const MAX_QUICK_ACCESS_HISTORY = 12;
const MAX_FIELDS = 50;
const MAX_FIELD_LABEL = 80;
const MAX_FIELD_VALUE = 5000;
const MAX_NOTES = 20000;
const FIELD_TYPES = new Set(['text', 'secret', 'url', 'email', 'number', 'boolean']);

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
    quickPinned: entry.quickPinned,
    tags: entry.tags,
    savedAt: entry.updatedAt,
  };
}

function noteSnapshot(entry) {
  return {
    title: entry.title,
    notes: entry.notes,
    group: entry.group,
    tags: normalizeTags(entry.tags),
    fields: normalizeCustomFields(entry.fields),
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

function normalizeCustomFields(value) {
  if (!Array.isArray(value)) return [];
  const fields = [];
  const seen = new Set();
  const seenIds = new Set();
  for (const candidate of value) {
    if (!candidate || typeof candidate !== 'object') continue;
    const label = clean(candidate.label ?? candidate.name, MAX_FIELD_LABEL);
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const type = FIELD_TYPES.has(candidate.type) ? candidate.type : 'text';
    let id = clean(candidate.id, 80) || crypto.randomUUID();
    if (seenIds.has(id)) id = crypto.randomUUID();
    seenIds.add(id);
    let fieldValue;
    if (type === 'boolean') fieldValue = candidate.value === true || String(candidate.value).toLowerCase() === 'true';
    else fieldValue = clean(candidate.value, MAX_FIELD_VALUE, false);
    fields.push({ id, label, type, value: fieldValue, required: Boolean(candidate.required) });
    if (fields.length >= MAX_FIELDS) break;
  }
  return fields;
}

function normalizeNoteHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === 'object')
    .slice(-MAX_NOTE_HISTORY)
    .map((entry) => ({
      title: clean(entry.title, 120),
      notes: clean(entry.notes, MAX_NOTES, false),
      group: clean(entry.group, 80) || 'Umum',
      tags: normalizeTags(entry.tags),
      fields: normalizeCustomFields(entry.fields),
      savedAt: String(entry.savedAt ?? ''),
    }));
}

function normalizeEntry(entry) {
  const recentUseHistory = Array.isArray(entry.recentUseHistory)
    ? entry.recentUseHistory
      .filter((record) => record && typeof record === 'object' && typeof record.usedAt === 'string' && ['username', 'password', 'url', 'note'].includes(record.field))
      .slice(-MAX_QUICK_ACCESS_HISTORY)
      .map((record) => ({ field: record.field, usedAt: record.usedAt }))
    : [];
  return {
    ...entry,
    type: entry.type === 'secure-note' ? 'secure-note' : 'login',
    group: entry.group ?? 'Umum',
    favorite: Boolean(entry.favorite),
    quickPinned: Boolean(entry.quickPinned),
    deletedAt: entry.deletedAt ?? null,
    history: Array.isArray(entry.history) ? entry.history.slice(-MAX_HISTORY) : [],
    noteHistory: normalizeNoteHistory(entry.noteHistory),
    tags: normalizeTags(entry.tags),
    fields: normalizeCustomFields(entry.fields),
    usageCount: Number.isSafeInteger(entry.usageCount) && entry.usageCount >= 0 ? entry.usageCount : 0,
    lastUsedAt: entry.lastUsedAt ?? null,
    recentUseHistory,
  };
}

function buildEntry(input = {}, existing = null) {
  const requestedType = input.type === undefined ? existing?.type : input.type;
  const type = requestedType === 'secure-note' ? 'secure-note' : 'login';
  const title = clean(input.title, 120);
  const username = clean(input.username, 320);
  const password = clean(input.password, 1024, false);
  const url = clean(input.url, 2048);
  const notes = clean(input.notes, MAX_NOTES);
  const group = clean(input.group ?? existing?.group ?? 'Umum', 80) || 'Umum';
  if (!title) throw new Error('Nama item wajib diisi.');
  if (type === 'login' && !password) throw new Error('Password wajib diisi.');

  const normalizedExisting = existing ? normalizeEntry(existing) : null;
  const passwordChanged = Boolean(normalizedExisting && password !== normalizedExisting.password);
  const previousHistory = normalizedExisting
    ? (passwordChanged
      ? [...normalizedExisting.history, snapshot(normalizedExisting)]
      : normalizedExisting.history)
    : [];
  const tags = input.tags === undefined ? normalizeTags(normalizedExisting?.tags) : normalizeTags(input.tags);
  const fields = input.fields === undefined ? normalizeCustomFields(normalizedExisting?.fields) : normalizeCustomFields(input.fields);
  const noteChanged = Boolean(
    normalizedExisting?.type === 'secure-note'
      && type === 'secure-note'
      && (
        title !== normalizedExisting.title
        || notes !== normalizedExisting.notes
        || group !== normalizedExisting.group
        || JSON.stringify(tags) !== JSON.stringify(normalizedExisting.tags)
        || JSON.stringify(fields) !== JSON.stringify(normalizedExisting.fields)
      ),
  );
  const previousNoteHistory = normalizedExisting
    ? (noteChanged
      ? [...normalizedExisting.noteHistory, noteSnapshot(normalizedExisting)]
      : normalizedExisting.noteHistory)
    : [];
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    type,
    title,
    username,
    password,
    url,
    notes,
    group,
    favorite: input.favorite === undefined ? Boolean(normalizedExisting?.favorite) : Boolean(input.favorite),
    quickPinned: input.quickPinned === undefined ? Boolean(normalizedExisting?.quickPinned) : Boolean(input.quickPinned),
    tags,
    fields,
    usageCount: normalizedExisting?.usageCount ?? 0,
    lastUsedAt: normalizedExisting?.lastUsedAt ?? null,
    recentUseHistory: normalizedExisting?.recentUseHistory ?? [],
    deletedAt: normalizedExisting?.deletedAt ?? null,
    history: previousHistory.slice(-MAX_HISTORY),
    noteHistory: previousNoteHistory.slice(-MAX_NOTE_HISTORY),
    createdAt: normalizedExisting?.createdAt ?? now,
    updatedAt: now,
    ...(normalizedExisting?.source ? { source: normalizedExisting.source } : {}),
  };
}

module.exports = { buildEntry, normalizeEntry, normalizeTags, normalizeCustomFields, MAX_HISTORY, MAX_NOTE_HISTORY, MAX_QUICK_ACCESS_HISTORY, MAX_FIELDS, MAX_FIELD_VALUE, MAX_NOTES };
