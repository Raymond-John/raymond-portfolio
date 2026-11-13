(function () {
  "use strict";

  var cursor = document.getElementById("cursor");
  if (!cursor) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse =
    window.matchMedia("(hover: none), (pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0;

  if (reduced || coarse) {
    cursor.style.display = "none";
    return;
  }

  document.body.classList.add("has-custom-cursor");

  var dot = cursor.querySelector(".cursor__dot");
  var ring = cursor.querySelector(".cursor__ring");
  var mx = window.innerWidth / 2;
  var my = window.innerHeight / 2;
  var rx = mx;
  var ry = my;
  var on = false;

  function move(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!on) {
      on = true;
      cursor.classList.add("is-on");
      rx = mx;
      ry = my;
    }
    if (dot) {
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    }
  }

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) {
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    }
    requestAnimationFrame(tick);
  }

  function bindHot() {
    document.querySelectorAll('a, button, [data-cursor="hot"], input, textarea').forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hot");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hot");
      });
    });
  }

  window.addEventListener("mousemove", move, { passive: true });
  document.addEventListener("mouseleave", function () {
    cursor.classList.remove("is-on");
    on = false;
  });
  bindHot();
  requestAnimationFrame(tick);

  window.RJCursor = { refresh: bindHot };
})();
