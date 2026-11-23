#!/usr/bin/env node
// Renderiza cada NN-*.html de esta carpeta a ../png/NN-*.png a 1080x1350 exactos.
// Uso:  node render.js            (todas)
//       node render.js 03         (solo las que empiezan por "03")
// Requiere playwright o playwright-core (npm i playwright-core) y un Chromium.
// Variables opcionales: PLAYWRIGHT_CORE=/ruta/a/playwright-core  CHROME=/ruta/a/chrome
const fs = require('fs');
const path = require('path');

function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_CORE, 'playwright', 'playwright-core'].filter(Boolean);
  for (const t of tries) { try { return require(t); } catch (_) { /* siguiente */ } }
  console.error('No encuentro playwright. Instala con: npm i playwright-core  (o define PLAYWRIGHT_CORE)');
  process.exit(1);
}

(async () => {
  const { chromium } = loadPlaywright();
  const here = __dirname;
  const out = path.join(here, '..', 'png');
  fs.mkdirSync(out, { recursive: true });
  const only = process.argv[2] || '';
  const files = fs.readdirSync(here).filter(f => /^\d\d-.*\.html$/.test(f) && f.startsWith(only)).sort();
  if (!files.length) { console.error('No hay diapositivas que renderizar.'); process.exit(1); }
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    for (const f of files) {
      await page.goto('file://' + path.join(here, f), { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      // Aviso si algo se sale del lienzo o se corta.
      const issues = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('.slide *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width && (r.right > 1080.5 || r.bottom > 1350.5)) bad.push(el.tagName + '.' + el.className + ' sale del lienzo');
          if (el.scrollHeight > el.clientHeight + 1 && getComputedStyle(el).overflow === 'hidden' && !el.matches('.slide')) bad.push(el.tagName + '.' + el.className + ' recorta contenido');
        });
        const row = document.querySelector('.row');
        if (row) row.querySelectorAll('*').forEach(el => {
          if (el.getBoundingClientRect().bottom > row.getBoundingClientRect().bottom + 0.5) bad.push(el.tagName + '.' + el.className + ' invade el pie');
        });
        const bad2 = [...document.fonts].filter(ff => ff.status === 'error').map(ff => 'fuente con error: ' + ff.family);
        return bad.concat(bad2);
      });
      const png = path.join(out, f.replace(/\.html$/, '.png'));
      await page.screenshot({ path: png, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
      console.log((issues.length ? 'AVISO ' : 'ok    ') + path.basename(png) + (issues.length ? '  ' + issues.join('; ') : ''));
    }
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
