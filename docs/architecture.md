# Arquitectura — Reloj mundial

Alcance: `docs/vision.md` (fuente de verdad). Aquí solo se define cómo construirlo.

## Versiones fijas
- **Vitest: `5.1.1`** (exacta, sin `^`/`~`, en `devDependencies`). Requiere Node `^22.12 || ^24 || >=26`.
- **Node en CI: `22`** (`actions/setup-node` con `node-version: 22`). Local: Node 22+ (hay v26). Declarar `"engines": {"node": ">=22.12"}`.
- Sin dependencias de runtime. Commitear `package-lock.json`; CI usa `npm ci`.

## Estructura de archivos
```
index.html            # HTML estático con las 4 ciudades ya escritas
css/styles.css        # estilos mobile-first
js/main.js            # UI: importa ../src/time.js y actualiza el DOM cada segundo
src/time.js           # lógica pura de formato (módulo ES, sin DOM)
tests/time.test.js    # unitarios de src/time.js
tests/site.test.js    # integración: servidor node:http + fetch
.github/workflows/pages.yml
package.json          # "type": "module", "test": "vitest run"
README.md
```
El sitio se publica tal cual desde la raíz (sin build). El artefacto de Pages contiene solo lo necesario: `index.html`, `css/`, `js/`, `src/` (nunca `node_modules`, `tests`, `.git`).

## `src/time.js` — API pública
```js
export const CITIES;            // [{ id, name, timeZone }] en orden fijo:
// mexico-city "Ciudad de México" America/Mexico_City
// madrid      "Madrid"           Europe/Madrid
// tokyo       "Tokio"            Asia/Tokyo
// new-york    "Nueva York"       America/New_York

export function formatTime(date, timeZone)  // -> "HH:MM:SS" 24 h (hourCycle 'h23', locale es-ES)
export function formatDate(date, timeZone)  // -> fecha corta es-ES, p. ej. "lun, 15 ene"
export function getCityTimes(date = new Date()) // -> [{ id, name, timeZone, time, date }] en orden de CITIES
```
Ejemplos con `date = new Date('2024-01-15T12:00:00Z')` (invierno):
- `formatTime(date,'America/Mexico_City')` → `"06:00:00"`
- `formatTime(date,'Europe/Madrid')` → `"13:00:00"`
- `formatTime(date,'Asia/Tokyo')` → `"21:00:00"`
- `formatTime(date,'America/New_York')` → `"07:00:00"`
- `formatDate(date,'Asia/Tokyo')` → fecha del 15 ene (lun). Con `2024-01-15T20:00:00Z` Tokio pasa al martes 16 (prueba de cambio de día).
Detalles: usar `Intl.DateTimeFormat('es-ES', { timeZone, hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' })`; el test debe fijar la cadena exacta que produce el motor (ajustar el ejemplo de `formatDate` a la salida real, sin depender de la hora de la máquina). Las funciones no leen el reloj salvo el default de `getCityTimes`.

## UI en el navegador
- `index.html` contiene 4 `<article class="card" data-city="mexico-city|madrid|tokyo|new-york">` con `<h2>` del nombre, `<time class="clock">` y `<p class="date">` (con valores iniciales vacíos o `--:--:--`). `<html lang="es">`, `<title>Reloj mundial</title>`, meta viewport.
- Carga: `<script type="module" src="js/main.js"></script>`.
- `js/main.js`: `import { getCityTimes } from '../src/time.js';` (ruta relativa; funciona en Pages bajo subruta porque no hay rutas absolutas). Función `render()` que rellena cada tarjeta por `data-city`; se llama de inmediato y luego con `setInterval(render, 1000)`.
- Los ES modules no funcionan en `file://`: el README indica `npx serve .` o `python3 -m http.server`.
- CSS: una columna por defecto, rejilla (`repeat(auto-fit, minmax(16rem,1fr))`) en pantallas anchas, `font-variant-numeric: tabular-nums`, fuente del sistema, sin scroll horizontal a 360 px.

## Tests (Vitest 5.1.1, `vitest run`)
- `tests/time.test.js`: fecha fija `2024-01-15T12:00:00Z` → hora esperada en las 4 zonas; caso de verano (p. ej. `2024-07-15T12:00:00Z`: CDMX 06:00, Madrid 14:00, Tokio 21:00, NY 08:00); cambio de día; orden y nombres de `CITIES`; `getCityTimes` con fecha fija.
- `tests/site.test.js` (integración):
  1. `beforeAll`: crear `http.createServer` que sirva archivos de la raíz del repo con `node:fs` (tipo MIME según extensión: html/css/js; resolver la ruta y rechazar salidas de la raíz), `listen(0)`, leer el puerto de `server.address().port` (esperar el evento `listening` con una Promise).
  2. Test: `fetch(\`http://127.0.0.1:${port}/\`)` → status 200 y el HTML contiene "Reloj mundial" y las 4 ciudades en orden. Opcional: `fetch('/src/time.js')` devuelve 200 con content-type JavaScript.
  3. `afterAll`: `await new Promise(r => server.close(r))` (más `server.closeAllConnections()`). Sin procesos en segundo plano.

## Workflow `.github/workflows/pages.yml`
- Disparo: `push` a `main` (y `workflow_dispatch`). `permissions: contents: read, pages: write, id-token: write`. `concurrency: group: pages`.
- Job `test`: `actions/checkout`, `actions/setup-node` (node 22, cache npm), `npm ci`, `npm test`.
- Job `deploy` (`needs: test`, `environment: github-pages`): checkout; copiar a un directorio `_site/` solo `index.html`, `css/`, `js/`, `src/`; `actions/configure-pages`; `actions/upload-pages-artifact` con `path: _site`; `actions/deploy-pages`. Fijar versiones mayores vigentes de cada action.
- Habilitar Pages con "Source: GitHub Actions" puede requerir un paso humano (documentar en README).

## Cómo correr y probar
- `npm install` · `npm test` · ver local: `npx serve .` (o `python3 -m http.server 8000`) y abrir la URL.

## Backlog
Ver `docs/backlog.md` (3 issues de construcción; total del proyecto: #1, #2 + 3 = 5).
