# Arsitektur dan workflow update PassSa

Dokumen ini menjadi peta singkat saat memperbaiki fitur. Prinsipnya: UI hanya
mengatur tampilan, service mengatur use-case, dan storage/core menjaga data.

## Peta folder

| Lokasi | Tanggung jawab | Aturan perubahan |
| --- | --- | --- |
| `main.js` | Composition root Electron, lifecycle window/tray, IPC registration | Jangan menaruh logika domain baru di sini; panggil service melalui handler IPC. |
| `preload.js` | API aman renderer dengan `contextBridge` | Expose fungsi kecil, validasi input di service, jangan expose `ipcRenderer` mentah. |
| `src/main/ipc-helpers.js` | Trust check IPC dan serialisasi mutasi | Semua handler yang menulis data harus memakai `serializeMutation`. |
| `src/core/` | Normalisasi dan aturan domain murni | Tidak boleh mengakses Electron, DOM, atau filesystem. Tambahkan test unit. |
| `src/services/` | Use-case vault, auth, sync, import/export, autofill | Semua perubahan data melewati service; jaga operasi tetap dapat diuji dengan dependency injection. |
| `src/storage/` | Atomic JSON dan penyimpanan token/kunci | Jangan menyimpan plaintext secret; gunakan `safeStorage`/envelope terenkripsi. |
| `src/renderer.js` | Orkestrasi event UI dan render state | Jangan menambahkan akses filesystem/Node. Escape data sebelum `innerHTML`. |
| `src/quick-access.*` | UI Quick Access terisolasi | Hanya gunakan API Quick Access yang diekspos preload khusus. |
| `src-tauri/` | Shell Tauri v2 dan command non-secret | Jangan mengaktifkan runtime Tauri sebelum backend Rust untuk vault selesai dipindahkan. |
| `scripts/` | Tool QA, seed, packaging, dan native helper | Gunakan helper bersama di `scripts/lib/runtime.js`; script harus gagal dengan pesan yang dapat ditindaklanjuti. |
| `test/` | Unit/integration test service dan storage | Satu file test per modul/use-case utama. |

## Alur penambahan fitur

1. Tentukan kontrak data dan batas validasinya di `src/core/`.
2. Implementasikan use-case di `src/services/` dan tambahkan unit test.
3. Tambahkan IPC handler di `main.js`, lalu expose API minimal di `preload.js`.
4. Tambahkan render/event di `src/renderer.js` atau Quick Access.
5. Tambahkan skenario E2E untuk jalur pengguna utama di `scripts/e2e-smoke.js`.
6. Jalankan `npm run qa:full`, kemudian `npm run pack` atau pipeline release.

## Kontrak keamanan yang tidak boleh dilanggar

- `publicEntry()` adalah batas data sebelum credential dikirim ke renderer.
- Password, token, history secret, dan custom field bertipe secret tidak boleh
  masuk ke log, dataset HTML, atau respons list.
- Mutasi vault harus serial agar dua operasi tidak menimpa satu sama lain.
- Perubahan schema harus punya normalisasi/migrasi kompatibel di `core` dan
  test untuk format lama.
- Import CSV harus tetap meminta konfirmasi plaintext.

## Checklist pull/update

```text
[ ] npm test
[ ] npm run test:e2e
[ ] npm run qa:full
[ ] git diff --check
[ ] npm audit --offline --omit=dev
[ ] cek perubahan schema dan backup/rollback
[ ] cek signing sebelum membuat installer produksi
```

`src/renderer.js` dan `src/styles.css` saat ini masih menjadi entry UI utama agar
bundle offline tetap sederhana. Pemisahan berikutnya sebaiknya dilakukan per
fitur (sidebar, items, settings, notes), satu modul dan satu test E2E per tahap,
bukan memindahkan seluruh file sekaligus.
