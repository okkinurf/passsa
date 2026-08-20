const crypto = require('node:crypto');
const { buildEntry, normalizeEntry, normalizeTags } = require('../core/vault-entry');
const { deriveVaultKey, normalizeKdfParams, CURRENT_KDF } = require('../auth-crypto');

const EXPORT_AAD = Buffer.from('PassSa encrypted vault export v1', 'utf8');
const MAX_IMPORT_BYTES = 25 * 1024 * 1024;
const CSV_HEADERS = ['title', 'type', 'username', 'password', 'website', 'group', 'description', 'tags', 'favorite', 'custom_fields'];

function validateTransferPassword(password) {
  if (typeof password !== 'string' || password.length < 8) return 'Password export minimal 8 karakter.';
  if (password.length > 256) return 'Password export terlalu panjang.';
  return null;
}

function encryptExport(document, password) {
  const validation = validateTransferPassword(password);
  if (validation) throw new Error(validation);
  const salt = crypto.randomBytes(16);
  const nonce = crypto.randomBytes(12);
  const keyPromise = deriveVaultKey(password, salt, CURRENT_KDF);
  return keyPromise.then((key) => {
    try {
      const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
      cipher.setAAD(EXPORT_AAD);
      const plaintext = Buffer.from(JSON.stringify({
        version: 2,
        items: Array.isArray(document?.items) ? document.items : [],
        categories: Array.isArray(document?.categories) ? document.categories : [],
      }), 'utf8');
      const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
      return {
        format: 'passsa',
        formatVersion: 1,
        createdAt: new Date().toISOString(),
        kdf: { ...CURRENT_KDF },
        salt: salt.toString('base64'),
        nonce: nonce.toString('base64'),
        tag: cipher.getAuthTag().toString('base64'),
        ciphertext: ciphertext.toString('base64'),
      };
    } finally {
      key.fill(0);
    }
  });
}

async function decryptExport(payload, password) {
  const validation = validateTransferPassword(password);
  if (validation) throw new Error(validation);
  if (!payload || payload.format !== 'passsa' || payload.formatVersion !== 1) {
    throw new Error('Format backup PassSa tidak dikenali.');
  }
  const salt = decodeBase64(payload.salt, 16, 'Salt backup');
  const nonce = decodeBase64(payload.nonce, 12, 'Nonce backup');
  const tag = decodeBase64(payload.tag, 16, 'Tag backup');
  const ciphertext = decodeBase64(payload.ciphertext, null, 'Data backup');
  const kdf = normalizeKdfParams(payload.kdf, CURRENT_KDF);
  const key = await deriveVaultKey(password, salt, kdf);
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    decipher.setAAD(EXPORT_AAD);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const parsed = JSON.parse(plaintext.toString('utf8'));
    return normalizeDocument(parsed);
  } catch {
    throw new Error('Password backup salah atau file backup rusak.');
  } finally {
    key.fill(0);
  }
}

function decodeBase64(value, expectedLength, label) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error(`${label} tidak valid.`);
  const buffer = Buffer.from(value, 'base64');
  if (expectedLength !== null && buffer.length !== expectedLength) throw new Error(`${label} tidak valid.`);
  if (!buffer.length) throw new Error(`${label} tidak valid.`);
  return buffer;
}

function documentToCsv(document) {
  const rows = [CSV_HEADERS];
  for (const raw of Array.isArray(document?.items) ? document.items : []) {
    if (raw?.deletedAt) continue;
    const item = normalizeEntry(raw);
    rows.push([
      item.title,
      item.type,
      item.username,
      item.password,
      item.url,
      item.group,
      item.notes,
      item.tags.join(', '),
      item.favorite ? 'true' : 'false',
      JSON.stringify(item.fields ?? []),
    ]);
  }
  return rows.map((row) => row.map(csvEscape).join(',')).join('\r\n') + '\r\n';
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field.endsWith('\r') ? field.slice(0, -1) : field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }
  if (quoted) throw new Error('CSV tidak valid: tanda kutip tidak berpasangan.');
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((candidate) => candidate.some((value) => String(value).trim() !== ''));
}

function csvToDocument(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('CSV tidak berisi item yang dapat diimpor.');
  const headers = rows[0].map((value) => normalizeHeader(value));
  const indexes = {
    title: findHeader(headers, ['title', 'name', 'item', 'nama']),
    type: findHeader(headers, ['type', 'item type', 'jenis']),
    username: findHeader(headers, ['username', 'user', 'email', 'account', 'akun', 'login username']),
    password: findHeader(headers, ['password', 'pass', 'secret', 'login password']),
    url: findHeader(headers, ['website', 'url', 'site', 'alamat situs', 'login uri', 'login url']),
    group: findHeader(headers, ['group', 'folder', 'category', 'kategori', 'grup']),
    notes: findHeader(headers, ['description', 'notes', 'note', 'catatan', 'deskripsi']),
    tags: findHeader(headers, ['tags', 'tag']),
    favorite: findHeader(headers, ['favorite', 'favourite', 'favorit', 'star', 'favorite status']),
    fields: findHeader(headers, ['custom fields', 'custom_fields', 'fields', 'field']),
  };
  if (indexes.title < 0 || indexes.password < 0) {
    throw new Error('CSV harus memiliki kolom title/nama dan password.');
  }
  const items = [];
  const errors = [];
  rows.slice(1).forEach((row, rowIndex) => {
    try {
      const input = {
        title: cell(row, indexes.title),
        type: cell(row, indexes.type) || 'login',
        username: cell(row, indexes.username),
        password: cell(row, indexes.password, false),
        url: cell(row, indexes.url),
        group: cell(row, indexes.group) || 'Umum',
        notes: cell(row, indexes.notes, false),
        tags: cell(row, indexes.tags),
        favorite: parseBoolean(cell(row, indexes.favorite)),
        fields: parseCustomFields(cell(row, indexes.fields, false)),
      };
      items.push(normalizeEntry(buildEntry(input)));
    } catch (error) {
      errors.push(`Baris ${rowIndex + 2}: ${error.message}`);
    }
  });
  if (errors.length) throw new Error(`CSV tidak dapat diimpor. ${errors.slice(0, 3).join(' ')}`);
  return { version: 2, items, categories: [] };
}

function normalizeDocument(document) {
  if (!document || !Array.isArray(document.items) || !Array.isArray(document.categories)) {
    throw new Error('Data backup tidak valid.');
  }
  const items = document.items.map((raw) => {
    const base = buildEntry(raw);
    return normalizeEntry({
      ...base,
      id: typeof raw.id === 'string' && raw.id.length <= 80 ? raw.id : base.id,
      type: raw.type ?? base.type,
      history: Array.isArray(raw.history) ? raw.history : [],
      createdAt: raw.createdAt ?? base.createdAt,
      updatedAt: raw.updatedAt ?? base.updatedAt,
      usageCount: raw.usageCount,
      lastUsedAt: raw.lastUsedAt,
      deletedAt: raw.deletedAt,
    });
  });
  const categories = document.categories.map(normalizeCategory).filter((category) => category.path);
  return { version: 2, items, categories };
}

function normalizeCategory(category = {}) {
  const path = String(category.path ?? category.name ?? '').trim().slice(0, 240);
  const name = String(category.name ?? path.split('/').at(-1) ?? '').trim().slice(0, 80);
  return {
    id: typeof category.id === 'string' && category.id.length <= 80 ? category.id : crypto.randomUUID(),
    name,
    path,
    parentPath: String(category.parentPath ?? parentPathOf(path)).trim().slice(0, 240),
    icon: typeof category.icon === 'string' ? category.icon.slice(0, 80) : 'folder',
    custom: true,
    createdAt: category.createdAt ?? new Date().toISOString(),
    updatedAt: category.updatedAt ?? category.createdAt ?? new Date().toISOString(),
  };
}

function mergeDocuments(current, imported, mode = 'merge') {
  if (mode === 'replace') return { document: imported, added: imported.items.length, skipped: 0 };
  const items = Array.isArray(current?.items) ? current.items.map(normalizeEntry) : [];
  const keys = new Set(items.map(itemKey));
  const ids = new Set(items.map((item) => item.id));
  let added = 0;
  let skipped = 0;
  for (const importedItem of imported.items) {
    if (keys.has(itemKey(importedItem))) {
      skipped += 1;
      continue;
    }
    const item = normalizeEntry({ ...importedItem, id: ids.has(importedItem.id) ? crypto.randomUUID() : importedItem.id });
    items.push(item);
    keys.add(itemKey(item));
    ids.add(item.id);
    added += 1;
  }
  const categories = Array.isArray(current?.categories) ? current.categories.map(normalizeCategory) : [];
  const categoryPaths = new Set(categories.map((category) => category.path.toLowerCase()));
  for (const category of imported.categories) {
    if (categoryPaths.has(category.path.toLowerCase())) continue;
    const normalized = normalizeCategory({ ...category, id: crypto.randomUUID() });
    categories.push(normalized);
    categoryPaths.add(normalized.path.toLowerCase());
  }
  return { document: { version: 2, items, categories }, added, skipped };
}

function itemKey(item) {
  return [item.title, item.username, item.url].map((value) => String(value ?? '').trim().toLowerCase()).join('\u0000');
}

function normalizeHeader(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

function findHeader(headers, candidates) {
  const normalized = candidates.map(normalizeHeader);
  return headers.findIndex((header) => normalized.includes(header));
}

function cell(row, index, trim = true) {
  const value = index >= 0 ? String(row[index] ?? '') : '';
  return trim ? value.trim() : value;
}

function parseBoolean(value) {
  return ['true', '1', 'yes', 'y', 'ya', 'favorite', 'favorit'].includes(String(value).trim().toLowerCase());
}

function parseCustomFields(value) {
  if (!String(value || '').trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error('format bukan array');
    return parsed;
  } catch {
    throw new Error('Custom fields CSV tidak valid.');
  }
}

function parentPathOf(value) {
  const segments = String(value).split('/');
  segments.pop();
  return segments.join('/');
}

module.exports = {
  CSV_HEADERS,
  MAX_IMPORT_BYTES,
  validateTransferPassword,
  encryptExport,
  decryptExport,
  documentToCsv,
  csvToDocument,
  normalizeDocument,
  mergeDocuments,
};
