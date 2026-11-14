// Builds the app from src/ and the bundle JSON.
//   node build.js [bundlesDir]     (bundlesDir defaults to ./data, which holds K1.json … K9.json)
// Output, in the repository root (served by GitHub Pages): index.html, app.js, sw.js, manifest.webmanifest, icon.svg, data/
//         preview/korean-app.html: the same app as one page, for a preview (not committed).
// Edit src/ and run this; do not edit the generated files. To release, change VER below (small change: bump the decimal).
const fs = require("fs"), path = require("path");
const root = __dirname, src = path.join(root, "src");
const bundles = process.argv[2] || path.join(root, "data");
const M = require(path.join(src, "meta.js"));
const VER = "2026-11-14 v0.64";
const read = f => fs.readFileSync(path.join(src, f), "utf8");
fs.mkdirSync(path.join(root, "data"), {recursive: true});
fs.mkdirSync(path.join(root, "preview"), {recursive: true});

// Lao names of the bundle titles (src/titles-lo.txt: "code | Lao"), shown in brackets in the lesson list
const tlo = new Map(fs.readFileSync(path.join(root, "src/titles-lo.txt"), "utf8").split("\n").filter(l => l.trim() && !l.startsWith("#")).map(l => l.split(" | ").map(x => x.trim())));
const idx = [];
for (const [a] of M.areas){
  const list = JSON.parse(fs.readFileSync(path.join(bundles, a + ".json"), "utf8"));
  for (const b of list){
    idx.push([b.code, b.t, b.lv, b.type, tlo.get(b.code) || ""]);
    if (!tlo.get(b.code)) console.warn("no Lao title for " + b.code);
    if (!M.subs[b.code.slice(0, 4)]) throw new Error("no sub-group name for " + b.code);
  }
  fs.writeFileSync(path.join(root, "data", a + ".json"), JSON.stringify(list));
}
const meta = "window.KO_META=" + JSON.stringify({areas: M.areas, subs: M.subs, idx, ver: VER}) + ";";
const css = read("app.css"), body = read("body.html"), clip = read("clip.js"), js = clip + "\n" + read("app.js");

// audio: audio/list.json = every clip the app can use; audio/index.js = the clips that exist as mp3 in audio/
const {cleanKo, cleanLo, clipKey} = new Function(clip + "; return {cleanKo, cleanLo, clipKey};")();
const clips = new Map();
function want(lang, raw){
  const text = lang === "lo" ? cleanLo(raw) : cleanKo(raw);
  if (!text) return;
  const key = clipKey(lang, text), had = clips.get(key);
  if (had && had.text !== text) throw new Error("clip name clash: " + had.text + " / " + text);
  clips.set(key, {key, lang, text});
}
for (const [a] of M.areas) for (const b of JSON.parse(fs.readFileSync(path.join(root, "data", a + ".json"), "utf8"))){
  (b.l || []).forEach(l => want("ko", l[2] || l[0]));
  [].concat(b.w || [], b.f || []).forEach(w => { want("ko", w[0]); want("lo", w[2]); (w[3] || []).forEach(e => want("ko", e[0])); });
  (b.c || []).forEach(c => want("ko", c[1]));
  (b.e || []).forEach(e => want("ko", e[0]));
  (b.dl || []).forEach(d => want("ko", d[1]));
}
fs.mkdirSync(path.join(root, "audio"), {recursive: true});
fs.writeFileSync(path.join(root, "audio/list.json"), JSON.stringify([...clips.values()], null, 0).replace(/\},\{/g, "},\n{"));
const have = fs.readdirSync(path.join(root, "audio")).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)).filter(k => clips.has(k)).sort();
fs.writeFileSync(path.join(root, "audio/index.js"), "window.AUDIO_INDEX=" + (have.length ? JSON.stringify(Object.fromEntries(have.map(k => [k, 1]))) : "null") + ";\n");
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&family=Noto+Sans+Lao+Looped:wght@400;600&display=swap">';

// standalone site
fs.writeFileSync(path.join(root, "app.js"), meta + "\nwindow.KO_SW=true;\n" + js);
fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="lo"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>KOR Lang</title>
<meta name="description" content="ແອັບຮຽນພາສາເກົາຫຼີສຳລັບຄົນລາວ">
<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#1F5F8F">
<link rel="icon" href="icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">${fonts}
<style>body{margin:0}
${css}</style></head>
<body>
${body}
<script src="audio/index.js?v=${encodeURIComponent(VER)}"></script>
<script src="app.js?v=${encodeURIComponent(VER)}"></script>
</body></html>
`);
fs.writeFileSync(path.join(root, "manifest.webmanifest"), JSON.stringify({
  name: "KOR Lang", short_name: "KOR Lang", start_url: "./", display: "standalone", background_color: "#F3F4F2", theme_color: "#1F5F8F",
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
  if(u.pathname.includes("/audio/")&&u.pathname.endsWith(".mp3")){const k=u.pathname.split("/").pop().slice(0,-4);
    e.respondWith(aget(k).then(b=>b?mp3(b):fetch(e.request.url).then(r=>{if(r.ok){const cl=r.clone();e.waitUntil(cl.arrayBuffer().then(b=>aput(k,b)).catch(()=>{}))}return r})));return}
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const cl=r.clone();caches.open(SHELL).then(c=>c.put(e.request.mode==="navigate"?"index.html":e.request,cl))}return r})
    .catch(()=>caches.open(SHELL).then(c=>c.match(e.request.mode==="navigate"?"index.html":e.request,{ignoreSearch:true}).then(m=>m||c.match("index.html")))))});
`);

// preview page (same app, one file plus data/)
fs.writeFileSync(path.join(root, "preview/korean-app.html"), `<title>KOR Lang</title>
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
