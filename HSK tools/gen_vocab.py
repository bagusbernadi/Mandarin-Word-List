# -*- coding: utf-8 -*-
import json, os
import pathlib
OUT=str(pathlib.Path(__file__).resolve().parent.parent / 'docs' / 'hsk')
HEAD='''<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · Belajar Mandarin HSK</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body data-page="{page}">
<main class="wrap">
'''
CFG={
1:dict(file='04-hsk1-kosakata.html',page='04',title='04 HSK 1 Kosakata',n=300,
 intro='HSK 1 memuat <b>300 kata</b> yang mencakup salam, angka, keluarga, waktu, makanan, tempat, dan kegiatan sehari-hari. Kata-kata ini muncul lagi di HSK 2 dan 3, jadi pondasi ini menentukan seluruh perjalanan Anda.',
 themes={
 'Angka':'零 一 二 两 三 四 五 六 七 八 九 十 百 千 半 几 多少 第',
 'Keluarga & orang':'爸爸 妈妈 哥哥 姐姐 弟弟 妹妹 儿子 女儿 家人 朋友 同学 老师 学生 医生 先生 女士 孩子 小朋友',
 'Waktu':'今天 明天 昨天 今年 明年 去年 现在 时候 时间 早上 上午 中午 下午 晚上 年 月 日 号 星期 点 分钟 小时',
 'Makanan & minuman':'饭 米饭 面包 面条儿 包子 饺子 鸡蛋 菜 水果 苹果 茶 水 牛奶 好吃 吃 喝',
 'Tempat':'学校 医院 商店 书店 超市 饭店 公司 电影院 家 中国 房间 里 外 那里 这里',
 'Kata tanya & penunjuk':'什么 谁 哪 哪儿 哪里 怎么 怎么样 几 多少 这 那 这个 那个 这里 那里',
 'Kegiatan harian':'起床 上班 下班 上课 下课 睡觉 工作 学习 写 读 听 说 看 买 卖 玩 休息 做饭 开车',
 'Ungkapan sopan':'你好 谢谢 不客气 对不起 没关系 再见 请问 请 没事 喂'},
 tips=[('两 vs 二','二 dipakai untuk menghitung dan nomor (二, 第二, 十二). 两 dipakai sebelum kata bantu bilangan: 两个人, 两本书.'),
  ('听 vs 听见','听 = mendengarkan (aksi). 听见 = terdengar (hasil): 我听见他说话了.'),
  ('看 vs 看见','看 = melihat/menonton (aksi). 看见 = tampak terlihat (hasil).'),
  ('认识 vs 知道','认识 dipakai untuk orang atau tempat yang pernah ditemui; 知道 untuk fakta atau informasi.'),
  ('会 / 能 / 可以','会 = bisa karena belajar (我会说汉语). 能 = mampu/ada kondisi (我今天能去). 可以 = boleh/izin (这儿可以坐吗).'),
  ('怎么 vs 怎么样','怎么 = bagaimana/mengapa (cara). 怎么样 = bagaimana keadaannya (penilaian): 今天天气怎么样？')]),
2:dict(file='06-hsk2-kosakata.html',page='06',title='06 HSK 2 Kosakata',n=200,
 intro='HSK 2 menambah <b>200 kata baru</b> (total 500). Tema barunya: transportasi, arah, olahraga, sekolah, tubuh, dan kata penghubung. Pelajari juga <b>kata arah</b> seperti 进来 dan 出去, yang sering keluar di soal mendengar.',
 themes={
 'Transportasi & bepergian':'地铁 公交车 打车 车站 机场 机票 站 旅游 出国 酒店 路 路上 门票 票 飞',
 'Arah & posisi':'左 右 左边 右边 前面 后面 上面 下面 里面 外面 旁边 往 远 近 离',
 'Verba arah':'进来 进去 出来 出去 回来 回去 上来 上去 下来 下去 过来 过去 起来',
 'Olahraga & hobi':'篮球 足球 跑步 游泳 跳舞 踢 打 运动 爱好 画',
 'Warna & pakaian':'白色 黑色 红色 绿色 颜色 裤子 红茶 绿茶 奶茶',
 'Sekolah & ujian':'班 考试 考 教室 教 题 词 本子 笔 书包 开学 高中',
 'Tubuh & kesehatan':'身体 头 手 眼睛 药 药店 疼 舒服 累',
 'Kata penghubung':'因为 所以 虽然 但是 但 还是 就 已经 经常 有时 一起 最 准备',
 'Keluarga':'奶奶 爷爷 妻子 丈夫 男孩儿 女孩儿 小孩儿 生日 小时候'},
 tips=[('近 vs 进','Keduanya dibaca jìn. 近 = dekat (sifat). 进 = masuk (verba): 进来, 进去.'),
  ('还是 vs 就','还是 = atau (pertanyaan pilihan) atau tetap. 就 = segera/lalu: 十分钟就到.'),
  ('得 / 地 / 的','的 menghubungkan penjelas + benda; 地 menghubungkan keterangan + verba; 得 menghubungkan verba + penilaian.'),
  ('让 vs 送','让 = membiarkan/menyuruh. 送 = mengantar/memberi (hadiah, orang).'),
  ('过 (guò) vs 过 (guo)','guò = melewati/menghabiskan waktu (过年). guo = partikel pengalaman: 去过中国.'),
  ('花 (huā)','花 bisa “bunga” (名词) atau “menghabiskan” uang/waktu (动词). Lihat konteksnya.')]),
3:dict(file='08-hsk3-kosakata.html',page='08',title='08 HSK 3 Kosakata',n=500,
 intro='HSK 3 menambah <b>500 kata baru</b> (total 1.000). Lonjakannya besar, jadi bagi menjadi 10–12 pekan. Banyak kata di level ini berupa gabungan dua karakter yang sudah Anda kenal, misalnya 工作日 = 工作 + 日.',
 themes={
 'Cuaca, musim & alam':'春天 夏天 秋天 冬天 季节 风 刮 太阳 月亮 山 海 河 草 树',
 'Arah mata angin':'东 南 西 北 东北 东南 西北 西南 北方 南方 东方 西方',
 'Kota & tempat':'城市 公园 动物园 图书馆 银行 体育馆 宾馆 办公室 地图 街 马路 红绿灯 路口 小区',
 'Sekolah & belajar':'复习 练习 作业 成绩 课本 课文 词典 字典 黑板 学期 校长 年级 留学 数学',
 'Kesehatan':'感冒 发烧 健康 病人 检查 住院 出院 担心 牙 头发 脸 耳朵 腿',
 'Pekerjaan & kantor':'经理 同事 会议 开会 办法 要求 机会 努力 决定 完成',
 'Perasaan & sifat':'开心 难过 生气 着急 害怕 满意 聪明 热情 奇怪 可爱 安静',
 'Kata penghubung':'不但 而且 如果 除了 然后 或者 可是 其实 终于 突然 比如 关于 为了 一边',
 'Rumah & makanan':'冰箱 洗衣机 空调 沙发 灯 筷子 盘子 碗 勺子 冰激凌 啤酒 饮料 方便面 西瓜 香蕉 蛋糕',
 'Perjalanan':'护照 行李 高铁 船 出发 起飞 迟到 检票 地点 一直'},
 tips=[('以为 vs 觉得 / 认为','以为 = mengira (ternyata keliru): 我以为他不来. 觉得/认为 = berpendapat tanpa nuansa keliru.'),
  ('得到 / 收到 / 受到','得到 = memperoleh; 收到 = menerima (barang, pesan); 受到 = menerima pengaruh (受到影响).'),
  ('注意 vs 小心','注意 = memperhatikan; 小心 = berhati-hati agar tidak celaka.'),
  ('打算 vs 准备','打算 = berencana (niat); 准备 = bersiap (tindakan menyiapkan).'),
  ('关心 vs 关注','关心 = peduli pada seseorang; 关注 = memperhatikan suatu hal/berita.'),
  ('常 / 常常 / 经常','Maknanya sama (sering). 常 lebih singkat; 常常 dan 经常 lebih umum dalam kalimat.')]),
}
for lv,c in CFG.items():
    th=c['themes']
    themes=json.dumps({k:v.split() for k,v in th.items()},ensure_ascii=False)
    tips=''.join(f'<tr><td><b>{a}</b></td><td>{b}</td></tr>' for a,b in c['tips'])
    prev = {1:'',2:'',3:''}
    html=HEAD.format(title=c['title'],page=c['page'])+f'''
<div class="goals"><b>Setelah modul ini, Anda bisa:</b>
<ul><li>Mengenali dan mengucapkan {c['n']} kata {'HSK '+str(lv) if lv==1 else 'baru HSK '+str(lv)} beserta artinya.</li><li>Menghafal dengan kartu, daftar tema, dan latihan cepat.</li><li>Membedakan kata yang sering tertukar di soal ujian.</li></ul></div>

<h2>Gambaran kata level ini</h2>
<p>{c['intro']}</p>
<div class="note"><b>Cara menghafal yang bekerja</b><p>Hafalkan 10–15 kata per sesi, ucapkan keras-keras sambil mendengar 🔊, lalu tulis sekali. Ulangi pada hari ke-1, ke-3, dan ke-7. Kata yang salah lagi dikembalikan ke tumpukan “belum hafal”.</p></div>

<div class="sim"><div class="sim-h">Simulasi · kartu hafalan</div>
<h3>Ketuk kartu, lalu tandai hafal atau belum</h3>
<div id="fc"></div></div>

<h2>Daftar kata per tema</h2>
<p class="muted">Pilih tema, lalu ketuk sebuah kata untuk menandainya hafal (hijau). Ketuk 🔊 untuk mendengar.</p>
<div class="seg" id="th"></div>
<div id="vl"></div>

<h2>Kata yang sering tertukar</h2>
<div class="tw"><table><tr><th>Pasangan</th><th>Perbedaan</th></tr>{tips}</table></div>

<h2>Kuis kosakata</h2>
<p class="muted">Soal dibuat acak dari kata level ini. Tekan tombol untuk mendapat soal baru.</p>
<div id="quiz"></div>
<p><button class="ghost" id="qn">Soal baru</button></p>

</main>
<script src="assets/vocab{lv}.js"></script>
<script src="assets/glossary.js"></script><script src="assets/app.js"></script>
<script>
const W = VOC[{lv}], TH = {themes};
const th = $('#th'); th.innerHTML = '<button class="on" data-t="">Semua ({c['n']})</button>' + Object.keys(TH).map(k => `<button data-t="${{k}}">${{k}}</button>`).join('');
function showTheme(t) {{ const set = t ? new Set(TH[t]) : null; vocabList('#vl', set ? W.filter(w => set.has(w.h)) : W); }}
th.onclick = e => {{ const b = e.target.closest('button'); if (!b) return; $$('button', th).forEach(x => x.classList.toggle('on', x === b)); showTheme(b.dataset.t); }};
showTheme(''); flashcards('#fc', W);
const newQ = () => quiz(vocabQuiz(W, 8));
$('#qn').onclick = newQ; newQ();
</script>
</body>
</html>
'''
    open(os.path.join(OUT,c['file']),'w',encoding='utf-8').write(html)
    print('wrote',c['file'])
