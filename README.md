# Carrusel: Conoce las funciones principales de 0xramp

Carrusel educativo de 6 imágenes para X (1080 x 1350 px, formato 4:5), en español, para Zcash en Español (ZecHub).

| # | Archivo | Tema |
|---|---------|------|
| 1/6 | `png/01-presentacion.png` | Presentación de 0xramp y su barra inferior |
| 2/6 | `png/02-pagar.png` | Pagar (pagar un QR local con ZEC) |
| 3/6 | `png/03-comprar-vender.png` | Comprar y vender |
| 4/6 | `png/04-swap.png` | Swap |
| 5/6 | `png/05-actividad.png` | Actividad |
| 6/6 | `png/06-mas.png` | Más, con llamada a la acción (0xramp.app) |

En X caben 4 imágenes por publicación: publica la 1 a la 4 en el post y la 5 y la 6 en la primera respuesta.

## Archivos editables (`src/`)

- `01-presentacion.html` … `06-mas.html`: una diapositiva por archivo. El texto está en el propio HTML; edítalo con cualquier editor de texto.
- `estilo.css`: plantilla común (colores, tipografía, márgenes, marco del teléfono, pie). Los colores están como variables al inicio (`--zh-black-blue`, `--zh-hadfield-blue`, etc.).
- `fonts/`: Montserrat (licencia SIL OFL 1.1, ver `fonts/OFL.txt`).
- `assets/`: capturas reales de 0xramp.app (`ui-*.png`, en español, sin iniciar sesión), la barra inferior recortada (`ui-barra.png`), el logo de 0xramp (`0xramp-logo-dark.png`) y el logo de ZecHub (`zechub-white.png`).
- `render.js`: genera los PNG.
- `tools/capturar.js`: vuelve a tomar las capturas de la app si cambia su interfaz.

Para ver una diapositiva, ábrela en el navegador (Chrome o Firefox) con la ventana en 1080 px de ancho, o usa el modo de diseño adaptable a 1080 x 1350.

## Volver a generar los PNG

Requisitos: Node.js y `playwright` o `playwright-core` con un Chromium.

```bash
cd src
npm i playwright-core          # solo la primera vez
npx playwright-core install chromium  # solo la primera vez, si no tienes Chromium
node render.js                 # todas las diapositivas -> ../png/
node render.js 03              # solo la 3
```

Variables opcionales: `PLAYWRIGHT_CORE=/ruta/a/playwright-core` y `CHROME=/ruta/a/chrome`.

`render.js` avisa con `AVISO` si algún texto o imagen se sale del lienzo o invade el pie. Si cambias un texto y aparece el aviso, acórtalo.

## Actualizar las capturas

```bash
cd src
node tools/capturar.js assets
magick assets/ui-pay.png -crop 1170x232+0+2300 +repage assets/ui-barra.png
node render.js
```

Las capturas muestran cotizaciones en vivo (por ejemplo, el monto en ZEC). Son de ejemplo y por eso el pie de las diapositivas 2 y 3 lo dice.

## Identidad visual

Según la guía de ZecHub (zechub.wiki/visual-identity):

- Fondo ZH Black Blue `#06192f`, con ZH Slate Blue `#39516c` en el degradado.
- Acentos ZH Hadfield Blue `#147df5` (números, línea bajo el título, botón final) y ZH Ice Blue `#7dafeb`.
- Avisos en ZH Golden Yellow `#f5b92d`; subtítulos en ZH Pale Blue `#cde1f0`; textos secundarios en ZH Mid Grey `#b9b9b9`.
- Tipografía: Montserrat, la secundaria de ZecHub. La primaria, Bossa, no está en Google Fonts. Si la tienes instalada, `estilo.css` la usa en los titulares (`--titulo`).

## Fuentes (verificadas el 23/11/2026)

- App: https://0xramp.app (en español, sin iniciar sesión). Capturas en `src/assets/ui-*.png`.
- Documentación: https://docs.0xramp.app/introduction ("non-custodial", "never holds your funds, keys, or bank credentials", "Zcash-first. ZEC is the default asset. Delivery is to transparent addresses (t-addr) only", corredores Alias, Pago Móvil, Pix y otros), https://docs.0xramp.app/privacy y https://docs.0xramp.app/bank-freeze-risk.
- Montos, mínimos y cotizaciones de las capturas son de ejemplo y cambian con el mercado.

## Notas

- El logo de la cabecera es el de ZecHub (guía de marca: https://zechub.wiki/visual-identity). Si prefieres el logo de Zcash en Español, reemplaza `src/assets/zechub-white.png` y vuelve a renderizar.
- La tipografía principal de ZecHub (Bossa) no tiene licencia libre; se usó Montserrat, la secundaria.
- En la diapositiva 3, Zodl es solo un ejemplo de billetera blindada.
