# Batas yang diketahui

Halaman ini mencatat perilaku penting yang belum tersedia atau batas dukungan saat ini. Periksa juga [GitHub Releases](https://github.com/okkinurf/passsa/releases) karena cakupan paket bisa berubah per versi.

## Platform dan packaging

- Release Tauri saat ini menyediakan Windows x64, macOS Apple Silicon (ARM64), dan Linux x64. Installer macOS Intel belum diterbitkan.
- macOS belum ditandatangani atau notarized. Windows memakai sertifikat self-signed; keduanya dapat memicu peringatan keamanan sistem operasi.
- Linux memerlukan layanan Secret Service/libsecret aktif untuk penyimpanan kunci OS. AppImage dan `.deb` adalah paket Linux yang saat ini diterbitkan; RPM belum tersedia.

## Fitur desktop Tauri

- Windows Hello/biometrik, browser autofill/Native Messaging, dan minimize-to-tray masih terbatas pada runtime kompatibilitas Electron; belum tersedia di Tauri.
- Sinkronisasi cloud bersifat opsional dan dilakukan manual, bukan sinkronisasi latar belakang.
- Pemeriksaan versi memberi tahu pengguna dan mengarah ke halaman release; aplikasi tidak mengunduh atau memasang update secara diam-diam.
- Login langsung hanya mengurangi langkah membuka vault pada profil perangkat tersebut. Jangan gunakan pada akun OS atau perangkat yang dipakai bersama.

## Data dan keamanan

- Tauri dan Electron menyimpan profil di lokasi terpisah. Tidak ada migrasi otomatis; ekspor dan impor melalui backup `.passsa` diperlukan bila ingin memindahkan data.
- Google Drive memerlukan konfigurasi OAuth Desktop Client ID. Credential cloud dan token pengguna tidak boleh dimasukkan ke source atau issue.
- CSV berisi plaintext; gunakan hanya bila diperlukan dan hapus salinan ekspor dengan aman setelah pemindahan.
- PassSa belum diaudit keamanan oleh pihak independen. Jangan jadikan development preview sebagai satu-satunya penyimpanan credential kritis.
- Linux membawa dependency transitif `glib 0.18.5` melalui GTK/Tauri. RustSec [RUSTSEC-2024-0429](https://rustsec.org/advisories/RUSTSEC-2024-0429.html) menandai API `VariantStrIter` pada `glib <0.20.0` sebagai unsound; versi aman belum dapat dipilih karena stack GTK 0.18 meminta `glib ^0.18`. Source PassSa dan dependency Rust yang terpasang tidak menggunakan `VariantStrIter`/`array_iter_str`; test guard mencegah pemakaian API tersebut di source PassSa. Alert Dependabot ditutup dengan alasan `not_used`, bukan karena paket sudah ditambal. Dependency Linux masih terdampak secara versi; tinjau ulang saat Tauri/Wry menyediakan stack GTK yang membawa `glib >=0.20`.

Perubahan pada batas di atas harus memperbarui dokumen ini bersamaan dengan perubahan fitur atau pipeline yang mengangkat batas tersebut.
