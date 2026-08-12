const { contextBridge } = require('electron');

let items = [
  { id: '1', title: 'GitHub QA', username: 'okki-qa', url: 'https://github.com', group: 'Internet/Coding', tags: ['coding', 'git', 'qa'], notes: 'Entry untuk smoke test.', favorite: true, usageCount: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'WiFi QA', username: 'qa-home', url: '', group: 'Rumah/Network', tags: ['wifi'], notes: 'Entry lokal.', favorite: false, usageCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const ok = async () => ({ ok: true });
contextBridge.exposeInMainWorld('passsa', {
  session: async () => null,
  login: async (email) => ({ ok: true, user: { id: 'qa-user', email } }),
  register: async (email) => ({ ok: true, user: { id: 'qa-user', email } }),
  googleLogin: async () => ({
    ok: true,
    autoCompleted: true,
    user: { id: 'qa-user', email: 'okki', provider: 'google', googleEmail: 'google@example.test' },
    sync: { ok: true, status: 'current', message: 'Vault sudah sinkron.' },
  }),
  googleComplete: async () => ({ ok: false }),
  logout: ok, lock: ok, onLocked: () => undefined,
  syncNow: async () => ({ ok: true, status: 'current', message: 'Vault sudah sinkron.' }),
  listItems: async () => structuredClone(items),
  getItem: async (id) => ({ ...structuredClone(items.find((item) => item.id === id)), password: 'qa-secret' }),
  addItem: async (input) => { const item = { ...input, id: String(items.length + 1), tags: [], usageCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; items.push(item); return { ok: true, item }; },
  updateItem: async (input) => ({ ok: true, item: input }),
  toggleFavorite: async (id) => ({ ok: true, item: items.find((item) => item.id === id) }),
  deleteItem: ok, restoreItem: ok, purgeItem: ok,
  bulkUpdate: ok, bulkDelete: ok, bulkRestore: ok, bulkPurge: ok,
  copyEntrySecret: async () => ({ usageCount: 1, lastUsedAt: new Date().toISOString() }),
  listCategories: async () => [
    { id: 'internet', name: 'Internet', path: 'Internet', parentPath: '', icon: 'globe' },
    { id: 'coding', name: 'Coding', path: 'Internet/Coding', parentPath: 'Internet', icon: 'code' },
    { id: 'rumah', name: 'Rumah', path: 'Rumah', parentPath: '', icon: 'house' },
    { id: 'network', name: 'Network', path: 'Rumah/Network', parentPath: 'Rumah', icon: 'wifi' },
  ],
  listCategoryIcons: async () => ['folder', 'globe', 'code', 'house', 'wifi'],
  createCategory: ok, updateCategory: ok, deleteCategory: ok, copySecret: ok,
});
