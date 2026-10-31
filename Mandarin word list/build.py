"""
Build the Mandarin kamus website from the Excel word list.

Input : Mandarin word list/Catatan_Bahasa_Mandarin.xlsx
Output: docs/index.html (website), docs/data.json (raw data),
        docs/deck.html + docs/deck-slides.html (halaman Deck Belajar)

Columns are found by header name, not position, so you can add or
reorder columns in Excel without touching this script.
"""
import json
import re
import sys
from pathlib import Path

import openpyxl

BASE = Path(__file__).resolve().parent
XLSX = BASE / "Catatan_Bahasa_Mandarin.xlsx"
TEMPLATE = BASE / "template.html"
DECK_SRC = BASE / "Rencana_Belajar_Harian_Mandarin_Gabungan.html"
DECK_TEMPLATE = BASE / "deck_template.html"
OUT_DIR = BASE.parent / "docs"

# Header names expected in row 1 of the Excel sheet
COL = {
    "no": "No.",
    "id": "Kalimat dalam bahasa Indonesia",
    "py": "arti kalimat atau kata dalam pinyin",
    "hz": "arti kalimat atau kata dalam hanzi",
    "words": "arti perkata dalam Bahasa Indonesia",
    "note": "Keterangan",
    "label": "label",
}
EX_TEMPLATE = ("Contoh {k} - Indonesia", "Contoh {k} - Pinyin", "Contoh {k} - Hanzi")


def clean(v):
    return "" if v is None else str(v).strip()


def main():
    if not XLSX.exists():
        sys.exit(f"File tidak ditemukan: {XLSX}")

    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb[wb.sheetnames[0]]

    headers = {clean(c.value): i for i, c in enumerate(ws[1])}

    missing = [v for v in COL.values() if v not in headers]
    if missing:
        sys.exit("Header kolom berikut tidak ditemukan di Excel:\n  - " + "\n  - ".join(missing))

    ex_cols = []
    for k in (1, 2, 3):
        names = [t.format(k=k) for t in EX_TEMPLATE]
        ex_cols.append([headers.get(n) for n in names])

    entries = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        def get(key):
            return clean(row[headers[COL[key]]])

        ident = get("id")
        if not ident:
            continue  # skip empty rows

        examples = []
        for idx_id, idx_py, idx_hz in ex_cols:
            if idx_id is None:
                continue
            e = [clean(row[idx_id]), clean(row[idx_py]), clean(row[idx_hz])]
            if any(e):
                examples.append(e)

        entries.append({
            "label": get("label"),
            "id": ident,
            "py": get("py"),
            "hz": get("hz"),
            "words": get("words"),
            "note": get("note"),
            "warn": False,
            "ex": examples,
        })

    if not entries:
        sys.exit("Tidak ada data yang dibaca. Periksa sheet pertama di Excel.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "data.json").write_text(
        json.dumps(entries, ensure_ascii=False, indent=1), encoding="utf-8")

    html = TEMPLATE.read_text(encoding="utf-8")
    if html.count("var DATA=[];") != 1:
        sys.exit("template.html harus memuat tepat satu baris 'var DATA=[];'")
    html = html.replace(
        "var DATA=[];",
        "var DATA=" + json.dumps(entries, ensure_ascii=False) + ";")
    (OUT_DIR / "index.html").write_text(html, encoding="utf-8")

    if DECK_SRC.exists():
        (OUT_DIR / "deck-slides.html").write_text(DECK_SRC.read_text(encoding="utf-8"), encoding="utf-8")
        (OUT_DIR / "deck.html").write_text(DECK_TEMPLATE.read_text(encoding="utf-8"), encoding="utf-8")
        print("OK: deck disalin ke docs/deck.html")
    else:
        print(f"PERINGATAN: deck tidak ditemukan: {DECK_SRC}")

    with_ex = sum(1 for e in entries if e["ex"])
    print(f"OK: {len(entries)} entri, {with_ex} dengan contoh kalimat -> {OUT_DIR}")


if __name__ == "__main__":
    main()
