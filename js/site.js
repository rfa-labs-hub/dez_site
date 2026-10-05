(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const menuBtn = $(".menu-btn");
  const nav = $(".js-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      })
    );
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  const notify = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4200);
  };

  const phoneOk = (v) => /^[\d+\s()-]{10,}$/.test(v.trim());

  const calc = $("#calc-form");
  if (calc) {
    calc.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(calc));
      if (!(data.name || "").trim()) {
        notify("Укажите имя.");
        return;
      }
      if (!phoneOk(data.phone || "")) {
        notify("Укажите телефон, чтобы специалист мог уточнить расчёт.");
        return;
      }
      const box = $("#calc-result");
      box.hidden = false;
      box.innerHTML = `Заявка принята. Свяжемся с <strong>${data.name.trim()}</strong> по номеру ${data.phone} и уточним детали для расчёта.`;
      notify("Заявка на расчёт стоимости отправлена.");
      calc.reset();
    });
  }

  const urgent = $("#urgent-form");
  if (urgent) {
    urgent.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = new FormData(urgent).get("phone");
      if (!phoneOk(String(phone || ""))) {
        notify("Укажите телефон, чтобы согласовать выезд.");
        return;
      }
      notify("Заявка на вызов специалиста принята. Уточним ситуацию и возможное время.");
      urgent.reset();
    });
  }

  $$("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const id = el.getAttribute("href");
      if (id && id.startsWith("#")) {
        const t = $(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  document.documentElement.classList.add("js");
  const cookie = $("#cookie");
  const cookieOk = $("#cookie-ok");
  const cookieKey = "dezika-cookie";
  if (cookie && cookieOk) {
    if (localStorage.getItem(cookieKey) === "1") {
      cookie.hidden = true;
    } else {
      cookie.hidden = false;
    }
    cookieOk.addEventListener("click", () => {
      localStorage.setItem(cookieKey, "1");
      cookie.hidden = true;
    });
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const nodes = $$(".card, .issue-list li, .object-card, .step, .equip-grid > article, .equip-featured, .faq-item, .calc-box");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach((el) => {
      el.classList.add("reveal");
      const siblings = [...el.parentElement.children];
      const index = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(index, 8) * 60}ms`;
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight * 0.94 && box.bottom > 0) {
        el.classList.add("is-in");
      } else {
        io.observe(el);
      }
    });
  }
})();
