/* PhasaKAO intro page (v2.81, RYU 2026-11-27): the approved mockup (project folder kor-app/mockup/intro/), built like the
   JeyCampus intro (kor-app-en src/intro.js) but with no video and no language picker: Lao text with Korean beside it.
   Shown when the app opens without a lesson link, once per visit; a refresh keeps whichever screen was showing.
   The playback choices are written straight into the app's saved state (window.PK.S, from src/app.js). */
(function(){
"use strict";
const PK = window.PK; if (!PK) return;
const S = PK.S, URL_APP = "phasakao.pages.dev";
/* the app's 10 menus: [code, tile text, Korean name, Lao name] (src/meta.js) */
const MENUS = [["K2","안녕","기초회화","ສົນທະນາພື້ນຖານ"],["K1","가나","문자학습","ຕົວອັກສອນ"],["K6","은는","문장규칙","ໄວຍາກອນ"],["K7","단어","어휘","ຄຳສັບ"],["LS","듣기","듣기연습","ຝຶກຟັງ"],["TP","TOPIK","TOPIK","ສອບເສັງ TOPIK"],
  ["K4","학교","대학 생활","ຊີວິດມະຫາວິທະຍາໄລ"],["K3","회사","직장 생활","ບ່ອນເຮັດວຽກ"],["KR","한국","대한민국","ປະເທດເກົາຫຼີ"],["HP","?","도움말","ຄູ່ມື"]];
const LEARN = 6;
const x = {
 hello:"ສະບາຍດີ! 안녕하세요!", losub:"ຮຽນພາສາເກົາຫຼີຕາມຫົວຂໍ້ ງ່າຍໆ ທຸກມື້",
 lead:"ຮຽນການສົນທະນາ, ຕົວອັກສອນ, ໄວຍາກອນ, ຄຳສັບ, ການຟັງ ແລະ TOPIK ດ້ວຍສຽງເກົາຫຼີ ແລະ ຄຳອະທິບາຍເປັນພາສາລາວ, ພ້ອມຊີວິດມະຫາວິທະຍາໄລ, ບ່ອນເຮັດວຽກ ແລະ ປະເທດເກົາຫຼີ.",
 st:["ບົດ","ຄຳສັບ","ປະໂຫຍກ","ຜູ້ຮຽນ"], free:"ຟຣີ",
 s1:"ຕັ້ງຄ່າການຟັງ", s1n:"ປ່ຽນໄດ້ທຸກເວລາໃນບົດຮຽນ. ແອັບຈື່ໄວ້ໃຫ້.",
 pass:"ການຕັ້ງຄ່າການຮຽນຂອງຂ້ອຍ", rep:"ຈຳນວນເທື່ອ", spd:"ຄວາມໄວ", vol:"ລະດັບສຽງ", voice:"ສຽງລາວ", voiceN:"ເກົາຫຼີ → ລາວ → ເກົາຫຼີ",
 theme:"ໜ້າຈໍ", th:["ອັດຕະໂນມັດ","ແຈ້ງ","ມືດ"], fz:"ຂະໜາດຕົວໜັງສື", listen:"ຟັງຕົວຢ່າງ",
 start:"ເລີ່ມຮຽນ", how:"ວິທີໃຊ້",
 s2:"ຮຽນແນວໃດ", s2n:"ທຸກບົດມີ 3 ຂັ້ນ.", h3:[["ຟັງ","듣기","main"],["ເວົ້າຕາມ","따라 말하기","happy"],["ທົດສອບ","퀴즈","think"]], h3k:["S","W","E"],
 inside:"ມີຫຍັງແດ່", learn:"ຮຽນພາສາເກົາຫຼີ", live:"ຊີວິດໃນເກົາຫຼີ",
 it:"ເພີ່ມ PhasaKAO ໃສ່ໜ້າຈໍຫຼັກ", itn:"ໃຊ້ໄດ້ຄືແອັບ: ເປີດເຕັມຈໍ ແລະ ໃຊ້ໄດ້ໂດຍບໍ່ມີອິນເຕີເນັດ ຫຼັງຈາກບັນທຶກສຽງແລ້ວ. ບໍ່ຕ້ອງໃຊ້ App Store.", det:"ເບິ່ງຄືເຈົ້າກຳລັງໃຊ້",
 dlt:"ດາວໂຫຼດ", dla:"ຕິດຕັ້ງແອັບ", dlad:"ເປີດເຕັມຈໍຄືແອັບທົ່ວໄປ.", inst:"ຕິດຕັ້ງ", seehow:"ເບິ່ງວິທີ",
 dlv:"ບັນທຶກສຽງທັງໝົດ", dlvd:"ສຽງເກົາຫຼີ + ສຽງລາວ ສຳລັບໃຊ້ໂດຍບໍ່ມີອິນເຕີເນັດ. ໃຊ້ Wi‑Fi.", save:"ບັນທຶກ",
 dlp:"ໂປສເຕີສຳລັບແບ່ງປັນ", dlpd:"ບອກໝູ່ກ່ຽວກັບ PhasaKAO.", dl:"ດາວໂຫຼດ",
 qr:"ເປີດໃນໂທລະສັບ", qrd:"ສະແກນດ້ວຍກ້ອງໂທລະສັບ.", copy:"ສຳເນົາ", copied:"ສຳເນົາທີ່ຢູ່ແລ້ວ",
 foot:"ຟຣີ ສຳລັບຄົນລາວທຸກຄົນທີ່ຮຽນພາສາເກົາຫຼີ.",
 steps:{ios:["ເປີດໜ້ານີ້ໃນ Safari.","ແຕະປຸ່ມແບ່ງປັນ {share} ຢູ່ລຸ່ມ.","ເລື່ອນລົງ ແລ້ວເລືອກ “Add to Home Screen”.","ແຕະ “Add”. PhasaKAO ຢູ່ໜ້າຈໍຫຼັກແລ້ວ."],
  android:["ແຕະ “ຕິດຕັ້ງ” ຢູ່ລຸ່ມນີ້.","ບໍ່ເຫັນບໍ? ເປີດເມນູ {dots} ຂອງ Chrome ແລ້ວເລືອກ “Install app”.","ແຕະ “Install”, ແລ້ວເປີດ PhasaKAO ຈາກໜ້າຈໍຫຼັກ."],
  ipad:["ເປີດໜ້ານີ້ໃນ Safari.","ແຕະປຸ່ມແບ່ງປັນ {share} ຢູ່ເທິງເບື້ອງຂວາ.","ເລືອກ “Add to Home Screen”, ແລ້ວ “Add”."],
  chrome:["ໃນ Chrome ຫຼື Edge, ຄລິກໄອຄອນຕິດຕັ້ງ {inst} ຢູ່ທ້າຍແຖບທີ່ຢູ່.","ຄລິກ “Install”. PhasaKAO ຈະເປີດໃນໜ້າຕ່າງຂອງມັນເອງ ແລະ ມີທາງລັດໃນ desktop."],
  safari:["ໃນ Safari ຂອງ Mac, ເປີດເມນູ File.","ເລືອກ “Add to Dock”, ແລ້ວ “Add”."]}
};
const KO = {s1:"재생 설정",s2:"공부 방법",inside:"메뉴",rep:"횟수",spd:"속도",vol:"음량",voice:"라오어 음성",theme:"화면",fz:"글자 크기",pass:"학습 설정",start:"시작하기",how:"사용법"};
const ICON = {
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
 stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg>',
 inst:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M12 8v6M9 11l3 3 3-3"/></svg>',
 dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
 audio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="7" y="3" width="10" height="18" rx="2.5"/></svg>',
 pc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg>'
};

/* the device: install steps for it are shown first */
const ua = navigator.userAgent || "";
const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const REAL = isIPad ? "ipad" : /iPhone|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? (/Mobile/.test(ua) ? "android" : "atab") : /Mac/.test(ua) ? "mac" : "pc";
const os = {phone: REAL === "android" ? "android" : "ios", pad: REAL === "atab" ? "atab" : "ipad", pc: REAL === "mac" ? "safari" : "chrome"};
const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
let bip = null;   // Chrome/Edge/Android install prompt
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); bip = e; });

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const kb = s => esc(s).replace(/\{(share|inst|dots)\}/g, (m, k) => '<span class="kbd">' + ICON[k] + '</span>');
const fmt = n => Number(n).toLocaleString("en-US");
const rep = () => String(S.rep || 2), rate = () => String(S.rate || 1), voice = () => S.sayLo !== false, theme = () => S.theme || "auto", fz = () => S.fz || 1;
function isDark(){ const th = theme(); if (th === "dark") return true; if (th === "light") return false; return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); }
function devOf(){ const w = window.innerWidth; return w < 700 ? "phone" : w < 1100 ? "pad" : "pc"; }

function heroCopy(){ return `
  <span class="badge"><img src="icon-192.png" alt="">PhasaKAO</span>
  <h1 class="ko">한국어 배우기</h1>
  <p class="losub">${esc(x.losub)}</p>
  <p class="lead">${esc(x.lead)}</p>
  <div class="stats"><div><b>${fmt(PK.nLessons)}</b><span>${x.st[0]}</span></div><div><b>${fmt(PK.nWords)}</b><span>${x.st[1]}</span></div><div><b>${fmt(PK.nSents)}</b><span>${x.st[2]}</span></div><div><b data-learners>${learners()}</b><span>${x.st[3]}</span></div></div>`; }

/* RYU 2026-11-28: "메뉴" out, "학습자" last = devices counted by the anonymous stats (same number as 도움말 > 통계), from the saved copy at once, then refreshed once per visit */
let LRN = null, LRNF = false;
const lfmt = n => Number(n).toLocaleString("en-US");
function learners(){ if (LRN == null){ try { const d = JSON.parse(localStorage.getItem("kolearn-lo-statspage") || "null"); if (d && d.totals && d.totals.devices) LRN = +d.totals.devices; } catch (e) {} getLearners(); } return LRN ? lfmt(LRN) : "–"; }
function getLearners(){ if (LRNF) return; LRNF = true; try { if (typeof STATS_URL === "undefined" || !STATS_URL || !navigator.onLine) return;
  fetch(STATS_URL + "?stats=1", {cache: "no-store"}).then(r => r.json()).then(d => { if (!d || !d.totals) return; try { localStorage.setItem("kolearn-lo-statspage", JSON.stringify(d)); } catch (e) {}
    if (d.totals.devices){ LRN = +d.totals.devices; document.querySelectorAll("#intro [data-learners]").forEach(b => { b.textContent = lfmt(LRN); }); } }).catch(() => {}); } catch (e) {} }
function brand(){ return `<div class="brand"><img src="icon-192.png" alt=""><div><b>PhasaKAO</b><span>ພາສາເກົາຫຼີ · 한국어</span></div></div>`; }
function free(long){ return `<span class="freepill"><i></i>${x.free}${long ? " · " + esc(x.hello) : ""}</span>`; }
function step(n, k, note){ return `<div class="sh">${n ? `<span class="n">${n}</span>` : ""}<div><h2>${esc(x[k])} <span class="kosub">${KO[k]}</span></h2>${note ? `<p>${esc(x[note])}</p>` : ""}</div></div>`; }
function seg(name, opts, cur, cls){ return `<div class="seg${cls ? " " + cls : ""}" role="group">${opts.map(([v, l]) => `<button type="button" data-${name}="${v}" class="${String(v) === String(cur) ? "on" : ""}" aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join("")}</div>`; }
function pass(withCta){
  return `<div class="pass">
  <div class="passhead"><span class="ph"><img src="img/ele/main.webp" alt=""></span><div><div class="pt">PHASAKAO PASS</div><div class="pn">${esc(x.pass)}<small>${KO.pass}</small></div></div><div class="pid">LAO · 한국어<br>${new Date().getFullYear()}</div></div>
  <div class="scarf"></div>
  <div class="passbody">
   <div class="row"><div class="lab">${esc(x.rep)}<small>${KO.rep}</small></div>${seg("rep", [1,2,3,4,5].map(n => [n, n + "×"]), rep())}</div>
   <div class="row full"><div class="rate"><div class="lab">${esc(x.spd)}<small>${KO.spd}</small></div><div class="rtrack"><input type="range" min="0.7" max="2" step="0.1" value="${rate()}" data-rate aria-label="${esc(x.spd)}"><div class="ticks" aria-hidden="true">${[0.7, 1, 1.5, 2].map(v => `<span style="left:${((v - 0.7) / 1.3 * 100).toFixed(2)}%">${v.toFixed(1)}</span>`).join("")}</div></div><output>×${(+rate()).toFixed(1)}</output></div></div>
   <div class="row full"><div class="rate vol"><div class="lab">${esc(x.vol)}<small>${KO.vol}</small></div><div class="rtrack"><input type="range" min="0" max="100" step="5" value="${volP()}" data-vol aria-label="${esc(x.vol)}"><div class="ticks" aria-hidden="true">${[0, 50, 100].map(v => `<span style="left:${v}%">${v}</span>`).join("")}</div></div><output>${volP()}%</output></div></div>
   <div class="row"><div class="lab">${esc(x.voice)}<small>${KO.voice} · ${esc(x.voiceN)}</small></div><button type="button" class="sw${voice() ? " on" : ""}" data-voice role="switch" aria-checked="${voice()}" aria-label="${esc(x.voice)}"></button></div>
   <div class="row"><div class="lab">${esc(x.theme)}<small>${KO.theme}</small></div>${seg("theme", [["auto", x.th[0]], ["light", x.th[1]], ["dark", x.th[2]]], theme(), "txt")}</div>
   <div class="row"><div class="lab">${esc(x.fz)}<small>${KO.fz}</small></div>${seg("fz", [[0.9, "A−"], [1, "A"], [1.15, "A+"], [1.3, "A++"]], fz())}</div>
   <div class="sample"><button type="button" class="play" data-act="sample" aria-label="${esc(x.listen)}">${playing ? ICON.stop : ICON.play}</button><div><div class="s1">${SAMPLE_KO}</div><div class="s2">${esc(SAMPLE_LO)}</div></div><div class="s3">${rep()}× · ×${(+rate()).toFixed(1)}<br>${esc(x.listen)}</div></div>
  </div>
  ${withCta ? `<div class="passcta">${cta()}</div>` : ""}
  <div class="passfoot">${esc(x.s1n)}</div>
 </div>`; }
function how3(){ return `<div class="how3">${x.h3.map((h, i) => `<div class="hstep"><span class="k">${x.h3k[i]}</span><img src="img/ele/${h[2]}.webp" alt=""><b>${esc(h[0])}</b><small>${h[1]}</small></div>`).join("")}</div>`; }
function menus(){ const tile = (m, i) => `<button type="button" class="mt${i >= LEARN ? " live" : ""}" data-area="${m[0]}"><span class="g"${m[1].length > 3 ? ' style="font-size:.6em"' : ""}>${m[1]}</span><span class="t"><b>${esc(m[3])}</b><small>${m[2]}</small></span></button>`;
  return `<div class="menus"><div class="mgl">${esc(x.learn)} <span class="ko">공부</span></div>${MENUS.slice(0, LEARN).map(tile).join("")}<div class="mgl">${esc(x.live)} <span class="ko">생활</span></div>${MENUS.slice(LEARN).map((m, i) => tile(m, i + LEARN)).join("")}</div>`; }
function osTabs(dev){ const o = dev === "phone" ? [["ios","iPhone"],["android","Android"]] : dev === "pad" ? [["ipad","iPad"],["atab","Android"]] : [["chrome","Chrome · Edge"],["safari","Mac Safari"]];
  return `<div class="otabs" role="group">${o.map(([k, l]) => `<button type="button" data-os="${dev}:${k}" class="${os[dev] === k ? "on" : ""}">${l}</button>`).join("")}</div>`; }
function steps(dev){ const k = os[dev] === "atab" ? "android" : os[dev]; return `<ol class="steps">${x.steps[k].map(s => `<li><span>${kb(s)}</span></li>`).join("")}</ol>`; }
function detectChip(dev){ const name = {phone:{ios:"iPhone · Safari",android:"Android · Chrome"},pad:{ipad:"iPad · Safari",atab:"Android tablet"},pc:{chrome:"PC · Chrome/Edge",safari:"Mac · Safari"}}[dev][os[dev]];
  return `<span class="detect"><i>${dev === "pc" ? ICON.pc : ICON.phone}</i>${esc(x.det)}: <b>${name}</b></span>`; }
function downloads(dev){ const ios = (dev === "phone" && os.phone === "ios") || (dev === "pad" && os.pad === "ipad") || (dev === "pc" && os.pc === "safari");
  const db = document.getElementById("dlbox"), hasAudio = !!document.getElementById("dlAll") && !(db && db.hidden);
  return `<div class="dls">
   <div class="dl"><span class="ic"><img src="icon-192.png" alt=""></span><span class="tx"><b>${esc(x.dla)}</b><small>${esc(x.dlad)}</small></span>${standalone ? '<span class="go y">✓</span>' : `<button type="button" class="go y" data-act="${ios ? "how" : "install"}">${esc(ios ? x.seehow : x.inst)}</button>`}</div>
   ${hasAudio ? `<div class="dl"><span class="ic">${ICON.audio}</span><span class="tx"><b>${esc(x.dlv)}</b><small>${esc(x.dlvd)}</small><small class="dlmsg" data-dlmsg></small></span><button type="button" class="go" data-act="audio">${esc(x.save)}</button></div>` : ""}
   <div class="dl"><span class="ic"><img class="pst" src="img/help/poster-lo.webp" alt=""></span><span class="tx"><b>${esc(x.dlp)}</b><small>${esc(x.dlpd)}</small></span><a class="go" href="img/help/poster-lo.webp" download="PhasaKAO-poster.webp">${esc(x.dl)}</a></div>
  </div>`; }
function addr(){ return `<div class="addr">${URL_APP}<button type="button" data-act="copy">${esc(x.copy)}</button></div>`; }
function foot(pic){ return `<div class="foot">${pic ? `<img src="img/ele/try.webp" alt="">` : ""}<div><b>PhasaKAO</b> · 한국어 배우기<div>${esc(x.foot)}</div><div>${URL_APP} · ${esc(PK.ver)} · Copyleft</div></div></div>`; }
function cta(){ return `<button type="button" class="btn pri" data-act="start">${esc(x.start)} <span class="ko">${KO.start}</span> ${ICON.arrow}</button>`; }
function howBtn(cls){ return `<button type="button" class="btn ${cls}" data-act="how">${esc(x.how)} <span class="ko">${KO.how}</span></button>`; }

/* ---- the three layouts ---- */
function phone(){ return `
 <div class="hero"><img class="bg" src="img/kr/gyeongbokgung.jpg" alt="">
  <div class="top">${brand()}${free(false)}</div>
  <div class="copy">${heroCopy()}</div></div>
 <div class="sec">${step(1, "s1")}${pass(false)}</div>
 <div class="sec">${step(2, "s2", "s2n")}${how3()}</div>
 <div class="sec"><div class="sh"><div><h2>${esc(x.inside)} <span class="kosub">${KO.inside}</span></h2></div></div>${menus()}</div>
 <div class="inst"><img class="bg" src="img/kr/lanterns.jpg" alt="">
  ${detectChip("phone")}<h2>${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.88em">${esc(x.itn)}</p>
  ${osTabs("phone")}${steps("phone")}${downloads("phone")}${addr()}</div>
 ${foot(true)}
 <div class="sticky">${cta()}</div>`; }
function pad(){ return `
 <div class="hero"><img class="bg" src="img/intro/jeonju.jpg" alt="">
  <div class="top">${brand()}${free(true)}</div>
  <div class="copy">${heroCopy()}</div></div>
 <div class="wrap">
  <div class="duo">
   <div class="lcard">${step(0, "s2", "s2n")}${how3()}</div>
   ${pass(false)}
  </div>
  <div class="ctarow" style="margin-top:-8px">${howBtn("sec")}${cta()}</div>
  <div style="display:grid;gap:12px"><h2 style="font-size:1.25em">${esc(x.inside)} <span class="kosub">${KO.inside}</span></h2>${menus()}</div>
 </div>
 <div class="inst"><img class="bg" src="img/kr/lanterns.jpg" alt="">
  <div style="display:grid;gap:14px;align-content:start">${detectChip("pad")}<h2 style="font-size:1.4em">${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.9em">${esc(x.itn)}</p>${osTabs("pad")}${steps("pad")}</div>
  <div style="display:grid;gap:12px;align-content:start"><h3 style="font-size:1em;opacity:.9">${esc(x.dlt)}</h3>${downloads("pad")}${addr()}</div>
 </div>
 <div class="frow">${foot(false)}<img src="img/ele/happy.webp" alt="" class="frpic"></div>`; }
function pc(){ return `
 <div class="hero"><img class="bg" src="img/intro/gyeongbokgung.jpg" alt=""><span class="glow2"></span>
  <div class="nav">${brand()}${[0, 5, 7, 9].map(i => `<a href="#" data-area="${MENUS[i][0]}">${esc(MENUS[i][3])}</a>`).join("")}<span class="sp"></span>${free(true)}${cta()}</div>
  <div class="hgrid">
   <div class="copy">${heroCopy()}<div class="cta">${cta()}${howBtn("ghost")}</div>
    <div class="strip"><img src="img/kr/seoul.jpg" alt="서울"><img src="img/kr/jeonju.jpg" alt="전주 한옥마을"><img src="img/kr/busan.jpg" alt="부산"></div></div>
   <div class="passwrap"><img class="elep" src="img/ele/main.webp" alt="">${pass(true)}</div>
  </div></div>
 <div class="band">
  <div style="display:grid;gap:14px;align-content:start"><h2>${esc(x.s2)} <span class="kosub">${KO.s2}</span></h2><p style="margin:0;color:var(--mm);font-size:.92em">${esc(x.s2n)} ${esc(x.s1n)}</p>${how3()}</div>
  <div><h2 style="margin-bottom:12px">${esc(x.inside)} <span class="kosub">${KO.inside}</span></h2>${menus()}<div class="gal"><img src="img/kr/gyeongbokgung.jpg" alt="경복궁"><img src="img/kr/bulguksa.jpg" alt="불국사"><img src="img/kr/hanbok.jpg" alt="한복" style="object-position:center 25%"></div></div>
 </div>
 <div class="inst"><img class="bg" src="img/kr/lanterns.jpg" alt="">
  <div style="display:grid;gap:14px;align-content:start">${detectChip("pc")}<h2 style="font-size:1.5em">${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.92em">${esc(x.itn)}</p>${osTabs("pc")}${steps("pc")}</div>
  <div style="display:grid;gap:12px;align-content:start;justify-items:start"><h3 style="font-size:1em">${esc(x.qr)}</h3><div class="qrbox"><img src="img/qr.svg" alt="QR ${URL_APP}"></div><p style="margin:0;opacity:.85;font-size:.85em">${esc(x.qrd)}</p>${addr()}</div>
  <div style="display:grid;gap:12px;align-content:start"><h3 style="font-size:1em;opacity:.9">${esc(x.dlt)}</h3>${downloads("pc")}</div>
 </div>
 <div class="frow">${foot(false)}<img src="img/ele/happy.webp" alt="" class="frpic"></div>`; }

/* ---- show, redraw, close ---- */
let box = null, curDev = null;
function render(){
  if (!box) return;
  const d = devOf(), y = box.scrollTop;
  box.className = "m " + (d === "phone" ? "P" : d === "pad" ? "T" : "D") + (isDark() ? " dk" : "");
  box.style.setProperty("--fz", fz());
  box.innerHTML = '<div class="wrapin">' + (d === "phone" ? phone() : d === "pad" ? pad() : pc()) + "</div>";
  box.scrollTop = d === curDev ? y : 0; curDev = d;
  mirrorDl();
}
function open(){
  if (box) return;
  box = document.createElement("div"); box.id = "intro"; box.lang = "lo"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "PhasaKAO");
  document.body.appendChild(box); document.documentElement.classList.add("introon");
  render();
  try { sessionStorage.setItem("pk-intro", "open"); } catch (e) {}   // a refresh keeps the intro
}
function close(){
  stopSample();
  try { sessionStorage.setItem("pk-intro", "closed"); } catch (e) {}   // a refresh keeps the main screen
  if (box){ box.remove(); box = null; } document.documentElement.classList.remove("introon");
}
let rT = 0;
window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { if (box && devOf() !== curDev) render(); }, 150); });
if (window.matchMedia) { const mq = matchMedia("(prefers-color-scheme: dark)"); if (mq.addEventListener) mq.addEventListener("change", () => { if (box && theme() === "auto") render(); }); }

function setRep(v){ S.rep = String(v); PK.save(); const e = document.getElementById("repSel"); if (e) e.value = S.rep; }
function setRate(v){ S.rate = String(v); PK.save(); const e = document.getElementById("rateSel"); if (e) e.value = S.rate; }

/* sample: the first sentence of K2-A-01 with the app's own recorded voices: Korean (repeat × at the chosen speed), the Lao meaning once after the first when the Lao voice is on */
const SAMPLE_KO = "안녕하세요? 캄이에요.", SAMPLE_LO = "ສະບາຍດີ. ຂ້ອຍຊື່ຄຳ.";
let RUN = 0;   // each play has its own number: a stopped play never wakes up and talks over a new one (RYU 2026-11-27, as JeyCampus v1.30.6)
let playing = false;
function stopSample(){ RUN++; if (playing){ playing = false; try { PK.quiet(); } catch (e) {} } }
async function sample(){
  if (playing){ stopSample(); render(); return; }
  const me = ++RUN, on = () => playing && RUN === me;
  playing = true; render(); const n = +rep() || 1;
  for (let i = 0; i < n && on(); i++){
    await PK.speak(SAMPLE_KO, false);
    if (i === 0 && voice() && on()) await PK.speak(SAMPLE_LO, true);
    if (on()) await new Promise(r => setTimeout(r, 350));
  }
  if (RUN === me){ playing = false; render(); }
}
function toast(msg){ if (!box) return; const el = document.createElement("div"); el.className = "toast"; el.textContent = msg; box.appendChild(el); setTimeout(() => el.remove(), 2200); }
/* the app's own "save audio" link does the work; its progress text is copied here */
function mirrorDl(){ const src = document.getElementById("dlMsg"), dst = box && box.querySelector("[data-dlmsg]"); if (src && dst) dst.textContent = src.textContent; }
{ const src = document.getElementById("dlMsg"); if (src && window.MutationObserver) new MutationObserver(mirrorDl).observe(src, {childList: true, characterData: true, subtree: true}); }
function goArea(a){ const b = document.querySelector('#groups [data-g="' + a + '"]'); close(); if (b) b.click(); setTimeout(() => scrollTo(0, 0), 80); }

document.addEventListener("click", ev => {
  if (!box || !box.contains(ev.target)) return;
  const b = ev.target.closest("button,a"); if (!b || b.disabled) return;
  if (b.dataset.rep){ setRep(b.dataset.rep); render(); return; }
  if (b.dataset.theme){ S.theme = b.dataset.theme; PK.save(); PK.applyPrefs(); render(); return; }
  if (b.dataset.fz){ S.fz = +b.dataset.fz; PK.save(); PK.applyPrefs(); render(); return; }
  if (b.hasAttribute("data-voice")){ PK.setSayLo(!voice()); render(); return; }
  if (b.dataset.os){ const [d, k] = b.dataset.os.split(":"); os[d] = k; render(); return; }
  if (b.dataset.area){ ev.preventDefault(); goArea(b.dataset.area); return; }
  const a = b.dataset.act; if (!a) return;
  ev.preventDefault();
  if (a === "start") close();
  else if (a === "sample") sample();
  else if (a === "copy"){ const done = () => toast(x.copied); try { navigator.clipboard.writeText("https://" + URL_APP + "/").then(done, done); } catch (e) { done(); } }
  else if (a === "install"){ if (bip){ bip.prompt(); bip.userChoice.then(() => { bip = null; }, () => {}); } else { const el = box.querySelector(".steps"); if (el) el.scrollIntoView({behavior: "smooth", block: "center"}); } }
  else if (a === "audio"){ const d = document.getElementById("dlAll"); if (d) d.click(); }
  else if (a === "how"){ const el = box.querySelector(".steps"); if (el) el.scrollIntoView({behavior: "smooth", block: "center"}); }
});
/* volume (RYU 2026-11-27): vol.js (window.AVOL) sets one level for all app sound; iPhone/iPad included */
function volP(){ try { return window.AVOL ? AVOL.pct() : 100; } catch (e) { return 100; } }
document.addEventListener("input", ev => { if (box && ev.target.matches("#intro [data-vol]")){ const v = +ev.target.value; try { if (window.AVOL) AVOL.set(v / 100); } catch (e) {} const o = ev.target.closest(".rate").querySelector("output"); if (o) o.textContent = v + "%"; } });
document.addEventListener("input", ev => { if (box && ev.target.matches("#intro [data-rate]")){ const v = (+ev.target.value).toFixed(1).replace(/\.0$/, ""); setRate(v); const o = ev.target.closest(".rate").querySelector("output"); if (o) o.textContent = "×" + (+v).toFixed(1); } });
document.addEventListener("change", ev => { if (box && ev.target.matches("#intro [data-rate]")) render(); });
/* while the intro is open, the app's keys stay off; Esc closes it */
document.addEventListener("keydown", ev => { if (!box) return; if (ev.key === "Escape") close(); else if (!/^(Tab|Enter| )$/.test(ev.key) && !ev.target.closest("#intro input")) ev.stopImmediatePropagation(); }, true);

/* a way back: a button under the theme row */
{ const pf = document.getElementById("prefs"); if (pf){ const p = document.createElement("p"); p.className = "introline";
  const b = document.createElement("button"); b.type = "button"; b.className = "pb"; b.innerHTML = '<img src="icon-192.png" alt="" style="width:18px;height:18px;border-radius:5px;vertical-align:-4px"> PhasaKAO <span class="ko">첫 화면</span>';
  b.addEventListener("click", open); p.appendChild(b); pf.after(p); } }

/* open: no lesson link in the address and not yet closed in this visit; a refresh keeps whichever screen was showing */
let st = null; try { st = sessionStorage.getItem("pk-intro"); } catch (e) {}
if (st === "open" || (location.hash.length <= 1 && st !== "closed")) open();
PK.intro = open;
})();
