#!/usr/bin/env python3
"""듣기연습 area (LS), like lao-app's 듣기연습 (RYU 2026-11-23). Sources: tools/listen/*.py (one file per sub-group).
Writes data/LS.json and the LS lines of src/titles-lo.txt. Lao-script readings come from tools/loread.py.
Run: python3 tools/listening.py && node build.js"""
import importlib.util, json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
from loread import read

ORDER = "abcdefgh"
LV = {"I": 2, "A": 1, "B": 1, "C": 2, "D": 2, "E": 2, "F": 3, "G": 3, "H": 3}
HOW = ("듣는 순서: ❶ 본문 전체 듣기 → ❷ 한 줄씩 다시 듣기 → ❸ 단어 → ❹ 확인 문제.", "ລຳດັບ: ❶ ຟັງທັງໝົດ → ❷ ຟັງເທື່ອລະແຖວ → ❸ ຄຳສັບ → ❹ ຄຳຖາມ.")
files = sorted(f for f in os.listdir(os.path.join(ROOT, "tools/listen")) if f.endswith(".py"))
out, titles, subs = [], [], {}
for f in files:
    sub = f[0].upper()
    spec = importlib.util.spec_from_file_location("m" + sub, os.path.join(ROOT, "tools/listen", f))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    subs["LS-" + sub] = [m.SUB[0], m.SUB[1]]
    for n, (t, tlo, lines, words, tips, qz, *yt) in enumerate(m.B, 1):
        code = "LS-%s-%02d" % (sub, n)
        spk = []   # first named speaker: woman's voice, second: man's voice (as in lao-app)
        for s, _, _ in lines:
            if s and s not in spk: spk.append(s)
        dl = [[s, ko, lo, [], read(ko)] for s, ko, lo in lines]
        w = []
        for ko, lo, li in words:
            l = lines[li]
            w.append([ko, read(ko), lo, [[l[1], read(l[1]), l[2]]]])
        out.append({"code": code, "t": t, "lv": LV[sub], "type": "듣기",
                    "i": [m.SUB[2] + " " + HOW[0], m.SUB[3] + " " + HOW[1]],
                    "m": [], "l": [], "w": w, "f": [], "c": [], "e": [], "x": [],
                    "tp": [list(x) for x in tips], "pr": [], "dl": dl, "sm": [], "qz": [list(x) for x in qz],
                    "mv": spk[1:2], **({"yt": yt[0]} if yt else {})})
        titles.append(code + " | " + tlo)
json.dump(out, open(os.path.join(ROOT, "data/LS.json"), "w", encoding="utf8"), ensure_ascii=False)
tf = os.path.join(ROOT, "src/titles-lo.txt")
lines = [l for l in open(tf, encoding="utf8").read().split("\n") if not l.startswith("LS-")]
while lines and not lines[-1].strip(): lines.pop()
open(tf, "w", encoding="utf8").write("\n".join(lines + titles) + "\n")
print(len(out), "listening bundles;", json.dumps(subs, ensure_ascii=False))
