# Proses release PassSa

Workflow release hanya menerbitkan prerelease yang tag versinya cocok dengan `package.json` dan menunjuk ke commit `main` yang memiliki build Tauri sukses.

## Pengaturan repository satu kali

1. Lindungi `main`: perubahan hanya lewat pull request, tanpa force-push/hapus branch, dan wajib lulus pemeriksaan `Windows installer (NSIS)`, `macOS disk image (DMG)`, serta `Linux packages (AppImage + deb)`.
2. Buat GitHub Actions Environment bernama `windows-signing` dan batasi deployment branch hanya ke `main`.
3. Pindahkan secret `WINDOWS_CERTIFICATE_BASE64` dan `WINDOWS_CERTIFICATE_PASSWORD` dari Repository secrets ke Environment secrets pada `windows-signing`, lalu hapus salinan Repository secrets. Jika salinan di tingkat repository masih ada, job dari branch lain tanpa environment tetap dapat membacanya.
4. Pertahankan repository variables `WINDOWS_CERTIFICATE_SUBJECT` dan `WINDOWS_CERTIFICATE_THUMBPRINT`; keduanya adalah metadata sertifikat, bukan private key.
5. Aktifkan kebijakan yang mewajibkan action GitHub dipatok ke commit SHA. Workflow di folder ini sudah memakai SHA immutable; Dependabot mengelola pembaruannya.

Signing job untuk `main` gagal jika environment atau konfigurasinya belum lengkap. Build pull request memakai installer unsigned dan tidak menerima secret signing.

## Menerbitkan prerelease

1. Pastikan perubahan sudah masuk ke `main` lewat pull request dan build Tauri untuk commit tersebut berhasil.
2. Buat tag `vMAJOR.MINOR.PATCH` pada commit itu, dengan nilainya sama persis dengan versi di `package.json`.
3. Buat dan terbitkan GitHub prerelease untuk tag tersebut.
4. Workflow `Publish Tauri release assets` berjalan otomatis. Workflow memeriksa sumber build, tag, versi, kelengkapan platform, serta signature installer Windows; kemudian membuat `SHA256SUMS.txt` dan menambahkan empat paket installer.

Jika validasi gagal, workflow tidak menerbitkan aset. Perbaiki penyebabnya, pastikan ada build sukses untuk commit tag tersebut, lalu jalankan ulang workflow gagal atau ubah release menjadi draft dan terbitkan kembali. Jangan unggah file yang belum lolos pemeriksaan signature dan checksum secara manual.

## Batas kepercayaan

Sertifikat Windows self-signed memverifikasi integritas file tetapi tidak membuat publisher dipercaya oleh Windows. Release PassSa tetap development preview, belum menjalani audit keamanan independen. Distribusikan checksum melalui kanal tepercaya dan jangan memakai build ini untuk credential kritis.
