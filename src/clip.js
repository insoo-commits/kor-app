/* Shared by the app and build.js: how a text is cleaned before it is spoken, and the file name of its audio clip.
   Changing either of these changes clip names, so every clip must be made again. */
function cleanKo(t){ return String(t).replace(/[①-⑳]/g, "").replace(/\([^)]*\)/g, " ").replace(/[\/·↔→~]/g, ", ").replace(/[຀-໿]+/g, " ").replace(/\s+/g, " ").replace(/^[, ]+|[, ]+$/g, "").trim(); }
function cleanLo(t){ return String(t).replace(/[가-힣ㄱ-ㅣ]+/g, " ").replace(/\([^)]*\)/g, " ").replace(/["“”]/g, "").replace(/\s+/g, " ").replace(/^[,; ]+|[,; ]+$/g, "").trim(); }
function clipKey(lang, text){
  let h = 0x811c9dc5; const s = lang + "|" + text;
  for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return lang + h.toString(36);
}
