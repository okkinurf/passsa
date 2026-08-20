# Fitur keamanan PassSa

## Custom Fields

Setiap credential dapat menyimpan sampai 50 field tambahan. Label dan nilai dinormalisasi sebelum masuk ke dokumen vault, lalu seluruh dokumen tetap dienkripsi AES-256-GCM bersama login biasa. Tipe yang tersedia: Text, Secret, URL, Email, Angka, dan Ya/Tidak. Nilai field rahasia tidak dikirim pada daftar item; renderer hanya menerima nilainya saat form edit dibuka.

Custom field yang labelnya sama dengan `id`, `name`, `aria-label`, atau `placeholder` input halaman dapat diisi oleh extension autofill ketika pengguna memilih credential secara eksplisit.

## Secure Note

Secure Note adalah `type: "secure-note"`. Item ini hanya membutuhkan nama dan catatan; username, password, URL, serta autofill login dinonaktifkan. Tags, favorit, grup, password history (kosong), dan custom fields tetap tersedia. Secure Note ikut tersimpan di snapshot Drive terenkripsi dan backup `.passsa`.

## Windows Hello / biometrik

Pengguna mengaktifkan fitur dari Pengaturan setelah login dengan password vault. PassSa meminta Windows Hello melalui `IUserConsentVerifierInterop::RequestVerificationForWindowAsync`, lalu menyimpan kunci vault yang sama menggunakan Electron `safeStorage` (DPAPI Windows). Pada login berikutnya, verifikasi Hello berhasil diperlukan sebelum kunci dibaca.

Kunci tetap terikat ke akun Windows yang sama dan tidak pernah dikirim ke Google Drive. Jika perangkat tidak memiliki Windows Hello, kebijakan Windows memblokirnya, atau helper tidak tersedia, aplikasi menampilkan alasan dan password vault tetap menjadi jalur pemulihan. Aktifkan hanya pada perangkat pribadi.

Binary helper berada di `scripts/windows-hello-helper.exe`. Untuk rebuild di Windows gunakan:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-windows-hello-helper.ps1
```
