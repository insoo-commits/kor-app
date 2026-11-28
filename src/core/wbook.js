/* core wbook v1.0 (master: kor-app src/core/wbook.js). Shared by PhasaKAO and JeyCampus.
   Edit only this master, raise the version, then run  node tools/core-copy.js ../kor-app-en.
   The saved data of the 오답 노트 (mistake notebook, KoJey v1.12) and ☆ 단어 담기 (as PhasaLAO, RYU 2026-11-28), kept in the
   app's settings object S on this device. Only the data rules live here; the screens (list, review quiz) stay in each app.
     S.wb   = [{q: quiz question, code: lesson}], newest first, up to 80; a question is the same when kind | answer | text match
     S.star = {"code::ko": [ko, reading, meaning, lesson]}
   A word's row joins its wrong questions and its ☆: {k, code, ko, pr, lo, wrong?, star?}.
   The storage format must not change: learners' saved lists are in it. */
(function(){
  if (window.WB) return;
  var key = function(q){ return q.kind + "|" + q.a + "|" + (q.q || q.say || ""); };
  var nbKey = function(code, ko){ return code + "::" + ko; };
  /* entries saved before 2026-11-28 have no w = [ko, reading, meaning] */
  var word = function(x){ var q = x.q; if (q.w) return q.w; return [q.toLo ? q.q : q.a, "", q.toLo ? q.a : q.kind === "ko" ? q.q : ""]; };
  function add(S, qz){
    var bank = S.wb = (S.wb || []).filter(function(x){ return x && x.q; }), have = new Set(bank.map(function(x){ return key(x.q); }));
    qz.qs.filter(function(q){ return q.picked !== q.a; }).forEach(function(q){ var c = Object.assign({}, q, {picked: null}); if (!have.has(key(c))){ have.add(key(c)); bank.unshift({q: c, code: qz.code}); } });
    S.wb = bank.slice(0, 80);
  }
  function drop(S, q){ S.wb = (S.wb || []).filter(function(x){ return key(x.q) !== key(q); }); }
  function rows(S){
    var m = new Map();
    (S.wb || []).forEach(function(x){ if (!x || !x.q) return; var w = word(x), k = nbKey(x.code, w[0]), r = m.get(k);
      if (r){ r.pr = r.pr || w[1]; r.lo = r.lo || w[2]; } else m.set(k, {k: k, code: x.code, ko: w[0], pr: w[1], lo: w[2], wrong: 1}); });
    for (var k in S.star || {}){ var st = S.star[k], r = m.get(k);
      if (r){ r.star = 1; r.pr = r.pr || st[1]; r.lo = r.lo || st[2]; } else m.set(k, {k: k, code: st[3], ko: st[0], pr: st[1], lo: st[2], star: 1}); }
    return Array.from(m.values());
  }
  /* ☆ on / off for a word card's item {ko, pr, lo}; returns true when it is now kept */
  function star(S, code, it){ var k = nbKey(code, it.ko); S.star = S.star || {};
    if (S.star[k]) delete S.star[k]; else S.star[k] = [it.ko, it.pr || "", it.lo, code]; return !!S.star[k]; }
  /* ✕ in the list: the word leaves both the wrong list and the ☆ list */
  function del(S, k){ S.wb = (S.wb || []).filter(function(x){ return !(x && x.q && nbKey(x.code, word(x)[0]) === k); }); if (S.star) delete S.star[k]; }
  window.WB = {key: key, nbKey: nbKey, word: word, add: add, drop: drop, rows: rows, star: star, del: del};
})();
