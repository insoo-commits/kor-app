/* Audio packs: the clips of one lesson joined into one file, so the site has a few hundred files instead of tens of thousands
   (Cloudflare Pages free plan: 20,000 files per site; RYU 2026-11-25, kor-app-en v0.5, kor-app v2.65). Same code can be copied to the other apps.
   Pack file audio/p/<code>.bin = 4-byte little-endian header length N, N bytes of JSON [[key, offset, length], ...], then the mp3 bytes.
   Each slice is the original mp3 file byte for byte, so the sound is unchanged. A clip used by several lessons is in each of their packs
   (about 10% more bytes), so opening a lesson needs only that lesson's pack.
   writePacks(audioDir, lessons) with lessons = [[code, [clip keys in order]], ...] writes changed packs, removes stale ones and returns
   {index: {key: home pack number}, packs: [[code, hash], ...]}; the home pack of a clip is the first lesson that uses it. */
const fs = require("fs"), path = require("path"), crypto = require("crypto");
function writePacks(audioDir, lessons){
  const dir = path.join(audioDir, "p"); fs.mkdirSync(dir, {recursive: true});
  const packs = [], index = {}, keep = new Set();
  for (const [code, keys] of lessons){
    const parts = [], table = []; let off = 0;
    for (const k of [...new Set(keys)]){
      const f = path.join(audioDir, k + ".mp3"); if (!fs.existsSync(f)) continue;
      const b = fs.readFileSync(f); table.push([k, off, b.length]); parts.push(b); off += b.length;
    }
    if (!table.length) continue;
    const head = Buffer.from(JSON.stringify(table)), n = Buffer.alloc(4); n.writeUInt32LE(head.length);
    const buf = Buffer.concat([n, head, ...parts]), name = code + ".bin", file = path.join(dir, name);
    if (!fs.existsSync(file) || !fs.readFileSync(file).equals(buf)) fs.writeFileSync(file, buf);
    keep.add(name);
    const i = packs.length; packs.push([code, crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8)]);
    for (const [k] of table) if (!(k in index)) index[k] = i;
  }
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".bin") && !keep.has(f)) fs.unlinkSync(path.join(dir, f));
  return {index, packs};
}
module.exports = {writePacks};
