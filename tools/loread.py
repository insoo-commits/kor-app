"""Korean -> Lao-script pronunciation reading, in the app's scheme (먼저 ມອນຈໍ, 고마워요 ໂກມາວໍໂຢ, 독립 ໂດງນິບ).
Applies liaison, ㅎ rules, final neutralisation, nasalisation, ㄹ assimilation and palatalisation inside each word.
Used for 듣기연습 (tools/listening.py). Hand-written readings elsewhere stay as they are."""
import re
I = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
V = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"
F = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"]
SPLIT = {"ㄳ": ("ㄱ", "ㅅ"), "ㄵ": ("ㄴ", "ㅈ"), "ㄶ": ("ㄴ", "ㅎ"), "ㄺ": ("ㄹ", "ㄱ"), "ㄻ": ("ㄹ", "ㅁ"), "ㄼ": ("ㄹ", "ㅂ"), "ㄽ": ("ㄹ", "ㅅ"), "ㄾ": ("ㄹ", "ㅌ"), "ㄿ": ("ㄹ", "ㅍ"), "ㅀ": ("ㄹ", "ㅎ"), "ㅄ": ("ㅂ", "ㅅ")}
SIMPLE = {"ㄳ": "ㄱ", "ㄵ": "ㄴ", "ㄶ": "ㄴ", "ㄺ": "ㄱ", "ㄻ": "ㅁ", "ㄼ": "ㄹ", "ㄽ": "ㄹ", "ㄾ": "ㄹ", "ㄿ": "ㅂ", "ㅀ": "ㄹ", "ㅄ": "ㅂ",
          "ㄲ": "ㄱ", "ㅋ": "ㄱ", "ㅅ": "ㄷ", "ㅆ": "ㄷ", "ㅈ": "ㄷ", "ㅊ": "ㄷ", "ㅌ": "ㄷ", "ㅎ": "ㄷ", "ㅍ": "ㅂ"}
ASP = {"ㄱ": "ㅋ", "ㄷ": "ㅌ", "ㅂ": "ㅍ", "ㅈ": "ㅊ"}
CI = dict(zip(I, "ກກນດຕລມບປສສອຈຈຊຄທພຮ"))
CF = {"ㄱ": "ກ", "ㄴ": "ນ", "ㄷ": "ດ", "ㄹ": "ລ", "ㅁ": "ມ", "ㅂ": "ບ", "ㅇ": "ງ"}

def dec(ch):
    n = ord(ch) - 0xAC00
    return [I[n // 588], V[n % 588 // 28], F[n % 28]]

def pron(syls):
    s = [list(x) for x in syls]
    for k in range(len(s) - 1):
        a, b = s[k], s[k + 1]
        f, i = a[2], b[0]
        if not f:
            continue
        if i == "ㅇ" and f != "ㅇ":
            if f in SPLIT:
                p, q = SPLIT[f]
                if q == "ㅎ":
                    a[2], b[0] = "", p
                else:
                    a[2], b[0] = p, q
            elif f == "ㅎ":
                a[2] = ""
            else:
                a[2] = ""
                b[0] = f
                if f in "ㄷㅌ" and b[1] == "ㅣ":
                    b[0] = "ㅈ" if f == "ㄷ" else "ㅊ"
            continue
        if f in ("ㅎ", "ㄶ", "ㅀ"):
            rest = {"ㅎ": "", "ㄶ": "ㄴ", "ㅀ": "ㄹ"}[f]
            if i in ASP:
                a[2], b[0] = rest, ASP[i]
                continue
            if i == "ㅅ":
                a[2], b[0] = rest, "ㅆ"
                continue
            if i == "ㄴ":
                a[2] = rest or "ㄴ"
                continue
        if i == "ㅎ":
            g = SIMPLE.get(f, f)
            if g in ASP:
                a[2], b[0] = "", ASP[g]
                continue
        g = SIMPLE.get(f, f)
        if g in "ㄱㄷㅂ" and i in "ㄴㅁㄹ":
            g = {"ㄱ": "ㅇ", "ㄷ": "ㄴ", "ㅂ": "ㅁ"}[g]
            if i == "ㄹ":
                b[0] = "ㄴ"
        elif g == "ㄴ" and i == "ㄹ":
            g = "ㄹ"
        elif g == "ㄹ" and i == "ㄴ":
            b[0] = "ㄹ"
        elif g in "ㅁㅇ" and i == "ㄹ":
            b[0] = "ㄴ"
        a[2] = g
    for x in s:
        x[2] = SIMPLE.get(x[2], x[2])
    return s

def lao(i, v, f, first):
    c = CI[i]
    y = c == "ອ"
    F_ = CF.get(f, "")
    if v == "ㅏ":
        return (c + "ຳ") if f == "ㅁ" else (c + "ັ" + F_ if f else c + "າ")
    if v == "ㅐ" or v == "ㅒ" and not y:
        return "ແ" + c + F_
    if v == "ㅒ":
        return "ແຢ" + F_
    if v == "ㅑ":
        base = "ຢ" if y else c + "ີຍ"
        return base + ("ັ" + F_ if f else "າ")
    if v == "ㅓ":
        return c + ("ອ" + F_ if f else "ໍ")
    if v == "ㅔ" or v == "ㅖ" and not y:
        return "ເ" + c + F_
    if v == "ㅖ":
        return "ເຢ" + F_
    if v == "ㅕ":
        base = "ຢ" if y else c + "ີຍ"
        return base + ("ອ" + F_ if f else "ໍ")
    if v == "ㅗ":
        return c + "ົ" + F_ if f else "ໂ" + c
    if v == "ㅘ":
        base = "ວ" if y else c + "ວ"
        return base + ("ັ" + F_ if f else "າ")
    if v == "ㅚ":
        return "ເ" + ("ວ" if y else c + "ວ") + F_
    if v == "ㅙ":
        return "ແ" + ("ວ" if y else c + "ວ") + F_
    if v == "ㅞ":
        return "ເ" + ("ວ" if y else c + "ວ") + F_
    if v == "ㅛ":
        return "ໂຢ" + F_ if y else c + "ີໂຍ" + F_
    if v == "ㅜ":
        return c + "ູ" + F_
    if v == "ㅝ":
        base = "ວ" if y else c + "ວ"
        return base + ("ອ" + F_ if f else "ໍ")
    if v == "ㅟ":
        return ("ວ" if y else c + "ວ") + "ີ" + F_
    if v == "ㅠ":
        return ("ຢູ" if y else c + "ີຢູ") + F_
    if v == "ㅡ":
        return c + "ື" + F_
    if v == "ㅢ":
        return ("ອືອີ" if y and first else ("ເອ" if y else c + "ີ")) + F_
    return c + "ີ" + F_

def word(w):
    hs = [ch for ch in w if "가" <= ch <= "힣"]
    if not hs:
        return w
    s = pron([dec(ch) for ch in hs])
    out, k = [], 0
    for ch in w:
        if "가" <= ch <= "힣":
            out.append(lao(*s[k], k == 0))
            k += 1
        elif ch in "?!,~·":
            out.append(ch)
        elif ch.isascii() and ch.isalnum():   # KTX, 302 stay as written
            out.append(ch)
    return "".join(out)

def read(text):
    return re.sub(r"\s+", " ", " ".join(word(w) for w in text.replace("…", " ").split())).strip()

if __name__ == "__main__":
    import sys
    for t in sys.argv[1:]:
        print(t, "→", read(t))
