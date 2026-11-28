/* core-copy (2026-11-28): copies the shared parts in src/core/*.js and src/core/*.css (master = this repo, PhasaKAO) to the other apps.
     node tools/core-copy.js                 → ../kor-app-en and ../lao-app (sibling clones), if they are there
     node tools/core-copy.js <repo> [...]    → only those clones
     node tools/core-copy.js --check [...]   → write nothing, list copies that are behind the master (exit 1 if any)
   Each copy's first line says "(from kor-app)" plus the master's version, so a behind app shows without a diff.
   - Apps with build.js + src/ (JeyCampus): written to <repo>/src/core/<name>.js; then run that app's node build.js.
   - PhasaLAO (no build step, app.js is the site file): written to <repo>/tools/core/<name>.js and also put into
     app.js between the "core BEGIN" / "core END" lines, together with <repo>/tools/core/app-config.js
     (that app's own values). Nothing else in app.js is touched. Then raise PhasaLAO's version as usual.
   - CSS parts (*.css, core edge v1.0 on, RYU 2026-11-28): build apps read src/core/*.css in build.js (before the app's own CSS);
     PhasaLAO gets them in index.html between the "core css BEGIN" / "core css END" lines at the top of the first <style>.
   Per-app values never go in src/core; each app keeps them in its own app-config.js. */
const fs = require("fs"), path = require("path");
const here = path.join(__dirname, ".."), core = path.join(here, "src", "core");
const args = process.argv.slice(2), check = args.includes("--check");
let targets = args.filter(a => a !== "--check");
if (!targets.length) targets = ["../kor-app-en", "../lao-app"].map(t => path.join(here, t)).filter(t => fs.existsSync(t));
const parts = fs.readdirSync(core).filter(f => /\.(js|css)$/.test(f)).sort().map(f => {
  const src = fs.readFileSync(path.join(core, f), "utf8"), first = src.split("\n")[0];
  const m = first.match(/core (\S+) (v[\d.]+) \(master: kor-app src\/core\/\1\.(js|css)\)/);
  if (!m) throw new Error("src/core/" + f + ": first line must be  /* core <name> vX.Y (master: kor-app src/core/<name>.js|css)...");
  return {file: f, name: m[1], ver: m[2], css: m[3] === "css", text: src.replace(m[0], "core " + m[1] + " " + m[2] + " (from kor-app; copy, do not edit here)")};
});
const verOf = t => { const m = t && t.match(/core (\S+) (v[\d.]+) \(from kor-app/); return m ? m[2] : "none"; };
const BEGIN = "/* core BEGIN: written by kor-app tools/core-copy.js from tools/core/app-config.js + tools/core/*.js; do not edit between BEGIN and END */";
const END = "/* core END */";
const CBEGIN = "/* core css BEGIN: written by kor-app tools/core-copy.js from tools/core/*.css; do not edit between BEGIN and END */", CEND = "/* core css END */";
/* parts an app does not take (RYU 2026-11-28): PhasaLAO keeps its own statistics (so its sheet columns stay) , its own keys (its player works differently) , its own last-screen copy (other fields) and its own ☆ / 오답 노트 data (other format) and its own player (silent gap clips for the lock screen, other repeat counting; core play v1.0) */
const SKIP = {"lao-app": ["keys", "look", "play", "snap", "stats", "wbook"]};
let behind = 0;
for (const t of targets){
  const app = path.basename(path.resolve(t)), lao = !fs.existsSync(path.join(t, "build.js"));
  const dir = lao ? path.join(t, "tools", "core") : path.join(t, "src", "core");
  const mine = parts.filter(p => !(SKIP[app] || []).includes(p.name));
  for (const p of mine){
    const f = path.join(dir, p.file), old = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null;
    const same = old === p.text;
    if (!same) behind++;
    console.log(app + ": " + p.name + " " + verOf(old) + (same ? " = " : " → ") + p.ver);
    if (!check && !same){ fs.mkdirSync(dir, {recursive: true}); fs.writeFileSync(f, p.text); }
  }
  if (lao){
    const cfg = path.join(dir, "app-config.js");
    if (!fs.existsSync(cfg)) throw new Error(app + ": tools/core/app-config.js is missing (that app's own values)");
    const appjs = path.join(t, "app.js"), src = fs.readFileSync(appjs, "utf8");
    const a = src.indexOf(BEGIN), b = src.indexOf(END);
    if (a < 0 || b < a) throw new Error(app + ": app.js has no core BEGIN / END lines");
    const block = BEGIN + "\n" + [fs.readFileSync(cfg, "utf8")].concat(mine.filter(p => !p.css).map(p => check ? p.text : fs.readFileSync(path.join(dir, p.file), "utf8"))).map(s => s.trimEnd()).join("\n") + "\n" + END;
    const out = src.slice(0, a) + block + src.slice(b + END.length);
    if (out !== src){ behind++; console.log(app + ": app.js core block " + (check ? "is behind" : "rewritten")); if (!check) fs.writeFileSync(appjs, out); }
    const html = path.join(t, "index.html"), hs = fs.readFileSync(html, "utf8"), ca = hs.indexOf(CBEGIN), cb = hs.indexOf(CEND);
    if (ca < 0 || cb < ca) throw new Error(app + ": index.html has no core css BEGIN / END lines");
    const cblock = CBEGIN + "\n" + mine.filter(p => p.css).map(p => (check ? p.text : fs.readFileSync(path.join(dir, p.file), "utf8")).trimEnd()).join("\n") + "\n" + CEND;
    const hout = hs.slice(0, ca) + cblock + hs.slice(cb + CEND.length);
    if (hout !== hs){ behind++; console.log(app + ": index.html core css block " + (check ? "is behind" : "rewritten")); if (!check) fs.writeFileSync(html, hout); }
  }
}
if (check && behind) process.exit(1);
