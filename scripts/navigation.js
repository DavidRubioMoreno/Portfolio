(() => {
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (!nav || !menu || !links) return;
  nav.classList.add('nav-enhanced');

  function setMenu(open) {
    menu.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  }
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setMenu(false);
    const section = document.querySelector(link.getAttribute('href'));
    if (section) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) setMenu(false);
  });
  window.matchMedia('(min-width: 821px)').addEventListener('change', () => setMenu(false));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.querySelectorAll('a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
})();
