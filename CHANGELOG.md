# Changelog

Perubahan release terbaru dirangkum di sini. Riwayat versi sebelumnya tersedia di [GitHub Releases](https://github.com/okkinurf/passsa/releases).

## [0.2.1] - 2026-10-04

### Keamanan

- Menangani enam temuan CodeQL berprioritas tinggi: membatasi detail sensitif pada log, memvalidasi host dan path URL secara tepat, serta mengamankan parsing directive CSP.
- Meng-escape karakter khusus dan baris baru pada sel tabel Markdown untuk mencegah injeksi baris.

### CI dan release

- Memisahkan signing Windows ke GitHub Environment khusus `main`; build pull request tetap unsigned dan tidak menerima secret sertifikat.
- Memvalidasi tag, versi, commit sumber, kelengkapan paket lintas platform, dan signature Windows sebelum aset release dipublikasikan.
- Menambahkan checksum SHA-256 otomatis dan mematok GitHub Actions ke commit SHA.
- Menambahkan pemeriksaan CodeQL untuk GitHub Actions, JavaScript, dan Rust.
- Memperbarui dependensi `@electron/asar` ke v4 dan menetapkan Node.js minimum 22.12 untuk tool release.
- Menyegarkan dokumentasi README dan panduan maintainer.

## [0.2.0] - 2026-10-04

### Added

- Desktop Tauri v2 untuk Windows, macOS Apple Silicon, dan Linux.
- Vault untuk credential, secure notes, authenticator TOTP, Quick Access, kategori, tags, favorit, dan pencarian.
- Sinkronisasi snapshot terenkripsi opsional melalui Google Drive atau Amazon S3/S3-compatible.
- Tema, pilihan metode login, dan pemeriksaan versi aplikasi.
- Paket Windows NSIS, macOS DMG ARM64, Linux AppImage dan deb, serta checksum SHA-256.

### Security and compatibility

- Paket Tauri tidak membawa bypass login atau fixture vault development.
- Profil Tauri terpisah dari profil Electron sebelumnya; migrasi otomatis tidak dilakukan.
- Installer Windows memakai sertifikat self-signed. Paket macOS belum ditandatangani/notarized.
- Ini development preview yang belum menjalani audit keamanan independen.
