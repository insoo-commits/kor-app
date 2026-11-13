/* Korean for Lao learners. Data: META (areas, sub-groups, bundle index) is inlined; bundle bodies load per area from data/K?.json. */
(function(){
"use strict";
const META = window.KO_META, AREAS = META.areas, SUBS = META.subs, IDX = META.idx;
const byCode = new Map(IDX.map((r, i) => [r[0], i]));
const $ = id => document.getElementById(id);
const areaOf = c => c.slice(0, 2), subOf = c => c.slice(0, 4);
const T = {
  sec: {m: "ວິທີສ້າງປະໂຫຍກ", l: "ຕົວອັກສອນ", x: "ຕາຕະລາງ", w: "ຄຳສັບ", c: "ການປ່ຽນຮູບຄຳ", e: "ປະໂຫຍກຕົວຢ່າງ", tp: "ຂໍ້ແນະນຳ", pr: "ຄຳຄູ່", dl: "ບົດສົນທະນາ", sm: "ສະຫຼຸບ", qz: "ຄຳຖາມທວນຄືນ"},
  level: "ລະດັບ", repBundle: "🔊 ຟັງຊ້ຳບົດນີ້", repDlg: "🔊 ຟັງບົດສົນທະນາຊ້ຳ", repAll: "🔊 ຟັງຕໍ່ເນື່ອງທຸກບົດ", pause: "ຢຸດຊົ່ວຄາວ", resume: "▶ ສືບຕໍ່", stop: "ຍົກເລີກ", hideLo: "ເຊື່ອງຄຳແປ", done: "ຮຽນຈົບແລ້ວ", markDone: "ໝາຍວ່າຮຽນຈົບແລ້ວ", next: "ບົດຕໍ່ໄປ →", prev: "← ກ່ອນໜ້າ", nextCard: "ຕໍ່ໄປ →",
  hidePr: "ເຊື່ອງຄຳອ່ານ", showKo: "ສະແດງຄຳອະທິບາຍພາສາເກົາຫຼີ", known: "ຈື່ແລ້ວ", flip: "ແຕະເພື່ອເບິ່ງຄວາມໝາຍ", onlyNew: "ສະເພາະຄຳທີ່ຍັງບໍ່ຈື່",
  showAns: "ເບິ່ງຄຳຕອບ", again: "ເຮັດອີກຄັ້ງ", score: "ຄະແນນ", noCards: "ບົດນີ້ບໍ່ມີບັດຄຳ.", allKnown: "ຈື່ໝົດທຸກຄຳແລ້ວ!", noQuiz: "ບົດນີ້ມີຄຳສັບບໍ່ພໍສຳລັບແບບທົດສອບ.",
  pick: "ເລືອກຄວາມໝາຍທີ່ຖືກຕ້ອງ", pickKo: "ເລືອກຄຳພາສາເກົາຫຼີທີ່ຖືກຕ້ອງ", loading: "ກຳລັງໂຫຼດ…", loadFail: "ໂຫຼດບົດຮຽນບໍ່ໄດ້. ກະລຸນາເປີດໜ້ານີ້ຄືນໃໝ່.",
  noHit: "ບໍ່ພົບຜົນການຄົ້ນຫາ.", searching: "ກຳລັງຄົ້ນຫາ…", lessons: "ບົດ", words: "ຄຳ",
  noVoice: "ອຸປະກອນນີ້ບໍ່ມີສຽງພາສາເກົາຫຼີ. ກະລຸນາຕິດຕັ້ງສຽງພາສາເກົາຫຼີໃນການຕັ້ງຄ່າ ຫຼື ໃຊ້ Chrome / Edge."
};
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
let S = {code: IDX[0][0], mode: "learn", rate: "0.8", rep: "1", hidePr: false, hideLo: false, showKo: false, onlyNew: false, known: {}, done: {}};
try { const v = JSON.parse(localStorage.getItem(LS) || "null"); if (v && typeof v === "object") S = Object.assign(S, v); } catch (e) {}
if (!byCode.has(S.code)) S.code = IDX[0][0];
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
    let fin = false; const end = () => { if (!fin){ fin = true; res(); } };
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
function quiet(){ if (synth) try { synth.cancel(); } catch (e) {} if (AEL) try { AEL.onended = AEL.onerror = null; AEL.pause(); } catch (e) {} }
const gap = ms => new Promise(r => setTimeout(r, ms));
function mark(el){
  document.querySelectorAll(".now").forEach(x => x.classList.remove("now"));
  if (el && el.isConnected){ el.classList.add("now"); if (P.mode !== "single" && el.scrollIntoView) el.scrollIntoView({block: "nearest"}); }
}
function showPlayer(text){
  $("player").hidden = !P.mode;
  $("pt").textContent = text || "";
  $("ppause").textContent = P.paused ? T.resume : T.pause;
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
async function sayItem(tok, it, label){
  const n = +S.rep || 1;
  mark(it.el);
  if (it.head){
    showPlayer(label + " · " + it.ko);
    if (!(await say(tok, it.ko))) return false; await gap(300);
    if (it.lo && (loVoice || hasClip("lo", it.lo))){ if (!(await say(tok, it.lo, true))) return false; await gap(300); }
    if (!(await say(tok, it.ko))) return false;
    for (let k = 1; k < n; k++){ await gap(350); if (!(await say(tok, it.ko))) return false; }
  } else for (let k = 0; k < n; k++){
    showPlayer(label + " · " + (k + 1) + "/" + n + " · " + it.ko);
    if (!(await say(tok, it.ko))) return false; await gap(350);
  }
  await gap(250);
  return tok === P.tok;
}
const queue = () => [...document.querySelectorAll("#view [data-say]")].map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1"}));
async function playSingle(el){
  if (P.mode === "single" && el.classList.contains("now")) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "single"; P.paused = false;
  mark(el);
  for (let k = 1; tok === P.tok; k++){
    showPlayer("🔊 ∞ · " + k + " · " + el.dataset.say);
    if (!(await say(tok, el.dataset.say))) return;
    await gap(500);
  }
}
async function playBundle(chain){
  stopPlay();
  const tok = ++P.tok; P.mode = chain ? "chain" : "bundle"; P.paused = false; P.round = 1;
  for (;;){
    const q = queue();
    if (!q.length && !chain) return stopPlay();
    for (let i = 0; i < q.length; i++){
      const label = chain ? "🔊 " + S.code + " · " + (i + 1) + "/" + q.length : "🔊 " + (i + 1) + "/" + q.length + " · ↻" + P.round;
      if (!(await sayItem(tok, q[i], label))) return;
    }
    if (chain){
      const next = IDX[(byCode.get(S.code) + 1) % IDX.length][0];
      P.nav = true; S.code = next; S.mode = "learn";
      try { await loadArea(areaOf(next)); } catch (e) { P.nav = false; return stopPlay(); }
      if (tok !== P.tok){ P.nav = false; return; }
      if (location.hash === "#" + next){ P.nav = false; save(); drawAll(); } else { location.hash = next; await gap(60); }
      window.scrollTo(0, 0);
    } else P.round++;
    await gap(400);
    if (tok !== P.tok) return;
  }
}
/* dialogue repeat: the dialogue lines once each, in order, round and round until stopped */
async function playDialogue(box){
  if (P.mode === "dialog") return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "dialog"; P.paused = false; P.round = 1;
  for (;;){
    const q = [...box.querySelectorAll("[data-say]")];
    if (!q.length) return stopPlay();
    for (let i = 0; i < q.length; i++){
      mark(q[i]); showPlayer("🔊 " + (i + 1) + "/" + q.length + " · ↻" + P.round + " · " + q[i].dataset.say);
      if (!(await say(tok, q[i].dataset.say))) return;
      await gap(600);
    }
    P.round++; await gap(900);
    if (tok !== P.tok) return;
  }
}
function stopPlay(){
  P.tok++; P.mode = ""; P.paused = false;
  quiet();
  mark(null); showPlayer("");
}
function togglePause(){
  if (!P.mode) return;
  P.paused = !P.paused;
  if (P.paused) quiet();
  $("ppause").textContent = P.paused ? T.resume : T.pause;
}
const spk = () => h("button", {class: "spk", type: "button", "aria-label": "ຟັງ", onclick: ev => { const el = ev.currentTarget.closest("[data-say]"); if (el) playSingle(el); }}, "🔊");

/* ---------- chrome ---------- */
function drawStats(){
  const done = Object.keys(S.done).filter(c => byCode.has(c)).length, known = Object.keys(S.known).length;
  $("stats").replaceChildren(h("span", null, h("b", null, done + " / " + IDX.length), T.lessons + " " + T.done), h("span", null, h("b", null, known), T.words + " " + T.known));
}
function drawGroups(){
  const cur = areaOf(S.code);
  $("app").setAttribute("data-g", cur);
  $("groups").replaceChildren(...AREAS.map(a => {
    const rows = IDX.filter(r => r[0].startsWith(a[0] + "-")), d = rows.filter(r => S.done[r[0]]).length;
    return h("button", {class: "group", type: "button", "data-g": a[0], "aria-pressed": a[0] === cur ? "true" : "false", onclick: () => go(rows[0][0])},
      h("span", {class: "gn"}, h("i"), a[2]), h("small", {class: "ko"}, a[1] + " · " + d + "/" + rows.length));
  }));
  const on = $("groups").querySelector('[aria-pressed="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
function drawSubs(){
  const a = areaOf(S.code), cur = subOf(S.code);
  const ids = [...new Set(IDX.filter(r => r[0].startsWith(a + "-")).map(r => subOf(r[0])))];
  $("subs").replaceChildren(...ids.map(s => {
    const rows = IDX.filter(r => r[0].startsWith(s + "-")), d = rows.filter(r => S.done[r[0]]).length, n = SUBS[s] || [s, s];
    return h("button", {class: "sub", type: "button", role: "tab", "aria-selected": s === cur ? "true" : "false", onclick: () => go(rows[0][0])},
      h("span", {class: "code"}, s), h("span", {class: "name"}, n[1]), h("span", {class: "kn ko"}, n[0]), h("span", {class: "prog"}, d + " / " + rows.length));
  }));
  const on = $("subs").querySelector('[aria-selected="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
function drawControls(){
  const s = subOf(S.code), rows = IDX.filter(r => r[0].startsWith(s + "-"));
  $("bsel").replaceChildren(...rows.map(r => { const o = h("option", {value: r[0]}, (S.done[r[0]] ? "✓ " : "") + r[0].slice(5) + " · " + r[1] + (r[4] ? " (" + r[4] + ")" : "")); o.selected = r[0] === S.code; return o; }));
  document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === S.mode ? "true" : "false"));
  $("repSel").value = S.rep; $("rateSel").value = S.rate;
}
function drawBand(b){
  const r = IDX[byCode.get(S.code)];
  $("band").replaceChildren(
    h("div", null, h("div", {class: "code"}, r[0]), h("h2", {class: "ko"}, r[1]), r[4] ? h("div", {class: "tlo"}, r[4]) : null,
      b && b.i && b.i[1] ? h("p", null, b.i[1]) : null, b && b.i && S.showKo ? h("p", {class: "sub-ko ko"}, b.i[0]) : null),
    h("div", {class: "tags"}, h("span", {class: "tag"}, T.level + " " + r[2]), h("span", {class: "tag ko"}, r[3]), S.done[r[0]] ? h("span", {class: "tag"}, "✓ " + T.done) : null));
}

/* ---------- lesson view ---------- */
const sec = (key, ...kids) => kids.flat().filter(Boolean).length ? h("section", {class: "sec"}, h("h3", null, T.sec[key]), kids) : null;
const note = pair => [h("p", {class: "note-lo"}, pair[1] || pair[0]), S.showKo && pair[1] ? h("p", {class: "note-ko ko"}, pair[0]) : null];
const line = (ko, pr, lo, cls, from) => h("div", {class: "line " + (cls || ""), "data-say": ko, "data-lo": lo, "data-head": cls === "head" ? "1" : null}, spk(),
  h("div", null, from ? h("div", {class: "from ko"}, from) : null, h("div", {class: "k ko"}, ko), pr ? h("div", {class: "p"}, pr) : null, h("div", {class: "m"}, lo)));
function renderLearn(b){
  const i = byCode.get(b.code), next = IDX[i + 1], isDone = !!S.done[b.code];
  const dl = b.dl || [];
  return [
    h("div", {class: "rowbtns"},
      h("label", {class: "check"}, h("input", {type: "checkbox", checked: S.hidePr, onchange: ev => { S.hidePr = ev.target.checked; save(); render(); }}), T.hidePr),
      h("label", {class: "check"}, h("input", {type: "checkbox", checked: S.hideLo, onchange: ev => { S.hideLo = ev.target.checked; save(); render(); }}), T.hideLo),
      h("label", {class: "check"}, h("input", {type: "checkbox", checked: S.showKo, onchange: ev => { S.showKo = ev.target.checked; save(); render(); }}), T.showKo),
      h("span", {style: "flex:1"}),
      h("button", {class: "btn", type: "button", onclick: () => playBundle(true)}, T.repAll),
      h("button", {class: "btn", type: "button", onclick: () => playBundle(false)}, T.repBundle)),
    sec("m", (b.m || []).map(m => h("div", {class: "tip"}, note(m)))),
    sec("l", !(b.l || []).length ? null : h("div", {class: "letters"}, (b.l || []).map(l => h("button", {class: "letter", type: "button", "data-say": l[2] || l[0], onclick: ev => playSingle(ev.currentTarget)},
      h("b", {class: "ko"}, l[0]), h("span", null, l[1]), l[2] ? h("span", {class: "ko"}, "🔊 " + l[2]) : null)))),
    b.x && b.x.length > 1 ? sec("x", h("div", {class: "tablewrap"}, h("table", null,
      h("thead", null, h("tr", null, b.x[0].map(c => h("th", {class: "ko"}, c)))),
      h("tbody", null, b.x.slice(1).map(r => h("tr", null, r.map(c => h("td", null, c)))))))) : null,
    sec("w", (b.w || []).map(w => h("div", {class: "word" + ((w[3] || []).length ? "" : " solo")}, line(w[0], w[1], w[2], "head"), (w[3] || []).length ? h("div", {class: "exs"}, w[3].map(e => line(e[0], e[1], e[2], "ex"))) : null))),
    sec("c", (b.c || []).length ? h("div", {class: "rows grid2"}, b.c.map(c => line(c[1], c[2], c[3], "", c[0]))) : null),
    sec("e", (b.e || []).length ? h("div", {class: "rows grid2"}, b.e.map(e => line(e[0], e[1], e[2]))) : null),
    sec("tp", (b.tp || []).map(t => h("div", {class: "tip"}, note(t)))),
    sec("pr", (b.pr || []).length ? h("div", {class: "pairs"}, b.pr.map(p => h("div", {class: "pair"}, p.flatMap((x, j) => j ? [h("i", null, "↔"), x] : [x])))) : null),
    sec("dl", dl.length ? [
      h("div", {class: "rowbtns", style: "justify-content:flex-end;margin-bottom:8px"}, h("button", {class: "btn", type: "button", onclick: ev => playDialogue(ev.currentTarget.parentNode.nextElementSibling)}, T.repDlg)),
      h("div", {class: "rows dlg"}, dl.map(d => h("div", {class: "line", "data-say": d[1], "data-lo": d[2]}, spk(), h("div", null, h("div", {class: "who ko"}, d[0]), h("div", {class: "k ko"}, d[1]), h("div", {class: "m"}, d[2])))))] : null),
    sec("sm", b.sm && b.sm.length ? h("div", {class: "tip"}, note(b.sm)) : null),
    sec("qz", (b.qz || []).map(q => { const a = h("div", {class: "a", hidden: true}, q[1]);
      return h("div", {class: "qa"}, h("div", {class: "ko"}, q[0]), a, h("button", {class: "btn", type: "button", onclick: ev => { a.hidden = false; ev.currentTarget.remove(); }}, T.showAns)); })),
    h("div", {class: "rowbtns", style: "justify-content:space-between"},
      h("button", {class: "btn" + (isDone ? " good" : ""), type: "button", onclick: () => { if (isDone) delete S.done[b.code]; else S.done[b.code] = 1; save(); drawAll(); }}, isDone ? "✓ " + T.done : T.markDone),
      next ? h("button", {class: "btn primary", type: "button", onclick: () => go(next[0])}, T.next) : null)
  ];
}

/* ---------- cards ---------- */
function items(b){
  const out = [];
  (b.l || []).forEach((l, j) => out.push({id: b.code + "~l" + j, ko: l[0], pr: "", lo: l[1], say: l[2] || l[0]}));
  (b.w || []).forEach((w, j) => out.push({id: b.code + "~w" + j, ko: w[0], pr: w[1], lo: w[2]}));
  (b.c || []).forEach((c, j) => out.push({id: b.code + "~c" + j, ko: c[1], pr: c[2], lo: c[3]}));
  (b.e || []).forEach((e, j) => out.push({id: b.code + "~e" + j, ko: e[0], pr: e[1], lo: e[2]}));
  return out.filter(x => x.ko && x.lo);
}
let cardAt = 0, cardOpen = false;
function renderCards(b){
  const all = items(b), list = S.onlyNew ? all.filter(x => !S.known[x.id]) : all;
  const filter = h("div", {class: "rowbtns"}, h("label", {class: "check"}, h("input", {type: "checkbox", checked: S.onlyNew, onchange: ev => { S.onlyNew = ev.target.checked; cardAt = 0; cardOpen = false; save(); render(); }}), T.onlyNew),
    h("label", {class: "check"}, h("input", {type: "checkbox", checked: S.hidePr, onchange: ev => { S.hidePr = ev.target.checked; save(); render(); }}), T.hidePr));
  if (!all.length) return [h("p", {class: "empty"}, T.noCards)];
  if (!list.length) return [filter, h("p", {class: "empty"}, T.allKnown)];
  if (cardAt >= list.length) cardAt = 0;
  const it = list[cardAt], known = !!S.known[it.id];
  const move = d => { cardAt = (cardAt + d + list.length) % list.length; cardOpen = false; render(); };
  return [filter,
    h("button", {class: "card" + (known ? " known" : ""), type: "button", onclick: () => { cardOpen = !cardOpen; render(); }},
      h("div", null, h("div", {class: "k ko"}, it.ko), it.pr && !S.hidePr ? h("div", {class: "p"}, it.pr) : null,
        cardOpen ? h("div", {class: "m"}, it.lo) : h("div", {class: "hint"}, T.flip))),
    h("div", {class: "rowbtns", style: "justify-content:space-between"},
      h("button", {class: "btn", type: "button", onclick: () => move(-1)}, T.prev),
      h("div", {class: "rowbtns", "data-say": it.say || it.ko}, spk(), h("span", {class: "count"}, (cardAt + 1) + " / " + list.length),
        h("button", {class: "btn" + (known ? " good" : ""), type: "button", onclick: () => { if (known) delete S.known[it.id]; else S.known[it.id] = 1; save(); drawStats(); if (!known && S.onlyNew){ cardOpen = false; render(); } else render(); }}, (known ? "✓ " : "") + T.known)),
      h("button", {class: "btn primary", type: "button", onclick: () => move(1)}, T.nextCard))];
}

/* ---------- quiz: four choices built from the bundle's own words ---------- */
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
    h("div", {class: "rowbtns", style: "justify-content:center"}, h("button", {class: "btn primary", type: "button", onclick: () => { quiz = null; render(); }}, T.again))];
  const q = quiz.qs[quiz.at];
  return [h("div", null, h("div", {class: "quizq" + (q.toLo ? " ko" : "")}, q.q), h("p", {class: "quizp"}, (q.toLo ? T.pick : T.pickKo) + " · " + (quiz.at + 1) + " / " + quiz.qs.length)),
    q.say ? h("div", {class: "rowbtns", style: "justify-content:center", "data-say": q.say}, spk()) : null,
    h("div", {class: "choices"}, q.opts.map(o => h("button", {class: "choice" + (q.toLo ? "" : " ko") + (q.picked != null ? (o === q.a ? " right" : o === q.picked ? " wrong" : "") : ""), type: "button", disabled: q.picked != null,
      onclick: () => { q.picked = o; if (o === q.a) quiz.right++; render(); if (!q.toLo){ const tok = ++P.tok; say(tok, q.a); } }}, o))),
    q.picked != null ? h("div", {class: "rowbtns", style: "justify-content:flex-end"}, h("button", {class: "btn primary", type: "button", onclick: () => { quiz.at++; render(); }}, T.nextCard)) : null];
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
    h("span", {class: "k ko"}, x.ko), h("span", {class: "where"}, x.code), h("span", null, x.lo || (SUBS[subOf(x.code)] || ["", ""])[1]))))];
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
  const parts = S.mode === "cards" ? renderCards(b) : S.mode === "quiz" ? renderQuiz(b) : renderLearn(b);
  view.replaceChildren(...parts.flat().filter(Boolean));
}
function drawAll(){ drawStats(); drawGroups(); drawSubs(); drawControls(); render(); }
function go(code){ if (!byCode.has(code)) return; if (location.hash === "#" + code) route(); else location.hash = code; }
async function route(){
  const name = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (byCode.has(name)) S.code = name;
  if (P.nav) P.nav = false; else stopPlay();
  cardAt = 0; cardOpen = false; quiz = null; save(); drawAll();
  const a = areaOf(S.code);
  if (!cache.has(a)){
    try { await loadArea(a); } catch (e) { if (areaOf(S.code) === a) $("view").replaceChildren(h("p", {class: "empty"}, T.loadFail)); return; }
    if (areaOf(S.code) === a) render();
  }
}
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => { S.mode = b.dataset.mode; stopPlay(); cardAt = 0; cardOpen = false; save(); drawControls(); render(); }));
$("bsel").addEventListener("change", ev => go(ev.target.value));
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
  const el = ev.target.closest(".line[data-say]"); if (el) playSingle(el);
});
let qTimer = 0;
$("q").addEventListener("input", ev => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    query = ev.target.value.trim(); render();
    if (query) Promise.all(AREAS.map(a => loadArea(a[0]).catch(() => null))).then(() => { if (query) render(); });
  }, 200);
});
window.addEventListener("hashchange", route);
$("ver").textContent = META.ver;
route();
if ("serviceWorker" in navigator && window.KO_SW) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
