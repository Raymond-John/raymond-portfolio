/**
 * Shared chrome upgrades — professional footer injected on every public page.
 */
(function () {
  "use strict";

  function richFooter() {
    return (
      '<div class="wrap--wide">' +
      '<div class="footer__cta">' +
      '<h2 class="footer__cta-title">Cut the noise. Ship the signal.</h2>' +
      '<div class="footer__cta-row">' +
      '<p class="footer__cta-text">Need a website, web app or digital system with clear structure and lasting craft? Let’s map the idea and build with intent.</p>' +
      '<a class="btn btn--fill magnetic" href="contact.html" data-cursor="hot">Start a build <span class="btn__arrow" aria-hidden="true">→</span></a>' +
      "</div></div>" +
      '<div class="footer__grid">' +
      '<div class="footer__brand-block">' +
      '<a class="footer__brand" href="index.html" data-cursor="hot">Raymond <span>John</span></a>' +
      '<p class="footer__brand-copy">Nigeria-based software developer — signal-clear interfaces, practical PHP/MySQL foundations and digital products businesses can run on.</p>' +
      '<div class="footer__social">' +
      '<a href="https://github.com/" target="_blank" rel="noopener noreferrer" data-cursor="hot">GitHub</a>' +
      '<a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" data-cursor="hot">LinkedIn</a>' +
      '<a href="https://wa.me/2340000000000" target="_blank" rel="noopener noreferrer" data-cursor="hot">WhatsApp</a>' +
      '<a href="mailto:hello@raymondjohn.dev" data-cursor="hot">Email</a>' +
      "</div></div>" +
      '<div class="footer__col"><h3>Explore</h3><ul>' +
      '<li><a href="index.html" data-cursor="hot">Home</a></li>' +
      '<li><a href="about.html" data-cursor="hot">About</a></li>' +
      '<li><a href="expertise.html" data-cursor="hot">Expertise</a></li>' +
      '<li><a href="projects.html" data-cursor="hot">Projects</a></li>' +
      "</ul></div>" +
      '<div class="footer__col"><h3>Studio</h3><ul>' +
      '<li><a href="services.html" data-cursor="hot">Services</a></li>' +
      '<li><a href="process.html" data-cursor="hot">Process</a></li>' +
      '<li><a href="contact.html" data-cursor="hot">Contact</a></li>' +
      "</ul></div>" +
      '<div class="footer__col"><h3>Connect</h3><div class="footer__contact-list">' +
      '<a href="mailto:hello@raymondjohn.dev" data-cursor="hot" data-bind="email"><span class="contact-channel__value">hello@raymondjohn.dev</span></a>' +
      '<span data-bind="location">Nigeria</span>' +
      "<span>Software Developer</span>" +
      "<span>Available for selected projects</span>" +
      "</div></div></div>" +
      '<div class="footer__bottom">' +
      '<p>&copy; <span data-year></span> Raymond John. All rights reserved.</p>' +
      '<p class="footer__meta">RJ Signal · Frontend portfolio</p>' +
      "</div></div>"
    );
  }

  function upgradeFooter() {
    var existing = document.querySelector(".site-footer");
    if (!existing) {
      existing = document.createElement("footer");
      existing.className = "site-footer";
      document.body.appendChild(existing);
    }
    existing.innerHTML = richFooter();
  }

  function injectCodeWatermark() {
    if (document.getElementById("code-watermark")) return;
    var layer = document.createElement("div");
    layer.className = "code-watermark";
    layer.id = "code-watermark";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<div class="code-watermark__panel">' +
      '<div class="code-watermark__chrome">' +
      '<span class="code-watermark__file" id="wm-code-file">signal.js</span>' +
      '<span class="code-watermark__status" id="wm-code-status">typing</span>' +
      "</div>" +
      '<pre class="code-watermark__editor"><code id="wm-code-typed"></code><span class="code-watermark__caret" id="wm-code-caret"></span></pre>' +
      '<div class="code-watermark__run">' +
      '<div class="code-watermark__run-bar">' +
      '<span id="wm-code-run-cmd">$ node signal.js</span>' +
      '<span id="wm-code-run-state">idle</span>' +
      "</div>" +
      '<pre class="code-watermark__out" id="wm-code-out"></pre>' +
      "</div></div>";
    document.body.insertBefore(layer, document.body.firstChild);
  }

  function bootShell() {
    injectCodeWatermark();
    upgradeFooter();
    if (window.RJCodeWatermark && typeof window.RJCodeWatermark.start === "function") {
      window.RJCodeWatermark.start();
    }
  }

  if (document.body && !document.body.classList.contains("admin-body")) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bootShell);
    } else {
      bootShell();
    }
  }

  window.RJShell = { upgradeFooter: upgradeFooter, injectCodeWatermark: injectCodeWatermark };
})();
