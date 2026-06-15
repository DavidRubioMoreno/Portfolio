(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext("2d");
  let w, h, dpr = 1;
  let mouseX = -9999, mouseY = -9999;
  let animId = null;
  let inited = false;

  const COLORS = [
    "rgba(0, 255, 136,",
    "rgba(124, 58, 237,",
    "rgba(255, 255, 255,",
  ];

  const isMobile = window.innerWidth < 768;
  const COUNT = isMobile ? 50 : 100;
  const MAX_SPEED = 0.6;
  const MOUSE_STRENGTH = 0.008;

  const particles = [];

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }

  function initParticles() {
    if (inited) return;
    inited = true;
    for (let i = 0; i < COUNT; i++) {
      const colorIdx = Math.floor(Math.random() * COLORS.length);
      const opacity = 0.12 + Math.random() * 0.2;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: 2 + Math.random() * 3,
        color: colorIdx,
        opacity: opacity,
      });
    }
  }

  function tick() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < COUNT; i++) {
      const p = particles[i];

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 1) {
        const force = MOUSE_STRENGTH / (1 + dist * 0.02);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.vx += (Math.random() - 0.5) * 0.02;
      p.vy += (Math.random() - 0.5) * 0.02;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED;
        p.vy = (p.vy / speed) * MAX_SPEED;
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.fillStyle = COLORS[p.color] + p.opacity + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(tick);
  }

  function onMouseMove(e) {
    const rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function onResize() {
    resize();
    for (let i = 0; i < COUNT; i++) {
      particles[i].x = Math.min(particles[i].x, w);
      particles[i].y = Math.min(particles[i].y, h);
    }
  }

  function start() {
    if (animId) return;
    resize();
    if (!inited) initParticles();
    tick();
  }

  function stop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  hero.addEventListener("mousemove", onMouseMove, { passive: true });
  hero.addEventListener("mouseleave", onMouseLeave, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 150);
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) start(); else stop();
      });
    }, { threshold: 0 });
    observer.observe(hero);
  }

  start();
})();
