# Backlog (orden de ejecución)

Total del proyecto: 5 issues (#1 descubrimiento, #2 planificación, B1–B3 construcción).

1. **B1 (p1)** Lógica `src/time.js` + esqueleto ejecutable con tests unitarios (package.json, Vitest 5.1.1, `npm test` verde).
2. **B2 (p1)** UI: `index.html`, CSS, `js/main.js` + test de integración con `node:http`.
3. **B3 (p2)** Workflow de GitHub Pages + `README.md`.

## Estado (2026-11-24, issue #7)
B1–B3 completados; `npm test` verde (10 tests). Pendiente solo #8: CI/Pages en rojo, causa probable Pages sin habilitar (paso humano: Settings > Pages > Source: GitHub Actions). No se propone trabajo nuevo; al quedar #8 verde el producto cumple el MVP.

## Estado (2026-11-25, issue #9)
Pages habilitado por el humano; 10 tests verdes; README con instalar/correr/probar. MVP completo, sin bugs ni p0 → productionReady: true. Sin issues nuevos.

## Estado (2026-11-25, issue #10)
Revisión repetida: 10 tests verdes, MVP completo, sin bugs ni p0. productionReady: true, sin issues nuevos.

## Estado (2026-11-25, issue #15)
Revisión: 14 tests verdes; MVP + selector de ciudades (#11) y estilos MXVI (#13) completos; sin bugs ni p0. productionReady: true, sin issues nuevos.

## Estado (2026-11-25, issue #17)
14 tests verdes; MVP completo. Lo siguiente ya está planeado en el issue abierto #18 (zona horaria); no se proponen issues nuevos. productionReady queda en false hasta cerrar #18.

## Estado (2026-11-25, issue #19)
16 tests verdes; #18 (zona horaria visible + búsqueda por zona) completado. MVP completo, README explica instalar/correr/probar, sin bugs ni p0 → productionReady: true. Sin issues nuevos.
