# Drawing helpers shared with lao-app src/v3/subpics.py (flat SVG, 400x260).
import json
from pics import svg, r, c, ln, person, floor, desk, chair, bottle, glass, W, H, INK, SKIN

LF = "font-family=\"'Lao Local','Noto Sans Lao Looped','Noto Sans Lao',sans-serif\""
KF = "font-family=\"'Pretendard','Noto Sans KR',sans-serif\""
def t(x, y, s, size=16, fill=INK, anchor="middle", lao=True, w="700", extra=""):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}" {LF if lao else KF} {extra}>{s}</text>'

# ---------- palette
SINH = ["#9a3b2e", "#6a3d7a", "#2f6a5a", "#b5651d", "#3b5a8a"]   # women's sinh skirts
SHIRT = ["#f1e3c6", "#5b7fa6", "#c25e4f", "#6d8c5e", "#e9a15b", "#ffffff", "#8a6a9a"]
HAIR, HAIR2 = "#2b1d16", "#4a3426"
WALL, WALL2, FLOOR = "#f3e8d6", "#e9dcc4", "#c9ab84"
GOLD, TEAK, TEAL = "#d49a2e", "#8a4a16", "#2fa59a"

def room(col=WALL, fl=FLOOR, y=200): return r(0, 0, W, y, col) + floor(y, fl)
def sky(col1="#cfe6ef", col2="#f6ead2", y=190, ground="#9cbf7a"):
    return (f'<defs><linearGradient id="g{col1[1:]}{col2[1:]}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{col1}"/><stop offset="1" stop-color="{col2}"/></linearGradient></defs>'
            f'<rect width="{W}" height="{y}" fill="url(#g{col1[1:]}{col2[1:]})"/>' + floor(y, ground))
def sun(x, y, rad=24, col="#f6c453"): return c(x, y, rad, col)
def cloud(x, y, s=1.0, col="#ffffff"):
    return c(x, y, 16 * s, col) + c(x + 18 * s, y - 8 * s, 20 * s, col) + c(x + 38 * s, y, 16 * s, col) + r(x, y, 38 * s, 16 * s, col)
def palm(x, foot, h=110, col="#5f8f52"):
    top = foot - h
    out = [f'<path d="M{x},{foot} Q{x+8},{foot-h/2} {x+2},{top}" stroke="#8a6a4a" stroke-width="7" fill="none"/>']
    for dx, dy in [(-46, 10), (-36, -14), (40, 12), (34, -16), (0, -26)]:
        out.append(f'<path d="M{x+2},{top} Q{x+2+dx/2},{top+dy-14} {x+2+dx},{top+dy}" stroke="{col}" stroke-width="9" fill="none" stroke-linecap="round"/>')
    return "".join(out)
def stupa(x, foot, s=1.0, col=GOLD):
    return "".join([r(x - 60 * s, foot - 16 * s, 120 * s, 16 * s, "#e2b65a"), r(x - 44 * s, foot - 30 * s, 88 * s, 14 * s, "#e8c26c"),
                    f'<path d="M{x-30*s},{foot-30*s} Q{x-30*s},{foot-62*s} {x},{foot-66*s} Q{x+30*s},{foot-62*s} {x+30*s},{foot-30*s} Z" fill="{col}"/>',
                    f'<path d="M{x-12*s},{foot-64*s} Q{x-4*s},{foot-100*s} {x},{foot-130*s} Q{x+4*s},{foot-100*s} {x+12*s},{foot-64*s} Z" fill="{col}"/>',
                    "".join(f'<path d="M{x+dx*s-5*s},{foot-30*s} L{x+dx*s},{foot-54*s} L{x+dx*s+5*s},{foot-30*s} Z" fill="#e8c26c"/>' for dx in (-52, -40, 40, 52))])
def temple(x, foot, s=1.0):
    return "".join([r(x - 50 * s, foot - 46 * s, 100 * s, 46 * s, "#f4ead6"), r(x - 12 * s, foot - 32 * s, 24 * s, 32 * s, TEAK, 2),
                    f'<path d="M{x-74*s},{foot-42*s} L{x-48*s},{foot-70*s} L{x+48*s},{foot-70*s} L{x+74*s},{foot-42*s} Z" fill="#b5442e"/>',
                    f'<path d="M{x-54*s},{foot-68*s} L{x-30*s},{foot-96*s} L{x+30*s},{foot-96*s} L{x+54*s},{foot-68*s} Z" fill="#c9562f"/>',
                    f'<path d="M{x-32*s},{foot-94*s} L{x},{foot-122*s} L{x+32*s},{foot-94*s} Z" fill="#b5442e"/>',
                    ln([(x - 74 * s, foot - 42 * s), (x - 82 * s, foot - 52 * s)], GOLD, 4 * s), ln([(x + 74 * s, foot - 42 * s), (x + 82 * s, foot - 52 * s)], GOLD, 4 * s),
                    ln([(x, foot - 122 * s), (x, foot - 134 * s)], GOLD, 3 * s)])
def stilt_house(x, foot, s=1.0):
    return "".join([r(x - 60 * s, foot - 60 * s, 8 * s, 60 * s, TEAK), r(x + 52 * s, foot - 60 * s, 8 * s, 60 * s, TEAK), r(x - 4 * s, foot - 60 * s, 8 * s, 60 * s, TEAK),
                    r(x - 66 * s, foot - 110 * s, 132 * s, 54 * s, "#b07a45"), r(x - 30 * s, foot - 98 * s, 22 * s, 22 * s, "#f3e8d6", 2), r(x + 14 * s, foot - 98 * s, 22 * s, 22 * s, "#f3e8d6", 2),
                    f'<path d="M{x-80*s},{foot-108*s} L{x},{foot-150*s} L{x+80*s},{foot-108*s} Z" fill="#7a4a24"/>',
                    ln([(x + 70 * s, foot), (x + 50 * s, foot - 58 * s)], TEAK, 4 * s)])
def basket(x, y, s=1.0):   # sticky rice basket (ຕິບເຂົ້າ)
    return "".join([f'<path d="M{x-14*s},{y-30*s} Q{x},{y-40*s} {x+14*s},{y-30*s} L{x+10*s},{y} L{x-10*s},{y} Z" fill="#d8b26a" stroke="#a07c3c" stroke-width="1.5"/>',
                    ln([(x - 12 * s, y - 18 * s), (x + 12 * s, y - 18 * s)], "#a07c3c", 1.5), r(x - 12 * s, y - 2, 24 * s, 5 * s, "#a07c3c", 2)])
def bowl(x, y, col="#ffffff", food="#d9663b"):
    return f'<path d="M{x-20},{y-12} Q{x},{y+8} {x+20},{y-12} Z" fill="{col}" stroke="#c9ced2" stroke-width="1.5"/>' + f'<ellipse cx="{x}" cy="{y-13}" rx="17" ry="4" fill="{food}"/>'
def table(x, y, w=170, col="#a5825c"): return r(x, y, w, 10, col, 3) + r(x + 12, y + 10, 8, 46, "#8a6a4a") + r(x + w - 20, y + 10, 8, 46, "#8a6a4a")
def board(x, y, w, h, lines, col="#2f5a46", ink="#f6f1e0"):
    out = [r(x - 6, y - 6, w + 12, h + 12, "#a5825c", 4), r(x, y, w, h, col, 2)]
    n = len(lines); gap = h / (n + 1)
    for i, (s, size, lao) in enumerate(lines):
        out.append(t(x + w / 2, y + gap * (i + 1) + size * 0.35, s, size, ink, lao=lao, w="600"))
    return "".join(out)
def bubble(x, y, s, w=70, size=18, lao=True, col="#ffffff", tail="l"):
    # RYU 2026-11-24: a bubble never covers a head: move it up, or sideways when there is no room above
    import pics as _P
    for hx, hy, hr in list(_P.HEADS):
        if hx + hr > x - 10 and hx - hr < x + w + 10 and hy - hr < y + 50 and hy + hr > y:
            ny = hy - hr - 50
            if ny >= 2: y = ny
            else:
                y = max(2, y)
                x = hx + hr + 12 if hx < x + w / 2 else hx - hr - w - 12
                x = min(max(12, x), 400 - w - 12)
    tl = f"l-10,10 l2,-10" if tail == "l" else f"l10,10 l-2,-10"
    if tail == "l":
        d = f"M{x},{y} h{w} a10,10 0 0 1 10,10 v18 a10,10 0 0 1 -10,10 h-{w-18} l-10,10 l2,-10 h-8 a10,10 0 0 1 -10,-10 v-18 a10,10 0 0 1 10,-10 z"
    else:
        d = f"M{x},{y} h{w} a10,10 0 0 1 10,10 v18 a10,10 0 0 1 -10,10 h-8 l2,10 l-10,-10 h-{w-28} a10,10 0 0 1 -10,-10 v-18 a10,10 0 0 1 10,-10 z"
    return f'<path d="{d}" fill="{col}" stroke="{INK}" stroke-width="1.6"/>' + t(x + w / 2, y + 26, s, size, INK, lao=lao)
def card(x, y, s, w=64, h=50, col="#ffffff", size=26, ink=INK, lao=True, sub=None):
    out = [r(x, y, w, h, col, 8, f'stroke="{INK}" stroke-width="1.5"'), t(x + w / 2, y + h / 2 + size * 0.36 - (6 if sub else 0), s, size, ink, lao=lao)]
    if sub: out.append(t(x + w / 2, y + h - 7, sub, 11, "#7a6a5a", lao=False, w="500"))
    return "".join(out)
def waves(x, y, col="#c25e4f", n=3):
    return "".join(f'<path d="M{x+i*9},{y-8-i*5} Q{x+8+i*11},{y} {x+i*9},{y+8+i*5}" stroke="{col}" stroke-width="3" fill="none" stroke-linecap="round"/>' for i in range(n))
def W_(i, female=None, x=0, foot=0, **k):   # Lao person: woman in sinh or man
    if female:
        return person(x, foot, SHIRT[i % len(SHIRT)], SINH[i % len(SINH)], HAIR, female=True, **k)
    return person(x, foot, SHIRT[(i + 2) % len(SHIRT)], "#3b4a5a", HAIR2 if i % 2 else HAIR, **k)
def two_talk(a, b, bg, ia=0, ib=1, fa=True, fb=False, size=18, wa=None, wb=None, extra=""):
    wa = wa or max(54, len(a) * size * 0.62); wb = wb or max(54, len(b) * size * 0.62)
    return bg + extra + W_(ia, fa, 130, 236, arms=[[(0, 0), (16, 20), (30, 28)]]) + W_(ib, fb, 270, 236, arms=[[(0, 0), (-16, 20), (-30, 28)]]) \
        + bubble(max(10, 130 - wa / 2 - 10), 34, a, wa, size) + bubble(min(W - wb - 30, 262 - wb / 2), 74, b, wb, size, tail="r")
def teacher_board(lines, bw=250, extra="", col="#2f5a46"):
    return svg("".join([room("#efe4cf", "#c9ab84", 205), board(110, 26, bw, 120, lines, col), W_(3, True, 66, 236, arms=[[(0, 0), (20, -20), (40, -46)]]), extra]))
def speaker(lines_cards, col="#c25e4f", bg="#f6ecdc"):
    out = [r(0, 0, W, H, bg), W_(2, True, 70, 250, arms=[[(0, 0), (14, 18), (26, 22)]]), waves(104, 104, col)]
    for (x, y, s, sub, cc) in lines_cards: out.append(card(x, y, s, 70, 58, cc, 26, sub=sub))
    return svg("".join(out), bg)
def tone_curve(x, y, w, kind, col):
    d = {"mid": f"M{x},{y} h{w}", "rise": f"M{x},{y+14} Q{x+w*.6},{y+12} {x+w},{y-14}", "fall": f"M{x},{y-14} Q{x+w*.4},{y-14} {x+w},{y+14}",
         "low": f"M{x},{y+10} h{w}", "high": f"M{x},{y-12} h{w}", "hf": f"M{x},{y-6} Q{x+w*.3},{y-18} {x+w},{y+14}"}[kind]
    return f'<path d="{d}" stroke="{col}" stroke-width="4" fill="none" stroke-linecap="round"/>'

