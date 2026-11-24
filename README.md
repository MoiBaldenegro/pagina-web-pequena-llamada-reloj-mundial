# Reloj mundial

Página estática que muestra la hora (24 h) y la fecha de Ciudad de México, Madrid, Tokio y Nueva York.

## Instalar
Requiere Node 22.12 o superior.

```
npm install
```

## Ver en local
Los módulos ES no funcionan desde `file://`; usa un servidor estático:

```
npx serve .
# o: python3 -m http.server 8000
```

## Probar
```
npm test
```

## Publicar
Cada push a `main` ejecuta `.github/workflows/pages.yml`: corre los tests y, si pasan, publica `index.html`, `css/`, `js/` y `src/` en GitHub Pages.

URL: https://moibaldenegro.github.io/pagina-web-pequena-llamada-reloj-mundial/

**Paso humano (una sola vez):** en el repositorio, Settings > Pages > Build and deployment > Source: **GitHub Actions**.
