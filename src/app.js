/* Korean for Lao learners. Data: META (areas, sub-groups, bundle index) is inlined; bundle bodies load per area from data/K?.json. */
(function(){
"use strict";
const META = window.KO_META, AREAS = META.areas, SUBS = META.subs, IDX = META.idx;
const byCode = new Map(IDX.map((r, i) => [r[0], i]));
const $ = id => document.getElementById(id);
const areaOf = c => c.slice(0, 2), subOf = c => c.slice(0, 4);
const T = {
  sec: {m: "ວິທີສ້າງປະໂຫຍກ", l: "ຕົວອັກສອນ", x: "ຕາຕະລາງ", w: "ຄຳສັບ", f: "ສຳນວນທີ່ໃຊ້ເລື້ອຍໆ", c: "ການປ່ຽນຮູບຄຳ", e: "ປະໂຫຍກຕົວຢ່າງ", tp: "ຂໍ້ແນະນຳ", pr: "ຄຳຄູ່", dl: "ບົດສົນທະນາ", sm: "ສະຫຼຸບ", rel: "ບົດທີ່ກ່ຽວຂ້ອງ", qz: "ຄຳຖາມທວນຄືນ"},
  level: "ລະດັບ", repBundle: "ຟັງບົດນີ້", repDlg: "ຊ້ຳບົດສົນທະນາ", repWord: "ຊ້ຳຄຳນີ້", repGroup: "ຊ້ຳກຸ່ມນີ້", example: "ຕົວຢ່າງ", repLetters: "ຟັງທຸກຕົວ", repAll: "ຟັງຕໍ່ເນື່ອງ", pause: "ຢຸດຊົ່ວຄາວ", resume: "ສືບຕໍ່", stop: "ຍົກເລີກ", hideLo: "ເຊື່ອງຄຳແປ", done: "ຮຽນຈົບແລ້ວ", markDone: "ໝາຍວ່າຮຽນຈົບແລ້ວ", next: "ບົດຕໍ່ໄປ →", prev: "← ກ່ອນໜ້າ", nextCard: "ຕໍ່ໄປ →",
  hidePr: "ເຊື່ອງຄຳອ່ານ", showKo: "ສະແດງຄຳອະທິບາຍພາສາເກົາຫຼີ", known: "ຈື່ແລ້ວ", flip: "ແຕະເພື່ອເບິ່ງຄວາມໝາຍ", onlyNew: "ສະເພາະຄຳທີ່ຍັງບໍ່ຈື່",
  showAns: "ເບິ່ງຄຳຕອບ", hideAns: "ເຊື່ອງຄຳຕອບ", again: "ເຮັດອີກຄັ້ງ", score: "ຄະແນນ", noCards: "ບົດນີ້ບໍ່ມີບັດຄຳ.", allKnown: "ຈື່ໝົດທຸກຄຳແລ້ວ!", noQuiz: "ບົດນີ້ມີຄຳສັບບໍ່ພໍສຳລັບແບບທົດສອບ.",
  pick: "ເລືອກຄວາມໝາຍທີ່ຖືກຕ້ອງ", pickKo: "ເລືອກຄຳພາສາເກົາຫຼີທີ່ຖືກຕ້ອງ", pickHeard: "ຟັງແລ້ວເລືອກຄຳທີ່ໄດ້ຍິນ", pickBlank: "ເລືອກຄຳທີ່ເຂົ້າໃນຊ່ອງຫວ່າງ", listenBtn: "ຟັງສຽງ", loading: "ກຳລັງໂຫຼດ…", loadFail: "ໂຫຼດບົດຮຽນບໍ່ໄດ້. ກະລຸນາເປີດໜ້ານີ້ຄືນໃໝ່.",
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
function markMode(){ const c = document.getElementById("ctlrep"); if (c) c.dataset.on = P.mode; }   // bar repeat button shown in reverse while it plays (v1.94)
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
function speakOne(text, lao, male){   // male: TOPIK listening lines of 남자 (own clips "km", RYU 2026-11-21)
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
    const key = clipKey(lao ? "lo" : male ? "km" : "ko", t);
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
/* keep the playing line in view, but move only when it leaves the middle of the screen (25-75%) or is cut off (lao-app v2.79, v2.30) */
function follow(el){
  const r = el.getBoundingClientRect(), pl = $("player"), ph = pl && !pl.hidden ? pl.getBoundingClientRect().height + 16 : 0, H = innerHeight - ph, c = r.top + r.height / 2;
  if (c < H * .25 || c > H * .75 || (r.top < 0 && r.height < H) || (r.bottom > H && r.height < H)) window.scrollBy({top: c - H * .25, behavior: "smooth"});   // land at ~25% so reading downward stays still until 75% (RYU 2026-11-22)
}
function mark(el){
  document.querySelectorAll(".now").forEach(x => x.classList.remove("now"));
  if (el && el.isConnected){ el.classList.add("now"); if (P.mode !== "single") follow(el); }
}
function showPlayer(text){
  $("player").hidden = !P.mode;
  const t = text || "", m = t.match(/^(🔊|🔁)\s*/);
  /* lesson number right after the speaker mark (RYU 2026-11-16, v1.74) */
  const on = t && byCode.has(S.code) ? "[" + ordParts(S.code).join("") + "] " : "";
  $("pt").replaceChildren(...(m ? [ico(m[1] === "🔊" ? "spk" : "rep"), on + t.slice(m[0].length)] : [on + t]));
  $("ppause").replaceChildren(ico(P.paused ? "play" : "pause"), h("span", {class: "bt"}, P.paused ? T.resume : T.pause));   // same kind of mark on all three (RYU 2026-11-16)
  msSync(on + t.replace(/^(🔊|🔁)\s*/, ""));
}
/* phone lock screen / headset buttons: pause, resume, stop, next and previous line (like lao-app, RYU 2026-11-18, v1.80) */
function msSync(title){
  const ms = navigator.mediaSession; if (!ms) return;
  try {
    if (!P.mode){ ms.playbackState = "none"; ms.metadata = null; return; }
    if (window.MediaMetadata) ms.metadata = new MediaMetadata({title: title || "KOR Lang", artist: "KOR Lang", album: (IDX[byCode.get(S.code)] || [])[1] || ""});
    ms.playbackState = P.paused ? "paused" : "playing";
    if (!msSync.done){ msSync.done = true;
      ms.setActionHandler("pause", () => { if (P.mode && !P.paused) togglePause(); });
      ms.setActionHandler("play", () => { if (P.mode && P.paused) togglePause(); });
      try { ms.setActionHandler("stop", () => stopPlay()); } catch (e) {}
      const jump = d => skipBy(d);
      try { ms.setActionHandler("nexttrack", () => jump(1)); } catch (e) {}
      try { ms.setActionHandler("previoustrack", () => jump(-1)); } catch (e) {}
    }
  } catch (e) {}
}
/* previous / next line during a repeat (lock screen, ← →); a single 🔊 loop has nothing to move to */
function skipBy(d){ if (!P.mode || P.mode === "single") return; P.hold = false; P.skip = d; if (P.paused) togglePause(); quiet(); }
async function hold(tok){ while (P.paused && tok === P.tok) await gap(150); return tok === P.tok; }
/* says one piece; if paused in the middle, says it again after resuming */
async function say(tok, text, lao, male){
  for (;;){
    if (!(await hold(tok))) return false;
    await speakOne(text, lao, male);
    if (tok !== P.tok || P.skip) return false;
    if (!P.paused) return true;
  }
}
async function sayItem(tok, it, label, noLo){
  const n = +S.rep || 1;
  mark(it.el);
  
  showPlayer(label + " · " + it.ko);
  let st = 0; const face = () => { if (it.card) flipCard(it.card, st++ % 2 === 1); };   // word cards: odd plays Korean side, even plays Lao side (RYU 2026-11-16)
  /* Korean as many times as the count box says, with Lao once right after the first Korean (RYU 2026-11-19, v2.14) */
  const withLo = !noLo && S.sayLo !== false && it.lo && (loVoice || hasClip("lo", it.lo));   // K turns the Lao voice off (v2.25)
  P.held = false;
  for (let k = 0; k < n || P.hold; k++){
    if (P.hold) P.held = true;
    showPlayer(label + " · " + (P.hold ? "∞ " + (k + 1) : (k + 1) + "/" + n) + " · " + it.ko);   // Enter: this item over and over (∞) until Enter again (RYU 2026-11-20, v2.23)
    face(); if (!(await say(tok, it.ko))) return false; await gap(k === 0 && withLo ? 300 : 250);   // the same line again: short pause (v2.25)
    if (k === 0 && withLo){ face(); if (!(await say(tok, it.lo, true))) return false; await gap(300); }
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
  const tok = ++P.tok; P.mode = "single"; markMode(); P.paused = false;
  mark(el);
  const ko = el.dataset.say, lo = el.dataset.lo || "";
  const withLo = S.sayLo !== false && lo && (loVoice || hasClip("lo", lo));   // word or sentence: Korean, Lao once, then Korean over and over (RYU 2026-11-16)   // a headword: Korean, Lao, then Korean over and over
  for (let k = 1; tok === P.tok; k++){
    showPlayer("🔊 ∞ · " + k + " · " + ko);
    if (!(await say(tok, ko))) return;
    if (withLo && k === 1){ await gap(300); if (!(await say(tok, lo, true))) return; }
    await gap(500);
  }
}
async function playBundle(chain){
  if (P.mode === (chain ? "chain" : "bundle")) return stopPlay();   // same button again stops it (RYU 2026-11-19, v2.15)
  stopPlay();
  const tok = ++P.tok; P.mode = chain ? "chain" : "bundle"; markMode(); P.paused = false; P.round = 1;
  /* in the word-card tab the same two buttons go card by card, showing each card with its meaning (RYU 2026-11-16, v1.67) */
  const cards = S.mode === "cards";
  for (;;){
    const q = cards ? [...document.querySelectorAll("#view .wcard")].map(c => ({el: c, card: c, ko: c.dataset.say, lo: c.dataset.lo || ""})) : queue();
    if (!q.length && !chain) return stopPlay();
    for (let i = 0; i < q.length; i++){
      const label = chain ? "🔁 " + (i + 1) + "/" + q.length : "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round;
      if (!(await sayItem(tok, q[i], label))){
        /* lock-screen next / previous: jump within the lesson (v1.80) */
        if (tok === P.tok && P.skip){ const d = P.skip; P.skip = 0; i = Math.max(-1, i + d - 1); if (cards) document.querySelectorAll(".wcard.back").forEach(c => c.classList.remove("back")); continue; }
        return;
      }
    }
    if (chain){
      let ni = byCode.get(S.code); do ni = (ni + 1) % IDX.length; while (IDX[ni][3] === "info"); const next = IDX[ni][0];   // info pages skipped
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
  const tok = ++P.tok; P.mode = "word"; markMode(); P.box = box; P.paused = false; P.round = 1;
  box.classList.add("playing");
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")].map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
    for (let i = 0; i < q.length; i++) if (!(await sayItem(tok, q[i], "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round, P.round > 1))){
      if (tok === P.tok && P.skip){ i = Math.max(-1, i + P.skip - 1); P.skip = 0; continue; }
      box.classList.remove("playing"); return; }
    P.round++; await gap(400);
    if (tok !== P.tok){ box.classList.remove("playing"); return; }
  }
}
/* dialogue repeat: each dialogue line S.rep times, in order, round and round until stopped */
async function playDialogue(box){
  if (P.mode === "dialog") return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "dialog"; markMode(); P.paused = false; P.round = 1;
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")];
    if (!q.length) return stopPlay();
    for (let i = 0; i < q.length; i++){
      if (!(await sayItem(tok, {el: q[i], ko: q[i].dataset.say}, "🔊 " + (i + 1) + "/" + q.length + " · ↻" + P.round))){
        if (tok === P.tok && P.skip){ i = Math.max(-1, i + P.skip - 1); P.skip = 0; continue; } return; }
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
  const tok = ++P.tok; P.mode = "sents"; markMode(); P.box = box; P.paused = false; P.round = 1;
  box.classList.add("playing");
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")].map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
    if (!q.length) return stopPlay();
    for (let i = 0; i < q.length; i++)
      if (!(await sayItem(tok, q[i], "🔁 " + (i + 1) + "/" + q.length + " · ↻" + P.round))){
        if (tok === P.tok && P.skip){ i = Math.max(-1, i + P.skip - 1); P.skip = 0; continue; } return; }
    P.round++; await gap(600);
    if (tok !== P.tok) return;
  }
}
function stopPlay(){
  P.tok++; P.skip = 0; P.hold = false; P.mode = ""; markMode(); P.paused = false; if (P.box){ P.box.classList.remove("playing"); P.box = null; }
  quiet();
  mark(null); showPlayer(""); document.querySelectorAll(".wcard.back").forEach(c => c.classList.remove("back"));
}
function togglePause(){
  if (!P.mode) return;
  P.paused = !P.paused;
  if (P.paused) quiet();
  $("ppause").replaceChildren(ico(P.paused ? "play" : "pause"), h("span", {class: "bt"}, P.paused ? T.resume : T.pause));   // same kind of mark on all three (RYU 2026-11-16)
  try { if (navigator.mediaSession) navigator.mediaSession.playbackState = P.paused ? "paused" : "playing"; } catch (e) {}
}
const spk = () => h("button", {class: "spk", type: "button", "aria-label": "ຟັງ", onclick: ev => { const el = ev.currentTarget.closest("[data-say]"); if (el) playSingle(el); }}, ico("spk"));

/* ---------- chrome ---------- */
function drawStats(){
  const n = x => Number(x).toLocaleString("en-US");
  $("stats").replaceChildren(h("span", null, h("b", null, n(IDX.filter(r => r[3] !== "info").length)), T.lessons), h("span", null, h("b", null, n(META.nWords)), T.words), h("span", null, h("b", null, n(META.nSents)), T.sents));
}
/* areas: lesson count after the Korean name; subs: "N ບົດ · N ຄຳ" on its own line (RYU 2026-11-15) */
const cnt = rows => { const w = rows.reduce((t, r) => t + (r[5] || 0), 0); return rows.length + " " + T.lessons + (w ? " · " + w + " " + T.wordsShort : ""); };
function drawGroups(){
  const cur = areaOf(S.code);
  $("app").setAttribute("data-g", cur);
  $("groups").replaceChildren(...AREAS.map(a => {
    const rows = IDX.filter(r => r[0].startsWith(a[0] + "-"));
    return h("button", {class: "group", type: "button", "data-g": a[0], "aria-pressed": a[0] === cur ? "true" : "false", onclick: () => go(lastIn(S.lastA, a[0], rows))},
      h("span", {class: "gn ko"}, a[1].replace(/\s+/g, "")));   // menus in Korean, no spaces, like lao-app (RYU 2026-11-19, v2.13)
  }));
  const on = $("groups").querySelector('[aria-pressed="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
function drawSubs(){
  const a = areaOf(S.code), cur = subOf(S.code);
  const ids = [...new Set(IDX.filter(r => r[0].startsWith(a + "-")).map(r => subOf(r[0])))];
  $("subs").replaceChildren(...ids.map(s => {
    const rows = IDX.filter(r => r[0].startsWith(s + "-")), n = SUBS[s] || [s, s];
    return h("button", {class: "sub", type: "button", role: "tab", "aria-selected": s === cur ? "true" : "false", onclick: () => go(lastIn(S.lastS, s, rows))},
      h("span", {class: "code"}, String(ids.indexOf(s) + 1).padStart(2, "0")), h("span", {class: "name ko"}, n[0].replace(/\s+/g, "")));
  }));
  /* line under the sub tabs, like lao-app: [1-01] name · N묶음 N단어 N문장 */
  const sr = IDX.filter(r => r[0].startsWith(cur + "-")), ai = AREAS.findIndex(x => x[0] === a) + 1, sn = SUBS[cur] || [cur];
  $("sinfo").replaceChildren(h("b", {class: "ko"}, "[" + ai + "-" + String(ids.indexOf(cur) + 1).padStart(2, "0") + "]"), h("span", {class: "ko"}, " " + sn[0] + " · " + sr.length + "묶음" + (sr[0] && sr[0][3] === "info" ? "" : " " + sr.reduce((t, r) => t + (r[5] || 0), 0) + "단어 " + sr.reduce((t, r) => t + (r[6] || 0), 0) + "문장")));
  const on = $("subs").querySelector('[aria-selected="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
/* lesson order number in app order: ["7-01-", "02"] for [7-01-02] */
const ordTag = code => { const [o, l] = ordParts(code); return ["[", h("span", {class: "ord-ab"}, o), l + "]"]; };   // phones show only [01] (RYU 2026-11-19, v2.04)
function ordParts(code){
  const a = areaOf(code), sb = subOf(code), subsA = [...new Set(IDX.filter(r => r[0].startsWith(a + "-")).map(r => subOf(r[0])))];
  const rows = IDX.filter(r => r[0].startsWith(sb + "-")), pad = n => String(n).padStart(2, "0");
  return [(AREAS.findIndex(x => x[0] === a) + 1) + "-" + pad(subsA.indexOf(sb) + 1) + "-", pad(rows.findIndex(r => r[0] === code) + 1)];
}
function drawControls(){
  const s = subOf(S.code), rows = IDX.filter(r => r[0].startsWith(s + "-"));
  /* lesson picker: own list instead of the phone's native one, so each lesson stays on one line inside the box (RYU 2026-11-14) */
  const lab = (r, btn) => [h("span", {class: "ddk"}, r[1])   /* no check mark in the list either (RYU 2026-11-19, v2.06) */, r[4] ? h("span", {class: "ddo"}, r[4]) : ""];
  const curRow = rows.find(r => r[0] === S.code) || rows[0];
  /* order number [area-sub-lesson] in app order in front of the chosen lesson (RYU 2026-11-16, v1.70) */
  const [ord, last] = ordParts(curRow[0]);
  /* PC and tablet: [7-01-01]; phone: only the lesson number [01], so the name is not cut (RYU 2026-11-16, v1.72) */
  $("bselBtn").replaceChildren(h("span", {class: "ddn ko"}, "[", h("span", {class: "ddn-ab"}, ord), last + "]"), ...lab(curRow, true));   // check mark dropped (RYU 2026-11-16, v1.71)   // check in front of the chosen lesson on the main screen, not in the list (RYU 2026-11-15)
  $("bselList").replaceChildren(...rows.map(r => h("button", {type: "button", class: "ddi", role: "option", "aria-selected": r[0] === S.code ? "true" : "false", onclick: () => { ddClose(); go(r[0]); }}, h("span", {class: "ddn ko"}, "[" + ordParts(r[0])[1] + "]"), ...lab(r))));   // [01] in front of each lesson in the list (RYU 2026-11-19, v2.06)
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
  : null), kids) : null;   // 단어 / 자주 쓰는 표현 group repeat button removed, title and line stay (RYU 2026-11-22, v2.33)
const note = pair => [h("p", {class: "note-lo"}, pair[1] || pair[0]), S.showKo && pair[1] ? h("p", {class: "note-ko ko"}, pair[0]) : null];
/* ※ key words of a sentence: [[word, Lao-script reading, Lao meaning], …] */
const gloss = g => g && g.length ? h("div", {class: "gl"}, "※ ", g.flatMap((x, j) => [j ? " · " : null, h("span", {class: "ko"}, x[0]), " ", h("span", {class: "p"}, x[1]), " (", h("span", {class: "gm"}, x[2]), ")"])) : null;
/* base form of a conjugation row ("저 ຂ້ອຍ"), shown at the bottom like the ※ notes */
const fromNote = f => { if (!f) return null; const m = f.match(/^([가-힣\s?!.~\-\/]*[가-힣?!.~])\s*(.*)$/);
  return h("div", {class: "gl"}, "※ ", h("span", {class: "ko"}, m ? m[1] : f), m && m[2] ? [" (", h("span", {class: "gm"}, m[2]), ")"] : null); };
const line = (ko, pr, lo, cls, from, g) => h("div", {class: "line " + (cls || ""), "data-say": ko, "data-lo": lo, "data-head": cls === "head" ? "1" : null}, spk(),
  h("div", null, h("div", {class: "k ko"}, ko), pr ? h("div", {class: "p"}, pr) : null, h("div", {class: "m"}, lo), gloss(g), fromNote(from)));
/* previous / next lesson buttons at the bottom (RYU 2026-11-19, v2.02) */
function pnRow(code){
  const i = byCode.get(code), next = IDX[i + 1], prev = i > 0 ? IDX[i - 1] : null;
  return h("div", {class: "pnrow"},
    prev ? h("button", {class: "pn pv", type: "button", onclick: () => go(prev[0])}, h("b", null, h("kbd", {class: "kc"}, "<"), "← ບົດກ່ອນ ", h("span", {class: "ko"}, "이전 묶음")), h("small", {class: "ko"}, ...ordTag(prev[0]), " " + prev[1])) : h("span"),
    next ? h("button", {class: "pn nx", type: "button", onclick: () => go(next[0])}, h("b", null, "ບົດຕໍ່ໄປ ", h("span", {class: "ko"}, "다음 묶음"), " →", h("kbd", {class: "kc"}, ">")), h("small", {class: "ko"}, ...ordTag(next[0]), " " + next[1])) : h("span"));
}
function renderLearn(b){
  const i = byCode.get(b.code), next = IDX[i + 1], prev = i > 0 ? IDX[i - 1] : null, isDone = !!S.done[b.code];
  const dl = b.dl || [];
  return [
    sec("m", (b.m || []).map(m => h("div", {class: "tip"}, note(m)))),
    /* letters (ຕົວອັກສອນ) section dropped from the sentence tab: the letters are studied in the word tab (RYU 2026-11-16, v1.75) */
    b.x && b.x.length > 1 ? sec("x", h("div", {class: "tablewrap"}, h("table", null,
      h("thead", null, h("tr", null, b.x[0].map(c => h("th", {class: "ko"}, c)))),
      h("tbody", null, b.x.slice(1).map(r => h("tr", null, r.map(c => h("td", null, c)))))))) : null,
    /* expression lessons show their expressions first, so 1-01-01 opens with 안녕하세요? (RYU 2026-11-18, v1.85) */
    ...(b.type === "표현" ? [sec("f", (b.f || []).map(wordBox)), sec("w", (b.w || []).map(wordBox))] : [sec("w", (b.w || []).map(wordBox)), sec("f", (b.f || []).map(wordBox))]),
    sec("c", (b.c || []).length ? h("div", {class: "rows grid2"}, b.c.map(c => line(c[1], c[2], c[3], "", c[4] ? null : c[0], c[4]))) : null),
    sec("e", (b.e || []).length ? h("div", {class: "rows grid2"}, b.e.map(e => line(e[0], e[1], e[2], "", null, e[3]))) : null),
    sec("pr", (b.pr || []).length ? h("div", {class: "pairs"}, b.pr.map(p => h("div", {class: "pair"}, p.flatMap((x, j) => j ? [h("i", null, "↔"), x] : [x])))) : null),
    sec("dl", dl.length ? [
      h("div", {class: "rows dlg"}, dl.map((d, n) => h("div", {class: "line", "data-say": d[1], "data-lo": d[2]}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), spk(), h("div", null, h("div", {class: "k ko"}, d[1]), d[4] ? h("div", {class: "p"}, d[4]) : null, h("div", {class: "m"}, d[2]), gloss(d[3])))))] : null),   // d[4]: Lao-script reading, as in the example sentences (RYU 2026-11-14)
    sec("sm", b.sm && b.sm.length ? h("div", {class: "tip"}, note(b.sm)) : null),
    sec("qz", (b.qz || []).map((q, n) => { const a = h("div", {class: "a", hidden: true}, q[1]);
      return h("div", {class: "qa"}, h("div", {class: "qq"}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), h("div", {class: "ko"}, q[0])), h("div", {class: "qr"}, a, h("button", {class: "btn", type: "button", onclick: ev => { a.hidden = !a.hidden; ev.currentTarget.textContent = a.hidden ? T.showAns : T.hideAns; }}, T.showAns))); })),   // tap again hides the answer (v1.80)
    /* related lessons, like lao-app (RYU 2026-11-18, v1.80): lessons that use this lesson's words; tap to go there */
    /* related lessons box and prev / next buttons, in the shape RYU showed (2026-11-19, v2.02) */
    (() => { const rel = (META.rel && META.rel[b.code] || []).filter(k => byCode.has(k)); if (!rel.length) return null;
      return h("div", {class: "relbox"}, h("div", {class: "relhd"}, T.sec.rel, h("span", {class: "ko"}, " 관련 묶음")),
        rel.map(k => { const r = IDX[byCode.get(k)];
          return h("button", {class: "relrow", type: "button", onclick: () => go(k)}, h("span", {class: "rc ko"}, ...ordTag(k)), h("span", {class: "ko"}, r[1]), r[4] ? h("span", {class: "ddo"}, r[4]) : null); })); })(),
    pnRow(b.code)
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
    c.prepend(h("div", {class: "exn", title: T.example + " " + (n + 1), "aria-label": T.example + " " + (n + 1)}, String(n + 1)));
    return c; });
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
function flipCard(c, back){ if (c) c.classList.toggle("back", !!back); }
function cardItems(b){
  const ws = (b.l || []).map(l => ({ko: l[0], pr: "", hn: l[2] && l[2] !== l[0] ? l[2] : "", lo: l[1], say: l[2] || l[0]}))   // letters: sample syllables on the front, Lao letter on the back
    .concat((b.type === "표현" ? (b.f || []).concat(b.w || []) : (b.w || []).concat(b.f || [])).map(w => ({ko: w[0], pr: w[1], lo: w[2], ex: (w[3] || [])[0], hn: w[4] || ""})));
  return (ws.length ? ws : items(b)).filter(x => x.ko && x.lo);
}
async function playCard(c){
  if (P.mode === "single" && c.classList.contains("now")) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "single"; markMode(); P.paused = false;
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
  if (!list.length) return [h("p", {class: "empty"}, T.noCards), pnRow(b.code)];
  return [h("div", {class: "wcards"}, list.map(it => h("div", {class: "wcard", role: "button", tabindex: "0", "data-say": it.say || it.ko, "data-lo": it.lo, onclick: ev => playCard(ev.currentTarget)},
    h("span", {class: "spk", "aria-hidden": "true"}, ico("spk")),
    /* front: Korean word, short note; back: Lao-script reading, Lao meaning, Korean example, its Lao meaning (RYU 2026-11-16, v1.70) */
    h("div", {class: "fr"}, h("div", {class: "k ko" + (it.ko.length > 9 ? " xl" : it.ko.length > 6 ? " long" : "")}, it.ko), it.pr ? h("div", {class: "fp"}, it.pr) : null, h("div", {class: "hn ko"}, it.hn || "")),   // Lao-script reading on the front too (RYU 2026-11-18, v1.89)
    h("div", {class: "bk"}, h("div", {class: "p"}, it.pr || ""), h("div", {class: "m"}, it.lo),
      it.ex ? [h("div", {class: "exk ko"}, it.ex[0]), h("div", {class: "exm"}, it.ex[2])] : null)))),
    pnRow(b.code)];   // prev / next lesson at the bottom, as on the sentence tab (RYU 2026-11-21, v2.26; Space on the key line v2.27)
}

/* ---------- quiz: four choices built from the bundle's own words ---------- */
/* moving to the next question (or starting again) stops whatever the previous question was playing (RYU 2026-11-14) */
let quiz = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function makeQuiz(b){
  const own = items(b).filter(x => x.pr !== "" || x.ko.length > 1);
  const pool = (cache.get(areaOf(b.code)) || []).filter(o => subOf(o.code) === subOf(b.code) && o.code !== b.code).flatMap(items);
  if (own.length + pool.length < 4 || !own.length) return {code: b.code, qs: [], at: 0, right: 0};
  /* four kinds in turn, like lao-app (RYU 2026-11-18, v1.80): meaning, Korean word, listen and pick, fill the blank in an example */
  const exOf = new Map(); [].concat(b.w || [], b.f || []).forEach(w => { if ((w[3] || []).length) exOf.set(w[0], w[3]); });
  const canHear = it => !!(window.speechSynthesis || hasClip("ko", it.ko));
  const qs = shuffle(own).slice(0, 10).map((it, n) => {
    let kind = ["mean", "ko", "listen", "blank"][n % 4], blank = null;
    if (kind === "listen" && !canHear(it)) kind = "ko";
    if (kind === "blank"){ const e = shuffle(exOf.get(it.ko) || []).find(e => e[0].includes(it.ko));
      if (e){ const at = e[0].indexOf(it.ko); blank = {pre: e[0].slice(0, at), post: e[0].slice(at + it.ko.length), lo: e[2], full: e[0]}; } else kind = "mean"; }
    const toLo = kind === "mean", key = toLo ? "lo" : "ko", seen = new Set([it[key]]), wrong = [];
    for (const o of shuffle(own.concat(pool))){ if (wrong.length === 3) break; if (!seen.has(o[key])){ seen.add(o[key]); wrong.push(o[key]); } }
    return {kind, q: kind === "mean" ? it.ko : kind === "ko" ? it.lo : "", blank, say: kind === "mean" || kind === "listen" ? it.ko : blank ? blank.full : "", toLo, a: it[key], opts: shuffle([it[key]].concat(wrong)), picked: null};
  });
  return {code: b.code, qs, at: 0, right: 0};
}
function renderQuiz(b){
  if (!quiz || quiz.code !== b.code) quiz = makeQuiz(b);
  if (!quiz.qs.length) return [h("p", {class: "empty"}, T.noQuiz)];
  if (quiz.at >= quiz.qs.length) return [h("p", {class: "quizp"}, T.score), h("div", {class: "score"}, quiz.right + " / " + quiz.qs.length),
    h("div", {class: "rowbtns", style: "justify-content:center"}, h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz = null; render(); }}, T.again))];
  const q = quiz.qs[quiz.at];
  const head = q.kind === "listen" ? h("div", {class: "quizq listen", "data-say": q.say}, h("button", {class: "btn primary", type: "button", onclick: ev => playSingle(ev.currentTarget.parentNode)}, ico("spk"), " " + T.listenBtn))
    : q.kind === "blank" ? h("div", {class: "quizq qblank"}, h("div", {class: "ko"}, q.blank.pre, h("span", {class: "blank"}, "?"), q.blank.post), h("div", {class: "qlo"}, q.blank.lo))
    : h("div", {class: "quizq" + (q.toLo ? " ko" : "")}, q.q);
  const lab = {mean: T.pick, ko: T.pickKo, listen: T.pickHeard, blank: T.pickBlank}[q.kind];
  return [h("div", null, head, h("p", {class: "quizp"}, lab + " · " + (quiz.at + 1) + " / " + quiz.qs.length)),
    q.say && q.kind === "mean" || q.picked != null && q.say ? h("div", {class: "rowbtns", style: "justify-content:center", "data-say": q.say}, spk()) : null,
    h("div", {class: "choices"}, q.opts.map(o => h("button", {class: "choice" + (q.toLo ? "" : " ko") + (q.picked != null ? (o === q.a ? " right" : o === q.picked ? " wrong" : "") : ""), type: "button", disabled: q.picked != null,
      onclick: () => { q.picked = o; if (o === q.a) quiz.right++; render(); if (!q.toLo){ stopPlay(); const tok = ++P.tok; say(tok, q.kind === "blank" ? q.blank.full : q.a); } }}, o))),
    q.picked != null ? h("div", {class: "rowbtns", style: "justify-content:flex-end"}, h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz.at++; render(); const nq = quiz.qs[quiz.at], el = document.querySelector(".quizq.listen"); if (nq && nq.kind === "listen" && el) playSingle(el); }}, T.nextCard)) : null];
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
  /* 대한민국 pages: the page itself and the prev / next buttons; no play controls (RYU 2026-11-20, v2.19) */
  if (b.info){ $("controls").hidden = true; $("ctlrep").hidden = true;
    const art = h("article", {class: "info"}); art.innerHTML = b.info;
    view.replaceChildren(art, b.tq ? tqView(b) : "", pnRow(b.code)); return; }
  /* the two repeat buttons sit in the control bar above its bottom line, learn tab only (RYU 2026-11-16, v1.67) */
  $("ctlrep").replaceChildren(...(S.mode !== "quiz" ? [
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(true)}, ico("rep"), T.repAll, h("kbd", {class: "kc"}, "C")),
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(false)}, ico("rep"), T.repBundle, h("kbd", {class: "kc"}, "G"))] : []));   // key badges, PC and pad only (v2.25)
  $("kbinfo").hidden = S.mode === "quiz";
  $("ctlrep").hidden = S.mode === "quiz";   // learn and word-card tabs (v1.67)
  const parts = S.mode === "cards" ? renderCards(b) : S.mode === "quiz" ? renderQuiz(b) : renderLearn(b);
  view.replaceChildren(...parts.flat().filter(Boolean));
  if (S.mode === "cards") fitWords();
}
/* TOPIK practice questions (RYU 2026-11-21, v2.24): direction (Korean, then Lao), listen button or text to read,
   four choices; a pick shows right / wrong, the script of a listening question and the Lao explanation */
const TQ = {}, NUM = "①②③④", WHO = {m: "남자: ", f: "여자: ", n: ""};
/* v2.34: a set (one script or text, two or more questions) shows the script or text once; a score line counts the answers on this page */
const tqList = b => b.tq.flatMap((q, i) => q.qs ? q.qs.map((s, j) => [b.code + "#" + i + "." + j, s]) : [[b.code + "#" + i, q]]);
function tqScore(b){ const L = tqList(b), done = L.filter(([k]) => TQ[k] != null), ok = done.filter(([k, q]) => TQ[k] === q.a).length;
  return done.length ? "ຖືກ " + ok + " / " + done.length + " (ທັງໝົດ " + L.length + " ຂໍ້)" : "ທັງໝົດ " + L.length + " ຂໍ້"; }
function tqView(b){
  const sc = h("div", {class: "tqsc"}, tqScore(b));
  return h("section", {class: "tq"}, h("h3", null, "ລອງເຮັດຂໍ້ສອບ ", h("span", {class: "ko"}, "연습 문제")), b.tq.map((q, i) => tqItem(b, q, i, () => sc.textContent = tqScore(b))), sc,
    h("div", {class: "rowbtns", style: "justify-content:center"}, h("button", {class: "btn", type: "button", onclick: () => { tqList(b).forEach(([k]) => delete TQ[k]); render(); }}, "ເລີ່ມໃໝ່ທັງໝົດ ", h("span", {class: "ko"}, "처음부터"))));
}
const tqScript = au => h("div", {class: "tqs ko"}, au.map(l => h("div", null, WHO[l[0]] ? h("b", null, WHO[l[0]]) : null, l[1])));
function tqChoices(q, k, redo){ const st = TQ[k];
  return [h("div", {class: "choices tqo" + (q.o.length < 3 ? " two" : "")}, q.o.map((o, j) => h("button", {class: "choice" + (q.lo ? "" : " ko") + (st != null ? (j === q.a ? " right" : j === st ? " wrong" : "") : ""), type: "button", disabled: st != null,
      onclick: () => { TQ[k] = j; redo(); }}, h("span", {class: "n"}, NUM[j]), " " + o))),
    st != null ? h("div", {class: "tqx"}, h("div", {class: "res " + (st === q.a ? "ok" : "no")}, st === q.a ? "✓ ຖືກ" : "✗ ຍັງບໍ່ຖືກ · ຄຳຕອບ " + NUM[q.a]), h("p", null, koMix(q.x)),
      h("button", {class: "btn", type: "button", onclick: () => { delete TQ[k]; redo(); }}, "ລອງໃໝ່ ", h("span", {class: "ko"}, "다시"))) : null]; }
function tqItem(b, q, i, upd){
  const k = b.code + "#" + i, redo = () => { el.replaceWith(tqItem(b, q, i, upd)); upd(); };
  const answered = q.qs ? q.qs.some((s, j) => TQ[k + "." + j] != null) : TQ[k] != null;
  const el = h("div", {class: "tqi" + (q.qs ? " set" : "")},
    h("div", {class: "tqd"}, h("b", null, (i + 1) + ". "), h("span", {class: "ko"}, q.d)),
    q.dl ? h("div", {class: "tqdl"}, q.dl) : null,
    q.au ? h("div", {class: "tqa"}, h("button", {class: "wrep tbtn tqplay", type: "button", onclick: ev => tqPlay(q, ev.currentTarget)}, ico("spk"), "ຟັງ ", h("span", {class: "ko"}, "듣기"))) : null,
    q.p ? (() => { const d = h("div", {class: "tqp ko"}); d.innerHTML = q.p; return d; })() : null,
    q.au && answered ? h("details", {class: "tqsd"}, h("summary", null, "ເບິ່ງບົດ ", h("span", {class: "ko"}, "대본")), tqScript(q.au)) : null,
    q.qs ? q.qs.map((s, j) => h("div", {class: "tqsub"}, h("div", {class: "tqq ko"}, h("b", null, "(" + (j + 1) + ") "), s.q), ...tqChoices(s, k + "." + j, redo))) : tqChoices(q, k, redo));
  return el;
}
/* the script once, line by line (남자 in a man's voice); the same button stops it */
async function tqPlay(q, btn){
  if (P.mode === "tq" && P.box === btn) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "tq"; P.box = btn; P.paused = false; btn.classList.add("playing");
  for (const [who, line] of q.au){
    showPlayer("🔊 " + WHO[who] + line);
    if (!(await say(tok, line, false, who === "m"))) return;
    await gap(500);
  }
  if (tok === P.tok) stopPlay();
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
/* ---------- keyboard (same keys as lao-app v2.74, RYU 2026-11-20, v2.23) ----------
   Space pause / resume (idle: 묶음 재생) · C 연속 재생 · G 묶음 재생 (again = stop) · Esc stop · ← → previous / next line
   , . previous / next lesson · Enter this line without end (∞) · 1-5 횟수 · - = 속도 · Q W E tabs · ? list of keys.
   Keys go by e.code too, so they work with the Korean or Lao keyboard on; ↑ ↓ still scroll. */
const KEYS = [["Space", "ຢຸດຊົ່ວຄາວ · ສືບຕໍ່ (ບໍ່ມີສຽງ: ຟັງບົດນີ້)", "일시정지 · 재개"], ["C", "ຟັງຕໍ່ເນື່ອງ", "연속 재생"], ["G", "ຟັງບົດນີ້", "묶음 재생"],
  ["Esc", "ຍົກເລີກ", "정지"], ["← →", "ປະໂຫຍກກ່ອນ · ຕໍ່ໄປ", "이전 · 다음 문장"], ["< >  (, .)", "ບົດກ່ອນ · ບົດຕໍ່ໄປ", "이전 · 다음 묶음"],
  ["Enter", "ຊ້ຳອັນນີ້ບໍ່ຢຸດ · ປິດ", "지금 문장 무한 반복"], ["K", "ເປີດ · ປິດ ສຽງລາວ", "라오스어 음성 켜기 · 끄기"], ["1 ~ 5", "ຈຳນວນເທື່ອ", "반복 횟수"], ["-  =", "ຊ້າລົງ · ໄວຂຶ້ນ", "배속"],
  ["Q W E", "ປະໂຫຍກ · ຄຳສັບ · ແບບທົດສອບ", "예문 · 단어 · 퀴즈"], ["?", "ເປີດ · ປິດ ລາຍການນີ້", "단축키 목록"]];
function keyHelp(){
  const box = h("div", {id: "kbhelp", onclick: () => box.remove()},
    h("div", {class: "kbcard"}, h("b", null, "ປຸ່ມລັດແປ້ນພິມ ", h("span", {class: "ko"}, "키보드 단축키")),
      h("table", null, KEYS.map(r => h("tr", null, h("td", null, h("kbd", null, r[0])), h("td", null, r[1], " ", h("span", {class: "ko m"}, r[2])))))));
  document.body.appendChild(box);
}
function setSayLo(v){ S.sayLo = !!v; save(); const c = $("loChk"); if (c) c.checked = S.sayLo; }
{ const c = $("loChk"); if (c){ c.checked = S.sayLo !== false; c.addEventListener("change", () => { setSayLo(c.checked); try { c.blur(); } catch (e) {} }); } }
const setSel = (id, i) => { const r = $(id); if (!r || i < 0 || i >= r.options.length || i === r.selectedIndex) return; r.selectedIndex = i; r.dispatchEvent(new Event("change", {bubbles: true})); };
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target, tn = t && t.tagName;
  if (tn === "INPUT" || tn === "TEXTAREA" || tn === "SELECT" || (t && t.isContentEditable)) return;
  const hp = $("kbhelp"); if (hp){ hp.remove(); e.preventDefault(); return; }
  const c = e.code, k = (e.key || "").toLowerCase();
  const is = (code, ...ks) => c === code || ks.includes(k);
  if (e.key === "?" || (c === "Slash" && e.shiftKey)){ e.preventDefault(); keyHelp(); return; }
  if (query) return;
  if (e.key === "Escape"){ if (P.mode){ e.preventDefault(); stopPlay(); } return; }
  if (is("KeyK", "k", "ㅏ")){ e.preventDefault(); setSayLo(S.sayLo === false); return; }
  if (is("Comma", ",", "<") || is("Period", ".", ">")){
    e.preventDefault(); const i = byCode.get(S.code), d = is("Period", ".", ">") ? 1 : -1;
    go(IDX[(i + d + IDX.length) % IDX.length][0]); window.scrollTo(0, 0); return; }
  const ctl = !$("controls").hidden, rep = ctl && !$("ctlrep").hidden;
  if (is("KeyQ", "q", "ㅂ") || is("KeyW", "w", "ㅈ") || is("KeyE", "e", "ㄷ")){
    if (!ctl) return; e.preventDefault(); const b = $(is("KeyQ", "q", "ㅂ") ? "m-learn" : is("KeyW", "w", "ㅈ") ? "m-cards" : "m-quiz"); if (b) b.click(); return; }
  if (is("KeyC", "c", "ㅊ")){ if (rep){ e.preventDefault(); playBundle(true); } return; }
  if (is("KeyG", "g", "ㅎ")){ if (rep){ e.preventDefault(); playBundle(false); } return; }
  if (/^Digit[1-5]$/.test(c) || /^[1-5]$/.test(e.key)){ if (ctl){ e.preventDefault(); setSel("repSel", +(e.key.match(/[1-5]/) || c.slice(-1))[0] - 1); } return; }
  if (is("Minus", "-", "_") || is("Equal", "=", "+")){ if (ctl){ e.preventDefault(); const r = $("rateSel"); setSel("rateSel", r.selectedIndex + (is("Equal", "=", "+") ? 1 : -1)); } return; }
  if (c === "Space" || e.key === " "){
    if (P.mode){ e.preventDefault(); togglePause(); return; }
    if (rep && tn !== "BUTTON" && tn !== "A"){ e.preventDefault(); playBundle(false); } return; }
  if (!P.mode) return;
  if (e.key === "Enter"){ e.preventDefault(); if (P.mode === "single") return; P.hold = !P.hold; if (P.paused) togglePause(); return; }
  if (e.key === "ArrowRight" || e.key === "ArrowLeft"){ e.preventDefault(); skipBy(e.key === "ArrowRight" ? 1 : -1); }
});
/* phones show short Korean option text (2회, x 1.0) so tabs, count and speed fit on one line (RYU 2026-11-22, v2.31) */
  { const mq = matchMedia("(max-width:560px)"), lab = () => { for (const o of $("repSel").options) o.textContent = mq.matches ? o.value + "회" : o.value + " ເທື່ອ";
      for (const o of $("rateSel").options) o.textContent = (mq.matches ? "x " : "×") + (+o.value).toFixed(1); };
    lab(); try { mq.addEventListener("change", lab); } catch (e) {} }
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
