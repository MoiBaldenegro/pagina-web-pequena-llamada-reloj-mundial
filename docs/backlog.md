# Backlog (orden de ejecución)

Total del proyecto: 5 issues (#1 descubrimiento, #2 planificación, B1–B3 construcción).

1. **B1 (p1)** Lógica `src/time.js` + esqueleto ejecutable con tests unitarios (package.json, Vitest 5.1.1, `npm test` verde).
2. **B2 (p1)** UI: `index.html`, CSS, `js/main.js` + test de integración con `node:http`.
3. **B3 (p2)** Workflow de GitHub Pages + `README.md`.

## Estado (2026-11-24, issue #7)
B1–B3 completados; `npm test` verde (10 tests). Pendiente solo #8: CI/Pages en rojo, causa probable Pages sin habilitar (paso humano: Settings > Pages > Source: GitHub Actions). No se propone trabajo nuevo; al quedar #8 verde el producto cumple el MVP.

## Estado (2026-11-25, issue #9)
Pages habilitado por el humano; 10 tests verdes; README con instalar/correr/probar. MVP completo, sin bugs ni p0 → productionReady: true. Sin issues nuevos.
