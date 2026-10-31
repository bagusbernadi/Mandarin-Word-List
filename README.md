# Mandarin Word List

🔗 **Website kamus:** https://bagusbernadi.github.io/Mandarin-Word-List/

Kamus Mandarin pribadi (Indonesia – pinyin – hanzi) untuk bekerja di pabrik PLC Splitter. Website dibuat otomatis dari file Excel dan ditayangkan lewat GitHub Pages.

## Isi website

- **Kamus** (`index.html`): pencarian dan latihan kuis. Pencarian hanya mencocokkan kolom Indonesia, pinyin, dan hanzi (contoh kalimat, arti per kata, dan keterangan tidak ikut dicari).
- **Deck Belajar** (`deck.html`): rencana belajar 30 hari dalam bentuk slide, dibuka lewat menu di bagian atas halaman. Geser dengan panah keyboard atau tombol panah di layar.

Kedua halaman memakai desain yang sama dengan deck (warna Google, font Calibri/Carlito).

## Struktur

```
.
├── README.md                     ← dokumen ini
├── .github/workflows/build.yml   ← GitHub Action: build otomatis saat isi folder "Mandarin word list" berubah
├── docs/                         ← hasil build (jangan diedit manual)
│   ├── index.html                ← website kamus
│   ├── data.json                 ← data mentah dari Excel
│   ├── deck.html                 ← halaman Deck Belajar (menu + slide)
│   └── deck-slides.html          ← salinan deck
└── Mandarin word list/
    ├── Catatan_Bahasa_Mandarin.xlsx                  ← sumber data kamus (edit file ini)
    ├── Rencana_Belajar_Harian_Mandarin_Gabungan.html ← sumber deck 30 hari (kosakata gabungan Excel + slide)
    ├── build.py                                      ← program: Excel + deck → website
    ├── template.html                                 ← kerangka halaman kamus
    └── deck_template.html                            ← kerangka halaman Deck Belajar
```

`.github/` harus berada di root repo, karena GitHub hanya membaca workflow dari sana.

## Cara update kamus

1. Edit `Mandarin word list/Catatan_Bahasa_Mandarin.xlsx`.
2. Upload file itu ke repo (lewat tombol **Add file → Upload files** di GitHub, atau `git push`).
3. Tunggu sekitar 1–2 menit. GitHub Action akan membuat ulang `docs/` dan meng-commit hasilnya otomatis.
4. Buka halaman GitHub Pages Anda, lalu refresh.

Cek status build di tab **Actions** di GitHub.

## Cara update deck

1. Ganti file `Mandarin word list/Rencana_Belajar_Harian_Mandarin_Gabungan.html` dengan versi terbaru (nama file harus sama).
2. Commit dan push. Action akan menyalinnya ke `docs/deck-slides.html`, dan halaman **Deck Belajar** ikut diperbarui.

## Format Excel

Baris pertama harus berisi header berikut (urutan kolom bebas, tetapi nama harus persis sama):

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

Hasilnya muncul di `docs/index.html` (kamus) dan `docs/deck.html` (deck). Buka file itu di browser untuk melihat hasilnya.

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
- Untuk mengubah tampilan kamus, edit `Mandarin word list/template.html`. Untuk halaman deck, edit `deck_template.html` (menu atas) atau file deck-nya. Lalu commit.
- Menu atas ("Kamus" dan "Deck Belajar") ada di `template.html` dan `deck_template.html`. Ubah keduanya jika menu berubah.
