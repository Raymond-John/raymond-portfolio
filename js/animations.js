(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var ctx = null;

  function splitChars(el) {
    if (!el) return [];
    var text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    return text.split("").map(function (ch) {
      var span = document.createElement("span");
      span.className = "char";
      span.setAttribute("aria-hidden", "true");
      span.innerHTML = ch === " " ? "&nbsp;" : ch;
      el.appendChild(span);
      return span;
    });
  }

  function prepareLineMasks(root) {
    (root || document).querySelectorAll("[data-split-lines]").forEach(function (el) {
      if (el.dataset.splitDone) return;
      var html = el.innerHTML.trim();
      var parts = html.split(/<br\s*\/?>/i);
      if (parts.length === 1 && !el.querySelector(".line-mask")) {
        var words = el.textContent.trim().split(/\s+/);
        if (words.length > 3) {
          var mid = Math.ceil(words.length / 2);
          parts = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
        } else {
          parts = [el.textContent.trim()];
        }
      }
      el.innerHTML = parts
        .map(function (part) {
          return '<span class="line-mask"><span class="line-mask__inner">' + part + "</span></span>";
        })
        .join("");
      el.dataset.splitDone = "1";
    });
  }

  function magneticButtons() {
    if (reduced || coarse) return;
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) / 12,
          y: (e.clientY - r.top - r.height / 2) / 12,
          duration: 0.4,
          ease: "power3.out",
        });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.32)" });
      });
    });
  }

  function projectHovers() {
    if (reduced || coarse) return;
    document.querySelectorAll(".project-tile, .home-feature").forEach(function (card) {
      var media = card.querySelector(".media-frame__inner");
      if (!media) return;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(media, { x: x * 18, y: y * 14, duration: 0.7, ease: "power3.out" });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(media, { x: 0, y: 0, duration: 0.9, ease: "power3.out" });
      });
    });
  }

  function ambientMotion() {
    if (reduced || typeof gsap === "undefined") return;
    var glows = document.querySelectorAll(".glow");
    glows.forEach(function (glow, i) {
      gsap.to(glow, {
        x: i % 2 === 0 ? 40 : -30,
        y: i % 2 === 0 ? -25 : 35,
        scale: 1.08,
        duration: 10 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }

  function pageIntro() {
    if (typeof gsap === "undefined") return;
    prepareLineMasks();

    if (reduced) {
      document.querySelectorAll(".reveal, .line-mask__inner, .char").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    var page = document.body.dataset.page || "home";
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    var header = document.getElementById("site-header");
    var eyebrow = document.querySelector("[data-intro='eyebrow']");
    var lines = document.querySelectorAll("[data-intro='title'] .line-mask__inner");
    var copy = document.querySelectorAll("[data-intro='copy']");
    var actions = document.querySelectorAll("[data-intro='action']");
    var name = document.querySelector("[data-intro='chars']");
    var pageEl = document.querySelector(".page");

    if (header) {
      tl.fromTo(header, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0);
    }

    if (pageEl) {
      gsap.fromTo(pageEl, { opacity: 0.2 }, { opacity: 1, duration: 0.9, ease: "power2.out" });
    }

    if (eyebrow) {
      tl.fromTo(
        eyebrow,
        { y: 28, opacity: 0, letterSpacing: "0.4em" },
        { y: 0, opacity: 1, letterSpacing: "0.24em", duration: 0.75 },
        0.08
      );
    }

    if (name) {
      var chars = splitChars(name);
      tl.fromTo(
        chars,
        { y: 48, opacity: 0, rotateX: -55 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.025,
          ease: "power3.out",
          transformOrigin: "50% 100%",
        },
        0.14
      );
    }

    if (lines.length) {
      gsap.set(lines, { yPercent: 125, opacity: 0, rotate: 1.5 });
      tl.to(
        lines,
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 1.15,
          stagger: 0.13,
          ease: "power4.out",
        },
        0.22
      );
    }

    if (copy.length) {
      tl.fromTo(
        copy,
        { y: 40, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.1 },
        "-=0.45"
      );
    }

    if (actions.length) {
      tl.fromTo(
        actions,
        { y: 32, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.09 },
        "-=0.5"
      );
    }

    // Unique flourishes per page
    if (page === "home") {
      var aside = document.querySelector(".home-hero__aside");
      var stats = document.querySelectorAll(".home-hero__stat");
      var grid = document.querySelector(".home-hero__grid");
      if (aside) {
        tl.fromTo(aside, { x: 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85 }, "-=0.55");
      }
      if (stats.length) {
        tl.fromTo(
          stats,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.09 },
          "-=0.4"
        );
      }
      if (grid) {
        gsap.fromTo(
          grid,
          { opacity: 0, scale: 1.08 },
          { opacity: 0.7, scale: 1, duration: 1.6, ease: "power2.out", delay: 0.2 }
        );
      }
    }

    if (page === "expertise") {
      var pills = document.querySelectorAll(".tech-pill");
      if (pills.length) {
        gsap.fromTo(
          pills,
          { y: 36, opacity: 0, rotateX: -20 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.6,
            stagger: 0.04,
            delay: 0.55,
            ease: "power3.out",
          }
        );
      }
    }

    if (page === "projects") {
      var filters = document.querySelectorAll(".filter-btn");
      var tiles = document.querySelectorAll(".project-tile");
      if (filters.length) {
        gsap.fromTo(
          filters,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, delay: 0.4 }
        );
      }
      if (tiles.length) {
        gsap.fromTo(
          tiles,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, delay: 0.5, ease: "power3.out" }
        );
      }
    }

    if (page === "services") {
      var rows = document.querySelectorAll(".service-row");
      if (rows.length) {
        gsap.fromTo(
          rows,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, stagger: 0.1, delay: 0.45, ease: "power3.out" }
        );
      }
    }

    if (page === "contact") {
      var channels = document.querySelectorAll(".contact-channel");
      if (channels.length) {
        gsap.fromTo(
          channels,
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, stagger: 0.08, delay: 0.45 }
        );
      }
    }

    if (page === "process") {
      var stages = document.querySelectorAll(".process-stage");
      if (stages.length) {
        gsap.fromTo(
          stages,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.4 }
        );
      }
    }

    ambientMotion();
  }

  function scrollScenes() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    if (ctx) ctx.revert();

    if (reduced) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    ctx = gsap.context(function () {
      gsap.utils.toArray(".reveal").forEach(function (el, i) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 64, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.05,
            delay: (i % 5) * 0.035,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.utils.toArray(".media-frame").forEach(function (frame) {
        var inner = frame.querySelector(".media-frame__inner");
        gsap.fromTo(
          frame,
          { clipPath: "inset(14% 10% 14% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.35,
            ease: "power4.out",
            scrollTrigger: {
              trigger: frame,
              start: "top 84%",
              toggleActions: "play none none none",
            },
          }
        );
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.22 },
            {
              scale: 1,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 84%",
                toggleActions: "play none none none",
              },
            }
          );
          gsap.to(inner, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      gsap.utils.toArray(".service-row").forEach(function (row) {
        var line = row.querySelector(".service-row__line");
        if (!line) return;
        gsap.to(line, {
          width: "100%",
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 72%", toggleActions: "play none none none" },
        });
      });

      gsap.utils.toArray(".process-stage").forEach(function (stage) {
        ScrollTrigger.create({
          trigger: stage,
          start: "top 78%",
          onEnter: function () {
            stage.classList.add("is-inview");
          },
        });
      });

      var portrait = document.querySelector(".about-portrait");
      if (portrait) {
        gsap.to(portrait, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: portrait,
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        });
      }

      gsap.utils.toArray(".display--md, .section .display").forEach(function (heading) {
        if (heading.closest("[data-intro='title']")) return;
        gsap.fromTo(
          heading,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 90%" },
          }
        );
      });

      gsap.utils.toArray(".rule").forEach(function (rule) {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: rule, start: "top 95%" },
          }
        );
      });

      // Footer rise
      var footer = document.querySelector(".site-footer");
      if (footer) {
        gsap.fromTo(
          footer.querySelectorAll(".footer__brand, .footer__nav a, .footer__bottom > *"),
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: footer, start: "top 95%" },
          }
        );
      }
    });
  }

  function scrollProgress() {
    var bar = document.getElementById("scroll-progress");
    if (!bar || typeof ScrollTrigger === "undefined") return;
    if (reduced) {
      window.addEventListener(
        "scroll",
        function () {
          var h = document.documentElement;
          var max = h.scrollHeight - h.clientHeight;
          bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
        },
        { passive: true }
      );
      return;
    }
    gsap.to(bar, {
      width: "100%",
      ease: "none",
      scrollTrigger: { scrub: 0.15, start: "top top", end: "bottom bottom" },
    });
  }

  window.RJAnimations = {
    pageIntro: pageIntro,
    scrollScenes: scrollScenes,
    scrollProgress: scrollProgress,
    magneticButtons: magneticButtons,
    projectHovers: projectHovers,
    prepareLineMasks: prepareLineMasks,
  };
})();
