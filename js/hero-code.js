(function () {
  "use strict";

  var root = document.getElementById("hero-code");
  if (!root) return;

  var typedEl = document.getElementById("hero-code-typed");
  var outEl = document.getElementById("hero-code-out");
  var fileEl = document.getElementById("hero-code-file");
  var statusEl = document.getElementById("hero-code-status");
  var runStateEl = document.getElementById("hero-code-run-state");
  var caretEl = document.getElementById("hero-code-caret");

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

  var sceneIndex = 0;
  var timer = null;
  var cancelled = false;

  function prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setStatus(label) {
    if (statusEl) statusEl.textContent = label;
  }

  function setRunState(label) {
    if (runStateEl) runStateEl.textContent = label;
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
        var chunk = 1;
        var ch = text.charAt(i);
        if (ch === " " || ch === "\n") chunk = 1;
        else if (Math.random() > 0.82) chunk = 2;
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

  function paintOutput(text) {
    return new Promise(function (resolve) {
      if (!outEl) {
        resolve();
        return;
      }
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

  async function playScene(scene) {
    if (fileEl) fileEl.textContent = scene.file;
    var runBar = root.querySelector(".hero-code__run-bar span");
    if (runBar) runBar.textContent = scene.run;

    setStatus("typing");
    setRunState("idle");
    if (outEl) outEl.textContent = "";
    if (caretEl) caretEl.classList.add("is-on");

    if (prefersReduced()) {
      typedEl.textContent = scene.code;
      setStatus("ready");
      setRunState("running");
      outEl.textContent = scene.output;
      setRunState("done");
      setStatus("live");
      return;
    }

    await typeText(typedEl, scene.code, 18);
    if (cancelled) return;

    setStatus("ready");
    if (caretEl) caretEl.classList.remove("is-on");
    await wait(380);
    if (cancelled) return;

    setRunState("running");
    setStatus("running");
    await paintOutput(scene.output);
    if (cancelled) return;

    setRunState("done");
    setStatus("live");
    await wait(2200);
  }

  async function loop() {
    while (!cancelled) {
      await playScene(scenes[sceneIndex]);
      if (cancelled) break;
      if (prefersReduced()) break;
      sceneIndex = (sceneIndex + 1) % scenes.length;
      typedEl.textContent = "";
      if (outEl) outEl.textContent = "";
      await wait(450);
    }
  }

  function start() {
    cancelled = false;
    loop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
