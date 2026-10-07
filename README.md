# Murajaah

Aplikasi belajar pribadi dalam Bahasa Indonesia: pelajaran singkat, kuis acak, tinjauan draf, dan cadangan lokal. Implementasi M1–M5 melanjutkan aplikasi yang sama; data lama tetap dipertahankan.

## Menjalankan tanpa layanan berbayar

Tidak ada API berbayar, langganan, login, analitik, atau database server. Adapter server hanya mengizinkan Ollama pada loopback. Provider selain `ollama`, endpoint jarak jauh, model cloud, dan alias model ke cloud ditolak; tidak ada fallback berbayar. `AI_API_KEY` tidak digunakan.

1. `npm ci`
2. Pasang [Ollama](https://ollama.com/download) gratis. Untuk instalasi terisolasi yang sudah tersedia pada workspace ini, runtime ada di `.local-ai/runtime/ollama` dan model di `.local-ai/models`; keduanya diabaikan Git.
3. Jalankan `npm run ai:serve` di terminal terpisah. Perintah mengaktifkan `OLLAMA_NO_CLOUD=1`, bind `127.0.0.1:11434`, dan penyimpanan model lokal proyek.
4. Unduh model lokal bertag eksplisit. Contoh untuk RAM 16 GB: `OLLAMA_MODELS="$PWD/.local-ai/models" ollama pull qwen3.5:4b`. Jika memakai runtime terisolasi, ganti `ollama` dengan `.local-ai/runtime/ollama`. Unduhan model memerlukan sekitar 4 GB; jangan memilih tag cloud. Model yang lebih besar dapat dipilih sesuai kapasitas perangkat; tidak ada nama model yang dikunci dalam kode aplikasi.
5. `npm run setup:local -- qwen3.5:4b` membuat `.env.local` privat berizin 0600 dengan kode akses acak. Tidak menimpa konfigurasi yang sudah ada. Alternatif: salin `.env.example` dan isi `AI_MODEL` serta `APP_ACCESS_CODE` (minimal 24 karakter acak).
6. `npm run dev`, buka `http://localhost:3000`, lalu masukkan `APP_ACCESS_CODE` dari `.env.local` sekali di Pengaturan.

Qwen3.5-4B dipilih untuk verifikasi pada perangkat RAM 16 GB: model multimodal berlisensi Apache 2.0 menurut [model card resmi](https://huggingface.co/Qwen/Qwen3.5-4B). Ini pilihan yang sesuai perangkat, bukan klaim sebagai model terbaik di semua tugas. Instalasi dan API inferensi lokal tidak menggunakan tagihan layanan; perangkat, listrik, internet, dan ruang disk tetap merupakan sumber daya pengguna.

Next.js dapat dideploy ke Vercel, tetapi server Vercel tidak dapat mengakses Ollama di laptop melalui `localhost`. Semua alur termasuk AI gratis berjalan jika aplikasi dan Ollama dijalankan pada perangkat yang sama. Pada Vercel, perpustakaan, kuis, tinjauan draf tersimpan, dan cadangan berjalan; generasi AI memerlukan runtime lokal dan gagal dengan pesan yang jelas jika tidak tersedia. Tidak ada deployment atau langganan yang diaktifkan oleh proyek ini.

## Belajar dan kuis

Beranda → kartu koleksi → pelajaran. Menu Materi memakai kartu seperti beranda; klik kartu untuk melihat koleksi itu saja. Halaman pelajaran menyediakan Materi sebelumnya/selanjutnya dalam koleksi yang sama, sesuai urutan topik dan filter. Tombol Tandai sudah dibaca berubah menjadi Tandai belum dibaca; kedua keadaan tersimpan setelah reload. Kuis menyediakan pilihan subjek/topik dan 5/10/20 soal; jika persediaan kurang, jumlah sesungguhnya ditampilkan sebelum mulai. Opsi diacak dengan indeks jawaban tetap benar; tidak ada soal berulang dalam satu sesi. Soal belum pernah dilihat berbobot 6, jawaban terakhir salah 8, dan jawaban benar 1/box. Box 0–5: salah kembali ke 0, benar naik satu tingkat. Ini heuristik belajar sederhana.

Jawaban tersimpan per soal. Hasil memuat penjelasan, tautan materi, serta Ulangi yang salah. Tautan materi saat kuis membuka tab baru agar sesi tetap terbuka. Sesi yang belum selesai tidak dipulihkan setelah reload; jawaban yang sudah tersimpan tetap ada. Filter Hanya materi terverifikasi berlaku pada materi dan kuis; default mati.

## Tambah, tinjau, dan terbitkan

Pilih subjek yang ada atau ketik subjek baru. Isi topik dan referensi (judul buku, URL, atau catatan), halaman/bab jika diketahui, serta opsional teks atau maksimal empat foto. Foto JPEG/PNG/WebP sampai 15 MB diperkecil di browser menjadi JPEG, sisi terpanjang maksimal 1600 px, maksimal 750.000 karakter data URL per foto. Pratinjau dan hapus foto tersedia. Foto asli tidak disimpan.

Dengan teks/foto, AI hanya boleh memakai bahan tersebut. Bukti singkat wajib; untuk teks, bukti dicocokkan persis. Untuk foto, pembacaan dan kecocokan makna harus diperiksa manusia. Tanpa bahan, aplikasi melakukan riset anonim gratis pada API Wikipedia Indonesia, lalu Inggris bila perlu, dengan host tetap; AI hanya menerima hasil riset yang benar-benar diambil. Setiap URL dan bukti harus cocok dengan sumber hasil riset. Referensi URL/buku yang diketik adalah petunjuk, bukan klaim bahwa buku atau URL tersebut sudah dibaca. Semua hasil riset dilabeli Rujukan umum, dengan URL untuk ditinjau. Cakupan riset terbatas pada Wikipedia; bila sumber tidak sesuai, tempel teks atau foto yang lebih tepat. Rujukan umum tetap Draf.

AI dilarang menghasilkan ayat Al-Quran atau transliterasi ayat dari ingatan. Arab hanya berada pada contoh pendek yang berasal dari teks pengguna; model lokal diminta tidak membuat contoh Arab. Tempel contoh sendiri saat tinjauan. Rujukan ayat memakai surah:ayah. Tidak ada provider teks Quran yang diaktifkan; integrasi berikutnya harus melalui QuranProvider dan memeriksa ketentuan sumber dahulu.

Draf disimpan terpisah dan belum muncul sebagai pelajaran. Edit judul, penjelasan, ringkasan, contoh, locator, soal, relasi pelajaran, opsi, kunci jawaban, serta penjelasan jawaban. Simpan perubahan secara eksplisit. Peringatan diberikan saat reload atau meninggalkan draf dengan perubahan belum disimpan. Setelah semua isi ditinjau, centang persetujuan untuk menerbitkan. Status tetap Draf kecuali Anda secara terpisah menyatakan telah memverifikasinya dengan sumber atau guru. Asal AI tetap tercatat. Penerbitan atomik mencegah data separuh tersimpan dan penerbitan ganda; tidak menimpa subjek lama.

Koleksi awal Tahsin telah dihapus atas permintaan pengguna. Migrasi sekali `migration:remove-tahsin-v1` menghapus seluruh koleksi lama beserta topik, pelajaran, soal, draf terkait, reading dan attempts; koleksi lainnya tetap tersimpan. Instalasi baru hanya memuat Tuhfatul Athfal. Data Tahsin historis hanya dipakai sebagai fixture regresi, bukan dipasang oleh aplikasi. Impor cadangan tetap merupakan pemulihan eksplisit snapshot pengguna.

## Materi Tuhfatul Athfal dan pengelolaan pelajaran

PDF pengguna `Terjemah-Tuhfatul-Athfal.pdf` (31 halaman), terjemah tafsiriyyah oleh Laili Al-Fadhli, Cetakan II Mei 2017, dibundel lokal di `public/references/terjemah-tuhfatul-athfal.pdf`. Koleksi Tuhfatul Athfal memuat 18 pelajaran ringkas dan 36 soal: pengantar/biografi, semua bab utama, serta delapan lampiran. Tiap pelajaran memiliki nomor halaman cetak, nomor halaman PDF, dan tautan langsung ke PDF. Ringkasan disusun dari sumber, tanpa inferensi AI atau biaya API; semuanya tetap Draf untuk tinjauan pengguna/guru. Contoh singkat adalah diagram huruf, bukan salinan ayat dari ingatan. Perbedaan pembagian ghunnah pada bab tasydid dan lampiran dijelaskan menurut konteks masing-masing.

Koleksi ditambahkan sekali, secara atomik, ke database yang sudah ada. Materi lama tidak ditimpa. Penanda `content:tuhfatul-athfal-v1` mencegah materi yang dihapus muncul kembali, dan ikut cadangan. Impor tetap memulihkan snapshot persis, termasuk snapshot kosong.

Buka pelajaran → **Edit materi** untuk menyunting judul, penjelasan, kaidah, contoh Arab, rujukan, dan soal terkait (termasuk pilihan serta kunci jawaban). Simpan perubahan atau Batal edit. Status kembali Draf kecuali verifikasi ulang dicentang; asal materi dan ID tetap dijaga. Isi pelajaran yang berubah mereset tanda baca; perubahan pertanyaan/pilihan/kunci jawaban atau penghapusan soal mereset riwayat soal terkait saja. Editor memperingatkan perubahan belum disimpan saat reload/menutup tab. Perubahan dari tab lain ditolak sebelum mutasi agar tidak menimpa versi terbaru.

**Hapus materi** menampilkan konfirmasi: pelajaran, soal terkait, riwayat jawaban dan kemajuan membacanya dihapus bersama dalam satu transaksi. Batal tidak mengubah data. Materi lain tetap tersimpan. Kuis yang masih terbuka di tab lain menolak menyimpan jawaban untuk soal yang sudah diubah/dihapus. Tautan pelajaran langsung tetap dapat dipakai untuk mengedit draf walaupun filter daftar terverifikasi aktif.

Font Arab memakai OTF persis dari lampiran, dibundel via next/font/local di `public/fonts/kfgqpc-uthmanic-hafs.otf`, tanpa CDN. PDF dan font dipakai pada aplikasi pribadi ini; berkas asli di Downloads tidak diubah.

## Progres, kuis baru, dan hapus koleksi

Reset progres koleksi tersedia di halaman koleksi dan detail pelajaran. Reset semua progres tersedia di beranda dan Pengaturan. Keduanya menampilkan konfirmasi dan hanya menghapus tanda sudah dibaca serta riwayat jawaban; materi, soal dan draf tetap ada.

Setelah hasil kuis, **Buat kuis baru** membuat sesi baru dalam pilihan subjek/topik/jumlah yang sama. Pemilihan mengutamakan ID soal di luar sesi sebelumnya. Jika soal tersisa kurang, sebagian boleh dipakai kembali tanpa pengulangan dalam satu sesi; urutan sesi dan opsi jawaban diacak ulang, dengan perubahan urutan opsi dijamin pada soal yang dipakai kembali. Indeks jawaban tetap tepat. Riwayat belajar tetap disimpan. Ini pengacakan bank soal sumber yang sudah ada, tidak memanggil AI atau API berbayar dan tidak menjanjikan bank soal tanpa batas.

Hapus koleksi tersedia pada kartu menu Materi dan halaman koleksi. Pelajaran bisa dipilih dengan checkbox, termasuk Pilih semua yang ditampilkan, lalu Hapus pelajaran terpilih. Dialog menunjukkan jumlah topik, pelajaran, soal, riwayat jawaban, tanda baca dan draf yang terdampak. Pengguna harus mengetik **HAPUS** persis. Ringkasan dibandingkan lagi dalam transaksi; data yang berubah di tab lain menyebabkan penghapusan ditolak sampai ringkasan diperiksa ulang. Penghapusan parent membersihkan seluruh graph dan draf terkait, tanpa memengaruhi koleksi lain; checkbox pelajaran hanya menghapus pelajaran terpilih dan turunannya. Marker sumber mencegah konten terhapus muncul kembali.

Beranda menampilkan jam setiap detik serta tanggal Masehi dan Hijriah menurut zona waktu perangkat. Hijriah memakai kalender perhitungan `islamic-civil`, dilabeli sebagai perhitungan, bukan penetapan rukyat setempat. Format menggunakan [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat) bawaan browser, tanpa API kalender, akun, atau biaya. Nilai waktu tidak diumumkan setiap detik kepada screen reader.

## Cadangan JSON

Di Pengaturan, Ekspor JSON mengunduh subjek, topik, pelajaran, soal, jawaban, kemajuan, draf, bukti, dan filter. Kode akses browser serta kunci AI tidak disertakan. Cadangkan secara berkala; menghapus data browser menghapus data lokal.

Impor menerima JSON maksimal 20 MB, format `murajaah`, versi 1. Struktur, ID duplikat, relasi, status, indeks jawaban, URL, draf dan metadata divalidasi sebelum ada perubahan. Ringkasan ditampilkan lebih dahulu. Konfirmasi eksplisit mengganti seluruh snapshot; ekspor data lama dahulu jika ingin menyimpannya. Pembatalan dan file tidak valid tidak mengubah data. Impor berlangsung dalam satu transaksi, termasuk snapshot kosong yang tidak otomatis diisi ulang oleh seed.

Dexie database `murajaah`, versi 1: subjects → topics → lessons → questions, attempts, readings, meta. Penanda seed dan seluruh seed ditulis atomik sekali. Pembaruan aplikasi tidak menimpa edit lama. Backend database tidak digunakan. Bentuk data ada di `lib/schema.ts`, cadangan di `lib/backup.ts`.

## Perlindungan jalur AI

Satu route `POST /api/generate`: kode akses privat, origin browser sesuai aplikasi, JSON tervalidasi, body maksimal 3,2 MB dengan pembacaan bertahap. Respons AI melewati Zod dan pemeriksaan bukti, sumber, serta jawaban. Tidak ada HTML dari AI yang dirender. URL wajib HTTP(S). Respons tidak dicache, tidak ada retry otomatis, tidak ada permintaan ke layanan berbayar. Model harus sudah terpasang; aplikasi tidak otomatis mengunduh atau mengaktifkan model cloud.

Limiter mengizinkan satu inferensi bersamaan, tiga mulai/menit dan dua belas mulai/jam per proses. Instance tidak berbagi limiter; ini bukan batas global. Kode akses adalah capability secret lokal, bukan login. Simpan pada perangkat pribadi; mengganti APP_ACCESS_CODE mencabut kode lama. `.env.local` dan `.local-ai/` tidak masuk Git. Ollama cloud juga dinonaktifkan pada proses runtime sesuai [dokumentasi resmi](https://docs.ollama.com/faq). Inferensi lokal dapat memerlukan beberapa menit; batas proses model 300 detik dan klien 360 detik.

## Desain dan konvensi

Acuan usability adalah Nielsen Norman Group, bukan MM Group. Token merek tidak diberikan: gunakan tema terang dengan satu aksen hijau, permukaan netral, warna kesalahan hanya untuk umpan balik fungsional, skala jarak 8 px, dan token di `app/tokens.css`. Inter dan KFGQPC Uthmanic Script HAFS Regular (OTF lampiran pengguna) dibundel via next/font/local, tanpa CDN font. Arab memakai lang=ar, dir=rtl, ukuran 32 px dan line-height 2 pada contoh. Navigasi bawah di mobile, samping mulai 1024 px. Tidak ada gamifikasi, analytics, ilustrasi dekoratif, atau dependency animasi.

Root AGENTS.md dan sources/ adalah file sinkronisasi read-only dan tidak diubah. Konvensi developer aplikasi ada di `app/AGENTS.md`. Gunakan strict TypeScript, pertahankan provenance, dan validasi sebelum mutasi. Tidak boleh menambahkan provider berbayar. Dokumentasi adapter: [Ollama chat](https://docs.ollama.com/api/chat), [structured outputs](https://docs.ollama.com/capabilities/structured-outputs), [MediaWiki search](https://www.mediawiki.org/wiki/API:Search), [text extracts](https://www.mediawiki.org/wiki/Extension:TextExtracts).

## Verifikasi

- `npm run verify`: lint, typecheck, tes logika/transaksi/keamanan, 24 pasangan kontras token, build produksi.
- `npx playwright install chromium`, lalu `npm run test:e2e`: axe, alur baca/kuis/draf/cadangan, keyboard, reduced motion, lebar 320/360/390/768/1280 dan zoom 200%.
- Tes AI nyata opt-in: runtime lokal sudah aktif, `.env.local` terisi, lalu `MURAJAAH_LIVE_AI=1 npx playwright test e2e/live-ai.spec.ts --project=desktop`. Menguji teks sintetis, foto sintetis, dan riset gratis tanpa tagihan API. Bukan bukti bahwa semua keluaran AI akurat.
- `npm audit`: dependency produksi maupun alat pengembangan. Rantai lint rentan sebelumnya sudah diganti dengan plugin TypeScript/hooks/aksesibilitas yang kompatibel.

Batas verifikasi: tes otomatis tidak membuktikan kesempurnaan, seluruh kombinasi browser/perangkat, atau kebenaran agama. Materi tetap perlu peninjauan sumber/guru. Bukti dan hasil pemeriksaan akhir dicatat di VALIDATION.md.

## Versi publik dan penyimpanan perangkat

Versi publik menggunakan komponen dan database lokal yang sama, dikemas sebagai aplikasi statis melalui `npm run build:public`. Keluaran berada di `dist-public/`; `node scripts/preview-public.mjs` menyajikan pratinjau di port 4173. Navigasi memakai hash (`/#/materi/...`) supaya tautan materi buatan pengguna tetap dapat dibuka dan dimuat ulang pada hosting statis.

Manifest pemasangan, ikon, dan service worker menyimpan halaman aplikasi, font, serta PDF sumber. Setelah status **Salinan offline siap**, materi dan kuis bisa dibuka tanpa internet. Tombol **Pertahankan penyimpanan** meminta perlindungan penyimpanan browser bila didukung; menu browser menyediakan pemasangan ke perangkat. IndexedDB tetap menyimpan data pribadi per browser dan per alamat situs. Menghapus penyimpanan browser menghapus materi pribadi dan progres, sehingga cadangan JSON tetap diperlukan.

Versi publik tidak menjalankan server AI dan tidak memanggil API berbayar. Tambah materi manual menghasilkan draf lokal untuk ditinjau, diedit, serta dilengkapi soal sebelum penerbitan. Materi manual diberi asal `manual`; verifikasi tetap memerlukan persetujuan pengguna. Aplikasi Next lokal tetap mendukung Ollama gratis.

Data localhost tidak otomatis berpindah ke alamat publik: gunakan **Pengaturan → Ekspor JSON** di localhost, lalu **Impor cadangan JSON** pada situs publik. Setiap pengunjung mendapat perpustakaan lokal sendiri; perubahan seorang pengguna tidak mengubah materi pengguna lain.

Checkout publik yang terpisah berada di `public-site/`, dengan identitas Sites di `public-site/.openai/hosting.json`. Gunakan kembali `project_id` yang tercatat di sana, jangan mendaftarkan situs pengganti. Build memperbarui checkout tersebut dari daftar folder sumber yang ditentukan; `.env.local`, `.local-ai`, `sources`, AGENTS.md, dan data browser tidak disalin. Publikasi memakai paket statis `public-site/dist/`, tanpa database server atau layanan AI cloud.

Pemeriksaan versi publik: `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/murajaah-browsers npx playwright test --config playwright.public.config.ts`.

## GitHub Pages

Repositori GitHub: https://github.com/ridwanahmadm/murajaah . Publikasi gratis menggunakan repositori publik dan workflow `.github/workflows/pages.yml`: push ke `main` menjalankan pemeriksaan, membangun versi statis, lalu menerbitkannya lewat GitHub Pages.

Build GitHub menggunakan `PUBLIC_BASE_PATH=/murajaah/` agar file aplikasi, font, PDF, manifest pemasangan dan salinan offline berada di jalur repositori yang benar. `PUBLIC_SYNC_SITE=false` mencegah build tersebut mengubah checkout hosting Sites. Untuk deployment di root, jalankan build tanpa `PUBLIC_BASE_PATH`.

Data pribadi browser tetap tidak diunggah ke GitHub. Penyimpanan pada GitHub Pages terpisah dari localhost dan Sites; gunakan cadangan JSON untuk memindahkan materi/progres.

Alamat GitHub Pages yang sudah diterbitkan: https://ridwanahmadm.github.io/murajaah/ . Catatan verifikasi dan kedua alamat publik tersedia di PUBLICATION.md.

## Materi, catatan, dan kuis

Catatan kajian tersimpan pribadi di IndexedDB dan ikut cadangan JSON. Tambah materi dimulai dari pilihan subjek baru atau subjek yang sudah ada, lalu bahan, tinjauan, dan penerbitan. PDF diproses di perangkat: maksimal 20 MB dan 30 halaman per impor; scan memerlukan OCR. Mode manual menjaga seluruh teks hingga 100.000 karakter dan tidak membuat soal palsu.

AI browser memakai WebLLM dan Qwen3.5 0.8B, 2B, atau 4B, tanpa API berbayar. Unduhan model perlu internet sekali, GPU dengan WebGPU dan memori yang cukup. Teks tidak dikirim ke layanan inference cloud. Maksimal 6.000 karakter per proses; hasil harus lolos schema, bukti kutipan sumber, dan pemeriksaan pengguna. Ollama lokal tetap tersedia di versi Next. Soal baru dari materi tersimpan ditinjau dan disimpan atomik sebagai draf. Riset UX dan batas benchmark tercatat di docs/UX-RESEARCH.md.

Perubahan alamat memisahkan penyimpanan browser: ekspor cadangan JSON dari alamat lama lalu impor pada alamat Murajaah untuk memindahkan progres.

## Cadangan perangkat dan folder catatan

Pengaturan hanya menyediakan ekspor/impor JSON dan panduan pemulihan `public/panduan-cadangan.html`. Cadangan Google Drive disembunyikan; komponen tidak dipasang dan SDK Google tidak dimuat. Implementasi yang belum diaktifkan tetap tersedia untuk pengembangan selanjutnya, dengan panduan pengelola di `docs/google-drive-setup-hidden.html`.

Catatan dapat dikelompokkan dalam folder/subjek, dibuat, diganti namanya, atau dipindahkan melalui pilihan folder ketika mengedit catatan. Menghapus folder memindahkan catatannya ke Tanpa folder setelah konfirmasi. Database versi 3 menambahkan indeks folder tanpa menghapus catatan versi sebelumnya. Cadangan JSON mencakup folder dan catatan; cadangan lama tanpa folder tetap dapat diimpor. Validasi referensi folder dan impor dilakukan atomik.
