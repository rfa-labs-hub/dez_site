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

  const phoneOk = (v) => {
    const digits = String(v || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  const modal = $("#modal-lead");
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const first = modal.querySelector('input[name="name"]');
    if (first) first.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  $$(".js-open-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  $$(".js-close-modal").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  const calc = $("#calc-form");
  let submitting = false;
  if (calc) {
    calc.addEventListener("submit", (e) => {
      e.preventDefault();
      if (submitting) return;

      const data = Object.fromEntries(new FormData(calc));
      if ((data.company || "").trim()) {
        notify("Заявка не отправлена.");
        return;
      }
      if (!(data.name || "").trim()) {
        notify("Укажите имя.");
        calc.querySelector('[name="name"]')?.focus();
        return;
      }
      if (!phoneOk(data.phone || "")) {
        notify("Укажите корректный телефон.");
        calc.querySelector('[name="phone"]')?.focus();
        return;
      }
      if (!calc.querySelector('[name="consent"]')?.checked) {
        notify("Нужно согласие на обработку персональных данных.");
        calc.querySelector('[name="consent"]')?.focus();
        return;
      }

      submitting = true;
      const submitBtn = $("#calc-submit");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Отправляем…";
      }

      const box = $("#calc-result");
      if (box) {
        box.hidden = false;
        box.innerHTML = `Заявка принята. Свяжемся с <strong>${data.name.trim()}</strong> по номеру ${data.phone} и уточним детали для расчёта.`;
      }
      notify("Заявка на расчёт стоимости отправлена.");

      setTimeout(() => {
        calc.reset();
        submitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Отправить заявку";
        }
        if (box) box.hidden = true;
        closeModal();
      }, 2200);
    });
  }

  const seoMore = $("#seo-more");
  const seoToggle = $(".js-seo-toggle");
  if (seoMore && seoToggle) {
    seoToggle.addEventListener("click", () => {
      const open = seoMore.hidden;
      seoMore.hidden = !open;
      seoToggle.setAttribute("aria-expanded", String(open));
      seoToggle.textContent = open ? "Свернуть" : "Подробнее";
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
    const nodes = $$(".card, .issue-list li, .object-card, .step, .equip-grid > article, .equip-featured, .faq-item, .calc-box, .hero-badges li");
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
