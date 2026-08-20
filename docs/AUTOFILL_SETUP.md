# PassSa Autofill (Chrome/Edge)

PassSa Autofill memakai browser extension Manifest V3 dan Native Messaging. Password tidak disimpan di extension. Extension meminta daftar credential yang cocok, lalu PassSa mengambil password hanya setelah item dipilih. Native host meneruskan permintaan melalui loopback `127.0.0.1` dengan port acak dan token sesi.

## Instalasi untuk testing lokal

1. Pastikan PassSa sedang berjalan dan vault sudah dibuka.
2. Buka `chrome://extensions` atau `edge://extensions`.
3. Aktifkan **Developer mode**.
4. Pilih **Load unpacked** dan pilih folder `browser-extension`.
5. Salin **Extension ID** yang ditampilkan.
6. Buka PowerShell pada folder project dan jalankan:

```powershell
.\scripts\install-autofill-host.ps1 -ExtensionId "ID_EXTENSION_ANDA"
```

Node.js harus tersedia di `PATH` untuk testing lokal. Pada installer produksi, ganti `-HostExecutable` dengan `C:\Program Files\PassSa\PassSa.exe`; executable produksi akan mengenali mode Native Messaging dari argumen yang diberikan browser.

7. Buka halaman login yang URL-nya tersimpan di PassSa.
8. Klik ikon extension PassSa Autofill.
9. Pilih credential yang cocok. Username dan password akan diisi ke form.

Shortcut `Ctrl+Shift+L` tersedia untuk mengisi otomatis jika tepat satu credential cocok.

## Aturan keamanan

- Pencocokan default adalah **host + protocol + port**.
- Subdomain berbeda tidak dianggap cocok secara default.
- Halaman HTTP dan HTTPS tidak dicampur.
- Password hanya dikirim setelah user memilih credential.
- Vault harus sudah unlocked.
- Extension hanya mendapat akses tab melalui `activeTab` setelah user menekan extension/shortcut.
- Jangan gunakan autofill pada halaman yang tidak dipercaya.

## Catatan installer

Native Messaging di Windows membutuhkan manifest yang terdaftar di registry `HKCU`. Installer produksi perlu menyalin host launcher dan mendaftarkan manifest dengan Extension ID resmi Chrome Web Store/Edge Add-ons. File `native-messaging-host.chrome.json` adalah template dokumentasi, bukan manifest yang langsung dipakai.
