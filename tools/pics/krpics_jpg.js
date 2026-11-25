// node krpics_jpg.js <svgdir> <outdir> : renders each <name>.svg to <outdir>/<name>.jpg at 640x416 (and a contact sheet sheet.png in svgdir)
const {chromium} = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const [, , src, out] = process.argv; const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 640, height: 416}});
  const names = fs.readdirSync(src).filter(f => f.endsWith('.svg'));
  for (const f of names) {
    await p.setContent('<meta charset="utf-8"><style>body{margin:0}svg{display:block}</style>' + fs.readFileSync(path.join(src, f), 'utf8'));
    await p.screenshot({path: path.join(out, f.replace('.svg', '.jpg')), type: 'jpeg', quality: 86, clip: {x: 0, y: 0, width: 640, height: 416}});
  }
  await p.setViewportSize({width: 1300, height: 900});
  await p.setContent('<meta charset="utf-8"><style>body{margin:0;display:grid;grid-template-columns:repeat(2,640px);gap:6px}svg{display:block}</style>' + names.map(f => fs.readFileSync(path.join(src, f), 'utf8')).join(''));
  await p.screenshot({path: path.join(src, 'sheet.png'), fullPage: true}); await b.close(); console.log(names.length);
})();
