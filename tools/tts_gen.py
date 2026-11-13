#!/usr/bin/env python3
"""Make the audio clips listed in audio/list.json with Edge TTS (same method as the Lao app).

  pip install edge-tts          (ffmpeg must be installed)
  node build.js                 # refreshes audio/list.json
  python3 tools/tts_gen.py      # makes only the clips that are missing; safe to stop and run again
  node build.js                 # registers the new clips in audio/index.js

Options:  --lang ko|lo   only one language      --limit N   stop after N clips      --jobs N   parallel requests (default 4)
Voices: Korean ko-KR-SunHiNeural, Lao lo-LA-KeomanyNeural. Output: 24 kbps mono mp3 (RYU's choice in the Lao app).
Needs network access to speech.platform.bing.com. Behind a proxy, HTTPS_PROXY is used automatically.
"""
import argparse, asyncio, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(ROOT, "audio")
VOICE = {"ko": "ko-KR-SunHiNeural", "lo": "lo-LA-KeomanyNeural"}
VOWEL = dict(zip("ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ", "아애야얘어에여예오와왜외요우워웨위유으의이"))


def spoken(clip):
    """What the voice actually reads (the clip name still comes from the shown text).
    Grammar headwords such as "-아서, -어서" are read without the dash, and a form that starts
    with a bare consonant ("-ㄴ데") is left out because it cannot be pronounced on its own;
    a lone vowel letter such as "ㅓ" is read as its sound ("어")."""
    t = clip["text"]
    if clip["lang"] != "ko":
        return t
    if t.startswith("-"):
        forms = [f.strip().lstrip("-") for f in t.split(",")]
        forms = [f for f in forms if f and not ("ㄱ" <= f[0] <= "ㅎ")] or forms
        t = ", ".join(forms)
    return "".join(VOWEL.get(ch, ch) for ch in t).replace('"', "")


async def make(clip, sem, proxy, failed):
    import edge_tts
    out = os.path.join(AUDIO, clip["key"] + ".mp3")
    async with sem:
        for attempt in range(3):
            fd, raw = tempfile.mkstemp(suffix=".mp3")
            os.close(fd)
            try:
                await edge_tts.Communicate(spoken(clip), VOICE[clip["lang"]], proxy=proxy).save(raw)
                if os.path.getsize(raw) < 200:
                    raise RuntimeError("empty audio")
                tmp = out + ".part"
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-ac", "1", "-ar", "24000", "-b:a", "24k", "-f", "mp3", tmp], check=True)
                os.replace(tmp, out)
                return
            except Exception as e:  # network hiccup or a text the voice cannot read
                err = e
                await asyncio.sleep(2 * (attempt + 1))
            finally:
                if os.path.exists(raw):
                    os.remove(raw)
        failed.append((clip, str(err)))


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["ko", "lo"])
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--jobs", type=int, default=4)
    a = ap.parse_args()
    clips = json.load(open(os.path.join(AUDIO, "list.json"), encoding="utf8"))
    todo = [c for c in clips if (not a.lang or c["lang"] == a.lang) and not os.path.exists(os.path.join(AUDIO, c["key"] + ".mp3"))]
    if a.limit:
        todo = todo[: a.limit]
    print(f"{len(clips)} clips in the list, {len(todo)} to make")
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    sem, failed = asyncio.Semaphore(a.jobs), []
    for i in range(0, len(todo), 200):
        await asyncio.gather(*(make(c, sem, proxy, failed) for c in todo[i : i + 200]))
        print(f"  {min(i + 200, len(todo))} / {len(todo)} done, {len(failed)} failed", flush=True)
    if failed:
        json.dump([{"key": c["key"], "lang": c["lang"], "text": c["text"], "error": e} for c, e in failed], open(os.path.join(AUDIO, "failed.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
        print("failed clips are listed in audio/failed.json")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
