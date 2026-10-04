# Kebijakan Keamanan PassSa

Kami menghargai laporan yang membantu melindungi pengguna dan data mereka.

## Melaporkan kerentanan

Jangan mengirim detail kerentanan melalui issue, diskusi, atau pull request publik. Gunakan [GitHub Private Vulnerability Reporting](https://github.com/okkinurf/passsa/security/advisories/new) agar laporan hanya dapat dilihat oleh pihak yang berwenang.

Sertakan informasi secukupnya untuk membantu reproduksi dan penilaian:

- versi PassSa dan sistem operasi;
- komponen atau fitur yang terdampak;
- dampak yang mungkin dialami pengguna;
- langkah reproduksi minimum dan bukti yang sudah disamarkan.

Jangan menyertakan password, isi vault, token, credential, data pribadi, atau salinan file sensitif. Hapus atau samarkan informasi tersebut dari log dan tangkapan layar.

Maintainer akan meninjau laporan secepat yang memungkinkan. Saat ini tidak ada SLA respons maupun jaminan waktu perbaikan. Mohon koordinasikan publikasi detail dengan maintainer agar pengguna memiliki kesempatan memperoleh perbaikan terlebih dahulu.

## Cakupan

Laporan keamanan yang relevan mencakup:

- kerahasiaan atau integritas vault, enkripsi, dan penyimpanan kunci perangkat;
- autentikasi lokal, password, dan 2FA;
- batas keamanan IPC dan command Tauri;
- penyimpanan credential sinkronisasi serta alur Google Drive atau S3;
- backup, pemulihan, import/export, dan clipboard bila berisiko membocorkan data;
- proses build, signing, dependency, dan publikasi paket PassSa.

> Jika masalah berasal dari dependency, laporkan juga kepada proyek upstream. Tetap beri tahu maintainer PassSa jika ada jalur dampak yang dapat direproduksi pada aplikasi ini.

Laporan yang hanya melibatkan rekayasa sosial atau memerlukan perangkat maupun akun sistem operasi yang telah sepenuhnya dikuasai penyerang umumnya berada di luar cakupan. Jika Anda tidak yakin apakah suatu masalah berdampak pada PassSa, silakan kirim laporan privat agar dapat ditriase.

## Versi yang didukung

Fokus dukungan keamanan saat ini adalah release Tauri v2 terbaru. Runtime Electron merupakan jalur kompatibilitas lama dan tidak dijanjikan menerima perbaikan keamanan baru. Pengguna sebaiknya memakai release Tauri terbaru.

## Batas keamanan yang diketahui

PassSa masih berstatus development preview dan belum diaudit secara independen. Installer Windows memakai sertifikat self-signed; DMG macOS belum ditandatangani atau notarized. Batas platform dan advisory dependency yang diketahui dijelaskan di [KNOWN-LIMITS.md](KNOWN-LIMITS.md).
