#!/usr/bin/env node
// Vuelve a tomar las capturas de 0xramp.app (sin iniciar sesión) en español, viewport móvil 390x844 a 3x.
// Uso: node tools/capturar.js assets      (escribe assets/ui-{buy,pay,swap,activity,more}.png)
// Después, recorta la barra inferior:  magick assets/ui-pay.png -crop 1170x232+0+2300 +repage assets/ui-barra.png
// Requiere playwright o playwright-core (o PLAYWRIGHT_CORE=/ruta) y opcionalmente CHROME=/ruta/a/chrome.
const tries = [process.env.PLAYWRIGHT_CORE, 'playwright', 'playwright-core'].filter(Boolean);
let pw; for (const t of tries) { try { pw = require(t); break; } catch (_) {} }
if (!pw) { console.error('Instala playwright-core o define PLAYWRIGHT_CORE'); process.exit(1); }
const OUT = process.argv[2] || 'assets';
(async () => {
  const b = await pw.chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  try {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'es-ES' });
    const p = await ctx.newPage();
    // Idioma: el selector "Idioma" está en la pestaña Más; la app lo guarda en localStorage.
    await p.goto('https://0xramp.app/more', { waitUntil: 'networkidle', timeout: 45000 });
    await p.getByRole('region').getByRole('combobox').first().selectOption('ES');
    await p.waitForTimeout(800);
    for (const r of ['buy', 'pay', 'swap', 'activity', 'more']) {
      await p.goto('https://0xramp.app/' + r, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('nav', r, e.message));
      await p.waitForTimeout(2500);
      // Oculta el botón flotante de soporte (vive en un shadow root) para una captura limpia.
      await p.getByRole('button', { name: /chat/i }).evaluateAll(els => els.forEach(e => {
        e.style.setProperty('display', 'none', 'important');
        const host = e.getRootNode().host; if (host) host.style.setProperty('display', 'none', 'important');
      }));
      await p.waitForTimeout(300);
      await p.screenshot({ path: `${OUT}/ui-${r}.png` });
      console.log('ok', r);
    }
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exit(1); });
