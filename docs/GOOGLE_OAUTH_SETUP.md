# Konfigurasi Google OAuth PassSa

PassSa menggunakan OAuth 2.0 untuk aplikasi desktop dengan PKCE. Google hanya memverifikasi identitas; password vault lokal tetap diperlukan karena menjadi kunci enkripsi vault.

## Google Cloud Console

1. Buat atau pilih project di [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Google Drive API**.
3. Konfigurasikan OAuth consent screen dan tambahkan akun penguji saat aplikasi masih dalam mode Testing.
4. Buat credential **OAuth client ID** dengan application type **Desktop app**.
5. Salin Client ID yang berakhiran `.apps.googleusercontent.com`.

PassSa membuka browser dan memakai redirect loopback `http://127.0.0.1:<port>/oauth2callback`; port dipilih otomatis. Client secret tidak diperlukan dan tidak boleh ditanam di source code desktop.

## Menjalankan aplikasi

PassSa dapat membaca Client ID dari `PASSA_GOOGLE_CLIENT_ID`. Build yang sudah dikonfigurasi juga dapat menyimpan Client ID publik di `src/config/google-oauth.json`; environment variable selalu menjadi override. Jangan pernah menaruh `client_secret` di aplikasi.

PowerShell:

```powershell
$env:PASSA_GOOGLE_CLIENT_ID = "1234567890-xxxxx.apps.googleusercontent.com"
npm start
```

Jika environment variable belum diisi, tombol Google tetap tampil tetapi memberikan pesan konfigurasi yang jelas.

Scope Drive yang diminta adalah `https://www.googleapis.com/auth/drive.appdata`. PassSa menyimpan envelope vault terenkripsi di folder tersembunyi `appDataFolder`, bukan membaca seluruh Drive pengguna.

Token OAuth tidak dikirim ke renderer. Refresh token dipersistenkan dalam bentuk terenkripsi menggunakan Electron `safeStorage`/Windows DPAPI; jika penyimpanan aman tidak tersedia, login Google gagal dengan aman dan token tidak ditulis sebagai plaintext.

Setelah login Google, PassSa menjalankan sinkronisasi. Jika hanya salah satu sisi berubah, versi tersebut dipakai. Jika sisi lokal dan Drive sama-sama berubah sejak sinkronisasi terakhir, PassSa mempertahankan file utama Drive dan mengunggah salinan lokal terenkripsi sebagai `passsa-vault-conflict-<timestamp>.json`.
