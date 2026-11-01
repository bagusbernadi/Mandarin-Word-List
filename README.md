# Mandarin Word List

🔗 **Website kamus:** https://bagusbernadi.github.io/Mandarin-Word-List/

Kamus Mandarin pribadi (Indonesia – pinyin – hanzi) untuk bekerja di pabrik PLC Splitter. Website dibuat otomatis dari file Excel dan ditayangkan lewat GitHub Pages.

## Isi website

- **Kamus** (`index.html`): pencarian kamus. Isinya semua baris sheet `Kosakata` (467 entri: arti per kata, label, 3 contoh kalimat, kategori). Tombol kategori (13 Situasi, warna mengikuti tahap seperti tombol hari di 30H Belajar) menyaring daftar dan bisa digabung dengan pencarian. Variasi ALT tampil di entri utamanya sebagai baris "Alternatif" dan tetap bisa dicari. Pencarian hanya mencocokkan kolom Indonesia, pinyin, dan hanzi (contoh kalimat, arti per kata, dan keterangan tidak ikut dicari).
- **Suara**: tombol speaker (🔊) di Kamus (kosakata dan tiap contoh kalimat), Latihan, dan 30H Belajar memutar file audio MP3 di `docs/audio/` (suara Mandarin dari MeloTTS, dibuat offline). Jika sebuah teks belum punya file audio, tombol memakai suara bawaan browser (Web Speech API) sebagai cadangan, yang tidak selalu jalan di Chrome Android. Setelah menambah atau mengubah kosakata/contoh di Excel, buat audio barunya dengan `python "Mandarin word list/build_audio.py"` (hanya membuat yang belum ada; butuh `pip install sherpa-onnx numpy`, ffmpeg, dan model MeloTTS, lihat komentar di awal file), lalu jalankan `build.py` dan push folder `docs/audio`.
- **Latihan** (tab di halaman Kamus): kuis 10 soal yang diacak dari seluruh kosakata 30H Belajar. Ada 3 jenis latihan:
  - **A:** pertanyaan Indonesia, jawaban Pinyin + Hanzi.
  - **B:** pertanyaan Hanzi per kata + Pinyin, jawaban Indonesia (hanya kosakata yang kolom `Arti per kata`-nya terisi).
  - **C:** pertanyaan Hanzi + Pinyin, jawaban Indonesia.
  - Pilihan jawaban dipilih yang mirip dengan soal: angka dan bulan memakai angka/bulan terdekat (misalnya 100 → 200, 300, 400), sisanya memakai situasi yang sama, hanzi, dan kata yang mirip. Kandidat yang hampir sama artinya dengan soal dibuang agar tidak ada dua jawaban benar.
- **30H Belajar** (`deck.html`, tombol di sebelah "Latihan"): latihan per hari, Indonesia → Pinyin & Hanzi. Pilih Hari 1–30, lalu semua kosakata hari itu diuji satu kali (soal dan pilihan jawaban hanya dari hari itu). Warna tombol hari mengikuti tahap. Di akhir sesi ada tombol "Ulangi hari ini" dan "Hari berikutnya".

Semua halaman memakai desain yang sama dengan deck (warna Google, font Calibri/Carlito).

## Satu sumber data

Semua isi website berasal dari satu file: `Mandarin word list/Kosakata_Mandarin.xlsx`.

| Sheet | Dipakai untuk |
|---|---|
| `Kosakata` | Kamus (pencarian, kategori, contoh kalimat), 30H Belajar (pembagian 30 hari), dan soal Latihan |
| `Progress` | Rekap hafalan di Excel (kolom Status). Tidak dipakai website |

## Struktur

```
.
├── README.md
├── .github/workflows/build.yml   ← GitHub Action: build otomatis saat isi folder "Mandarin word list" berubah
├── docs/                         ← hasil build (jangan diedit manual)
│   ├── index.html                ← kamus + latihan
│   ├── data.json                 ← data kamus
│   ├── deck.json                 ← data soal latihan
│   ├── deck.html                 ← halaman 30H Belajar (latihan per hari)
│   └── deck-slides.html          ← slide deck lama (tidak ditautkan, masih bisa dibuka langsung)
└── Mandarin word list/
    ├── Kosakata_Mandarin.xlsx    ← sumber data (edit file ini)
    ├── build.py                  ← program: Excel → website
    ├── template.html             ← kerangka halaman kamus + latihan
    ├── deck_shell.html           ← desain dan mesin slide (deck-slides.html)
    └── deck_template.html        ← kerangka halaman 30H Belajar (latihan per hari)
```

`.github/` harus berada di root repo, karena GitHub hanya membaca workflow dari sana.

## Cara update

1. Edit `Mandarin word list/Kosakata_Mandarin.xlsx`.
2. Upload file itu ke repo (tombol **Add file → Upload files** di GitHub, atau `git push`).
3. Tunggu sekitar 1–2 menit. GitHub Action akan membuat ulang `docs/` dan meng-commit hasilnya otomatis.
4. Buka halaman GitHub Pages Anda, lalu refresh.

Cek status build di tab **Actions** di GitHub.

### Sheet `Kosakata` (satu-satunya sheet data)

Satu baris = satu kosakata. Dipakai untuk Kamus, 30H Belajar, dan Latihan. Header (nama harus persis, urutan bebas):

| Header | Isi |
|---|---|
| `No` | nomor urut (hanya untuk Excel) |
| `Situasi` | salah satu dari 13 kategori (mis. `Makan & minum`); jadi kategori/tombol filter di Kamus dan penentu hari di 30H Belajar |
| `Indonesia`, `Pinyin`, `Hanzi` | kosakata utama (wajib) |
| `Arti per kata` | format `我 (wǒ): saya, 要 (yào): mau` |
| `Keterangan` | catatan yang tampil di kartu |
| `Status` | Belum / Sedang / Hafal (hanya untuk Excel; direkap sheet `Progress`) |
| `Sinonim` | (opsional) kode yang sama (mis. `S07`) = artinya sama, tidak muncul bersama sebagai pilihan di Latihan. Beberapa kode dipisah `;` |
| `Label` | tingkat penggunaan (Umum / Kurang umum, dll.); tampil kecil di kartu bila bukan label standar |
| `ALT 1 Hanzi`, `ALT 1 Pinyin` | (opsional) cara lain mengatakan hal yang sama; tampil sebagai "Alternatif" dan tetap bisa dicari. Perlu lebih banyak? Tambah kolom `ALT 2 Hanzi` dan `ALT 2 Pinyin`, dst. |
| `Contoh 1 - Indonesia`, `Contoh 1 - Pinyin`, `Contoh 1 - Hanzi` | contoh kalimat 1 (sama untuk Contoh 2 dan 3) |
| `Catatan edit` | catatan pribadi, tidak dibaca website |

Baris yang kolom Indonesia atau Hanzi-nya kosong dilewati. Format lama (beberapa baris dengan Situasi + Indonesia sama = ALT) juga masih dibaca.

Pembagian hari dibuat otomatis: 13 situasi dikelompokkan ke 4 tahap, lalu dibagi menjadi 30 hari. Hari Angka & waktu dibagi per sub-topik. Hari dengan lebih dari 12 frasa dibagi jadi 2 slide (di deck-slides.html). Situasi baru (nama belum dikenal) ditolak saat build agar tidak salah ketik; tambahkan dulu di `build.py` (`SIT`).

## Menjalankan build di komputer sendiri

```bash
pip install openpyxl
python "Mandarin word list/build.py"
```

Hasilnya muncul di `docs/index.html` (kamus + latihan) dan `docs/deck.html` (deck). Buka file itu di browser untuk melihat hasilnya.

## Mengaktifkan GitHub Pages (sekali saja)

1. Repo → **Settings → Pages**.
2. Di bagian **Build and deployment**, pilih **Source: Deploy from a branch**.
3. Branch: `main`, folder: `/docs`. Klik **Save**.
4. Halaman akan tersedia di `https://<username>.github.io/<nama-repo>/`.

Di Settings → Actions → General, pastikan **Workflow permissions** diset ke **Read and write permissions** supaya Action bisa meng-commit hasil build.

## Catatan

- Repo harus **public** agar GitHub Pages gratis. Isi kamus akan terlihat siapa saja yang punya link.
- Riwayat perubahan Excel tersimpan di git, jadi versi lama bisa dikembalikan.
- Jangan mengedit `docs/` secara manual. File itu akan ditimpa setiap build.
- Untuk mengubah tampilan kamus dan latihan, edit `Mandarin word list/template.html`. Untuk desain slide, edit `deck_shell.html`. Untuk halaman 30H Belajar, edit `deck_template.html` (CSS-nya mengikuti `template.html`). Lalu commit.
- Tombol menu ("Kamus", "Latihan", "30H Belajar") ada di `template.html` dan `deck_template.html`. Ubah keduanya jika menu berubah.
