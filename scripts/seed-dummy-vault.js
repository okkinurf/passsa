const { app } = require('electron');
const crypto = require('node:crypto');
const path = require('node:path');
const { AtomicJsonStore } = require('../src/storage/atomic-json-store');
const {
  normalizeEmail,
  verifyPassword,
  deriveVaultKey,
  normalizeKdfParams,
  LEGACY_KDF,
  CURRENT_KDF,
} = require('../src/auth-crypto');
const { encryptVaultData, decryptVaultData } = require('../src/vault-crypto');

app.setName('passsa');

const samples = [
  ['Gmail Personal', 'okki.personal@example.test', 'https://accounts.google.com', 'Internet/Social', ['email', 'personal'], 'Email utama untuk komunikasi pribadi.'],
  ['GitHub Developer', 'okki-dev', 'https://github.com', 'Internet/Coding', ['coding', 'git'], 'Repository dan proyek pengembangan aplikasi.'],
  ['Microsoft 365', 'okki.office@example.test', 'https://account.microsoft.com', 'My Computer/Work', ['office', 'work'], 'Akun Office, OneDrive, dan perangkat Windows.'],
  ['Facebook', 'okki.social', 'https://facebook.com', 'Internet/Social', ['social', 'friends'], 'Akun media sosial untuk keluarga dan teman.'],
  ['Instagram', 'okki.photos', 'https://instagram.com', 'Internet/Social', ['social', 'photo'], 'Galeri foto dan konten pribadi.'],
  ['X / Twitter', 'okki_updates', 'https://x.com', 'Internet/Social', ['social', 'news'], 'Mengikuti berita teknologi dan komunitas.'],
  ['LinkedIn', 'okki-professional', 'https://linkedin.com', 'Internet/Social', ['career', 'work'], 'Profil profesional dan jaringan pekerjaan.'],
  ['Dropbox', 'okki.cloud@example.test', 'https://dropbox.com', 'My Computer/Cloud', ['cloud', 'backup'], 'Backup dokumen penting lintas perangkat.'],
  ['Notion Workspace', 'okki.notes@example.test', 'https://notion.so', 'Internet/Work', ['notes', 'work'], 'Catatan proyek, meeting, dan dokumentasi.'],
  ['Figma Design', 'okki.design@example.test', 'https://figma.com', 'Internet/Work', ['design', 'ui'], 'Workspace desain antarmuka PassSa.'],
  ['Canva', 'okki.creative@example.test', 'https://canva.com', 'Internet/Work', ['design', 'content'], 'Template presentasi dan konten sosial.'],
  ['Spotify', 'okki-music', 'https://spotify.com', 'Internet/Entertainment', ['music', 'personal'], 'Playlist musik harian dan podcast.'],
  ['Netflix', 'okki.watch@example.test', 'https://netflix.com', 'Internet/Entertainment', ['streaming', 'family'], 'Profil streaming keluarga.'],
  ['Steam', 'okki-games', 'https://store.steampowered.com', 'Internet/Gaming', ['gaming', 'pc'], 'Library game PC dan komunitas.'],
  ['Epic Games', 'okki-epic', 'https://store.epicgames.com', 'Internet/Gaming', ['gaming', 'store'], 'Game library dan klaim game mingguan.'],
  ['PlayStation Network', 'okki-console', 'https://www.playstation.com', 'Internet/Gaming', ['gaming', 'console'], 'Akun konsol dan PlayStation Store.'],
  ['Tokopedia', 'okki-shop', 'https://tokopedia.com', 'Internet/Shopping', ['shopping', 'marketplace'], 'Belanja kebutuhan elektronik dan rumah.'],
  ['Shopee', 'okki-market', 'https://shopee.co.id', 'Internet/Shopping', ['shopping', 'promo'], 'Marketplace untuk promo dan kebutuhan rutin.'],
  ['Blibli', 'okki.blibli@example.test', 'https://blibli.com', 'Internet/Shopping', ['shopping', 'electronics'], 'Belanja perangkat elektronik resmi.'],
  ['Amazon', 'okki.amazon@example.test', 'https://amazon.com', 'Internet/Shopping', ['shopping', 'international'], 'Pembelian barang dan ebook internasional.'],
  ['Trello Project', 'okki.trello@example.test', 'https://trello.com', 'Internet/Work', ['kanban', 'project'], 'Papan tugas proyek pribadi.'],
  ['Slack Team', 'okki.slack@example.test', 'https://slack.com', 'Internet/Work', ['chat', 'team'], 'Komunikasi dan notifikasi tim.'],
  ['Discord Community', 'okki-discord', 'https://discord.com', 'Internet/Social', ['chat', 'community'], 'Server komunitas teknologi dan game.'],
  ['Zoom Meeting', 'okki.zoom@example.test', 'https://zoom.us', 'Internet/Work', ['meeting', 'work'], 'Meeting daring dengan klien dan tim.'],
  ['Cloudflare', 'okki.cloudflare@example.test', 'https://dash.cloudflare.com', 'Internet/Coding', ['dns', 'security'], 'Pengaturan DNS, domain, dan keamanan situs.'],
  ['Vercel', 'okki-vercel', 'https://vercel.com', 'Internet/Coding', ['deploy', 'hosting'], 'Deployment aplikasi web dan preview.'],
  ['Netlify', 'okki.netlify@example.test', 'https://app.netlify.com', 'Internet/Coding', ['deploy', 'hosting'], 'Hosting situs statis dan form.'],
  ['Docker Hub', 'okki-container', 'https://hub.docker.com', 'Internet/Coding', ['docker', 'registry'], 'Registry image container proyek.'],
  ['npm Registry', 'okki-packages', 'https://www.npmjs.com', 'Internet/Coding', ['nodejs', 'packages'], 'Publikasi dan pengelolaan package Node.js.'],
  ['Stack Overflow', 'okki-coder', 'https://stackoverflow.com', 'Internet/Coding', ['coding', 'community'], 'Forum referensi pemrograman.'],
  ['Coursera', 'okki.learn@example.test', 'https://coursera.org', 'Internet/Education', ['course', 'learning'], 'Kursus keamanan dan pengembangan software.'],
  ['Udemy', 'okki.udemy@example.test', 'https://udemy.com', 'Internet/Education', ['course', 'video'], 'Koleksi kelas online yang sudah dibeli.'],
  ['Duolingo', 'okki-language', 'https://duolingo.com', 'Internet/Education', ['language', 'daily'], 'Latihan bahasa harian.'],
  ['Google Drive Sekolah', 'okki.study@example.test', 'https://drive.google.com', 'Internet/Education', ['school', 'cloud'], 'Dokumen pembelajaran dan materi kelas.'],
  ['Bank Digital Demo', '081234567890', 'https://example-bank.test', 'Finance/Banking', ['finance', 'bank'], 'Akun simulasi mobile banking—bukan akun asli.'],
  ['E-Wallet Demo', '081298765432', 'https://example-wallet.test', 'Finance/E-Wallet', ['finance', 'wallet'], 'Dompet digital dummy untuk pengujian.'],
  ['PayPal Sandbox', 'okki.paypal@example.test', 'https://sandbox.paypal.com', 'Finance/Payment', ['finance', 'sandbox'], 'Akun sandbox pembayaran internasional.'],
  ['BPJS Demo', '0001234567890', 'https://www.bpjsketenagakerjaan.go.id', 'Personal/Health', ['health', 'document'], 'Nomor peserta dummy untuk pengujian form.'],
  ['Portal Klinik', 'okki.patient@example.test', 'https://clinic.example.test', 'Personal/Health', ['health', 'medical'], 'Portal jadwal dan hasil pemeriksaan dummy.'],
  ['Traveloka', 'okki.travel@example.test', 'https://traveloka.com', 'Personal/Travel', ['travel', 'booking'], 'Pemesanan tiket dan hotel.'],
  ['Airbnb', 'okki.stay@example.test', 'https://airbnb.com', 'Personal/Travel', ['travel', 'stay'], 'Reservasi tempat menginap.'],
  ['GarudaMiles Demo', '1234567890', 'https://www.garuda-indonesia.com', 'Personal/Travel', ['travel', 'miles'], 'Nomor frequent flyer dummy.'],
  ['WiFi Rumah', 'rumah-okki', '', 'Rumah/Network', ['wifi', 'home'], 'Router utama ruang keluarga.'],
  ['WiFi Tamu', 'guest-passsa', '', 'Rumah/Network', ['wifi', 'guest'], 'Jaringan tamu dengan akses terbatas.'],
  ['Router Admin', 'admin', 'http://192.168.1.1', 'Rumah/Network', ['router', 'local'], 'Panel administrasi router lokal.'],
  ['NAS Rumah', 'okki-nas', 'http://192.168.1.10', 'Rumah/Storage', ['nas', 'backup'], 'Penyimpanan lokal foto dan backup.'],
  ['CCTV Rumah', 'operator', 'http://192.168.1.20', 'Rumah/Security', ['cctv', 'home'], 'Panel kamera keamanan lokal.'],
  ['Laptop Windows', 'okki', '', 'My Computer/Devices', ['windows', 'device'], 'Login perangkat Windows utama.'],
  ['Server Ubuntu', 'okki-admin', 'ssh://192.168.1.30', 'My Computer/Servers', ['linux', 'server'], 'Akun SSH server lab lokal.'],
  ['Database Development', 'passsa_dev', 'postgresql://localhost:5432', 'My Computer/Development', ['database', 'local'], 'Database lokal khusus pengembangan PassSa.'],
];

// Secure Notes dipakai untuk menguji seluruh editor Markdown tanpa menyimpan
// credential palsu di dalam note. Setiap contoh sengaja memakai kombinasi
// format yang berbeda agar toolbar, preview, checklist, tabel, custom fields,
// dan riwayat perubahan dapat diuji secara langsung.
const noteSamples = [
  {
    title: 'Project README', group: 'Internet/Work', tags: ['project', 'markdown', 'qa'],
    notes: '# Project README\n\n**Tujuan:** merapikan dokumentasi PassSa.\n\n## Checklist\n- [x] Tentukan struktur folder\n- [ ] Tulis panduan kontribusi\n- [ ] Review keamanan\n\n> **Catatan:** Semua contoh ini hanya data dummy.\n\n[Dokumentasi Markdown](https://www.markdownguide.org/)',
    fields: [{ id: 'note-0-owner', label: 'Owner', type: 'text', value: 'PassSa QA Team' }, { id: 'note-0-priority', label: 'Prioritas', type: 'number', value: '1' }],
  },
  {
    title: 'Meeting Product', group: 'Internet/Work', tags: ['meeting', 'product', 'team'],
    notes: '## Agenda\n\n1. Review roadmap\n2. Bahas risiko rilis\n3. Tentukan pemilik tugas\n\n> Keputusan: rilis beta dilakukan setelah QA selesai.\n\n==Follow-up==: kirim ringkasan ke tim.',
    fields: [{ id: 'note-1-date', label: 'Tanggal', type: 'text', value: '2026-08-24' }, { id: 'note-1-done', label: 'Selesai', type: 'boolean', value: false }],
  },
  {
    title: 'API Reference', group: 'Internet/Coding', tags: ['coding', 'api', 'reference'],
    notes: '# API Reference\n\nGunakan endpoint `GET /v1/items` untuk mengambil daftar item.\n\n```js\nconst response = await fetch(\'/v1/items\');\nconst items = await response.json();\n```\n\n| Method | Endpoint | Status |\n| --- | --- | --- |\n| GET | /v1/items | 200 |\n| POST | /v1/items | 201 |',
    fields: [{ id: 'note-2-base', label: 'Base URL', type: 'url', value: 'https://api.example.test' }, { id: 'note-2-contact', label: 'Contact', type: 'email', value: 'dev@example.test' }],
  },
  {
    title: 'Shopping Checklist', group: 'Internet/Shopping', tags: ['shopping', 'home', 'checklist'],
    notes: '# Belanja Mingguan\n\n- [ ] Kopi\n- [x] Sabun\n- [ ] Kabel USB-C\n\n### Catatan\nBandingkan harga dan cek ulasan sebelum membeli.\n\n---\n\n**Budget:** `Rp500.000`',
    fields: [{ id: 'note-3-budget', label: 'Budget', type: 'number', value: '500000' }],
  },
  {
    title: 'Trip Planner', group: 'Personal/Travel', tags: ['travel', 'plan', 'booking'],
    notes: '# Trip Planner\n\n| Hari | Agenda | Status |\n| :--- | :--- | :--- |\n| Jumat | Check-in | Selesai |\n| Sabtu | City tour | Rencana |\n| Minggu | Pulang | Rencana |\n\n> Simpan tiket offline sebelum berangkat.\n\n[Maps](https://maps.google.com) · **Bawa dokumen penting.**',
    fields: [{ id: 'note-4-city', label: 'Kota', type: 'text', value: 'Yogyakarta' }, { id: 'note-4-confirmed', label: 'Terkonfirmasi', type: 'boolean', value: true }],
  },
  {
    title: 'Health Journal', group: 'Personal/Health', tags: ['health', 'journal', 'private'],
    notes: '## Health Journal\n\n> Catatan ini bersifat dummy, bukan nasihat medis.\n\n- [ ] Minum air cukup\n- [x] Jalan kaki 30 menit\n- [ ] Tidur sebelum 23:00\n\n==Reminder==: konsultasikan keluhan ke tenaga profesional.',
    fields: [{ id: 'note-5-water', label: 'Target air (ml)', type: 'number', value: '2000' }, { id: 'note-5-private', label: 'Privat', type: 'boolean', value: true }],
  },
  {
    title: 'Home Network Plan', group: 'Rumah/Network', tags: ['home', 'network', 'router'],
    notes: '# Home Network\n\nTopologi sederhana:\n\n```text\nInternet -> Router -> Switch -> NAS\n```\n\n| Perangkat | IP |\n| --- | --- |\n| Router | 192.168.1.1 |\n| NAS | 192.168.1.10 |\n\n> Jangan menyimpan password asli di catatan dummy.',
    fields: [{ id: 'note-6-router', label: 'Router URL', type: 'url', value: 'http://192.168.1.1' }, { id: 'note-6-backup', label: 'Backup aktif', type: 'boolean', value: true }],
  },
  {
    title: 'Finance Monthly Review', group: 'Finance/Banking', tags: ['finance', 'review', 'monthly'],
    notes: '# Monthly Review\n\n**Ringkasan:** semua angka di bawah hanya simulasi.\n\n| Kategori | Nilai |\n| --- | ---: |\n| Tabungan | Rp2.000.000 |\n| Belanja | Rp750.000 |\n| Transport | Rp300.000 |\n\n- [x] Cocokkan transaksi\n- [ ] Buat anggaran bulan depan',
    fields: [{ id: 'note-7-period', label: 'Periode', type: 'text', value: 'Agustus 2026' }, { id: 'note-7-reviewed', label: 'Ditinjau', type: 'boolean', value: false }],
  },
  {
    title: 'Study Notes', group: 'Internet/Education', tags: ['study', 'learning', 'reference'],
    notes: '# Study Notes\n\n## Prinsip penting\n\n1. Pecah materi menjadi bagian kecil.\n2. Ulangi dengan interval.\n3. Uji pemahaman dengan contoh.\n\n`active recall` membantu mengingat lebih lama.\n\n[Referensi belajar](https://example.com/learning)',
    fields: [{ id: 'note-8-topic', label: 'Topik', type: 'text', value: 'Security basics' }],
  },
  {
    title: 'Personal Ideas', group: 'Personal/Ideas', tags: ['ideas', 'writing', 'draft'],
    notes: '## Ide Cerita\n\n> Tokoh utama menemukan vault digital yang menyimpan kenangan terenkripsi.\n\n### Alur\n- Pembuka misterius\n- Konflik kepercayaan\n- Resolusi terbuka\n\n==Draft== masih dapat berubah.\n\n---\n\n**Next:** tulis adegan pembuka.',
    fields: [{ id: 'note-9-status', label: 'Status', type: 'text', value: 'Draft' }, { id: 'note-9-ready', label: 'Siap dibagikan', type: 'boolean', value: false }],
  },
];

// Keep the seed deterministic in shape while making every generated item unique.
// The first pass uses the curated examples above; subsequent passes add a suffix
// so repeated categories, tags, and credentials are still easy to identify in QA.
const seedSamples = Array.from({ length: 100 }, (_, index) => {
  const base = samples[index % samples.length];
  const cycle = Math.floor(index / samples.length);
  if (cycle === 0) return base;
  const [title, itemUsername, url, group, tags, notes] = base;
  return [
    `${title} ${cycle + 1}`,
    `${itemUsername}-${cycle + 1}`,
    url,
    group,
    [...tags, `set-${cycle + 1}`],
    notes,
  ];
});

function randomPassword() {
  return `Demo-${crypto.randomBytes(12).toString('base64url')}!7`;
}

async function main() {
  const username = normalizeEmail(process.env.PASSA_TEST_USERNAME);
  const password = process.env.PASSA_TEST_PASSWORD ?? '';
  const authTarget = path.join(app.getPath('userData'), 'auth.json');
  const authStore = new AtomicJsonStore(authTarget, () => ({ version: 1, users: [] }));
  const auth = await authStore.read();
  const user = auth.users.find((candidate) => candidate.email === username);
  if (!user || !(await verifyPassword(password, user))) {
    throw new Error('Username atau password akun vault tidak valid.');
  }

  if (!user.vaultSalt) {
    user.vaultSalt = crypto.randomBytes(32).toString('base64');
    await authStore.update((latest) => {
      const current = latest.users.find((candidate) => candidate.id === user.id);
      if (!current) throw new Error('Akun tidak lagi tersedia.');
      current.vaultSalt = user.vaultSalt;
      return latest;
    });
  }

  const vaultTarget = path.join(app.getPath('userData'), 'vault.json');
  const vaultStore = new AtomicJsonStore(vaultTarget, () => ({ version: 1, vaults: {} }));
  const vaultFile = await vaultStore.read();
  const existingEnvelope = vaultFile.vaults[user.id];
  const vaultKdf = existingEnvelope
    ? normalizeKdfParams(existingEnvelope.kdf, LEGACY_KDF)
    : CURRENT_KDF;
  const key = await deriveVaultKey(password, Buffer.from(user.vaultSalt, 'base64'), vaultKdf);
  const resetVault = process.env.PASSA_RESET_VAULT === 'true';
  const now = new Date().toISOString();
  const dummyItems = seedSamples.map(([title, itemUsername, url, group, tags, notes], index) => {
    const createdAt = new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString();
    const usageCount = (index * 7 + 3) % 13;
    const noteSample = noteSamples[index];
    const isSecureNote = Boolean(noteSample);
    const useHistory = Array.from({ length: Math.min(usageCount, 4) }, (_, historyIndex) => ({
      field: ['password', 'username', 'url'][historyIndex % 3],
      usedAt: new Date(Date.now() - (index * 3 + historyIndex) * 60 * 60 * 1000).toISOString(),
    }));
    const currentPassword = isSecureNote ? '' : randomPassword();
    const passwordHistory = !isSecureNote && index % 6 === 0
      ? [1, 2].map((version) => ({
        title,
        username: itemUsername,
        password: `History-${index + 1}-${version}-Demo!`,
        url,
        notes,
        group,
        favorite: index % 7 === 0,
        tags,
        savedAt: new Date(Date.now() - (index + version) * 86_400_000).toISOString(),
      }))
      : [];
    const customFields = noteSample?.fields ?? (index % 5 === 0
      ? [
        { id: `field-${index}-recovery`, label: 'Recovery Code', type: 'secret', value: `REC-${String(index + 1).padStart(3, '0')}-DEMO` },
        { id: `field-${index}-owner`, label: 'Owner', type: 'text', value: 'PassSa QA Team' },
        { id: `field-${index}-verified`, label: 'Verified', type: 'boolean', value: index % 2 === 0 },
      ]
      : index % 7 === 0
        ? [{ id: `field-${index}-ticket`, label: 'Ticket', type: 'number', value: String(1000 + index) }]
        : []);
    const noteHistory = noteSample
      ? Array.from({ length: index === 0 ? 5 : (index % 3) + 1 }, (_, version) => ({
        title: noteSample.title,
        notes: `${noteSample.notes}\n\n> Versi history ${version + 1} — perubahan dummy.`,
        group: noteSample.group,
        tags: noteSample.tags,
        fields: noteSample.fields,
        savedAt: new Date(Date.now() - (version + 1) * 86_400_000).toISOString(),
      }))
      : [];
    const itemTags = noteSample?.tags ?? [...tags, index % 3 === 0 ? 'penting' : 'demo', index % 4 === 0 ? 'quick-access' : 'qa'];
    return {
    id: crypto.randomUUID(),
    type: isSecureNote ? 'secure-note' : 'login',
    title: noteSample?.title ?? title,
    username: isSecureNote ? '' : itemUsername,
    password: currentPassword,
    url: isSecureNote ? '' : url,
    group: noteSample?.group ?? group,
    tags: itemTags,
    favorite: index % 7 === 0,
    quickPinned: index % 10 === 0,
    usageCount,
    lastUsedAt: usageCount ? new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString() : null,
    recentUseHistory: useHistory,
    history: isSecureNote ? [] : passwordHistory,
    noteHistory,
    fields: customFields,
    notes: noteSample?.notes ?? `${notes} Data dummy; jangan digunakan sebagai kredensial asli.`,
    source: 'passsa-dummy',
    createdAt,
    updatedAt: createdAt,
  };
  });

  let removedCount = 0;
  await vaultStore.update((latest) => {
    latest.vaults ||= {};
    const vaultDocument = decryptVaultData(latest.vaults[user.id], key);
    const existingItems = vaultDocument.items;
    removedCount = existingItems.length;
    const realItems = resetVault ? [] : existingItems.filter((item) => item.source !== 'passsa-dummy');
    vaultDocument.items = [...realItems, ...dummyItems];
    latest.vaults[user.id] = { ...encryptVaultData(vaultDocument, key), kdf: vaultKdf, updatedAt: now };
    return latest;
  });
  key.fill(0);
  console.log(`Berhasil membuat ${dummyItems.length} item dummy untuk '${username}'.`);
  console.log(`Fitur dummy: ${dummyItems.filter((item) => item.type === 'secure-note').length} secure note, ${dummyItems.filter((item) => item.fields?.length).length} custom fields, ${dummyItems.filter((item) => item.history?.length).length} password history, ${dummyItems.filter((item) => item.quickPinned).length} Quick Access pin, ${dummyItems.filter((item) => item.favorite).length} favorit, ${dummyItems.filter((item) => item.usageCount > 0).length} item ber-riwayat penggunaan.`);
  if (resetVault) console.log(`Vault lama dikosongkan (${removedCount} item dihapus).`);
}

app.whenReady()
  .then(main)
  .then(() => app.quit())
  .catch((error) => {
    console.error(error.message);
    app.exit(1);
  });
