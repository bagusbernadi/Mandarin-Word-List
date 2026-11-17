# Mandarin Word List

Satu website belajar Bahasa Mandarin dengan dua bagian terpisah (dua tab di bagian atas halaman):

| Bagian | Alamat | Isi |
|---|---|---|
| **Kamus Pribadi (PLC)** | https://bagusbernadi.github.io/Mandarin-Word-List/ | Kamus Indonesia–pinyin–hanzi pribadi untuk bekerja di pabrik PLC Splitter, kuis Latihan, dan 30H Belajar. Dibuat otomatis dari Excel. |
| **Belajar HSK 1–3** | https://bagusbernadi.github.io/Mandarin-Word-List/hsk/ | Materi belajar dan latihan ujian HSK 1–3 (standar HSK 3.0, 2026): 13 modul, kamus 1.000 kata, bank soal, dan simulasi ujian dengan timer. |

Kedua bagian ditayangkan lewat GitHub Pages dari folder `docs/`. Tab "Belajar HSK 1–3" dan "Kamus Pribadi (PLC)" di atas halaman memindahkan Anda antar bagian.

---

# Bagian 1: Kamus Pribadi (PLC)

Kamus Mandarin pribadi (Indonesia – pinyin – hanzi) untuk bekerja di pabrik PLC Splitter. Halamannya dibuat otomatis dari satu file Excel.

## Isi

- **Kamus** (`docs/index.html`): pencarian kamus untuk semua baris sheet `Kosakata` (500 entri: arti per kata, label, 3 contoh kalimat, kategori). Tombol kategori (13 Situasi) menyaring daftar dan bisa digabung dengan pencarian. Variasi ALT tampil di entri utamanya sebagai baris "Alternatif" dan tetap bisa dicari. Pencarian hanya mencocokkan kolom Indonesia, pinyin, dan hanzi.
- **Latihan** (tab di halaman Kamus): kuis 10 soal yang diacak dari seluruh kosakata. Ada 3 jenis:
  - **A:** pertanyaan Indonesia, jawaban Pinyin + Hanzi.
  - **B:** pertanyaan Hanzi per kata + Pinyin, jawaban Indonesia (hanya kosakata yang kolom `Arti per kata`-nya terisi).
  - **C:** pertanyaan Hanzi + Pinyin, jawaban Indonesia.
  - Pilihan jawaban dibuat mirip dengan soal (angka dan bulan memakai angka/bulan terdekat), dan kandidat yang hampir sama artinya dibuang agar tidak ada dua jawaban benar.
- **30H Belajar** (`docs/deck.html`): latihan per hari, Indonesia → Pinyin & Hanzi. Pilih Hari 1–30, lalu semua kosakata hari itu diuji satu kali. Di akhir sesi ada tombol "Ulangi hari ini" dan "Hari berikutnya".
- **Panduan pinyin** (tombol ⓘ): contoh pengucapan pinyin dengan suara.
- **Suara**: tombol speaker (🔊) memakai suara bawaan browser (Web Speech API). File MP3 di `docs/audio/` (MeloTTS, dibuat dengan `build_audio.py`) saat ini **tidak dipakai** (`USE_MP3=false` di `template.html`) karena sebagian file rusak. Aktifkan lagi setelah audionya dibuat ulang.

Desain bagian ini memakai warna Google dan font Calibri/Carlito.

## Satu sumber data

Semua isi Kamus Pribadi berasal dari satu file: `Mandarin word list/Kosakata_Mandarin.xlsx`.

| Sheet | Dipakai untuk |
|---|---|
| `Kosakata` | Kamus (pencarian, kategori, contoh kalimat), 30H Belajar (pembagian 30 hari), dan soal Latihan |
| `Progress` | Rekap hafalan di Excel (kolom Status). Tidak dipakai website |

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

Hasilnya muncul di `docs/index.html` (kamus + latihan) dan `docs/deck.html` (30H Belajar). Buka file itu di browser untuk melihat hasilnya.

## Cara update Kamus Pribadi

1. Edit `Mandarin word list/Kosakata_Mandarin.xlsx`.
2. Upload file itu ke repo (**Add file → Upload files** di GitHub, atau `git push`).
3. Tunggu sekitar 1–2 menit. GitHub Action membuat ulang `docs/` dan meng-commit hasilnya otomatis. Status build ada di tab **Actions**.
4. Buka halaman GitHub Pages, lalu refresh.

---

# Bagian 2: Belajar HSK 1–3

Website belajar dan latihan ujian HSK 1–3 mengikuti standar **HSK 3.0 (2026)**: level 1, 2, dan 3 berisi 300, 500, dan 1.000 kata (kumulatif). Alamat: `/hsk/`.

## Isi

| Modul | Topik |
|---|---|
| 01 | Mengenal HSK 3.0: format ujian, rencana belajar |
| 02 | Pinyin dan nada |
| 03 | Hanzi: goresan dan radikal |
| 04, 06, 08 | Kosakata HSK 1, 2, 3 (kartu hafalan, tema, kuis) |
| 05, 07, 09 | Tata bahasa HSK 1, 2, 3 |
| 10 | Strategi mendengar dan membaca, latihan menangkap angka |
| 11 | Menulis dan berbicara |
| 12 | **Latihan soal**: bank soal per keterampilan dan drill kosakata |
| 13 | **Simulasi ujian** dengan timer, skor per bagian, dan pembahasan |

Selain modul ada **Kamus HSK** (`kamus.html`, 1.000 kata) dan **Glosarium** (`glosarium.html`).

- Audio mendengar memakai suara bawaan perangkat (text-to-speech), dengan 2 kali putar per soal pada mode simulasi.
- Progres hafalan dan skor terbaik tersimpan di browser (localStorage), tidak di server.
- Bank soal (sekitar 140 soal) dibuat sendiri, **bukan soal resmi**. Pada HSK 2 dan 3, simulasi lebih ringkas daripada ujian resmi (50 soal), dan skornya hanya perkiraan. Cek format dan jadwal resmi di chinesetest.cn.
- Daftar kosakata mengikuti urutan daftar resmi HSK 3.0 level 1–3; arti dalam bahasa Indonesia ditambahkan sendiri.

## Struktur dan cara mengubah

Bagian ini berupa halaman statis biasa (tanpa build otomatis), jadi file di `docs/hsk/` **boleh diedit langsung**.

```
docs/hsk/
├── index.html                 ← beranda HSK
├── 01 … 13-*.html             ← modul
├── kamus.html, glosarium.html
└── assets/
    ├── style.css, app.js      ← tampilan dan mesin halaman
    ├── exam.js, bank.js       ← mesin soal + bank soal + format ujian
    ├── glossary.js            ← istilah yang bisa diklik
    └── vocab1.js … vocab3.js  ← kosakata (hanzi|pinyin|arti|kelas kata)
```

- Tambah soal: edit `assets/bank.js`.
- Ubah kosakata: edit `assets/vocab1.js`, `vocab2.js`, atau `vocab3.js`. Halaman kosakata 04, 06, 08 dibuat dari `HSK tools/gen_vocab.py` (`python "HSK tools/gen_vocab.py"`), jalankan ulang bila tema atau teksnya diubah. Halaman lain diedit langsung.

---

# Struktur repo

```
.
├── README.md
├── .github/workflows/build.yml   ← GitHub Action: build Kamus Pribadi saat folder "Mandarin word list" berubah
├── docs/                         ← yang ditayangkan GitHub Pages
│   ├── index.html                ← Kamus Pribadi: kamus + latihan (hasil build)
│   ├── deck.html                 ← Kamus Pribadi: 30H Belajar (hasil build)
│   ├── data.json, deck.json      ← data (hasil build)
│   ├── deck-slides.html          ← slide deck lama (hasil build, tidak ditautkan)
│   ├── audio/                    ← file MP3 (saat ini tidak dipakai)
│   └── hsk/                      ← Belajar HSK 1–3 (diedit langsung)
├── Mandarin word list/           ← sumber Kamus Pribadi
│   ├── Kosakata_Mandarin.xlsx    ← sumber data (edit file ini)
│   ├── build.py                  ← program: Excel → website
│   ├── build_audio.py            ← pembuat audio MP3 (opsional)
│   ├── pinyin_guide.py           ← isi panduan pinyin
│   ├── template.html             ← kerangka kamus + latihan
│   ├── deck_template.html        ← kerangka 30H Belajar
│   └── deck_shell.html           ← desain dan mesin slide (deck-slides.html)
└── HSK tools/
    └── gen_vocab.py              ← pembuat halaman kosakata HSK (04, 06, 08)
```

`.github/` harus berada di root repo, karena GitHub hanya membaca workflow dari sana.

## Mengaktifkan GitHub Pages (sekali saja)

1. Repo → **Settings → Pages**.
2. Di **Build and deployment**, pilih **Source: Deploy from a branch**.
3. Branch: `main`, folder: `/docs`. Klik **Save**.
4. Halaman tersedia di `https://<username>.github.io/<nama-repo>/`.

Di Settings → Actions → General, pastikan **Workflow permissions** diset ke **Read and write permissions** supaya Action bisa meng-commit hasil build.

## Catatan

- Repo harus **public** agar GitHub Pages gratis. Isi kamus terlihat siapa saja yang punya link.
- Riwayat perubahan Excel tersimpan di git, jadi versi lama bisa dikembalikan.
- **Jangan mengedit file hasil build secara manual** (`docs/index.html`, `docs/deck.html`, `docs/*.json`, `docs/deck-slides.html`); file itu ditimpa setiap build. `docs/hsk/` tidak disentuh build, jadi aman diedit.
- Mengubah tampilan Kamus dan Latihan: edit `Mandarin word list/template.html`. Halaman 30H Belajar: `deck_template.html` (CSS-nya mengikuti `template.html`). Desain slide: `deck_shell.html`. Lalu commit.
- Menu ("Kamus", "Latihan", "30H Belajar") dan tab pengalih bagian ("Belajar HSK 1–3", "Kamus Pribadi (PLC)") ada di `template.html` dan `deck_template.html`. Ubah keduanya jika menu berubah. Tab pengalih sisi HSK ada di `docs/hsk/assets/app.js`.
