// TOPIK comes from JeyCampus as it is (RYU 2026-11-28: "jeycampus가 기준이 되고 phasaKAO가 가져감", no new TOPIK questions are made here).
//   node tools/topik_lo.js <kor-app-en folder>          writes data/TP.json, the TP lines of src/titles-lo.txt and copies missing TOPIK clips
//   node tools/topik_lo.js <kor-app-en folder> --check  only says whether PhasaKAO is behind JeyCampus (exit 1 when it is)
// What is taken: JeyCampus data/TP.json (questions, scripts, answers) with JeyCampus's own Lao (src/i18n/lo: strings.tsv, info/TP-*.html,
// titles.txt), put in through JeyCampus's tools/i18n.js, so both apps show the same Lao.
// What stays here: TP-J EPS-TOPIK (PhasaKAO only, kept from this app's data/TP.json), Lao-script readings in the term lists
// (tools/topik/lo-read.json, JeyCampus writes romanisation there; a new word gets tools/loread.py), and the Lao of the picture
// captions in passages (tools/topik/lo-captions.tsv: JeyCampus i18n does not translate passages).
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = path.join(__dirname, "..");
const [src, flag] = process.argv.slice(2);
if (!src || !fs.existsSync(path.join(src, "data/TP.json"))) { console.error("usage: node tools/topik_lo.js <kor-app-en folder> [--check]"); process.exit(2); }
const E = JSON.parse(fs.readFileSync(path.join(src, "data/TP.json"), "utf8"));
const I18N = require(path.resolve(src, "tools/i18n.js")), L = I18N.load("lo");
const tsv = f => new Map(fs.readFileSync(f, "utf8").split("\n").filter(l => l.includes("\t") && !l.startsWith("#")).map(l => { const i = l.indexOf("\t"); return [l.slice(0, i), l.slice(i + 1)]; }));
const CAP = tsv(path.join(root, "tools/topik/lo-captions.tsv"));
const RF = path.join(root, "tools/topik/lo-read.json"), READ = JSON.parse(fs.readFileSync(RF, "utf8"));
const miss = new Set(), newRead = [];

/* picture captions: the text of each leaf element that has English in it */
const cap = p => String(p).replace(/>([^<>]*[A-Za-z]{3,}[^<>]*)</g, (all, t) => {
  const k = t.trim(); if (/^[\x00-\x7F]*$/.test(k) && !/[a-z]{3,}/.test(k)) return all;
  if (!CAP.has(k)) { miss.add(k); return all; }
  return ">" + t.replace(k, CAP.get(k)) + "<"; });
/* term lists: <span class="ko">시험</span> <span class="r">siheom</span> → Lao-script reading */
const reading = ko => { if (!READ[ko]) { READ[ko] = cp.execFileSync("python3", ["-c", "import sys;sys.path.insert(0,sys.argv[1]);import loread;print(loread.read(sys.argv[2]))", path.join(root, "tools"), ko], {encoding: "utf8"}).trim(); newRead.push(ko); } return READ[ko]; };
const reads = h => String(h).replace(/(<span class="ko">([^<]+)<\/span>\s*<span class="r">)([^<]*)(<\/span>)/g, (all, a, ko, r, z) => a + reading(ko) + z);

const out = E.map(b => {
  const c = I18N.apply(b, L);
  if (c.info) c.info = reads(c.info);
  for (const q of c.tq || []) { if (q.p) q.p = cap(q.p); for (const s of q.qs || []) if (s.p) s.p = cap(s.p); }
  return c; });
const codes = new Set(out.map(b => b.code));
for (const o of JSON.parse(fs.readFileSync(path.join(root, "tools/topik/eps.json"), "utf8"))) out.push(o);   // EPS-TOPIK: this app only (tools/topik.js + J.js)
out.sort((x, y) => x.code < y.code ? -1 : 1);
const json = JSON.stringify(out);

/* lesson titles in Lao: JeyCampus's for its pages, this app's for TP-J */
const TF = path.join(root, "src/titles-lo.txt"), tl = fs.readFileSync(TF, "utf8").split("\n");
const titles = tl.filter(l => !/^TP-[A-I]-/.test(l) || !codes.has(l.split(" | ")[0].trim()));
const at = titles.findIndex(l => l.startsWith("TP-J")), add = out.filter(b => b.code < "TP-J").map(b => b.code + " | " + (L.T.get(b.code) || b.t));
titles.splice(at < 0 ? titles.length : at, 0, ...add);
const titleTxt = titles.join("\n");

/* clips of the listening scripts: same names in both apps (src/clip.js), so a missing one is copied from JeyCampus */
// TOPIK_CLIP_URL (the GitHub Action, which checks out JeyCampus without its audio): missing clips are downloaded from there instead
const CLIP_URL = process.env.TOPIK_CLIP_URL || "";
const {cleanKo, clipKey} = new Function(fs.readFileSync(path.join(root, "src/clip.js"), "utf8") + "; return {cleanKo, clipKey};")();
const clips = [];
for (const b of out) for (const q of b.tq || []) for (const l of q.au || []) {
  const k = clipKey(l[0] === "m" ? "km" : "ko", cleanKo(l[1]));
  if (!fs.existsSync(path.join(root, "audio", k + ".mp3")) && (fs.existsSync(path.join(src, "audio", k + ".mp3")) || CLIP_URL)) clips.push(k); }

const behind = json !== fs.readFileSync(path.join(root, "data/TP.json"), "utf8") || titleTxt !== tl.join("\n") || clips.length > 0;
if (flag === "--check") { console.log(behind ? "PhasaKAO TOPIK is behind JeyCampus" : "PhasaKAO TOPIK is up to date"); process.exit(behind ? 1 : 0); }
fs.writeFileSync(path.join(root, "data/TP.json"), json);
fs.writeFileSync(TF, titleTxt);
for (const k of clips){ const to = path.join(root, "audio", k + ".mp3"), from = path.join(src, "audio", k + ".mp3");
  if (fs.existsSync(from)) fs.copyFileSync(from, to); else cp.execFileSync("curl", ["-fsSL", "-o", to, CLIP_URL + k + ".mp3"]); }
if (newRead.length) fs.writeFileSync(RF, JSON.stringify(READ, null, 0).replace(/","/g, "\",\n\""));
console.log("bundles", out.length, "questions", out.reduce((t, b) => t + (b.tq || []).length, 0), "clips copied", clips.length,
  "new readings", newRead.length ? newRead.join(" ") : 0, "captions without Lao", miss.size);
if (miss.size) console.log("  add to tools/topik/lo-captions.tsv:\n  " + [...miss].join("\n  "));
