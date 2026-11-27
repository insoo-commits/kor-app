// Builds the app from src/ and the bundle JSON.
//   node build.js [bundlesDir]     (bundlesDir defaults to ./data: one file per menu in src/meta.js areas; K8 · K9 bundles are inside K7.json and K6.json since v2.69)
// Output, in the repository root (served by GitHub Pages): index.html, app.js, sw.js, manifest.webmanifest, icon.svg, data/
//         preview/korean-app.html: the same app as one page, for a preview (not committed).
// Edit src/ and run this; do not edit the generated files. To release, change VER below (small change: bump the decimal).
const fs = require("fs"), path = require("path");
const root = __dirname, src = path.join(root, "src");
const bundles = process.argv[2] || path.join(root, "data");
const M = require(path.join(src, "meta.js"));
const VER = "2026-11-28 v2.94";
const STATS_PUBLIC = /const STATS_PUBLIC = true;/.test(fs.readFileSync(path.join(src, "stats.js"), "utf8"));
const read = f => fs.readFileSync(path.join(src, f), "utf8");
fs.mkdirSync(path.join(root, "data"), {recursive: true});
fs.mkdirSync(path.join(root, "preview"), {recursive: true});

// Lao names of the bundle titles (src/titles-lo.txt: "code | Lao"), shown in brackets in the lesson list
const tlo = new Map(fs.readFileSync(path.join(root, "src/titles-lo.txt"), "utf8").split("\n").filter(l => l.trim() && !l.startsWith("#")).map(l => l.split(" | ").map(x => x.trim())));
const idx = [], ALL = [];
// totals shown at the top (RYU 2026-11-15): lessons, distinct words (w+f headwords), distinct Korean sentences
const wordSet = new Set(), sentSet = new Set();
for (const [a] of M.areas){
  const list = JSON.parse(fs.readFileSync(path.join(bundles, a + ".json"), "utf8"));
  /* 도움말 > 학습 통계 · 의견 보내기 (src/statspage.json, like KoJey; RYU 2026-11-26, v2.68): HP-C pages only when src/stats.js has STATS_PUBLIC = true */
  if (a === "HP"){ for (let i = list.length - 1; i >= 0; i--) if (list[i].code.startsWith("HP-C-")) list.splice(i, 1); if (STATS_PUBLIC) list.push(...JSON.parse(read("statspage.json"))); }
  for (const b of list){
    idx.push([b.code, b.t, b.lv, b.info ? "info" : b.type, tlo.get(b.code) || "", (b.w || []).length + (b.f || []).length, [].concat(b.w || [], b.f || []).reduce((t, w) => t + ((w[3] || []).length), 0) + (b.dl || []).length + (b.e || []).length]);
    for (const k of ["w", "f"]) for (const w of b[k] || []){ wordSet.add(w[0]); for (const e of w[3] || []) sentSet.add(e[0]); }
    for (const d of b.dl || []) sentSet.add(d[1]);
    for (const k of ["c", "e", "x"]) for (const r of b[k] || []) if (typeof r[0] === "string") sentSet.add(r[0]);
    if (!tlo.get(b.code)) console.warn("no Lao title for " + b.code);
    if (!M.subs[b.code.slice(0, 4)]) throw new Error("no sub-group name for " + b.code);
  }
  fs.writeFileSync(path.join(root, "data", a + ".json"), JSON.stringify(list));
  ALL.push(...list);
}
/* related lessons (like lao-app's 관련 묶음, RYU 2026-11-18): lessons that share this lesson's words, rarer words count more;
   a word that is a headword there counts double. Up to 5, best first. */
const REL = {};
{
  const heads = b => [...new Set([].concat(b.w || [], b.f || []).map(w => w[0].replace(/\(.*?\)|[①-⑩]/g, "").trim()).filter(w => w.length >= 2))];
  const H = new Map(ALL.filter(b => !b.info).map(b => [b.code, new Set(heads(b))]));
  const TX = new Map(ALL.filter(b => !b.info).map(b => [b.code, JSON.stringify([[].concat(b.w || [], b.f || []).map(w => [w[0], (w[3] || []).map(e => e[0])]), b.dl && b.dl.map(d => d[1]), b.e && b.e.map(e => e[0])])]));
  const N = TX.size, DF = new Map();
  const df = w => { if (!DF.has(w)){ let n = 0; for (const t of TX.values()) if (t.includes(w)) n++; DF.set(w, n); } return DF.get(w); };
  const idf = w => { const d = df(w); return d > 40 ? 0 : Math.log(N / d); };
  for (const b of ALL){
    if (b.code.startsWith("K1-") || b.info) continue;   // info pages (대한민국) get no related lessons   // letters and sounds: shared words there are only samples
    const A = H.get(b.code), TA = TX.get(b.code), sc = {};
    A.forEach(w => { const f = idf(w); if (!f) return; for (const [k, t] of TX){ if (k === b.code || k.startsWith("K1-") || !t.includes(w)) continue; sc[k] = (sc[k] || 0) + f * (H.get(k).has(w) ? 2 : 1); } });
    for (const [k, hs] of H){ if (k === b.code || k.startsWith("K1-")) continue; hs.forEach(w => { if (A.has(w) || !TA.includes(w)) return; const f = idf(w); if (f) sc[k] = (sc[k] || 0) + f * 0.7; }); }
    const top = Object.keys(sc).filter(k => sc[k] >= 3).sort((x, y) => sc[y] - sc[x]).slice(0, 5);
    if (top.length) REL[b.code] = top;
  }
}
const SUBPIC = fs.existsSync(path.join(__dirname, "data", "subpics.json")) ? fs.readFileSync(path.join(__dirname, "data", "subpics.json"), "utf8") : "{}";   // one picture per sub-group (tools/pics/subpics.py, RYU 2026-11-24)
const meta = "window.KO_SUBPIC=" + SUBPIC + ";\n" + "window.KO_META=" + JSON.stringify({areas: M.areas, alias: M.alias || {}, seps: M.seps || [], subAlias: M.subAlias || {}, subArea: M.subArea || {}, parts: M.parts || {}, subs: M.subs, idx, rel: REL, ver: VER, nWords: wordSet.size, nSents: sentSet.size}) + ";";
// iPad / large touch screens (html.tab, set by the same check as the Lao app): text bigger, layout width unchanged.
// Every px font-size in app.css gets an html.tab copy scaled by TAB_K, inside the same @media block (RYU 2026-11-14, v0.96).
const TAB_K = 1.2;
function tabCss(src){
  const s = src.replace(/\/\*[\s\S]*?\*\//g, ""), out = [];
  const pre = sel => sel.split(",").map(x => x.trim()).filter(Boolean).map(x => /^(html|:root)\b/.test(x) ? x.replace(/^(html|:root)/, "html.tab") : "html.tab " + x).join(",");
  const rule = (sel, decl) => { const m = [...decl.matchAll(/font-size:\s*([\d.]+)px/g)].pop(); return m ? pre(sel) + "{font-size:" + (+(m[1] * TAB_K).toFixed(2)) + "px}" : ""; };
  let i = 0;
  const block = (end) => { const r = []; while (i < s.length){ while (/\s/.test(s[i] || "")) i++; if (i >= s.length || s[i] === "}"){ i++; break; }
      const o = s.indexOf("{", i); if (o < 0){ i = s.length; break; } const head = s.slice(i, o).trim(); i = o + 1;
      if (head.startsWith("@media")){ const inner = block(); if (inner.length) r.push(head + "{" + inner.join("") + "}"); }
      else if (head.startsWith("@")){ let d = 1; while (i < s.length && d){ if (s[i] === "{") d++; else if (s[i] === "}") d--; i++; } }
      else { const c = s.indexOf("}", i); const x = rule(head, s.slice(i, c)); if (x) r.push(x); i = c + 1; } }
    return r; };
  while (i < s.length){ const r = block(); out.push(...r); }
  return "\n/* tablet text (generated) */\nhtml.tab{zoom:1}\n" + out.join("\n");
}
const css = read("app.css") + tabCss(read("app.css")) + "\n" + read("tab.css") + "\n" + read("skin.css") + "\n" + read("intro.css"), body = read("body.html"), clip = read("clip.js"), js = clip + "\n" + read("audiopack.js") + "\n" + read("stats.js") + "\n" + read("app.js") + "\n" + read("intro.js");

// audio: audio/list.json = every clip the app can use; audio/index.js = the clips that exist as mp3 in audio/
const {cleanKo, cleanLo, clipKey} = new Function(clip + "; return {cleanKo, cleanLo, clipKey};")();
const clips = new Map(), lessons = []; let cur = null;   // lessons: the clips of each lesson, for the audio packs
function want(lang, raw){
  const text = lang === "lo" ? cleanLo(raw) : cleanKo(raw);
  if (!text) return;
  const key = clipKey(lang, text), had = clips.get(key);
  if (had && had.text !== text) throw new Error("clip name clash: " + had.text + " / " + text);
  clips.set(key, {key, lang, text}); cur.push(key);
}
for (const [a] of M.areas) for (const b of JSON.parse(fs.readFileSync(path.join(root, "data", a + ".json"), "utf8"))){
  lessons.push([b.code, cur = []]);
  (b.l || []).forEach(l => want("ko", l[2] || l[0]));
  [].concat(b.w || [], b.f || []).forEach(w => { want("ko", w[0]); want("lo", w[2]); (w[3] || []).forEach(e => { want("ko", e[0]); want("lo", e[2]); }); });   // example Lao too: played once after the Korean (RYU 2026-11-16)
  (b.c || []).forEach(c => { want("ko", c[1]); want("lo", c[3]); });
  (b.e || []).forEach(e => { want("ko", e[0]); want("lo", e[2]); });
  (b.dl || []).forEach(d => { want((b.mv || []).includes(d[0]) ? "km" : "ko", d[1]); if (b.type === "듣기") want("lo", d[2]); });   // 듣기연습: second speaker in a man's voice, Lao meaning voiced too (v2.45)
  (b.tq || []).forEach(q => (q.au || []).forEach(l => want(l[0] === "m" ? "km" : "ko", l[1])));   // TOPIK listening: 남자 lines in a man's voice
}
fs.mkdirSync(path.join(root, "audio"), {recursive: true});
fs.writeFileSync(path.join(root, "audio/list.json"), JSON.stringify([...clips.values()], null, 0).replace(/\},\{/g, "},\n{"));
const have = fs.readdirSync(path.join(root, "audio")).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)).filter(k => clips.has(k)).sort();
/* audio/p/<code>.bin: one pack per lesson (tools/audiopack.js, v2.65, same as kor-app-en v0.5). AUDIO_INDEX = clip -> its home pack, AUDIO_PACKS = [code, hash] */
const AP = require(path.join(root, "tools/audiopack.js")).writePacks(path.join(root, "audio"), lessons);
fs.writeFileSync(path.join(root, "audio/index.js"), "window.AUDIO_INDEX=" + (have.length ? JSON.stringify(AP.index) : "null") + ";\nwindow.AUDIO_PACKS=" + JSON.stringify(AP.packs) + ";\n");
console.log("audio packs", AP.packs.length, "clips", Object.keys(AP.index).length, "of", have.length);
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&family=Noto+Sans+Lao+Looped:wght@400;600&display=swap">';

// standalone site
fs.writeFileSync(path.join(root, "app.js"), meta + "\nwindow.KO_SW=true;\n" + js);
fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="lo"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>PhasaKAO</title>
<meta name="description" content="ແອັບຮຽນພາສາເກົາຫຼີສຳລັບຄົນລາວ">
<link rel="manifest" href="manifest.webmanifest"><meta name="apple-mobile-web-app-title" content="PhasaKAO"><meta name="application-name" content="PhasaKAO"><meta name="theme-color" content="#1F5F8F">
<link rel="icon" href="icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">${fonts}
<script>(function(){var n=navigator,t=n.maxTouchPoints>0||"ontouchstart" in window;if((/iPad/.test(n.userAgent)||(/Macintosh/.test(n.userAgent)&&t))||(t&&Math.min(screen.width,screen.height)>=700))document.documentElement.classList.add("tab")})()</script>
<style>body{margin:0}
${css}</style></head>
<body>
${body}
<script src="audio/index.js?v=${encodeURIComponent(VER)}"></script>
<script src="app.js?v=${encodeURIComponent(VER)}"></script>
</body></html>
`);
fs.writeFileSync(path.join(root, "manifest.webmanifest"), JSON.stringify({
  name: "PhasaKAO", short_name: "PhasaKAO", start_url: "./", display: "standalone", background_color: "#F3F4F2", theme_color: "#1F5F8F",
  icons: [{src: "icon-192.png", sizes: "192x192", type: "image/png"}, {src: "icon-512.png", sizes: "512x512", type: "image/png"}, {src: "icon.svg", sizes: "any", type: "image/svg+xml"}]
}, null, 1));
fs.writeFileSync(path.join(root, "icon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#1F5F8F"/><text x="256" y="340" text-anchor="middle" font-family="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif" font-weight="700" font-size="280" fill="#fff">한</text></svg>`);
fs.writeFileSync(path.join(root, ".nojekyll"), "");
fs.writeFileSync(path.join(root, "sw.js"), `const SHELL="ko-shell-${VER.replace(/\s+/g, "-")}";
const FILES=["./","index.html","app.js","audio/index.js","manifest.webmanifest","icon.svg",${M.areas.map(a => '"data/' + a[0] + '.json"').join(",")}];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:"reload"})).then(r=>{if(r.ok)return c.put(f,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("ko-shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Audio clips are kept in IndexedDB ("ko-audio" / store "c", key = clip name), not CacheStorage: with thousands of entries iPhone is slow to open CacheStorage (lesson from the Lao app). */
let _db;const ADB=()=>_db||(_db=new Promise((res,rej)=>{const r=indexedDB.open("ko-audio",1);r.onupgradeneeded=()=>r.result.createObjectStore("c");r.onsuccess=()=>res(r.result);r.onerror=()=>{_db=null;rej(r.error)}}));
const aget=k=>ADB().then(db=>new Promise(res=>{const q=db.transaction("c").objectStore("c").get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})).catch(()=>null);
const aput=(k,v)=>ADB().then(db=>new Promise(res=>{const tx=db.transaction("c","readwrite");tx.objectStore("c").put(v,k);tx.oncomplete=()=>res(true);tx.onerror=tx.onabort=()=>res(false)})).catch(()=>false);
const mp3=b=>new Response(b,{headers:{"Content-Type":"audio/mpeg","Content-Length":String(b.byteLength)}});
/* app files: network first so updates show right away; when offline, answer from the cache */
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.includes("/audio/p/"))return;   /* lesson packs: the app keeps them in IndexedDB itself (v2.65) */
  if(u.pathname.includes("/audio/")&&u.pathname.endsWith(".mp3")){const k=u.pathname.split("/").pop().slice(0,-4);
    e.respondWith(aget(k).then(b=>b?mp3(b):fetch(e.request.url).then(r=>{if(r.ok){const cl=r.clone();e.waitUntil(cl.arrayBuffer().then(b=>aput(k,b)).catch(()=>{}))}return r})));return}
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const cl=r.clone();caches.open(SHELL).then(c=>c.put(e.request.mode==="navigate"?"index.html":e.request,cl))}return r})
    .catch(()=>caches.open(SHELL).then(c=>c.match(e.request.mode==="navigate"?"index.html":e.request,{ignoreSearch:true}).then(m=>m||c.match("index.html")))))});
`);

// preview page (same app, one file plus data/)
fs.writeFileSync(path.join(root, "preview/korean-app.html"), `<title>PhasaKAO</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>
${css}</style>
${body}
<script>${meta}window.AUDIO_INDEX=null;</script>
<script>
${js}</script>
`);
console.log("bundles", idx.length, "site and preview written");
