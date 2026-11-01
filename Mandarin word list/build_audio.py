"""
Buat file audio MP3 (suara Mandarin) untuk setiap kosakata dan contoh kalimat di Excel.
Hanya membuat audio yang belum ada, jadi aman dijalankan ulang setelah Excel diubah.
Hasil: docs/audio/<kode>.mp3, lalu jalankan build.py agar website memakainya.

Persiapan (sekali):
  pip install sherpa-onnx numpy openpyxl     # dan ffmpeg terpasang
  unduh model: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-melo-tts-zh_en.tar.bz2
  lalu ekstrak, dan beri tahu lokasinya:  set MELO_DIR=C:\path\vits-melo-tts-zh_en
Jalankan:  python "Mandarin word list/build_audio.py"
"""
import hashlib
import os
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np
import openpyxl
import sherpa_onnx

import build

M = Path(os.environ.get("MELO_DIR", "/tmp/tts/vits-melo-tts-zh_en"))
if not (M / "model.onnx").exists():
    sys.exit(f"Model tidak ditemukan di {M}. Atur variabel MELO_DIR (lihat petunjuk di atas).")


def main():
    wb = openpyxl.load_workbook(build.XLSX, data_only=True)
    groups = build.load_groups(wb["Kosakata"])
    texts = []
    for g in groups:
        texts.append(g["rows"][0][0])
        texts += [e[2] for e in g["ex"] if e[2]]
    seen, todo = set(), []
    for hz in texts:
        t = build.tts_text(hz)
        h = hashlib.sha1(t.encode("utf-8")).hexdigest()[:12]
        if h in seen:
            continue
        seen.add(h)
        if not (build.AUDIO_DIR / (h + ".mp3")).exists():
            todo.append((h, t))
    print(f"{len(seen)} teks unik, {len(todo)} perlu dibuat")
    if not todo:
        return
    build.AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=str(M / "model.onnx"), lexicon=str(M / "lexicon.txt"),
                tokens=str(M / "tokens.txt"), dict_dir=str(M / "dict")), num_threads=4),
        rule_fsts=",".join(str(M / f) for f in ("date.fst", "number.fst", "phone.fst", "new_heteronym.fst")),
        max_num_sentences=1)
    tts = sherpa_onnx.OfflineTts(cfg)
    for i, (h, t) in enumerate(todo, 1):
        a = tts.generate(t, sid=0, speed=0.9)
        s = np.array(a.samples)
        s = (s / max(1e-6, abs(s).max()) * 0.9 * 32767).astype(np.int16)
        wav = build.AUDIO_DIR / (h + ".wav")
        with wave.open(str(wav), "wb") as f:
            f.setnchannels(1); f.setsampwidth(2); f.setframerate(a.sample_rate); f.writeframes(s.tobytes())
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-b:a", "32k",
                        str(build.AUDIO_DIR / (h + ".mp3"))], check=True)
        wav.unlink()
        if i % 100 == 0:
            print(f"  {i}/{len(todo)}", flush=True)
    print("Selesai.")


if __name__ == "__main__":
    main()
