// 도움말 screenshots (like KoJey tools/help_shots.js, v2.69): img/help/<name>.jpg and <name>-d.jpg (dark) + img/help/sizes.json.
// Run with the site served at http://localhost:8765 (python3 -m http.server 8765), then: node tools/help_shots.js && node tools/help_info.js && node build.js
const {chromium} = require("playwright"), fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "../img/help/"), SIZES = {};
fs.mkdirSync(OUT, {recursive: true});
const badge = (p, list) => p.evaluate(list => { document.querySelectorAll(".hsb").forEach(e => e.remove());
  list.forEach(([sel, n, dx, dy]) => { const e = document.querySelector(sel); if (!e) return; const r = e.getBoundingClientRect();
    const d = document.createElement("div"); d.className = "hsb"; d.textContent = n;
    Object.assign(d.style, {position: "absolute", left: (r.left + scrollX + (dx || -8)) + "px", top: (r.top + scrollY + (dy || -9)) + "px", width: "22px", height: "22px", borderRadius: "50%", background: "#E0312B", color: "#fff", font: "700 13px/22px system-ui,sans-serif", textAlign: "center", zIndex: 99999, boxShadow: "0 1px 3px rgba(0,0,0,.35)"});
    document.body.appendChild(d); }); }, list);
const rect = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return {x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height}; }, sel);
async function shot(p, name, sfx, clip, scale){ await p.waitForTimeout(400); await p.screenshot({path: OUT + name + sfx, type: "jpeg", quality: 82, clip, fullPage: true});
  SIZES[name] = [Math.round(clip.width * scale), Math.round(clip.height * scale)]; }
const today = () => { const d = new Date(), f = x => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); const y = new Date(d); y.setDate(d.getDate() - 1); const z = new Date(d); z.setDate(d.getDate() - 2); return [f(z), f(y), f(d)]; };
async function run(b, theme){
  const sfx = theme === "dark" ? "-d.jpg" : ".jpg", [d0, d1, d2] = today();
  const state = {code: "K2-A-02", theme, sayLo: true, seen: {"K2-A-01": d0, "K2-A-02": d1, "K2-A-03": d1, "K2-A-04": d2, "K1-A-01": d2, "K1-A-02": d2}, days: [d0, d1, d2], td: {d: d2, l: 3, q: 1},
    wb: [{code: "K2-A-02", q: {kind: "mean", q: "죄송합니다", say: "죄송합니다", toLo: true, a: "ຂໍໂທດ", opts: ["ຂໍໂທດ", "ຂອບໃຈ", "ສະບາຍດີ", "ລາກ່ອນ"], picked: null}}]};
  const mk = async opts => { const c = await b.newContext(Object.assign({viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: theme}, opts || {}));
    await c.addInitScript(st => { try { localStorage.setItem("kolearn-v1", JSON.stringify(st)); localStorage.setItem("kolearn-lo-survey", JSON.stringify({later: "2999-01-01"})); } catch (e) {} }, state);
    await c.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = "#kbinfo,kbd.kc{display:none!important}"; document.head.appendChild(st); }); });
    await c.route("https://script.google.com/**", r => r.abort()); return c; };
  let c = await mk(), p = await c.newPage();
  await p.goto("http://localhost:8765/#K2-A-02"); await p.waitForTimeout(2500);
  // my study card
  let m = await rect(p, "#mine"); await shot(p, "mine", sfx, {x: 0, y: m.y - 10, width: 390, height: m.h + 20}, 2);
  // menu
  const g = await rect(p, "#groups"), bs = await rect(p, "#bselBtn");
  await badge(p, [["#groups", 1, -6, -10], ["#subs", 2, -6, -8], ["#bselBtn", 3, -6, -9]]);
  await shot(p, "menu", sfx, {x: 0, y: g.y - 22, width: 390, height: 190.5}, 2);
  await badge(p, []); await p.click("#bselBtn"); await p.waitForTimeout(500);
  await badge(p, [["#bselBtn", 3, -6, -9]]); await shot(p, "lessons", sfx, {x: 0, y: bs.y - 12, width: 390, height: 262}, 2);
  await p.click("#bselBtn"); await badge(p, []);
  let ct = await rect(p, "#controls");
  await badge(p, [["#m-learn", 1, -8, -10], ["#m-cards", 2, -8, -10], ["#m-quiz", 3, -8, -10]]);
  await shot(p, "sentences", sfx, {x: 0, y: ct.y - 14, width: 390, height: 470}, 2);
  await badge(p, [["#repSel", 1, -10, -12], ["#rateSel", 2, -10, -12], ["#loChk", 3, -16, -14]]);
  await p.evaluate(() => { const bs = [...document.querySelectorAll("#ctlrep button.tbtn")]; bs.forEach((e, i) => { const r = e.getBoundingClientRect(); const d = document.createElement("div"); d.className = "hsb"; d.textContent = String(4 + i);
    Object.assign(d.style, {position: "absolute", left: (r.left + scrollX - 12) + "px", top: (r.top + scrollY + r.height - 14) + "px", width: "22px", height: "22px", borderRadius: "50%", background: "#E0312B", color: "#fff", font: "700 13px/22px system-ui,sans-serif", textAlign: "center", zIndex: 99999}); document.body.appendChild(d); }); });
  ct = await rect(p, "#controls"); await shot(p, "controls", sfx, {x: 0, y: ct.y - 12, width: 390, height: ct.h + 24}, 2); await badge(p, []);
  await p.click("#m-cards"); await p.waitForTimeout(800); ct = await rect(p, "#controls");
  await shot(p, "cards", sfx, {x: 0, y: ct.y - 2, width: 390, height: 420}, 2);
  await p.click("#m-quiz"); await p.waitForTimeout(800); ct = await rect(p, "#controls");
  await shot(p, "quiz", sfx, {x: 0, y: ct.y - 2, width: 390, height: 560}, 2);
  // quiz result: answer all, some wrong
  for (let i = 0; i < 12; i++){ const ch = await p.$$(".choice:not([disabled])"); if (!ch.length) break; await ch[i % 3 ? 0 : ch.length - 1].click(); await p.waitForTimeout(120);
    const n = await p.$('.rowbtns[style*="flex-end"] .btn.primary'); if (n) await n.click(); await p.waitForTimeout(120); }
  await p.waitForTimeout(1200); const qe = await rect(p, ".qend");
  await shot(p, "result", sfx, {x: 0, y: qe.y - 10, width: 390, height: 520}, 2);
  // save line and theme row at the bottom
  await p.click("#m-learn"); await p.waitForTimeout(500);
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight)); await p.waitForTimeout(600);
  const pr = await rect(p, "#prefs"); await shot(p, "prefs", sfx, {x: 0, y: pr.y - 10, width: 390, height: pr.h + 20}, 2);
  const dl = await rect(p, "#dlbox"), H = await p.evaluate(() => document.documentElement.scrollHeight);
  await shot(p, "save", sfx, {x: 0, y: Math.min(dl.y - 20, H - 200), width: 390, height: 200}, 2);
  await c.close();
  // listening
  c = await mk(); p = await c.newPage(); await p.goto("http://localhost:8765/#LS-B-01"); await p.waitForTimeout(2500);
  ct = await rect(p, "#controls"); await shot(p, "listening", sfx, {x: 0, y: ct.y - 2, width: 390, height: 560}, 2); await c.close();
  // keyboard (computer)
  c = await mk({viewport: {width: 1000, height: 900}, deviceScaleFactor: 1, isMobile: false, hasTouch: false}); p = await c.newPage();
  await p.goto("http://localhost:8765/#K2-A-01"); await p.waitForTimeout(2500);
  ct = await rect(p, "#controls"); await shot(p, "keyboard", sfx, {x: ct.x, y: ct.y, width: ct.w, height: ct.h}, 1); await c.close();
}
(async () => { const b = await chromium.launch(); for (const t of ["light", "dark"]) await run(b, t); await b.close();
  fs.writeFileSync(OUT + "sizes.json", JSON.stringify(SIZES)); console.log("done", Object.keys(SIZES).join(" ")); })();
