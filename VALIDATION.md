# Pemeriksaan akhir Murajaah

Tanggal: 7 Oktober 2026 (Asia/Jakarta). Semua milestone M1–M5 telah diimplementasikan pada repositori yang sama. Tidak ada layanan berbayar, akun cloud, langganan, atau deployment yang diaktifkan.

## Hasil

| Pemeriksaan | Hasil |
| --- | --- |
| Lint TypeScript, hooks, aksesibilitas | Lulus tanpa peringatan |
| Strict typecheck | Lulus |
| Tes logika, provenance, route, transaksi, backup, riset | 38 lulus, 7 berkas |
| Kontras token | 22 pasangan lulus; teks ≥4,5:1, kontrol/fokus ≥3:1 |
| Chromium Playwright | 18 skenario lulus pada proyek mobile dan desktop |
| Axe | 0 pelanggaran pada halaman/keadaan yang diuji |
| Reflow | 320, 360, 390, 768, 1280 px tanpa horizontal scroll |
| Zoom | 200% pada viewport 1280 px, tanpa horizontal scroll |
| Keyboard | Skip link, fokus terlihat, radio kuis dan penyimpanan jawaban lulus |
| Reduced motion | Alur dapat digunakan dengan prefers-reduced-motion |
| Arab | Run Arab diisolasi lang=ar, dir=rtl, font lokal 32 px, diakritik dipertahankan |
| Build produksi | Lulus |
| Audit dependensi | 0 vulnerability dilaporkan, produksi dan development |
| AI lokal nyata | Teks sintetis, foto sintetis, dan riset Wikipedia gratis lulus melalui route terlindungi |

Suite browser biasa melewati dua instansi tes AI opt-in secara sengaja. Tes opt-in desktop dijalankan terpisah dan lulus; tiga permintaan nyata diproses oleh Qwen3.5:4b lokal melalui Ollama dengan cloud dinonaktifkan. Tidak memakai token/kunci API berbayar. Unduhan dan penyimpanan model berada di direktori `.local-ai/` yang diabaikan Git. Konfigurasi privat `.env.local` juga tidak dikomit.

Halaman yang diperiksa: Beranda, Materi, pelajaran, setup kuis, feedback, hasil, Tambah Materi, editor draf, Pengaturan, serta halaman tidak ditemukan. Alur: baca→simpan kemajuan→reload; kuis→feedback→hasil→ulang salah→riwayat tersimpan; buat draf→simpan→reload→edit→setujui→terbit; foto→perkecil→pratinjau→hapus; ekspor→validasi→batal→tolak file rusak→konfirmasi impor. Tes transaksi memastikan file tidak valid, relasi orphan, duplikat dan kegagalan publikasi tidak meninggalkan mutasi sebagian. Riset hanya mengambil host Wikipedia tetap, bukan URL pengguna yang dapat mengarah ke jaringan privat.

## Masalah yang ditemukan dan diperbaiki

- Kontras teks sekunder di permukaan catatan sedikit di bawah ambang: token diperbaiki.
- Border kontrol diperkuat; salah/benar dibedakan lewat ikon, teks, dan warna semantik, dengan aria-live.
- Teks Arab inline dalam ringkasan awal sebelumnya terlalu kecil dan tanpa penandaan bahasa: diisolasi dan memakai font Arab lokal dengan ukuran yang sesuai.
- Model lokal mengabaikan instruksi dan mencoba menambah contoh/terminologi Arab: schema model sekarang mewajibkan examples kosong dan alfabet Latin untuk prosa. Contoh Arab tetap dapat ditempel pengguna saat review.
- Model menulis ulang bukti seolah kutipan: URL dan pilihan bukti riset dikunci ke sumber/potongan nyata sebelum decoding; pemeriksaan sumber tetap dipertahankan. Salinan panjang ditolak.
- Rantai lint memiliki advisory dependensi: diganti dengan plugin kompatibel tanpa forced downgrade. Audit akhir bersih.
- Impor kosong tidak diisi ulang dengan seed; filter di UI diperbarui setelah impor; ID dan URL divalidasi; kode akses tidak masuk backup.
- Kontrol fokus diberi ruang scroll terhadap navigasi bawah; indikator development tidak menutupi UI.

## Batas pemeriksaan

Ini bukti pemeriksaan, bukan klaim sempurna atau sertifikasi WCAG. Browser nyata Safari/Firefox, screen reader manual, semua perangkat, semua topik, dan seluruh kualitas keluaran model belum diuji. Foto sintetis membuktikan jalur vision; tidak membuktikan OCR buku asli selalu benar. Kecocokan semantik AI terhadap sumber tetap perlu tinjauan manusia. Materi awal dan materi AI tetap Draf sampai pengguna menyatakan verifikasi; tidak ada isi yang diklaim berasal dari buku tanpa bahan yang diberikan.

AI gratis membutuhkan aplikasi dan Ollama pada perangkat yang sama. Vercel tidak dapat mengakses localhost laptop; hosting cloud tidak diaktifkan dan tidak dijanjikan mampu menjalankan model besar secara gratis. Biaya layanan inferensi/API adalah nol pada konfigurasi ini; perangkat, disk, listrik dan koneksi internet tetap digunakan.

Root AGENTS.md dan sources/ tidak diubah. Konvensi/commands ditambahkan ke app/AGENTS.md. Backup/seed mempertahankan data lama tanpa reset atau rebuild.
