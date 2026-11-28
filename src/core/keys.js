/* core keys v1.0 (master: kor-app src/core/keys.js). Shared by PhasaKAO and JeyCampus (PhasaLAO keeps its own: its
   player works differently). Edit only this master, raise the version, then run  node tools/core-copy.js ../kor-app-en.
   PC keyboard (same keys in all apps, RYU 2026-11-26/27):
   Space pause / resume (idle: 묶음 재생) · C 연속 재생 · G 묶음 재생 (again = stop) · Esc stop · ← → previous / next line
   , . (< >) previous / next lesson · Enter this line without end (∞) · K meaning voice on / off · 1-5 횟수 · - = 속도
   S W E 예문 · 단어 · 퀴즈 · ? list of keys. Keys go by e.code too, so they work with the Korean or Lao keyboard on; ↑ ↓ still scroll.
   Needs in the page: #controls, #ctlrep, #m-learn, #m-cards, #m-quiz, #repSel, #rateSel.
   The app gives what only it knows, once:  KBD.init({busy, playing, stop, voice, lesson(d), play(chain), pause, hold, skip(d)}).
   Help-card words from window.APPCFG.keys (app-config.js): title, rows = [[key, words, Korean], …]. */
(function(){
  if (window.KBD) return;
  var C = (window.APPCFG && window.APPCFG.keys) || {}, A = null, $ = function(id){ return document.getElementById(id); };
  var mk = function(tag, cls, kids){ var e = document.createElement(tag); if (cls) e.className = cls; (kids || []).forEach(function(k){ e.append(k); }); return e; };
  function help(){
    var box = mk("div", null, [mk("div", "kbcard", [mk("b", null, [(C.title || "Keyboard shortcuts") + " ", mk("span", "ko", ["키보드 단축키"])]),
      mk("table", null, (C.rows || []).map(function(r){ return mk("tr", null, [mk("td", null, [mk("kbd", null, [r[0]])]), mk("td", null, [r[1], " ", mk("span", "ko m", [r[2]])])]); }))])]);
    box.id = "kbhelp"; box.addEventListener("click", function(){ box.remove(); });
    document.body.appendChild(box);
  }
  function setSel(id, i){ var r = $(id); if (!r || i < 0 || i >= r.options.length || i === r.selectedIndex) return; r.selectedIndex = i; r.dispatchEvent(new Event("change", {bubbles: true})); }
  document.addEventListener("keydown", function(e){
    if (!A) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tn = t && t.tagName;
    if (tn === "INPUT" || tn === "TEXTAREA" || tn === "SELECT" || (t && t.isContentEditable)) return;
    var hp = $("kbhelp"); if (hp){ hp.remove(); e.preventDefault(); return; }
    var c = e.code, k = (e.key || "").toLowerCase();
    var is = function(code){ return c === code || [].slice.call(arguments, 1).indexOf(k) >= 0; };
    if (e.key === "?" || (c === "Slash" && e.shiftKey)){ e.preventDefault(); help(); return; }
    if (A.busy()) return;
    if (e.key === "Escape"){ if (A.playing()){ e.preventDefault(); A.stop(); } return; }
    if (is("KeyK", "k", "ㅏ")){ e.preventDefault(); A.voice(); return; }
    if (is("Comma", ",", "<") || is("Period", ".", ">")){ e.preventDefault(); A.lesson(is("Period", ".", ">") ? 1 : -1); return; }
    var ctl = !$("controls").hidden, rep = ctl && !$("ctlrep").hidden;
    if (is("KeyS", "s", "ㄴ") || is("KeyW", "w", "ㅈ") || is("KeyE", "e", "ㄷ")){
      if (!ctl) return; e.preventDefault(); var b = $(is("KeyS", "s", "ㄴ") ? "m-learn" : is("KeyW", "w", "ㅈ") ? "m-cards" : "m-quiz"); if (b) b.click(); return; }
    if (is("KeyC", "c", "ㅊ")){ if (rep){ e.preventDefault(); A.play(true); } return; }
    if (is("KeyG", "g", "ㅎ")){ if (rep){ e.preventDefault(); A.play(false); } return; }
    if (/^Digit[1-5]$/.test(c) || /^[1-5]$/.test(e.key)){ if (ctl){ e.preventDefault(); setSel("repSel", +(e.key.match(/[1-5]/) || c.slice(-1))[0] - 1); } return; }
    if (is("Minus", "-", "_") || is("Equal", "=", "+")){ if (ctl){ e.preventDefault(); var r = $("rateSel"); setSel("rateSel", r.selectedIndex + (is("Equal", "=", "+") ? 1 : -1)); } return; }
    if (c === "Space" || e.key === " "){
      if (A.playing()){ e.preventDefault(); A.pause(); return; }
      if (rep && tn !== "BUTTON" && tn !== "A"){ e.preventDefault(); A.play(false); } return; }
    if (!A.playing()) return;
    if (e.key === "Enter"){ e.preventDefault(); A.hold(); return; }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft"){ e.preventDefault(); A.skip(e.key === "ArrowRight" ? 1 : -1); }
  });
  window.KBD = {init: function(a){ A = a; }, help: help};
})();
