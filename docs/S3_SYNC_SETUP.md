# Sinkronisasi PassSa ke Amazon S3

PassSa dapat memakai AWS S3 atau endpoint S3-compatible (misalnya MinIO). Objek yang dikirim berisi snapshot vault yang payload-nya sudah dienkripsi PassSa; sinkronisasi tidak mengunggah password dalam bentuk terbuka. Metadata seperti alamat email akun di dalam snapshot tetap terlihat bagi pemegang akses bucket.

## Pengaturan

1. Buat bucket privat. Untuk S3-compatible, gunakan endpoint HTTPS; HTTP diizinkan hanya untuk localhost saat pengembangan.
2. Buat access key khusus PassSa dengan izin minimum di bawah, lalu masukkan endpoint (opsional untuk AWS), region, bucket, prefix, Access Key ID, dan Secret Access Key pada Pengaturan → Amazon S3.
3. PassSa menguji akses bucket dan menyimpan kredensial secara lokal terenkripsi oleh Windows. Koneksi saja tidak mengunggah data.
4. Tekan **Sinkronkan sekarang** pada setiap perangkat. Saat perangkat baru perlu mengunduh vault yang kuncinya berbeda, PassSa meminta password vault sekali untuk membuka snapshot dan mengenkripsinya dengan kunci lokal perangkat tersebut. Password ini tidak disimpan.

## Izin IAM contoh

Ganti `YOUR_BUCKET` dengan nama bucket dan sesuaikan `PassSa/*` jika prefix di aplikasi diubah. `s3:ListBucket` diperlukan untuk tes koneksi `HeadBucket`; operasi isi objek dibatasi ke prefix PassSa. Disarankan memakai bucket khusus PassSa.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CheckPassSaBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::YOUR_BUCKET"
    },
    {
      "Sid": "ReadWritePassSaSnapshots",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET/PassSa/*"
    }
  ]
}
```

PassSa tidak memerlukan `s3:DeleteObject`. Memutuskan koneksi hanya menghapus kredensial lokal; objek di bucket tidak dihapus. AWS access keys berhak luas meningkatkan risiko kebocoran, jadi buat key dengan scope bucket ini saja, jangan tempelkan key ke tiket/chat, dan rotasi atau cabut key di IAM jika perangkat hilang. Sinkronisasi bersifat manual dan konflik membuat salinan backup terpisah agar snapshot utama tidak tertimpa.
