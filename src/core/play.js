/* core play v1.0 (master: kor-app src/core/play.js). Shared by PhasaKAO and JeyCampus (PhasaLAO keeps its own player:
   it fills the pauses with silent clips so the lock screen keeps playing, and counts repeats in another way). Edit only this
   master, raise the version, then run  node tools/core-copy.js ../kor-app-en.
   Playback (RYU's rules; 2026-11-28 moved here unchanged from PhasaKAO app.js, JeyCampus had the same code):
   one 🔊 / a tapped card: that line over and over · bundle / all-bundle repeat (G / C) · word, dialogue and section repeat ·
   횟수 (S.rep) and speed (S.rate) · Enter = this line ∞ · ← → line before / after · pause · lock-screen buttons.
   The app gives once:  const PL = makePlay({$, h, ico, T, S, IDX, byCode, AP, lg, ordParts, loadArea, areaOf, drawAll, save,
   snapLater, flipCard, log})  and takes the functions it uses from PL (P, playSingle, playBundle, stopPlay …).
   Kept in the app: the audio pack (AP), flipCard (the card look),
   lg = the meaning language's clip / voice code ("lo"; JeyCampus: the chosen explanation language).
   Per-app value from window.APPCFG.play (app-config.js): title = the lock-screen title. */
window.makePlay = function(A){
  const C = (window.APPCFG && window.APPCFG.play) || {}, LG = A.lg;
  const {$, h, ico, T, S, IDX, byCode, AP, ordParts, loadArea, areaOf, drawAll, save, snapLater, flipCard} = A, ST = {log: A.log};
  const synth = window.speechSynthesis || null;
  let koVoice = null, loVoice = null;
  const P = {tok: 0, mode: "", paused: false, round: 1, nav: false};
  function markMode(){ const c = document.getElementById("ctlrep"); if (c) c.dataset.on = P.mode; }   // bar repeat button shown in reverse while it plays (v1.94)
  function pickVoice(){
    if (!synth) return;
    const all = synth.getVoices(), vs = all.filter(v => /^ko/i.test(v.lang));
    koVoice = vs.find(v => /Google|Yuna|SunHi|InJoon|Natural/i.test(v.name)) || vs[0] || null;
    loVoice = all.find(v => new RegExp("^" + LG, "i").test(v.lang)) || null;
    $("voiceNote").textContent = all.length && !koVoice && !window.AUDIO_INDEX ? T.noVoice : "";
  }
  if (synth){ pickVoice(); try { synth.addEventListener("voiceschanged", pickVoice); } catch (e) {} } else if (!window.AUDIO_INDEX) $("voiceNote").textContent = T.noVoice;
  let AEL = null;
  const hasClip = (lang, text) => AP.has(clipKey(lang === "lo" ? LG : lang, lang === "lo" ? cleanLo(text) : cleanKo(text)));   // "lo" = the meaning language (LG)
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
      const key = clipKey(lao ? LG : male ? "km" : "ko", t);
      if (!AP.has(key)) return tts();
      const go = url => {
        if (fin) return; if (!url) return tts();
        try {
          AEL.onended = end; AEL.onerror = () => { if (!fin) tts(); };
          AEL.src = url; AEL.playbackRate = +S.rate || 1;
          const pr = AEL.play(); if (pr && pr.catch) pr.catch(() => { if (!fin) tts(); });
          setTimeout(end, 8000 + t.length * 600);
        } catch (e) { tts(); }
      };
      if (!AEL) AEL = new Audio();
      const now = AP.now(key);
      if (now) return go(now);
      /* the lesson's pack is not in memory yet: start the player now, while this is still the tap (iPhone allows sound only then), then play when it arrives */
      try { AEL.onended = AEL.onerror = null; AEL.src = SILENT; const pr = AEL.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (e) {}
      AP.url(key).then(go, () => go(null));
    });
  }
  let CUR_END = null;
  const SILENT = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  function quiet(){ if (synth) try { synth.cancel(); } catch (e) {} if (AEL) try { AEL.onended = AEL.onerror = null; AEL.pause(); } catch (e) {} const f = CUR_END; CUR_END = null; if (f) f(); }
  const gap = ms => new Promise(r => setTimeout(r, ms));
  /* keep the playing line in view (JeyCampus v1.19.24 way, for both apps since play v1.0, RYU 2026-11-28): the TOP of the playing
     line lands at ~30% of the space under the sticky menu bar, so it is never hidden under it; it moves only when the line
     goes above that space, below 70% of it, or is cut off at the bottom */
  function follow(el){
    const r = el.getBoundingClientRect(), pl = $("player"), ph = pl && !pl.hidden ? pl.getBoundingClientRect().height + 16 : 0, H = innerHeight - ph;
    const sk = $("stick"), t0 = sk && !sk.hidden ? Math.max(0, sk.getBoundingClientRect().bottom) : 0, AH = H - t0;
    if (r.top < t0 + 4 || r.top > t0 + AH * .7 || (r.bottom > H && r.height < AH * .7)) window.scrollBy({top: r.top - (t0 + AH * .3), behavior: "smooth"});
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
      if (window.MediaMetadata) ms.metadata = new MediaMetadata({title: title || C.title, artist: C.title, album: (IDX[byCode.get(S.code)] || [])[1] || ""});
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
  function skipBy(d){ if (!P.mode) return;
    /* v2.86 (RYU): while one line repeats (🔊 or a tap), ← → move to the line before / after and repeat that one */
    if (P.mode === "single"){ const cur = document.querySelector("#view .now"); if (!cur) return;
      const all = [...document.querySelectorAll("#view .line[data-say], #view .wcard[data-say]")], i = all.indexOf(cur), nx = all[i + d];
      if (i < 0 || !nx) return; if (nx.classList.contains("wcard")) playCard(nx); else playSingle(nx); return; }
    P.hold = false; P.skip = d; if (P.paused) togglePause(); quiet(); }
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
      face(); if (!(await say(tok, it.ko, false, it.male))) return false; await gap(k === 0 && withLo ? 300 : 250);   // the same line again: short pause (v2.25)
      if (k === 0 && withLo){ face(); if (!(await say(tok, it.lo, true))) return false; await gap(300); }
    }
    if (it.card) flipCard(it.card, false);
    await gap(250);
    return tok === P.tok;
  }
  /* bundle / all-bundle repeat: everything above the dialogue (the dialogue has its own repeat button) */
  const queue = () => { const lis = document.querySelector("#view .dlg.lis");   // 듣기연습: the bundle button plays the text itself (v2.45)
    return [...document.querySelectorAll(lis ? "#view .dlg.lis [data-say]" : "#view [data-say]")].filter(el => lis || !el.closest(".dlg")).map(el => ({el, ko: el.dataset.say, lo: el.dataset.lo || "", head: el.dataset.head === "1", male: el.dataset.m === "1"})); };
  async function playSingle(el){
    if (P.mode === "single" && el.classList.contains("now")) return stopPlay();
    stopPlay();
    const tok = ++P.tok; P.mode = "single"; markMode(); P.paused = false;
    mark(el);
    const ko = el.dataset.say, lo = el.dataset.lo || "", male = el.dataset.m === "1";
    const withLo = S.sayLo !== false && lo && (loVoice || hasClip("lo", lo));   // word or sentence: Korean, Lao once, then Korean over and over (RYU 2026-11-16)   // a headword: Korean, Lao, then Korean over and over
    for (let k = 1; tok === P.tok; k++){
      showPlayer("🔊 ∞ · " + k + " · " + ko);
      if (!(await say(tok, ko, false, male))) return;
      if (withLo && k === 1){ await gap(300); if (!(await say(tok, lo, true))) return; }
      await gap(500);
    }
  }
  async function playBundle(chain){ ST.log("play", S.code, chain ? "all" : "lesson");   // usage statistics (src/stats.js, v2.68)
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
  const b_lis = el => el.closest(".dlg.lis") ? el.dataset.lo || "" : "";   // 듣기연습 lines say their Lao too (K turns it off)
  async function playDialogue(box){
    if (P.mode === "dialog") return stopPlay();
    stopPlay();
    const tok = ++P.tok; P.mode = "dialog"; markMode(); P.paused = false; P.round = 1;
    for (;;){
      const q = [...box.querySelectorAll("[data-say]")];
      if (!q.length) return stopPlay();
      for (let i = 0; i < q.length; i++){
        if (!(await sayItem(tok, {el: q[i], ko: q[i].dataset.say, lo: b_lis(q[i]), male: q[i].dataset.m === "1"}, "🔊 " + (i + 1) + "/" + q.length + " · ↻" + P.round))){
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
    snapLater();   // the clean screen after a play (v2.99)
  }
  function togglePause(){
    if (!P.mode) return;
    P.paused = !P.paused;
    if (P.paused) quiet();
    $("ppause").replaceChildren(ico(P.paused ? "play" : "pause"), h("span", {class: "bt"}, P.paused ? T.resume : T.pause));   // same kind of mark on all three (RYU 2026-11-16)
    try { if (navigator.mediaSession) navigator.mediaSession.playbackState = P.paused ? "paused" : "playing"; } catch (e) {}
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
  return {P, synth, aud: () => AEL, voices: () => ({ko: koVoice, lo: loVoice}), markMode, hasClip, speakOne, quiet, gap, mark, showPlayer, skipBy, say, sayItem,
    playSingle, playBundle, playWord, playDialogue, playSents, playCard, stopPlay, togglePause};
};
