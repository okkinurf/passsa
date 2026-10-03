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

## Publish release dari GitHub Actions

Workflow `.github/workflows/publish-windows-release.yml` membuat installer NSIS bertanda tangan, mengaudit isi paket, memverifikasi tanda tangan, membuat checksum SHA-256, lalu membuat atau memperbarui prerelease GitHub dengan kedua asset tersebut.

Siapkan tiga nilai berikut di repository `okkinurf/passsa`:

- Secret `WINDOWS_CERTIFICATE_BASE64`: Base64 dari PFX Authenticode.
- Secret `WINDOWS_CERTIFICATE_PASSWORD`: password PFX.
- Variable `WINDOWS_CERTIFICATE_SUBJECT`: Subject sertifikat publisher yang diizinkan, misalnya nilai `CN=...` dari `Get-AuthenticodeSignature`.

> [!CAUTION]
> Jangan menaruh sertifikat atau password dalam source code, workflow log, issue, atau chat. Simpan PFX di luar repository dan masukkan ke GitHub Secrets.

Contoh mengirim PFX ke secret tanpa menampilkan Base64 ke terminal:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\secure\passsa-signing.pfx')) | gh secret set WINDOWS_CERTIFICATE_BASE64 --repo okkinurf/passsa
gh secret set WINDOWS_CERTIFICATE_PASSWORD --repo okkinurf/passsa
gh variable set WINDOWS_CERTIFICATE_SUBJECT --repo okkinurf/passsa --body 'CN=Nama Publisher'
```

Setelah tag yang versinya cocok dengan `package.json` tersedia di GitHub, jalankan **Actions → Publish signed Windows release** dan isi tag tersebut (versi sekarang `v0.1.1`). Workflow menolak publish jika secrets/subject tidak tersedia, tes gagal, paket membawa fixture development atau file credential, helper/runtime tidak lengkap, atau publisher tidak cocok.

Tag `v0.1.0` dibuat sebelum release-hardening ini dan tidak boleh dipakai untuk build tersebut; gunakan tag baru dari commit yang memuat workflow dan audit packaging ini. Installer unsigned tidak pernah diunggah.

## Azure Trusted Signing

Isi `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, dan `AZURE_CLIENT_SECRET`, lalu tambahkan `win.azureSignOptions` yang sesuai dengan akun, profile certificate, endpoint, serta publisher milik PassSa. Nilai tersebut bergantung pada akun Azure dan tidak dapat dibuat otomatis oleh repository.

## QA tanpa certificate

Untuk pengujian installer lokal saja:

```powershell
npm run dist:unsigned
$env:PASSA_ALLOW_UNSIGNED_QA = "true"
npm run qa:installer
```

Installer unsigned tidak boleh dipublikasikan karena Windows SmartScreen akan menampilkan publisher yang tidak dikenal.
