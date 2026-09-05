// Shared keyboard, focus and background handling for project and CV previews.
function setupPortfolioDialog(overlay, onClose = () => {}) {
  const closeButton = overlay.querySelector('.project-modal-close');
  let returnFocus = null;
  let backgrounds = [];

  function close() {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    backgrounds.forEach(({ element, inert }) => { element.inert = inert; });
    onClose();
    if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  }
  function open() {
    returnFocus = document.activeElement;
    backgrounds = Array.from(document.querySelectorAll('.site-header, main, .site-footer, .skip-link'))
      .map(element => ({ element, inert: element.inert }));
    backgrounds.forEach(({ element }) => { element.inert = true; });
    document.querySelectorAll('.project-video').forEach(video => video.pause());
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    overlay.querySelector('.project-modal-dialog').scrollTop = 0;
    closeButton.focus();
  }
  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', event => {
    if (event.target === overlay) close();
  });
  overlay.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(overlay.querySelectorAll('a[href], button, iframe, video[controls], embed, [tabindex="0"]'))
      .filter(element => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  return { open, close };
}
