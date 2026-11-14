/* Mesin soal: latihan (jawaban langsung diperiksa) dan simulasi ujian (waktu, skor, pembahasan).
   Jenis soal:
   mc  : {sk:'L'|'R'|'W', t:'mc', say?, scr?, pic?, q, o:[..], a:index, e}
   ord : {sk:'W', t:'ord', w:['我','在','学校'] (urutan benar), e}
   typ : {sk:'W', t:'typ', q, a:'汉字' | ['汉字','…'], e}
   say = teks yang dibacakan (audio); scr = teks naskah yang tampil saat pembahasan. */
const Exam = (() => {
  const SK = { L: 'Mendengar', R: 'Membaca', W: 'Menulis' };
  const norm = s => (s || '').replace(/[\s。，、？！.,?!：；"“”]/g, '');
  const canSpeak = () => { try { return !!window.speechSynthesis; } catch (e) { return false; } };

  function run(sel, cfg) {
    const root = $(sel), mock = !!cfg.minutes;
    const items = cfg.items.map((it, i) => ({ ...it, i }));
    items.forEach(it => { if (it.t === 'ord') it._sh = shuffle(it.w.map((w, k) => k)); });
    const ans = {}, plays = {}; let secLeft = (cfg.minutes || 0) * 60, tm = null, finished = false;
    const order = ['L', 'R', 'W'].filter(s => items.some(x => x.sk === s));

    const itemHTML = (it, n) => {
      let h = `<div class="qx" id="q${it.i}">`;
      if (it.say) h += `<div class="say"><button class="spk" data-play="${it.i}" aria-label="Putar audio">▶</button><span>Dengarkan${mock ? ` · sisa putar <b id="pl${it.i}">2</b>` : ''}</span></div><div class="scr" id="sc${it.i}">${it.scr || it.say}</div>`;
      if (it.pic) h += `<div class="pic">${it.pic}</div>`;
      h += `<div class="qt">${n}. ${it.q || ''}</div>`;
      if (it.t === 'mc') h += `<div class="opts">${it.o.map((o, j) => `<button data-j="${j}">${'ABCD'[j]}. ${o}</button>`).join('')}</div>`;
      if (it.t === 'ord') h += `<div class="ans" data-ans="${it.i}"></div><div class="ord" data-pool="${it.i}">${it._sh.map(k => `<button data-c="${k}">${it.w[k]}</button>`).join('')}</div><div class="ctrl"><button class="ghost" data-reset="${it.i}">Ulangi</button>${mock ? '' : `<button data-check="${it.i}">Periksa</button>`}</div>`;
      if (it.t === 'typ') h += `<input type="text" id="ty${it.i}" autocomplete="off" placeholder="Ketik karakter Mandarin" aria-label="Jawaban"><div class="ctrl">${mock ? '' : `<button data-check="${it.i}">Periksa</button>`}</div>`;
      h += `<div class="exp" id="ex${it.i}"></div></div>`;
      return h;
    };

    const head = mock ? `<div class="exam-top"><span class="timer" id="tm">--:--</span><span class="muted small" id="prog"></span><div class="qnav" id="qnav"></div><button id="sub">Selesai &amp; nilai</button></div>` : `<div class="exam-top"><span class="score" id="sc">Benar: 0 / ${items.length}</span><span class="muted small">Jawaban langsung diperiksa.</span></div>`;
    let n = 0;
    root.innerHTML = head + order.map(s => `<div class="sec-h"><span>${SK[s]}</span><h3>${items.filter(x => x.sk === s).length} soal</h3></div>` + items.filter(x => x.sk === s).map(it => itemHTML(it, ++n)).join('')).join('') + (mock ? '<div class="ctrl"><button id="sub2">Selesai &amp; nilai</button></div>' : '') + '<div id="res"></div>';
    if (mock) { $('#qnav', root).innerHTML = items.map((it, k) => `<a href="#q${it.i}" id="nv${it.i}">${k + 1}</a>`).join(''); }
    if (!canSpeak()) $$('.scr', root).forEach(e => e.style.display = 'block');

    const get = it => it.t === 'ord' ? (ans[it.i] || []).map(k => it.w[k]) : ans[it.i];
    const grade = it => {
      const a = ans[it.i]; if (a == null) return false;
      if (it.t === 'mc') return a === it.a;
      if (it.t === 'ord') return a.length === it.w.length && a.map(k => it.w[k]).join('') === it.w.join('');
      return [].concat(it.a).some(x => norm(x) === norm(a));
    };
    const answer = it => it.t === 'mc' ? `${'ABCD'[it.a]}. ${it.o[it.a]}` : it.t === 'ord' ? it.w.join('') : [].concat(it.a)[0];
    const reveal = it => {
      const ok = grade(it), box = $('#q' + it.i, root), ex = $('#ex' + it.i, root);
      if (it.t === 'mc') $$('.opts button', box).forEach((b, j) => { b.disabled = true; b.classList.remove('sel'); if (j === it.a) b.classList.add('right'); else if (j === ans[it.i]) b.classList.add('wrong'); });
      else { $$('button,input', box).forEach(b => { if (!b.classList.contains('spk')) b.disabled = true; }); }
      if (it.say) $('#sc' + it.i, root).style.display = 'block';
      ex.style.display = 'block';
      ex.innerHTML = (ok ? '<b style="color:#2B8A3E">Benar.</b> ' : `<b style="color:#C92A2A">Belum tepat.</b> Jawaban: <b class="hz">${answer(it)}</b>. `) + (it.e || '');
      return ok;
    };
    const drawOrd = it => {
      const a = ans[it.i] || [];
      $(`[data-ans="${it.i}"]`, root).innerHTML = a.map(k => `<button data-un="${it.i}:${k}">${it.w[k]}</button>`).join('') || '<span class="muted small">Ketuk kata di bawah sesuai urutan.</span>';
      $$(`[data-pool="${it.i}"] button`, root).forEach(b => b.style.visibility = a.includes(+b.dataset.c) ? 'hidden' : 'visible');
    };
    items.filter(x => x.t === 'ord').forEach(drawOrd);
    let right = 0, doneP = 0;

    const mark = it => { if (mock) { const nv = $('#nv' + it.i, root); const a = ans[it.i]; const has = a != null && (Array.isArray(a) ? a.length : String(a).length); if (nv) nv.classList.toggle('dn', !!has); const c = Object.keys(ans).filter(k => { const v = ans[k]; return v != null && (Array.isArray(v) ? v.length : String(v).length); }).length; $('#prog', root).textContent = `Terjawab ${c} / ${items.length}`; } };

    root.addEventListener('click', e => {
      if (finished && mock) { return; }
      const pl = e.target.closest('[data-play]');
      if (pl) {
        const it = items[+pl.dataset.play];
        if (mock) { plays[it.i] = (plays[it.i] || 0) + 1; if (plays[it.i] > 2) { return; } $('#pl' + it.i, root).textContent = 2 - plays[it.i]; }
        speak(it.say, 0.8); return;
      }
      const ob = e.target.closest('.opts button'); const box = e.target.closest('.qx');
      if (ob && box && !ob.disabled) {
        const it = items[+box.id.slice(1)]; ans[it.i] = +ob.dataset.j;
        if (mock) { $$('.opts button', box).forEach(b => b.classList.toggle('sel', b === ob)); mark(it); }
        else { const ok = reveal(it); doneP++; if (ok) right++; $('#sc', root).textContent = `Benar: ${right} / ${items.length}`; }
        return;
      }
      const cb = e.target.closest('[data-c]');
      if (cb && cb.closest('[data-pool]')) { const it = items[+cb.closest('[data-pool]').dataset.pool]; (ans[it.i] = ans[it.i] || []).push(+cb.dataset.c); drawOrd(it); mark(it); return; }
      const un = e.target.closest('[data-un]');
      if (un) { const [i, k] = un.dataset.un.split(':').map(Number); ans[i] = ans[i].filter((x, idx) => !(x === k && idx === ans[i].lastIndexOf(k))); drawOrd(items[i]); mark(items[i]); return; }
      const rs = e.target.closest('[data-reset]'); if (rs) { const it = items[+rs.dataset.reset]; ans[it.i] = []; drawOrd(it); mark(it); return; }
      const ck = e.target.closest('[data-check]');
      if (ck) { const it = items[+ck.dataset.check]; if (it.t === 'typ') ans[it.i] = $('#ty' + it.i, root).value; const ok = reveal(it); doneP++; if (ok) right++; $('#sc', root).textContent = `Benar: ${right} / ${items.length}`; return; }
      if (e.target.id === 'sub' || e.target.id === 'sub2') finish();
    });
    root.addEventListener('input', e => { const m = e.target.id && e.target.id.match(/^ty(\d+)$/); if (m) { ans[+m[1]] = e.target.value; mark(items[+m[1]]); } });

    function finish(auto) {
      if (finished) return;
      if (!auto && Object.keys(ans).length < items.length && !window.__confirmed) {
        const left = items.length - Object.keys(ans).filter(k => { const v = ans[k]; return v != null && (Array.isArray(v) ? v.length : String(v).length); }).length;
        if (left > 0 && !finish.warned) { finish.warned = true; $('#res', root).innerHTML = `<div class="warn"><b>Masih ada soal kosong</b><p>${left} soal belum dijawab. Tekan “Selesai &amp; nilai” sekali lagi untuk tetap menilai.</p></div>`; return; }
      }
      finished = true; clearInterval(tm);
      const by = {}; items.forEach(it => { const ok = reveal(it); (by[it.sk] = by[it.sk] || [0, 0]); by[it.sk][1]++; if (ok) by[it.sk][0]++; });
      const tot = Object.values(by).reduce((a, b) => a + b[0], 0), pct = tot / items.length, max = cfg.max || 100;
      const best = store.get('best_' + cfg.key, 0), sc = Math.round(pct * max);
      if (cfg.key && sc > best) store.set('best_' + cfg.key, sc);
      $('#res', root).innerHTML = `<div class="sim"><div class="sim-h">Hasil</div><div class="kpis"><div class="kpi"><span>Skor perkiraan</span><b>${sc} / ${max}</b></div><div class="kpi"><span>Benar</span><b>${tot} / ${items.length}</b></div><div class="kpi"><span>Status</span><b style="color:${pct >= .6 ? '#2B8A3E' : '#C92A2A'}">${pct >= .6 ? 'Lulus' : 'Belum lulus'}</b></div></div><div class="tw"><table><tr><th>Bagian</th><th class="num">Benar</th><th class="num">Persen</th></tr>${Object.entries(by).map(([k, v]) => `<tr><td>${SK[k]}</td><td class="num">${v[0]} / ${v[1]}</td><td class="num">${Math.round(100 * v[0] / v[1])}%</td></tr>`).join('')}</table></div><div class="out">Batas lulus yang dipakai di sini: 60% (sama dengan 120 dari 200 pada HSK 1). Skor ini perkiraan latihan, bukan skor resmi. Gulir ke atas untuk membaca pembahasan tiap soal. Skor terbaik di perangkat ini: <b>${Math.max(best, sc)} / ${max}</b>.</div></div>`;
      $('#res', root).scrollIntoView({ behavior: 'smooth', block: 'start' });
      const t = $('#tm', root); if (t) t.classList.remove('low');
    }

    if (mock) {
      const tick = () => { const m = Math.floor(secLeft / 60), s = secLeft % 60, t = $('#tm', root); t.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; t.classList.toggle('low', secLeft <= 300); if (secLeft <= 0) finish(true); secLeft--; };
      tick(); tm = setInterval(tick, 1000); mark(items[0]);
    }
    return { finish };
  }
  return { run };
})();
