(function () {
  "use strict";

  var overlay = document.getElementById("page-transition");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ensureOverlay() {
    overlay = document.getElementById("page-transition");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "page-transition";
      overlay.id = "page-transition";
      overlay.setAttribute("aria-hidden", "true");
      document.body.appendChild(overlay);
    }
    // Upgrade to dual-panel cinematic curtain when needed
    if (overlay.querySelectorAll(".page-transition__panel").length < 2) {
      overlay.innerHTML =
        '<div class="page-transition__panel page-transition__panel--a"></div>' +
        '<div class="page-transition__panel page-transition__panel--b"></div>' +
        '<div class="page-transition__mark">Raymond John</div>';
    }
    return overlay;
  }

  function panels(el) {
    var list = el.querySelectorAll(".page-transition__panel");
    if (list.length) return list;
    // backward compatible single panel markup
    var single = el.querySelector(".page-transition__panel");
    return single ? [single] : [];
  }

  function enterPage(done) {
    var el = ensureOverlay();
    var panelEls = panels(el);
    var mark = el.querySelector(".page-transition__mark");

    if (reduced || typeof gsap === "undefined") {
      el.style.pointerEvents = "none";
      gsap && gsap.set(panelEls, { scaleY: 0 });
      if (done) done();
      return;
    }

    el.classList.add("is-entering");
    gsap.set(panelEls, { scaleY: 1, transformOrigin: "bottom" });
    gsap.set(mark, { opacity: 0, y: 8 });

    gsap
      .timeline({
        onComplete: function () {
          el.classList.remove("is-entering");
          if (done) done();
        },
      })
      .to(mark, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0)
      .to(mark, { opacity: 0, y: -8, duration: 0.25, ease: "power2.in" }, 0.28)
      .to(
        panelEls,
        {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.85,
          stagger: 0.08,
          ease: "power4.inOut",
        },
        0.22
      );
  }

  function leaveTo(url) {
    if (reduced || typeof gsap === "undefined") {
      window.location.href = url;
      return;
    }

    var el = ensureOverlay();
    var panelEls = panels(el);
    var mark = el.querySelector(".page-transition__mark");

    document.body.classList.add("is-transitioning");
    el.classList.add("is-leaving");
    gsap.set(panelEls, { scaleY: 0, transformOrigin: "top" });
    gsap.set(mark, { opacity: 0, y: 10 });

    gsap
      .timeline({
        onComplete: function () {
          window.location.href = url;
        },
      })
      .to(panelEls, {
        scaleY: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "power4.inOut",
      })
      .to(mark, { opacity: 1, y: 0, duration: 0.22 }, "-=0.25");
  }

  function bindLinks() {
    document.querySelectorAll("a[href]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === "_blank") return;

        var href = link.getAttribute("href");
        if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0)
          return;
        if (href.indexOf("http") === 0 && href.indexOf(window.location.origin) !== 0) return;

        var url;
        try {
          url = new URL(href, window.location.href);
        } catch (err) {
          return;
        }

        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          if (url.hash) return;
        }

        if (!/\.html?$/i.test(url.pathname) && url.pathname.slice(-1) !== "/") return;

        e.preventDefault();
        leaveTo(url.href);
      });
    });
  }

  window.RJTransitions = {
    enterPage: enterPage,
    leaveTo: leaveTo,
    bindLinks: bindLinks,
  };
})();
