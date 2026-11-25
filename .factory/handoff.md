# Handoff

- 2026-11-25 — #12 (estilos-rotos): verificado en Chromium headless (desktop 1280x720 y móvil 390x780). Arreglos: `[hidden]{display:none!important}` (el mensaje vacío se mostraba siempre porque `display:grid` anulaba `hidden`) y `layout()` en js/main.js ahora elige columnas por proporción de tile (~1.6) y penaliza huecos (4 relojes → 2x2, sin hueco). Tests verdes.
- Siguiente: nada pendiente obvio; probar panel/localStorage en navegador real si se quiere.
