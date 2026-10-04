# Release Windows PassSa

Build produksi sengaja gagal jika credential code signing tidak tersedia.

## Certificate Authenticode (PFX/P12)

```powershell
$env:WIN_CSC_LINK = "C:\secure\passsa-signing.pfx"
$env:WIN_CSC_KEY_PASSWORD = "password-certificate"
npm run dist
npm run qa:installer
```

Jangan commit certificate atau password ke repository. Simpan sebagai secret CI atau Windows secret store.

## Prerelease Authenticode self-signed

Prerelease `v0.1.5` memakai sertifikat self-signed khusus PassSa. Ini menandatangani file untuk memverifikasi integritasnya, tetapi **bukan** sertifikat dari CA publik: Windows pada perangkat lain tidak otomatis mempercayainya, SmartScreen dapat tetap memperingatkan, dan identitas publisher tidak diverifikasi pihak ketiga. Batasi penggunaannya untuk pengujian; jangan memasang sertifikat prerelease ini sebagai Root CA dan jangan gunakan installer untuk credential penting.

Workflow mempercayai sertifikat hanya sementara pada runner GitHub untuk memverifikasi hasil build, lalu menghapusnya saat job selesai. Kunci privat PFX/password berada di GitHub Secrets. Untuk rilis publik/stabil, ganti dengan sertifikat Authenticode dari CA tepercaya.

## Publish prerelease dari GitHub Actions

Workflow `.github/workflows/publish-windows-release.yml` membuat installer NSIS bertanda tangan self-signed, mengaudit isi paket, memverifikasi tanda tangan, membuat checksum SHA-256, lalu membuat atau memperbarui prerelease GitHub dengan kedua asset tersebut.

Siapkan tiga nilai berikut di repository `okkinurf/passsa`:

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

Setelah tag yang versinya cocok dengan `package.json` tersedia di GitHub, jalankan **Actions → Publish self-signed Windows prerelease** dan isi tag tersebut (versi sekarang `v0.1.5`). Workflow menolak publish jika secrets/subject tidak tersedia, tes gagal, paket membawa fixture development atau file credential, helper/runtime tidak lengkap, atau publisher tidak cocok.

Tag `v0.1.0` hingga `v0.1.4` mendahului perbaikan noninteraktif untuk trust self-signed di runner; gunakan tag `v0.1.5`. Installer unsigned tidak pernah diunggah. Repository saat ini private, sehingga prerelease hanya tersedia untuk pengguna yang memiliki akses repository.

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
