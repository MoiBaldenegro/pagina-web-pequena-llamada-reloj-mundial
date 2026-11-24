# Memoria de página web pequeña llamada "Reloj mundial"

Decisiones, convenciones y aprendizajes que cualquier agente futuro debe conocer.
Agrega entradas cortas y fechadas; no borres las de otros salvo que ya no sean ciertas.

- 2026-11-24 — Visión de producto en `docs/vision.md` (fuente de verdad del alcance). Límite: 4–5 issues en total; nada de funciones extra.
- 2026-11-24 — Ciudades/zonas fijas y en este orden: Ciudad de México (America/Mexico_City), Madrid (Europe/Madrid), Tokio (Asia/Tokyo), Nueva York (America/New_York).
- 2026-11-24 — Formato: 24 h `HH:MM:SS` (hourCycle h23) + fecha corta en `es-ES`. UI en español. Los nombres de ciudad deben estar en el HTML estático (los busca el test de integración).
- 2026-11-24 — Sin paso de build: se publica el sitio estático tal cual en GitHub Pages; `src/time.js` debe incluirse en el artefacto. Vitest con versión fija (sin ^/~). Node local: v26; CI: LTS (20/22).
