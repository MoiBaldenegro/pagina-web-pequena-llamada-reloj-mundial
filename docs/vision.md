# Visión de producto — "Reloj mundial"

## Problema
Quien trabaja o se comunica con personas en otros países necesita saber, de un vistazo y sin hacer cuentas de husos horarios, qué hora es ahora mismo en las ciudades con las que trata. Las alternativas (buscadores, apps de reloj) piden pasos extra o están llenas de funciones que no hacen falta.

## Usuarios
- Personas de habla hispana (el dueño del proyecto y quien reciba el enlace) que quieren consultar rápido la hora en Ciudad de México, Madrid, Tokio y Nueva York, sobre todo desde el celular.
- Uso de solo lectura: abrir la página y mirar. Sin cuentas ni configuración.

## Alcance del MVP (lista verificable)
1. [ ] Una sola página (`index.html`) titulada "Reloj mundial" que muestra exactamente 4 tarjetas, en este orden: **Ciudad de México**, **Madrid**, **Tokio**, **Nueva York**.
2. [ ] Cada tarjeta muestra el nombre de la ciudad y la hora local actual en formato 24 h `HH:MM:SS`, más la fecha corta local (p. ej. "lun, 24 nov") para que se note el cambio de día.
3. [ ] Zonas horarias IANA: `America/Mexico_City`, `Europe/Madrid`, `Asia/Tokyo`, `America/New_York` (el horario de verano lo resuelve `Intl`).
4. [ ] La hora se actualiza cada segundo en el navegador, sin recargar la página.
5. [ ] El HTML estático ya contiene los 4 nombres de ciudad (no se generan solo por JS), para que sean visibles aunque JS tarde y para que el test de integración los encuentre.
6. [ ] Diseño limpio y responsivo, mobile-first: legible sin zoom en pantallas de 360 px de ancho (una columna en celular, rejilla en pantallas anchas), sin scroll horizontal, con `<meta name="viewport">`.
7. [ ] La lógica de formato vive en `src/time.js` (módulo ES) usando `Intl.DateTimeFormat`; la UI solo la importa y la usa.
8. [ ] `npm test` ejecuta Vitest (dependencia de desarrollo con versión fija, sin `^` ni `~`) y pasa:
   - Tests unitarios de `src/time.js`: con una fecha fija (p. ej. `2024-01-15T12:00:00Z`) se obtiene la hora esperada en cada una de las 4 zonas.
   - Test de integración: dentro del propio test levanta un servidor HTTP estático (módulo `node:http`, puerto 0 = libre), pide la página con `fetch`, verifica que el HTML contiene las 4 ciudades y cierra el servidor en `afterAll`. No quedan procesos en segundo plano.
9. [ ] Workflow de GitHub Actions que, en cada push a `main`, corre los tests y despliega el sitio estático a GitHub Pages (`actions/upload-pages-artifact` + `actions/deploy-pages`).
10. [ ] `README.md` explica cómo verlo localmente, cómo correr los tests y dónde queda publicado.

## Fuera de alcance
- Selector o personalización de ciudades, agregar/quitar ciudades.
- Temas (modo oscuro conmutable), configuraciones, preferencia 12/24 h.
- Backend, APIs externas, base de datos, cuentas, analítica.
- Frameworks de UI o bundlers (nada de React, Vite como build, etc.).
- PWA / modo offline, internacionalización a otros idiomas.

## Supuestos (decididos sin consultar)
- Idioma de la interfaz: español (`lang="es"`), locale de formato `es-ES` para la fecha; la hora se fuerza a 24 h (`hourCycle: 'h23'`) en todas las ciudades.
- Se muestra hora con segundos + fecha corta; no se muestra la diferencia horaria respecto al usuario.
- Node 20 LTS o superior (local hay Node 26; CI usará Node 20/22 LTS). Sin dependencias de runtime; solo Vitest en `devDependencies`.
- El sitio se publica tal cual (archivos estáticos), sin paso de build. Los archivos que sirve el navegador (incluido `src/time.js`) deben quedar dentro del artefacto publicado.
- El repo es público; GitHub Pages se configura con "Source: GitHub Actions". Si hiciera falta activarlo a mano en Settings, es un paso del humano que se documentará en el README.
- Estilo visual: fondo claro, tipografía del sistema, números con `font-variant-numeric: tabular-nums` para que no "bailen" al cambiar los segundos.

## Stack elegido
- HTML + CSS + JavaScript (módulos ES nativos), sin frameworks.
- `package.json` con `"type": "module"` y script `"test": "vitest run"`.
- Vitest (versión fija) como runner de tests; servidor estático de pruebas con `node:http` + `node:fs` dentro del test.
- GitHub Actions + GitHub Pages para despliegue continuo.

## Criterios de éxito
- `npm install && npm test` pasa en limpio en local y en CI, y termina sin procesos colgados.
- Tras un push a `main`, el workflow queda en verde y la URL de GitHub Pages muestra las 4 ciudades con la hora avanzando cada segundo.
- La hora mostrada coincide con la hora oficial de cada ciudad (verificable contra time.is u otra fuente).
- En un celular (≈360 px de ancho) la página se lee sin zoom ni scroll horizontal.
- El backlog total se completa en 4–5 issues como máximo.
