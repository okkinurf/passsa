const crypto = require('node:crypto');
const { encryptVaultData, decryptVaultData } = require('../vault-crypto');
const { buildEntry, normalizeEntry, normalizeTags } = require('../core/vault-entry');
const { FREE_SOLID_ICONS, FREE_SOLID_ICON_SET, defaultIconForCategory } = require('../core/category-icons');
const { deriveVaultKey, normalizeKdfParams, isCurrentKdf, LEGACY_KDF, CURRENT_KDF } = require('../auth-crypto');

class VaultService {
  constructor(store, authService) {
    this.store = store;
    this.authService = authService;
  }

  async document() {
    const { user, key } = this.authService.context();
    const file = await this.store.read();
    return decryptVaultData(file.vaults[user.id], key);
  }

  async envelopeKdf() {
    const user = this.authService.session();
    if (!user) throw new Error('Sesi telah berakhir. Silakan masuk kembali.');
    const file = await this.store.read();
    const envelope = file.vaults[user.id];
    return envelope ? normalizeKdfParams(envelope.kdf, LEGACY_KDF) : { ...CURRENT_KDF };
  }

  async configureKey(password) {
    await this.authService.unlockVault(password, await this.envelopeKdf());
  }

  async upgradeKdf(password) {
    const previousKdf = this.authService.vaultKdf();
    if (isCurrentKdf(previousKdf)) return false;
    const document = await this.document();
    await this.authService.unlockVault(password, CURRENT_KDF);
    try {
      await this.writeDocument(document);
      return true;
    } catch (error) {
      await this.authService.unlockVault(password, previousKdf);
      throw error;
    }
  }

  async writeDocument(document) {
    const { user, key } = this.authService.context();
    const envelope = {
      ...encryptVaultData(document, key),
      kdf: this.authService.vaultKdf?.() ?? CURRENT_KDF,
      updatedAt: new Date().toISOString(),
    };
    await this.store.update((file) => {
      file.vaults ||= {};
      file.vaults[user.id] = envelope;
      return file;
    });
  }

  async list() {
    return (await this.document()).items.map(normalizeEntry);
  }

  async isEmpty() {
    const document = await this.document();
    return document.items.length === 0 && document.categories.length === 0;
  }

  syncAccount() {
    const user = this.authService.session();
    if (!user) throw new Error('Sesi telah berakhir. Silakan masuk kembali.');
    return user.googleEmail || user.email;
  }

  async exportEncryptedSnapshot() {
    const { user } = this.authService.context();
    let file = await this.store.read();
    if (!file.vaults[user.id]) {
      await this.writeDocument({ version: 2, items: [], categories: [] });
      file = await this.store.read();
    }
    return {
      schemaVersion: 1,
      email: user.email,
      vaultSalt: this.authService.vaultSalt(),
      envelope: structuredClone(file.vaults[user.id]),
    };
  }

  async importEncryptedSnapshot(snapshot, password) {
    if (!snapshot?.envelope || !snapshot?.vaultSalt || typeof password !== 'string') {
      throw new Error('Snapshot Drive atau password vault tidak valid.');
    }
    const kdf = normalizeKdfParams(snapshot.envelope.kdf, LEGACY_KDF);
    const remoteKey = await deriveVaultKey(password, Buffer.from(snapshot.vaultSalt, 'base64'), kdf);
    let document;
    try {
      document = decryptVaultData(snapshot.envelope, remoteKey);
    } catch {
      throw new Error('Password vault tidak dapat membuka data dari Google Drive.');
    } finally {
      remoteKey.fill(0);
    }
    await this.writeDocument(document);
    return { ok: true, itemCount: document.items.length };
  }

  async getForEditing(id) {
    const item = (await this.list()).find((candidate) => candidate.id === id && !candidate.deletedAt);
    if (!item) throw new Error('Item tidak ditemukan.');
    const { history: _history, ...editable } = item;
    return editable;
  }

  async save(items) {
    const document = await this.document();
    document.items = items;
    await this.writeDocument(document);
  }

  async listCategories() {
    const document = await this.document();
    const categories = document.categories.map(normalizeCategory);
    const knownPaths = new Set(categories.map((category) => category.path.toLowerCase()));
    let migrated = false;
    for (const item of document.items) {
      const segments = String(item.group ?? '').split('/').map((part) => part.trim()).filter(Boolean);
      for (let depth = 1; depth <= segments.length; depth += 1) {
        const path = segments.slice(0, depth).join('/');
        if (knownPaths.has(path.toLowerCase())) continue;
        const name = segments[depth - 1];
        const now = new Date().toISOString();
        categories.push({
          id: crypto.randomUUID(),
          name,
          path,
          parentPath: parentPathOf(path),
          icon: defaultIconForCategory(name),
          custom: true,
          createdAt: now,
          updatedAt: now,
        });
        knownPaths.add(path.toLowerCase());
        migrated = true;
      }
    }
    if (migrated) {
      document.categories = categories;
      await this.writeDocument(document);
    }
    return categories;
  }

  categoryIcons() {
    return FREE_SOLID_ICONS;
  }

  async createCategory(input = {}) {
    const document = await this.document();
    const category = buildCategory(input);
    if (document.categories.some((item) => normalizeCategory(item).path.toLowerCase() === category.path.toLowerCase())) {
      throw new Error('Kategori dengan nama tersebut sudah ada.');
    }
    document.categories.push(category);
    await this.writeDocument(document);
    return { ok: true, category };
  }

  async updateCategory(input = {}) {
    const document = await this.document();
    const index = document.categories.findIndex((item) => item.id === input.id);
    if (index < 0) throw new Error('Kategori custom tidak ditemukan.');
    const previous = normalizeCategory(document.categories[index]);
    const updated = buildCategory(input, previous);
    if (updated.parentPath === previous.path || updated.parentPath.startsWith(`${previous.path}/`)) {
      throw new Error('Kategori tidak dapat menjadi anak dari dirinya sendiri.');
    }
    if (document.categories.some((item, itemIndex) => itemIndex !== index && normalizeCategory(item).path.toLowerCase() === updated.path.toLowerCase())) {
      throw new Error('Kategori dengan nama tersebut sudah ada.');
    }
    const replacePath = (value) => value === previous.path || value.startsWith(`${previous.path}/`)
      ? `${updated.path}${value.slice(previous.path.length)}` : value;
    document.categories = document.categories.map((item, itemIndex) => {
      const normalized = normalizeCategory(item);
      if (itemIndex === index) return updated;
      const path = replacePath(normalized.path);
      return path === normalized.path ? normalized : { ...normalized, path, parentPath: parentPathOf(path) };
    });
    document.items = document.items.map((item) => ({ ...item, group: replacePath(item.group ?? 'Umum') }));
    await this.writeDocument(document);
    return { ok: true, category: updated };
  }

  async deleteCategory(id) {
    const document = await this.document();
    const category = document.categories.map(normalizeCategory).find((item) => item.id === id);
    if (!category) throw new Error('Kategori custom tidak ditemukan.');
    const belongs = (path) => path === category.path || path.startsWith(`${category.path}/`);
    document.categories = document.categories.map(normalizeCategory).filter((item) => !belongs(item.path));
    const fallback = category.parentPath || 'Umum';
    document.items = document.items.map((item) => belongs(item.group ?? 'Umum') ? { ...item, group: fallback } : item);
    await this.writeDocument(document);
    return { ok: true, fallback };
  }

  async add(input) {
    const items = await this.list();
    const item = buildEntry(input);
    items.push(item);
    await this.save(items);
    return { ok: true, item };
  }

  async update(input = {}) {
    const items = await this.list();
    const index = items.findIndex((item) => item.id === input.id && !item.deletedAt);
    if (index < 0) throw new Error('Item tidak ditemukan.');
    items[index] = buildEntry(input, items[index]);
    await this.save(items);
    return { ok: true, item: items[index] };
  }

  async toggleFavorite(id) {
    const items = await this.list();
    const item = items.find((candidate) => candidate.id === id && !candidate.deletedAt);
    if (!item) throw new Error('Item tidak ditemukan.');
    item.favorite = !item.favorite;
    item.updatedAt = new Date().toISOString();
    await this.save(items);
    return { ok: true, item };
  }

  async useSecret(id, field) {
    if (!['username', 'password'].includes(field)) throw new Error('Field rahasia tidak valid.');
    const items = await this.list();
    const item = items.find((candidate) => candidate.id === id && !candidate.deletedAt);
    if (!item) throw new Error('Item tidak ditemukan.');
    const value = String(item[field] ?? '');
    item.usageCount = (item.usageCount ?? 0) + 1;
    item.lastUsedAt = new Date().toISOString();
    await this.save(items);
    return {
      value,
      usage: { id: item.id, usageCount: item.usageCount, lastUsedAt: item.lastUsedAt },
    };
  }

  async moveToTrash(id) {
    const items = await this.list();
    const item = items.find((candidate) => candidate.id === id && !candidate.deletedAt);
    if (!item) throw new Error('Item tidak ditemukan.');
    item.deletedAt = new Date().toISOString();
    item.updatedAt = item.deletedAt;
    await this.save(items);
    return { ok: true, item };
  }

  async restore(id) {
    const items = await this.list();
    const item = items.find((candidate) => candidate.id === id && candidate.deletedAt);
    if (!item) throw new Error('Item tidak ditemukan di Sampah.');
    item.deletedAt = null;
    item.updatedAt = new Date().toISOString();
    await this.save(items);
    return { ok: true, item };
  }

  async purge(id) {
    const items = await this.list();
    const filtered = items.filter((item) => item.id !== id || !item.deletedAt);
    if (filtered.length === items.length) throw new Error('Item tidak ditemukan di Sampah.');
    await this.save(filtered);
    return { ok: true };
  }

  async bulkUpdate(ids, changes = {}) {
    const selected = new Set(Array.isArray(ids) ? ids : []);
    const items = await this.list();
    let changed = 0;
    const group = changes.group === undefined ? undefined : String(changes.group).trim().slice(0, 80);
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (!selected.has(item.id) || item.deletedAt) continue;
      const patch = { ...item };
      if (group) patch.group = group;
      if (typeof changes.favorite === 'boolean') patch.favorite = changes.favorite;
      if (changes.tagMode && changes.tagMode !== 'unchanged') {
        const incoming = normalizeTags(changes.tags);
        if (changes.tagMode === 'replace') patch.tags = incoming;
        if (changes.tagMode === 'add') patch.tags = normalizeTags([...(item.tags ?? []), ...incoming]);
        if (changes.tagMode === 'remove') {
          const removed = new Set(incoming.map((tag) => tag.toLowerCase()));
          patch.tags = (item.tags ?? []).filter((tag) => !removed.has(tag.toLowerCase()));
        }
      }
      items[index] = buildEntry(patch, item);
      changed += 1;
    }
    if (!changed) throw new Error('Tidak ada item aktif yang dipilih.');
    await this.save(items);
    return { ok: true, changed, items: items.filter((item) => selected.has(item.id)) };
  }

  async bulkMoveToTrash(ids) {
    const selected = new Set(Array.isArray(ids) ? ids : []);
    const items = await this.list();
    const now = new Date().toISOString();
    let changed = 0;
    for (const item of items) {
      if (!selected.has(item.id) || item.deletedAt) continue;
      item.deletedAt = now;
      item.updatedAt = now;
      changed += 1;
    }
    if (!changed) throw new Error('Tidak ada item aktif yang dipilih.');
    await this.save(items);
    return { ok: true, changed };
  }

  async bulkRestore(ids) {
    const selected = new Set(Array.isArray(ids) ? ids : []);
    const items = await this.list();
    const now = new Date().toISOString();
    let changed = 0;
    for (const item of items) {
      if (!selected.has(item.id) || !item.deletedAt) continue;
      item.deletedAt = null;
      item.updatedAt = now;
      changed += 1;
    }
    if (!changed) throw new Error('Tidak ada item Sampah yang dipilih.');
    await this.save(items);
    return { ok: true, changed };
  }

  async bulkPurge(ids) {
    const selected = new Set(Array.isArray(ids) ? ids : []);
    const items = await this.list();
    const filtered = items.filter((item) => !selected.has(item.id) || !item.deletedAt);
    const changed = items.length - filtered.length;
    if (!changed) throw new Error('Tidak ada item Sampah yang dipilih.');
    await this.save(filtered);
    return { ok: true, changed };
  }
}

function parentPathOf(path) {
  const segments = path.split('/');
  segments.pop();
  return segments.join('/');
}

function normalizeCategory(category) {
  const path = String(category.path ?? category.name ?? '').trim().slice(0, 240);
  return {
    id: category.id,
    name: String(category.name ?? path.split('/').at(-1) ?? '').trim().slice(0, 80),
    path,
    parentPath: String(category.parentPath ?? parentPathOf(path)).trim().slice(0, 240),
    icon: FREE_SOLID_ICON_SET.has(category.icon) ? category.icon : 'folder',
    custom: true,
    createdAt: category.createdAt ?? new Date().toISOString(),
    updatedAt: category.updatedAt ?? category.createdAt ?? new Date().toISOString(),
  };
}

function buildCategory(input, existing = null) {
  const name = String(input.name ?? existing?.name ?? '').trim().replaceAll('/', '-').slice(0, 80);
  const parentPath = String(input.parentPath ?? existing?.parentPath ?? '').trim().replace(/^\/+|\/+$/g, '').slice(0, 240);
  if (!name) throw new Error('Nama kategori wajib diisi.');
  const icon = FREE_SOLID_ICON_SET.has(input.icon) ? input.icon : existing?.icon ?? 'folder';
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? crypto.randomUUID(),
    name,
    path: parentPath ? `${parentPath}/${name}` : name,
    parentPath,
    icon,
    custom: true,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

module.exports = { VaultService, normalizeCategory };
