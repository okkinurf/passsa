# PassSa

Password manager desktop Windows dengan vault lokal terenkripsi, Google OAuth desktop PKCE, dan sinkronisasi envelope terenkripsi melalui Google Drive.

## Menjalankan aplikasi

1. Pasang Node.js versi LTS.
2. Jalankan `npm install`.
3. Jalankan `npm start`.

## Autentikasi testing

- Akun disimpan pada folder `userData` milik Electron di Windows, bukan di repository.
- Email atau username dinormalisasi menjadi huruf kecil.
- Password minimal delapan karakter.
- Password di-hash menggunakan `scrypt` dengan salt acak; password asli tidak disimpan.
- Sesi hanya berada di memori dan berakhir saat aplikasi ditutup.

Login Google memverifikasi identitas, sementara password vault lokal tetap digunakan untuk menurunkan kunci enkripsi. Challenge Google terikat di main process, kedaluwarsa, dan hanya dapat dipakai satu kali.

Akun testing dapat dibuat atau diperbarui melalui script `npm run create-test-user` dengan environment variable `PASSA_TEST_USERNAME` dan `PASSA_TEST_PASSWORD`.

Sebanyak 50 item dummy beragam dapat dibuat dengan `npm run seed-dummy-vault`. Script memakai environment variable akun yang sama, mengganti dummy lama, dan mempertahankan item asli.
Set `PASSA_RESET_VAULT=true` untuk menghapus seluruh isi vault sebelum membuat dummy; operasi ini tidak mempertahankan item asli atau Sampah.

## Vault lokal

- Item login disimpan dalam `vault.json` di folder `userData` PassSa.
- Seluruh daftar item dienkripsi menggunakan AES-256-GCM.
- Kunci diturunkan dari password login menggunakan `scrypt` dan salt khusus vault.
- Kunci hanya berada di memori selama sesi login.
- Clipboard otomatis dibersihkan 30 detik setelah password atau username disalin.
- Entry mendukung grup, favorit, Sampah, dan riwayat 10 perubahan terakhir.
- Item dapat dipilih massal untuk edit grup/favorit, pindah ke Sampah, restore, atau hapus permanen.
- Tags terenkripsi mendukung pencarian, filter sidebar, chip pada item, serta add/remove/replace secara bulk.
- Statistik penggunaan terenkripsi mendukung urutan paling sering, paling baru, terakhir digunakan, dan nama.
- Seluruh kategori mendukung parent, rename, delete, dan pencarian katalog ikon Solid dari paket resmi Font Awesome Free.
- Pengaturan menyediakan export backup terenkripsi `.passsa` (AES-256-GCM dengan password backup terpisah) dan import dengan mode gabung atau ganti.
- CSV tersedia untuk interoperabilitas; CSV berisi password plaintext dan selalu meminta konfirmasi eksplisit sebelum export/import.
- Browser autofill tersedia melalui extension Chromium Manifest V3 di `browser-extension/`. Extension memakai Native Messaging, mencocokkan host/protocol/port secara ketat, dan meminta credential dari PassSa hanya setelah user memilih item.
- Item mendukung tipe `Secure Note` untuk catatan terenkripsi tanpa password login.
- Custom Fields mendukung Text, Secret, URL, Email, Angka, dan Ya/Tidak. Nilainya ikut dienkripsi dan hanya dibaca saat form edit dibuka; field Secret tidak dikirim dalam daftar item.
- Windows Hello dapat diaktifkan dari Pengaturan setelah login password pertama. Helper native meminta verifikasi Hello dan kunci vault dibungkus dengan `safeStorage`/DPAPI pada perangkat Windows yang sama; password vault tetap menjadi fallback.
- Hanya satu instance aplikasi yang dapat berjalan; penulisan JSON memakai lock file lintas proses, temporary file unik, dan backup.

## Google Drive sync

- Hanya envelope AES-256-GCM, salt, dan metadata revisi yang disimpan di `appDataFolder`; plaintext tidak diunggah.
- Refresh token dienkripsi menggunakan `safeStorage` Windows dan tidak dikirim ke renderer.
- Perubahan lokal atau remote satu arah disinkronkan otomatis setelah login Google.
- Jika kedua sisi berubah, remote utama tidak ditimpa dan salinan lokal disimpan sebagai file konflik terenkripsi.
- Konfigurasi: lihat `docs/GOOGLE_OAUTH_SETUP.md`.

## QA dan release

- `npm test`: unit/integration test.
- `npm run test:e2e`: smoke test UI Electron tersembunyi.
- `npm run qa`: unit dan E2E.
- `npm run dist`: build produksi yang wajib memiliki code-signing credential.
- `npm run dist:unsigned`: installer unsigned khusus QA lokal.
- Panduan release: lihat `docs/WINDOWS_RELEASE.md`.

Lisensi dependency visual tersedia di `THIRD_PARTY_NOTICES.md`.
- Struktur proyek mengadaptasi pemisahan core/crypto/storage/service/gui dari KeePassXC; lihat `docs/KEEPASSXC_ARCHITECTURE.md`.

## Batasan saat ini

- Google OAuth/Drive nyata memerlukan Desktop Client ID milik project Google Cloud pengguna.
- Installer produksi memerlukan certificate Authenticode atau Azure Trusted Signing milik publisher.
- Autofill production membutuhkan registrasi Native Messaging Host dan Extension ID resmi; lihat `docs/AUTOFILL_SETUP.md`.
