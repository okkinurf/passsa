# PassSa Desktop — Tauri v2

Tauri v2 adalah runtime desktop PassSa untuk Windows, Linux, dan macOS. Versi CLI dan crate dikunci pada lini Tauri 2 melalui `package-lock.json` dan `Cargo.lock`; project ini belum memakai Tauri v3.

## Menjalankan dan membangun

```bash
npm ci
npm run tauri:dev
npm run tauri:build
```

Gunakan `npm run qa:tauri` untuk validasi config, pemeriksaan toolchain, audit staging terhadap fixture/credential, dan smoke test auth + operasi vault.

Output bundler native saat ini: Windows NSIS `.exe`, Linux AppImage dan `.deb`, macOS Apple Silicon DMG. Workflow `.github/workflows/tauri-desktop-build.yml` menjalankan tes dan bundling pada runner masing-masing OS. Jika konfigurasi sertifikat Windows tersedia, installer Windows ditandatangani self-signed; macOS belum signed/notarized. Artifact CI berumur 14 hari bukan release. Workflow terpisah `.github/workflows/publish-tauri-release-assets.yml` dapat mengunggah artifact dari run `main` yang sukses ke prerelease setelah tag diverifikasi.

Prasyarat Linux meliputi GTK3/WebKitGTK 4.1, AppIndicator, dan libsecret. Runtime perlu Secret Service sesi desktop agar kunci dapat disimpan aman. macOS memerlukan Xcode Command Line Tools. Windows membutuhkan WebView2 Runtime.

## Batas keamanan dan kompatibilitas data

- UI dirender oleh WebView lokal; command native didaftarkan secara eksplisit dan RPC backend memakai allowlist channel.
- Kunci enkripsi lokal disimpan di keyring OS. Jika secure storage tidak tersedia, fitur vault yang bergantung padanya tidak dapat membuat atau membuka sesi secara aman; tidak ada fallback plaintext.
- Clipboard ditulis oleh proses Rust dan dibersihkan setelah 30 detik.
- Dialog import/export menggunakan pemilih file native; path yang dipilih hanya diotorisasi satu kali.
- Tauri memakai profil **PassSa Tauri** yang berbeda dari profil Electron. Build debug memakai folder sementara yang unik per proses dan mengaktifkan tombol login bypass developer; build release selalu memakai profil terpisah **PassSa Tauri** dan tetap mewajibkan login. Data Electron tidak tertimpa atau dibaca otomatis.
- Fixture dummy tidak dimasukkan ke runtime Tauri. Bypass developer hanya diaktifkan oleh host Rust saat compile debug dan tidak tersedia pada build release; staging tetap diaudit sebelum smoke/build.
- Google Drive dan S3 memakai service PassSa yang sama. Konfigurasi OAuth publik/provider tetap harus tersedia; jangan menaruh client secret atau token pengguna di repository.

## Belum tersedia pada shell Tauri

Windows Hello dan minimize-to-tray belum dipetakan dan sengaja dilaporkan tidak didukung. Login, vault, 2FA, Quick Access, clipboard, import/export, startup, dan sinkronisasi memakai service yang sama melalui adapter IPC; verifikasi OAuth tetap memerlukan konfigurasi provider di mesin/build terkait.

CI macOS membuat DMG unsigned. Distribusi umum di macOS memerlukan Developer ID signing dan notarization Apple. Artifact maupun DMG release tidak otomatis dipercaya Gatekeeper.
