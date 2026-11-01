"""Konten tab "i" (panduan pengucapan pinyin). Tiap item: (pinyin, hanzi contoh, petunjuk).
Dipakai build.py (ke website) dan build_audio.py (membuat suara contoh)."""

GUIDE = [
    {"t": "Nada",
     "d": "Mandarin punya 4 nada + nada netral. Nada mengubah arti kata.",
     "items": [
         ("mā", "妈", "Nada 1: tinggi dan datar"),
         ("má", "麻", "Nada 2: naik, seperti bertanya “hah?”"),
         ("mǎ", "马", "Nada 3: turun lalu naik (rendah)"),
         ("mà", "骂", "Nada 4: turun tajam, seperti memerintah"),
         ("ma", "吗", "Netral: pendek dan ringan, tanpa tanda"),
     ]},
    {"t": "Konsonan awal: tanpa vs dengan hembusan",
     "d": "Pasangan ini mirip di telinga Indonesia. Bedanya hembusan napas: letakkan tangan di depan mulut, p/t/k/q/ch/c harus terasa hembusan.",
     "items": [
         ("bà", "爸", "b: seperti p pada “apa” (tanpa hembusan)"),
         ("pà", "怕", "p: p dengan hembusan kuat"),
         ("dà", "大", "d: seperti t pada “atas” (tanpa hembusan)"),
         ("tā", "他", "t: t dengan hembusan kuat"),
         ("gè", "个", "g: seperti k pada “baku” (tanpa hembusan)"),
         ("kàn", "看", "k: k dengan hembusan kuat"),
         ("zài", "在", "z: seperti “dz/ts”, tanpa hembusan"),
         ("cài", "菜", "c: seperti “ts”, dengan hembusan kuat"),
     ]},
    {"t": "j, q, x",
     "d": "Lidah datar, ujung lidah di belakang gigi bawah, bibir agak melebar.",
     "items": [
         ("jiā", "家", "j: mirip “ci” pada “cinta”, tanpa hembusan"),
         ("qī", "七", "q: seperti j, tetapi dengan hembusan kuat"),
         ("xī", "西", "x: antara “s” dan “sy”, lembut"),
     ]},
    {"t": "zh, ch, sh, r",
     "d": "Ujung lidah dilengkungkan ke atas (retrofleks). Tidak sama dengan z, c, s.",
     "items": [
         ("zhù", "住", "zh: seperti “j” dengan lidah melengkung, tanpa hembusan"),
         ("chī", "吃", "ch: seperti zh, dengan hembusan kuat"),
         ("shì", "是", "sh: seperti “sy”, lidah melengkung"),
         ("rì", "日", "r: seperti sh, tetapi bersuara (mirip “r” + “j” Prancis)"),
         ("sì", "四", "s: “s” biasa, bandingkan dengan sh"),
     ]},
    {"t": "Vokal yang perlu diperhatikan",
     "d": "",
     "items": [
         ("nǚ", "女", "ü: ucapkan “i”, lalu bulatkan bibir seperti “u”"),
         ("lǜ", "绿", "ü yang sama; ditulis u setelah j, q, x, y (qù, 去)"),
         ("hē", "喝", "e: seperti “e” pada “kerja” ditarik ke belakang (“ɤ”)"),
         ("shì", "是", "i setelah zh/ch/sh/r/z/c/s: bunyi dengung, bukan “i”"),
         ("liù", "六", "iu dibaca “iou”; ui dibaca “uei” (shuǐ, 水)"),
         ("zhōng", "中", "ong: “ung” yang pendek dan bulat"),
         ("xiè", "谢", "ie: “ye”; üe: “yue”"),
     ]},
    {"t": "Akhiran -n dan -ng",
     "d": "-n: ujung lidah menempel di atas gigi. -ng: lidah tidak menyentuh, seperti “ng” pada “batang”.",
     "items": [
         ("shān", "山", "an: -n"),
         ("shàng", "上", "ang: -ng"),
         ("xīn", "新", "in: -n"),
         ("xīng", "星", "ing: -ng"),
     ]},
    {"t": "Perubahan nada",
     "d": "Aturan ini dipakai saat bicara; tulisan pinyin di kamus tetap nada aslinya.",
     "items": [
         ("nǐ hǎo", "你好", "3 + 3 → 2 + 3: dibaca “ní hǎo”"),
         ("bú shì", "不是", "不 (bù) jadi bú sebelum nada 4"),
         ("yí gè", "一个", "一 (yī) jadi yí sebelum nada 4"),
         ("yì tiān", "一天", "一 jadi yì sebelum nada 1, 2, 3"),
     ]},
]


def all_hanzi():
    return [it[1] for s in GUIDE for it in s["items"]]
