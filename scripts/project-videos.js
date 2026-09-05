(() => {
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = document.querySelectorAll('.project-video');
  const pauseAll = () => videos.forEach(video => video.pause());
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); });
  }) : null;

  videos.forEach(video => {
    const card = video.closest('.project-card');
    function play() {
      if (!hover.matches || reducedMotion.matches || document.hidden || document.body.classList.contains('modal-open')) return;
      video.play().catch(() => {});
    }
    card.addEventListener('mouseenter', play);
    card.addEventListener('focusin', play);
    card.addEventListener('mouseleave', () => video.pause());
    card.addEventListener('focusout', event => {
      if (!card.contains(event.relatedTarget)) video.pause();
    });
    if (observer) observer.observe(video);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
  reducedMotion.addEventListener('change', pauseAll);
  hover.addEventListener('change', pauseAll);
})();
