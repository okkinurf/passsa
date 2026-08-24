# 🔐 PassSa

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-0078D6.svg?logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-39-47848F.svg?logo=electron&logoColor=white)
![Encryption](https://img.shields.io/badge/encryption-AES--256--GCM-success.svg)

**PassSa** adalah password manager desktop untuk Windows dengan pendekatan **local-first**. Credential disimpan di vault lokal terenkripsi dan dapat disinkronkan secara opsional ke Google Drive dalam bentuk envelope terenkripsi.

PassSa dirancang agar password vault, token, dan secret tidak disimpan sebagai plaintext. Aplikasi juga menyediakan Windows Hello, browser autofill, encrypted backup, Secure Note, custom fields, tags, grup, favorit, trash, serta riwayat perubahan credential.

> **Status:** PassSa masih dalam tahap pengembangan (`v0.1.0`). Lakukan pengujian dan review keamanan sebelum menggunakannya untuk data produksi yang kritikal.

---

## ✨ Fitur Utama

- 🔒 **Encrypted local vault** menggunakan AES-256-GCM.
- 🔑 **Key derivation** dari password menggunakan `scrypt` dengan salt khusus vault.
- 👋 **Windows Hello** sebagai opsi unlock setelah login password pertama.
- ☁️ **Google Drive encrypted sync** melalui OAuth 2.0 Desktop + PKCE.
- 🌐 **Browser Autofill** melalui Chromium Extension Manifest V3 dan Native Messaging.
- 📝 **Secure Note** untuk menyimpan catatan terenkripsi tanpa field login.
- 🧩 **Custom Fields**: Text, Secret, URL, Email, Angka, dan Ya/Tidak.
- 🏷️ **Tags dan Groups** untuk mengorganisasi credential.
- ⭐ **Favorites**, **Trash**, restore, dan permanent delete.
- 🕓 **Password history** hingga 10 perubahan terakhir.
- 📊 Statistik penggunaan untuk pengurutan berdasarkan frekuensi dan penggunaan terakhir.
- 📦 **Encrypted backup `.passsa`** dengan password backup terpisah.
- 📄 Import/export CSV untuk interoperabilitas.
- 📋 Clipboard otomatis dibersihkan setelah credential disalin.
- 🔄 Proteksi penulisan vault dengan lock lintas proses, temporary file unik, dan backup.

---

## 🛡️ Model Keamanan

| Komponen | Implementasi |
| --- | --- |
| Vault lokal | AES-256-GCM |
| Derivasi kunci | `scrypt` + random salt |
| Session key | Hanya berada di memory selama sesi login |
| Password akun | Di-hash dengan `scrypt`; password asli tidak disimpan |
| Google OAuth | OAuth 2.0 Desktop dengan PKCE |
| Google refresh token | Electron `safeStorage` / Windows DPAPI |
| Google Drive sync | Hanya envelope terenkripsi + metadata revisi |
| Windows Hello | Verifikasi biometrik + key wrapping melalui `safeStorage` |
| Clipboard | Dibersihkan otomatis setelah 30 detik |
| Renderer | Secret tidak dikirim pada response list credential |

Google hanya digunakan untuk memverifikasi identitas dan menyediakan media sinkronisasi. Password vault lokal tetap diperlukan untuk menurunkan kunci enkripsi vault.

> **Catatan keamanan:** export CSV menghasilkan credential dalam bentuk plaintext. PassSa meminta konfirmasi eksplisit sebelum proses export/import CSV dilakukan.

Detail lebih lengkap tersedia di [`docs/SECURITY_FEATURES.md`](docs/SECURITY_FEATURES.md).

---

## 🚀 Menjalankan PassSa

### Prasyarat

- Windows sebagai platform utama.
- Node.js versi LTS.
- npm.
- Git.

### Clone repository

```bash
git clone https://github.com/okkinurf/passsa.git
cd passsa
```

### Install dependency

```bash
npm install
```

### Jalankan aplikasi

```bash
npm start
```

---

## 👤 Membuat User Testing

Akun testing dapat dibuat atau diperbarui melalui script bawaan.

### PowerShell

```powershell
$env:PASSA_TEST_USERNAME = "test@example.com"
$env:PASSA_TEST_PASSWORD = "password-testing"
npm run create-test-user
```

Password minimal 8 karakter. Email/username akan dinormalisasi menjadi huruf kecil.

### Seed dummy vault

Untuk membuat 50 item dummy:

```powershell
$env:PASSA_TEST_USERNAME = "test@example.com"
$env:PASSA_TEST_PASSWORD = "password-testing"
npm run seed-dummy-vault
```

Untuk menghapus seluruh isi vault sebelum membuat data dummy:

```powershell
$env:PASSA_RESET_VAULT = "true"
npm run seed-dummy-vault
```

> `PASSA_RESET_VAULT=true` akan menghapus item asli dan Trash pada vault testing tersebut.

---

## ☁️ Google OAuth & Google Drive Sync

PassSa menggunakan OAuth 2.0 untuk aplikasi desktop dengan PKCE. Client secret **tidak diperlukan** dan tidak boleh ditanam di source code desktop.

Buat OAuth Client ID bertipe **Desktop app** di Google Cloud, aktifkan Google Drive API, lalu set Client ID:

```powershell
$env:PASSA_GOOGLE_CLIENT_ID = "1234567890-xxxxx.apps.googleusercontent.com"
npm start
```

PassSa menggunakan scope:

```text
https://www.googleapis.com/auth/drive.file
```

Sinkronisasi hanya menyimpan data terenkripsi. Jika data lokal dan remote berubah bersamaan, file utama Drive dipertahankan dan versi lokal disimpan sebagai conflict copy terenkripsi.

Panduan lengkap: [`docs/GOOGLE_OAUTH_SETUP.md`](docs/GOOGLE_OAUTH_SETUP.md).

---

## 🌐 Browser Autofill

Extension Chromium tersedia pada folder:

```text
browser-extension/
```

Autofill menggunakan **Manifest V3 + Native Messaging**. Credential hanya diminta dari PassSa setelah pengguna memilih item secara eksplisit, dengan pencocokan host/protocol/port secara ketat.

Setup production membutuhkan Native Messaging Host dan Extension ID resmi.

Panduan lengkap: [`docs/AUTOFILL_SETUP.md`](docs/AUTOFILL_SETUP.md).

---

## 🧪 Testing & QA

| Command | Fungsi |
| --- | --- |
| `npm test` | Menjalankan unit/integration test |
| `npm run test:e2e` | Smoke test UI Electron |
| `npm run qa` | Unit/integration + E2E |
| `npm run qa:tauri` | Validasi konfigurasi dan prerequisite Tauri |
| `npm run qa:full` | QA lengkap + Tauri validation + syntax audit |
| `npm run qa:google-network` | QA konektivitas Google |
| `npm run qa:installer` | QA installer Windows |

Sebelum membuat release, disarankan menjalankan:

```bash
npm run qa:full
```

---

## 📦 Build Windows

### Package tanpa installer

```bash
npm run pack
```

### Installer unsigned untuk QA lokal

```bash
npm run dist:unsigned
```

### Installer production signed

```bash
npm run dist
```

Build production mewajibkan code-signing credential. Detail release Windows tersedia di [`docs/WINDOWS_RELEASE.md`](docs/WINDOWS_RELEASE.md).

---

## 🏗️ Struktur Project

```text
passsa/
├── browser-extension/      # Chromium autofill extension
├── build/                  # Build assets
├── docs/                   # Dokumentasi teknis
├── scripts/                # QA, seed, packaging, native helper
├── src/
│   ├── core/               # Domain rules & normalization
│   ├── services/           # Auth, vault, sync, import/export, autofill
│   ├── storage/            # Atomic storage, encrypted token/key handling
│   └── renderer.js         # Main renderer UI
├── src-tauri/              # Persiapan shell Tauri v2
├── test/                   # Unit & integration tests
├── main.js                 # Electron composition root & IPC
├── preload.js              # Secure renderer API via contextBridge
└── package.json
```

Prinsip arsitektur utama:

```text
UI → Service → Core / Storage
```

Logika domain dijaga terpisah dari Electron/DOM, sedangkan operasi mutasi vault diserialisasi untuk mencegah dua proses menimpa data satu sama lain.

Lihat [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) untuk detail workflow pengembangan.

---

## 📚 Dokumentasi

| Dokumen | Keterangan |
| --- | --- |
| [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arsitektur dan workflow perubahan |
| [`SECURITY_FEATURES.md`](docs/SECURITY_FEATURES.md) | Detail fitur keamanan |
| [`GOOGLE_OAUTH_SETUP.md`](docs/GOOGLE_OAUTH_SETUP.md) | Konfigurasi Google OAuth dan Drive |
| [`AUTOFILL_SETUP.md`](docs/AUTOFILL_SETUP.md) | Setup browser autofill |
| [`WINDOWS_RELEASE.md`](docs/WINDOWS_RELEASE.md) | Build dan release Windows |
| [`TAURI_V2_MIGRATION.md`](docs/TAURI_V2_MIGRATION.md) | Persiapan migrasi Tauri v2 / Android |
| [`KEEPASSXC_ARCHITECTURE.md`](docs/KEEPASSXC_ARCHITECTURE.md) | Catatan adaptasi pemisahan arsitektur KeePassXC |
| [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) | Third-party notices |

---

## ⚠️ Batasan Saat Ini

- Google OAuth dan Google Drive nyata membutuhkan Desktop Client ID dari project Google Cloud pengguna.
- Installer production membutuhkan certificate Authenticode atau Azure Trusted Signing milik publisher.
- Autofill production membutuhkan registrasi Native Messaging Host dan Extension ID resmi.
- Shell Tauri v2 masih merupakan persiapan migrasi; backend vault utama saat ini tetap berada pada implementasi Electron.

---

## 🤝 Development Workflow

Untuk perubahan fitur utama:

1. Definisikan aturan data dan validasi di `src/core/`.
2. Implementasikan use-case di `src/services/`.
3. Tambahkan unit/integration test.
4. Tambahkan IPC handler dan expose API minimal melalui preload.
5. Implementasikan UI di renderer.
6. Tambahkan jalur E2E bila diperlukan.
7. Jalankan `npm run qa:full` sebelum packaging/release.

---

## 🙏 Acknowledgements

Struktur project mengadaptasi beberapa prinsip pemisahan **core / crypto / storage / service / GUI** dari KeePassXC. Detailnya tersedia di [`docs/KEEPASSXC_ARCHITECTURE.md`](docs/KEEPASSXC_ARCHITECTURE.md).

Informasi dependency pihak ketiga tersedia pada [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

---

<p align="center">
  <strong>PassSa — local-first password manager for Windows.</strong>
</p>
