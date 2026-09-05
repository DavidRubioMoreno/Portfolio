// Native scrolling keeps touch swipes and keyboard navigation available.
(() => {
  const carousel = document.querySelector('.skills-carousel');
  if (!carousel) return;
  let drag = null;

  carousel.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { x: event.clientX, scroll: carousel.scrollLeft };
    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add('is-dragging');
  });
  carousel.addEventListener('pointermove', event => {
    if (!drag) return;
    carousel.scrollLeft = drag.scroll - (event.clientX - drag.x);
  });
  function endDrag() {
    drag = null;
    carousel.classList.remove('is-dragging');
  }
  carousel.addEventListener('pointerup', endDrag);
  carousel.addEventListener('pointercancel', endDrag);
  carousel.addEventListener('lostpointercapture', endDrag);
})();
