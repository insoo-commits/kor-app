// TOPIK area (TP): TOPIK and EPS-TOPIK guide pages with practice questions for Lao learners.
// v2.24 (2026-11-21): 19 pages. v2.34 (2026-11-22): rebuilt from RYU's plan "KOR Lang TOPIK 보강 계획.xlsx", 74 pages in 10 sub-groups.
// Sub-groups (codes are internal; the plan's names in brackets): TP-A 시험 안내·전략 (TP-A), TP-B TOPIK I 듣기 (TP-1L), TP-C TOPIK I 읽기 (TP-1R),
// TP-D TOPIK II 듣기 (TP-2L), TP-E TOPIK II 쓰기 (TP-2W), TP-F TOPIK II 읽기 (TP-2R), TP-G 어휘·문법 (TP-V), TP-H 모의고사 (TP-M),
// TP-I 말하기 (TP-S), TP-J EPS-TOPIK (TP-E). The content of each sub-group is in tools/topik/<letter>.js.
// Every page: what the question type is and how to solve it (Lao), key words, then practice questions (field tq).
// All questions are new ones written in the style of the test, never copied from past papers. Lao text is a draft for review.
// Writes data/TP.json and the TP lines of src/titles-lo.txt. Run: node tools/topik.js && node build.js
// Lao-script readings of the key words come from ko2lao.js (path in KO2LAO, default the project copy).
const fs = require("fs"), path = require("path"), {execFileSync} = require("child_process");
const root = path.join(__dirname, "..");
const KO2LAO = process.env.KO2LAO || "/mnt/project-files/korean-app/ko2lao.js";

const K = ko => `<span class="ko">${ko}</span>`;
const TERMS = [];   // filled with readings after ko2lao has run
const T = {
  K,
  sec: (h, ...ps) => `<h3>${h}</h3>${ps.map(p => `<p>${p}</p>`).join("")}`,
  facts: rows => `<table class="facts">${rows.map(([th, td]) => `<tr><th>${th}</th><td>${td}</td></tr>`).join("")}</table>`,
  two: (a, b) => `<div class="two"><div>${a}</div><div>${b}</div></div>`,
  terms: (rows, hd) => { const i = TERMS.length; TERMS.push(rows); return `<h3>${hd || "ຄຳສັບ"}</h3>` + `@@TERMS${i}@@`; },
  box: (...lines) => `<div class="notice">${lines.join("<br>")}</div>`,
  model: (...lines) => `<div class="notice ko">${lines.join("<br>")}</div>`,
  sign: (cls, emo, cap) => `<div class="sign ${cls}"><span>${emo}</span>${cap ? `<small>${cap}</small>` : ""}</div>`,
  /* picture choices: a row of numbered emoji scenes, each with a short Lao caption */
  pics: list => `<div class="pics">${list.map((p, i) => `<div><b>${"①②③④"[i]}</b><span${/[가-힣]/.test(p[0]) ? ' class="tx"' : ""}>${p[0]}</span>${p[1] ? `<small>${p[1]}</small>` : ""}</div>`).join("")}</div>`,
  bars: (title, rows, note, unit) => { const mx = Math.max(...rows.map(r => r[1]));
    return `<div class="bars"><div class="bt ko">${title}</div><div class="bw">` + rows.map(([y, n]) => `<div><b>${n.toLocaleString("en")}${unit || ""}</b><i style="height:${Math.round(n / mx * 110)}px"></i><span class="ko">${y}</span></div>`).join("") +
      `</div>${note ? `<div class="bn">${note}</div>` : ""}</div>`; },
  /* directions used again and again: [Korean, Lao] */
  D: {
    ans: ["다음을 듣고 알맞은 대답을 고르십시오.", "ຟັງ ແລ້ວເລືອກຄຳຕອບທີ່ເໝາະສົມ."],
    next: ["다음을 듣고 이어지는 말을 고르십시오.", "ຟັງ ແລ້ວເລືອກຄຳເວົ້າທີ່ຕໍ່ກັນ."],
    where: ["여기는 어디입니까? 알맞은 것을 고르십시오.", "ບ່ອນນີ້ແມ່ນບ່ອນໃດ? ເລືອກອັນທີ່ເໝາະສົມ."],
    topic: ["무엇에 대해 말하고 있습니까? 알맞은 것을 고르십시오.", "ກຳລັງເວົ້າກ່ຽວກັບຫຍັງ? ເລືອກອັນທີ່ເໝາະສົມ."],
    same: ["다음을 듣고 들은 내용과 같은 것을 고르십시오.", "ຟັງ ແລ້ວເລືອກອັນທີ່ກົງກັບສິ່ງທີ່ໄດ້ຍິນ."],
    what: ["무엇에 대한 내용입니까? 알맞은 것을 고르십시오.", "ເນື້ອໃນນີ້ ກ່ຽວກັບຫຍັງ? ເລືອກອັນທີ່ເໝາະສົມ."],
    blank: ["(  )에 들어갈 가장 알맞은 것을 고르십시오.", "ເລືອກອັນທີ່ເໝາະທີ່ສຸດ ໃສ່ໃນວົງເລັບ (  )."],
    notSame: ["다음을 읽고 맞지 않는 것을 고르십시오.", "ອ່ານ ແລ້ວເລືອກອັນທີ່ ບໍ່ຖືກ."],
    readSame: ["다음을 읽고 내용이 같은 것을 고르십시오.", "ອ່ານ ແລ້ວເລືອກອັນທີ່ກົງກັບເນື້ອໃນ."],
    order: ["다음을 순서대로 맞게 배열한 것을 고르십시오.", "ເລືອກການລຽງລຳດັບທີ່ຖືກຕ້ອງ."],
    main: ["다음을 읽고 중심 생각을 고르십시오.", "ອ່ານ ແລ້ວເລືອກແນວຄິດຫຼັກ."],
    mainL: ["다음을 듣고 중심 생각으로 가장 알맞은 것을 고르십시오.", "ຟັງ ແລ້ວເລືອກແນວຄິດຫຼັກ."],
    set: ["다음을 듣고 물음에 답하십시오.", "ຟັງ ແລ້ວຕອບຄຳຖາມ."],
    setR: ["다음을 읽고 물음에 답하십시오.", "ອ່ານ ແລ້ວຕອບຄຳຖາມ."],
    sim: ["밑줄 친 부분과 의미가 비슷한 것을 고르십시오.", "ເລືອກອັນທີ່ມີຄວາມໝາຍຄ້າຍກັບສ່ວນທີ່ຂີດກ້ອງ."]
  },
  OX: ["O (맞다)", "X (틀리다)"]
};
/* question: d = direction (Korean, as in the test), dl = the same in Lao, au = listening script [["m"|"f"|"n", line]] (n = announcer, woman's voice),
   p = what to read (HTML), o = 2~4 choices, a = right choice, lo = choices are Lao, x = explanation (Lao, Korean words allowed).
   A set (two or more questions on one script or text): {d, dl, au | p, qs: [{q, o, a, x, lo}]} */
const P = [];
T.add = (code, t, lo, body, tq) => P.push({code, t, lo, info: `<h2>${lo}</h2><div class="sub2 ko">${t}</div>` + body, tq});

/* reuse a question of an earlier page in the mock tests (TP-H): a copy, with a pointer back to the page to study again */
T.pick = (code, i, j) => { const p = P.find(x => x.code === code); if (!p) throw new Error("no page " + code);
  const q = p.tq[i], src = j == null ? q : {...q.qs[j], d: q.d, dl: q.dl, au: q.au, p: q.p, qs: undefined};
  const c = JSON.parse(JSON.stringify(src)); if (j != null) c.d = q.d + " " + q.qs[j].q;
  c.x += " → ທົບທວນ: " + p.lo; return c; };
for (const part of "ABCDEFGHIJ") require(path.join(__dirname, "topik", part + ".js"))(T);

/* ---------- readings, checks, write ---------- */
const words = [...new Set(TERMS.flat().map(r => r[0]))];
const out = execFileSync("node", [KO2LAO], {input: words.join("\n") + "\n"}).toString().trim().split("\n");
const RD = new Map(words.map((w, i) => [w, (out[i] || "").split("⇒").pop().trim()]));
const termHtml = rows => `<div class="terms">${rows.map(([ko, m]) => `<div><span class="ko">${ko}</span> <span class="r">${RD.get(ko) || ""}</span><span class="m">${m}</span></div>`).join("")}</div>`;
const seen = new Set();
const check = (code, n, q) => { if (!(q.o && q.o.length >= 2 && q.o.length <= 4) || !(q.a >= 0 && q.a < q.o.length) || !q.x) throw new Error("bad question " + code + " #" + n + " " + JSON.stringify(q).slice(0, 80)); };
for (const p of P){
  if (seen.has(p.code)) throw new Error("double code " + p.code); seen.add(p.code);
  p.info = p.info.replace(/@@TERMS(\d+)@@/g, (_, i) => termHtml(TERMS[+i]));
  p.tq.forEach((q, i) => { if (!q.d) throw new Error("no direction " + p.code + " #" + (i + 1));
    if (q.qs) q.qs.forEach((s, j) => check(p.code, (i + 1) + "." + (j + 1), s)); else check(p.code, i + 1, q); });
}
const res = P.map(p => ({code: p.code, t: p.t, lv: 0, type: "시험", info: p.info, tq: p.tq}));
fs.writeFileSync(path.join(root, "data/TP.json"), JSON.stringify(res));
const tf = path.join(root, "src/titles-lo.txt");
const lines = fs.readFileSync(tf, "utf8").split("\n").filter(l => !l.startsWith("TP-"));
while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
fs.writeFileSync(tf, lines.concat(P.map(p => p.code + " | " + p.lo)).join("\n") + "\n");
const flat = P.flatMap(p => p.tq.flatMap(q => q.qs ? q.qs.map(s => ({...s, au: q.au})) : [q]));
const bySub = {}; P.forEach(p => { const s = p.code.slice(0, 4); bySub[s] = (bySub[s] || 0) + 1; });
console.log(P.length + " pages, " + flat.length + " questions (" + flat.filter(q => q.au).length + " listening)", JSON.stringify(bySub));
