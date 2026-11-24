# v2.55 (RYU 2026-11-24): intro + tips should be about as tall as the sub-group picture (PC, 270px picture = 193px tall).
# For bundles whose text is much taller, drop tips from the end until the estimate fits; dropped tips are kept in removed_tips.json.
import json, glob, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, "..", "..", "data")
m = json.load(open(os.path.join(H, "measure_v255.json")))["pc"]
LIMIT = 236
removed = {}
for f in sorted(glob.glob(os.path.join(R, "*.json"))):
    if os.path.basename(f) == "subpics.json": continue
    d = json.load(open(f, encoding="utf8")); ch = False
    items = d if isinstance(d, list) else list(d.values())
    for b in items:
        if not isinstance(b, dict) or b.get("code") not in m or not m[b["code"]]: continue
        v = m[b["code"]]; tp = b.get("tp") or []
        if v["txt"] <= LIMIT or len(tp) < 2: continue
        per = v["tip"] / len(tp); est = v["txt"]; out = []
        while est > LIMIT and len(tp) > 1:
            out.insert(0, tp.pop()); est -= per
        b["tp"] = tp; removed[b["code"]] = out; ch = True
    if ch: json.dump(d, open(f, "w", encoding="utf8"), ensure_ascii=False, indent=None if os.path.getsize(f) > 0 else 1)
json.dump(removed, open(os.path.join(H, "removed_tips.json"), "w"), ensure_ascii=False, indent=1)
print(len(removed), sum(len(x) for x in removed.values()))
