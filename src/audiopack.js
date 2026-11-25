/* Audio packs in the browser (see tools/audiopack.js): one file per lesson holds all of its clips.
   Opening a lesson loads its pack (from IndexedDB when saved before, else from the network), then every clip of it plays at once
   from memory, as before. A clip from another lesson (search, related lessons) loads that clip's home pack first.
   Packs are kept in IndexedDB (store "c", key "p:" + code, value {h: hash, b: bytes}), next to the single clips that older versions saved
   there (key = clip name); those still play. Same file can be copied to the other apps: makeAudioPack({db: "<their IndexedDB name>"}). */
function makeAudioPack(opt){
  const IDX = window.AUDIO_INDEX || {}, PACKS = window.AUDIO_PACKS || [], base = opt.base || "audio/";
  const byCode = new Map(PACKS.map((p, i) => [p[0], i]));
  const MEM = new Map(), PEND = new Map(), LIMIT = 4000;   // clip name -> blob URL (about 25 MB at most)
  let _db;
  const db = () => _db || (_db = new Promise((res, rej) => { const r = indexedDB.open(opt.db, 1); r.onupgradeneeded = () => r.result.createObjectStore("c");
    r.onsuccess = () => res(r.result); r.onerror = () => { _db = null; rej(r.error); }; }));
  const get = k => db().then(d => new Promise(res => { const q = d.transaction("c").objectStore("c").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); })).catch(() => null);
  const put = (k, v) => db().then(d => new Promise(res => { const tx = d.transaction("c", "readwrite"); tx.objectStore("c").put(v, k); tx.oncomplete = () => res(true); tx.onerror = tx.onabort = () => res(false); })).catch(() => false);
  const remember = (k, bytes) => {
    if (MEM.has(k)) return;
    if (MEM.size >= LIMIT){ let n = 0; for (const [x, u] of MEM){ URL.revokeObjectURL(u); MEM.delete(x); if (++n >= 500) break; } }
    MEM.set(k, URL.createObjectURL(new Blob([bytes], {type: "audio/mpeg"})));
  };
  function unpack(buf){
    const n = new DataView(buf).getUint32(0, true), table = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, n))), at = 4 + n;
    for (const [k, o, l] of table) remember(k, new Uint8Array(buf, at + o, l));
  }
  const fetchPack = i => fetch(base + "p/" + PACKS[i][0] + ".bin?h=" + PACKS[i][1]).then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
  /* load pack i into memory: IndexedDB first, then the network (and keep it in IndexedDB for next time and offline) */
  function load(i){
    if (i == null || !PACKS[i]) return Promise.resolve(false);
    if (PEND.has(i)) return PEND.get(i);
    const [code, h] = PACKS[i];
    const p = get("p:" + code).then(s => s && s.h === h ? s.b : fetchPack(i).then(b => { put("p:" + code, {h, b}); return b; }))
      .then(b => { unpack(b); return true; })
      .catch(() => { PEND.delete(i); return false; });   // failed: try again next time
    PEND.set(i, p); return p;
  }
  return {
    has: k => k in IDX,
    now: k => MEM.get(k) || null,          // ready to play this moment, or null
    /* blob URL of a clip, or null when it cannot be had (then the device voice speaks) */
    url(k){
      if (MEM.has(k)) return Promise.resolve(MEM.get(k));
      if (!(k in IDX)) return Promise.resolve(null);
      return get(k).then(b => { if (b){ remember(k, b); return MEM.get(k); }
        return load(IDX[k]).then(() => MEM.get(k) || null); });
    },
    warm: code => load(byCode.get(code)),   // a lesson is opened: get its clips ready
    count: () => PACKS.length,
    sig: () => PACKS.map(p => p[1]).join("").length ? String(PACKS.length) + ":" + PACKS.reduce((s, p) => (s * 31 + parseInt(p[1], 16)) % 2147483647, 7) : "",
    /* save every pack in IndexedDB for offline use; tick(done, total) */
    async saveAll(tick){
      let i = 0, done = 0, bad = 0; const N = PACKS.length;
      await Promise.all(Array.from({length: 4}, async () => { while (i < N){ const j = i++, [code, h] = PACKS[j];
        try { const s = await get("p:" + code); if (!(s && s.h === h)){ const b = await fetchPack(j); if (!(await put("p:" + code, {h, b}))) bad++; } } catch (e) { bad++; }
        tick(++done, N); } }));
      return bad;
    }
  };
}
