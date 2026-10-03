const crypto = require('node:crypto');
const { buildEntry } = require('../core/vault-entry');
const { defaultIconForCategory } = require('../core/category-icons');
const { generateSecret } = require('../totp');

const DUMMY_SOURCE = 'passsa-dummy';
const DAY = 24 * 60 * 60 * 1000;

const loginTemplates = [
  ['Gmail Personal', 'email', 'https://accounts.google.com', 'Internet/Social'],
  ['GitHub Developer', 'coding', 'https://github.com', 'Internet/Coding'],
  ['Microsoft 365', 'office', 'https://account.microsoft.com', 'My Computer/Work'],
  ['Facebook', 'social', 'https://facebook.com', 'Internet/Social'],
  ['Instagram', 'photo', 'https://instagram.com', 'Internet/Social'],
  ['LinkedIn', 'career', 'https://linkedin.com', 'Internet/Social'],
  ['Dropbox', 'cloud', 'https://dropbox.com', 'My Computer/Cloud'],
  ['Notion Workspace', 'notes', 'https://notion.so', 'Internet/Work'],
  ['Figma Design', 'design', 'https://figma.com', 'Internet/Work'],
  ['Spotify', 'music', 'https://spotify.com', 'Internet/Entertainment'],
  ['Netflix', 'streaming', 'https://netflix.com', 'Internet/Entertainment'],
  ['Steam', 'gaming', 'https://store.steampowered.com', 'Internet/Gaming'],
  ['Tokopedia', 'shopping', 'https://tokopedia.com', 'Internet/Shopping'],
  ['Trello Project', 'project', 'https://trello.com', 'Internet/Work'],
  ['Cloudflare', 'security', 'https://dash.cloudflare.com', 'Internet/Coding'],
  ['Vercel', 'deploy', 'https://vercel.com', 'Internet/Coding'],
  ['Coursera', 'learning', 'https://coursera.org', 'Internet/Education'],
  ['Bank Demo', 'finance', 'https://bank.example.test', 'Finance/Banking'],
  ['Wallet Sandbox', 'wallet', 'https://wallet.example.test', 'Finance/Payment'],
  ['Travel Planner', 'travel', 'https://travel.example.test', 'Personal/Travel'],
  ['WiFi Rumah', 'wifi', '', 'Rumah/Network'],
  ['Router Admin', 'router', 'http://192.0.2.1', 'Rumah/Network'],
  ['Laptop Windows', 'device', '', 'My Computer/Devices'],
  ['Server Lab', 'server', 'ssh://192.0.2.30', 'My Computer/Servers'],
];

const noteTemplates = [
  ['Project README', 'Internet/Work', ['project', 'markdown', 'qa'], '# Project README\n\n**Tujuan:** merapikan dokumentasi aplikasi.\n\n## Checklist\n- [x] Tentukan struktur\n- [ ] Review keamanan\n\n> Semua isi adalah data dummy.\n\n[Dokumentasi](https://example.test/docs)'],
  ['Meeting Product', 'Internet/Work', ['meeting', 'product', 'team'], '## Agenda\n\n1. Review roadmap\n2. Bahas risiko\n3. Tentukan pemilik tugas\n\n> Keputusan: lanjutkan setelah QA.'],
  ['API Reference', 'Internet/Coding', ['coding', 'api', 'reference'], '# API Reference\n\nGunakan `GET /v1/items` untuk daftar item.\n\n```js\nconst items = await fetch(\'/v1/items\');\n```\n\n| Method | Status |\n| --- | --- |\n| GET | 200 |'],
  ['Shopping Checklist', 'Internet/Shopping', ['shopping', 'home', 'checklist'], '# Belanja Mingguan\n\n- [ ] Kopi\n- [x] Sabun\n- [ ] Kabel USB-C\n\n**Budget:** Rp500.000 (simulasi).'],
  ['Trip Planner', 'Personal/Travel', ['travel', 'plan', 'booking'], '# Trip Planner\n\n| Hari | Agenda |\n| --- | --- |\n| Jumat | Check-in |\n| Sabtu | City tour |\n\n> Contoh saja; tidak ada booking asli.'],
  ['Health Journal', 'Personal/Health', ['health', 'journal', 'private'], '## Health Journal\n\n> Catatan dummy, bukan nasihat medis.\n\n- [ ] Minum air\n- [x] Jalan kaki\n- [ ] Istirahat cukup'],
  ['Home Network Plan', 'Rumah/Network', ['home', 'network', 'router'], '# Home Network\n\n```text\nInternet -> Router -> NAS\n```\n\n| Perangkat | IP dokumentasi |\n| --- | --- |\n| Router | 192.0.2.1 |'],
  ['Finance Monthly Review', 'Finance/Banking', ['finance', 'review', 'monthly'], '# Monthly Review\n\n**Angka simulasi.**\n\n| Kategori | Nilai |\n| --- | ---: |\n| Tabungan | Rp2.000.000 |\n| Belanja | Rp750.000 |\n\n- [x] Cocokkan transaksi'],
  ['Study Notes', 'Internet/Education', ['study', 'learning', 'reference'], '# Study Notes\n\n## Prinsip\n\n1. Pecah materi.\n2. Ulangi berkala.\n3. Uji pemahaman.\n\n`active recall` membantu belajar.'],
  ['Personal Ideas', 'Personal/Ideas', ['ideas', 'writing', 'draft'], '## Ide Cerita\n\n> Cerita fiksi tentang vault digital.\n\n### Alur\n- Pembuka misterius\n- Konflik kepercayaan\n- Resolusi terbuka\n\n**Status:** draft.'],
];

const authenticatorTemplates = [
  ['GitHub QA', 'GitHub', 'Internet/Coding'],
  ['Google QA', 'Google', 'Internet/Social'],
  ['Microsoft QA', 'Microsoft', 'My Computer/Work'],
  ['Cloudflare QA', 'Cloudflare', 'Internet/Coding'],
  ['Demo Bank QA', 'Demo Bank', 'Finance/Banking'],
  ['PassSa Test Issuer', 'PassSa QA', 'My Computer/Development'],
  ['Trello QA', 'Trello', 'Internet/Work'],
  ['Hosting QA', 'Hosting Demo', 'Internet/Coding'],
  ['Travel QA', 'Travel Demo', 'Personal/Travel'],
  ['Home Lab QA', 'Home Lab', 'Rumah/Network'],
];

const deletedIndexes = new Set([8, 25, 47, 69, 91, 128, 146, 173, 198]);

function timestampDaysAgo(days) {
  return new Date(Date.now() - days * DAY).toISOString();
}

function makeItem(data, index, type) {
  const createdAt = timestampDaysAgo((index * 7) % 365);
  const usageCount = (index * 7 + 3) % 18;
  const entry = buildEntry({
    type,
    title: data.title,
    username: data.username ?? '',
    password: data.password ?? '',
    url: data.url ?? '',
    notes: data.notes ?? `Data uji PassSa. Item ini bukan kredensial asli.`,
    group: data.group,
    tags: data.tags,
    favorite: index % 7 === 0,
    quickPinned: index % 11 === 0,
    fields: data.fields ?? [],
    totp: data.totp,
  });

  entry.source = DUMMY_SOURCE;
  entry.createdAt = createdAt;
  entry.updatedAt = createdAt;
  entry.usageCount = usageCount;
  entry.lastUsedAt = usageCount ? timestampDaysAgo((index * 3) % 45) : null;
  entry.recentUseHistory = Array.from({ length: Math.min(usageCount, 4) }, (_, historyIndex) => ({
    field: type === 'authenticator' ? 'totp' : type === 'secure-note' ? 'note' : ['password', 'username', 'url'][historyIndex % 3],
    usedAt: timestampDaysAgo((index + historyIndex) % 30),
  }));
  entry.deletedAt = deletedIndexes.has(index) ? timestampDaysAgo(index % 14) : null;

  if (type === 'login' && index % 6 === 0) {
    entry.history = [1, 2].map((version) => ({
      title: data.title,
      username: data.username,
      password: `Old-Demo-${String(index + 1).padStart(3, '0')}-${version}!`,
      url: data.url,
      notes: data.notes,
      group: data.group,
      favorite: entry.favorite,
      tags: data.tags,
      savedAt: timestampDaysAgo(index + version + 1),
    }));
  }

  if (type === 'secure-note') {
    entry.noteHistory = [1, 2].map((version) => ({
      title: data.title,
      notes: `${data.notes}\n\n> Contoh versi riwayat ${version} (dummy).`,
      group: data.group,
      tags: data.tags,
      fields: data.fields ?? [],
      savedAt: timestampDaysAgo(index + version + 1),
    }));
  }
  return entry;
}

function createDummyVaultData() {
  const items = [];
  for (let index = 0; index < 120; index += 1) {
    const template = loginTemplates[index % loginTemplates.length];
    const cycle = Math.floor(index / loginTemplates.length) + 1;
    const [name, tag, url, group] = template;
    const title = `${name} ${String(index + 1).padStart(3, '0')}`;
    items.push(makeItem({
      title,
      username: `demo${String(index + 1).padStart(3, '0')}@example.test`,
      password: `Demo-Only!${String(index + 1).padStart(3, '0')}aA`,
      url,
      group,
      tags: [tag, cycle % 2 ? 'demo' : 'qa', index % 3 === 0 ? 'important' : 'sample'],
      notes: `${name} — akun dummy untuk pengujian UI. Jangan digunakan sebagai akun sungguhan.`,
      fields: index % 4 === 0 ? [
        { id: `dummy-${index}-recovery`, label: 'Recovery Code (dummy)', type: 'secret', value: `REC-DEMO-${String(index + 1).padStart(3, '0')}` },
        { id: `dummy-${index}-owner`, label: 'Pemilik contoh', type: 'text', value: 'Tim QA PassSa' },
        { id: `dummy-${index}-verified`, label: 'Terverifikasi', type: 'boolean', value: index % 2 === 0 },
      ] : index % 10 === 1 ? [
        { id: `dummy-${index}-portal`, label: 'Portal bantuan', type: 'url', value: 'https://support.example.test' },
      ] : index % 10 === 2 ? [
        { id: `dummy-${index}-contact`, label: 'Kontak dummy', type: 'email', value: `help${index}@example.test` },
      ] : index % 7 === 0 ? [
        { id: `dummy-${index}-ticket`, label: 'Nomor tiket', type: 'number', value: String(1000 + index) },
      ] : [],
    }, index, 'login'));
  }

  for (let offset = 0; offset < 40; offset += 1) {
    const index = 120 + offset;
    const template = noteTemplates[offset % noteTemplates.length];
    const [name, group, tags, notes] = template;
    const cycle = Math.floor(offset / noteTemplates.length) + 1;
    items.push(makeItem({
      title: `${name} ${String(offset + 1).padStart(2, '0')}`,
      group,
      tags: [...tags, `batch-${cycle}`],
      notes: `${notes}\n\n---\n\n**Variasi:** contoh ${cycle}. Semua konten ini hanya data dummy.`,
      fields: [
        { id: `dummy-note-${offset}-owner`, label: 'Owner', type: 'text', value: 'PassSa QA Team' },
        { id: `dummy-note-${offset}-status`, label: 'Selesai', type: 'boolean', value: offset % 2 === 0 },
        ...(offset % 3 === 0 ? [{ id: `dummy-note-${offset}-priority`, label: 'Prioritas', type: 'number', value: String((offset % 5) + 1) }] : []),
      ],
    }, index, 'secure-note'));
  }

  for (let offset = 0; offset < 40; offset += 1) {
    const index = 160 + offset;
    const [name, issuer, group] = authenticatorTemplates[offset % authenticatorTemplates.length];
    const digits = offset % 4 === 0 ? 8 : 6;
    const algorithms = ['sha1', 'sha256', 'sha512'];
    const periods = [15, 30, 45, 60, 90, 120];
    items.push(makeItem({
      title: `${name} ${String(offset + 1).padStart(2, '0')}`,
      username: `auth${String(offset + 1).padStart(2, '0')}@example.test`,
      group,
      tags: ['authenticator', '2fa', offset % 2 ? 'demo' : 'qa'],
      notes: 'Authenticator dummy untuk mencoba kode TOTP, detail akun, salin kode, dan konfigurasi. Tidak terhubung ke layanan asli.',
      totp: {
        issuer,
        account: `auth${String(offset + 1).padStart(2, '0')}@example.test`,
        secret: generateSecret(),
        algorithm: algorithms[offset % algorithms.length],
        digits,
        period: periods[offset % periods.length],
      },
    }, index, 'authenticator'));
  }

  const categoryPaths = new Set();
  for (const item of items) {
    const segments = item.group.split('/');
    for (let depth = 1; depth <= segments.length; depth += 1) categoryPaths.add(segments.slice(0, depth).join('/'));
  }
  const createdAt = new Date().toISOString();
  const categories = [...categoryPaths].map((categoryPath) => {
    const segments = categoryPath.split('/');
    const name = segments.at(-1);
    return {
      id: crypto.randomUUID(),
      name,
      path: categoryPath,
      parentPath: segments.slice(0, -1).join('/'),
      icon: defaultIconForCategory(name),
      custom: true,
      createdAt,
      updatedAt: createdAt,
    };
  });

  return { items, categories };
}

module.exports = { createDummyVaultData, DUMMY_SOURCE };
