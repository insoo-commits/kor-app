/* app volume (2026-11-27, RYU): one level for every sound the app makes, saved per app.
   iPhone/iPad ignore audio.volume, so there the <audio> elements are routed through a Web Audio GainNode
   (only once the level is set below 100%, so normal playback stays untouched). Elsewhere audio.volume is used.
   Spoken TTS fallback gets utterance.volume. API: window.AVOL.get() 0..1, AVOL.set(v), AVOL.pct(). */
(function(){
  if (window.AVOL) return;
  var KEY = "vol:" + (location.pathname.split("/")[1] || "app"), V = 1;
  try { var s = localStorage.getItem(KEY); if (s !== null && !isNaN(+s)) V = Math.max(0, Math.min(1, +s)); } catch (e) {}
  var FIXED = false;                       /* true where element volume is read-only (iOS) */
  try { var t = document.createElement("audio"); t.volume = 0.5; FIXED = Math.abs(t.volume - 0.5) > 0.01; } catch (e) {}
  /* v2 (RYU: no change on phones): newer iPhones read back the value they ignore, so detect iPhone/iPad by name too */
  try { var ua = navigator.userAgent || ""; if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) FIXED = true; } catch (e) {}
  var ctx = null, gain = null, routed = [], seen = [];
  function ensureCtx(){
    if (ctx) return ctx;
    try { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ctx = new C(); gain = ctx.createGain(); gain.gain.value = V; gain.connect(ctx.destination); } catch (e) { ctx = null; }
    return ctx;
  }
  function wake(){ try { if (ctx && ctx.state !== "running") ctx.resume(); } catch (e) {} }
  function route(el){
    if (!FIXED || routed.indexOf(el) >= 0 || V >= 0.999) return;
    if (!ensureCtx()) return;
    try { var src = ctx.createMediaElementSource(el); src.connect(gain); routed.push(el); } catch (e) {}
    wake();
  }
  function apply(el){
    if (!(el instanceof HTMLAudioElement)) return;
    if (seen.indexOf(el) < 0) seen.push(el);
    if (FIXED) route(el); else { try { el.volume = V; } catch (e) {} }
  }
  var play0 = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function(){ try { apply(this); if (routed.indexOf(this) >= 0) wake(); } catch (e) {} return play0.apply(this, arguments); };
  try {
    var ss = window.speechSynthesis, speak0 = ss && ss.speak;
    if (speak0) ss.speak = function(u){ try { if (u && !u._av){ u._av = 1; u.volume = (u.volume == null ? 1 : u.volume) * V; } } catch (e) {} return speak0.apply(ss, arguments); };
  } catch (e) {}
  ["touchend", "click", "keydown"].forEach(function(n){ document.addEventListener(n, wake, true); });
  document.addEventListener("visibilitychange", function(){ if (!document.hidden) wake(); });
  window.AVOL = {
    get: function(){ return V; },
    pct: function(){ return Math.round(V * 100); },
    set: function(v){
      V = Math.max(0, Math.min(1, +v || 0));
      try { localStorage.setItem(KEY, String(V)); } catch (e) {}
      if (FIXED && V < 0.999) ensureCtx();   /* made during the slider touch, so iOS lets it run */
      if (gain) try { gain.gain.value = V; } catch (e) {}
      wake();
      seen.forEach(apply);
    }
  };
})();
