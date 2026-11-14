/* Kerangka bersama: header, navigasi modul, popover istilah, kuis, kosakata, audio */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const MODULES = [
  { id: '01', file: '01-hsk-3.html', group: 'Fondasi', title: 'Mengenal HSK 3.0', desc: 'Struktur level 1–3, format ujian, penilaian, dan rencana belajar yang realistis.' },
  { id: '02', file: '02-pinyin-nada.html', group: 'Fondasi', title: 'Pinyin & Nada', desc: 'Bunyi awal dan akhir, empat nada, nada netral, dan perubahan nada yang sering keluar di ujian.' },
  { id: '03', file: '03-hanzi.html', group: 'Fondasi', title: 'Hanzi: Goresan & Radikal', desc: 'Cara menulis karakter, urutan goresan, radikal, dan cara mengingat bentuk.' },
  { id: '04', file: '04-hsk1-kosakata.html', group: 'HSK 1', title: 'HSK 1 · Kosakata (300)', desc: 'Kartu hafalan, daftar kata per tema, dan latihan cepat untuk 300 kata pertama.' },
  { id: '05', file: '05-hsk1-tatabahasa.html', group: 'HSK 1', title: 'HSK 1 · Tata Bahasa', desc: 'Urutan kalimat, 是/有/在, pertanyaan 吗/呢/什么, angka, waktu, dan kata bantu bilangan.' },
  { id: '06', file: '06-hsk2-kosakata.html', group: 'HSK 2', title: 'HSK 2 · Kosakata (+200)', desc: '200 kata baru: transportasi, tempat, arah, kegiatan harian, dan kata sambung dasar.' },
  { id: '07', file: '07-hsk2-tatabahasa.html', group: 'HSK 2', title: 'HSK 2 · Tata Bahasa', desc: 'Perbandingan 比, 过, 着, 了, pelengkap 得, 因为…所以…, dan arah (来/去).' },
  { id: '08', file: '08-hsk3-kosakata.html', group: 'HSK 3', title: 'HSK 3 · Kosakata (+500)', desc: '500 kata baru: sekolah, kota, kesehatan, rencana, perasaan, dan kata penghubung.' },
  { id: '09', file: '09-hsk3-tatabahasa.html', group: 'HSK 3', title: 'HSK 3 · Tata Bahasa', desc: 'Kalimat 把 dan 被, 不但…而且…, 如果…就…, 越来越, 除了, dan pelengkap hasil.' },
  { id: '10', file: '10-mendengar-membaca.html', group: 'Keterampilan', title: 'Mendengar & Membaca', desc: 'Pola soal tiap bagian, jebakan umum, dan cara mengatur waktu.' },
  { id: '11', file: '11-menulis-berbicara.html', group: 'Keterampilan', title: 'Menulis & Berbicara', desc: 'Menyusun kalimat, menulis karakter, dan latihan berbicara untuk HSK 3.' },
  { id: '12', file: '12-latihan.html', group: 'Ujian', title: 'Latihan Soal', desc: 'Latihan per level dan per keterampilan, langsung dengan pembahasan.' },
  { id: '13', file: '13-simulasi.html', group: 'Ujian', title: 'Simulasi Ujian', desc: 'Ujian percobaan HSK 1, 2, dan 3 dengan batas waktu dan skor.' },
];

/* ---------- penyimpanan ringan (boleh gagal) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('hsk_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('hsk_' + k, JSON.stringify(v)); } catch (e) { } },
};

/* ---------- audio (Web Speech, bahasa Mandarin) ---------- */
function speak(text, rate = 0.85) {
  try {
    const s = window.speechSynthesis; if (!s) return false;
    s.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-CN'; u.rate = rate;
    const v = s.getVoices().find(x => /^zh/i.test(x.lang)); if (v) u.voice = v;
    s.speak(u); return true;
  } catch (e) { return false; }
}
const spkBtn = t => `<button class="spk" data-say="${t.replace(/"/g, '&quot;')}" aria-label="Putar suara" title="Putar suara">🔊</button>`;

/* ---------- pewarnaan nada pada pinyin ---------- */
const TONES = { ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, ǖ: 1, á: 2, é: 2, í: 2, ó: 2, ú: 2, ǘ: 2, ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, ǚ: 3, à: 4, è: 4, ì: 4, ò: 4, ù: 4, ǜ: 4 };
const cpy = py => py.replace(/[āēīōūǖáéíóúǘǎěǐǒǔǚàèìòùǜ]/g, c => `<span class="t${TONES[c]}">${c}</span>`);

/* ---------- kosakata ---------- */
const POS = { n: 'nomina', v: 'verba', adj: 'adjektiva', adv: 'adverbia', pron: 'pronomina', num: 'numeralia', mw: 'kata bantu', prep: 'preposisi', conj: 'konjungsi', part: 'partikel', exp: 'ungkapan', ph: 'frasa', pre: 'awalan', suf: 'akhiran', int: 'interjeksi' };
function parseVocab(raw, lv, start) {
  return raw.split('\n').map((r, i) => { const [h, p, m, pos] = r.split('|'); return { h, p, m, pos, lv, no: start + i }; });
}
const VOC = {};
if (typeof RAW1 !== 'undefined') VOC[1] = parseVocab(RAW1, 1, 1);
if (typeof RAW2 !== 'undefined') VOC[2] = parseVocab(RAW2, 2, 301);
if (typeof RAW3 !== 'undefined') VOC[3] = parseVocab(RAW3, 3, 501);
const wkey = w => w.h + '|' + w.p;
const shuffle = (a, rnd = Math.random) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

/* Daftar kata dengan pencarian dan penanda hafal */
function vocabList(sel, words, limit = 300) {
  const root = $(sel); const known = new Set(store.get('known', []));
  root.innerHTML = `<input class="search" type="text" id="vq" placeholder="Cari hanzi, pinyin, atau arti…" aria-label="Cari kata"><div class="ctrl"><label>Kelas kata <select id="vp"><option value="">Semua</option>${Object.entries(POS).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label><label>Tampilkan <select id="vk"><option value="">Semua</option><option value="u">Belum hafal</option><option value="k">Sudah hafal</option></select></label><span class="muted small" id="vc"></span></div><div class="vl" id="vlist"></div>`;
  const draw = () => {
    const q = $('#vq', root).value.trim().toLowerCase(), p = $('#vp', root).value, k = $('#vk', root).value;
    const f = words.filter(w => (!p || w.pos === p) && (!k || (k === 'k') === known.has(wkey(w))) && (!q || (w.h + ' ' + w.p + ' ' + w.p.normalize('NFD').replace(/[̀-ͯ]/g, '') + ' ' + w.m).toLowerCase().includes(q)));
    $('#vc', root).textContent = `${f.length} dari ${words.length} kata · hafal ${words.filter(w => known.has(wkey(w))).length}`;
    $('#vlist', root).innerHTML = f.slice(0, limit).map(w => `<div class="vi${known.has(wkey(w)) ? ' known' : ''}" data-w="${wkey(w).replace(/"/g, '&quot;')}"><span class="hz">${w.h}</span><span class="m"><small>${cpy(w.p)}</small><span>${w.m} · <i>${POS[w.pos] || w.pos}</i></span></span>${spkBtn(w.h)}</div>`).join('');
  };
  root.addEventListener('input', draw);
  root.addEventListener('click', e => {
    if (e.target.closest('[data-say]')) return;
    const vi = e.target.closest('.vi'); if (!vi) return;
    const k = vi.dataset.w; known.has(k) ? known.delete(k) : known.add(k); store.set('known', [...known]); draw();
  });
  draw();
}

/* Kartu hafalan */
function flashcards(sel, words) {
  const root = $(sel); let known = new Set(store.get('known', [])), deck = [], i = 0, flip = false, mode = 'h';
  root.innerHTML = `<div class="ctrl"><label>Sisi depan <select id="fm"><option value="h">Hanzi</option><option value="m">Arti</option><option value="a">Suara</option></select></label><label>Isi kartu <select id="fs"><option value="u">Belum hafal</option><option value="a">Semua kata</option></select></label><button class="ghost" id="fsh">Acak ulang</button></div><div class="fc-bar"><i id="fb"></i></div><div class="fc" id="fcard" tabindex="0" role="button" aria-label="Balik kartu"></div><div class="ctrl"><button class="ghost" id="fprev">← Sebelumnya</button><button class="acc" id="fno">Belum hafal</button><button id="fok">Hafal ✓</button><span class="muted small" id="fcnt"></span></div>`;
  const build = () => { const only = $('#fs', root).value === 'u'; deck = shuffle(words.filter(w => !only || !known.has(wkey(w)))); i = 0; flip = false; draw(); };
  const draw = () => {
    const c = $('#fcard', root);
    if (!deck.length) { c.innerHTML = '<div><div class="big">Semua kata sudah hafal 🎉</div><p class="muted">Pilih “Semua kata” untuk mengulang.</p></div>'; $('#fcnt', root).textContent = ''; $('#fb', root).style.width = '100%'; return; }
    const w = deck[i], front = mode === 'h' ? `<span class="hz">${w.h}</span>` : mode === 'm' ? `<span class="mean">${w.m}</span>` : `<span class="hz">🔊</span>`;
    c.innerHTML = flip ? `<div><div class="hz">${w.h}</div><div class="pyl">${cpy(w.p)}</div><div class="mean">${w.m}</div><div class="pos"><span class="tag b">${POS[w.pos] || w.pos}</span> <span class="tag g">kata ke-${w.no}</span></div><div style="margin-top:10px">${spkBtn(w.h)}</div></div>` : `<div>${front}<div class="hint">ketuk kartu untuk melihat jawaban</div></div>`;
    $('#fcnt', root).textContent = `${i + 1} / ${deck.length} · hafal ${words.filter(x => known.has(wkey(x))).length}/${words.length}`;
    $('#fb', root).style.width = (100 * words.filter(x => known.has(wkey(x))).length / words.length) + '%';
    if (!flip && mode === 'a') speak(w.h);
  };
  const next = d => { if (!deck.length) return; i = (i + d + deck.length) % deck.length; flip = false; draw(); };
  $('#fcard', root).onclick = e => { if (e.target.closest('[data-say]') || !deck.length) return; flip = !flip; draw(); };
  $('#fcard', root).onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#fcard', root).click(); } };
  $('#fm', root).onchange = e => { mode = e.target.value; flip = false; draw(); };
  $('#fs', root).onchange = build; $('#fsh', root).onclick = build;
  $('#fprev', root).onclick = () => next(-1);
  $('#fno', root).onclick = () => { if (deck.length) { known.delete(wkey(deck[i])); store.set('known', [...known]); next(1); } };
  $('#fok', root).onclick = () => { if (deck.length) { known.add(wkey(deck[i])); store.set('known', [...known]); next(1); } };
  build();
}

/* Pembuat soal kosakata otomatis */
function vocabQuiz(words, n = 10, pool = words) {
  const out = [], pick = shuffle(words).slice(0, n), types = ['hm', 'mh', 'ph'];
  pick.forEach((w, i) => {
    const t = types[i % 3], same = pool.filter(x => x.pos === w.pos && x.h !== w.h && x.m !== w.m), others = shuffle(same.length >= 3 ? same : pool.filter(x => x.h !== w.h && x.m !== w.m)).slice(0, 3);
    const opts = shuffle([w, ...others]), a = opts.indexOf(w);
    if (t === 'hm') out.push({ q: `Apa arti <b class="hz" style="font-size:1.4rem">${w.h}</b>?`, o: opts.map(x => x.m), a, e: `${w.h} (${w.p}) = ${w.m}.` });
    else if (t === 'mh') out.push({ q: `Kata Mandarin untuk “${w.m}” adalah…`, o: opts.map(x => `<span class="hz">${x.h}</span>`), a, e: `${w.m} = ${w.h} (${w.p}).` });
    else out.push({ q: `Karakter untuk pinyin <b class="py">${w.p}</b> adalah…`, o: opts.map(x => `<span class="hz">${x.h}</span>`), a, e: `${w.p} = ${w.h} (${w.m}).` });
  });
  return out;
}

/* ---------- kerangka halaman ---------- */
(function () {
  const page = document.body.dataset.page, idx = MODULES.findIndex(m => m.id === page), main = $('main');
  const logo = '<svg viewBox="0 0 28 28"><rect width="28" height="28" rx="7" fill="#0F766E"/><text x="14" y="21" text-anchor="middle" font-size="19" font-weight="700" fill="#fff" font-family="Noto Sans SC,PingFang SC,Microsoft YaHei,sans-serif">汉</text><rect x="5" y="23" width="18" height="2" rx="1" fill="#FFD8A8"/></svg>';
  const h = document.createElement('header'); h.className = 'top';
  h.innerHTML = `<div class="wrap bar"><a class="brand" href="index.html">${logo}<span>Belajar Mandarin HSK</span></a><nav><a href="index.html">Beranda</a><details class="menu"><summary>Modul</summary><div class="menu-list">${MODULES.map(m => `<a href="${m.file}"${m.id === page ? ' class="cur"' : ''}><b>${m.id}</b>${m.title}</a>`).join('')}</div></details><a href="kamus.html">Kamus HSK</a><a href="glosarium.html">Glosarium</a></nav></div>`;
  document.body.prepend(h);
  const sec = document.createElement('nav'); sec.className = 'sec'; sec.setAttribute('aria-label', 'Bagian situs');
  sec.innerHTML = '<div class="wrap"><a class="on" href="index.html" aria-current="page">Belajar HSK 1–3</a><a href="../index.html">Kamus Pribadi (PLC)</a></div>';
  document.body.prepend(sec);

  if (idx >= 0) {
    const m = MODULES[idx], hero = document.createElement('section'); hero.className = 'hero';
    hero.innerHTML = `<span class="eyebrow">Modul ${m.id} · ${m.group}</span><h1>${m.title}</h1><p class="lead">${m.desc}</p><div class="dots">${MODULES.map((x, i) => `<a href="${x.file}" title="${x.id} ${x.title}" class="${i < idx ? 'done' : i === idx ? 'cur' : ''}"></a>`).join('')}</div>`;
    main.prepend(hero);
    const p = MODULES[idx - 1], n = MODULES[idx + 1], pn = document.createElement('div'); pn.className = 'pn';
    pn.innerHTML = (p ? `<a href="${p.file}"><small>← Sebelumnya</small>${p.id} · ${p.title}</a>` : `<a href="index.html"><small>←</small>Beranda</a>`) + (n ? `<a class="next" href="${n.file}"><small>Berikutnya →</small>${n.id} · ${n.title}</a>` : `<a class="next" href="glosarium.html"><small>Selesai →</small>Buka Glosarium</a>`);
    main.append(pn);
  }
  const f = document.createElement('footer'); f.className = 'site';
  f.innerHTML = '<div class="wrap">Belajar Mandarin HSK 1–3 · mengikuti silabus HSK 3.0 (2026) · Kata berlatar kuning bisa diklik untuk melihat artinya · Tombol 🔊 memakai suara bahasa Mandarin di perangkat Anda.</div>';
  document.body.append(f);

  const pop = document.createElement('div'); pop.id = 'pop'; pop.setAttribute('role', 'tooltip'); document.body.append(pop);
  const show = el => {
    const g = typeof G !== 'undefined' && G[el.dataset.k]; if (!g) return;
    pop.innerHTML = `<b>${g[0]}</b>${g[1]}<br><a href="glosarium.html#${el.dataset.k}">Lihat di glosarium →</a>`;
    pop.style.display = 'block';
    const r = el.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + window.scrollX + 'px';
    pop.style.top = r.bottom + window.scrollY + 8 + 'px';
  };
  document.addEventListener('click', e => {
    const sp = e.target.closest('[data-say]'); if (sp) { speak(sp.dataset.say); e.stopPropagation(); return; }
    const t = e.target.closest('[data-k]');
    if (t) { show(t); e.stopPropagation(); } else if (!e.target.closest('#pop')) pop.style.display = 'none';
    const menu = $('.menu'); if (menu && !e.target.closest('.menu')) menu.open = false;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') pop.style.display = 'none';
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-k]')) { e.preventDefault(); show(e.target); }
  });
  $$('[data-k]').forEach(el => { el.tabIndex = 0; el.setAttribute('role', 'button'); });
  try { speechSynthesis.getVoices(); } catch (e) { }
})();

/* Kuis cepat: quiz([{q, o:[], a:index, e}]) -> #quiz */
function quiz(items, sel = '#quiz') {
  const root = $(sel); if (!root) return; root.classList.add('quiz');
  let done = 0, score = 0;
  root.innerHTML = items.map((it, i) => `<div class="q"><p>${i + 1}. ${it.q}</p><div class="opts">${it.o.map((o, j) => `<button data-i="${i}" data-j="${j}">${o}</button>`).join('')}</div><div class="exp"></div></div>`).join('') + '<div class="score">Skor: 0 / ' + items.length + '</div>';
  root.addEventListener('click', e => {
    const b = e.target.closest('.opts button'); if (!b || b.disabled) return;
    const it = items[+b.dataset.i], ok = +b.dataset.j === it.a, box = b.closest('.q');
    $$('button', box).forEach((x, j) => { x.disabled = true; if (j === it.a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong'); else score++;
    done++;
    const ex = $('.exp', box); ex.style.display = 'block'; ex.innerHTML = (ok ? '<b style="color:#2B8A3E">Benar.</b> ' : '<b style="color:#C92A2A">Belum tepat.</b> ') + it.e;
    $('.score', root).textContent = `Skor: ${score} / ${items.length}` + (done === items.length ? (score === items.length ? ' — sempurna!' : ' — ulangi bagian yang salah, lalu lanjut.') : '');
  });
}

/* Stepper: stepper('#id', [{t:'judul', h:'html', run:fn}]) */
function stepper(sel, steps) {
  const root = $(sel); let cur = 0;
  root.innerHTML = `<div class="steps">${steps.map((s, i) => `<button data-s="${i}">${i + 1}. ${s.t}</button>`).join('')}</div><div class="body"></div><div class="ctrl"><button class="ghost" data-d="-1">← Kembali</button><button data-d="1">Lanjut →</button></div>`;
  const go = i => {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    $$('.steps button', root).forEach((b, j) => b.classList.toggle('on', j === cur));
    const body = $('.body', root); body.innerHTML = `<div class="fade">${steps[cur].h}</div>`;
    if (steps[cur].run) steps[cur].run(body);
    $$('[data-k]', body).forEach(el => { el.tabIndex = 0; });
    $('[data-d="-1"]', root).disabled = cur === 0; $('[data-d="1"]', root).disabled = cur === steps.length - 1;
  };
  root.addEventListener('click', e => { const s = e.target.closest('[data-s]'), d = e.target.closest('[data-d]'); if (s) go(+s.dataset.s); else if (d) go(cur + +d.dataset.d); });
  go(0);
}

/* Contoh kalimat: ex('我是学生。','Wǒ shì xuésheng.','Saya adalah siswa.') */
const ex = (h, p, m) => `<div class="ex"><div><span class="hz">${h}</span><span class="pyl">${p}</span><small>${m}</small></div>${spkBtn(h)}</div>`;
