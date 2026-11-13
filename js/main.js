(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var menuOpen = false;
  var menuTween = null;

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setActiveNav() {
    var path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (!path || path === "") path = "index.html";
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
      var active = href === path;
      if (path === "project-details.html" && href === "projects.html") active = true;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function onScrollHeader() {
    if (!header) return;
    var scrolled = window.scrollY > 24;
    var sideMode = window.scrollY > 100 && !menuOpen;
    header.classList.toggle("is-solid", scrolled && !sideMode);
    header.classList.toggle("is-side", sideMode);
    document.body.classList.toggle("nav-is-side", sideMode);
  }

  function openMenu() {
    if (!mobileNav || !toggle) return;
    menuOpen = true;
    mobileNav.hidden = false;
    mobileNav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.classList.add("menu-open");
    var links = mobileNav.querySelectorAll(".mobile-nav__link");
    if (typeof gsap !== "undefined" && !prefersReduced()) {
      if (menuTween) menuTween.kill();
      gsap.set(links, { opacity: 0, y: 28 });
      menuTween = gsap.to(links, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
      });
    } else {
      links.forEach(function (l) {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
    }
  }

  function closeMenu(immediate) {
    if (!mobileNav || !toggle) return;
    menuOpen = false;
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.classList.remove("menu-open");
    var links = mobileNav.querySelectorAll(".mobile-nav__link");
    function hide() {
      mobileNav.classList.remove("is-open");
      mobileNav.hidden = true;
      if (typeof gsap !== "undefined") gsap.set(links, { clearProps: "opacity,transform" });
    }
    if (menuTween) menuTween.kill();
    if (immediate || prefersReduced() || typeof gsap === "undefined") {
      hide();
      return;
    }
    menuTween = gsap.to(links, {
      opacity: 0,
      y: -12,
      duration: 0.18,
      stagger: 0.02,
      onComplete: hide,
    });
  }

  function bindNav() {
    if (toggle) {
      toggle.addEventListener("click", function () {
        if (menuOpen) closeMenu();
        else openMenu();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOpen) closeMenu(true);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100 && menuOpen) closeMenu(true);
      onScrollHeader();
    });
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();
    setActiveNav();
  }

  function bindContactForm() {
    var form = document.getElementById("contact-form");
    if (!form || !window.RJData) return;
    var status = document.getElementById("form-status");

    function setError(group, on) {
      group.classList.toggle("is-error", !!on);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var subject = form.querySelector("#subject");
      var message = form.querySelector("#message");
      var ok = true;

      setError(name.closest(".form-group"), !name.value.trim());
      if (!name.value.trim()) ok = false;
      var emailOk = email.value.trim() && validEmail(email.value.trim());
      setError(email.closest(".form-group"), !emailOk);
      if (!emailOk) ok = false;
      setError(subject.closest(".form-group"), !subject.value.trim());
      if (!subject.value.trim()) ok = false;
      setError(message.closest(".form-group"), !message.value.trim());
      if (!message.value.trim()) ok = false;

      if (!ok) {
        if (status) {
          status.className = "form-status is-on";
          status.textContent = "Please fix the highlighted fields and try again.";
        }
        return;
      }

      var data = RJData.load();
      data.messages.unshift({
        id: RJData.uid("msg"),
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim(),
        read: false,
        createdAt: new Date().toISOString(),
      });
      RJData.save(data);

      if (status) {
        status.className = "form-status is-on is-ok";
        status.textContent =
          "Message saved in this browser for the demo dashboard. No server was contacted — this is frontend-only persistence.";
      }
      form.reset();
    });
  }

  function bindProjectFilters() {
    var bar = document.getElementById("project-filters");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      var cat = btn.getAttribute("data-filter");
      document.querySelectorAll("[data-project-tile]").forEach(function (tile) {
        var match = cat === "all" || tile.getAttribute("data-category") === cat;
        tile.classList.toggle("is-hidden", !match);
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  }

  function yearStamp() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function boot() {
    yearStamp();
    bindNav();
    bindContactForm();
    bindProjectFilters();

    if (window.RJPublic) RJPublic.renderAll();

    function afterEnter() {
      if (window.RJAnimations) {
        RJAnimations.pageIntro();
        RJAnimations.scrollScenes();
        RJAnimations.scrollProgress();
        RJAnimations.magneticButtons();
        if (typeof RJAnimations.projectHovers === "function") {
          RJAnimations.projectHovers();
        }
      }
      if (window.RJTransitions) RJTransitions.bindLinks();
      if (window.RJCursor) RJCursor.refresh();
    }

    if (window.RJTransitions) RJTransitions.enterPage(afterEnter);
    else afterEnter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
