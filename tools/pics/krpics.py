# 대한민국 tab pictures drawn in the app's flat style (RYU 2026-11-25: "11-5-3 은 크리스마스 그림으로", "대한민국에서 그림 안 들어간 것 ... 없으면 그려도 됨").
# python3 krpics.py <outdir>  -> <outdir>/<name>.svg ; tools/pics/krpics_jpg.js turns them into img/kr/<name>.jpg (640x416).
import os, sys, random
from subpics import *          # P, kt, kb, hanok, city, room, sky, table, bowl, person, r, c, ln, svg, INK, SKIN ...

def flag(x, y, s=1.0):        # Taegukgi on a pole
    w, h = 60 * s, 40 * s
    o = [r(x - 2, y, 4, 110 * s, "#8a8a8a"), r(x + 2, y, w, h, "#ffffff", 1, 'stroke="#c9c9c9" stroke-width="1"'),
         f'<path d="M{x+2+w/2-10*s},{y+h/2} a10,10 0 0 1 {20*s},0 z" fill="#cd2e3a"/>', f'<path d="M{x+2+w/2-10*s},{y+h/2} a10,10 0 0 0 {20*s},0 z" fill="#0047a0"/>']
    for dx, dy in [(-20, -12), (20, -12), (-20, 12), (20, 12)]:
        o.append(r(x + 2 + w / 2 + dx * s - 5 * s, y + h / 2 + dy * s - 4 * s, 10 * s, 8 * s, "#222", 1))
    return "".join(o)

def christmas():
    random.seed(7); o = []
    o.append('<defs><linearGradient id="xs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2a52"/><stop offset="1" stop-color="#3b4f86"/></linearGradient></defs>')
    o.append(r(0, 0, W, H, "url(#xs)")); o.append(c(340, 40, 20, "#f6efd0")); o.append(c(332, 34, 18, "#233463"))
    for _ in range(26): o.append(c(random.uniform(8, W - 8), random.uniform(8, 110), random.uniform(.8, 1.8), "#ffffff"))
    for x, w, h, col in [(0, 60, 120, "#26365f"), (54, 48, 150, "#2c3d6b"), (96, 62, 100, "#22325a"), (252, 56, 136, "#2c3d6b"), (302, 52, 108, "#24345d"), (348, 60, 156, "#2a3a66")]:
        o.append(r(x, 200 - h, w, h, col))
        for yy in range(int(200 - h + 10), 190, 16):
            for xx in range(int(x + 8), int(x + w - 8), 14):
                if random.random() < .55: o.append(r(xx, yy, 6, 8, "#f6d58a"))
    o.append(r(0, 196, W, 64, "#e9eef6")); o.append('<path d="M0,200 Q60,190 120,199 T240,197 T400,196 V210 H0 Z" fill="#ffffff"/>')
    tx = 200
    for i, (w, y0, y1) in enumerate([(120, 192, 136), (98, 156, 100), (76, 120, 66), (52, 84, 36)]):
        o.append(f'<path d="M{tx-w/2},{y0} L{tx},{y1} L{tx+w/2},{y0} Z" fill="{["#2f7a4a", "#358552", "#3b8f59", "#42995f"][i]}"/>')
    o.append(r(tx - 9, 192, 18, 18, "#7a4a2a", 2))
    o.append(f'<path d="M{tx},18 l5,12 13,1 -10,8 4,13 -12,-7 -12,7 4,-13 -10,-8 13,-1 z" fill="#f6c453" stroke="#e2a92e" stroke-width="1"/>')
    for k, (y, w) in enumerate([(180, 104), (146, 84), (110, 62), (76, 40)]):
        o.append(f'<path d="M{tx-w/2},{y-8} Q{tx},{y+8} {tx+w/2},{y-14}" stroke="#f3e2b3" stroke-width="1.6" fill="none"/>')
        for j in range(5):
            tt = (j + .5) / 5; o.append(c(tx - w / 2 + w * tt, y - 8 + 32 * tt * (1 - tt) - 6 * tt, 3.6, ["#e0503a", "#f6c453", "#4a8ad6", "#ffffff", "#c25e4f"][(j + k) % 5]))
    for x, w, h, col, rib in [(150, 26, 22, "#c25e4f", "#f6c453"), (176, 20, 16, "#4a8ad6", "#ffffff"), (222, 24, 20, "#f2b134", "#c25e4f"), (244, 18, 14, "#6cbf5a", "#ffffff")]:
        o += [r(x, 210 - h, w, h, col, 2), r(x + w / 2 - 2, 210 - h, 4, h, rib), r(x, 210 - h / 2 - 2, w, 4, rib)]
    o.append(P(1, True, 86, 250, arms=[[(0, 0), (-12, -18), (-6, -36)]], scale=.95))
    o.append(P(2, False, 314, 250, arms=[[(0, 0), (12, -18), (6, -36)]], scale=.95))
    o.append('<path d="M298,108 Q316,80 338,100 L330,108 Z" fill="#d23b2f"/>' + r(296, 104, 38, 8, "#ffffff", 3) + c(338, 100, 5, "#ffffff"))
    o.append(r(74, 141, 24, 7, "#f6c453", 3)); o.append(r(302, 141, 24, 7, "#e0503a", 3))
    for _ in range(40): o.append(c(random.uniform(4, W - 4), random.uniform(4, 192), random.uniform(1.2, 2.6), "#ffffffcc"))
    o.append(kt(200, 252, "메리 크리스마스", 15, "#2f5a7a"))
    return svg("".join(o))

def modern():      # 근현대: flag, growing city, Olympic rings and dates
    o = [sky("#cfe2ee", "#eef3f6", 200, "#a9b7a0"), city(200), r(150, 70, 44, 130, "#9fb0c2"), r(200, 100, 40, 100, "#b3c2d0"),
         "".join(r(156 + (i % 2) * 18, 80 + (i // 2) * 18, 10, 10, "#e8f1f6") for i in range(12)), r(0, 200, W, 60, "#7d8a92"),
         "".join(r(20 + i * 60, 228, 30, 4, "#f3e2b3") for i in range(7)), flag(300, 60, 1.0)]
    for i, col in enumerate(["#0081c8", "#222", "#ee334e", "#fcb131", "#00a651"]):
        o.append(f'<circle cx="{40 + i * 15}" cy="{40 + (i % 2) * 9}" r="10" fill="none" stroke="{col}" stroke-width="3"/>')
    for i, (yr, lab) in enumerate([("1945", "광복"), ("1988", "올림픽"), ("2002", "월드컵")]):
        x = 60 + i * 110; o.append(r(x - 40, 210, 80, 40, "#ffffff", 8, f'stroke="{INK}" stroke-width="1.4"'))
        o.append(kt(x, 228, yr, 15, "#1a3f86")); o.append(kt(x, 244, lab, 12, INK))
    return svg("".join(o))

def elders():      # 유교와 나이: the young bow and offer with two hands to grandparents
    o = [room("#f3e9d8", "#c9a57a", 200), hanok(330, 200, .5),
         person(110, 250, "#ffffff", "#4a4a4a", "#c9c9c9", scale=.95),
         person(180, 250, "#e8d7f0", "#6a3d7a", "#c9c9c9", female=True, scale=.95),
         P(3, False, 285, 250, arms=[[(0, 0), (-18, 14), (-34, 10)], [(0, 0), (-10, 20), (-34, 16)]], lean=-10, scale=.95),
         r(236, 130, 12, 18, "#5b8a5a", 2),
         kb(232, 40, "할머니, 드세요", None, 14, tail="r"), kb(20, 40, "어른 먼저", None, 14)]
    return svg("".join(o))

def table_manners():   # 식사 예절: low table, rice soup spoon chopsticks, "잘 먹겠습니다"
    o = [room("#f6ecdc", "#c9a57a", 196), r(60, 168, 280, 16, "#8a5a32", 4), r(80, 184, 12, 30, "#6a4424"), r(308, 184, 12, 30, "#6a4424"),
         bowl(120, 160, "#ffffff", "#f6f1e6"), bowl(168, 160, "#ffffff", "#d9663b"), bowl(232, 160, "#ffffff", "#f6f1e6"), bowl(280, 160, "#ffffff", "#d9663b"),
         c(200, 156, 12, "#6cbf5a"), ln([(140, 150), (146, 168)], "#b8b8b8", 3), ln([(150, 148), (156, 168)], "#b8b8b8", 2),
         ln([(252, 148), (258, 168)], "#b8b8b8", 3), ln([(262, 146), (268, 168)], "#b8b8b8", 2),
         person(96, 230, "#ffffff", "#4a4a4a", "#c9c9c9", arms=[[(0, 0), (20, 14), (40, 16)]], scale=.9),
         P(1, True, 304, 230, arms=[[(0, 0), (-6, 18), (0, 30)], [(0, 0), (6, 18), (0, 30)]], scale=.9),
         kb(20, 30, "어른이 먼저 드세요", None, 13), kb(228, 46, "잘 먹겠습니다", None, 14, tail="r")]
    return svg("".join(o))

def bowing():        # 인사와 몸짓: bow and give with two hands
    o = [sky("#d8ecf2", "#f2ead6", 205, "#bfb19a"), hanok(320, 205, .6),
         P(2, False, 120, 250, arms=[[(0, 0), (6, 20), (2, 38)], [(0, 0), (-6, 20), (-2, 38)]], lean=12),
         P(1, True, 250, 250, arms=[[(0, 0), (-16, 16), (-34, 18)], [(0, 0), (-8, 22), (-34, 24)]], lean=-6),
         r(198, 160, 26, 18, "#ffffff", 2, f'stroke="{INK}" stroke-width="1.2"'),
         kb(40, 30, "안녕하세요", None, 15), kb(212, 40, "두 손으로", None, 14, tail="r")]
    return svg("".join(o))

def calling():       # 부르는 말: what to call people
    o = [room("#eef3f6", "#c9c0b2", 200),
         person(70, 250, "#ffffff", "#4a4a4a", "#c9c9c9", scale=.95), P(0, False, 160, 250, scale=.95), P(1, True, 245, 250, scale=.95), P(3, True, 330, 250, scale=.85),
         kb(28, 120, "할아버지", None, 13), kb(126, 120, "민수 씨", None, 13), kb(216, 120, "선배님", None, 13), kb(300, 140, "언니", None, 13, tail="r")]
    return svg("".join(o))

def hallyu():        # 한류: K-pop stage + drama on a phone + food
    o = [sky("#2a2550", "#5a3a7a", 210, "#2a2a3a"), "".join(ln([(40 + i * 60, 0), (90 + i * 40, 210)], ["#f4a6c0", "#9fd0e6", "#f6e04b", "#a5d07a", "#f4a6c0"][i] + "66", 10) for i in range(5)),
         r(40, 196, 230, 14, "#4a3a6a"), P(0, True, 100, 196, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.8), P(2, False, 155, 196, arms=[[(0, 0), (-14, -24), (-20, -50)]], scale=.8),
         P(4, True, 210, 196, arms=[[(0, 0), (14, -24), (20, -50)]], scale=.8), kt(155, 40, "K-POP", 24, "#ffffff"),
         r(300, 90, 70, 120, INK, 8), r(306, 100, 58, 92, "#f6e6cc", 3), c(335, 132, 14, "#f0c7a0"), r(321, 146, 28, 30, "#c25e4f", 4), kt(335, 186, "드라마", 11, INK),
         "".join(c(60 + i * 40, 235, 9, "#f6e04b") for i in range(7))]
    for i in range(7): o.append(c(60 + i * 40, 229, 4, "#f6c453"))
    return svg("".join(o))

PICS = {"christmas": christmas, "modern": modern, "elders": elders, "manners": table_manners, "bowing": bowing, "calling": calling, "hallyu": hallyu}
if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    for k, f in PICS.items():
        s = f().replace('<svg ', '<svg width="640" height="416" ', 1)
        open(os.path.join(out, k + ".svg"), "w").write(s); print(k, len(s))
