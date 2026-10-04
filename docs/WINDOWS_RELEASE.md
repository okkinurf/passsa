# Legacy Windows release pipeline

Pipeline Electron untuk prerelease hingga `v0.1.8` ini sudah **dipensiunkan**. Workflow `publish-windows-release.yml` dihapus agar build Electron lama tidak dapat mengganti installer atau catatan release Tauri.

Untuk desktop terbaru, gunakan Tauri v2:

- Build dan tes lintas platform: [`tauri-desktop-build.yml`](../.github/workflows/tauri-desktop-build.yml).
- Publikasi artifact yang sudah lolos CI: [`publish-tauri-release-assets.yml`](../.github/workflows/publish-tauri-release-assets.yml).
- Prosedur saat ini dan catatan keamanan: [README](../README.md), [migrasi Tauri v2](TAURI_V2_MIGRATION.md), dan [Security policy](../SECURITY.md).

Rilis Electron terdahulu tetap berada dalam riwayat GitHub sebagai arsip. Profil data Electron dan Tauri terpisah; installer lama jangan dipakai untuk menguji perilaku Tauri.
