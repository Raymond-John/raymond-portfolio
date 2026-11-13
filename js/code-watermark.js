(function () {
  "use strict";

  var started = false;
  var cancelled = false;
  var timer = null;
  var sceneIndex = 0;

  var scenes = [
    {
      file: "signal.js",
      run: "$ node signal.js",
      code:
        "const build = {\n" +
        '  client: "business",\n' +
        '  stack: ["HTML", "CSS", "JS", "PHP", "MySQL"],\n' +
        "};\n\n" +
        "function ship(system) {\n" +
        "  return system\n" +
        "    .structure()\n" +
        "    .polish()\n" +
        '    .launch("signal-clear");\n' +
        "}\n\n" +
        "console.log(ship(build));",
      output: "→ shipped · signal-clear\n✓ interface ready\n✓ backend online",
    },
    {
      file: "route.php",
      run: "$ php route.php",
      code:
        "<?php\n" +
        "function respond($payload) {\n" +
        "  header('Content-Type: application/json');\n" +
        "  echo json_encode($payload);\n" +
        "}\n\n" +
        "$app = [\n" +
        "  'status' => 'ok',\n" +
        "  'product' => 'RJ Signal',\n" +
        "  'ready' => true,\n" +
        "];\n\n" +
        "respond($app);",
      output: '{"status":"ok","product":"RJ Signal","ready":true}\n→ 200 OK',
    },
    {
      file: "schema.sql",
      run: "$ mysql < schema.sql",
      code:
        "CREATE TABLE projects (\n" +
        "  id INT PRIMARY KEY AUTO_INCREMENT,\n" +
        "  title VARCHAR(120) NOT NULL,\n" +
        "  stack JSON NOT NULL,\n" +
        "  status ENUM('draft','live') DEFAULT 'draft'\n" +
        ");\n\n" +
        "INSERT INTO projects (title, stack, status)\n" +
        "VALUES (\n" +
        "  'Signal Portfolio',\n" +
        "  '[\"HTML\",\"CSS\",\"JS\"]',\n" +
        "  'live'\n" +
        ");",
      output: "Query OK, 1 row affected\n→ projects.live = 1",
    },
  ];

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      timer = window.setTimeout(resolve, ms);
    });
  }

  function typeText(target, text, speed) {
    return new Promise(function (resolve) {
      var i = 0;
      target.textContent = "";

      function tick() {
        if (cancelled) {
          resolve();
          return;
        }
        if (i >= text.length) {
          resolve();
          return;
        }
        var chunk = Math.random() > 0.82 ? 2 : 1;
        var ch = text.charAt(i);
        target.textContent += text.slice(i, i + chunk);
        i += chunk;
        var delay = speed;
        if (ch === "\n") delay += 90;
        if ("{[(`'\"".indexOf(ch) !== -1) delay += 40;
        timer = window.setTimeout(tick, delay + Math.floor(Math.random() * 28));
      }

      tick();
    });
  }

  function paintOutput(outEl, text) {
    return new Promise(function (resolve) {
      outEl.textContent = "";
      var lines = text.split("\n");
      var i = 0;

      function next() {
        if (cancelled || i >= lines.length) {
          resolve();
          return;
        }
        outEl.textContent += (i ? "\n" : "") + lines[i];
        i += 1;
        timer = window.setTimeout(next, 220);
      }

      next();
    });
  }

  async function playScene(els, scene) {
    if (els.fileEl) els.fileEl.textContent = scene.file;
    if (els.runCmdEl) els.runCmdEl.textContent = scene.run;
    if (els.statusEl) els.statusEl.textContent = "typing";
    if (els.runStateEl) els.runStateEl.textContent = "idle";
    els.outEl.textContent = "";
    if (els.caretEl) els.caretEl.classList.add("is-on");

    if (prefersReduced()) {
      els.typedEl.textContent = scene.code;
      if (els.statusEl) els.statusEl.textContent = "live";
      if (els.runStateEl) els.runStateEl.textContent = "done";
      els.outEl.textContent = scene.output;
      return;
    }

    await typeText(els.typedEl, scene.code, 18);
    if (cancelled) return;

    if (els.statusEl) els.statusEl.textContent = "ready";
    if (els.caretEl) els.caretEl.classList.remove("is-on");
    await wait(380);
    if (cancelled) return;

    if (els.runStateEl) els.runStateEl.textContent = "running";
    if (els.statusEl) els.statusEl.textContent = "running";
    await paintOutput(els.outEl, scene.output);
    if (cancelled) return;

    if (els.runStateEl) els.runStateEl.textContent = "done";
    if (els.statusEl) els.statusEl.textContent = "live";
    await wait(2200);
  }

  async function loop(els) {
    while (!cancelled) {
      await playScene(els, scenes[sceneIndex]);
      if (cancelled) break;
      if (prefersReduced()) break;
      sceneIndex = (sceneIndex + 1) % scenes.length;
      els.typedEl.textContent = "";
      els.outEl.textContent = "";
      await wait(450);
    }
  }

  function start() {
    if (started) return;
    var root = document.getElementById("code-watermark");
    if (!root) return;

    var typedEl = document.getElementById("wm-code-typed");
    var outEl = document.getElementById("wm-code-out");
    if (!typedEl || !outEl) return;

    started = true;
    cancelled = false;
    loop({
      typedEl: typedEl,
      outEl: outEl,
      fileEl: document.getElementById("wm-code-file"),
      statusEl: document.getElementById("wm-code-status"),
      runStateEl: document.getElementById("wm-code-run-state"),
      caretEl: document.getElementById("wm-code-caret"),
      runCmdEl: document.getElementById("wm-code-run-cmd"),
    });
  }

  window.RJCodeWatermark = { start: start };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
