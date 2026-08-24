const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { VaultService } = require('../src/services/vault-service');

class MemoryStore {
  constructor() { this.value = { version: 1, vaults: {} }; }
  async read() { return structuredClone(this.value); }
  async write(value) { this.value = structuredClone(value); }
  async update(mutator) { this.value = await mutator(structuredClone(this.value)); return this.read(); }
}

function createService() {
  const store = new MemoryStore();
  const context = { user: { id: 'user-1' }, key: crypto.randomBytes(32) };
  return new VaultService(store, { context: () => context });
}

test('vault service menjalankan lifecycle entry dan soft delete', async () => {
  const service = createService();
  const added = await service.add({ title: 'Gmail', password: 'secret', group: 'Personal' });
  assert.equal((await service.list()).length, 1);
  assert.equal((await service.toggleFavorite(added.item.id)).item.favorite, true);
  assert.ok((await service.moveToTrash(added.item.id)).item.deletedAt);
  assert.equal((await service.restore(added.item.id)).item.deletedAt, null);
  await service.moveToTrash(added.item.id);
  await service.purge(added.item.id);
  assert.equal((await service.list()).length, 0);
});

test('setiap perubahan password menyimpan versi sebelumnya, tanpa duplikasi saat metadata berubah', async () => {
  const service = createService();
  const added = await service.add({ title: 'Riwayat', password: 'password-awal' });
  const metadataUpdate = await service.update({ ...added.item, title: 'Riwayat diperbarui' });
  assert.equal(metadataUpdate.item.history.length, 0);
  const passwordUpdate = await service.update({ ...metadataUpdate.item, password: 'password-baru' });
  assert.equal(passwordUpdate.item.history.length, 1);
  assert.equal(passwordUpdate.item.history[0].password, 'password-awal');
  const secondPasswordUpdate = await service.update({ ...passwordUpdate.item, password: 'password-terakhir' });
  assert.equal(secondPasswordUpdate.item.history.length, 2);
  assert.deepEqual(secondPasswordUpdate.item.history.map((entry) => entry.password), ['password-awal', 'password-baru']);
  const editable = await service.getForEditing(added.item.id);
  assert.deepEqual(editable.passwordHistory.map((entry) => entry.password), ['password-awal', 'password-baru']);
  assert.equal(editable.history, undefined);
});

test('bulk update, delete, restore, dan purge bekerja untuk banyak entry', async () => {
  const service = createService();
  const first = await service.add({ title: 'Satu', password: 'secret-1' });
  const second = await service.add({ title: 'Dua', password: 'secret-2' });
  const ids = [first.item.id, second.item.id];
  const updated = await service.bulkUpdate(ids, { group: 'Internet/Coding', favorite: true });
  assert.equal(updated.changed, 2);
  assert.ok(updated.items.every((item) => item.favorite && item.group === 'Internet/Coding'));
  assert.equal((await service.bulkMoveToTrash(ids)).changed, 2);
  assert.ok((await service.list()).every((item) => item.deletedAt));
  assert.equal((await service.bulkRestore(ids)).changed, 2);
  await service.bulkMoveToTrash(ids);
  assert.equal((await service.bulkPurge(ids)).changed, 2);
  assert.equal((await service.list()).length, 0);
});

test('bulk edit dapat menambah, menghapus, dan mengganti tags', async () => {
  const service = createService();
  const first = await service.add({ title: 'Satu', password: 'secret-1', tags: ['awal'] });
  const second = await service.add({ title: 'Dua', password: 'secret-2' });
  const ids = [first.item.id, second.item.id];
  await service.bulkUpdate(ids, { tagMode: 'add', tags: 'kerja, penting' });
  assert.ok((await service.list()).every((item) => item.tags.includes('kerja')));
  await service.bulkUpdate(ids, { tagMode: 'remove', tags: 'kerja' });
  assert.ok((await service.list()).every((item) => !item.tags.includes('kerja')));
  await service.bulkUpdate(ids, { tagMode: 'replace', tags: 'final' });
  assert.ok((await service.list()).every((item) => item.tags.join() === 'final'));
});

test('menyalin secret memperbarui statistik penggunaan', async () => {
  const service = createService();
  const added = await service.add({ title: 'Sering Dipakai', username: 'user', password: 'secret' });
  const first = await service.useSecret(added.item.id, 'password');
  const second = await service.useSecret(added.item.id, 'username');
  assert.equal(first.value, 'secret');
  assert.equal(second.value, 'user');
  assert.equal(second.usage.usageCount, 2);
  assert.ok(second.usage.lastUsedAt);
  assert.deepEqual(second.usage.recentUseHistory.map((entry) => entry.field), ['password', 'username']);
});

test('Quick Access dapat menyematkan credential dan mencatat aksi copy tanpa menyimpan secret di history', async () => {
  const service = createService();
  const added = await service.add({ title: 'Quick', username: 'user', password: 'secret', url: 'https://example.test' });
  const pinned = await service.toggleQuickPinned(added.item.id);
  assert.equal(pinned.item.quickPinned, true);
  await service.useSecret(added.item.id, 'url');
  const item = (await service.list())[0];
  assert.equal(item.quickPinned, true);
  assert.deepEqual(item.recentUseHistory.map((entry) => entry.field), ['url']);
  assert.ok(item.recentUseHistory.every((entry) => !Object.hasOwn(entry, 'value')));
});

test('Quick Access mencatat Secure Note yang dibuka di riwayat penggunaan', async () => {
  const service = createService();
  const added = await service.add({ title: 'Catatan Quick', type: 'secure-note', notes: 'Isi aman' });
  const used = await service.useNote(added.item.id);
  assert.equal(used.usage.field, 'note');
  assert.equal(used.usage.usageCount, 1);
  const item = (await service.list())[0];
  assert.equal(item.lastUsedAt, used.usage.lastUsedAt);
  assert.deepEqual(item.recentUseHistory.map((entry) => entry.field), ['note']);
});

test('Quick Access dapat membersihkan riwayat penggunaan tanpa melepas pin', async () => {
  const service = createService();
  const added = await service.add({ title: 'Quick', username: 'user', password: 'secret', quickPinned: true });
  await service.useSecret(added.item.id, 'password');
  const result = await service.clearRecentUsage();
  assert.equal(result.cleared, 1);
  const item = (await service.list())[0];
  assert.equal(item.quickPinned, true);
  assert.equal(item.usageCount, 0);
  assert.equal(item.lastUsedAt, null);
  assert.deepEqual(item.recentUseHistory, []);
  assert.equal((await service.clearRecentUsage()).cleared, 0);
});

test('kategori custom dapat dibuat, diubah, dan dihapus tanpa menghapus entry', async () => {
  const service = createService();
  const created = await service.createCategory({ name: 'Kantor', parentPath: 'Internet', icon: 'briefcase' });
  await service.add({ title: 'Portal', password: 'secret', group: created.category.path });
  const updated = await service.updateCategory({ ...created.category, name: 'Pekerjaan', parentPath: 'Internet', icon: 'building' });
  assert.equal(updated.category.path, 'Internet/Pekerjaan');
  assert.equal((await service.list())[0].group, 'Internet/Pekerjaan');
  await service.deleteCategory(created.category.id);
  assert.deepEqual((await service.listCategories()).map((category) => category.path), ['Internet']);
  assert.equal((await service.list())[0].group, 'Internet');
});

test('kategori lama diinferensikan dari path entry dan katalog ikon Free tersedia', async () => {
  const service = createService();
  await service.add({ title: 'Git', password: 'secret', group: 'Internet/Coding' });
  const categories = await service.listCategories();
  assert.deepEqual(categories.map((category) => category.path).sort(), ['Internet', 'Internet/Coding']);
  assert.ok(service.categoryIcons().length > 500);
  assert.ok(service.categoryIcons().includes('folder'));
});
