// TOPIK question bank from KoJey (kor-app-en data/TP.json, RYU 2026-11-26: "use KoJey's TOPIK questions as they are"), with Lao texts.
//   node tools/topik_lo.js todo <kojey TP.json>   writes tools/topik/lo_todo.tsv: English texts that still need Lao (n \t English)
//   node tools/topik_lo.js make <kojey TP.json>   writes data/TP.json: KoJey questions + Lao from tools/topik/lo.tsv (English \t Lao),
//                                                  this app's own Lao pages kept (TP-A…TP-I info, TP-J EPS-TOPIK)
// lo.tsv starts with the pairs found in this app's old TP.json (same question = same choices) and grows with new translations.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), LOF = path.join(root, "tools/topik/lo.tsv");
const [cmd, src] = process.argv.slice(2);
const E = JSON.parse(fs.readFileSync(src, "utf8")), OLD = JSON.parse(fs.readFileSync(path.join(root, "data/TP.json"), "utf8"));
const MAP = new Map(fs.existsSync(LOF) ? fs.readFileSync(LOF, "utf8").split("\n").filter(l => l.includes("\t")).map(l => l.split("\t")) : []);
const eng = s => /[A-Za-z]{2,}/.test(String(s || "").replace(/<[^>]+>/g, " ").replace(/TOPIK|EPS|Ⅰ|Ⅱ|[A-Z]\b/g, ""));
/* English bits of a passage: the text of each leaf element that has English in it (picture captions, labels) */
const pTexts = p => [...String(p || "").matchAll(/>([^<>]*[A-Za-z]{3,}[^<>]*)</g)].map(m => m[1].trim()).filter(t => !/^[\x00-\x7F]*$/.test(t) || /[a-z]{3,}/.test(t));
const okey = q => JSON.stringify(q.o || (q.qs || []).map(s => s.o));
/* 1. pairs from this app's old questions */
const oldQ = new Map(); for (const b of OLD) for (const q of b.tq || []) oldQ.set(okey(q), q);
const learn = (en, lo) => { if (en && lo && en !== lo && eng(en) && !MAP.has(en)) MAP.set(en, lo); };
for (const b of E) for (const q of b.tq || []){ const o = oldQ.get(okey(q)); if (!o) continue;
  learn(q.dl, o.dl); learn(q.x, o.x);
  if (q.lo && o.lo) q.o.forEach((x, i) => learn(x, o.o[i]));
  (q.qs || []).forEach((s, j) => { const t = (o.qs || [])[j]; if (t){ learn(s.x, t.x); if (s.lo && t.lo) s.o.forEach((x, i) => learn(x, t.o[i])); } });
  const a = pTexts(q.p), c = pTexts(o.p); if (a.length === c.length) a.forEach((x, i) => learn(x, c[i])); }
/* 2. every English text the bank uses */
const need = [];
const want = s => { if (s && eng(s) && !need.includes(s)) need.push(s); };
const KEEP = new Set(OLD.map(b => b.code));   // pages this app already has keep their own Lao info
for (const b of E){
  if (!KEEP.has(b.code)) want(b.info);
  for (const q of b.tq || []){ want(q.dl); want(q.x); if (q.lo) q.o.forEach(want); pTexts(q.p).forEach(want);
    (q.qs || []).forEach(s => { want(s.x); if (s.lo) s.o.forEach(want); if (eng(s.q)) want(s.q); }); } }
if (cmd === "todo"){
  const left = need.filter(s => !MAP.has(s));
  fs.mkdirSync(path.dirname(LOF), {recursive: true});
  fs.writeFileSync(LOF, [...MAP].map(r => r.join("\t")).join("\n") + "\n");
  fs.writeFileSync(path.join(root, "tools/topik/lo_todo.tsv"), left.map((s, i) => (i + 1) + "\t" + s.replace(/\t|\n/g, " ")).join("\n") + "\n");
  console.log("known", MAP.size, "need", need.length, "left", left.length, "chars", left.reduce((t, s) => t + s.length, 0));
}
if (cmd === "make"){
  const L = s => s && MAP.has(s) ? MAP.get(s) : s, miss = new Set();
  const T = s => { if (s && eng(s) && !MAP.has(s)) miss.add(s); return L(s); };
  const P = p => { let out = String(p || ""); for (const t of pTexts(p)) out = out.replace(">" + t + "<", ">" + T(t) + "<").replace("> " + t + " <", "> " + T(t) + " <"); return out; };
  const oldBy = new Map(OLD.map(b => [b.code, b]));
  const out = E.map(b => { const o = oldBy.get(b.code), n = {...b, info: o ? o.info : T(b.info)};
    if (o) n.t = o.t;
    if (b.tq) n.tq = b.tq.map(q => { const c = {...q, dl: T(q.dl), x: T(q.x)}; if (q.lo) c.o = q.o.map(T); if (q.p) c.p = P(q.p);
      if (q.qs) c.qs = q.qs.map(s => { const d = {...s, x: T(s.x)}; if (s.lo) d.o = s.o.map(T); if (eng(s.q)) d.q = T(s.q); return d; });
      if (c.x === undefined) delete c.x; if (c.dl === undefined) delete c.dl; return c; });
    return n; });
  for (const o of OLD) if (!E.find(b => b.code === o.code)) out.push(o);   // TP-J EPS-TOPIK: this app only
  out.sort((x, y) => x.code < y.code ? -1 : 1);
  fs.writeFileSync(path.join(root, "data/TP.json"), JSON.stringify(out));
  console.log("bundles", out.length, "questions", out.reduce((t, b) => t + (b.tq || []).length, 0), "missing Lao", miss.size);
  if (miss.size) fs.writeFileSync(path.join(root, "tools/topik/lo_missing.txt"), [...miss].join("\n") + "\n");
}
