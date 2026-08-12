# Analisis arsitektur KeePassXC untuk PassSa

Referensi utama:

- https://github.com/keepassxreboot/keepassxc
- https://github.com/keepassxreboot/keepassxc/tree/develop/src
- https://github.com/keepassxreboot/keepassxc/tree/develop/tests
- https://keepassxc.org/docs/

KeePassXC memisahkan domain database dari kriptografi, format file, pengelolaan key, GUI, dan integrasi seperti browser atau CLI. Repository juga mempunyai pengujian tersendiri untuk database, entry, group, pencarian, merge, key, format KDBX, generator password, dan GUI.

PassSa tidak memakai atau menyalin implementasi C++/Qt maupun format KDBX KeePassXC. Pola arsitekturnya diterapkan secara native pada Electron/Node agar lisensi, ukuran, dan kompleksitas tetap terkendali.

## Pemetaan

| KeePassXC | PassSa | Tanggung jawab |
| --- | --- | --- |
| `src/core` | `src/core` | Model dan aturan entry, grup, favorit, Sampah, history |
| `src/crypto` | `src/auth-crypto.js`, `src/vault-crypto.js` | KDF dan authenticated encryption |
| `src/format`, streams | `src/storage` | Persistensi JSON atomik dan format envelope vault |
| `src/keys`, quickunlock | `src/services/auth-service.js` | Siklus hidup sesi dan kunci vault di memori |
| Database operations | `src/services/vault-service.js` | CRUD, restore, purge, dan enkripsi saat simpan |
| `src/gui` | `src/index.html`, `src/renderer.js`, `src/styles.css` | Antarmuka tanpa akses langsung ke filesystem/key |
| `tests` | `test` | Tes domain, service, autentikasi, dan kriptografi |

## Prinsip yang diterapkan

1. `main.js` hanya menjadi composition root dan adapter IPC.
2. Kunci vault tidak pernah dikirim ke renderer.
3. Semua data entry, termasuk history dan metadata, berada di dalam ciphertext.
4. Penghapusan normal adalah soft-delete; penghapusan permanen harus eksplisit.
5. Entry lama dinormalisasi saat dibaca sehingga format versi awal tetap kompatibel.
6. Penulisan file menggunakan temporary file lalu rename untuk mengurangi risiko file setengah tertulis.

## Tahap berikutnya

- Memindahkan renderer menjadi controller/view modules terpisah.
- Menambahkan restore dari entry history.
- Database health report dan pemeriksaan password duplikat/lemah.
- Import/export terkontrol, kemudian sinkronisasi Google Drive.
- Pengujian end-to-end Electron dan versioned migrations formal.
