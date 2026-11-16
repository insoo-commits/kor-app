/* Korean for Lao learners. Data: META (areas, sub-groups, bundle index) is inlined; bundle bodies load per area from data/K?.json. */
(function(){
"use strict";
const META = window.KO_META, AREAS = META.areas, SUBS = META.subs, IDX = META.idx;
const byCode = new Map(IDX.map((r, i) => [r[0], i]));
const $ = id => document.getElementById(id);
const areaOf = c => c.slice(0, 2), subOf = c => c.slice(0, 4);
const T = {
  sec: {m: "ວິທີສ້າງປະໂຫຍກ", l: "ຕົວອັກສອນ", x: "ຕາຕະລາງ", w: "ຄຳສັບ", f: "ສຳນວນທີ່ໃຊ້ເລື້ອຍໆ", c: "ການປ່ຽນຮູບຄຳ", e: "ປະໂຫຍກຕົວຢ່າງ", tp: "ຂໍ້ແນະນຳ", pr: "ຄຳຄູ່", dl: "ບົດສົນທະນາ", sm: "ສະຫຼຸບ", qz: "ຄຳຖາມທວນຄືນ"},
  level: "ລະດັບ", repBundle: "ຟັງບົດນີ້", repDlg: "ຊ້ຳບົດສົນທະນາ", repWord: "ຊ້ຳຄຳນີ້", repGroup: "ຊ້ຳກຸ່ມນີ້", example: "ຕົວຢ່າງ", repLetters: "ຟັງທຸກຕົວ", repAll: "ຟັງຕໍ່ເນື່ອງ", pause: "ຢຸດຊົ່ວຄາວ", resume: "ສືບຕໍ່", stop: "ຍົກເລີກ", hideLo: "ເຊື່ອງຄຳແປ", done: "ຮຽນຈົບແລ້ວ", markDone: "ໝາຍວ່າຮຽນຈົບແລ້ວ", next: "ບົດຕໍ່ໄປ →", prev: "← ກ່ອນໜ້າ", nextCard: "ຕໍ່ໄປ →",
  hidePr: "ເຊື່ອງຄຳອ່ານ", showKo: "ສະແດງຄຳອະທິບາຍພາສາເກົາຫຼີ", known: "ຈື່ແລ້ວ", flip: "ແຕະເພື່ອເບິ່ງຄວາມໝາຍ", onlyNew: "ສະເພາະຄຳທີ່ຍັງບໍ່ຈື່",
  showAns: "ເບິ່ງຄຳຕອບ", again: "ເຮັດອີກຄັ້ງ", score: "ຄະແນນ", noCards: "ບົດນີ້ບໍ່ມີບັດຄຳ.", allKnown: "ຈື່ໝົດທຸກຄຳແລ້ວ!", noQuiz: "ບົດນີ້ມີຄຳສັບບໍ່ພໍສຳລັບແບບທົດສອບ.",
  pick: "ເລືອກຄວາມໝາຍທີ່ຖືກຕ້ອງ", pickKo: "ເລືອກຄຳພາສາເກົາຫຼີທີ່ຖືກຕ້ອງ", loading: "ກຳລັງໂຫຼດ…", loadFail: "ໂຫຼດບົດຮຽນບໍ່ໄດ້. ກະລຸນາເປີດໜ້ານີ້ຄືນໃໝ່.",
  noHit: "ບໍ່ພົບຜົນການຄົ້ນຫາ.", searching: "ກຳລັງຄົ້ນຫາ…", lessons: "ບົດ", words: "ຄຳສັບ", sents: "ປະໂຫຍກ", wordsShort: "ຄຳ",
  noVoice: "ອຸປະກອນນີ້ບໍ່ມີສຽງພາສາເກົາຫຼີ. ກະລຸນາຕິດຕັ້ງສຽງພາສາເກົາຫຼີໃນການຕັ້ງຄ່າ ຫຼື ໃຊ້ Chrome / Edge."
};
/* line icons (speaker, repeat) instead of emoji, so they take the theme colour */
const ICO = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4.5" width="4.5" height="15" rx="1"/><rect x="14" y="4.5" width="4.5" height="15" rx="1"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="5.5" width="13" height="13" rx="1.5"/></svg>',
  spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>'
};
function ico(name){ const s = document.createElement("span"); s.className = "ico"; s.setAttribute("aria-hidden", "true"); s.innerHTML = ICO[name]; return s; }
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs){
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat(3)){ if (kid == null || kid === false) continue; el.append(kid.nodeType ? kid : document.createTextNode(String(kid))); }
  return el;
}

/* ---------- saved state (this device only) ---------- */
const LS = "kolearn-v1";
let S = {code: IDX[0][0], mode: "learn", rate: "1", rep: "2", hidePr: false, hideLo: false, showKo: true, onlyNew: false, known: {}, done: {}};
try { const v = JSON.parse(localStorage.getItem(LS) || "null"); if (v && typeof v === "object") S = Object.assign(S, v); } catch (e) {}
S.showKo = true;   // Korean notes always shown; the checkbox was removed (RYU 2026-11-14)   // RYU 2026-11-14: Korean notes shown by default
if (!S.playDef){ S.rate = "1"; S.rep = "2"; S.playDef = 1; }   // RYU 2026-11-14: start at speed 1.0, 2 times
if (!byCode.has(S.code)) S.code = IDX[0][0];
S.hidePr = false; S.hideLo = false; S.onlyNew = false;   // both boxes removed (v1.64, v1.66); the hide-reading box was removed (v1.64), so a saved "hide" must not stick
function save(){ try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }

/* ---------- data ---------- */
const cache = new Map(), loading = new Map();
function loadArea(a){
  if (cache.has(a)) return Promise.resolve(cache.get(a));
  if (!loading.has(a)) loading.set(a, fetch("data/" + a + ".json").then(r => { if (!r.ok) throw new Error(a); return r.json(); })
    .then(d => { cache.set(a, d); return d; }).catch(e => { loading.delete(a); throw e; }));
  return loading.get(a);
}
const bundle = code => (cache.get(areaOf(code)) || []).find(b => b.code === code);

/* ---------- speech (RYU's playback rules, same as the Lao app) ----------
   one 🔊: that line repeats until stopped · word: Korean, Lao meaning, Korean, then Korean only for the remaining N-1
   sentence: exactly N times · bundle repeat: this bundle round and round · all repeat: every bundle in app order, then back to the first */
const synth = window.speechSynthesis || null;
let koVoice = null, loVoice = null;
const P = {tok: 0, mode: "", paused: false, round: 1, nav: false};
function pickVoice(){
  if (!synth) return;
  const all = synth.getVoices(), vs = all.filter(v => /^ko/i.test(v.lang));
  koVoice = vs.find(v => /Google|Yuna|SunHi|InJoon|Natural/i.test(v.name)) || vs[0] || null;
  loVoice = all.find(v => /^lo/i.test(v.lang)) || null;
  $("voiceNote").textContent = all.length && !koVoice && !window.AUDIO_INDEX ? T.noVoice : "";
}
if (synth){ pickVoice(); try { synth.addEventListener("voiceschanged", pickVoice); } catch (e) {} } else if (!window.AUDIO_INDEX) $("voiceNote").textContent = T.noVoice;
const CLIPS = window.AUDIO_INDEX || {};
let AEL = null;
const hasClip = (lang, text) => !!CLIPS[clipKey(lang, lang === "lo" ? cleanLo(text) : cleanKo(text))];
/* a ready-made clip when there is one, the device's voice otherwise */
function speakOne(text, lao){
  return new Promise(res => {
    const t = lao ? cleanLo(text) : cleanKo(text);
    if (!t) return res();
    let fin = false; const end = () => { if (!fin){ fin = true; if (CUR_END === end) CUR_END = null; res(); } };
    CUR_END = end;   // quiet() ends the piece at once, so a pause does not leave it hanging until the safety timer (RYU 2026-11-16 resume bug)
    const tts = () => {
      if (!synth || (lao && !loVoice)) return end();
      const u = new SpeechSynthesisUtterance(t);
      if (lao){ u.lang = loVoice.lang; u.voice = loVoice; } else { u.lang = "ko-KR"; if (koVoice) u.voice = koVoice; }
      u.rate = +S.rate || 1; u.onend = end; u.onerror = end; setTimeout(end, 4000 + t.length * 450);
      try { synth.speak(u); } catch (e) { end(); }
    };
    const key = clipKey(lao ? "lo" : "ko", t);
    if (!CLIPS[key]) return tts();
    try {
      if (!AEL) AEL = new Audio();
      AEL.onended = end; AEL.onerror = () => { if (!fin) tts(); };
      AEL.src = "audio/" + key + ".mp3"; AEL.playbackRate = +S.rate || 1;
      const pr = AEL.play(); if (pr && pr.catch) pr.catch(() => { if (!fin) tts(); });
      setTimeout(end, 8000 + t.length * 600);
    } catch (e) { tts(); }
  });
}
let CUR_END = null;
function quiet(){ if (synth) try { synth.cancel(); } catch (e) {} if (AEL) try { AEL.onended = AEL.onerror = null; AEL.pause(); } catch (e) {} const f = CUR_END; CUR_END = null; if (f) f(); }
const gap = ms => new Promise(r => setTimeout(r, ms));
function mark(el){
  document.querySelectorAll(".now").forEach(x => x.classList.remove("now"));
  if (el && el.isConnected){ el.classList.add("now"); if (P.mode !== "single" && el.scrollIntoView) el.scrollIntoView({block: "nearest"}); }
}
function showPlayer(text){
  $("player").hidden = !P.mode;
  const t = text || "", m = t.match(/^(🔊|🔁)\s*/);
  /* lesson number right after the speaker mark (RYU 2026-11-16, v1.74) */
  const on = t && byCode.has(S.code) ? "[" + ordParts(S.code).join("") + "] " : "";
  $("pt").replaceChildren(...(m ? [ico(m[1] === "🔊" ? "spk" : "rep"), on + t.slice(m[0].length)] : [on + t]));
  $("ppause").replaceChildren(ico(P.paused ? "play" : "pause"), h("span", {class: "bt"}, P.paused ? T.resume : T.pause));   // same kind of mark on all three (RYU 2026-11-16)
}
async function hold(tok){ while (P.paused && tok === P.tok) await gap(150); return tok === P.tok; }
/* says one piece; if paused in the middle, says it again after resuming */
async function say(tok, text, lao){
  for (;;){
    if (!(await hold(tok))) return false;
    await speakOne(text, lao);
    if (tok !== P.tok) return false;
    if (!P.paused) return true;
  }
}
async function sayItem(tok, it, label, noLo){
  const n = +S.rep || 1;
  mark(it.el);
  /* words and sentences alike: Korean, Lao once, then Korean as many times as the count box says (RYU 2026-11-16) */
  showPlayer(label + " · " + it.ko);
  let st = 0; const face = () => { if (it.card) flipCard(it.card, st++ % 2 === 1); };   // word cards: odd plays Korean side, even plays Lao side (RYU 2026-11-16)
  face(); if (!(await say(tok, it.ko))) return false; await gap(300);
  if (!noLo && it.lo && (loVoice || hasClip("lo", it.lo))){ face(); if (!(await say(tok, it.lo, true))) return false; await gap(300); }
  for (let k = 0; k < n; k++){
    showPlayer(label + " · " + (k + 1) + "/" + n + " · " + it.ko);
    face(); if (!(await say(tok, it.ko))) return false; await gap(350);
  }
  if (it.card) flipCard(it.card, false);
  await gap(250);
  return tok === P.tok;
}
/* bundle / all-bundle repeat: everything above the dialogue (the dialogue has its own repeat button) */
const queue = () => [...document.querySelectorAll("#view [data-say]")].filter(el => !el.closest(".dlg")).map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
async function playSingle(el){
  if (P.mode === "single" && el.classList.contains("now")) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "single"; P.paused = false;
  mark(el);
  const ko = el.dataset.say, lo = el.dataset.lo || "";
  const withLo = lo && (loVoice || hasClip("lo", lo));   // word or sentence: Korean, Lao once, then Korean over and over (RYU 2026-11-16)   // a headword: Korean, Lao, then Korean over and over
  for (let k = 1; tok === P.tok; k++){
    showPlayer("🔊 ∞ · " + k + " · " + ko);
    if (!(await say(tok, ko))) return;
    if (withLo && k === 1){ await gap(300); if (!(await say(tok, lo, true))) return; }
    await gap(500);
  }
}
async function playBundle(chain){
  stopPlay();
  const tok = ++P.tok; P.mode = chain ? "chain" : "bundle"; P.paused = false; P.round = 1;
  /* in the word-card tab the same two buttons go card by card, showing each card with its meaning (RYU 2026-11-16, v1.67) */
  const cards = S.mode === "cards";
  for (;;){
    const q = cards ? [...document.querySelectorAll("#view .wcard")].map(c => ({el: c, card: c, ko: c.dataset.say, lo: c.dataset.lo || ""})) : queue();
    if (!q.length && !chain) return stopPlay();
    for (let i = 0; i < q.length; i++){
      const label = chain ? "🔁 " + (i + 1) + "/" + q.length : "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round;
      if (!(await sayItem(tok, q[i], label))) return;
    }
    if (chain){
      const next = IDX[(byCode.get(S.code) + 1) % IDX.length][0];
      P.nav = true; S.code = next; S.mode = cards ? "cards" : "learn";
      try { await loadArea(areaOf(next)); } catch (e) { P.nav = false; return stopPlay(); }
      if (tok !== P.tok){ P.nav = false; return; }
      if (location.hash === "#" + next){ P.nav = false; save(); drawAll(); } else { location.hash = next; await gap(60); }
      window.scrollTo(0, 0);
    } else P.round++;
    await gap(400);
    if (tok !== P.tok) return;
  }
}
/* word repeat: the word and its example sentences, each played the way the bundle repeat plays it (same 횟수), round and round until stopped */
async function playWord(box){
  if (P.mode === "word" && P.box === box) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "word"; P.box = box; P.paused = false; P.round = 1;
  box.classList.add("playing");
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")].map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
    for (let i = 0; i < q.length; i++) if (!(await sayItem(tok, q[i], "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round, P.round > 1))){ box.classList.remove("playing"); return; }
    P.round++; await gap(400);
    if (tok !== P.tok){ box.classList.remove("playing"); return; }
  }
}
/* dialogue repeat: each dialogue line S.rep times, in order, round and round until stopped */
async function playDialogue(box){
  if (P.mode === "dialog") return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "dialog"; P.paused = false; P.round = 1;
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")];
    if (!q.length) return stopPlay();
    for (let i = 0; i < q.length; i++){
      if (!(await sayItem(tok, {el: q[i], ko: q[i].dataset.say}, "🔊 " + (i + 1) + "/" + q.length + " · ↻" + P.round))) return;
      await gap(350);
    }
    P.round++; await gap(900);
    if (tok !== P.tok) return;
  }
}
/* section repeat (word and expression sections), RYU 2026-11-14: for each word in turn, the word in Korean, its Lao
   meaning, then the word in Korean as many times as 횟수 says; after that each of its example sentences in Korean
   that many times; then the next word. Round and round until stopped; the same button stops it */
async function playSents(box){
  if (P.mode === "sents" && P.box === box) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "sents"; P.box = box; P.paused = false; P.round = 1;
  box.classList.add("playing");
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")].map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
    if (!q.length) return stopPlay();
    for (let i = 0; i < q.length; i++)
      if (!(await sayItem(tok, q[i], "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round))) return;
    P.round++; await gap(600);
    if (tok !== P.tok) return;
  }
}
function stopPlay(){
  P.tok++; P.mode = ""; P.paused = false; if (P.box){ P.box.classList.remove("playing"); P.box = null; }
  quiet();
  mark(null); showPlayer(""); document.querySelectorAll(".wcard.back").forEach(c => c.classList.remove("back"));
}
function togglePause(){
  if (!P.mode) return;
  P.paused = !P.paused;
  if (P.paused) quiet();
  $("ppause").replaceChildren(ico(P.paused ? "play" : "pause"), h("span", {class: "bt"}, P.paused ? T.resume : T.pause));   // same kind of mark on all three (RYU 2026-11-16)
}
const spk = () => h("button", {class: "spk", type: "button", "aria-label": "ຟັງ", onclick: ev => { const el = ev.currentTarget.closest("[data-say]"); if (el) playSingle(el); }}, ico("spk"));

/* ---------- chrome ---------- */
function drawStats(){
  const n = x => Number(x).toLocaleString("en-US");
  $("stats").replaceChildren(h("span", null, h("b", null, n(IDX.length)), T.lessons), h("span", null, h("b", null, n(META.nWords)), T.words), h("span", null, h("b", null, n(META.nSents)), T.sents));
}
/* areas: lesson count after the Korean name; subs: "N ບົດ · N ຄຳ" on its own line (RYU 2026-11-15) */
const cnt = rows => { const w = rows.reduce((t, r) => t + (r[5] || 0), 0); return rows.length + " " + T.lessons + (w ? " · " + w + " " + T.wordsShort : ""); };
function drawGroups(){
  const cur = areaOf(S.code);
  $("app").setAttribute("data-g", cur);
  $("groups").replaceChildren(...AREAS.map(a => {
    const rows = IDX.filter(r => r[0].startsWith(a[0] + "-"));
    return h("button", {class: "group", type: "button", "data-g": a[0], "aria-pressed": a[0] === cur ? "true" : "false", onclick: () => go(lastIn(S.lastA, a[0], rows))},
      h("span", {class: "gn"}, h("i"), a[2]), h("small", {class: "ko"}, a[1] + " · " + rows.length));
  }));
  const on = $("groups").querySelector('[aria-pressed="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
function drawSubs(){
  const a = areaOf(S.code), cur = subOf(S.code);
  const ids = [...new Set(IDX.filter(r => r[0].startsWith(a + "-")).map(r => subOf(r[0])))];
  $("subs").replaceChildren(...ids.map(s => {
    const rows = IDX.filter(r => r[0].startsWith(s + "-")), n = SUBS[s] || [s, s];
    return h("button", {class: "sub", type: "button", role: "tab", "aria-selected": s === cur ? "true" : "false", onclick: () => go(lastIn(S.lastS, s, rows))},
      h("span", {class: "name"}, n[1]), h("span", {class: "kn ko"}, n[0]), h("span", {class: "prog"}, cnt(rows)));
  }));
  const on = $("subs").querySelector('[aria-selected="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
/* lesson order number in app order: ["7-01-", "02"] for [7-01-02] */
function ordParts(code){
  const a = areaOf(code), sb = subOf(code), subsA = [...new Set(IDX.filter(r => r[0].startsWith(a + "-")).map(r => subOf(r[0])))];
  const rows = IDX.filter(r => r[0].startsWith(sb + "-")), pad = n => String(n).padStart(2, "0");
  return [(AREAS.findIndex(x => x[0] === a) + 1) + "-" + pad(subsA.indexOf(sb) + 1) + "-", pad(rows.findIndex(r => r[0] === code) + 1)];
}
function drawControls(){
  const s = subOf(S.code), rows = IDX.filter(r => r[0].startsWith(s + "-"));
  /* lesson picker: own list instead of the phone's native one, so each lesson stays on one line inside the box (RYU 2026-11-14) */
  const lab = (r, btn) => [h("span", {class: "ddk"}, (!btn && S.done[r[0]] ? "✓ " : "") + r[1]), r[4] ? h("span", {class: "ddo"}, r[4]) : ""];
  const curRow = rows.find(r => r[0] === S.code) || rows[0];
  /* order number [area-sub-lesson] in app order in front of the chosen lesson (RYU 2026-11-16, v1.70) */
  const [ord, last] = ordParts(curRow[0]);
  /* PC and tablet: [7-01-01]; phone: only the lesson number [01], so the name is not cut (RYU 2026-11-16, v1.72) */
  $("bselBtn").replaceChildren(h("span", {class: "ddn ko"}, "[", h("span", {class: "ddn-ab"}, ord), last + "]"), ...lab(curRow, true));   // check mark dropped (RYU 2026-11-16, v1.71)   // check in front of the chosen lesson on the main screen, not in the list (RYU 2026-11-15)
  $("bselList").replaceChildren(...rows.map(r => h("button", {type: "button", class: "ddi", role: "option", "aria-selected": r[0] === S.code ? "true" : "false", onclick: () => { ddClose(); go(r[0]); }}, ...lab(r))));
  document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === S.mode ? "true" : "false"));
  $("repSel").value = S.rep; $("rateSel").value = S.rate;
}
/* Lao text with Korean runs (Hangul and jamo) wrapped in the Korean font */
const koMix = t => String(t).split(/([\u3131-\u318E\uAC00-\uD7A3]+(?:[\s~\-]+[\u3131-\u318E\uAC00-\uD7A3]+)*)/).map((x, j) => j % 2 ? h("span", {class: "ko"}, x) : x);
function drawBand(b){
  const r = IDX[byCode.get(S.code)];
  $("band").replaceChildren(
    /* lesson title removed; the lesson picker sits in its place (RYU 2026-11-15, v1.19) */
    h("div", {class: "bandin"}, $("bsel"),
      b && b.i ? h("p", {class: "intro"}, b.i[1] || "", b.i[1] ? " " : "", h("span", {class: "sub-ko ko"}, b.i[0])) : null,   // Lao then Korean in one run, always shown; level/type tags not shown (RYU 2026-11-14)
      /* tips under the intro, Lao text with Korean words mixed in, one bullet each, like lao-app (RYU 2026-11-16) */
      b && b.tp && b.tp.length ? h("div", {class: "tipbox"}, b.tp.map(t => h("p", null, "• ", koMix(t[1] || t[0])))) : null));
}

/* ---------- lesson view ---------- */
const sec = (key, ...kids) => kids.flat().filter(Boolean).length ? h("section", {class: "sec"}, h("h3", null, T.sec[key],
  key === "l" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playWord(ev.currentTarget.closest(".sec").querySelector(".letters"))}, ico("rep"), T.repLetters)
  : key === "c" || key === "e" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playWord(ev.currentTarget.closest(".sec").querySelector(".rows"))}, ico("rep"), T.repGroup)
  : key === "dl" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playDialogue(ev.currentTarget.closest(".sec").querySelector(".dlg"))}, ico("rep"), T.repDlg)
  /* words and expressions: repeat the whole section, word by word, same place and look as the dialogue repeat (RYU 2026-11-14) */
  : key === "w" || key === "f" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playSents(ev.currentTarget.closest(".sec"))}, ico("rep"), T.repGroup) : null), kids) : null;
const note = pair => [h("p", {class: "note-lo"}, pair[1] || pair[0]), S.showKo && pair[1] ? h("p", {class: "note-ko ko"}, pair[0]) : null];
/* ※ key words of a sentence: [[word, Lao-script reading, Lao meaning], …] */
const gloss = g => g && g.length ? h("div", {class: "gl"}, "※ ", g.flatMap((x, j) => [j ? " · " : null, h("span", {class: "ko"}, x[0]), " ", h("span", {class: "p"}, x[1]), " (", h("span", {class: "gm"}, x[2]), ")"])) : null;
/* base form of a conjugation row ("저 ຂ້ອຍ"), shown at the bottom like the ※ notes */
const fromNote = f => { if (!f) return null; const m = f.match(/^([가-힣\s?!.~\-\/]*[가-힣?!.~])\s*(.*)$/);
  return h("div", {class: "gl"}, "※ ", h("span", {class: "ko"}, m ? m[1] : f), m && m[2] ? [" (", h("span", {class: "gm"}, m[2]), ")"] : null); };
const line = (ko, pr, lo, cls, from, g) => h("div", {class: "line " + (cls || ""), "data-say": ko, "data-lo": lo, "data-head": cls === "head" ? "1" : null}, spk(),
  h("div", null, h("div", {class: "k ko"}, ko), pr ? h("div", {class: "p"}, pr) : null, h("div", {class: "m"}, lo), gloss(g), fromNote(from)));
function renderLearn(b){
  const i = byCode.get(b.code), next = IDX[i + 1], isDone = !!S.done[b.code];
  const dl = b.dl || [];
  return [
    sec("m", (b.m || []).map(m => h("div", {class: "tip"}, note(m)))),
    /* letters (ຕົວອັກສອນ) section dropped from the sentence tab: the letters are studied in the word tab (RYU 2026-11-16, v1.75) */
    b.x && b.x.length > 1 ? sec("x", h("div", {class: "tablewrap"}, h("table", null,
      h("thead", null, h("tr", null, b.x[0].map(c => h("th", {class: "ko"}, c)))),
      h("tbody", null, b.x.slice(1).map(r => h("tr", null, r.map(c => h("td", null, c)))))))) : null,
    sec("w", (b.w || []).map(wordBox)),
    sec("f", (b.f || []).map(wordBox)),
    sec("c", (b.c || []).length ? h("div", {class: "rows grid2"}, b.c.map(c => line(c[1], c[2], c[3], "", c[4] ? null : c[0], c[4]))) : null),
    sec("e", (b.e || []).length ? h("div", {class: "rows grid2"}, b.e.map(e => line(e[0], e[1], e[2], "", null, e[3]))) : null),
    sec("pr", (b.pr || []).length ? h("div", {class: "pairs"}, b.pr.map(p => h("div", {class: "pair"}, p.flatMap((x, j) => j ? [h("i", null, "↔"), x] : [x])))) : null),
    sec("dl", dl.length ? [
      h("div", {class: "rows dlg"}, dl.map((d, n) => h("div", {class: "line", "data-say": d[1], "data-lo": d[2]}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), spk(), h("div", null, h("div", {class: "k ko"}, d[1]), d[4] ? h("div", {class: "p"}, d[4]) : null, h("div", {class: "m"}, d[2]), gloss(d[3])))))] : null),   // d[4]: Lao-script reading, as in the example sentences (RYU 2026-11-14)
    sec("sm", b.sm && b.sm.length ? h("div", {class: "tip"}, note(b.sm)) : null),
    sec("qz", (b.qz || []).map((q, n) => { const a = h("div", {class: "a", hidden: true}, q[1]);
      return h("div", {class: "qa"}, h("div", {class: "qq"}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), h("div", {class: "ko"}, q[0])), a, h("button", {class: "btn", type: "button", onclick: ev => { a.hidden = false; ev.currentTarget.remove(); }}, T.showAns)); })),
    h("div", {class: "rowbtns", style: "justify-content:space-between"},
      h("button", {class: "btn" + (isDone ? " good" : ""), type: "button", onclick: () => { if (isDone) delete S.done[b.code]; else S.done[b.code] = 1; save(); drawAll(); }}, isDone ? "✓ " + T.done : T.markDone),
      next ? h("button", {class: "btn primary", type: "button", onclick: () => go(next[0])}, T.next) : null)
  ];
}

/* a headword (word or expression) with its example sentences */
/* the headword inside an example sentence, underlined: the word itself, or the stem of a -다 word (가다 → 가),
   or for longer stems one syllable less (출근하다 → 출근 in 출근해요). Returns null when it is not found. */
function hlWord(sent, head){
  const base = head.replace(/\(.*?\)/g, "").replace(/[~\-]/g, "").trim(); if (!base) return null;
  const stem = base.replace(/다$/, ""), tries = [base, stem];
  if (stem.length >= 2) tries.push(stem.slice(0, -1));
  for (const t of tries){ if (!t) continue; const at = sent.indexOf(t);
    if (at >= 0) return [sent.slice(0, at), h("span", {class: "hw"}, t), sent.slice(at + t.length)]; }
  return null;
}
function wordBox(w){ const ex = w[3] || [];
  const head = line(w[0], w[1], w[2], "head");
  head.append(h("button", {class: "wrep", type: "button", title: T.repWord, onclick: ev => { ev.stopPropagation(); playWord(ev.currentTarget.closest(".word")); }}, ico("rep"), T.repWord));
  const cards = ex.map((e, n) => { const c = line(e[0], e[1], e[2], "ex", null, e[3]), body = c.children[1], k = body.querySelector(".k");
    const parts = hlWord(e[0], w[0]); if (parts) k.replaceChildren(...parts);
    c.prepend(h("div", {class: "exn", title: T.example + " " + (n + 1), "aria-label": T.example + " " + (n + 1)}, String(n + 1))); return c; });
  return h("div", {class: "word" + (ex.length ? "" : " solo")}, head, ex.length ? h("div", {class: "exs"}, cards) : null); }

/* ---------- cards ---------- */
function items(b){
  const out = [];
  (b.l || []).forEach((l, j) => out.push({id: b.code + "~l" + j, ko: l[0], pr: "", lo: l[1], say: l[2] || l[0]}));
  (b.w || []).forEach((w, j) => out.push({id: b.code + "~w" + j, ko: w[0], pr: w[1], lo: w[2]}));
  (b.f || []).forEach((w, j) => out.push({id: b.code + "~f" + j, ko: w[0], pr: w[1], lo: w[2]}));
  (b.c || []).forEach((c, j) => out.push({id: b.code + "~c" + j, ko: c[1], pr: c[2], lo: c[3]}));
  (b.e || []).forEach((e, j) => out.push({id: b.code + "~e" + j, ko: e[0], pr: e[1], lo: e[2]}));
  return out.filter(x => x.ko && x.lo);
}
/* word study like lao-app (RYU 2026-11-16, v1.69): every card of the lesson at once; Korean side = word and reading,
   Lao side = meaning and one example. Tap a card to repeat it (tap again to stop); the bar buttons go card by card. */
function flipCard(c, back){ c.classList.toggle("back", !!back); }
function cardItems(b){
  const ws = (b.l || []).map(l => ({ko: l[0], pr: "", hn: l[2] && l[2] !== l[0] ? l[2] : "", lo: l[1], say: l[2] || l[0]}))   // letters: sample syllables on the front, Lao letter on the back
    .concat((b.w || []).concat(b.f || []).map(w => ({ko: w[0], pr: w[1], lo: w[2], ex: (w[3] || [])[0], hn: w[4] || ""})));
  return (ws.length ? ws : items(b)).filter(x => x.ko && x.lo);
}
async function playCard(c){
  if (P.mode === "single" && c.classList.contains("now")) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "single"; P.paused = false;
  mark(c);
  const ko = c.dataset.say, lo = c.dataset.lo || "", withLo = lo && (loVoice || hasClip("lo", lo));
  for (let k = 1; tok === P.tok; k++){
    showPlayer("🔊 ∞ · " + k + " · " + ko);
    flipCard(c, false); if (!(await say(tok, ko))) return; await gap(300);
    if (withLo && k === 1){ flipCard(c, true); if (!(await say(tok, lo, true))) return; await gap(300); }
    else { flipCard(c, true); await gap(1200); if (tok !== P.tok) return; }
    await gap(200);
  }
}
function renderCards(b){
  const list = cardItems(b);
  if (!list.length) return [h("p", {class: "empty"}, T.noCards)];
  return [h("div", {class: "wcards"}, list.map(it => h("div", {class: "wcard", role: "button", tabindex: "0", "data-say": it.say || it.ko, "data-lo": it.lo, onclick: ev => playCard(ev.currentTarget)},
    h("span", {class: "spk", "aria-hidden": "true"}, ico("spk")),
    /* front: Korean word, short note; back: Lao-script reading, Lao meaning, Korean example, its Lao meaning (RYU 2026-11-16, v1.70) */
    h("div", {class: "fr"}, h("div", {class: "k ko" + (it.ko.length > 9 ? " xl" : it.ko.length > 6 ? " long" : "")}, it.ko), h("div", {class: "hn ko"}, it.hn || "")),
    h("div", {class: "bk"}, h("div", {class: "p"}, it.pr || ""), h("div", {class: "m"}, it.lo),
      it.ex ? [h("div", {class: "exk ko"}, it.ex[0]), h("div", {class: "exm"}, it.ex[2])] : null))))];
}

/* ---------- quiz: four choices built from the bundle's own words ---------- */
/* moving to the next question (or starting again) stops whatever the previous question was playing (RYU 2026-11-14) */
let quiz = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function makeQuiz(b){
  const own = items(b).filter(x => x.pr !== "" || x.ko.length > 1);
  const pool = (cache.get(areaOf(b.code)) || []).filter(o => subOf(o.code) === subOf(b.code) && o.code !== b.code).flatMap(items);
  if (own.length + pool.length < 4 || !own.length) return {code: b.code, qs: [], at: 0, right: 0};
  const qs = shuffle(own).slice(0, 10).map((it, n) => {
    const toLo = n % 2 === 0, key = toLo ? "lo" : "ko", seen = new Set([it[key]]), wrong = [];
    for (const o of shuffle(own.concat(pool))){ if (wrong.length === 3) break; if (!seen.has(o[key])){ seen.add(o[key]); wrong.push(o[key]); } }
    return {q: toLo ? it.ko : it.lo, say: toLo ? it.ko : "", toLo, a: it[key], opts: shuffle([it[key]].concat(wrong)), picked: null};
  });
  return {code: b.code, qs, at: 0, right: 0};
}
function renderQuiz(b){
  if (!quiz || quiz.code !== b.code) quiz = makeQuiz(b);
  if (!quiz.qs.length) return [h("p", {class: "empty"}, T.noQuiz)];
  if (quiz.at >= quiz.qs.length) return [h("p", {class: "quizp"}, T.score), h("div", {class: "score"}, quiz.right + " / " + quiz.qs.length),
    h("div", {class: "rowbtns", style: "justify-content:center"}, h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz = null; render(); }}, T.again))];
  const q = quiz.qs[quiz.at];
  return [h("div", null, h("div", {class: "quizq" + (q.toLo ? " ko" : "")}, q.q), h("p", {class: "quizp"}, (q.toLo ? T.pick : T.pickKo) + " · " + (quiz.at + 1) + " / " + quiz.qs.length)),
    q.say ? h("div", {class: "rowbtns", style: "justify-content:center", "data-say": q.say}, spk()) : null,
    h("div", {class: "choices"}, q.opts.map(o => h("button", {class: "choice" + (q.toLo ? "" : " ko") + (q.picked != null ? (o === q.a ? " right" : o === q.picked ? " wrong" : "") : ""), type: "button", disabled: q.picked != null,
      onclick: () => { q.picked = o; if (o === q.a) quiz.right++; render(); if (!q.toLo){ stopPlay(); const tok = ++P.tok; say(tok, q.a); } }}, o))),
    q.picked != null ? h("div", {class: "rowbtns", style: "justify-content:flex-end"}, h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz.at++; render(); }}, T.nextCard)) : null];
}

/* ---------- search ---------- */
let query = "";
function renderSearch(){
  const q = query.toLowerCase(), hits = [];
  for (const r of IDX) if (r[1].toLowerCase().includes(q) || (r[4] && r[4].includes(q))) hits.push({code: r[0], ko: r[1], lo: r[4] || "", pr: ""});
  for (const a of AREAS) for (const b of cache.get(a[0]) || []){
    for (const it of items(b)) if (it.ko.toLowerCase().includes(q) || it.lo.toLowerCase().includes(q) || (it.pr || "").includes(q)) hits.push({code: b.code, ko: it.ko, lo: it.lo, pr: it.pr});
    if (hits.length > 80) break;
  }
  const pending = AREAS.some(a => !cache.has(a[0]));
  if (!hits.length) return [h("p", {class: "empty"}, pending ? T.searching : T.noHit)];
  return [h("div", null, hits.slice(0, 80).map(x => h("button", {class: "hit", type: "button", onclick: () => { $("q").value = ""; query = ""; go(x.code); }},
    h("span", {class: "k ko"}, x.ko), h("span", {class: "where"}, (IDX[byCode.get(x.code)] || [])[1] || ""), h("span", null, x.lo || (SUBS[subOf(x.code)] || ["", ""])[1]))))];
}

/* ---------- render and routing ---------- */
function render(){
  const view = $("view");
  view.classList.toggle("hidepr", !!S.hidePr); view.classList.toggle("hidelo", !!S.hideLo && S.mode === "learn");
  if (query){ $("band").hidden = true; $("controls").hidden = true; view.replaceChildren(...renderSearch()); return; }
  $("band").hidden = false; $("controls").hidden = false;
  const b = bundle(S.code);
  drawBand(b);
  if (!b){ view.replaceChildren(h("p", {class: "empty"}, T.loading)); return; }
  /* the two repeat buttons sit in the control bar above its bottom line, learn tab only (RYU 2026-11-16, v1.67) */
  $("ctlrep").replaceChildren(...(S.mode !== "quiz" ? [
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(true)}, ico("rep"), T.repAll),
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(false)}, ico("rep"), T.repBundle)] : []));
  $("ctlrep").hidden = S.mode === "quiz";   // learn and word-card tabs (v1.67)
  const parts = S.mode === "cards" ? renderCards(b) : S.mode === "quiz" ? renderQuiz(b) : renderLearn(b);
  view.replaceChildren(...parts.flat().filter(Boolean));
  if (S.mode === "cards") fitWords();
}
/* word cards: a word that does not fit its line is shrunk until it does, so every word stays on one line at the same height */
function fitWords(){ document.querySelectorAll(".wcard .k").forEach(k => { let fs = parseFloat(getComputedStyle(k).fontSize);
  while (k.scrollWidth > k.clientWidth + 1 && fs > 11){ fs -= 1; k.style.fontSize = fs + "px"; } }); }
addEventListener("resize", () => { if (S.mode === "cards"){ document.querySelectorAll(".wcard .k").forEach(k => k.style.fontSize = ""); fitWords(); } });
function drawAll(){ drawStats(); drawGroups(); drawSubs(); drawControls(); render(); }
/* RYU 2026-11-14: coming back to an area or sub-group reopens the lesson last opened there */
function lastIn(m, k, rows){ const c = m && m[k]; return c && byCode.has(c) && c.startsWith(k + "-") ? c : rows[0][0]; }
function go(code){ if (!byCode.has(code)) return; if (location.hash === "#" + code) route(); else location.hash = code; }
async function route(){
  const name = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (byCode.has(name)) S.code = name;
  (S.lastA = S.lastA || {})[areaOf(S.code)] = S.code; (S.lastS = S.lastS || {})[subOf(S.code)] = S.code;
  if (P.nav) P.nav = false; else stopPlay();
  quiz = null; save(); drawAll();
  const a = areaOf(S.code);
  if (!cache.has(a)){
    try { await loadArea(a); } catch (e) { if (areaOf(S.code) === a) $("view").replaceChildren(h("p", {class: "empty"}, T.loadFail)); return; }
    if (areaOf(S.code) === a) render();
  }
}
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => { S.mode = b.dataset.mode; stopPlay(); save(); drawControls(); render(); }));
function ddClose(){ $("bselList").hidden = true; $("bselBtn").setAttribute("aria-expanded", "false"); }
$("bselBtn").addEventListener("click", () => {
  const l = $("bselList"), open = l.hidden;
  if (!open) return ddClose();
  l.hidden = false; $("bselBtn").setAttribute("aria-expanded", "true");
  const on = l.querySelector('[aria-selected="true"]'); if (on) l.scrollTop = on.offsetTop - l.clientHeight / 2 + on.offsetHeight / 2;
});
document.addEventListener("click", ev => { if (!ev.target.closest("#bsel")) ddClose(); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") ddClose(); });
$("repSel").addEventListener("change", ev => { S.rep = ev.target.value; save(); });
$("rateSel").addEventListener("change", ev => { S.rate = ev.target.value; save(); if (AEL) try { AEL.playbackRate = +S.rate || 1; } catch (e) {} });
$("pstop").addEventListener("click", stopPlay);
$("ppause").addEventListener("click", togglePause);
$("view").addEventListener("click", ev => {
  const m = ev.target.closest(".hidelo .m, .hidepr .p");
  if (m && !m.classList.contains("show")){ m.classList.add("show"); return; }
  /* a tap anywhere on a sentence or word box plays it on repeat; a second tap stops it */
  if (ev.target.closest("button, a, input, select, label")) return;
  const sel = window.getSelection && String(window.getSelection()); if (sel) return;
  const el = ev.target.closest(".line[data-say]"); if (!el) return;
  /* the word's own head line: same as its word-repeat button (word, then its sentences) (RYU 2026-11-16) */
  const word = el.dataset.head === "1" && el.closest(".word");
  if (word){ playWord(word); return; }
  playSingle(el);
});
let qTimer = 0;
$("q").addEventListener("input", ev => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    query = ev.target.value.trim(); render();
    if (query) Promise.all(AREAS.map(a => loadArea(a[0]).catch(() => null))).then(() => { if (query) render(); });
  }, 200);
});
/* ---------- audio download ----------
   one zip of every clip, built in the browser: area / bundle folders, files numbered in playing order.
   Each fetch also passes through the service worker, so the clips stay saved in the app for offline use. */
const allKeys = () => Object.keys(window.AUDIO_INDEX || {});
const fetchPool = async (items, n, work, tick) => { let i = 0, done = 0;
  await Promise.all(Array.from({length: n}, async () => { while (i < items.length){ const it = items[i++]; try { await work(it); } catch (e) {} tick(++done); } })); };
let dlBusy = false;
/* RYU 2026-11-16 (v1.77): no zip file any more (phones then ask which app should open it). The button saves every clip
   inside the app, in the same IndexedDB store the service worker answers from ("ko-audio" / "c"), so the app plays offline. */
let _adb;
const ADB = () => _adb || (_adb = new Promise((res, rej) => { const r = indexedDB.open("ko-audio", 1); r.onupgradeneeded = () => r.result.createObjectStore("c"); r.onsuccess = () => res(r.result); r.onerror = () => { _adb = null; rej(r.error); }; }));
const aHas = (db, k) => new Promise(res => { const q = db.transaction("c").objectStore("c").count(k); q.onsuccess = () => res(q.result > 0); q.onerror = () => res(false); });
const aPut = (db, k, v) => new Promise(res => { const tx = db.transaction("c", "readwrite"); tx.objectStore("c").put(v, k); tx.oncomplete = () => res(true); tx.onerror = tx.onabort = () => res(false); });
async function saveAll(ev){
  ev.preventDefault(); if (dlBusy) return; dlBusy = true; const msg = $("dlMsg");
  try {
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
    const db = await ADB(), keys = allKeys(); let bad = 0;
    await fetchPool(keys, 6, async k => { if (await aHas(db, k)) return;
      const r = await fetch("audio/" + k + ".mp3"); if (!r.ok){ bad++; return; } if (!(await aPut(db, k, await r.arrayBuffer()))) bad++; },
      d => { msg.textContent = Math.floor(d / keys.length * 100) + "% (" + d + " / " + keys.length + ")"; });
    if (bad) throw new Error("missing " + bad);
    S.offline = {n: keys.length, at: new Date().toISOString().slice(0, 10)}; save();
    dlState(); $("dlNote").hidden = false;
  } catch (e) { msg.textContent = "✗ ລອງໃໝ່ · 다시 눌러 주세요"; }
  dlBusy = false;
}
$("dlAll").addEventListener("click", saveAll);
if (!allKeys().length) $("dlbox").hidden = true;
/* after the link: whether this device already has the zip (RYU 2026-11-14). The mark is kept per device; when
   the app gains clips after that download, it asks for a new download instead */
function dlState(){
  const msg = $("dlMsg"), d = S.offline;   // the zip-era mark (dlDone) is not used: the clips must be in the app itself
  if (!d){ msg.textContent = ""; msg.className = "count"; return; }
  const fresh = d.n === allKeys().length;
  msg.textContent = fresh ? "✓ " + d.at : "↻ ມີສຽງໃໝ່";
  msg.className = "count " + (fresh ? "dlok" : "dlnew");
}
dlState();
window.addEventListener("hashchange", route);
$("ver").textContent = META.ver + " · ສ້າງດ້ວຍ Claude AI · Claude AI로 제작";
route();
if ("serviceWorker" in navigator && window.KO_SW) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
