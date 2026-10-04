# Security policy

## Melaporkan kerentanan

Jangan membuat issue atau pull request publik untuk kerentanan. Gunakan [GitHub Private Vulnerability Reporting](https://github.com/okkinurf/passsa/security/advisories/new). Sertakan versi PassSa, sistem operasi, dampak, dan langkah reproduksi minimum. Jangan sertakan vault asli, password, token, atau data pribadi.

Maintainer akan meninjau laporan secepat yang memungkinkan, tetapi proyek ini tidak menjanjikan SLA respons atau perbaikan. Mohon jangan memublikasikan detail sebelum perbaikan dan pengungkapan terkoordinasi dibahas.

## Cakupan

Termasuk dalam cakupan: enkripsi/dekripsi vault, penyimpanan kunci OS, autentikasi lokal dan 2FA, batas IPC/command Tauri, pengelolaan secret sinkronisasi, import/backup, serta pipeline paket/release.

Di luar cakupan: kerentanan yang memerlukan perangkat atau akun OS yang telah sepenuhnya dikuasai penyerang, serangan rekayasa sosial, dan bug upstream dependency tanpa jalur eksploit khusus PassSa. Laporkan bug upstream kepada proyek asalnya juga.

## Versi yang didukung

Sampai tersedia kebijakan rilis stabil, fokus perbaikan keamanan adalah release Tauri terbaru. Runtime Electron adalah jalur kompatibilitas lama dan tidak dijanjikan menerima perbaikan keamanan baru.

## Catatan keamanan produk

PassSa adalah development preview dan belum diaudit pihak independen. Tanda tangan self-signed Windows bukan identitas publisher yang diverifikasi CA publik. Lihat [batas yang diketahui](KNOWN-LIMITS.md) untuk keterbatasan platform dan keamanan.
