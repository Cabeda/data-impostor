/*
 * Python 3.15 flatten demo for the "Slop just raised the bar" article.
 * Both buttons run the same PEP 798 line on a different Pyodide runtime:
 * 3.14 rejects it with a SyntaxError, 3.15 returns the flattened list.
 * The 3.15 build is a pre-release.
 */

const RUNTIMES = {
  "3.14": {
    script: "https://cdn.jsdelivr.net/pyodide/v314.0.8/full/pyodide.js",
    index: "https://cdn.jsdelivr.net/pyodide/v314.0.8/full/",
  },
  "3.15": {
    script: "https://cdn.jsdelivr.net/pyodide/v315.0.0a2/full/pyodide.js",
    index: "https://cdn.jsdelivr.net/pyodide/v315.0.0a2/full/",
  },
};

const SOURCE = "rows = [[1, 2], [3], [4, 5]]\nrepr([*row for row in rows])";

const loaded = {};
let lock = Promise.resolve();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Could not load Python from the CDN."));
    document.head.append(script);
  });
}

// Serialize loads: both runtimes define window.loadPyodide, so each one must
// be captured right after its own script finishes loading.
function getRuntime(version) {
  if (loaded[version]) return Promise.resolve(loaded[version]);
  const run = lock.then(async () => {
    if (loaded[version]) return loaded[version];
    await loadScript(RUNTIMES[version].script);
    const load = window.loadPyodide;
    loaded[version] = await load({ indexURL: RUNTIMES[version].index });
    return loaded[version];
  });
  lock = run.catch(() => {});
  return run;
}

function lastLine(error) {
  return String(error?.message || error)
    .trim()
    .split("\n")
    .filter(Boolean)
    .pop();
}

function bind(demo) {
  if (demo.dataset.bound) return;
  demo.dataset.bound = "true";

  const output = demo.querySelector("[data-output]");
  const buttons = [...demo.querySelectorAll("[data-python]")];

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const version = button.dataset.python;
      buttons.forEach((b) => (b.disabled = true));
      output.className = "slop-demo-output";
      output.textContent = `Loading Python ${version} — about 13 MB, once.`;
      try {
        const py = await getRuntime(version);
        const actual = py.runPython("import sys; sys.version.split()[0]");
        try {
          output.textContent = `Python ${actual} → ${py.runPython(SOURCE)}`;
          output.className = "slop-demo-output is-ok";
        } catch (error) {
          output.textContent = `Python ${actual} → ${lastLine(error)}`;
          output.className = "slop-demo-output is-error";
        }
      } catch (error) {
        output.textContent = lastLine(error);
        output.className = "slop-demo-output is-error";
      } finally {
        buttons.forEach((b) => (b.disabled = false));
      }
    });
  });
}

function init() {
  document.querySelectorAll(".slop-demo").forEach(bind);
}

init();
document.addEventListener("astro:page-load", init);
