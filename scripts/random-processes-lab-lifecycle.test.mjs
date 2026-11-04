import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const labDir = path.join(repoRoot, "quartz", "static", "lab", "random-processes");

class Target {
  constructor() { this.events = new Map(); this.value = ""; this.textContent = ""; }
  addEventListener(name, fn) {
    if (!this.events.has(name)) this.events.set(name, []);
    this.events.get(name).push(fn);
  }
  removeEventListener(name, fn) {
    this.events.set(name, (this.events.get(name) || []).filter((item) => item !== fn));
  }
  dispatch(name, detail = {}) {
    for (const fn of [...(this.events.get(name) || [])]) fn({ type: name, ...detail });
  }
  replaceChildren() {}
  append() {}
  setAttribute() {}
  getAttribute() { return null; }
}

test("BFCache restore keeps lab controls, seed and phase-derived values", async () => {
  const math = await import(pathToFileURL(path.join(labDir, "random-processes-math.mjs")).href);
  const elements = new Map();
  const context2d = new Proxy({}, { get: (object, key) => object[key] ?? (() => {}), set: (object, key, value) => ((object[key] = value), true) });
  const element = (id) => {
    if (!elements.has(id)) {
      const item = new Target();
      item.parentElement = {};
      item.getBoundingClientRect = () => ({ width: 900, height: 300 });
      item.getContext = () => context2d;
      elements.set(id, item);
    }
    return elements.get(id);
  };
  const document = Object.assign(new Target(), {
    readyState: "complete",
    documentElement: { setAttribute() {}, getAttribute() { return null; } },
    body: { classList: { contains: () => false } },
    getElementById: element,
    createElement: () => new Target(),
  });
  const window = Object.assign(new Target(), {
    devicePixelRatio: 1,
    localStorage: { getItem: () => null },
    matchMedia: () => Object.assign(new Target(), { matches: false }),
  });
  window.parent = window;
  const scope = {
    ...math, window, document,
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    ResizeObserver: class { observe() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
  };
  const source = fs.readFileSync(path.join(labDir, "random-processes-lab.mjs"), "utf8")
    .replace(/import\s*\{[\s\S]*?\}\s*from\s*'\.\/random-processes-math\.mjs';/, "");
  vm.runInNewContext(source, scope);

  element("count").value = "12"; element("count").dispatch("input");
  element("cursor").value = "0.8"; element("cursor").dispatch("input");
  element("amplitude").value = "2"; element("amplitude").dispatch("input");
  element("seed").value = "777"; element("seed").dispatch("change");
  element("highlight").value = "3"; element("highlight").dispatch("change");
  assert.equal(element("stat-var-theory").textContent, "2 V²");
  assert.equal(element("stat-m").textContent, "12");

  window.dispatch("pagehide", { persisted: true });
  assert.equal(element("stat-var-theory").textContent, "2 V²");
  window.dispatch("pageshow", { persisted: true });

  assert.equal(element("count").value, "12", "paths preserved");
  assert.equal(element("cursor").value, "0.8", "cursor preserved");
  assert.equal(element("amplitude").value, "2", "amplitude preserved");
  assert.equal(element("seed").value, "777", "seed preserved");
  assert.equal(element("highlight").value, "3", "highlight preserved");
  assert.equal(element("stat-m").textContent, "12");
  assert.equal(element("stat-var-theory").textContent, "2 V²");
  assert.equal(element("stat-seed").textContent, "777");
  assert.equal((element("amplitude").events.get("input") || []).length, 1, "no duplicate input listener");

  element("amplitude").value = "1.5"; element("amplitude").dispatch("input");
  assert.equal(element("stat-var-theory").textContent, "1.125 V²", "controls still live");

  window.dispatch("pagehide", { persisted: true });
  window.dispatch("pageshow", { persisted: true });
  assert.equal((element("amplitude").events.get("input") || []).length, 1, "repeat restore keeps one listener");
  assert.equal((window.events.get("pageshow") || []).length, 1, "one pageshow listener");
});
