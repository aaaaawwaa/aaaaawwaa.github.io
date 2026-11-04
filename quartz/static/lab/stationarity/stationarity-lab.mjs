/**
 * stationarity-lab.mjs —「宽平稳 vs 非平稳」对比实验的 Canvas/控件层。
 * 依赖 stationarity-math.mjs 的纯函数；本文件只负责绘制、控件语义、主题与生命周期。
 */
import {
  sinePaths,
  randomWalkPaths,
  meanPath,
  variancePath,
  theorySineVariance,
  theoryWalkVariance,
  MAX_PATHS,
  MAX_STEPS,
} from "./stationarity-math.mjs";

const DEFAULTS = Object.freeze({ paths: 8, steps: 80, amplitude: 1, sigma: 1, seed: 2026 });
const F0_HZ = 1.5;
const state = { ...DEFAULTS };
const els = {};
const cleanups = [];
let destroyed = false;
let bfcacheBound = false;
let pending = 0;

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function css(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function frame(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = clamp(window.devicePixelRatio || 1, 1, 3);
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  return { ctx, width: rect.width, height: rect.height };
}

function axes(ctx, width, height, pad, xRange, yRange, xLabel, yLabel) {
  const ink = css("--muted", "#587169");
  const line = css("--line", "#dfe9e4");
  ctx.save();
  ctx.strokeStyle = line; ctx.fillStyle = ink; ctx.font = "11px sans-serif"; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (height - pad.t - pad.b) * (i / 4);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(width - pad.r, y); ctx.stroke();
    const value = yRange.max - (yRange.max - yRange.min) * (i / 4);
    ctx.fillText(value.toFixed(2), 4, y + 3);
  }
  for (const tick of [xRange.min, (xRange.min + xRange.max) / 2, xRange.max]) {
    const x = pad.l + (width - pad.l - pad.r) * ((tick - xRange.min) / (xRange.max - xRange.min));
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, height - pad.b); ctx.stroke();
    ctx.fillText(String(Math.round(tick)), x - 6, height - 6);
  }
  ctx.fillText(xLabel, width - pad.r - 20, height - 6);
  ctx.fillText(yLabel, 4, 12);
  ctx.restore();
}

function plotPaths(canvas, matrix, colorKey) {
  const { ctx, width, height } = frame(canvas);
  const pad = { l: 42, r: 10, t: 30, b: 22 };
  const steps = matrix[0].length - 1;
  let maxAbs = 1e-9;
  for (const row of matrix) for (const value of row) maxAbs = Math.max(maxAbs, Math.abs(value));
  const yRange = { min: -maxAbs * 1.1, max: maxAbs * 1.1 };
  const xRange = { min: 0, max: steps };
  axes(ctx, width, height, pad, xRange, yRange, "n", "x[n]");
  const px = (n) => pad.l + (width - pad.l - pad.r) * (n / steps);
  const py = (v) => pad.t + (height - pad.t - pad.b) * (1 - (v - yRange.min) / (yRange.max - yRange.min));
  ctx.save();
  ctx.strokeStyle = css("--line", "#dfe9e4"); ctx.lineWidth = 1.1; ctx.globalAlpha = 0.75;
  for (const row of matrix) {
    ctx.beginPath();
    row.forEach((value, n) => { if (n === 0) ctx.moveTo(px(n), py(value)); else ctx.lineTo(px(n), py(value)); });
    ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.strokeStyle = css(colorKey, "#287969"); ctx.lineWidth = 2.4;
  const mean = meanPath(matrix);
  ctx.beginPath();
  mean.forEach((value, n) => { if (n === 0) ctx.moveTo(px(n), py(value)); else ctx.lineTo(px(n), py(value)); });
  ctx.stroke();
  ctx.restore();
}

function plotVariance(canvas, finite, theory, colorKey, label) {
  const { ctx, width, height } = frame(canvas);
  const pad = { l: 46, r: 10, t: 30, b: 22 };
  const steps = finite.length - 1;
  let maxValue = 0;
  for (const value of finite) if (Number.isFinite(value)) maxValue = Math.max(maxValue, value);
  for (const value of theory) if (Number.isFinite(value)) maxValue = Math.max(maxValue, value);
  maxValue = maxValue > 0 ? maxValue * 1.12 : 1;
  const yRange = { min: 0, max: maxValue };
  const xRange = { min: 0, max: steps };
  axes(ctx, width, height, pad, xRange, yRange, "n", "Var");
  const px = (n) => pad.l + (width - pad.l - pad.r) * (n / steps);
  const py = (v) => pad.t + (height - pad.t - pad.b) * (1 - (v - yRange.min) / (yRange.max - yRange.min));
  ctx.save();
  ctx.setLineDash([6, 5]); ctx.strokeStyle = css("--warn", "#ad7845"); ctx.lineWidth = 1.8;
  ctx.beginPath();
  theory.forEach((value, n) => { if (n === 0) ctx.moveTo(px(n), py(value)); else ctx.lineTo(px(n), py(value)); });
  ctx.stroke();
  ctx.setLineDash([]); ctx.strokeStyle = css(colorKey, "#287969"); ctx.lineWidth = 2.4;
  ctx.beginPath();
  finite.forEach((value, n) => { if (n === 0) ctx.moveTo(px(n), py(value || 0)); else ctx.lineTo(px(n), py(value || 0)); });
  ctx.stroke();
  ctx.restore();
}

function fmt(value, digits = 3) { if (!Number.isFinite(value)) return "—"; return value.toFixed(digits); }

function render() {
  if (destroyed) return;
  const sine = sinePaths({ seed: state.seed, paths: state.paths, steps: state.steps, amplitude: state.amplitude, freq: F0_HZ });
  const walk = randomWalkPaths({ seed: state.seed + 7919, paths: state.paths, steps: state.steps, sigma: state.sigma });
  const sineVar = variancePath(sine);
  const walkVar = variancePath(walk);
  const sineTheory = new Array(state.steps + 1).fill(theorySineVariance(state.amplitude));
  const walkTheory = Array.from({ length: state.steps + 1 }, (_, n) => theoryWalkVariance(n, state.sigma));
  plotPaths(els.sinePaths, sine, "--sine");
  plotVariance(els.sineVar, sineVar, sineTheory, "--sine", "Var[x]");
  plotPaths(els.walkPaths, walk, "--walk");
  plotVariance(els.walkVar, walkVar, walkTheory, "--walk", "Var[w]");
  const n = state.steps;
  els.sineStat.innerHTML = "n = " + n + "：有限均值 <b>" + fmt(meanPath(sine)[n]) + "</b>，有限方差 <b>" + fmt(sineVar[n]) + "</b>；理论 0 / <b>" + fmt(sineTheory[n]) + "</b>。";
  els.walkStat.innerHTML = "n = " + n + "：有限均值 <b>" + fmt(meanPath(walk)[n]) + "</b>，有限方差 <b>" + fmt(walkVar[n]) + "</b>；理论 0 / <b>" + fmt(walkTheory[n]) + "</b>。";
  els.pathsOut.textContent = String(state.paths);
  els.stepsOut.textContent = String(state.steps);
  els.amplitudeOut.textContent = state.amplitude.toFixed(2);
  els.sigmaOut.textContent = state.sigma.toFixed(2);
  els.seedOut.textContent = String(state.seed);
}

function scheduleRender() {
  if (destroyed || pending) return;
  pending = requestAnimationFrame(() => { pending = 0; render(); });
}

function readControls() {
  state.paths = clamp(Math.trunc(Number(els.paths.value)) || DEFAULTS.paths, 1, MAX_PATHS);
  state.steps = clamp(Math.trunc(Number(els.steps.value)) || DEFAULTS.steps, 1, MAX_STEPS);
  state.amplitude = clamp(Number(els.amplitude.value), 0, 2);
  state.sigma = clamp(Number(els.sigma.value), 0, 2);
  state.seed = Math.trunc(Number(els.seed.value)) || 0;
}

function syncControlsFromState() {
  els.paths.value = String(state.paths);
  els.steps.value = String(state.steps);
  els.amplitude.value = String(state.amplitude);
  els.sigma.value = String(state.sigma);
  els.seed.value = String(state.seed);
}

/* 主题 */
function parentDoc() { try { if (window.parent && window.parent !== window) return window.parent.document; } catch { /* 跨域 */ } return null; }
function themeName() {
  const doc = parentDoc();
  if (doc) {
    const saved = doc.documentElement.getAttribute("saved-theme");
    if (saved) return saved;
    if (doc.body) { if (doc.body.classList.contains("theme-dark")) return "dark"; if (doc.body.classList.contains("theme-light")) return "light"; }
    try { const stored = window.parent.localStorage.getItem("theme"); if (stored) return stored; } catch { /* ignore */ }
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme() {
  document.documentElement.setAttribute("data-theme", themeName());
  scheduleRender();
}
function watchTheme() {
  applyTheme();
  const doc = parentDoc();
  if (doc) { const onTheme = () => applyTheme(); doc.addEventListener("themechange", onTheme); cleanups.push(() => doc.removeEventListener("themechange", onTheme)); }
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => applyTheme();
  media.addEventListener("change", onMedia); cleanups.push(() => media.removeEventListener("change", onMedia));
  const observer = new MutationObserver(() => applyTheme());
  const doc2 = parentDoc();
  if (doc2) { observer.observe(doc2.documentElement, { attributes: true, attributeFilter: ["saved-theme"] }); cleanups.push(() => observer.disconnect()); }
}

/* 生命周期 */
function destroy() {
  if (destroyed) return; destroyed = true;
  if (pending) { cancelAnimationFrame(pending); pending = 0; }
  for (const cleanup of cleanups.splice(0)) { try { cleanup(); } catch { /* ignore */ } }
  if (window.__ltStationarityLab && window.__ltStationarityLab.destroy === destroy) delete window.__ltStationarityLab;
}
function handlePageShow(event) { if (!event.persisted || !destroyed) return; destroyed = false; bootstrap({ preserve: true }); }

function bootstrap(options = {}) {
  if (window.__ltStationarityLab && typeof window.__ltStationarityLab.destroy === "function") window.__ltStationarityLab.destroy();
  els.paths = document.getElementById("paths");
  els.steps = document.getElementById("steps");
  els.amplitude = document.getElementById("amplitude");
  els.sigma = document.getElementById("sigma");
  els.seed = document.getElementById("seed");
  els.pathsOut = document.getElementById("paths-out");
  els.stepsOut = document.getElementById("steps-out");
  els.amplitudeOut = document.getElementById("amplitude-out");
  els.sigmaOut = document.getElementById("sigma-out");
  els.seedOut = document.getElementById("seed-out");
  els.resample = document.getElementById("resample");
  els.reset = document.getElementById("reset");
  els.sinePaths = document.getElementById("sine-paths");
  els.sineVar = document.getElementById("sine-var");
  els.walkPaths = document.getElementById("walk-paths");
  els.walkVar = document.getElementById("walk-var");
  els.sineStat = document.getElementById("sine-stat");
  els.walkStat = document.getElementById("walk-stat");
  if (!els.paths || !els.sinePaths) return;
  if (options.preserve) readControls(); else { Object.assign(state, DEFAULTS); syncControlsFromState(); }
  const onChange = () => { readControls(); scheduleRender(); };
  for (const input of [els.paths, els.steps, els.amplitude, els.sigma]) { input.addEventListener("input", onChange); cleanups.push(() => input.removeEventListener("input", onChange)); }
  const onSeed = () => { readControls(); scheduleRender(); };
  els.seed.addEventListener("change", onSeed); cleanups.push(() => els.seed.removeEventListener("change", onSeed));
  const onResample = () => { state.seed += 1; syncControlsFromState(); scheduleRender(); };
  els.resample.addEventListener("click", onResample); cleanups.push(() => els.resample.removeEventListener("click", onResample));
  const onReset = () => { Object.assign(state, DEFAULTS); syncControlsFromState(); scheduleRender(); };
  els.reset.addEventListener("click", onReset); cleanups.push(() => els.reset.removeEventListener("click", onReset));
  const onResize = () => scheduleRender();
  window.addEventListener("resize", onResize); cleanups.push(() => window.removeEventListener("resize", onResize));
  window.addEventListener("pagehide", destroy, { once: true }); cleanups.push(() => window.removeEventListener("pagehide", destroy));
  if (!bfcacheBound) { bfcacheBound = true; window.addEventListener("pageshow", handlePageShow); }
  watchTheme();
  render();
  window.__ltStationarityLab = { destroy };
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => bootstrap(), { once: true });
else bootstrap();
