# Persiapan Tauri v2 PassSa

Folder `src-tauri/` adalah shell Tauri v2 yang berjalan paralel dengan Electron. Electron tetap menjadi runtime produksi sampai seluruh service sensitif selesai dipindahkan ke Rust.

## Yang sudah disiapkan

- Konfigurasi Tauri v2 untuk Windows, frameless window, NSIS, dan frontend `src/`.
- Capability default dengan izin window minimum; tidak ada filesystem, shell, HTTP, atau secret permission yang dibuka.
- Mobile entry point Rust yang valid untuk target Android/iOS berikutnya.
- `src/tauri-bridge.js` sebagai batas kompatibilitas. Bridge ini tidak menggantikan preload Electron dan tidak menyimpan credential.
- Command Rust awal `app_info` dan `platform_capabilities` untuk memverifikasi shell.
- `npm run tauri:config` untuk memvalidasi konfigurasi tanpa toolchain native.
- `npm run tauri:doctor` untuk memeriksa Cargo, Rust, Tauri CLI, Android SDK, dan Java.

## Batasan yang sengaja belum diaktifkan

Fitur vault, KDF, AES-GCM, Google OAuth/Drive, Windows Hello, system tray, Quick Access, autofill Native Messaging, import/export, dan dialog native masih memakai adapter Electron. Mengaktifkan Tauri sebelum service tersebut dipindahkan akan berisiko membuat data atau secret tidak aman.

## Tahap porting berikutnya

1. Bekukan schema vault dan protocol envelope sebagai kontrak lintas platform.
2. Pindahkan crypto, KDF, migrasi, dan conflict handling ke crate Rust yang diuji vector-for-vector terhadap test Node saat ini.
3. Tambahkan storage terenkripsi berbasis platform: Windows Credential/DPAPI dan Android Keystore.
4. Portasikan auth lokal, CRUD vault, history, category, tags, notes, dan transfer sebagai command Rust typed.
5. Tambahkan Google OAuth/Drive dengan capability dan scope minimum.
6. Baru setelah parity tercapai, aktifkan `tauri:dev` dan `tauri:build` sebagai jalur rilis.

## Prerequisite native

Pasang Rust MSVC, Cargo Tauri CLI v2, WebView2, Android SDK, dan JDK sebelum build. Jika prerequisite belum ada, `qa:tauri` tetap memvalidasi konfigurasi tetapi melaporkan status native sebagai warning.
