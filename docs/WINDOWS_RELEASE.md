# Release Windows PassSa

## Status build Tauri v2 saat ini

Source saat ini adalah PassSa v0.2.0 berbasis Tauri v2. Installer Windows lokal dibuat dengan `npm run tauri:build` di `src-tauri/target/release/bundle/nsis/PassSa_0.2.0_x64-setup.exe`. Build lokal ini unsigned dan belum dipublikasikan. Workflow `.github/workflows/tauri-desktop-build.yml` membuat artifact Windows, macOS, dan Linux di CI; workflow tersebut tidak membuat GitHub Release.

Petunjuk di bawah bagian ini menjelaskan pipeline Electron Authenticode untuk prerelease lama v0.1.8 dan sebelumnya. Jangan gunakan workflow Electron tersebut untuk memaketkan v0.2.0.

Build produksi Electron lama sengaja gagal jika credential code signing tidak tersedia. Proses build Tauri v2 dijelaskan pada workflow Tauri di atas.

## Certificate Authenticode (PFX/P12)

```powershell
$env:WIN_CSC_LINK = "C:\secure\passsa-signing.pfx"
$env:WIN_CSC_KEY_PASSWORD = "password-certificate"
npm run dist
npm run qa:installer
```

Jangan commit certificate atau password ke repository. Simpan sebagai secret CI atau Windows secret store.

## Prerelease Authenticode self-signed

Prerelease `v0.1.8` memakai sertifikat self-signed khusus PassSa. Ini menandatangani file untuk memverifikasi integritasnya, tetapi **bukan** sertifikat dari CA publik: Windows pada perangkat lain tidak otomatis mempercayainya, SmartScreen dapat tetap memperingatkan, dan identitas publisher tidak diverifikasi pihak ketiga. Batasi penggunaannya untuk pengujian; jangan memasang sertifikat prerelease ini sebagai Root CA dan jangan gunakan installer untuk credential penting.

Runner tidak memasang sertifikat ke trust store. QA menerima `NotTrusted`, atau `UnknownError` dengan pesan khusus rantai root tidak dipercaya, hanya jika subject dan thumbprint tanda tangan cocok dengan variable yang dipin; hash mismatch dan error lainnya tetap gagal. Kunci privat PFX/password berada di GitHub Secrets. Untuk rilis publik/stabil, ganti dengan sertifikat Authenticode dari CA tepercaya.

## Publish prerelease dari GitHub Actions

Workflow `.github/workflows/publish-windows-release.yml` membuat installer NSIS bertanda tangan self-signed, mengaudit isi paket, memverifikasi tanda tangan, membuat checksum SHA-256, lalu membuat atau memperbarui prerelease GitHub dengan kedua asset tersebut.

Siapkan empat nilai berikut di repository `okkinurf/passsa`:

- Secret `WINDOWS_CERTIFICATE_BASE64`: Base64 dari PFX Authenticode.
- Secret `WINDOWS_CERTIFICATE_PASSWORD`: password PFX.
- Variable `WINDOWS_CERTIFICATE_SUBJECT`: Subject sertifikat publisher yang diizinkan, misalnya nilai `CN=...` dari `Get-AuthenticodeSignature`.
- Variable `WINDOWS_CERTIFICATE_THUMBPRINT`: thumbprint sertifikat tanpa spasi; workflow mem-pin sertifikat ini.

> [!CAUTION]
> Jangan menaruh sertifikat atau password dalam source code, workflow log, issue, atau chat. Simpan PFX di luar repository dan masukkan ke GitHub Secrets.

Contoh mengirim PFX ke secret tanpa menampilkan Base64 ke terminal:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\secure\passsa-signing.pfx')) | gh secret set WINDOWS_CERTIFICATE_BASE64 --repo okkinurf/passsa
gh secret set WINDOWS_CERTIFICATE_PASSWORD --repo okkinurf/passsa
gh variable set WINDOWS_CERTIFICATE_SUBJECT --repo okkinurf/passsa --body 'CN=Nama Publisher'
```

Untuk pipeline Electron historis v0.1.8: setelah tag yang versinya cocok dengan `package.json` tersedia di GitHub, jalankan **Actions → Publish self-signed Windows prerelease** dan isi tag tersebut. Workflow menolak publish jika secrets/subject tidak tersedia, tes gagal, paket membawa fixture development atau file credential, helper/runtime tidak lengkap, atau publisher tidak cocok. Electron Builder dijalankan dengan `--publish never`; workflow mengunggah aset release secara eksplisit pada langkah terpisah.

Tag `v0.1.0` hingga `v0.1.5` mendahului QA yang mem-pin self-signed signer tanpa mengubah trust store. Tag `v0.1.6` gagal karena electron-builder mencoba publish sendiri, sementara `v0.1.7` membangun installer tetapi pemeriksaan status sertifikat terlalu ketat; gunakan `v0.1.8`. Installer unsigned tidak pernah diunggah. Repository saat ini public, jadi prerelease dapat dilihat siapa saja; self-signed tetap dapat memunculkan peringatan Windows dan tidak memverifikasi publisher melalui CA publik.

## Azure Trusted Signing

Isi `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, dan `AZURE_CLIENT_SECRET`, lalu tambahkan `win.azureSignOptions` yang sesuai dengan akun, profile certificate, endpoint, serta publisher milik PassSa. Nilai tersebut bergantung pada akun Azure dan tidak dapat dibuat otomatis oleh repository.

## QA tanpa certificate

Untuk pengujian installer lokal saja:

```powershell
npm run dist:unsigned
$env:PASSA_ALLOW_UNSIGNED_QA = "true"
npm run qa:installer
```

Installer unsigned tidak boleh dipublikasikan. Self-signed juga tidak memberi kepercayaan publisher publik dan dapat memunculkan peringatan Windows.
