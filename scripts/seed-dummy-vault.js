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
    return {
    id: crypto.randomUUID(),
    title,
    username: itemUsername,
    password: randomPassword(),
    url,
    group,
    tags: [...tags, index % 3 === 0 ? 'penting' : 'demo'],
    favorite: index % 7 === 0,
    usageCount,
    lastUsedAt: usageCount ? new Date(Date.now() - index * 3 * 60 * 60 * 1000).toISOString() : null,
    notes: `${notes} Data dummy; jangan digunakan sebagai kredensial asli.`,
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
  if (resetVault) console.log(`Vault lama dikosongkan (${removedCount} item dihapus).`);
}

app.whenReady()
  .then(main)
  .then(() => app.quit())
  .catch((error) => {
    console.error(error.message);
    app.exit(1);
  });
