/* Cloudflare Pages build (phasakao.pages.dev (was kor4lao.pages.dev)): copies the site into cf/ without the single mp3 clips, which the app no longer
   loads (it plays from the lesson packs in audio/p/). Keeps the site far under the free plan's 20,000 files (RYU 2026-11-25).
   Cloudflare settings: Build command  node tools/cf-build.js   ·  Build output directory  cf
   The mp3 files stay in the repository: tools/tts_gen.py makes them there and build.js joins them into packs. */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), out = path.join(root, "cf");
const skip = new Set([".git", ".github", "cf", "tools", "preview", "src", "node_modules"]);
fs.rmSync(out, {recursive: true, force: true});
let n = 0;
(function copy(rel){
  for (const e of fs.readdirSync(path.join(root, rel), {withFileTypes: true})){
    const r = path.join(rel, e.name);
    if (!rel && skip.has(e.name)) continue;
    if (e.isDirectory()){ copy(r); continue; }
    if (rel === "audio" && (e.name.endsWith(".mp3") || e.name.endsWith(".json"))) continue;
    if (!rel && /\.(md|py)$/.test(e.name)) continue;
    fs.mkdirSync(path.join(out, rel), {recursive: true}); fs.copyFileSync(path.join(root, r), path.join(out, r)); n++;
  }
})("");
/* packs carry their hash in the link (?h=), so they can be kept long; app files are checked every time */
fs.writeFileSync(path.join(out, "_headers"), "/audio/p/*\n  Cache-Control: public, max-age=31536000, immutable\n/sw.js\n  Cache-Control: no-cache\n");
console.log("cf/: " + (n + 1) + " files");
if (n + 1 > 20000) throw new Error("over the Cloudflare free plan limit of 20,000 files");
