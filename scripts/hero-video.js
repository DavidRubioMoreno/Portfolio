(() => {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let visible = true;
  const source = video.querySelector('source');
  let reverseNext = false;
  let restartPending = true;

  function updatePlayback() {
    if (!visible || document.hidden || reducedMotion.matches || connection?.saveData) {
      video.pause();
      return;
    }
    if (restartPending) {
      source.src = reverseNext ? source.dataset.reverseSrc : source.dataset.src;
      video.load();
      reverseNext = !reverseNext;
      restartPending = false;
    } else if (video.ended) {
      return;
    }
    video.play().catch(() => {});
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (!visible && entry.isIntersecting) restartPending = true;
      visible = entry.isIntersecting;
      updatePlayback();
    }).observe(video.closest('.hero'));
  } else {
    updatePlayback();
  }
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
  connection?.addEventListener('change', updatePlayback);
})();
