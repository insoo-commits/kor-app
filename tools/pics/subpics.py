# Korean for Lao learners: one flat picture per 소분류 (RYU 2026-11-24: "한국어배우기 앱도 소분류별 그림 넣고").
# Run: python3 tools/pics/subpics.py  -> data/subpics.json ({sub code: svg}); build.js inlines it.
import json, os, math
from pichelp import *
from pics import person, floor, desk, chair, bottle, glass, W, H, INK, SKIN

KS = ["#5b7fa6", "#c25e4f", "#6d8c5e", "#e9a15b", "#8a6a9a", "#2f4f66", "#ffffff"]
def P(i, female=False, x=0, foot=0, **k):   # Korean-style person: shirt + trousers/skirt
    return person(x, foot, KS[i % len(KS)], ["#3b4a5a", "#24323f", "#6a5a4a"][i % 3] if not female else ["#3b5a8a", "#6a3d7a", "#2f4f66", "#9a3b2e"][i % 4], HAIR if i % 2 else HAIR2, female=female, **k)
def kt(x, y, s, size=16, fill=INK, **k): return t(x, y, s, size, fill, lao=False, **k)
def kb(x, y, s, w=None, size=17, tail="l"): return bubble(x, y, s, w or max(48, len(s) * size * 0.95 + 14), size, lao=False, tail=tail)
def talk(a, b, bg, ia=0, ib=1, fa=True, fb=False, extra="", size=17):
    wa = max(48, len(a) * size * 0.95 + 14); wb = max(48, len(b) * size * 0.95 + 14)
    return svg(bg + extra + P(ia, fa, 130, 236, arms=[[(0, 0), (16, 20), (30, 28)]]) + P(ib, fb, 270, 236, arms=[[(0, 0), (-16, 20), (-30, 28)]])
               + kb(max(10, 130 - wa / 2 - 10), 34, a, wa, size) + kb(min(W - wb - 30, 262 - wb / 2), 74, b, wb, size, tail="r"))
def kboard(lines, extra="", col="#2f5a46", bg="#eef0f2", fl="#c9c0b2", bw=250):
    return svg("".join([room(bg, fl, 205), board(110, 26, bw, 120, [(s, z, False) for s, z in lines], col), P(5, True, 66, 236, arms=[[(0, 0), (20, -20), (40, -46)]]), extra]))
def kcards(cards, curves=None, bg="#eef3f6"):
    out = [r(0, 0, W, H, bg), P(1, True, 64, 250, arms=[[(0, 0), (14, 18), (26, 22)]]), waves(100, 110, "#2e6bc4")]
    for i, (s, sub) in enumerate(cards):
        x = 140 + (i % 3) * 84; y = 30 + (i // 3) * 110
        out.append(card(x, y, s, 74, 64, "#ffffff", 26, lao=False, sub=sub))
        if curves: out.append(tone_curve(x + 8, y + 88, 58, curves[i % len(curves)], ["#e0503a", "#2e6bc4", "#6cbf5a", "#f2b134"][i % 4]))
    return svg("".join(out), bg)
def kroot(word, meaning, pic, col="#2e6bc4"):
    return svg("".join([r(0, 0, W, H, "#eef3f6"), r(20, 20, 150, 220, "#ffffff", 14, f'stroke="{col}" stroke-width="3"'), kt(95, 118, word, 34 if len(word) <= 3 else 26, "#1a3f86"),
                        t(95, 160, meaning, 14, "#5d6873", lao=True, w="600"), r(190, 20, 190, 220, "#ffffff", 14, 'stroke="#d6dee8" stroke-width="2"'), pic]), "#eef3f6")
def city(y=200):
    return "".join([r(20, y - 90, 50, 90, "#b9c6d3"), r(80, y - 130, 60, 130, "#a9b8c7"), r(300, y - 110, 70, 110, "#b9c6d3"),
                    "".join(r(28 + (i % 2) * 22, y - 80 + (i // 2) * 22, 12, 12, "#e8f1f6") for i in range(6)),
                    "".join(r(90 + (i % 2) * 26, y - 118 + (i // 2) * 24, 14, 14, "#e8f1f6") for i in range(8))])
def tower(x, foot, s=1.0):
    return "".join([f'<path d="M{x-70*s},{foot} Q{x},{foot-70*s} {x+70*s},{foot} Z" fill="#7fa36e"/>', r(x - 3 * s, foot - 120 * s, 6 * s, 80 * s, "#e9eef2"),
                    r(x - 10 * s, foot - 108 * s, 20 * s, 10 * s, "#c9d3dc", 3), r(x - 1 * s, foot - 140 * s, 2 * s, 22 * s, "#e9eef2")])
def hanok(x, foot, s=1.0):
    return "".join([r(x - 70 * s, foot - 8 * s, 140 * s, 8 * s, "#9a8f80"), r(x - 58 * s, foot - 44 * s, 116 * s, 36 * s, "#f6f1e6"),
                    "".join(r(x + (-58 + i * 28) * s, foot - 44 * s, 5 * s, 36 * s, "#7a4a24") for i in range(5)),
                    f'<path d="M{x-90*s},{foot-42*s} Q{x-70*s},{foot-40*s} {x-56*s},{foot-58*s} L{x+56*s},{foot-58*s} Q{x+70*s},{foot-40*s} {x+90*s},{foot-42*s} Q{x+80*s},{foot-48*s} {x+60*s},{foot-48*s} L{x-60*s},{foot-48*s} Q{x-80*s},{foot-48*s} {x-90*s},{foot-42*s} Z" fill="#3d4a55"/>',
                    f'<path d="M{x-56*s},{foot-58*s} Q{x},{foot-74*s} {x+56*s},{foot-58*s} Z" fill="#3d4a55"/>'])
def shop(x, y, w, h, sign, col="#2e6bc4", bg="#f6f1e6"):
    return r(x, y, w, h, bg) + r(x - 4, y - 26, w + 8, 28, col, 4) + kt(x + w / 2, y - 6, sign, 15, "#ffffff") + r(x + w * 0.3, y + h * 0.35, w * 0.4, h * 0.65, "#7a8a96", 2)
def bus(x, y, col="#2f8a5a"):
    return "".join([r(x, y - 70, 170, 62, col, 10), "".join(r(x + 12 + i * 38, y - 62, 30, 24, "#cfe6ef", 3) for i in range(4)), c(x + 34, y - 6, 12, INK), c(x + 136, y - 6, 12, INK), kt(x + 85, y - 22, "버스", 13, "#ffffff")])
def train(x, y):
    return "".join([r(x, y - 66, 220, 58, "#d8dee6", 12), r(x, y - 30, 220, 8, "#2e6bc4"), "".join(r(x + 14 + i * 50, y - 58, 34, 22, "#9fd0e6", 3) for i in range(4)), c(x + 30, y - 4, 8, INK), c(x + 190, y - 4, 8, INK)])
def phone(x, y, s=1.0): return r(x, y, 28 * s, 48 * s, INK, 5) + r(x + 3 * s, y + 5 * s, 22 * s, 34 * s, "#9fd0e6", 2)
def laptop(x, y): return r(x, y - 40, 70, 40, "#3d4a55", 4) + r(x + 4, y - 36, 62, 30, "#9fd0e6", 2) + r(x - 10, y, 90, 5, "#56646f", 2)
def helmet(x, y, col="#f2b134"): return f'<path d="M{x-22},{y} a22,20 0 0 1 44,0 z" fill="{col}"/>' + r(x - 26, y - 2, 52, 5, col, 2)
def gear(x, y, rad=26, col="#8a9aa8"):
    return "".join(r(x - 5, y - rad - 6, 10, 12, col, 2, f'transform="rotate({a} {x} {y})"') for a in range(0, 360, 45)) + c(x, y, rad, col) + c(x, y, rad * .4, "#eef3f6")
def calendar(x, y, mark=10):
    return r(x, y, 110, 96, "#ffffff", 6, 'stroke="#9aa7b1" stroke-width="2"') + r(x, y, 110, 22, "#c25e4f", 6) + "".join(r(x + 8 + (i % 5) * 20, y + 30 + (i // 5) * 20, 14, 14, "#e0503a" if i == mark else "#e8edf2", 2) for i in range(15))
def money(x, y): return r(x, y, 70, 36, "#7cae3f", 4) + c(x + 35, y + 18, 10, "#a5d07a") + kt(x + 35, y + 23, "₩", 13, "#2f5a2a")
def doc(x, y, title="서류"): return r(x, y, 70, 90, "#ffffff", 3, f'stroke="{INK}" stroke-width="1.5"') + kt(x + 35, y + 20, title, 12, "#1a3f86") + "".join(r(x + 10, y + 32 + i * 12, 50, 4, "#c9d3dc") for i in range(4))
def clock(x, y, rad=34):
    return c(x, y, rad, "#ffffff", f'stroke="#2e6bc4" stroke-width="5"') + ln([(x, y), (x, y - rad * .6)], INK, 4) + ln([(x, y), (x + rad * .45, y + 6)], INK, 4) + c(x, y, 3, INK)
def office(): return room("#eef0f2", "#c9c0b2", 200) + r(40, 26, 110, 76, "#d9e6ea", 3, 'stroke="#9aa7b1" stroke-width="4"') + desk(160, 160, 200, 50) + laptop(210, 160)
def factory(): return sky("#d8e4ee", "#eef3f6", 200, "#b9b2a6") + r(30, 90, 250, 110, "#c3ccd3") + f'<path d="M30,90 l50,-30 v30 l50,-30 v30 l50,-30 v30 l50,-30 v30 z" fill="#9aa7b1"/>' + r(290, 40, 24, 160, "#9aa7b1") + cloud(286, 30, .6, "#e3e8ec")

def headphones(x, y): return f'<path d="M{x-26},{y} a26,26 0 0 1 52,0" stroke="{INK}" stroke-width="5" fill="none"/>' + r(x - 32, y - 4, 12, 22, "#c25e4f", 5) + r(x + 20, y - 4, 12, 22, "#c25e4f", 5)
BG = lambda: sky("#d6e6f5", "#eef3f6", 200, "#c9d6c0")
IN = lambda: room("#eef0f2", "#c9c0b2", 200)
SP = {}
# ---------- K1 글자·발음
SP["K1-A"] = kboard([("ㅏ ㅓ ㅗ ㅜ ㅡ ㅣ", 30), ("아 어 오 우 으 이", 22)])
SP["K1-B"] = kboard([("ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ", 28), ("ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ", 28)])
SP["K1-C"] = kboard([("각 간 갇 갈", 28), ("감 갑 강", 28)])
SP["K1-D"] = kboard([("ㅎ+ㅏ+ㄴ = 한", 26), ("한국어", 30)])
SP["K1-E"] = kcards([("가", "평음"), ("까", "경음"), ("카", "격음"), ("다", ""), ("따", ""), ("타", "")])
SP["K1-F"] = kcards([("어", ""), ("오", ""), ("에", ""), ("애", ""), ("으", ""), ("우", "")])
SP["K1-G"] = kcards([("밥", "ㅂ"), ("밭", "ㄷ"), ("박", "ㄱ"), ("반", "ㄴ"), ("밤", "ㅁ"), ("방", "ㅇ")])
SP["K1-H"] = kcards([("국물", "[궁물]"), ("같이", "[가치]"), ("좋아", "[조아]")])
SP["K1-I"] = kcards([("가요.", "↘"), ("가요?", "↗"), ("가요!", "→")], ["fall", "rise", "mid"])
SP["K1-Z"] = kboard([("소리 내어 읽기", 26), ("안녕하세요", 26)])
# ---------- K2 기초회화
SP["K2-A"] = talk("안녕하세요?", "반가워요!", BG(), extra=tower(330, 200, .7))
SP["K2-B"] = svg(room("#f6efe4", "#c9ab84", 205) + P(2, False, 90, 246) + P(1, True, 160, 246) + P(0, False, 240, 246, scale=.7) + P(3, True, 300, 246, scale=.6) + kb(150, 30, "우리 가족", 100, 16))
SP["K2-C"] = svg(r(0, 0, W, H, "#eef3f6") + calendar(30, 40, 9) + clock(270, 90, 50) + kt(85, 170, "3월 10일", 18, "#1a3f86") + kt(270, 180, "3시", 18, "#1a3f86") + kt(200, 230, "하나 둘 셋 · 일 이 삼", 18), "#eef3f6")
SP["K2-D"] = svg(room("#f6e6cc", "#b98d5e", 196) + table(70, 168, 240) + bowl(130, 168, food="#e0503a") + bowl(190, 168, food="#f2d27a") + bowl(250, 168, food="#6e9a64") + P(0, False, 60, 250, scale=.9) + P(3, True, 330, 250, scale=.9, arms=[[(0, 0), (-24, 14), (-40, 10)]]) + kb(200, 34, "맛있어요!", None, 16, "r"))
SP["K2-E"] = svg(BG() + shop(40, 80, 140, 120, "편의점") + shop(220, 90, 140, 110, "시장", "#c25e4f") + P(5, True, 200, 250, back=True, scale=.9) + kb(250, 20, "얼마예요?", None, 15, "r"))
SP["K2-F"] = svg(BG() + city() + bus(150, 210) + P(1, False, 60, 250, arms=[[(0, 0), (20, -10), (36, -24)]], scale=.9) + kb(70, 30, "어디예요?", None, 15))
SP["K2-G"] = svg(sky("#d6e6f5", "#eef3f6", 200, "#9cbf7a") + hanok(130, 200, 1.0) + r(250, 70, 110, 130, "#d7dde5") + "".join(r(262 + (i % 3) * 32, 84 + (i // 3) * 34, 20, 20, "#9fd0e6", 2) for i in range(9)) + kt(305, 64, "아파트", 14, "#1a3f86"))
SP["K2-H"] = svg(room("#eef3f1", "#c3d0cc", 200) + r(30, 30, 60, 60, "#ffffff", 6) + r(54, 38, 12, 44, "#d9534f") + r(38, 54, 44, 12, "#d9534f") + person(180, 236, "#ffffff", "#5b7fa6", HAIR, female=True, arms=[[(0, 0), (20, 14), (36, 12)]]) + P(2, False, 300, 236, arms=[[(0, 0), (-14, -18), (-6, -40)]]) + kb(290, 40, "머리가 아파요", None, 14, "r"))
SP["K2-I"] = svg(IN() + r(0, 20, W, 26, "#2f4f66") + kt(200, 39, "은행 · 우체국", 15, "#f3e2b3") + r(30, 140, 340, 60, "#8a6a4a", 4) + money(60, 100) + r(170, 96, 60, 44, "#f6d58a", 3, f'stroke="{INK}"') + ln([(170, 96), (200, 120), (230, 96)], INK, 1.5) + phone(290, 88) + P(4, True, 340, 262, back=True))
SP["K2-J"] = svg(sky("#bfe0ee", "#eaf4f2", 186, "#86b16a") + sun(80, 60, 26) + cloud(250, 50) + "".join(ln([(260 + i * 14, 80), (254 + i * 14, 98)], "#5b9ed6", 3) for i in range(5)) + "".join(c(60 + i * 90, 210, 16, col) for i, col in enumerate(["#f4a6c0", "#6cbf5a", "#e0703a", "#ffffff"])) + kt(200, 250, "봄 여름 가을 겨울", 16))
SP["K2-K"] = svg(sky("#d6e6f5", "#eef3f6", 200, "#9cbf7a") + f'<path d="M0,200 L80,110 L140,160 L220,80 L300,150 L400,100 V200 Z" fill="#7fa36e"/>' + P(1, True, 300, 250, arms=[[(0, 0), (-10, -24), (-4, -50)]], scale=.9) + r(330, 200, 34, 46, "#c25e4f", 5) + kb(40, 30, "여행 가요!", None, 15))
SP["K2-L"] = svg(r(0, 0, W, H, "#eef3f6") + calendar(30, 40, 6) + clock(220, 90, 40) + phone(320, 60, 1.3) + kt(200, 200, "토요일 3시에 만나요", 17, "#1a3f86"), "#eef3f6")
SP["K2-N"] = svg(room("#f6efe4", "#c9ab84", 205) + hanok(300, 200, .7) + P(2, False, 110, 246, arms=[[(0, 0), (8, 20), (0, 36)], [(0, 0), (-8, 20), (0, 36)]], lean=6) + person(200, 246, "#e06a8a", "#6a3d7a", HAIR, female=True) + kb(20, 30, "새해 복 많이 받으세요", None, 13))
# ---------- K4 대학 생활
SP["K4-A"] = kboard([("한국어 수업", 26), ("듣기 · 말하기 · 읽기", 18)])
SP["K4-B"] = svg(BG() + r(210, 70, 150, 130, "#e9dcc4") + f'<path d="M200,74 L285,36 L370,74 Z" fill="#1a3f86"/>' + kt(285, 100, "대학교", 15, "#1a3f86") + P(3, True, 90, 250, scale=.9) + r(120, 200, 34, 46, "#5b7fa6", 5) + f'<path d="M30,40 l60,20 l-60,20 l10,-20 z" fill="#c25e4f"/>')
SP["K4-C"] = svg(BG() + r(30, 90, 120, 110, "#e9dcc4") + kt(90, 82, "도서관", 14, "#1a3f86") + r(170, 110, 90, 90, "#d7dde5") + kt(215, 102, "식당", 14, "#1a3f86") + r(280, 80, 100, 120, "#e9dcc4") + kt(330, 72, "강의실", 14, "#1a3f86") + P(1, True, 200, 252, scale=.8))
SP["K4-D"] = svg(IN() + desk(110, 170, 220, 40) + laptop(180, 170) + P(5, False, 90, 250, arms=[[(0, 0), (30, 10), (60, 8)]]) + kb(230, 40, "수강 신청", None, 15, "r") + calendar(300, 60, 3))
SP["K4-E"] = kboard([("오늘의 강의", 24), ("한국의 역사", 22)], extra=P(2, False, 320, 252, scale=.8) + desk(270, 210, 110, 30))
SP["K4-F"] = svg(IN() + r(150, 30, 220, 120, "#ffffff", 4, 'stroke="#9aa7b1" stroke-width="3"') + "".join(r(180 + i * 40, 120 - i * 18, 26, 20 + i * 18, ["#2e6bc4", "#6cbf5a", "#f2b134", "#e0503a"][i]) for i in range(4)) + P(1, True, 90, 250, arms=[[(0, 0), (30, -20), (56, -40)]]) + kt(260, 50, "발표", 14, "#1a3f86"))
SP["K4-G"] = svg(r(0, 0, W, H, "#eef3f6") + doc(60, 50, "시험") + doc(150, 60, "성적") + kt(185, 140, "A+", 24, "#e0503a") + P(3, True, 310, 250, arms=[[(0, 0), (14, -24), (20, -50)], [(0, 0), (-14, -24), (-20, -50)]]), "#eef3f6")
SP["K4-H"] = talk("교수님, 질문 있어요", "네, 말해 보세요", IN(), ia=1, ib=5, fa=True, fb=False, size=13)
SP["K4-I"] = svg(room("#f6efe4", "#c9ab84", 205) + r(30, 150, 150, 50, "#ffffff", 6, 'stroke="#c9b79c" stroke-width="2"') + r(30, 130, 40, 24, "#dfe6ea", 6) + desk(230, 150, 130, 50) + laptop(260, 150) + P(4, True, 200, 250, scale=.85) + kt(110, 40, "기숙사", 18, "#1a3f86"))
SP["K4-J"] = svg(r(0, 0, W, H, "#eef3f6") + money(40, 60) + money(60, 100) + doc(150, 50, "장학금") + shop(260, 90, 110, 110, "카페", "#8a5a3a") + P(1, True, 320, 252, scale=.7), "#eef3f6")
SP["K4-K"] = svg(BG() + P(0, True, 100, 246, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.85) + P(2, False, 180, 246, scale=.85) + P(5, True, 260, 246, arms=[[(0, 0), (-14, -24), (-20, -50)]], scale=.85) + r(60, 30, 280, 40, "#2e6bc4", 6) + kt(200, 57, "동아리 축제", 18, "#ffffff"))
SP["K4-L"] = svg(BG() + person(200, 246, "#24323f", "#24323f", HAIR, cap="#24323f") + r(170, 46, 60, 8, "#24323f") + r(226, 140, 40, 14, "#ffffff", 3) + kt(80, 60, "졸업", 22, "#1a3f86") + kt(320, 60, "축하해요!", 16, "#c25e4f"))
# ---------- K3 직장 생활
SP["K3-A"] = svg(BG() + person(80, 246, "#ffffff", "#3b4a5a", HAIR, female=True) + person(160, 246, "#2f4f66", "#2f4f66", HAIR2, cap="#2f4f66") + person(240, 246, "#f2b134", "#3b4a5a", HAIR, cap="#f2b134") + person(320, 246, "#5b7fa6", "#24323f", HAIR2) + kb(110, 20, "무슨 일을 하세요?", None, 14))
SP["K3-B"] = svg(IN() + r(150, 30, 210, 120, "#ffffff", 4, f'stroke="{INK}" stroke-width="1.5"') + r(230, 40, 50, 24, "#1a3f86", 3) + kt(255, 57, "사장", 12, "#ffffff") + r(170, 90, 50, 24, "#2e6bc4", 3) + kt(195, 107, "부장", 12, "#ffffff") + r(290, 90, 50, 24, "#2e6bc4", 3) + kt(315, 107, "과장", 12, "#ffffff") + ln([(255, 64), (255, 78), (195, 78), (195, 90)], INK, 1.5) + ln([(255, 78), (315, 78), (315, 90)], INK, 1.5) + P(5, False, 80, 246))
SP["K3-C"] = talk("자기소개 해 보세요", "네, 저는…", IN(), ia=5, ib=0, fa=False, fb=True, size=14)
SP["K3-D"] = svg(r(0, 0, W, H, "#eef3f6") + doc(150, 40, "근로계약서") + ln([(165, 110), (200, 116)], "#1a3f86", 2) + P(2, False, 70, 250, arms=[[(0, 0), (30, -10), (60, -20)]]) + P(5, True, 330, 250), "#eef3f6")
SP["K3-E"] = svg(BG() + city() + clock(300, 70, 34) + P(1, False, 170, 250, scale=.9) + r(200, 190, 30, 40, "#3d4a55", 4) + kt(200, 30, "출근 9시 · 퇴근 6시", 15, "#1a3f86"))
SP["K3-F"] = svg(room("#f6e6cc", "#b98d5e", 196) + table(70, 168, 260) + "".join(glass(110 + i * 60, 166) for i in range(4)) + P(5, False, 80, 250, scale=.85) + P(1, True, 200, 250, scale=.85) + P(2, False, 320, 250, scale=.85) + kb(140, 30, "건배!", None, 18))
SP["K3-G"] = talk("괜찮아요?", "좀 힘들어요", IN(), ia=4, ib=2, fa=True, fb=False)
SP["K3-H"] = svg(office() + P(5, False, 90, 246, arms=[[(0, 0), (30, 10), (60, 6)]]) + doc(300, 70, "보고서") + kb(130, 30, "다 했어요", None, 15))
SP["K3-I"] = svg(r(0, 0, W, H, "#eef3f6") + doc(40, 50, "급여명세서") + money(150, 80) + money(170, 110) + r(270, 60, 100, 130, "#ffffff", 10, 'stroke="#2e6bc4" stroke-width="3"') + r(306, 80, 28, 60, "#2e6bc4", 3) + r(290, 96, 60, 28, "#2e6bc4", 3) + kt(320, 170, "보험", 15, "#1a3f86"), "#eef3f6")
SP["K3-J"] = svg(r(0, 0, W, H, "#eef3f6") + r(40, 160, 320, 12, "#8a6a4a", 3) + ln([(80, 150), (140, 90)], "#9aa7b1", 8) + r(130, 74, 30, 24, "#56646f", 3, 'transform="rotate(45 145 86)"') + ln([(190, 150), (190, 80)], "#c25e4f", 8) + r(180, 66, 20, 18, "#9aa7b1", 2) + gear(300, 100, 30) + kt(200, 220, "망치 · 드라이버 · 기계", 16), "#eef3f6")
SP["K3-K"] = svg(factory() + gear(100, 150, 22) + gear(150, 140, 16, "#9aa7b1") + person(330, 250, "#2f6a8a", "#2f4f66", HAIR, cap="#f2b134", scale=.85))
SP["K3-L"] = svg(sky("#d8e4ee", "#eef3f6", 200, "#b9a58c") + ln([(80, 200), (80, 40), (300, 40)], "#f2b134", 8) + ln([(260, 40), (260, 100)], INK, 2) + r(240, 100, 40, 24, "#9aa7b1") + "".join(r(140 + i * 40, 150 - (i % 2) * 20, 36, 50 + (i % 2) * 20, "#c9a37a") for i in range(3)) + person(330, 250, "#e0703a", "#3b4a5a", HAIR, cap="#f2b134", scale=.85))
SP["K3-M"] = svg(sky("#d6e6f5", "#f2ead6", 190, "#9cbf7a") + r(40, 120, 120, 70, "#c25e4f") + f'<path d="M30,122 L100,80 L170,122 Z" fill="#8a3b2e"/>' + "".join(ln([(200 + i * 30, 230), (200 + i * 30, 200)], "#4f8a3a", 5) for i in range(6)) + f'<ellipse cx="330" cy="170" rx="34" ry="20" fill="#ffffff" stroke="{INK}"/>' + c(300, 160, 12, "#ffffff", f'stroke="{INK}"') + c(320, 168, 6, INK) + c(344, 176, 7, INK))
SP["K3-N"] = svg(sky("#cfe6ef", "#e8f1f6", 150, "#5b9ed6") + f'<path d="M0,150 Q50,140 100,150 T200,150 T300,150 T400,150 V260 H0 Z" fill="#4a8ad6"/>' + f'<path d="M100,150 h180 l-20,30 h-140 z" fill="#f6f1e6" stroke="{INK}" stroke-width="1.5"/>' + r(170, 110, 50, 40, "#c25e4f") + ln([(240, 150), (300, 60)], INK, 3) + ln([(300, 60), (330, 200)], "#9aa7b1", 1) + f'<path d="M60,210 q14,-10 28,0 q-14,10 -28,0 l-8,-6 v12 z" fill="#f2b134"/>')
SP["K3-O"] = svg(r(0, 0, W, H, "#fff6dc") + f'<path d="M200,30 L300,200 H100 Z" fill="#f2b134" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>' + kt(200, 170, "!", 70, INK) + helmet(70, 200, "#f2b134") + helmet(330, 200, "#ffffff") + kt(200, 240, "안전 제일", 18, "#c25e4f"), "#fff6dc")
SP["K3-P"] = svg(r(0, 0, W, H, "#eef3f6") + r(40, 50, 110, 150, "#1a3f86", 8) + kt(95, 110, "여권", 18, "#f3e2b3") + c(95, 150, 16, "none", 'stroke="#f3e2b3" stroke-width="2"') + r(180, 70, 160, 100, "#ffffff", 8, 'stroke="#9aa7b1" stroke-width="2"') + c(220, 120, 22, "#dfe6ea") + "".join(r(254, 100 + i * 16, 70, 5, "#c9d3dc") for i in range(4)) + kt(260, 210, "외국인등록증 · 비자", 15, "#1a3f86"), "#eef3f6")
SP["K3-Q"] = svg(office() + P(3, True, 100, 246, arms=[[(0, 0), (30, 10), (60, 8)]]) + r(300, 120, 50, 40, "#ffffff", 3, f'stroke="{INK}"') + phone(320, 80, .8))
SP["K3-R"] = talk("이쪽으로 오세요", "ຂອບໃຈ", BG(), ia=1, ib=4, fa=True, fb=False, size=14)
SP["K3-S"] = svg(room("#f3e8d6", "#b98d5e", 196) + r(40, 130, 320, 70, "#8a5a3a", 4) + r(60, 80, 60, 50, "#56646f", 4) + r(170, 104, 20, 26, "#ffffff", 3) + r(200, 108, 20, 22, "#ffffff", 3) + P(5, True, 260, 250, arms=[[(0, 0), (-20, 10), (-40, 0)]], scale=.9) + kb(40, 30, "주문하시겠어요?", None, 14))
SP["K3-T"] = svg(IN() + r(30, 20, 200, 26, "#1a3f86", 3) + kt(130, 39, "호텔 · 안내", 14, "#f3e2b3") + r(30, 130, 220, 70, "#8a6a4a", 4) + P(3, True, 120, 210, arms=[[(0, 0), (30, 14), (60, 6)]]) + r(290, 160, 40, 56, "#5b7fa6", 5) + P(0, False, 330, 262, back=True))
# ---------- K6 문장규칙 (boards)
for k, a, b in [("K6-A", "저는 학생이에요", "N + 이에요/예요"), ("K6-B", "은/는 · 이/가 · 을/를", "저는 밥을 먹어요"), ("K6-C", "에 · 에서 · 도 · 만", "학교에서 공부해요"),
                ("K6-D", "-아요/어요 · -습니다", "-(으)세요"), ("K6-E", "-았어요 · -을 거예요", "-(으)ㄴ 적이 있어요"), ("K6-F", "안 · 못 · -지 않아요", "-(으)ㄹ 수 있어요"),
                ("K6-G", "-고 싶어요 · -(으)ㄹ게요", "-(으)ㄹ까요?"), ("K6-H", "-아/어 주세요 · -아도 돼요", "-(으)면 안 돼요"), ("K6-I", "-고 · -아서 · -지만", "그리고 · 그런데"),
                ("K6-J", "-아서 · -(으)면 · -(으)러", "왜냐하면 …"), ("K6-K", "예쁜 꽃 · 빨리 가요", "-(으)ㄴ / -는 / -(으)ㄹ"), ("K6-L", "-네요 · -겠어요 · -지요?", "-(으)ㄴ 것 같아요"),
                ("K6-M", "-대요 · -(이)래요", "-냐고 했어요"), ("K6-N", "-아/어지다 · -게 되다", "-고 있다 · -아 있다"), ("K6-O", "듣다 → 들어요", "돕다 → 도와요"), ("K6-Z", "문법 총정리", "N + 조사 + V")]:
    SP[k] = kboard([(a, 20), (b, 17)], bw=260, col=["#2f5a46", "#2f4f66", "#3d4a55", "#5a3d2e"][sum(map(ord, k)) % 4])
# ---------- K7 짝말
SP["K7-A"] = svg(r(0, 0, W, H, "#eef3f6") + r(40, 40, 140, 180, "#ffffff", 10, f'stroke="{INK}" stroke-width="1.5"') + r(220, 40, 140, 180, "#ffffff", 10, f'stroke="{INK}" stroke-width="1.5"') + c(110, 120, 46, "#2e6bc4") + c(290, 130, 20, "#2e6bc4") + kt(110, 204, "크다", 20, "#1a3f86") + kt(290, 204, "작다", 20, "#1a3f86"), "#eef3f6")
SP["K7-B"] = svg(IN() + r(240, 50, 100, 150, "#8a6a4a", 4) + r(250, 60, 80, 140, "#a5825c", 3) + c(262, 130, 5, "#d4b44a") + P(5, False, 180, 246, arms=[[(0, 0), (40, -4), (74, -6)]]) + kb(30, 30, "열다 ↔ 닫다", None, 15))
SP["K7-C"] = svg(BG() + f'<path d="M110,120 h-60 l14,-14 M50,120 l14,14" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>' + f'<path d="M290,120 h60 l-14,-14 M350,120 l-14,14" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>' + hanok(200, 200, .7) + kt(80, 160, "왼쪽", 18, "#1a3f86") + kt(320, 160, "오른쪽", 18, "#1a3f86") + kt(200, 30, "위 ↔ 아래 · 전 ↔ 후", 16, "#1a3f86"))
SP["K7-D"] = svg(r(0, 0, W, H, "#eef3f6") + table(30, 196, 340) + "".join(c(70 + i * 30, 184, 12, "#e0503a") for i in range(3)) + kt(100, 146, "개", 20, "#1a3f86") + "".join(r(190 + i * 16, 150, 10, 46, "#6cbf5a", 3) for i in range(3)) + kt(214, 136, "병", 20, "#1a3f86") + "".join(r(282 + i * 24, 176, 20, 20, "#ffffff", 3, f'stroke="{INK}"') for i in range(3)) + kt(316, 160, "장", 20, "#1a3f86") + kt(200, 50, "사과 세 개", 26), "#eef3f6")
SP["K7-E"] = svg(r(0, 0, W, H, "#eef3f6") + card(40, 60, "하나 둘 셋", 150, 70, "#ffffff", 20, lao=False, sub="고유어") + card(210, 60, "일 이 삼", 150, 70, "#ffffff", 20, lao=False, sub="한자어") + clock(120, 190, 34) + kt(250, 196, "세 시 삼십 분", 18, "#1a3f86"), "#eef3f6")
SP["K7-F"] = svg(room("#f6efe4", "#c9ab84", 205) + person(110, 246, "#ffffff", "#6a3d7a", "#b8b8b8", female=True) + P(5, False, 290, 246, arms=[[(0, 0), (-10, -16), (-2, -34)], [(0, 0), (10, -16), (2, -34)]], scale=.9) + kb(30, 30, "진지 드세요", None, 15) + kb(230, 40, "밥 먹어", None, 15, "r"))
SP["K7-G"] = svg(r(0, 0, W, H, "#eef3f6") + "".join(r(60 + i * 100, 200 - (i + 1) * 40, 80, (i + 1) * 40, ["#c9d3dc", "#7ea6d8", "#1a3f86"][i], 6) for i in range(3)) + kt(100, 230, "먹어", 16) + kt(200, 230, "먹어요", 16) + kt(300, 230, "먹습니다", 16) + kt(200, 40, "말씨 세 단계", 20, "#1a3f86"), "#eef3f6")
SP["K7-H"] = talk("선배님!", "응, 왜?", BG(), ia=0, ib=5, fa=True, fb=False)
SP["K7-I"] = svg(IN() + r(240, 50, 100, 150, "#8a6a4a", 4) + r(250, 60, 80, 140, "#a5825c", 3) + kt(290, 40, "문이 열렸어요", 14, "#1a3f86") + P(1, True, 120, 246, arms=[[(0, 0), (30, -4), (60, -10)]]) + kt(120, 40, "문을 열었어요", 14, "#1a3f86"))
# ---------- K8 비슷한말
SP["K8-A"] = svg(r(0, 0, W, H, "#eef3f6") + card(40, 80, "은/는", 120, 70, "#ffffff", 26, lao=False) + kt(200, 124, "≈", 36, "#2e6bc4") + card(240, 80, "이/가", 120, 70, "#ffffff", 26, lao=False) + kt(200, 210, "저는 · 제가", 20, "#1a3f86"), "#eef3f6")
SP["K8-B"] = svg(r(0, 0, W, H, "#eef3f6") + card(40, 80, "-아요", 120, 70, "#ffffff", 26, lao=False) + kt(200, 124, "≈", 36, "#2e6bc4") + card(240, 80, "-네요", 120, 70, "#ffffff", 26, lao=False) + kt(200, 210, "좋아요 · 좋네요", 20, "#1a3f86"), "#eef3f6")
SP["K8-C"] = svg(IN() + P(0, True, 110, 246, arms=[[(0, 0), (30, 14), (60, 10)]]) + P(5, False, 290, 246, arms=[[(0, 0), (-30, 14), (-60, 10)]]) + r(176, 104, 48, 28, "#f6d58a", 4, f'stroke="{INK}"') + kb(140, 30, "주다 · 드리다", None, 15))
SP["K8-D"] = svg(r(0, 0, W, H, "#eef3f6") + f'<path d="M60,70 l30,-20 h40 l30,20 l-16,24 l-14,-8 v80 h-60 v-80 l-14,8 z" fill="#5b7fa6"/>' + kt(110, 210, "입다", 18, "#1a3f86") + helmet(220, 120, "#f2b134") + kt(220, 210, "쓰다", 18, "#1a3f86") + r(300, 110, 50, 24, "#3d4a55", 8) + kt(325, 210, "신다", 18, "#1a3f86"), "#eef3f6")
SP["K8-E"] = svg(BG() + sun(330, 50, 26) + P(0, True, 140, 246, arms=[[(0, 0), (14, -24), (20, -50)], [(0, 0), (-14, -24), (-20, -50)]]) + P(5, False, 260, 246, arms=[[(0, 0), (14, -24), (20, -50)], [(0, 0), (-14, -24), (-20, -50)]]) + kb(150, 26, "기뻐요!", None, 17))
SP["K8-F"] = svg(r(0, 0, W, H, "#eef3f6") + "".join(r(50 + i * 80, 200 - (i + 1) * 36, 50, (i + 1) * 36, ["#c9d3dc", "#7ea6d8", "#2e6bc4", "#1a3f86"][i], 4) for i in range(4)) + kt(75, 224, "조금", 15) + kt(315, 224, "아주", 15) + kt(200, 40, "자주 · 가끔 · 항상", 18, "#1a3f86"), "#eef3f6")
SP["K8-G"] = svg(r(0, 0, W, H, "#eef3f6") + card(30, 90, "비가 와요", 120, 60, "#ffffff", 17, lao=False) + r(160, 98, 80, 44, "#2e6bc4", 22) + kt(200, 127, "그래서", 17, "#ffffff") + card(250, 90, "집에 있어요", 120, 60, "#ffffff", 16, lao=False) + kt(200, 210, "그리고 · 그런데 · 그래도", 17, "#1a3f86"), "#eef3f6")
SP["K8-H"] = svg(r(0, 0, W, H, "#eef3f6") + kt(200, 70, "?", 50, "#c25e4f") + kt(200, 140, "누구 · 무엇 · 어디", 22, "#1a3f86") + kt(200, 190, "언제 · 왜 · 어떻게", 22, "#1a3f86"), "#eef3f6")
SP["K8-I"] = svg(factory() + P(2, False, 120, 250, arms=[[(0, 0), (20, 10), (36, 2)]], scale=.9) + person(300, 250, "#2f6a8a", "#2f4f66", HAIR, cap="#f2b134", scale=.9) + kb(150, 40, "옮기다? 나르다?", None, 14))
SP["K8-Z"] = kboard([("비슷한말 총정리", 24), ("좋다 ≈ 괜찮다", 20)])
# ---------- K9 단어가족
SP["K9-A"] = kroot("-원", "ພະນັກງານ", P(5, False, 250, 220, scale=.85) + P(1, True, 320, 220, scale=.85))
SP["K9-B"] = kroot("-장", "ສະຖານທີ່", r(220, 80, 130, 120, "#e9dcc4") + f'<path d="M210,84 L285,46 L360,84 Z" fill="#1a3f86"/>' + kt(285, 120, "운동장", 15, "#1a3f86"))
SP["K9-C"] = kroot("-금 · -서", "ເງິນ·ເອກະສານ", money(220, 70) + doc(290, 110, "신청서"))
SP["K9-D"] = kroot("안전", "ປອດໄພ", helmet(285, 120, "#f2b134") + kt(285, 190, "안전모", 15, "#1a3f86"))
SP["K9-E"] = kroot("-기", "ຊີວິດ", r(225, 70, 120, 80, "#3d4a55", 6) + r(233, 78, 104, 60, "#9fd0e6", 3) + kt(285, 190, "세탁기 · 청소기", 14, "#1a3f86"))
SP["K9-F"] = kroot("-하다", "ເຮັດ", card(205, 80, "공부", 76, 50, "#dce8f7", 18, lao=False) + kt(290, 112, "+", 26, "#1a3f86", ) + card(300, 80, "하다", 66, 50, "#ffffff", 18, lao=False) + kt(285, 180, "공부하다", 22, "#1a3f86"))
SP["K9-G"] = kroot("눈+물", "ຄຳປະສົມ", '<path d="M285,80 q-24,40 0,60 q24,-20 0,-60 z" fill="#5b9ed6"/>' + kt(285, 190, "눈물", 22, "#1a3f86"))
SP["K9-H"] = kroot("커피", "ຄຳຢືມ", r(255, 90, 50, 60, "#ffffff", 6, f'stroke="{INK}" stroke-width="2"') + f'<path d="M305,104 q18,0 0,24" stroke="{INK}" stroke-width="3" fill="none"/>' + r(259, 96, 42, 12, "#8a5a3a", 3) + kt(285, 190, "컴퓨터 · 버스", 15, "#1a3f86"))
SP["K9-Z"] = kboard([("단어가족 총정리", 24), ("회사원 · 운동장 · 세탁기", 18)])
# ---------- TOPIK
SP["TP-A"] = svg(r(0, 0, W, H, "#eef3f6") + r(60, 30, 280, 190, "#ffffff", 10, 'stroke="#2e6bc4" stroke-width="3"') + kt(200, 90, "TOPIK", 40, "#1a3f86") + kt(200, 130, "한국어능력시험", 18) + "".join(r(110 + i * 44, 160, 30, 30, ["#c9d3dc", "#a9c2e6", "#7ea6d8", "#2e6bc4"][i], 4) for i in range(4)), "#eef3f6")
def exam(sub, pic=""):
    return svg(r(0, 0, W, H, "#eef3f6") + r(30, 30, 200, 200, "#ffffff", 6, f'stroke="{INK}" stroke-width="1.5"') + kt(130, 64, sub, 18, "#1a3f86") + "".join(c(60, 100 + i * 30, 8, "none", f'stroke="{INK}" stroke-width="1.5"') + r(76, 96 + i * 30, 120, 6, "#c9d3dc") for i in range(4)) + c(60, 130, 8, "#2e6bc4") + pic, "#eef3f6")
SP["TP-B"] = exam("TOPIKⅠ 듣기", headphones(310, 130) + waves(340, 150, "#2e6bc4"))
SP["TP-C"] = exam("TOPIKⅠ 읽기", r(260, 90, 110, 80, "#fffaf0", 4, f'stroke="{INK}" stroke-width="2"') + ln([(315, 90), (315, 170)], INK, 2))
SP["TP-D"] = exam("TOPIKⅡ 듣기", headphones(310, 130) + waves(340, 150, "#1a3f86"))
SP["TP-E"] = exam("TOPIKⅡ 쓰기", ln([(270, 190), (350, 90)], "#f2b134", 10) + f'<path d="M262,200 l8,-10 l6,6 z" fill="{INK}"/>')
SP["TP-F"] = exam("TOPIKⅡ 읽기", r(260, 80, 110, 100, "#fffaf0", 4, f'stroke="{INK}" stroke-width="2"') + "".join(r(272, 96 + i * 14, 86, 4, "#c9b79c") for i in range(5)))
SP["TP-G"] = exam("어휘·문법", card(260, 90, "가나다", 110, 60, "#dce8f7", 22, lao=False))
SP["TP-H"] = exam("모의고사", clock(310, 120, 40))
SP["TP-I"] = talk("자기소개를 해 보세요", "저는 …", IN(), ia=5, ib=0, fa=False, fb=True, size=13)
SP["TP-J"] = svg(factory() + doc(60, 110, "EPS") + person(300, 250, "#2f6a8a", "#2f4f66", HAIR, cap="#f2b134", scale=.85) + kt(200, 30, "EPS-TOPIK", 20, "#1a3f86"))
# ---------- 듣기연습
SP["LS-A"] = svg(sky("#f3e2c8", "#eef3f6", 205, "#9cbf7a") + P(0, True, 120, 246, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.8) + P(2, False, 200, 246, scale=.8) + P(4, True, 280, 246, arms=[[(0, 0), (-14, -24), (-20, -50)]], scale=.8) + kt(110, 60, "♪", 30, "#1a3f86") + kt(200, 40, "하나 둘 셋", 18, "#1a3f86") + kt(296, 66, "♫", 30, "#1a3f86"))
SP["LS-B"] = svg(r(0, 0, W, H, "#eef3f6") + r(40, 30, 320, 200, "#fffaf0", 10, 'stroke="#2e6bc4" stroke-width="4"') + ln([(200, 30), (200, 230)], "#2e6bc4", 3) + f'<ellipse cx="120" cy="160" rx="34" ry="20" fill="#ffffff" stroke="{INK}"/>' + c(150, 142, 16, "#ffffff", f'stroke="{INK}"') + c(146, 140, 2, INK) + c(156, 140, 2, INK) + f'<path d="M140,128 l2,-10 l6,8 M154,126 l6,-8 l2,10" stroke="{INK}" fill="none"/>' + sun(300, 80, 22) + kt(290, 170, "그림 동화", 18, "#1a3f86"), "#eef3f6")
SP["LS-C"] = svg(sky("#2f3a5a", "#6a5a7a", 205, "#4a3a2a") + c(320, 50, 22, "#f6e6b0") + "".join(c(40 + i * 50, 30 + (i % 3) * 12, 2, "#ffffff") for i in range(7)) + hanok(120, 205, .8) + f'<path d="M250,170 q10,-30 30,-20 q20,-14 30,10 q20,0 10,20 z" fill="#e9e2d6"/>' + c(300, 150, 3, INK) + person(350, 246, "#ffffff", "#3b4a5a", "#b8b8b8", scale=.9))
SP["LS-D"] = talk("주말에 뭐 했어요?", "영화 봤어요", BG(), ia=1, ib=2, fa=True, fb=False, size=14)
SP["LS-E"] = kboard([("책을 펴세요", 26), ("듣고 따라 하세요", 20)], extra=headphones(330, 190))
SP["LS-F"] = svg(IN() + r(30, 30, 210, 70, "#24323f", 6) + kt(135, 60, "다음 역은 서울역", 15, "#f6c453") + kt(135, 86, "→ 08:30", 15, "#9fd0e6") + c(330, 70, 24, "#3d4a55") + waves(356, 70, "#3d4a55") + train(120, 220))
SP["LS-G"] = svg(room("#f3e8d6", "#c9ab84", 200) + r(110, 90, 180, 100, "#a5825c", 12) + c(160, 140, 30, "#3d4a55") + c(160, 140, 18, "#56646f") + r(210, 110, 64, 24, "#f3e2c3", 4) + c(226, 160, 9, INK) + c(256, 160, 9, INK) + ln([(140, 90), (110, 40)], INK, 3) + waves(300, 140, "#2e6bc4") + sun(60, 50, 20) + cloud(320, 50, .8))
SP["LS-H"] = svg(room("#e9eef2", "#c3ccd3", 200) + r(40, 30, 320, 150, "#24323f", 8) + r(52, 42, 296, 126, "#3b5a8a", 4) + P(5, True, 140, 168, scale=.8) + r(200, 70, 130, 70, "#eef3f6", 3) + tower(265, 136, .45) + r(52, 140, 296, 28, "#c25e4f") + kt(200, 160, "뉴스", 16, "#ffffff"))
SP["LS-I"] = svg(sky("#2a2550", "#5a3a7a", 210, "#2a2a3a") + "".join(ln([(60 + i * 70, 0), (100 + i * 50, 210)], ["#f4a6c0", "#9fd0e6", "#f6e04b", "#a5d07a", "#f4a6c0"][i] + "66", 10) for i in range(5)) + P(0, True, 130, 246, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.9) + P(2, False, 200, 246, arms=[[(0, 0), (-14, -24), (-20, -50)]], scale=.9) + P(4, True, 270, 246, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.9) + kt(200, 40, "K-POP", 26, "#ffffff"))

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, "..", "..", "data", "subpics.json")
    json.dump(SP, open(out, "w"), ensure_ascii=False)
    print(len(SP), sum(len(v) for v in SP.values()))
