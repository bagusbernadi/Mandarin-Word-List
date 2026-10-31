# Mandarin Word List

🔗 **Website kamus:** https://bagusbernadi.github.io/Mandarin-Word-List/

Kamus Mandarin pribadi (Indonesia – pinyin – hanzi) untuk bekerja di pabrik PLC Splitter. Website dibuat otomatis dari file Excel dan ditayangkan lewat GitHub Pages.

## Isi website

- **Kamus** (`index.html`): pencarian kamus. Pencarian hanya mencocokkan kolom Indonesia, pinyin, dan hanzi (contoh kalimat, arti per kata, dan keterangan tidak ikut dicari).
- **Latihan** (tab di halaman Kamus): kuis 10 soal yang diacak dari seluruh kosakata Deck Belajar.
- **Deck Belajar** (`deck.html`): rencana belajar 30 hari dalam bentuk slide, dibuka lewat menu di bagian atas halaman. Geser dengan panah keyboard atau tombol panah di layar.

Semua halaman memakai desain yang sama dengan deck (warna Google, font Calibri/Carlito).

## Satu sumber data

Semua isi website berasal dari satu file: `Mandarin word list/Kosakata_Mandarin.xlsx`.

| Sheet | Dipakai untuk |
|---|---|
| `Survival 200` | Deck Belajar (slide) dan soal Latihan |
| `Kamus` | Halaman Kamus (pencarian dan contoh kalimat) |
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
│   ├── deck.html                 ← halaman Deck Belajar (menu + slide)
│   └── deck-slides.html          ← slide deck
└── Mandarin word list/
    ├── Kosakata_Mandarin.xlsx    ← sumber data (edit file ini)
    ├── build.py                  ← program: Excel → website
    ├── template.html             ← kerangka halaman kamus + latihan
    ├── deck_shell.html           ← desain dan mesin slide deck
    └── deck_template.html        ← kerangka halaman Deck Belajar
```

`.github/` harus berada di root repo, karena GitHub hanya membaca workflow dari sana.

## Cara update

1. Edit `Mandarin word list/Kosakata_Mandarin.xlsx`.
2. Upload file itu ke repo (tombol **Add file → Upload files** di GitHub, atau `git push`).
3. Tunggu sekitar 1–2 menit. GitHub Action akan membuat ulang `docs/` dan meng-commit hasilnya otomatis.
4. Buka halaman GitHub Pages Anda, lalu refresh.

Cek status build di tab **Actions** di GitHub.

### Sheet `Survival 200` (deck dan latihan)

Header yang dibaca: `Situasi`, `Indonesia`, `Pinyin`, `Hanzi`, `Arti per kata`, `Keterangan`. Baris dengan Situasi dan Indonesia yang sama digabung jadi satu baris slide. Baris pertama jadi teks utama, baris berikutnya muncul sebagai label **ALT** (cara lain mengatakan hal yang sama). Kolom `Status` hanya untuk Excel.

Deck dibuat otomatis: 13 situasi dikelompokkan ke 4 tahap, lalu dibagi menjadi 30 hari. Hari Angka & waktu dibagi per sub-topik. Hari dengan lebih dari 12 frasa dibagi jadi 2 slide. Situasi baru (nama belum dikenal) otomatis masuk Tahap 4.

### Sheet `Kamus`

Baris pertama berisi header berikut (urutan kolom bebas, nama harus persis):

| Header | Isi |
|---|---|
| `No.` | nomor urut |
| `Kalimat dalam bahasa Indonesia` | kalimat / kata Indonesia (wajib diisi) |
| `arti kalimat atau kata dalam pinyin` | pinyin dengan tanda nada |
| `arti kalimat atau kata dalam hanzi` | hanzi |
| `arti perkata dalam Bahasa Indonesia` | arti per kata |
| `Keterangan` | catatan |
| `label` | kategori penggunaan, misalnya Umum / Kurang umum |
| `Contoh 1 - Indonesia`, `Contoh 1 - Pinyin`, `Contoh 1 - Hanzi` | contoh kalimat 1 (sama untuk Contoh 2 dan 3) |

Baris yang kolom Indonesianya kosong akan dilewati. Contoh kalimat yang kosong juga dilewati.

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
- Untuk mengubah tampilan kamus dan latihan, edit `Mandarin word list/template.html`. Untuk desain slide, edit `deck_shell.html`. Untuk menu atas halaman deck, edit `deck_template.html`. Lalu commit.
- Menu atas ("Kamus" dan "Deck Belajar") ada di `template.html` dan `deck_template.html`. Ubah keduanya jika menu berubah.
