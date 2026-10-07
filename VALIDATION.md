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

## Pembaruan PDF, font, dan pengelolaan materi — 7 Oktober 2026

- PDF lampiran dibaca langsung (31 halaman). Ditambahkan 18 ringkasan pelajaran dan 36 soal, mencakup pengantar/biografi, bab utama, dan delapan lampiran. Semuanya Draf, asal manual, dengan judul sumber, locator halaman cetak/PDF, dan tautan PDF lokal. Tidak menggunakan inferensi berbayar atau menghasilkan ayat dari ingatan. Perbedaan istilah ghunnah pada bab tasydid dan lampiran dipertahankan menurut konteks sumber.
- Instalasi koleksi bersifat tambahan dan sekali saja, atomik; tidak menimpa edit lama. Penanda ikut backup dan mencegah materi yang dihapus muncul kembali. Snapshot kosong tetap kosong saat impor/reload.
- Edit pelajaran mencakup isi, kaidah, contoh, sumber, dan soal terkait; verifikasi ulang eksplisit. Hapus memerlukan konfirmasi dan membersihkan pelajaran, soal, attempts dan reading dalam satu transaksi. Pembatalan tidak mengubah data. Snapshot stale ditolak, perubahan jawaban mereset history terkait saja, dan kegagalan write disimulasikan untuk membuktikan rollback. Kuis terbuka tidak menyimpan jawaban ke soal yang sudah dihapus/diubah.
- KFGQPC Uthmanic Script HAFS Regular dari pengguna menggantikan Noto. SHA-256 salinan font identik dengan lampiran: `59e20b2403687a67854fd199861abed3528068c035d2689898465d5faf39bb31`. Salinan PDF juga identik: `fd977d9e066dabf6ec0c5fa9b36e99be173a17ea2c9e497d7b1d807a202e0451`. Browser memuat face Arab; tampilan tasydid dan RTL diperiksa secara visual. Tidak ada permintaan CDN font.
- Lint dan typecheck lulus, 50 tes unit/transaksi lulus dalam 10 berkas, 24 pasangan kontras lulus, build produksi lulus, dan audit dependensi offline melaporkan 0 vulnerability pada data advisory tersimpan. Tidak ada dependency baru pada aplikasi; pembaca PDF sementara gratis hanya dipasang di /private/tmp untuk inspeksi.
- 22 skenario browser mobile/desktop lulus: 18 regresi umum dan empat skenario baru yang dijalankan ulang setelah memperbaiki asumsi test tentang signature font serta cara mencari label textarea/select. Dua tes AI opt-in tetap dilewati; inferensi tidak diperlukan untuk perubahan ini. Axe editor dan dialog hapus tidak menemukan pelanggaran. Pemeriksaan font memakai digest berkas sesungguhnya, bukan mengasumsikan semua OTF memiliki header CFF.
- Server produksi versi baru berjalan pada alamat lokal yang sama. PDF dan font asli di Downloads, root AGENTS.md, serta sources/ tidak diubah. Teks ringkasan dan pengucapan tetap membutuhkan review pengguna/guru; pemeriksaan otomatis bukan jaminan seluruh penjelasan agama sempurna.

## Navigasi, koleksi, progres, kuis baru, dan kalender — 7 Oktober 2026

- Detail pelajaran: sebelumnya/selanjutnya hanya dalam koleksi yang sama dan mengikuti urutan topik/filter; ujung urutan ditandai. Baca/belum dibaca dapat dibalik dan bertahan setelah reload. Reset progres koleksi maupun global menampilkan konfirmasi dan tidak menghapus materi/soal/draf.
- Menu Materi dan beranda menggunakan kartu koleksi. Klik membuka `/materi/koleksi/[subjectId]` yang hanya menampilkan koleksi tersebut. Penghapusan parent dan checkbox banyak pelajaran menampilkan hitungan dampak dan membutuhkan HAPUS persis. Transaksi memeriksa ulang snapshot, menolak perubahan dari tab lain, membersihkan seluruh turunan dan draf parent terkait, serta menjaga koleksi lain. Simulasi kegagalan penghapusan parent membuktikan rollback.
- Tahsin lama dihapus sekali sesuai permintaan, bersama topik, pelajaran, soal, draf terkait dan progresnya. Fixture historis untuk regresi tidak dipasang oleh aplikasi. Marker migrasi dan marker PDF ikut backup; konten terhapus tidak muncul kembali saat reload. Impor tetap memulihkan snapshot pengguna secara eksplisit.
- Hasil kuis memiliki Buat kuis baru. Soal di luar sesi sebelumnya diutamakan; opsi pada soal yang terpakai kembali dijamin berubah urutannya, dengan kunci jawaban tetap tepat. Bank soal terbatas dapat menimbulkan overlap; tidak ada klaim soal tanpa batas atau panggilan AI/API untuk mengacak sesi.
- Jam beranda berdetak setiap detik, memakai zona waktu perangkat dan format Indonesia. Masehi dan Hijriah islamic-civil dihitung lokal tanpa API; Hijriah dilabeli perhitungan. Uji mencakup pergantian tanggal tengah malam, bulan/tahun Hijriah, dan jam yang bergerak di browser. Tidak ada aria-live yang mengumumkan jam setiap detik.
- Lint, typecheck, 58 tes dalam 12 berkas, 24 pasangan kontras, dan build produksi lulus. 28 skenario browser mobile/desktop lulus; dua AI opt-in dilewati karena tidak diperlukan. Axe mencakup koleksi, detail, editor, dialog reset/hapus, serta alur lama. Pemeriksaan setelah navigasi menunggu metadata halaman stabil, tidak menonaktifkan aturan document-title. Reflow 320/360/390/768/1280 dan zoom 200% lulus.
- Regresi default subjek formulir Tambah setelah Tahsin dihapus ditemukan dan diperbaiki. Tes penyimpanan menunggu konfirmasi commit sebelum reload. Tangkapan layar beranda, kartu dan navigasi pelajaran diperiksa setelah data dimuat. Tidak menambah dependency atau layanan berbayar. Root AGENTS.md, sources/, PDF asli dan font asli tetap tidak diubah.

## Public/offline edition — 7 October 2026

- Public static edition reuses the current pages, components, schemas and Dexie database; Vite output contains no server AI implementation, environment files, credentials, or personal browser data.
- 6 public browser checks passed across mobile and desktop: offline reload and lesson navigation, reading persistence, five quiz attempts and regeneration, cached PDF/font, manual publication and edit, reload of arbitrary generated lesson IDs, backup export, accessibility, no API requests, per-user storage isolation, and confirmation of dirty-draft navigation.
- 59 unit tests passed, including preservation of `manual` provenance through publication; lint and strict type checking passed. 24 token contrast checks passed.
- Static build passed. Local Next production build passed with `--webpack`; Turbopack's CSS subprocess failed to bind its internal port under this environment's restrictions.
- Public install manifest includes 192/512 PNG icons. Service worker installs a content-hashed cache of the static application, bundled fonts and source PDF; activates only after full cache installation and removes obsolete application caches. IndexedDB remains independent of application cache updates.
- Local and public origins keep separate databases. Existing edits/progress require explicit JSON export/import. Installation and persistent-storage permission depend on browser support; clearing browser storage removes local data, so backup remains necessary.
- Sites identity is persisted at `public-site/.openai/hosting.json`. Public access was explicitly enabled for the user-requested audience. Package source commit: `03cc5b886bedd671a82385efc0d3e448b823f4b9`.
- Local browser regression: 28 checks passed; 2 opt-in live Ollama checks skipped. Free AI provider configuration was not changed by this publication.
- Publication confirmed `succeeded`: https://murajaah-ridwan.ridwan-22693.chatgpt.site . Version and deployment identifiers are recorded in PUBLICATION.md. No paid AI API, external account signup, or cloud database was configured.

## GitHub Pages — 7 October 2026

- Pushed complete tracked project history to public `ridwanahmadm/belajartahsin`; excluded local environment/secrets, AI runtime, synced references, generated build output and browser records. Added explicit ignores for root synced AGENTS.md and sources/.
- Added a configurable static base path for Vite assets, PDF URLs, installation manifest and service worker, with per-path application caches. GitHub Pages build does not mutate the separate Sites checkout.
- Tests: 6 public browser checks on `/belajartahsin/` and 6 on `/`, all passed across mobile/desktop. 59 unit tests, typecheck/lint, 24 contrast checks, and local webpack production build passed.
- GitHub Actions run 37561286823: clean `npm ci`, lint, typecheck, unit tests, contrast, static build and deploy all succeeded for source a7fd52fa2c49126a1bba221952ba6b2736adfc03.
- Live https://ridwanahmadm.github.io/belajartahsin/ and manifest/service worker/font/PDF endpoints returned HTTP 200. Manifest start_url/scope and worker paths validated. HTTPS is enforced; no paid AI or hosting service was added.
