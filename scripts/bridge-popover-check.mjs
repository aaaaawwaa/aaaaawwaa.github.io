#!/usr/bin/env node
/**
 * 学习桥接卡的 popover 回归（真实浏览器，headless Chrome + CDP）。
 * 目的：确认 Quartz 同页链接悬浮预览克隆整篇 article 时，正文的深度选择不被取消、
 * 面板显隐保持，且预览自身是只读的（不显示深度切换条）。
 *
 * 用法：
 *   node scripts/bridge-popover-check.mjs [--base http://127.0.0.1:8766] [--chrome /path/to/chrome]
 * 前置：本地已构建 public/ 并启动静态服务；需要 ws 依赖（仓库已具备）。
 * 说明：这是浏览器级检查，不进入 npm run verify（CI 无浏览器）；静态回归见 test:public。
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import WebSocket from "ws";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://127.0.0.1:8766";
const chrome = args.includes("--chrome") ? args[args.indexOf("--chrome") + 1] : "C:/Program Files/Google/Chrome/Application/chrome.exe";
const port = 9680 + Math.floor(Math.random() * 40);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const routes = [
  { path: "/signal-processing/random-processes.html", group: "ac", card: "concept-bridge-autocorrelation", panels: ["concept-bridge-intuition", "concept-bridge-steps", "concept-bridge-deep"] },
  { path: "/signal-processing/correlation-and-power-spectrum.html", group: "psd", card: "concept-bridge-power-spectrum", panels: ["concept-bridge-power-spectrum-intuition", "concept-bridge-power-spectrum-steps", "concept-bridge-power-spectrum-deep"] },
  { path: "/signal-processing/z-transform-and-dtft.html", group: "dtft", card: "concept-bridge-dtft", panels: ["concept-bridge-dtft-intuition", "concept-bridge-dtft-steps", "concept-bridge-dtft-deep"] },
];

if (!fs.existsSync(chrome)) {
  console.error("FAIL: Chrome not found: " + chrome + " (pass --chrome)");
  process.exit(2);
}
const proc = spawn(chrome, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--remote-debugging-port=" + port, "--user-data-dir=" + process.env.TEMP + "/cdp-popover-" + Date.now(), "about:blank"], { stdio: "ignore" });
await sleep(2500);
const targets = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
ws.on("message", (raw) => { const m = JSON.parse(raw.toString()); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
await new Promise((resolve) => ws.on("open", resolve));
const send = (method, params) => new Promise((resolve) => { const i = ++id; pending.set(i, resolve); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.result && r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
  return r.result && r.result.result ? r.result.result.value : undefined;
};
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });

let failures = 0;
try {
  for (const route of routes) {
    await send("Page.navigate", { url: base + route.path });
    await sleep(4200);
    const result = await evaluate(`(async () => {
      const card = document.getElementById(${JSON.stringify(route.card)});
      if (!card) return { error: "card anchor missing" };
      card.scrollIntoView({ block: "start" });
      await new Promise((r) => setTimeout(r, 500));
      const radio2 = document.getElementById("depth-${route.group}-2");
      radio2.click();
      await new Promise((r) => setTimeout(r, 300));
      const display = (id) => { const el = document.getElementById(id); return el ? getComputedStyle(el).display : "missing"; };
      const originalRadios = () => [...document.querySelectorAll("input.lt-depth-${route.group}")].filter((x) => !x.closest(".popover-inner"));
      const baseline = { checked: originalRadios().map((x) => x.checked), panels: ${JSON.stringify(route.panels)}.map(display) };
      const back = [...document.querySelectorAll('#${route.card} ~ * a[href^="#"]')].find((a) => (a.getAttribute("href") || "").includes("concept-bridge"));
      const links = back ? [back] : [...document.querySelectorAll('a[href^="#concept-bridge"]')];
      const target = links[0];
      if (!target) return { error: "same-page link missing" };
      target.dispatchEvent(new MouseEvent("mouseenter"));
      await new Promise((r) => setTimeout(r, 2600));
      const preview = document.querySelector(".popover-inner");
      const previewTabs = preview ? preview.querySelector(".lt-depth-tabs") : null;
      return {
        baseline,
        after: { checked: originalRadios().map((x) => x.checked), panels: ${JSON.stringify(route.panels)}.map(display) },
        popoverPresent: Boolean(preview),
        previewTabsDisplay: previewTabs ? getComputedStyle(previewTabs).display : null,
        clonedRadios: preview ? preview.querySelectorAll("input.lt-depth").length : 0,
        clonedChecked: preview ? [...preview.querySelectorAll("input.lt-depth")].map((x) => x.checked) : [],
      };
    })()`);
    const ok = !result.error
      && JSON.stringify(result.baseline.checked) === JSON.stringify([false, true, false])
      && JSON.stringify(result.after.checked) === JSON.stringify(result.baseline.checked)
      && result.after.panels[0] === "none" && result.after.panels[1] === "block" && result.after.panels[2] === "none"
      && JSON.stringify(result.clonedChecked) === JSON.stringify([true, false, false])
      && result.popoverPresent
      && result.previewTabsDisplay === "none";
    if (!ok) failures++;
    console.log((ok ? "PASS " : "FAIL ") + route.path + " " + JSON.stringify(result));
  }
} finally {
  ws.close();
  proc.kill();
}
if (failures > 0) {
  console.error("popover regression failed: " + failures + " page(s)");
  process.exit(1);
}
console.log("PASS: 3 bridge pages keep depth selection and read-only preview under popover clone.");