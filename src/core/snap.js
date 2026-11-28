/* core snap v1.0 (master: kor-app src/core/snap.js). Shared by PhasaKAO and JeyCampus (PhasaLAO keeps its own: its copy
   has other fields). Edit only this master, raise the version, then run  node tools/core-copy.js ../kor-app-en.
   Last screen first (as PhasaLAO, RYU 2026-11-28): the clean screen is kept in localStorage, and index.html (written by
   build.js) shows it at once on the next start, before app.js and the lesson data arrive, with the #boot "loading" pill.
   The first full render takes the copy away (html.snap) and the pill. Kept 0.5 s after the screen settles.
   The app gives once:  SNAP.init({skip: () => true while playing / searching / in a quiz, sig: () => the screen's signature}),
   then calls SNAP.later() after each render and SNAP.done() at the first full render.
   Per-app value from window.APPCFG.snap (app-config.js): key = the storage key (must match the one build.js reads). */
(function(){
  if (window.SNAP) return;
  var C = (window.APPCFG && window.APPCFG.snap) || {}, O = {}, T = 0, IDS = ["stats", "mine", "groups", "subs", "sinfo", "band", "controls", "view"];
  var $ = function(id){ return document.getElementById(id); }, de = document.documentElement;
  function done(){ de.classList.remove("snap"); var bt = $("boot"); if (bt) bt.remove(); }
  function later(){ clearTimeout(T); T = setTimeout(function(){ try {
    if (!C.key || (O.skip && O.skip()) || de.classList.contains("snap")) return;
    var a = $("app"); a.querySelectorAll("select option").forEach(function(o){ o.toggleAttribute("selected", o.selected); });
    localStorage.setItem(C.key, JSON.stringify({sig: O.sig(), g: a.getAttribute("data-g"),
      hid: IDS.filter(function(i){ return $(i).hidden; }), h: IDS.map(function(i){ return [i, $(i).innerHTML]; })}));
  } catch (e) { try { localStorage.removeItem(C.key); } catch (e2) {} } }, 500); }
  window.SNAP = {init: function(o){ O = o || {}; }, later: later, done: done};
})();
