(function () {
  "use strict";

  function toast(msg) {
    var el = document.getElementById("admin-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "admin-toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("is-on");
    }, 2600);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function requireAuth() {
    if (document.body.dataset.admin === "login") return true;
    if (!window.RJData || !RJData.isAdminLoggedIn()) {
      location.href = "index.html";
      return false;
    }
    return true;
  }

  function link(href, label, count, file) {
    return (
      '<a class="nav-link' +
      (href === file ? " is-active" : "") +
      '" href="' +
      href +
      '"><span>' +
      label +
      "</span>" +
      (count != null ? '<span class="nav-count">' + count + "</span>" : "") +
      "</a>"
    );
  }

  function ensureAppShell() {
    if (document.body.dataset.admin === "login") return;
    if (document.querySelector(".admin-app")) return;
    var shell = document.querySelector(".admin-shell");
    if (!shell) return;
    var app = document.createElement("div");
    app.className = "admin-app";
    shell.parentNode.insertBefore(app, shell);
    app.appendChild(shell);
  }

  function injectShell() {
    if (document.body.dataset.admin === "login") return;
    ensureAppShell();
    var data = RJData.load();
    var file = (location.pathname.split("/").pop() || "").toLowerCase();
    var unread = data.messages.filter(function (m) {
      return !m.read;
    }).length;
    var profile = data.adminProfile || {};
    var initials = (profile.displayName || "RJ")
      .split(" ")
      .map(function (p) {
        return p.charAt(0);
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();

    var app = document.querySelector(".admin-app") || document.body;
    if (!document.querySelector(".banner")) {
      var banner = document.createElement("div");
      banner.className = "banner";
      banner.innerHTML =
        "<strong>Frontend demo only.</strong> Not secure auth — content syncs to the public site via localStorage.";
      if (app.classList && app.classList.contains("admin-app")) app.prepend(banner);
      else document.body.prepend(banner);
    }

    var aside = document.getElementById("admin-sidebar");
    if (aside) {
      aside.className = "sidebar";
      aside.innerHTML =
        '<div class="sidebar__brand"><strong>RJ <span>Signal</span></strong><small>Portfolio content manager</small><span class="sidebar__status"><i></i> Demo · local sync</span></div>' +
        '<p class="nav-group-label">Overview</p>' +
        link("dashboard.html", "Dashboard", null, file) +
        '<p class="nav-group-label">Portfolio</p>' +
        link("projects.html", "Projects", data.projects.length, file) +
        link("project-form.html", "Add / Edit project", null, file) +
        link("skills.html", "Skills", null, file) +
        link("services.html", "Services", data.services.length, file) +
        '<p class="nav-group-label">Site content</p>' +
        link("about.html", "About info", null, file) +
        link("education.html", "Journey & CV", null, file) +
        link("media.html", "Media library", (data.media || []).length, file) +
        '<p class="nav-group-label">System</p>' +
        link("messages.html", "Messages", unread, file) +
        link("settings.html", "Settings", null, file) +
        link("profile.html", "Admin profile", null, file) +
        '<div class="sidebar__foot">' +
        '<div class="user-chip"><div class="user-chip__avatar">' +
        esc(initials) +
        "</div><div><strong>" +
        esc(profile.displayName || "Admin") +
        "</strong><span>" +
        esc(profile.role || "Administrator") +
        "</span></div></div>" +
        '<a class="btn btn-ghost btn-sm" href="../index.html" target="_blank" rel="noopener">Open public site</a>' +
        '<button type="button" class="btn btn-danger btn-sm" id="admin-logout">Log out</button>' +
        "</div>";
    }

    var logout = document.getElementById("admin-logout");
    if (logout) {
      logout.addEventListener("click", function () {
        RJData.logoutDemo();
        location.href = "index.html";
      });
    }

    var menuBtn = document.getElementById("admin-menu-btn");
    var backdrop = document.getElementById("admin-backdrop");
    if (menuBtn && aside) {
      menuBtn.addEventListener("click", function () {
        aside.classList.toggle("is-open");
        if (backdrop) backdrop.classList.toggle("is-on");
      });
    }
    if (backdrop) {
      backdrop.className = "backdrop";
      backdrop.addEventListener("click", function () {
        aside.classList.remove("is-open");
        backdrop.classList.remove("is-on");
      });
    }
  }

  function renderDashboard() {
    var root = document.getElementById("dashboard-root");
    if (!root) return;
    var data = RJData.load();
    var published = data.projects.filter(function (p) {
      return p.published;
    }).length;
    var unread = data.messages.filter(function (m) {
      return !m.read;
    }).length;
    var featured = data.projects.filter(function (p) {
      return p.featured;
    }).length;
    var drafts = data.projects.length - published;
    var name = (data.adminProfile && data.adminProfile.displayName) || "Raymond";

    root.innerHTML =
      '<section class="dash-hero">' +
      '<div class="dash-hero__main">' +
      '<p class="eyebrow">Studio desk</p>' +
      "<h2>Welcome back, " +
      esc(name) +
      "</h2>" +
      "<p>Publish case studies, refine about copy, manage services and clear inbox messages. Changes sync to the public portfolio in this browser instantly.</p>" +
      '<div class="topbar__actions">' +
      '<a class="btn btn-primary" href="project-form.html">New project</a>' +
      '<a class="btn btn-ghost" href="messages.html">Inbox' +
      (unread ? " · " + unread : "") +
      "</a>" +
      '<a class="btn btn-ghost" href="../projects.html" target="_blank" rel="noopener">Preview site</a>' +
      "</div></div>" +
      '<aside class="dash-hero__side">' +
      "<h3>Jump in</h3>" +
      '<a class="quick-link" href="about.html"><div><strong>About page</strong><span>Bio & philosophy</span></div><em>Edit →</em></a>' +
      '<a class="quick-link" href="skills.html"><div><strong>Skills</strong><span>Expertise chips</span></div><em>Edit →</em></a>' +
      '<a class="quick-link" href="services.html"><div><strong>Services</strong><span>' +
      data.services.length +
      " offerings</span></div><em>Manage →</em></a>" +
      '<a class="quick-link" href="settings.html"><div><strong>Settings</strong><span>Contacts & titles</span></div><em>Open →</em></a>' +
      "</aside></section>" +
      '<section class="kpi-strip">' +
      '<article class="kpi"><p class="kpi__label">Projects</p><p class="kpi__value">' +
      data.projects.length +
      '</p><p class="kpi__hint">' +
      featured +
      " featured · " +
      drafts +
      " draft</p></article>" +
      '<article class="kpi"><p class="kpi__label">Published</p><p class="kpi__value">' +
      published +
      '</p><p class="kpi__hint">Live on the website</p></article>' +
      '<article class="kpi"><p class="kpi__label">Services</p><p class="kpi__value">' +
      data.services.length +
      '</p><p class="kpi__hint">Public offerings</p></article>' +
      '<article class="kpi"><p class="kpi__label">Unread</p><p class="kpi__value">' +
      unread +
      '</p><p class="kpi__hint">Contact messages</p></article></section>' +
      '<section class="grid-2">' +
      '<div class="panel"><div class="panel__head"><div><h2>Project status</h2><p>Publish state across the portfolio library</p></div><a class="btn btn-ghost btn-sm" href="projects.html">Manage all</a></div><div class="status-list">' +
      data.projects
        .map(function (p) {
          return (
            '<div class="status-row"><div><p class="cell-title">' +
            esc(p.title) +
            '</p><p class="cell-sub">' +
            esc(p.category) +
            (p.featured ? " · Featured" : "") +
            " · " +
            esc((p.technologies || []).slice(0, 2).join(", ")) +
            '</p></div><span class="badge ' +
            (p.published ? "badge-ok" : "badge-off") +
            '">' +
            (p.published ? "Live" : "Draft") +
            "</span></div>"
          );
        })
        .join("") +
      "</div></div>" +
      '<div class="panel"><div class="panel__head"><div><h2>Recent messages</h2><p>From the public contact form</p></div><a class="btn btn-ghost btn-sm" href="messages.html">Inbox</a></div>' +
      (data.messages.length
        ? '<div class="message-list">' +
          data.messages
            .slice(0, 4)
            .map(function (m) {
              return (
                '<article class="message-item"><div class="message-item__row"><div><h3>' +
                esc(m.subject) +
                '</h3><p class="muted small">' +
                esc(m.name) +
                " · " +
                esc(m.email) +
                '</p></div><span class="badge ' +
                (m.read ? "badge-neutral" : "badge-ok") +
                '">' +
                (m.read ? "Read" : "New") +
                "</span></div><p class=\"small muted\">" +
                esc(m.message) +
                "</p></article>"
              );
            })
            .join("") +
          "</div>"
        : '<div class="empty">No messages yet. Send one from the public Contact page to test the inbox.</div>') +
      "</div></section>";
  }

  function renderProjects() {
    var root = document.getElementById("projects-root");
    if (!root) return;
    var data = RJData.load();
    var filter = root.getAttribute("data-filter") || "all";

    var list = data.projects.filter(function (p) {
      if (filter === "live") return p.published;
      if (filter === "draft") return !p.published;
      if (filter === "featured") return p.featured;
      return true;
    });

    var published = data.projects.filter(function (p) {
      return p.published;
    }).length;

    if (!data.projects.length) {
      root.innerHTML =
        '<div class="empty">No projects yet.<br><a class="btn btn-primary" style="margin-top:1rem" href="project-form.html">Create your first project</a></div>';
      return;
    }

    root.innerHTML =
      '<div class="toolbar"><p class="toolbar__meta">' +
      list.length +
      " shown · " +
      published +
      " published · " +
      (data.projects.length - published) +
      ' drafts</p><div class="toolbar__filters">' +
      '<button type="button" class="filter-chip' +
      (filter === "all" ? " is-on" : "") +
      '" data-filter="all">All</button>' +
      '<button type="button" class="filter-chip' +
      (filter === "live" ? " is-on" : "") +
      '" data-filter="live">Live</button>' +
      '<button type="button" class="filter-chip' +
      (filter === "draft" ? " is-on" : "") +
      '" data-filter="draft">Drafts</button>' +
      '<button type="button" class="filter-chip' +
      (filter === "featured" ? " is-on" : "") +
      '" data-filter="featured">Featured</button>' +
      "</div></div>" +
      (list.length
        ? '<div class="project-list">' +
          list
            .map(function (p) {
              return (
                '<article class="project-row" data-id="' +
                esc(p.id) +
                '"><div class="project-row__main"><div class="project-row__top"><div class="project-row__title-wrap"><p class="cell-title">' +
                esc(p.title) +
                '</p><p class="cell-sub">' +
                esc(p.category) +
                (p.featured ? " · Featured" : "") +
                '</p></div><span class="badge ' +
                (p.published ? "badge-ok" : "badge-off") +
                '">' +
                (p.published ? "Published" : "Draft") +
                '</span></div><div class="cell-tags">' +
                (p.technologies || [])
                  .slice(0, 5)
                  .map(function (t) {
                    return '<span class="tag">' + esc(t) + "</span>";
                  })
                  .join("") +
                '</div></div><div class="project-row__side row-actions">' +
                '<a class="btn btn-ghost btn-sm" href="project-form.html?id=' +
                encodeURIComponent(p.id) +
                '">Edit</a>' +
                '<button type="button" class="btn btn-ok btn-sm" data-action="toggle-publish">' +
                (p.published ? "Unpublish" : "Publish") +
                "</button>" +
                '<button type="button" class="btn btn-ghost btn-sm" data-action="toggle-feature">' +
                (p.featured ? "Unfeature" : "Feature") +
                "</button>" +
                '<a class="btn btn-ghost btn-sm" href="../project-details.html?id=' +
                encodeURIComponent(p.id) +
                '" target="_blank" rel="noopener">View</a>' +
                '<button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>' +
                "</div></article>"
              );
            })
            .join("") +
          "</div>"
        : '<div class="empty">No projects match this filter.</div>');

    root.onclick = function (e) {
      var filterBtn = e.target.closest("[data-filter]");
      if (filterBtn) {
        root.setAttribute("data-filter", filterBtn.getAttribute("data-filter"));
        renderProjects();
        return;
      }
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var row = btn.closest("[data-id]");
      var id = row.getAttribute("data-id");
      var store = RJData.load();
      var idx = store.projects.findIndex(function (p) {
        return p.id === id;
      });
      if (idx < 0) return;
      var action = btn.getAttribute("data-action");
      if (action === "delete") {
        if (!confirm("Delete this project?")) return;
        store.projects.splice(idx, 1);
        RJData.save(store);
        toast("Project deleted");
        renderProjects();
        return;
      }
      if (action === "toggle-feature") {
        store.projects[idx].featured = !store.projects[idx].featured;
        RJData.save(store);
        toast(store.projects[idx].featured ? "Marked featured" : "Removed from featured");
        renderProjects();
        return;
      }
      store.projects[idx].published = !store.projects[idx].published;
      RJData.save(store);
      toast(store.projects[idx].published ? "Published to public site" : "Unpublished");
      renderProjects();
    };
  }

  function bindProjectForm() {
    var form = document.getElementById("project-form");
    if (!form) return;
    var params = new URLSearchParams(location.search);
    var id = params.get("id");
    var store = RJData.load();
    var existing = id
      ? store.projects.find(function (p) {
          return p.id === id;
        })
      : null;

    if (existing) {
      form.title.value = existing.title || "";
      form.category.value = existing.category || "";
      form.summary.value = existing.summary || "";
      form.overview.value = existing.overview || "";
      form.objectives.value = (existing.objectives || []).join("\n");
      form.features.value = (existing.features || []).join("\n");
      form.technologies.value = (existing.technologies || []).join(", ");
      form.liveUrl.value = existing.liveUrl || "";
      form.githubUrl.value = existing.githubUrl || "";
      form.coverLabel.value = existing.coverLabel || "";
      form.order.value = existing.order || 1;
      form.published.checked = !!existing.published;
      form.featured.checked = !!existing.featured;
      var h = document.getElementById("form-heading");
      if (h) h.textContent = "Edit project";
      var s = document.getElementById("form-sub");
      if (s) s.textContent = "Updating “" + existing.title + "”";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var payload = {
        id: existing ? existing.id : RJData.uid("project"),
        title: form.title.value.trim(),
        category: form.category.value.trim() || "General",
        summary: form.summary.value.trim(),
        overview: form.overview.value.trim(),
        objectives: form.objectives.value
          .split("\n")
          .map(function (x) {
            return x.trim();
          })
          .filter(Boolean),
        features: form.features.value
          .split("\n")
          .map(function (x) {
            return x.trim();
          })
          .filter(Boolean),
        technologies: form.technologies.value
          .split(",")
          .map(function (x) {
            return x.trim();
          })
          .filter(Boolean),
        liveUrl: form.liveUrl.value.trim(),
        githubUrl: form.githubUrl.value.trim(),
        coverLabel: form.coverLabel.value.trim() || "Screenshot placeholder",
        galleryLabels:
          existing && existing.galleryLabels ? existing.galleryLabels : ["Screenshot placeholder"],
        order: Number(form.order.value) || 1,
        published: form.published.checked,
        featured: form.featured.checked,
      };
      if (!payload.title) {
        toast("Title is required");
        return;
      }
      var data = RJData.load();
      if (existing) {
        var i = data.projects.findIndex(function (p) {
          return p.id === existing.id;
        });
        data.projects[i] = payload;
        toast("Project updated");
      } else {
        data.projects.push(payload);
        toast("Project created");
      }
      RJData.save(data);
      setTimeout(function () {
        location.href = "projects.html";
      }, 450);
    });
  }

  function bindSkills() {
    var form = document.getElementById("skills-form");
    if (!form) return;
    var data = RJData.load();
    form.frontend.value = (data.skills.frontend || []).join(", ");
    form.backend.value = (data.skills.backend || []).join(", ");
    form.tools.value = (data.skills.tools || []).join(", ");

    function paintChips() {
      ["frontend", "backend", "tools"].forEach(function (key) {
        var host = document.getElementById("chips-" + key);
        if (!host) return;
        var items = form[key].value
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean);
        host.innerHTML = items
          .map(function (item) {
            return '<span class="chip">' + esc(item) + "</span>";
          })
          .join("");
      });
    }
    paintChips();
    form.addEventListener("input", paintChips);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var store = RJData.load();
      store.skills.frontend = form.frontend.value
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      store.skills.backend = form.backend.value
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      store.skills.tools = form.tools.value
        .split(",")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      RJData.save(store);
      toast("Skills saved — Expertise page updated");
      paintChips();
    });
  }

  function renderServicesAdmin() {
    var root = document.getElementById("services-admin-root");
    if (!root) return;

    function paint() {
      var data = RJData.load();
      root.innerHTML =
        data.services
          .map(function (s, i) {
            return (
              '<article class="service-item" data-index="' +
              i +
              '"><div class="service-item__row"><div><h3>' +
              esc(s.title) +
              '</h3><p class="muted small">' +
              esc(s.description) +
              '</p></div><span class="badge ' +
              (s.published ? "badge-ok" : "badge-off") +
              '">' +
              (s.published ? "Published" : "Hidden") +
              '</span></div><div class="row-actions">' +
              '<button type="button" class="btn btn-ghost btn-sm" data-action="edit">Edit</button>' +
              '<button type="button" class="btn btn-ok btn-sm" data-action="toggle">' +
              (s.published ? "Unpublish" : "Publish") +
              "</button>" +
              '<button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>' +
              "</div></article>"
            );
          })
          .join("") || '<div class="empty">No services yet.</div>';
    }

    paint();
    root.onclick = function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var index = Number(btn.closest("[data-index]").getAttribute("data-index"));
      var store = RJData.load();
      var action = btn.getAttribute("data-action");
      if (action === "delete") {
        if (!confirm("Delete this service?")) return;
        store.services.splice(index, 1);
      } else if (action === "toggle") {
        store.services[index].published = !store.services[index].published;
      } else if (action === "edit") {
        var title = prompt("Service title", store.services[index].title);
        if (title == null) return;
        var description = prompt("Service description", store.services[index].description);
        if (description == null) return;
        store.services[index].title = title.trim();
        store.services[index].description = description.trim();
      }
      RJData.save(store);
      toast("Services updated");
      paint();
    };

    var addForm = document.getElementById("service-add-form");
    if (addForm) {
      addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var store = RJData.load();
        store.services.push({
          id: RJData.uid("svc"),
          title: addForm.title.value.trim(),
          description: addForm.description.value.trim(),
          published: true,
        });
        RJData.save(store);
        addForm.reset();
        toast("Service added");
        paint();
      });
    }
  }

  function bindAbout() {
    var form = document.getElementById("about-form");
    if (!form) return;
    var p = RJData.load().profile;
    form.bioLead.value = p.bioLead || "";
    form.bio.value = p.bio || "";
    form.philosophy.value = p.philosophy || "";
    form.interests.value = (p.interests || []).join("\n");
    form.tagline.value = p.tagline || "";
    form.intro.value = p.intro || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var store = RJData.load();
      store.profile.bioLead = form.bioLead.value.trim();
      store.profile.bio = form.bio.value.trim();
      store.profile.philosophy = form.philosophy.value.trim();
      store.profile.tagline = form.tagline.value.trim();
      store.profile.intro = form.intro.value.trim();
      store.profile.interests = form.interests.value
        .split("\n")
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      RJData.save(store);
      toast("About information saved");
    });
  }

  function bindEducation() {
    var eduRoot = document.getElementById("education-root");
    var expRoot = document.getElementById("experience-root");
    var journeyRoot = document.getElementById("journey-root");
    if (!eduRoot && !expRoot && !journeyRoot) return;

    function paint(root, key) {
      if (!root) return;
      var items = RJData.load().aboutMeta[key] || [];
      root.innerHTML =
        items
          .map(function (item, i) {
            var meta =
              key === "journey"
                ? item.label || ""
                : (item.place || "") + " · " + (item.period || "");
            var detail = key === "journey" ? item.text : item.detail;
            return (
              '<article class="entry-item" data-index="' +
              i +
              '"><div class="entry-item__row"><div><h3>' +
              esc(item.title) +
              '</h3><p class="muted small">' +
              esc(meta) +
              '</p><p class="small muted">' +
              esc(detail || "") +
              '</p></div><button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button></div></article>'
            );
          })
          .join("") || '<div class="empty">No entries yet.</div>';
    }

    function wire(root, key, formId) {
      paint(root, key);
      if (root) {
        root.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-action='delete']");
          if (!btn) return;
          var index = Number(btn.closest("[data-index]").getAttribute("data-index"));
          var store = RJData.load();
          store.aboutMeta[key].splice(index, 1);
          RJData.save(store);
          paint(root, key);
          toast("Removed");
        });
      }
      var form = document.getElementById(formId);
      if (!form) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var store = RJData.load();
        if (key === "journey") {
          store.aboutMeta.journey.push({
            id: RJData.uid("j"),
            label: form.label.value.trim(),
            title: form.title.value.trim(),
            text: form.text.value.trim(),
          });
        } else {
          store.aboutMeta[key].push({
            id: RJData.uid(key.slice(0, 3)),
            title: form.title.value.trim(),
            place: form.place.value.trim(),
            period: form.period.value.trim(),
            detail: form.detail.value.trim(),
          });
        }
        RJData.save(store);
        form.reset();
        paint(root, key);
        toast("Added");
      });
    }

    wire(eduRoot, "education", "education-form");
    wire(expRoot, "experience", "experience-form");
    wire(journeyRoot, "journey", "journey-form");
  }

  function renderMessages() {
    var root = document.getElementById("messages-root");
    if (!root) return;
    function paint() {
      var data = RJData.load();
      if (!data.messages.length) {
        root.innerHTML =
          '<div class="empty">Inbox is empty.<br>Use the public Contact page to send a demo message.</div>';
        return;
      }
      root.innerHTML =
        '<div class="message-list">' +
        data.messages
          .map(function (m) {
            return (
              '<article class="message-item" data-id="' +
              esc(m.id) +
              '"><div class="message-item__row"><div><h3>' +
              esc(m.subject) +
              '</h3><p class="muted small">' +
              esc(m.name) +
              " · " +
              esc(m.email) +
              " · " +
              esc(new Date(m.createdAt).toLocaleString()) +
              '</p></div><span class="badge ' +
              (m.read ? "badge-neutral" : "badge-ok") +
              '">' +
              (m.read ? "Read" : "New") +
              "</span></div><p>" +
              esc(m.message) +
              '</p><div class="row-actions">' +
              '<button type="button" class="btn btn-ghost btn-sm" data-action="read">Mark read</button>' +
              '<button type="button" class="btn btn-danger btn-sm" data-action="delete">Delete</button>' +
              "</div></article>"
            );
          })
          .join("") +
        "</div>";
    }
    paint();
    root.onclick = function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var id = btn.closest("[data-id]").getAttribute("data-id");
      var store = RJData.load();
      var idx = store.messages.findIndex(function (m) {
        return m.id === id;
      });
      if (idx < 0) return;
      if (btn.getAttribute("data-action") === "delete") store.messages.splice(idx, 1);
      else store.messages[idx].read = true;
      RJData.save(store);
      toast("Inbox updated");
      paint();
    };
  }

  function renderMedia() {
    var root = document.getElementById("media-root");
    if (!root) return;
    function paint() {
      var media = RJData.load().media || [];
      if (!media.length) {
        root.innerHTML = '<div class="empty">No media placeholders yet.</div>';
        return;
      }
      root.innerHTML =
        '<div class="media-grid">' +
        media
          .map(function (m) {
            return (
              '<article class="media-card" data-id="' +
              esc(m.id) +
              '"><div class="media-card__ph">Image</div><div class="media-card__body"><strong>' +
              esc(m.name) +
              '</strong><p class="muted small">' +
              esc(m.label) +
              '</p><button type="button" class="btn btn-danger btn-sm" data-action="delete">Remove</button></div></article>'
            );
          })
          .join("") +
        "</div>";
    }
    paint();
    root.onclick = function (e) {
      var btn = e.target.closest("[data-action='delete']");
      if (!btn) return;
      var id = btn.closest("[data-id]").getAttribute("data-id");
      var store = RJData.load();
      store.media = store.media.filter(function (m) {
        return m.id !== id;
      });
      RJData.save(store);
      toast("Removed");
      paint();
    };
    var form = document.getElementById("media-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var store = RJData.load();
        store.media.unshift({
          id: RJData.uid("media"),
          name: form.name.value.trim(),
          type: "image",
          label: form.label.value.trim() || "Placeholder",
          createdAt: new Date().toISOString(),
        });
        RJData.save(store);
        form.reset();
        toast("Media placeholder added");
        paint();
      });
    }
  }

  function bindSettings() {
    var form = document.getElementById("settings-form");
    if (!form) return;
    var data = RJData.load();
    form.siteTitle.value = data.settings.siteTitle || "";
    form.siteDescription.value = data.settings.siteDescription || "";
    form.accentColor.value = data.settings.accentColor || "#FF4F1A";
    form.email.value = data.profile.email || "";
    form.whatsapp.value = data.profile.whatsapp || "";
    form.github.value = data.profile.github || "";
    form.linkedin.value = data.profile.linkedin || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var store = RJData.load();
      store.settings.siteTitle = form.siteTitle.value.trim();
      store.settings.siteDescription = form.siteDescription.value.trim();
      store.settings.accentColor = form.accentColor.value.trim();
      store.profile.email = form.email.value.trim();
      store.profile.whatsapp = form.whatsapp.value.trim();
      store.profile.github = form.github.value.trim();
      store.profile.linkedin = form.linkedin.value.trim();
      RJData.save(store);
      toast("Settings saved");
    });
    var resetBtn = document.getElementById("reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (!confirm("Reset all demo content to defaults?")) return;
        RJData.resetToDefaults();
        toast("Demo data reset");
        setTimeout(function () {
          location.reload();
        }, 400);
      });
    }
  }

  function bindProfile() {
    var form = document.getElementById("profile-form");
    if (!form) return;
    var a = RJData.load().adminProfile;
    form.displayName.value = a.displayName || "";
    form.username.value = a.username || "";
    form.email.value = a.email || "";
    form.role.value = a.role || "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var store = RJData.load();
      store.adminProfile.displayName = form.displayName.value.trim();
      store.adminProfile.username = form.username.value.trim();
      store.adminProfile.email = form.email.value.trim();
      store.adminProfile.role = form.role.value.trim();
      if (form.password.value.trim()) store.adminProfile.demoPassword = form.password.value.trim();
      RJData.save(store);
      toast("Profile updated (demo only)");
      form.password.value = "";
    });
  }

  function bindLogin() {
    var form = document.getElementById("login-form");
    if (!form) return;
    if (RJData.isAdminLoggedIn()) {
      location.href = "dashboard.html";
      return;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = RJData.loginDemo(form.username.value.trim(), form.password.value);
      var err = document.getElementById("login-error");
      if (!ok) {
        if (err) {
          err.hidden = false;
          err.textContent = "Invalid demo credentials. Use admin / admin123.";
        }
        return;
      }
      location.href = "dashboard.html";
    });
  }

  function boot() {
    if (!window.RJData) return;
    if (!requireAuth()) return;
    injectShell();
    bindLogin();
    renderDashboard();
    renderProjects();
    bindProjectForm();
    bindSkills();
    renderServicesAdmin();
    bindAbout();
    bindEducation();
    renderMessages();
    renderMedia();
    bindSettings();
    bindProfile();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
