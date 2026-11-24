# Memoria de página web pequeña llamada "Reloj mundial"

Decisiones, convenciones y aprendizajes que cualquier agente futuro debe conocer.
Agrega entradas cortas y fechadas; no borres las de otros salvo que ya no sean ciertas.

- 2026-11-24 — Visión de producto en `docs/vision.md` (fuente de verdad del alcance). Límite: 4–5 issues en total; nada de funciones extra.
- 2026-11-24 — Ciudades/zonas fijas y en este orden: Ciudad de México (America/Mexico_City), Madrid (Europe/Madrid), Tokio (Asia/Tokyo), Nueva York (America/New_York).
- 2026-11-24 — Formato: 24 h `HH:MM:SS` (hourCycle h23) + fecha corta en `es-ES`. UI en español. Los nombres de ciudad deben estar en el HTML estático (los busca el test de integración).
- 2026-11-24 — Sin paso de build: se publica el sitio estático tal cual en GitHub Pages; `src/time.js` debe incluirse en el artefacto. Vitest con versión fija (sin ^/~). Node local: v26; CI: LTS (20/22).
- 2026-11-24 — Vitest fijado en 5.1.1 (requiere Node ^22.12||^24||>=26) → CI usa Node 22, no 20. Estructura: index.html, css/styles.css, js/main.js, src/time.js, tests/. Artefacto de Pages = index.html, css/, js/, src/. Backlog en docs/backlog.md (3 issues; total 5).
- 2026-11-24 — #3 hecho: package.json, package-lock.json, src/time.js, tests/time.test.js. formatDate real: "lun, 15 ene". Tokio a las 20:00Z del 15 ene ya es "mar, 16 ene".
- 2026-11-24 — #5 hecho: workflow Pages (actions checkout/setup-node v4, configure-pages v5, upload-pages-artifact v3, deploy-pages v4) y README. El deploy falla hasta que #4 cree index.html, css/ y js/.
