# Portfolio David Rubio Moreno

En esta pagina web encontraras mi portfolio personal: informacion sobre mi perfil, habilidades, proyectos destacados, contribuciones en GitHub y mi CV.

Web: https://davidrubiomoreno.github.io/Portfolio/

## Desarrollo local

La web sigue siendo HTML, CSS y JavaScript sin dependencias ni compilación.
Para revisarla: `python -m http.server 8000` y abrir `http://localhost:8000`.

- El diseño responsive y los estilos están en el bloque `<style>` de `index.html`.
- `scripts/navigation.js` controla el menú móvil y la sección activa.
- `scripts/dialog.js` comparte el cierre y la gestión del foco de las vistas de proyectos y CV.
- El carrusel usa desplazamiento nativo (táctil, teclado y arrastre con ratón).
- Las miniaturas WebP en `assets/images/projects/` se extraen de las demos originales.
- Las versiones MP4 de String Typing, Endless Redemption y Nightmare Tales conservan
  el vídeo H.264 original; los MKV originales permanecen disponibles.
- Los vídeos de las tarjetas se cargan al interactuar desde escritorio. En móvil se
  muestran las miniaturas y los vídeos se pueden reproducir desde «Ver detalles».
- Al abrir `index.html` directamente (`file://`), las vistas de proyectos usan las
  demos MP4: YouTube requiere una referencia HTTP para sus vídeos incrustados.
  Desde un servidor web se mantienen los reproductores de YouTube, con la opción
  «Ver demo sin YouTube» si el navegador bloquea la reproducción. Los enlaces a
  los tráilers originales se conservan en ambos casos.

Comprobar manualmente tras editar: navegación móvil, anchos de 320 a 1440 px,
idiomas ES/EN, detalles de proyectos, cierre con Escape, CV y calendario de GitHub.
