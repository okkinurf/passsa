<div align="center">

<img src="src/assets/passsa-logo-cropped.png" alt="Logo PassSa" width="150" />

# PassSa

**Password manager desktop local-first.** Rahasia tetap di vault lokal terenkripsi; sinkronisasi cloud bersifat opsional.

[Unduhan](#unduhan) · [Fitur](#fitur) · [Keamanan](#keamanan) · [Build dari source](#build-dari-source)

![Tauri v2](https://img.shields.io/badge/Tauri-v2-24C8DB?logo=tauri&logoColor=white)
![Windows, macOS, Linux](https://img.shields.io/badge/desktop-Windows%20%7C%20macOS%20%7C%20Linux-3569a8)
![Versi](https://img.shields.io/github/v/release/okkinurf/passsa?include_prereleases&label=rilis)

</div>

---

PassSa menyimpan **credential, secure note, dan kode authenticator TOTP** dalam vault lokal yang terenkripsi. Akun cloud tidak diperlukan untuk memakai vault. Bila diaktifkan, PassSa menyinkronkan snapshot terenkripsi ke Google Drive atau Amazon S3/S3-compatible.

> [!WARNING]
> PassSa masih **development preview**, belum diaudit keamanan secara independen, dan belum ditujukan untuk menyimpan credential kritis. Buat backup terenkripsi sebelum menguji.

## Fitur

- **Vault:** login, secure notes, custom fields, kategori, grup, tags, favorit, riwayat, recycle bin, dan pencarian.
- **Authenticator:** simpan seed TOTP terenkripsi, lihat kode berjalan, dan salin dengan sekali klik.
- **Quick Access:** buka pencarian credential dengan `Alt + Shift + P`; pin item dan salin data yang diperlukan.
- **Metode masuk:** password, password + TOTP, atau buka langsung pada profil perangkat pribadi. Opsi diatur dari Pengaturan.
- **Tema:** mode terang/gelap/sistem, sepuluh palet aksen, dan opacity jendela utama.
- **Backup dan transfer:** file backup `.passsa` terenkripsi; CSV tersedia dengan peringatan bahwa isinya plaintext.
- **Sinkronisasi manual:** snapshot vault terenkripsi melalui Google Drive atau Amazon S3/S3-compatible.
- **Pembaruan:** cek versi GitHub otomatis paling banyak sekali sehari; pemasangan tetap dilakukan oleh pengguna dari halaman release.

## Unduhan

Versi terbaru saat ini adalah [v0.2.1 — Tauri v2 Development Preview](https://github.com/okkinurf/passsa/releases/tag/v0.2.1). Tautan berikut menuju aset release tersebut:

Rilis ini memperkuat pipeline publikasi dan signing, menangani temuan CodeQL terkait logging, validasi URL/CSP, serta escaping Markdown, dan menambahkan validasi aset/checksum sebelum installer diterbitkan. Lihat [changelog](CHANGELOG.md) untuk rincian.

| Platform | Paket saat ini | Catatan |
| --- | --- | --- |
| Windows x64 | [Installer NSIS (`.exe`)](https://github.com/okkinurf/passsa/releases/download/v0.2.1/PassSa_0.2.1_x64-setup.exe) | Ditandatangani sertifikat self-signed; Windows dapat menampilkan peringatan SmartScreen. |
| macOS Apple Silicon (ARM64) | [Disk image (`.dmg`)](https://github.com/okkinurf/passsa/releases/download/v0.2.1/PassSa_0.2.1_aarch64.dmg) | Belum ditandatangani/notarized; paket Intel belum tersedia. |
| Linux x64 | [AppImage](https://github.com/okkinurf/passsa/releases/download/v0.2.1/PassSa_0.2.1_amd64.AppImage) · [Debian/Ubuntu (`.deb`)](https://github.com/okkinurf/passsa/releases/download/v0.2.1/PassSa_0.2.1_amd64.deb) | Memerlukan Secret Service aktif untuk penyimpanan kunci OS. |
| Semua paket | [SHA256SUMS.txt](https://github.com/okkinurf/passsa/releases/download/v0.2.1/SHA256SUMS.txt) | Bandingkan hash installer dengan baris berlabel nama file yang sama. |

Untuk memeriksa checksum, unduh file `SHA256SUMS.txt` bersama installer yang dipilih, jalankan perintah sesuai OS, lalu cocokkan hasil hash dengan baris nama file yang sama:

```powershell
(Get-FileHash .\PassSa_0.2.1_x64-setup.exe -Algorithm SHA256).Hash.ToLowerInvariant()
```

```bash
# macOS
shasum -a 256 PassSa_0.2.1_aarch64.dmg

# Linux
sha256sum PassSa_0.2.1_amd64.AppImage
```

Di Linux, jadikan AppImage dapat dijalankan bila diperlukan dengan `chmod +x PassSa_0.2.1_amd64.AppImage`. Tanda tangan self-signed membantu memeriksa integritas file dengan sertifikat yang benar, tetapi **bukan** verifikasi publisher oleh CA publik. Jangan mengabaikan peringatan sistem operasi tanpa memeriksa sumber dan checksum.

## Keamanan

- Data vault dienkripsi dengan AES-256-GCM; password akun diverifikasi menggunakan hash `scrypt`.
- Kunci lokal dan token provider disimpan melalui penyimpanan aman OS; pada Linux diperlukan layanan Secret Service.
- Sinkronisasi mengirim snapshot terenkripsi. Provider dapat tetap melihat metadata objek tertentu.
- Login langsung menyimpan kemudahan membuka vault pada perangkat tersebut dan **bukan** pengganti autentikasi pada perangkat bersama.
- Profil Tauri terpisah dari instalasi Electron lama. Data lama tidak dimigrasikan atau dihapus otomatis; pindahkan vault melalui backup `.passsa`.
- Dataset dummy dan tombol lewati-login developer hanya tersedia pada jalur debug Tauri; paket release diaudit agar fixture tidak ikut.

**Catatan dependensi Linux:** Tauri/GTK saat ini membawa `glib 0.18.5` secara transitif (RUSTSEC-2024-0429). Kode PassSa tidak memanggil API `VariantStrIter` yang ditandai unsound; alert Dependabot berstatus dismissed `not_used`, **bukan** berarti versi dependensinya sudah ditambal. Rincian dan alasan kompatibilitas ada di [batas yang diketahui](KNOWN-LIMITS.md).

Lihat [Security policy](SECURITY.md), [fitur keamanan dan privasi](docs/SECURITY_FEATURES.md), serta [batas yang diketahui](KNOWN-LIMITS.md). Jangan melaporkan kerentanan lewat issue publik.

## Pengembangan

PassSa dikembangkan dengan bantuan **GPT-6 Luna (OpenAI)**. Model digunakan sebagai asisten selama proses pembuatan aplikasi; perubahan tetap diperiksa melalui test otomatis dan build CI lintas platform.

## Build dari source

### Prasyarat

- Node.js 22.12 atau lebih baru dan npm (dibutuhkan oleh tool audit paket release).
- Rust stable serta prasyarat native [Tauri v2](https://v2.tauri.app/start/prerequisites/).
- Windows: WebView2 Runtime dan toolchain MSVC.
- macOS: Xcode Command Line Tools.
- Linux: GTK3, WebKitGTK 4.1, AppIndicator, libsecret, dan Secret Service.

```bash
git clone https://github.com/okkinurf/passsa.git
cd passsa
npm ci
npm run tauri:dev
```

Debug Tauri menyediakan opsi **Lewati login developer** dengan profil pengembangan terpisah. Build release tidak menyertakan bypass atau vault dummy.

```bash
npm run qa:full
npm run tauri:build
```

Paket berada di `src-tauri/target/release/bundle/`. Build lokal menghasilkan paket untuk host; build lintas platform diperiksa di GitHub Actions. CI menyimpan artifact sementara, sedangkan publikasi ke GitHub Release dilakukan melalui workflow release terpisah.

`npm start` dan `npm run dev:skip-login` masih menjalankan **runtime Electron kompatibilitas lama**, bukan desktop terbaru. Untuk Tauri gunakan `npm run tauri:dev`.

## Dokumentasi dan kontribusi

- [Arsitektur](docs/ARCHITECTURE.md) · [Migrasi Tauri v2](docs/TAURI_V2_MIGRATION.md)
- [Proses release dan konfigurasi signing](docs/RELEASING.md)
- [Google Drive OAuth](docs/GOOGLE_OAUTH_SETUP.md) · [Amazon S3](docs/S3_SYNC_SETUP.md)
- [Autofill runtime lama](docs/AUTOFILL_SETUP.md) · [Security features](docs/SECURITY_FEATURES.md)
- [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Code of conduct](CODE_OF_CONDUCT.md)

Kontribusi dan laporan bug dipersilakan. Baca panduan kontribusi terlebih dahulu; kirim detail reproduksi tanpa menyertakan vault, token, password, atau credential.

## Lisensi

Repository ini belum memiliki file lisensi. Hak penggunaan ulang, modifikasi, dan distribusi kode belum diberikan; jangan menganggap PassSa berlisensi Apache hanya karena Tervia menggunakannya.

<div align="center">

---

[Source PassSa](https://github.com/okkinurf/passsa) · [Releases](https://github.com/okkinurf/passsa/releases) · [Laporkan isu](https://github.com/okkinurf/passsa/issues)

</div>
