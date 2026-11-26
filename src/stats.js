/* ---------- anonymous usage statistics (RYU 2026-11-25, v1.3) ----------
   Copied from KoJey (kor-app-en v1.3), RYU 2026-11-26 (v2.68): how many devices use the app, which lessons they open, quiz scores.
   No names, no e-mail: each device gets a random id. Events wait in this device's storage and are sent in small
   batches to a Google Sheet (tools/stats/Code.gs, an Apps Script web app); offline they are sent later.
   STATS_URL empty = nothing is recorded. */
const STATS_URL = "https://script.google.com/macros/s/AKfycbzWGHS_COZ7w2fJ02L6mzJ_jfhOekECXCmB5E03Fja3ozVJ2tq3NLEfv_dWorpfcXWO/exec";   // RYU 2026-11-26: own sheet (a copy of the KoJey sheet)
const ST = (() => {
  const QK = "kolearn-lo-stats", IK = "kolearn-lo-id", MAX = 400;
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let id = get(IK);
  if (!id){ id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, "").slice(0, 16); put(IK, id); }
  const ua = navigator.userAgent;
  const os = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "ChromeOS" : /Linux/.test(ua) ? "Linux" : "other";
  const dev = /iPad/.test(ua) || (os === "iOS" && !/iPhone|iPod/.test(ua)) || (os === "Android" && !/Mobile/.test(ua)) ? "tablet" : /iPhone|iPod|Mobile/.test(ua) ? "phone" : "computer";
  const pwa = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const load = () => { try { const q = JSON.parse(get(QK) || "[]"); return Array.isArray(q) ? q : []; } catch (e) { return []; } };
  const stamp = () => { const d = new Date(), z = -d.getTimezoneOffset(), p = n => String(Math.abs(n)).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()) + (z < 0 ? "-" : "+") + p(z / 60 | 0) + ":" + p(z % 60); };
  let busy = false;
  function log(ev, code, a, b){
    if (!STATS_URL) return;
    const q = load(); q.push([stamp(), ev, code || "", a == null ? "" : a, b == null ? "" : b]);
    put(QK, JSON.stringify(q.slice(-MAX)));
  }
  function send(beacon){
    if (!STATS_URL || busy || !navigator.onLine) return;
    const q = load(); if (!q.length) return;
    const n = Math.min(q.length, 100), body = JSON.stringify({id, v: (window.KO_META || {}).ver || "", dev, os, pwa, lang: navigator.language || "", ev: q.slice(0, n)});
    const done = () => { const r = load(); put(QK, JSON.stringify(r.slice(n))); };
    if (beacon && navigator.sendBeacon){ if (navigator.sendBeacon(STATS_URL, new Blob([body], {type: "text/plain"}))) done(); return; }
    busy = true;   // text/plain + no-cors: no preflight; the answer cannot be read, a network error rejects
    fetch(STATS_URL, {method: "POST", mode: "no-cors", body, keepalive: body.length < 60000}).then(() => { done(); busy = false; if (load().length) setTimeout(send, 2000); }, () => { busy = false; });
  }
  if (STATS_URL){
    log("open", "", dev, pwa ? "installed" : "browser");
    setTimeout(send, 4000); setInterval(send, 60000);
    addEventListener("online", () => send());
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") send(true); });
  }
  let last = "";
  return {log, send, meta: () => ({id, v: (window.KO_META || {}).ver || "", dev, os, pwa, lang: navigator.language || ""}), lesson(code){ if (code && code !== last){ last = code; log("lesson", code); } }};
})();

/* ---------- public statistics page (도움말 > 사용 통계, RYU 2026-11-25, v1.3) ----------
   Only totals that the sheet's Apps Script adds up (doGet ?stats=1): no device ids, no single person's scores.
   STATS_PUBLIC false = build.js leaves the page out of the menu. Charts are drawn here as SVG (works offline,
   follows the light / dark colors). The last numbers are kept on the device so the page also opens offline. */
const STATS_PUBLIC = true;   // RYU 2026-11-25: show the stats page (도움말 > 사용 통계)
const STP = (() => {
  const CK = "kolearn-lo-statspage", NS = "http://www.w3.org/2000/svg";
  const AC = {K1: "var(--k1)", K2: "var(--k2)", K3: "var(--k3)", K4: "var(--k4)", K5: "var(--k5)", K6: "var(--k6)", K7: "var(--k7)", K8: "var(--k8)", K9: "var(--k9)", LS: "var(--k7)", TP: "var(--k3)", KR: "var(--k5)", JB: "var(--k4)", HP: "var(--muted)"};
  const PAL = ["var(--k1)", "var(--k2)", "var(--k3)", "var(--k4)", "var(--k6)", "var(--k7)", "var(--k5)", "var(--k8)"];
  const fmt = n => n == null || n === "" ? "–" : Number(n).toLocaleString("en-US");
  function el(tag, at, ...k){ const e = document.createElement(tag);   // own small builder: app.js keeps its h() inside its own scope
    for (const n in at || {}) e.setAttribute(n, at[n]);
    for (const c of k.flat(9)) if (c != null && c !== false) e.append(c.nodeType ? c : String(c));
    return e; }
  function svg(w, hgt, kids){ const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 " + w + " " + hgt); s.setAttribute("class", "stsvg"); s.setAttribute("role", "img");
    for (const k of kids.flat()) if (k) s.appendChild(k); return s; }
  function sv(tag, at, text){ const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (text != null) e.textContent = text; return e; }
  const card = (title, ko, body, wide) => el("section", {class: "stcard" + (wide ? " wide" : "")}, el("h3", null, title, " ", el("span", {class: "ko"}, ko)), body);
  /* bars over time + a line (two series), labels every few columns */
  function timeChart(rows, aName, bName){
    const W = CW, H = Math.round(Math.min(260, Math.max(200, CW * .3))), L = 34, B = 26, T = 12, n = rows.length || 1, bw = (W - L - 8) / n;
    const maxA = Math.max(1, ...rows.map(r => r[1])), maxB = Math.max(1, ...rows.map(r => r[2]));
    const y = (v, m) => T + (H - T - B) * (1 - v / m), k = [];
    for (let g = 0; g <= 4; g++){ const v = Math.round(maxA * g / 4), yy = y(v, maxA); k.push(sv("line", {x1: L, x2: W - 4, y1: yy, y2: yy, class: "stgrid"}), sv("text", {x: L - 6, y: yy + 4, class: "stax", "text-anchor": "end"}, fmt(v))); }
    rows.forEach((r, i) => { const x = L + i * bw, hh = H - B - y(r[1], maxA);
      k.push(sv("rect", {x: x + bw * .15, y: y(r[1], maxA), width: Math.max(1, bw * .7), height: Math.max(0, hh), rx: 2, style: "fill:var(--k1)"}, null));
      k[k.length - 1].appendChild(sv("title", {}, r[0] + " · " + aName + " " + r[1] + " · " + bName + " " + r[2]));
      const step = Math.ceil(n / Math.max(3, Math.floor(CW / 70))); if (i % step === 0 || i === n - 1) k.push(sv("text", {x: x + bw / 2, y: H - 8, class: "stax", "text-anchor": "middle"}, r[0].length > 7 ? r[0].slice(5) : r[0])); });
    const pts = rows.map((r, i) => (L + i * bw + bw / 2) + "," + y(r[2], maxB)).join(" ");
    if (rows.length > 1) k.push(sv("polyline", {points: pts, class: "stline"}));
    rows.forEach((r, i) => k.push(sv("circle", {cx: L + i * bw + bw / 2, cy: y(r[2], maxB), r: rows.length > 40 ? 1.5 : 3, class: "stdot"})));
    return el("div", null, svg(W, H, k), el("div", {class: "stleg"}, el("span", {class: "sw", style: "background:var(--k1)"}), aName, el("span", {class: "sw ln"}), bName + " (ແກນຂວາ, ສູງສຸດ " + fmt(maxB) + ")"));
  }
  /* horizontal bars: [label, value, color?, sub-label?] */
  function hbars(rows, unit){
    const max = Math.max(1, ...rows.map(r => r[1]));
    return el("div", {class: "sthb"}, rows.map((r, i) => el("div", {class: "sthr"},
      el("div", {class: "sthl"}, el("span", {class: "ko"}, r[0]), r[3] ? el("small", null, r[3]) : null),
      el("div", {class: "stht"}, el("i", {style: "width:" + (100 * r[1] / max).toFixed(1) + "%;background:" + (r[2] || PAL[i % PAL.length])})),
      el("b", null, fmt(r[1]) + (unit || "")))));
  }
  function donut(rows){
    const tot = rows.reduce((s, r) => s + r[1], 0) || 1, R = 70, C = 2 * Math.PI * R, k = []; let off = 0;
    rows.forEach((r, i) => { const len = C * r[1] / tot; k.push(sv("circle", {cx: 100, cy: 100, r: R, class: "stdn", style: "stroke:" + PAL[i % PAL.length], "stroke-dasharray": len + " " + (C - len), "stroke-dashoffset": -off, transform: "rotate(-90 100 100)"})); off += len; });
    k.push(sv("text", {x: 100, y: 98, class: "stdc", "text-anchor": "middle"}, fmt(tot)), sv("text", {x: 100, y: 118, class: "stax", "text-anchor": "middle"}, "ຜູ້ຮຽນ"));
    return el("div", {class: "stdnw"}, svg(200, 200, k), el("ul", {class: "stdl"}, rows.map((r, i) => el("li", null, el("span", {class: "sw", style: "background:" + PAL[i % PAL.length]}), r[0] + " ", el("b", null, Math.round(100 * r[1] / tot) + "%"), " (" + fmt(r[1]) + ")"))));
  }
  function vbars(rows, color){
    const W = CW, H = 170, B = 24, T = 16, n = rows.length, bw = (W - 8) / n, max = Math.max(1, ...rows.map(r => r[1])), k = [];
    rows.forEach((r, i) => { const hh = (H - B - T) * r[1] / max, x = 4 + i * bw;
      k.push(sv("rect", {x: x + bw * .12, y: H - B - hh, width: bw * .76, height: hh, rx: 3, style: "fill:" + (color || "var(--k2)")}));
      if (r[1] && n <= 12) k.push(sv("text", {x: x + bw / 2, y: H - B - hh - 4, class: "stax", "text-anchor": "middle"}, fmt(r[1])));
      if (n <= 12 || i % 3 === 0) k.push(sv("text", {x: x + bw / 2, y: H - 7, class: "stax", "text-anchor": "middle"}, r[0])); });
    return svg(W, H, k);
  }
  let CW = 640;   // chart width in px = the card width, so text keeps its size on a computer
  function draw(box, d){
    CW = Math.max(300, Math.min(1100, (box.clientWidth || 640) - 30));
    const t = d.totals || {}, KM = window.KO_META, titles = new Map(KM.idx.map(r => [r[0], [r[1], r[4]]])), areaName = new Map(KM.areas.map(a => [a[0], a[1]])), AL = KM.alias || {};
    if (d.areas){ const m = new Map(); for (const [k, v] of d.areas){ const a = AL[k] || k; m.set(a, (m.get(a) || 0) + v); } d.areas = [...m].sort((x, y) => y[1] - x[1]); }
    const tile = (v, en, ko, sub) => el("div", {class: "sttile"}, el("b", null, v), el("span", null, en), el("span", {class: "ko"}, ko), sub ? el("small", null, sub) : null);
    const kids = [
      el("div", {class: "sttiles"},
        tile(fmt(t.devices), "ຜູ້ຮຽນ", "학습자", "ອຸປະກອນ"), tile(fmt(t.returning), "ກັບມາອີກ", "다시 온 학습자", "2 ມື້ຂຶ້ນໄປ"),
        tile(fmt(t.lessons), "ບົດທີ່ເປີດ", "묶음 열람"), tile(t.perLearner == null ? "–" : t.perLearner, "ບົດຕໍ່ຜູ້ຮຽນ", "1인당 묶음"),
        tile(fmt(t.quizzes), "ແບບທົດສອບທີ່ເຮັດແລ້ວ", "퀴즈 완료"), tile(t.quizAvg == null ? "–" : t.quizAvg + "%", "ຄະແນນສະເລ່ຍ", "퀴즈 평균"),
        tile(fmt(t.topik), "ຊຸດ TOPIK", "TOPIK 연습"), tile(fmt(t.plays), "ການຫຼິ້ນສຽງ", "음성 재생"),
        t.speaks ? tile(fmt(t.speaks), "ຝຶກເວົ້າ", "말하기 연습", t.speakAvg == null ? null : "ສະເລ່ຍ " + t.speakAvg + "%") : null),
      d.daily && d.daily.length ? card("ທຸກມື້", "날마다", timeChart(d.daily, "ຜູ້ຮຽນ", "ບົດທີ່ເປີດ"), true) : null,
      d.monthly && d.monthly.length > 1 ? card("ທຸກເດືອນ", "달마다", timeChart(d.monthly, "ຜູ້ຮຽນ", "ບົດທີ່ເປີດ"), true) : null,
      d.top && d.top.length ? card("ບົດທີ່ເປີດຫຼາຍທີ່ສຸດ", "많이 본 묶음", hbars(d.top.slice(0, 10).map(r => { const ti = titles.get(r[0]); return [ti ? ti[0] : r[0], r[1], AC[r[0].split("-")[0]], (ti && ti[1] ? ti[1] + " · " : "") + r[0]]; })), true) : null,
      d.areas && d.areas.length ? card("ຕາມໝວດ", "영역별 열람", hbars(d.areas.map(r => [areaName.get(r[0]) || r[0], r[1], AC[r[0]]]))) : null,
      d.devices && d.devices.length ? card("ອຸປະກອນ", "기기", donut(d.devices)) : null,
      d.os && d.os.length ? card("ລະບົບປະຕິບັດການ", "운영체제", hbars(d.os)) : null,
      d.survey && d.survey.n ? card("ຄວາມພໍໃຈ", "만족도 설문", el("div", null, el("div", {class: "sttiles"}, tile(fmt(d.survey.n), "ຄຳຕອບ", "응답"), tile(d.survey.avg == null ? "–" : d.survey.avg + " ★", "ດາວສະເລ່ຍ", "평균 별점"), tile(d.survey.recPct == null ? "–" : d.survey.recPct + "%", "ຈະແນະນຳ", "추천 의향")), vbars(["★1", "★2", "★3", "★4", "★5"].map((l, i) => [l, d.survey.dist[i] || 0]), "var(--k5)"))) : null,
      d.quizHist && d.quizHist.some(Boolean) ? card("ຄະແນນແບບທົດສອບ", "퀴즈 점수 분포", vbars(["0–19%", "20–39%", "40–59%", "60–79%", "80–100%"].map((l, i) => [l, d.quizHist[i] || 0]), "var(--good)")) : null,
      d.hours && d.hours.some(Boolean) ? card("ເວລາຮຽນ (ເວລາເກົາຫຼີ)", "공부하는 시간", vbars(d.hours.map((v, i) => [String(i), v]), "var(--k6)"), true) : null,
      el("p", {class: "stnote"}, "ອັບເດດ " + (d.updated || "–") + (d.first ? " · ນັບຕັ້ງແຕ່ " + d.first : "") + ". ສະເພາະຍອດລວມ: ບໍ່ມີຊື່ ແລະ ບໍ່ມີຜົນຂອງຄົນໃດຄົນໜຶ່ງ. ", el("span", {class: "ko"}, "이름 없이 모은 전체 합계입니다."))];
    box.replaceChildren(el("div", {class: "stwrap"}, kids));
  }
  function page(box){ requestAnimationFrame(() => page2(box)); }   // after the page is on screen, so the cards have their width
  function page2(box){
    let old = null; try { old = JSON.parse(localStorage.getItem(CK) || "null"); } catch (e) {}
    if (window.__STATS_DEMO){ draw(box, window.__STATS_DEMO); return; }   // screenshots and tests only
    if (old) draw(box, old); else box.replaceChildren(el("p", {class: "empty"}, "ກຳລັງໂຫຼດສະຖິຕິ…"));
    if (!STATS_URL) return;
    fetch(STATS_URL + "?stats=1", {cache: "no-store"}).then(r => r.json()).then(d => { if (!d || !d.totals) throw 0; try { localStorage.setItem(CK, JSON.stringify(d)); } catch (e) {} if (box.isConnected) draw(box, d); })
      .catch(() => { if (!old && box.isConnected) box.replaceChildren(el("p", {class: "empty"}, "ໂຫຼດສະຖິຕິບໍ່ໄດ້. ກະລຸນາລອງໃໝ່ເມື່ອມີອິນເຕີເນັດ.")); });
  }
  return {page};
})();

/* ---------- short satisfaction survey (RYU 2026-11-25, v1.11) ----------
   Four questions: stars, most helpful menu, recommend to a friend, a free comment. Sent once per device to the same
   Apps Script (sheet "survey"); the public stats page shows only the totals (number of answers, average stars).
   Offered under the 내 학습 card after 5 lessons on 2 different days; "Later" asks again in 3 days; always open in 도움말. */
const SV = (() => {
  const DK = "kolearn-lo-survey", PK = "kolearn-lo-svq";
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  function el(tag, at, ...k){ const e = document.createElement(tag);
    for (const a in at || {}) if (at[a] != null){ if (a.startsWith("on")) e.addEventListener(a.slice(2), at[a]); else e.setAttribute(a, at[a]); }
    for (const x of k.flat(9)) if (x != null && x !== false) e.append(x.nodeType ? x : String(x)); return e; }
  const state = () => { try { return JSON.parse(get(DK) || "{}"); } catch (e) { return {}; } };
  const today = () => new Date().toISOString().slice(0, 10);
  function flush(){
    const p = get(PK); if (!p || !STATS_URL || !navigator.onLine) return;
    fetch(STATS_URL, {method: "POST", mode: "no-cors", body: p, keepalive: true}).then(() => put(PK, ""), () => {});
  }
  function form(box, inPage){
    const st = state();
    if (st.done){ box.replaceChildren(el("div", {class: "svcard svdone"},
      el("p", null, el("b", null, "ຂອບໃຈສຳລັບຄຳຕອບ! "), el("span", {class: "ko"}, "의견 고마워요!")))); return; }
    const a = {stars: 0, menu: "", rec: "", text: ""};
    const menus = ((window.KO_META || {}).areas || []).filter(x => x[0] !== "HP");
    const stars = el("div", {class: "svstars", role: "radiogroup", "aria-label": "ດາວ"});
    const more = el("div", {class: "svmore", hidden: ""});
    const chip = (grp, key, val, label) => el("button", {type: "button", class: "svchip", "data-v": val, onclick: ev => { a[key] = val;
      for (const b of grp.querySelectorAll(".svchip")) b.classList.toggle("on", b.dataset.v === val); }}, label);
    for (let i = 1; i <= 5; i++) stars.append(el("button", {type: "button", class: "svstar", "aria-label": i + " ດາວ", onclick: () => { a.stars = i;
      stars.querySelectorAll(".svstar").forEach((b, k) => b.classList.toggle("on", k < i)); more.hidden = false; }}, "★"));
    const mg = el("div", {class: "svchips"}); menus.forEach(m => mg.append(chip(mg, "menu", m[0], m[1])));
    const rg = el("div", {class: "svchips"}); [["yes", "ແມ່ນ 네"], ["maybe", "ບໍ່ແນ່ໃຈ 글쎄요"], ["no", "ບໍ່ 아니요"]].forEach(r => rg.append(chip(rg, "rec", r[0], r[1])));
    const ta = el("textarea", {class: "svtext", maxlength: "300", rows: "3", placeholder: "ຢາກໃຫ້ແອັບດີຂຶ້ນແນວໃດ? (ບໍ່ບັງຄັບ) 바라는 점 (선택)"});
    const send = () => {
      if (!a.stars) return;
      a.text = ta.value.trim().slice(0, 300);
      const m = ST.meta(); put(PK, JSON.stringify(Object.assign(m, {survey: a})));
      put(DK, JSON.stringify({done: today()})); flush(); form(box, inPage); if (!inPage) setTimeout(() => box.replaceChildren(), 4000);
    };
    more.append(
      el("p", {class: "svq"}, "ໝວດໃດຊ່ວຍໄດ້ຫຼາຍທີ່ສຸດ? ", el("span", {class: "ko"}, "가장 도움이 된 메뉴")), mg,
      el("p", {class: "svq"}, "ຈະແນະນຳແອັບນີ້ໃຫ້ໝູ່ບໍ່? ", el("span", {class: "ko"}, "친구에게 추천할래요?")), rg,
      ta, el("div", {class: "svbtns"}, el("button", {type: "button", class: "btn primary", onclick: send}, "ສົ່ງ ", el("span", {class: "ko"}, "보내기"))));
    box.replaceChildren(el("div", {class: "svcard"},
      inPage ? null : el("button", {type: "button", class: "svx", "aria-label": "ພາຍຫຼັງ", title: "ພາຍຫຼັງ 나중에", onclick: () => {
        const d = new Date(); d.setDate(d.getDate() + 3); put(DK, JSON.stringify({later: d.toISOString().slice(0, 10)})); box.replaceChildren(); }}, "×"),
      el("div", {class: "svhead"},
        el("p", {class: "svq"}, el("b", null, "ແອັບນີ້ເປັນແນວໃດ? "), el("span", {class: "ko"}, "이 앱 어때요?"))), stars, more));
  }
  /* offer it under the 내 학습 card: seen = lessons opened, days = study days */
  function offer(box, seen, days){
    if (!box || !STATS_URL) return; const st = state();
    if (st.done || (st.later && st.later > today()) || seen < 5 || days < 2){ if (!box.querySelector(".svmore:not([hidden])")) box.replaceChildren(); return; }
    if (!box.firstChild) form(box, false);
  }
  if (STATS_URL){ setTimeout(flush, 5000); addEventListener("online", flush); }
  return {form, offer};
})();
