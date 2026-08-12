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
