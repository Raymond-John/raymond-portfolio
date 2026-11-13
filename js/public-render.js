(function () {
  "use strict";

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function placeholder(num, label, minHeight) {
    return (
      '<div class="media-frame__inner"><div class="ph" style="min-height:' +
      (minHeight || "100%") +
      '"><span class="ph__num">' +
      esc(num) +
      '</span><span class="ph__label">' +
      esc(label) +
      "</span></div></div>"
    );
  }

  function tags(list) {
    return (
      '<ul class="tags">' +
      (list || [])
        .map(function (t) {
          return '<li class="tag">' + esc(t) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function fillProfile() {
    if (!window.RJData) return;
    var p = RJData.load().profile;
    document.querySelectorAll("[data-bind='name']").forEach(function (el) {
      el.textContent = p.name;
    });
    document.querySelectorAll("[data-bind='role']").forEach(function (el) {
      el.textContent = p.role;
    });
    document.querySelectorAll("[data-bind='location']").forEach(function (el) {
      el.textContent = p.location;
    });
    document.querySelectorAll("[data-bind='tagline']").forEach(function (el) {
      if (el.hasAttribute("data-split-lines")) return;
      el.textContent = p.tagline;
    });
    document.querySelectorAll("[data-bind='intro']").forEach(function (el) {
      el.textContent = p.intro;
    });
    document.querySelectorAll("[data-bind='bioLead']").forEach(function (el) {
      el.textContent = p.bioLead;
    });
    document.querySelectorAll("[data-bind='bio']").forEach(function (el) {
      el.textContent = p.bio;
    });
    document.querySelectorAll("[data-bind='philosophy']").forEach(function (el) {
      el.textContent = p.philosophy;
    });
    function bindChannel(selector, href, value) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.tagName === "A" && href) el.href = href;
        var valueEl = el.querySelector(".contact-channel__value");
        if (valueEl) valueEl.textContent = value;
        else el.textContent = value;
      });
    }
    bindChannel("[data-bind='email']", "mailto:" + p.email, p.email);
    bindChannel("[data-bind='whatsapp']", p.whatsappUrl, p.whatsapp);
    bindChannel("[data-bind='github']", p.githubUrl, p.github);
    bindChannel("[data-bind='linkedin']", p.linkedinUrl, p.linkedin);
  }

  function renderFeatured() {
    var host = document.getElementById("featured-projects");
    if (!host || !window.RJData) return;
    var projects = RJData.getPublishedProjects().filter(function (p) {
      return p.featured;
    });
    if (!projects.length) projects = RJData.getPublishedProjects().slice(0, 3);
    host.innerHTML = projects
      .map(function (p, i) {
        return (
          '<article class="home-feature reveal">' +
          '<div class="home-feature__content">' +
          '<p class="home-feature__index">Featured 0' +
          (i + 1) +
          "</p>" +
          "<p class=\"project-tile__cat\">" +
          esc(p.category) +
          "</p>" +
          '<h3 class="home-feature__title">' +
          esc(p.title) +
          "</h3>" +
          "<p class=\"home-feature__desc lede\">" +
          esc(p.summary) +
          "</p>" +
          tags(p.technologies) +
          '<div style="margin-top:1.25rem"><a class="link-arrow" data-cursor="hot" href="project-details.html?id=' +
          encodeURIComponent(p.id) +
          '">View case study <span aria-hidden="true">→</span></a></div>' +
          "</div>" +
          '<div class="home-feature__media media-frame">' +
          placeholder(String(i + 1).padStart(2, "0"), p.coverLabel) +
          "</div></article>"
        );
      })
      .join("");
  }

  function renderProjectGallery() {
    var host = document.getElementById("project-gallery");
    if (!host || !window.RJData) return;
    var projects = RJData.getPublishedProjects();
    host.innerHTML = projects
      .map(function (p, i) {
        return (
          '<article class="project-tile reveal" data-project-tile data-category="' +
          esc(p.category) +
          '">' +
          '<a class="project-tile__media media-frame" data-cursor="hot" href="project-details.html?id=' +
          encodeURIComponent(p.id) +
          '">' +
          placeholder(String(i + 1).padStart(2, "0"), p.coverLabel) +
          "</a>" +
          '<div class="project-tile__meta"><p class="project-tile__cat">' +
          esc(p.category) +
          "</p>" +
          '<a class="link-arrow" data-cursor="hot" href="project-details.html?id=' +
          encodeURIComponent(p.id) +
          '">Details →</a></div>' +
          '<h3 class="project-tile__title">' +
          esc(p.title) +
          "</h3>" +
          '<p class="project-tile__desc">' +
          esc(p.summary) +
          "</p>" +
          tags(p.technologies) +
          "</article>"
        );
      })
      .join("");

    var filters = document.getElementById("project-filters");
    if (filters) {
      var cats = ["all"].concat(
        projects
          .map(function (p) {
            return p.category;
          })
          .filter(function (c, idx, arr) {
            return arr.indexOf(c) === idx;
          })
      );
      filters.innerHTML = cats
        .map(function (c, i) {
          return (
            '<button type="button" class="filter-btn' +
            (i === 0 ? " is-active" : "") +
            '" data-filter="' +
            esc(c) +
            '" data-cursor="hot">' +
            esc(c === "all" ? "All" : c) +
            "</button>"
          );
        })
        .join("");
    }
  }

  function renderCaseStudy() {
    var host = document.getElementById("case-root");
    if (!host || !window.RJData) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var projects = RJData.getPublishedProjects();
    var project = id ? RJData.getProjectById(id) : projects[0];
    if (!project || !project.published) project = projects[0];
    if (!project) {
      host.innerHTML = "<p class='lede'>No published projects yet.</p>";
      return;
    }

    var idx = projects.findIndex(function (p) {
      return p.id === project.id;
    });
    var prev = projects[(idx - 1 + projects.length) % projects.length];
    var next = projects[(idx + 1) % projects.length];

    document.title = project.title + " — Raymond John";

    host.innerHTML =
      '<header class="page-hero case-hero">' +
      '<div class="wrap">' +
      '<p class="case-hero__index">Project 0' +
      (idx + 1) +
      " / " +
      String(projects.length).padStart(2, "0") +
      "</p>" +
      '<p class="eyebrow" data-intro="eyebrow">' +
      esc(project.category) +
      "</p>" +
      '<h1 class="display display--lg case-hero__title" data-intro="title" data-split-lines>' +
      esc(project.title) +
      "</h1>" +
      '<p class="lede case-hero__lead" data-intro="copy">' +
      esc(project.summary) +
      "</p>" +
      '<div class="case-cover media-frame reveal">' +
      placeholder("0" + (idx + 1), project.coverLabel) +
      "</div></div></header>" +
      '<section class="section"><div class="wrap">' +
      '<dl class="case-meta reveal">' +
      '<div class="case-meta__item"><dt>Category</dt><dd>' +
      esc(project.category) +
      "</dd></div>" +
      '<div class="case-meta__item"><dt>Stack</dt><dd>' +
      esc((project.technologies || []).join(", ")) +
      "</dd></div>" +
      '<div class="case-meta__item"><dt>Live</dt><dd>' +
      (project.liveUrl
        ? '<a href="' + esc(project.liveUrl) + '" target="_blank" rel="noopener">Preview</a>'
        : "Coming soon") +
      "</dd></div>" +
      '<div class="case-meta__item"><dt>Code</dt><dd>' +
      (project.githubUrl
        ? '<a href="' + esc(project.githubUrl) + '" target="_blank" rel="noopener">GitHub</a>'
        : "Coming soon") +
      "</dd></div></dl>" +
      '<article class="case-block reveal"><h2>Overview</h2><p>' +
      esc(project.overview) +
      "</p></article>" +
      '<article class="case-block reveal"><h2>Objectives</h2><ul>' +
      (project.objectives || [])
        .map(function (o) {
          return "<li>" + esc(o) + "</li>";
        })
        .join("") +
      "</ul></article>" +
      '<article class="case-block reveal"><h2>Features</h2><ul>' +
      (project.features || [])
        .map(function (f) {
          return "<li>" + esc(f) + "</li>";
        })
        .join("") +
      "</ul></article>" +
      '<article class="case-block reveal"><h2>Technologies</h2>' +
      tags(project.technologies) +
      "</article>" +
      '<article class="case-block reveal"><h2>Screenshots</h2><div class="case-gallery">' +
      (project.galleryLabels || [project.coverLabel])
        .map(function (label, i) {
          return '<div class="media-frame">' + placeholder("0" + (i + 1), label) + "</div>";
        })
        .join("") +
      "</div></article>" +
      '<nav class="case-nav reveal" aria-label="Project navigation">' +
      '<a class="link-arrow" data-cursor="hot" href="project-details.html?id=' +
      encodeURIComponent(prev.id) +
      '">← ' +
      esc(prev.title) +
      "</a>" +
      '<a class="link-arrow" data-cursor="hot" href="project-details.html?id=' +
      encodeURIComponent(next.id) +
      '">' +
      esc(next.title) +
      " →</a></nav></div></section>";
  }

  function renderServices() {
    var host = document.getElementById("services-list");
    if (!host || !window.RJData) return;
    var services = RJData.getPublishedServices();
    host.innerHTML = services
      .map(function (s, i) {
        return (
          '<article class="service-row reveal">' +
          '<p class="service-row__num">' +
          String(i + 1).padStart(2, "0") +
          "</p>" +
          '<h3 class="service-row__title">' +
          esc(s.title) +
          "</h3>" +
          '<p class="service-row__body">' +
          esc(s.description) +
          "</p>" +
          '<span class="service-row__line" aria-hidden="true"></span></article>'
        );
      })
      .join("");
  }

  function renderSkills() {
    var host = document.getElementById("skills-root");
    if (!host || !window.RJData) return;
    var skills = RJData.load().skills;
    var groups = [
      { label: "Frontend", items: skills.frontend },
      { label: "Backend", items: skills.backend },
      { label: "Tools", items: skills.tools },
    ];
    host.innerHTML = groups
      .map(function (g) {
        return (
          '<div class="tech-group reveal">' +
          '<p class="tech-group__label">' +
          esc(g.label) +
          "</p>" +
          '<div class="tech-group__items">' +
          (g.items || [])
            .map(function (item) {
              return '<button type="button" class="tech-pill" data-cursor="hot">' + esc(item) + "</button>";
            })
            .join("") +
          "</div></div>"
        );
      })
      .join("");
  }

  function renderAboutExtras() {
    var interests = document.getElementById("about-interests");
    var journey = document.getElementById("about-journey");
    var education = document.getElementById("about-education");
    var experience = document.getElementById("about-experience");
    if (!window.RJData) return;
    var data = RJData.load();

    if (interests) {
      interests.innerHTML = (data.profile.interests || [])
        .map(function (item, i) {
          return (
            "<li><span>" +
            String(i + 1).padStart(2, "0") +
            "</span>" +
            esc(item) +
            "</li>"
          );
        })
        .join("");
    }

    if (journey) {
      journey.innerHTML = (data.aboutMeta.journey || [])
        .map(function (j) {
          return (
            '<article class="journey-item reveal"><p class="journey-item__label">' +
            esc(j.label) +
            '</p><h3 class="journey-item__title">' +
            esc(j.title) +
            "</h3><p>" +
            esc(j.text) +
            "</p></article>"
          );
        })
        .join("");
    }

    if (education) {
      education.innerHTML = (data.aboutMeta.education || [])
        .map(function (e) {
          return (
            '<article class="journey-item reveal"><p class="journey-item__label">' +
            esc(e.period) +
            '</p><h3 class="journey-item__title">' +
            esc(e.title) +
            "</h3><p>" +
            esc(e.place) +
            " — " +
            esc(e.detail) +
            "</p></article>"
          );
        })
        .join("");
    }

    if (experience) {
      experience.innerHTML = (data.aboutMeta.experience || [])
        .map(function (e) {
          return (
            '<article class="journey-item reveal"><p class="journey-item__label">' +
            esc(e.period) +
            '</p><h3 class="journey-item__title">' +
            esc(e.title) +
            "</h3><p>" +
            esc(e.place) +
            " — " +
            esc(e.detail) +
            "</p></article>"
          );
        })
        .join("");
    }
  }

  function renderProcess() {
    var host = document.getElementById("process-track");
    if (!host || !window.RJData) return;
    host.innerHTML = (RJData.load().process || [])
      .map(function (step) {
        return (
          '<article class="process-stage reveal">' +
          '<span class="process-stage__dot" aria-hidden="true"></span>' +
          '<p class="process-stage__num">' +
          esc(step.num) +
          " — " +
          esc(step.title) +
          '</p><h3 class="process-stage__title">' +
          esc(step.title) +
          "</h3><p>" +
          esc(step.text) +
          "</p></article>"
        );
      })
      .join("");
  }

  function renderHomeExtras() {
    var servicesHost = document.getElementById("home-services");
    if (servicesHost) {
      servicesHost.innerHTML = RJData.getPublishedServices()
        .slice(0, 4)
        .map(function (s) {
          return (
            '<article class="home-service-item reveal"><h3>' +
            esc(s.title) +
            "</h3><p>" +
            esc(s.description) +
            "</p></article>"
          );
        })
        .join("");
    }

    var processHost = document.getElementById("home-process");
    if (processHost) {
      processHost.innerHTML = (RJData.load().process || [])
        .map(function (step) {
          return (
            '<article class="reveal"><span>' +
            esc(step.num) +
            "</span><h3>" +
            esc(step.title) +
            "</h3><p>" +
            esc(step.text) +
            "</p></article>"
          );
        })
        .join("");
    }
  }

  function renderAll() {
    if (window.RJShell && typeof RJShell.upgradeFooter === "function") {
      RJShell.upgradeFooter();
    }
    fillProfile();
    renderFeatured();
    renderProjectGallery();
    renderCaseStudy();
    renderServices();
    renderSkills();
    renderAboutExtras();
    renderProcess();
    renderHomeExtras();
  }

  window.RJPublic = {
    renderAll: renderAll,
    fillProfile: fillProfile,
  };
})();
