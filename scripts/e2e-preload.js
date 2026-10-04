const { contextBridge } = require('electron');

const seedItems = [
  { id: '1', title: 'GitHub QA', username: 'okki-qa', url: 'https://github.com', group: 'Internet/Coding', tags: ['coding', 'git', 'qa'], notes: 'Entry untuk smoke test.', favorite: true, usageCount: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'WiFi QA', username: 'qa-home', url: '', group: 'Rumah/Network', tags: ['wifi'], notes: 'Entry lokal.', favorite: false, usageCount: 0, history: [{ password: 'qa-previous-secret', savedAt: new Date(Date.now() - 86_400_000).toISOString() }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];
const requestedItemCount = Math.max(2, Math.min(Number.parseInt(process.env.PASSA_E2E_ITEMS ?? '2', 10) || 2, 5000));
let items = Array.from({ length: requestedItemCount }, (_, index) => {
  if (index < seedItems.length) return structuredClone(seedItems[index]);
  const id = String(index + 1);
  const group = index % 2 === 0 ? 'Internet/Coding' : 'Rumah/Network';
  return {
    id,
    title: `Entry QA ${index + 1}`,
    username: `qa-${index + 1}`,
    url: `https://example-${index + 1}.test`,
    group,
    tags: index % 3 === 0 ? ['qa', 'benchmark', 'generated'] : ['qa'],
    notes: `Data benchmark untuk entry ${index + 1}.`,
    favorite: index % 10 === 0,
    usageCount: index % 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

const ok = async () => ({ ok: true });
let appSettings = { startWithWindows: false, minimizeToTray: false, quickAccessEnabled: true };
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
  helloStatus: async () => ({ ok: true, supported: false, enabled: false }),
  helloEnable: async () => ({ ok: false, message: 'Windows Hello tidak tersedia dalam smoke test.' }),
  helloDisable: async () => ({ ok: true, enabled: false }),
  helloUnlock: async () => ({ ok: false, message: 'Windows Hello tidak tersedia dalam smoke test.' }),
  getAppSettings: async () => ({ ...appSettings }),
  // The current titlebar reports both sync providers; model S3 as an available
  // but disconnected provider so this Electron UI smoke test can assert the
  // same empty-state shown by the Tauri desktop app.
  s3SyncInfo: async () => ({ ok: true, connected: false }),
  setAppSettings: async (input = {}) => {
    appSettings = {
      startWithWindows: input.startWithWindows === true,
      minimizeToTray: input.minimizeToTray === true,
      quickAccessEnabled: input.quickAccessEnabled !== false,
    };
    return { ok: true, ...appSettings };
  },
  logout: ok, lock: ok, onLocked: () => undefined,
  syncNow: async () => ({ ok: true, status: 'current', message: 'Vault sudah sinkron.' }),
  disconnectGoogle: async () => ({ ok: true }),
  listItems: async () => structuredClone(items),
  getItem: async (id) => {
    const item = structuredClone(items.find((candidate) => candidate.id === id));
    return { ...item, password: 'qa-secret', passwordHistory: item?.history ?? [], noteHistory: item?.noteHistory ?? [] };
  },
  addItem: async (input) => { const item = { ...input, id: String(items.length + 1), tags: [], usageCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; items.push(item); return { ok: true, item }; },
  updateItem: async (input) => {
    const index = items.findIndex((item) => item.id === input.id);
    if (index < 0) return { ok: false, message: 'Item tidak ditemukan.' };
    const next = structuredClone(input);
    next.tags = Array.isArray(next.tags) ? next.tags : String(next.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean);
    const previous = items[index];
    if (previous.type === 'secure-note' && next.type === 'secure-note' && previous.notes !== next.notes) {
      next.noteHistory = [...(previous.noteHistory ?? []), {
        title: previous.title,
        notes: previous.notes,
        group: previous.group,
        tags: previous.tags ?? [],
        fields: previous.fields ?? [],
        savedAt: previous.updatedAt,
      }];
    }
    items[index] = { ...items[index], ...next, updatedAt: new Date().toISOString() };
    return { ok: true, item: structuredClone(items[index]) };
  },
  toggleFavorite: async (id) => ({ ok: true, item: items.find((item) => item.id === id) }),
  deleteItem: async (id) => {
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return { ok: false, message: 'Item tidak ditemukan.' };
    items[index] = { ...items[index], deletedAt: new Date().toISOString() };
    return { ok: true, item: structuredClone(items[index]) };
  },
  restoreItem: ok, purgeItem: ok,
  bulkUpdate: ok, bulkDelete: ok, bulkRestore: ok, bulkPurge: ok,
  copyEntrySecret: async () => ({ usageCount: 1, lastUsedAt: new Date().toISOString() }),
  listTotpCodes: async (ids = []) => Object.fromEntries(
    items
      .filter((item) => ids.includes(item.id) && item.type === 'authenticator')
      .map((item) => [item.id, { code: '123456', remaining: 30, period: 30 }]),
  ),
  copyTotpCode: async (id) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return { ok: false, message: 'Authenticator tidak ditemukan.' };
    item.usageCount = (item.usageCount || 0) + 1;
    item.lastUsedAt = new Date().toISOString();
    return { ok: true, usageCount: item.usageCount, lastUsedAt: item.lastUsedAt };
  },
  listCategories: async () => [
    { id: 'internet', name: 'Internet', path: 'Internet', parentPath: '', icon: 'globe' },
    { id: 'coding', name: 'Coding', path: 'Internet/Coding', parentPath: 'Internet', icon: 'code' },
    { id: 'rumah', name: 'Rumah', path: 'Rumah', parentPath: '', icon: 'house' },
    { id: 'network', name: 'Network', path: 'Rumah/Network', parentPath: 'Rumah', icon: 'wifi' },
  ],
  listCategoryIcons: async () => ['folder', 'globe', 'code', 'house', 'wifi'],
  createCategory: ok, updateCategory: ok, deleteCategory: ok, copySecret: ok,
});
