const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = [...document.querySelectorAll(".reveal, .reveal-list")];
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector(".menu-panel");
const transitionLayer = document.querySelector(".page-transition");
const orbitValue = document.querySelector("#orbit-value");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

revealItems.forEach((item) => {
  [...item.children].forEach((child, index) => {
    child.style.setProperty("--item-index", index);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const activeId = `#${entry.target.id}`;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === activeId);
      });
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0
  }
);

sections.forEach((section) => navObserver.observe(section));

document.addEventListener("click", (event) => {
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.append(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  pushStarImpulse(event.clientX, event.clientY);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    transitionLayer?.classList.add("is-active");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuPanel?.setAttribute("aria-hidden", "true");

    window.setTimeout(() => {
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      window.setTimeout(() => transitionLayer?.classList.remove("is-active"), 260);
    }, prefersReducedMotion ? 0 : 180);
  });
});

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuPanel?.setAttribute("aria-hidden", String(!isOpen));
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

const canvas = document.querySelector("#starfield");
const ctx = canvas?.getContext("2d");
const STAR_SPEED_SCALE = 0.48;
const STAR_TRAIL_SCALE = 0.72;
let width = 0;
let height = 0;
let stars = [];
let driftStars = [];
let comets = [];
let starImpulses = [];
let time = 0;

function resizeStarfield() {
  if (!canvas || !ctx) {
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const orbitCount = Math.min(150, Math.floor((width * height) / 11200));
  const driftCount = Math.min(90, Math.floor((width * height) / 17000));
  const cometCount = Math.max(3, Math.floor(width / 420));
  const centerX = width * (0.48 + Math.random() * 0.12);
  const centerY = height * (0.38 + Math.random() * 0.18);

  stars = Array.from({ length: orbitCount }, (_, index) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * Math.max(width, height) * 0.86;
    const ellipse = 0.22 + Math.random() * 0.72;
    const skew = (Math.random() - 0.5) * 0.42;
    const speed = (0.00012 + Math.random() * 0.00058) * (Math.random() > 0.78 ? -1 : 1);

    return {
      angle,
      radius,
      ellipse,
      skew,
      speed,
      size: 0.45 + Math.random() * 1.45,
      alpha: 0.24 + Math.random() * 0.72,
      centerX: centerX + (Math.random() - 0.5) * width * 0.36,
      centerY: centerY + (Math.random() - 0.5) * height * 0.28,
      phase: Math.random() * Math.PI * 2,
      wobble: 8 + Math.random() * 42,
      tail: 20 + Math.random() * 90,
      color: Math.random() > 0.72 ? "231, 214, 160" : "139, 213, 255"
    };
  });

  driftStars = Array.from({ length: driftCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.1,
    vy: (Math.random() - 0.5) * 0.08,
    size: 0.35 + Math.random() * 1.2,
    alpha: 0.12 + Math.random() * 0.42,
    phase: Math.random() * Math.PI * 2,
    color: Math.random() > 0.82 ? "231, 214, 160" : "180, 221, 255"
  }));

  comets = Array.from({ length: cometCount }, () => createComet(true));
}

function createComet(isInitial = false) {
  const fromLeft = Math.random() > 0.5;
  const startX = fromLeft ? -Math.random() * width : width + Math.random() * width;
  const startY = Math.random() * height * 0.88;
  const speed = 1.5 + Math.random() * 2.7;
  const angle = (fromLeft ? 1 : -1) * (0.08 + Math.random() * 0.24);

  return {
    x: isInitial ? Math.random() * width : startX,
    y: isInitial ? Math.random() * height : startY,
    vx: (fromLeft ? 1 : -1) * speed,
    vy: speed * angle,
    life: isInitial ? Math.random() * 260 : 0,
    delay: Math.random() * 860,
    length: 90 + Math.random() * 180,
    alpha: 0.18 + Math.random() * 0.36,
    color: Math.random() > 0.55 ? "139, 213, 255" : "231, 214, 160"
  };
}

function pushStarImpulse(x, y) {
  if (prefersReducedMotion) {
    return;
  }

  starImpulses.push({
    x,
    y,
    age: 0,
    maxAge: 130,
    radius: 90,
    maxRadius: Math.max(width, height) * 0.62
  });

  if (starImpulses.length > 5) {
    starImpulses.shift();
  }

  stars.forEach((star) => {
    const angle = star.angle + time * star.speed * STAR_SPEED_SCALE;
    const orbitX = Math.cos(angle) * star.radius;
    const orbitY = Math.sin(angle) * star.radius * star.ellipse;
    const xOnOrbit = star.centerX + orbitX + orbitY * star.skew;
    const yOnOrbit = star.centerY + orbitY;
    const distance = Math.hypot(xOnOrbit - x, yOnOrbit - y);

    if (distance < 280) {
      const force = 1 - distance / 280;
      star.phase += force * 1.8;
      star.wobble += force * 34;
      star.alpha = Math.min(0.96, star.alpha + force * 0.22);
      star.speed += Math.sign(star.speed || 1) * force * 0.00008;
    }
  });

  driftStars.forEach((star) => {
    const dx = star.x - x;
    const dy = star.y - y;
    const distance = Math.hypot(dx, dy);

    if (distance < 230) {
      const force = (1 - distance / 230) * 1.8;
      const angle = Math.atan2(dy, dx);
      star.vx += Math.cos(angle) * force * 0.18;
      star.vy += Math.sin(angle) * force * 0.18;
      star.alpha = Math.min(0.68, star.alpha + force * 0.12);
    }
  });
}

function drawStarfield() {
  if (!ctx || prefersReducedMotion) {
    return;
  }

  time += 1;
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  starImpulses = starImpulses.filter((impulse) => {
    impulse.age += 1;
    impulse.radius += (impulse.maxRadius - impulse.radius) * 0.045;

    const progress = impulse.age / impulse.maxAge;
    const alpha = Math.max(0, 1 - progress) * 0.32;

    if (alpha > 0) {
      const gradient = ctx.createRadialGradient(
        impulse.x,
        impulse.y,
        Math.max(0, impulse.radius * 0.1),
        impulse.x,
        impulse.y,
        impulse.radius
      );
      gradient.addColorStop(0, `rgba(231, 214, 160, ${alpha * 0.28})`);
      gradient.addColorStop(0.58, `rgba(139, 213, 255, ${alpha})`);
      gradient.addColorStop(1, "rgba(139, 213, 255, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.2 + progress * 2.2;
      ctx.beginPath();
      ctx.arc(impulse.x, impulse.y, impulse.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    return impulse.age < impulse.maxAge;
  });

  stars.forEach((star) => {
    const angle = star.angle + time * star.speed * STAR_SPEED_SCALE;
    const previousAngle = angle - star.speed * star.tail * STAR_TRAIL_SCALE;
    const drift = Math.sin(time * 0.0032 + star.phase) * star.wobble;
    const pulse = Math.sin(time * 0.009 + star.phase) * 0.16 + 0.84;
    const orbitX = Math.cos(angle) * (star.radius + drift);
    const orbitY = Math.sin(angle) * star.radius * star.ellipse;
    const previousOrbitX = Math.cos(previousAngle) * (star.radius + drift);
    const previousOrbitY = Math.sin(previousAngle) * star.radius * star.ellipse;
    const x = star.centerX + orbitX + orbitY * star.skew;
    const y = star.centerY + orbitY;
    const previousX = star.centerX + previousOrbitX + previousOrbitY * star.skew;
    const previousY = star.centerY + previousOrbitY;

    const gradient = ctx.createLinearGradient(previousX, previousY, x, y);
    gradient.addColorStop(0, `rgba(${star.color}, 0)`);
    gradient.addColorStop(0.72, `rgba(${star.color}, ${star.alpha * 0.16})`);
    gradient.addColorStop(1, `rgba(${star.color}, ${star.alpha * pulse})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = star.size;
    ctx.beginPath();
    ctx.moveTo(previousX, previousY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (star.radius < 420 || star.size > 1.4) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * pulse})`;
      ctx.beginPath();
      ctx.arc(x, y, star.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  driftStars.forEach((star) => {
    star.x += star.vx + Math.sin(time * 0.004 + star.phase) * 0.04;
    star.y += star.vy + Math.cos(time * 0.003 + star.phase) * 0.03;
    star.vx *= 0.992;
    star.vy *= 0.992;

    if (star.x < -10) star.x = width + 10;
    if (star.x > width + 10) star.x = -10;
    if (star.y < -10) star.y = height + 10;
    if (star.y > height + 10) star.y = -10;

    const alpha = star.alpha * (0.65 + Math.sin(time * 0.012 + star.phase) * 0.35);
    ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  comets = comets.map((comet) => {
    if (comet.delay > 0) {
      comet.delay -= 1;
      return comet;
    }

    comet.x += comet.vx;
    comet.y += comet.vy + Math.sin((time + comet.life) * 0.008) * 0.12;
    comet.life += 1;

    const endX = comet.x - comet.vx * comet.length * 0.08;
    const endY = comet.y - comet.vy * comet.length * 0.08;
    const gradient = ctx.createLinearGradient(endX, endY, comet.x, comet.y);
    gradient.addColorStop(0, `rgba(${comet.color}, 0)`);
    gradient.addColorStop(1, `rgba(${comet.color}, ${comet.alpha})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(comet.x, comet.y);
    ctx.stroke();

    const outOfView =
      comet.x < -width * 0.25 ||
      comet.x > width * 1.25 ||
      comet.y < -height * 0.25 ||
      comet.y > height * 1.25;

    return outOfView || comet.life > 820 ? createComet() : comet;
  });

  const pulse = 50 + Math.sin(time * 0.012) * 28;
  if (orbitValue) {
    orbitValue.textContent = `${pulse.toFixed(2)}`;
  }

  requestAnimationFrame(drawStarfield);
}

window.addEventListener("resize", resizeStarfield);
resizeStarfield();
drawStarfield();
