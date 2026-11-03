/**
 * random-processes-lab.mjs
 * ---------------------------------------------------------------------------
 * 「随机过程与样本函数」交互实验的画布与控件层。
 *
 * 依赖 random-processes-math.mjs 中的纯函数，本文件只负责：
 *   - 绘制 M 条样本路径、高亮其中一条、时刻游标与交点；
 *   - 绘制固定时刻的经验直方图，并与反正弦理论密度对照；
 *   - 同步文字数据摘要（集合均值、样本方差、理论均值/方差、样本数 M）；
 *   - 处理控件语义（游标/高亮不重采样，改 M 保留相位前缀，重采样才换样本）；
 *   - 跟随站点手动主题（同源 iframe 读取父页面），独立打开时回退系统主题；
 *   - 在 Quartz SPA 场景下清理监听器，避免重复绑定。
 * ---------------------------------------------------------------------------
 */

import {
  samplePhases,
  cosineValue,
  ensembleStats,
  theoreticalMean,
  theoreticalVariance,
  arcsineDensity,
} from './random-processes-math.mjs';

const F0_HZ = 1.5;
const WINDOW_S = 1;
const MAX_PATHS = 40;
const CURVE_STEPS = 480;
const HIST_CURVE_STEPS = 360;
const TAU = Math.PI * 2;

const DEFAULTS = Object.freeze({
  paths: 8,
  cursor: 0.5,
  amplitude: 1,
  seed: 2026,
  highlight: 0,
});

const state = {
  paths: DEFAULTS.paths,
  cursor: DEFAULTS.cursor,
  amplitude: DEFAULTS.amplitude,
  seed: DEFAULTS.seed,
  highlight: DEFAULTS.highlight,
  phases: [],
};

const cleanups = [];
let destroyed = false;
let pendingFrame = 0;
let seriesCache = { key: '', series: [] };

/* --------------------------------------------------------------- 小工具 -- */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function fmt(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) < 1e-12) return '0';
  const text = value.toFixed(digits).replace(/0+$/, '').replace(/\.$/, '');
  return text === '-0' ? '0' : text;
}

function palette() {
  const styles = getComputedStyle(document.documentElement);
  const read = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  return {
    ink: read('--ink', '#203b35'),
    muted: read('--muted', '#587169'),
    line: read('--line', '#dfe9e4'),
    accent: read('--accent', '#287969'),
    theory: read('--ideal', '#ad7845'),
    panel: read('--panel', '#ffffff'),
  };
}

function frame(canvas) {
  const rect = canvas.getBoundingClientRect();
  const ratio = clamp(window.devicePixelRatio || 1, 1, 3);
  const pixelWidth = Math.max(1, Math.round(rect.width * ratio));
  const pixelHeight = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  return { ctx, width: rect.width, height: rect.height };
}

function drawVerticalLabel(ctx, text, x, y, color, font) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawText(ctx, text, x, y, color, font, align = 'left', baseline = 'alphabetic') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(text, x, y);
}

/* --------------------------------------------------------------- 模型层 -- */

function regenerate() {
  state.phases = samplePhases(state.seed, MAX_PATHS);
  seriesCache = { key: '', series: [] };
}

function currentSeries() {
  const key = state.seed + '|' + state.amplitude;
  if (seriesCache.key === key) return seriesCache.series;
  const series = [];
  for (let m = 0; m < MAX_PATHS; m++) {
    const points = new Float64Array(CURVE_STEPS + 1);
    const phase = state.phases[m];
    for (let index = 0; index <= CURVE_STEPS; index++) {
      const t = (WINDOW_S * index) / CURVE_STEPS;
      points[index] = cosineValue({ A: state.amplitude, f0: F0_HZ, t, phase });
    }
    series.push(points);
  }
  seriesCache = { key, series };
  return series;
}

function valuesAtCursor() {
  const values = new Array(state.paths);
  for (let m = 0; m < state.paths; m++) {
    values[m] = cosineValue({
      A: state.amplitude,
      f0: F0_HZ,
      t: state.cursor,
      phase: state.phases[m],
    });
  }
  return values;
}

/* --------------------------------------------------------------- 绘制层 -- */

const els = {};

function plotBox(width, height) {
  const pad = { left: 56, right: 18, top: 20, bottom: 42 };
  return {
    pad,
    plotW: Math.max(10, width - pad.left - pad.right),
    plotH: Math.max(10, height - pad.top - pad.bottom),
  };
}

function drawPaths(values) {
  const canvas = els.pathsCanvas;
  if (!canvas) return;
  const { ctx, width, height } = frame(canvas);
  const colors = palette();
  const { pad, plotW, plotH } = plotBox(width, height);
  const amplitude = state.amplitude;
  const yMax = amplitude > 0 ? amplitude * 1.12 : 1;
  const xOf = (t) => pad.left + (t / WINDOW_S) * plotW;
  const yOf = (value) => pad.top + ((yMax - value) / (2 * yMax)) * plotH;
  const font = '11px "Microsoft YaHei", system-ui, sans-serif';

  // 水平网格与幅度刻度
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.line;
  const ticks = amplitude > 0 ? [-amplitude, -amplitude / 2, 0, amplitude / 2, amplitude] : [-1, 0, 1];
  for (const value of ticks) {
    const y = yOf(value);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
    drawText(ctx, fmt(value, 3), pad.left - 8, y, colors.muted, font, 'right', 'middle');
  }

  // 时间刻度与轴标
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    const t = fraction * WINDOW_S;
    const x = xOf(t);
    ctx.strokeStyle = colors.line;
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + plotH);
    ctx.stroke();
    drawText(ctx, fmt(t, 3), x, pad.top + plotH + 14, colors.muted, font, 'center', 'top');
  }
  drawText(ctx, '时间 t (s)', pad.left + plotW, pad.top + plotH + 30, colors.muted, font, 'right', 'top');
  drawVerticalLabel(ctx, '幅度 x(t) (V)', 14, pad.top + plotH / 2, colors.muted, font);

  // 样本路径（普通路径半透明，高亮路径加粗）
  const series = currentSeries();
  ctx.save();
  ctx.beginPath();
  ctx.rect(pad.left, pad.top, plotW, plotH);
  ctx.clip();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const highlight = clamp(state.highlight, 0, state.paths - 1);
  ctx.strokeStyle = colors.muted;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 1;
  for (let m = 0; m < state.paths; m++) {
    if (m === highlight) continue;
    strokeSeries(ctx, series[m], xOf, yOf);
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2.6;
  strokeSeries(ctx, series[highlight], xOf, yOf);

  // 时刻游标与各路径交点
  const cursorX = xOf(state.cursor);
  ctx.strokeStyle = colors.ink;
  ctx.globalAlpha = 0.75;
  ctx.lineWidth = 1.4;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(cursorX, pad.top);
  ctx.lineTo(cursorX, pad.top + plotH);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  for (let m = 0; m < state.paths; m++) {
    const isHighlight = m === highlight;
    ctx.beginPath();
    ctx.arc(cursorX, yOf(values[m]), isHighlight ? 4.6 : 3, 0, TAU);
    ctx.fillStyle = colors.panel;
    ctx.fill();
    ctx.lineWidth = isHighlight ? 2.4 : 1.4;
    ctx.strokeStyle = isHighlight ? colors.accent : colors.muted;
    ctx.stroke();
  }
  ctx.restore();

  const totalWidth = pad.left + plotW + pad.right;
  const nearRight = cursorX > totalWidth - 110;
  drawText(
    ctx,
    't* = ' + state.cursor.toFixed(3) + ' s',
    clamp(cursorX + (nearRight ? -8 : 8), pad.left + 4, pad.left + plotW - 4),
    pad.top + 2,
    colors.ink,
    '11px "Microsoft YaHei", system-ui, sans-serif',
    nearRight ? 'right' : 'left',
    'top',
  );
}

function strokeSeries(ctx, points, xOf, yOf) {
  ctx.beginPath();
  for (let index = 0; index < points.length; index++) {
    const t = (WINDOW_S * index) / CURVE_STEPS;
    const x = xOf(t);
    const y = yOf(points[index]);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHistogram(values, stats) {
  const canvas = els.histCanvas;
  if (!canvas) return;
  const { ctx, width, height } = frame(canvas);
  const colors = palette();
  const { pad, plotW, plotH } = plotBox(width, height);
  const font = '11px "Microsoft YaHei", system-ui, sans-serif';
  const amplitude = state.amplitude;
  const xMin = amplitude > 0 ? -amplitude : -1;
  const xMax = amplitude > 0 ? amplitude : 1;
  const xOf = (value) => pad.left + ((value - xMin) / (xMax - xMin)) * plotW;
  const fontSmall = font;

  if (amplitude <= 0) {
    const yOf0 = pad.top + plotH / 2;
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.stroke();
    for (const value of [-1, 0, 1]) {
      drawText(ctx, fmt(value, 2), xOf(value), pad.top + plotH + 14, colors.muted, fontSmall, 'center', 'top');
    }
    ctx.beginPath();
    ctx.arc(xOf(0), yOf0, 5, 0, TAU);
    ctx.fillStyle = colors.accent;
    ctx.fill();
    const centerX = pad.left + plotW / 2;
    drawText(ctx, 'A = 0：全部 ' + state.paths + ' 条路径恒为 0，分布退化', centerX, yOf0 - 22, colors.ink, fontSmall, 'center', 'middle');
    drawText(ctx, '不存在反正弦密度（方差为 0）', centerX, yOf0 + 22, colors.muted, fontSmall, 'center', 'middle');
    drawText(ctx, '幅度 x(t) (V)', pad.left + plotW, pad.top + plotH + 30, colors.muted, fontSmall, 'right', 'top');
    return;
  }

  const count = Math.max(1, stats.count);
  const bins = clamp(Math.round(Math.sqrt(count)) + 2, 4, 14);
  const binWidth = (2 * amplitude) / bins;
  const counts = new Array(bins).fill(0);
  for (const value of values) {
    const ratio = (value + amplitude) / binWidth;
    const index = clamp(Math.floor(ratio), 0, bins - 1);
    counts[index] += 1;
  }
  const densities = counts.map((hits) => hits / (count * binWidth));
  const centerDensity = 1 / (Math.PI * amplitude);
  const yMax = Math.max(Math.max(...densities), centerDensity * 1.2) * 1.06;
  const yOf = (density) => pad.top + (1 - density / yMax) * plotH;

  // 网格与刻度
  ctx.lineWidth = 1;
  ctx.strokeStyle = colors.line;
  for (const fraction of [0, 0.5, 1]) {
    const density = fraction * yMax;
    const y = yOf(density);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
    drawText(ctx, fmt(density, 3), pad.left - 8, y, colors.muted, fontSmall, 'right', 'middle');
  }
  for (const value of [-amplitude, -amplitude / 2, 0, amplitude / 2, amplitude]) {
    drawText(ctx, fmt(value, 3), xOf(value), pad.top + plotH + 14, colors.muted, fontSmall, 'center', 'top');
  }
  drawText(ctx, '幅度 x(t) (V)', pad.left + plotW, pad.top + plotH + 30, colors.muted, fontSmall, 'right', 'top');
  drawVerticalLabel(ctx, '概率密度 (1/V)', 14, pad.top + plotH / 2, colors.muted, fontSmall);

  // 经验直方图（归一化为密度，可与理论曲线直接比较）
  for (let index = 0; index < bins; index++) {
    const left = xOf(-amplitude + index * binWidth);
    const right = xOf(-amplitude + (index + 1) * binWidth);
    const top = yOf(densities[index]);
    ctx.fillStyle = colors.accent;
    ctx.globalAlpha = 0.24;
    ctx.fillRect(left + 1, top, Math.max(1, right - left - 2), pad.top + plotH - top);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(left + 1, top, Math.max(1, right - left - 2), pad.top + plotH - top);
  }

  // 理论密度曲线（在两端发散，绘图区外自然裁切）
  ctx.save();
  ctx.beginPath();
  ctx.rect(pad.left, pad.top, plotW, plotH);
  ctx.clip();
  ctx.strokeStyle = colors.theory;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const inset = 0.998;
  for (let index = 0; index <= HIST_CURVE_STEPS; index++) {
    const x = -amplitude * inset + 2 * amplitude * inset * (index / HIST_CURVE_STEPS);
    const density = arcsineDensity(x, amplitude);
    const px = xOf(x);
    const py = yOf(Math.min(density, yMax * 1.4));
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

/* --------------------------------------------------------------- 数据层 -- */

function updateStats(stats) {
  if (!els.statM) return;
  els.statM.textContent = String(state.paths);
  els.statT.textContent = state.cursor.toFixed(3) + ' s';
  els.statA.textContent = state.amplitude.toFixed(2) + ' V';
  els.statSeed.textContent = String(state.seed);
  els.statMean.textContent = stats.mean === null ? '—' : fmt(stats.mean, 3) + ' V';
  els.statVar.textContent =
    stats.variance === null ? '—（M < 2 无法估计）' : fmt(stats.variance, 3) + ' V²';
  els.statMeanTheory.textContent = fmt(theoreticalMean(), 3) + ' V';
  els.statVarTheory.textContent = fmt(theoreticalVariance(state.amplitude), 3) + ' V²';

  let note = '柱高为归一化频数（密度），曲线为反正弦密度 1/(π√(A²−x²))；x→±A 处发散是可积奇点，超出绘图区时被裁切。';
  if (state.amplitude <= 0) {
    note = 'A = 0：所有路径恒为 0，分布退化，不存在反正弦密度。';
  } else if (state.paths < 2) {
    note = 'M = 1：只有一个样本，分母 M−1 = 0，方差无法估计（显示为 —）。';
  }
  els.histNote.textContent = note;
}

function syncLabels() {
  if (!els.paths) return;
  els.pathsOut.textContent = String(state.paths);
  els.cursorOut.textContent = state.cursor.toFixed(3) + ' s';
  els.amplitudeOut.textContent = state.amplitude.toFixed(2) + ' V';
  els.seedOut.textContent = String(state.seed);
}

function render() {
  if (destroyed) return;
  const values = valuesAtCursor();
  const stats = ensembleStats(values);
  drawPaths(values);
  drawHistogram(values, stats);
  updateStats(stats);
  syncLabels();
}

function scheduleRender() {
  if (destroyed || pendingFrame) return;
  pendingFrame = requestAnimationFrame(() => {
    pendingFrame = 0;
    render();
  });
}

/* --------------------------------------------------------------- 主题层 -- */

function parentDocument() {
  try {
    if (window.parent && window.parent !== window) return window.parent.document;
  } catch {
    /* 跨域父页面：退回系统主题 */
  }
  return null;
}

function resolveTheme(doc) {
  if (doc) {
    const attribute = doc.documentElement ? doc.documentElement.getAttribute('saved-theme') : null;
    if (attribute === 'dark' || attribute === 'light') return attribute;
    const body = doc.body;
    if (body) {
      if (body.classList.contains('theme-dark')) return 'dark';
      if (body.classList.contains('theme-light')) return 'light';
    }
    try {
      const stored = window.parent.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      /* 忽略存储不可用 */
    }
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  scheduleRender();
}

function frameStillAttached() {
  try {
    const element = window.frameElement;
    return !element || element.isConnected;
  } catch {
    return true;
  }
}

function watchTheme() {
  const doc = parentDocument();
  const sync = () => {
    if (destroyed) return;
    if (doc && !frameStillAttached()) {
      destroy();
      return;
    }
    applyTheme(resolveTheme(doc));
  };

  if (doc) {
    const onThemeChange = (event) => {
      const theme = event && event.detail ? event.detail.theme : null;
      if (destroyed) return;
      applyTheme(theme === 'dark' || theme === 'light' ? theme : resolveTheme(doc));
    };
    const onNav = () => sync();
    doc.addEventListener('themechange', onThemeChange);
    doc.addEventListener('nav', onNav);
    cleanups.push(() => doc.removeEventListener('themechange', onThemeChange));
    cleanups.push(() => doc.removeEventListener('nav', onNav));
    if (doc.documentElement) {
      const observer = new MutationObserver(sync);
      observer.observe(doc.documentElement, { attributes: true, attributeFilter: ['saved-theme'] });
      cleanups.push(() => observer.disconnect());
    }
    if (doc.body) {
      const bodyObserver = new MutationObserver(sync);
      bodyObserver.observe(doc.body, { attributes: true, attributeFilter: ['class'] });
      cleanups.push(() => bodyObserver.disconnect());
    }
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const onMedia = () => sync();
  media.addEventListener('change', onMedia);
  cleanups.push(() => media.removeEventListener('change', onMedia));

  applyTheme(resolveTheme(doc));
}

/* --------------------------------------------------------------- 控件层 -- */

function rebuildHighlightOptions() {
  const select = els.highlight;
  if (!select) return;
  const previous = state.highlight;
  select.replaceChildren();
  for (let m = 1; m <= state.paths; m++) {
    const option = document.createElement('option');
    option.value = String(m);
    option.textContent = '路径 ' + m;
    select.append(option);
  }
  state.highlight = clamp(previous, 0, state.paths - 1);
  select.value = String(state.highlight + 1);
}

function setCursor(value) {
  state.cursor = clamp(Math.round(value * 1000) / 1000, 0, WINDOW_S);
  if (els.cursor) els.cursor.value = String(state.cursor);
  render();
}

function bindControls() {
  const onPaths = () => {
    state.paths = clamp(Math.trunc(Number(els.paths.value)), 1, MAX_PATHS);
    rebuildHighlightOptions();
    render();
  };
  const onCursor = () => {
    state.cursor = clamp(Number(els.cursor.value), 0, WINDOW_S);
    render();
  };
  const onAmplitude = () => {
    state.amplitude = clamp(Number(els.amplitude.value), 0, 2);
    render();
  };
  const onSeed = () => {
    const parsed = Math.trunc(Number(els.seed.value));
    state.seed = clamp(Number.isFinite(parsed) ? parsed : DEFAULTS.seed, 0, 2147483646);
    els.seed.value = String(state.seed);
    regenerate();
    render();
  };
  const onHighlight = () => {
    state.highlight = clamp(Math.trunc(Number(els.highlight.value)) - 1, 0, state.paths - 1);
    render();
  };
  const onResample = () => {
    state.seed = (state.seed + 1) % 2147483647;
    els.seed.value = String(state.seed);
    regenerate();
    render();
  };
  const onReset = () => {
    state.paths = DEFAULTS.paths;
    state.cursor = DEFAULTS.cursor;
    state.amplitude = DEFAULTS.amplitude;
    state.seed = DEFAULTS.seed;
    state.highlight = DEFAULTS.highlight;
    els.paths.value = String(DEFAULTS.paths);
    els.cursor.value = String(DEFAULTS.cursor);
    els.amplitude.value = String(DEFAULTS.amplitude);
    els.seed.value = String(DEFAULTS.seed);
    regenerate();
    rebuildHighlightOptions();
    render();
  };
  const onCanvasKey = (event) => {
    const step = WINDOW_S / 40;
    let next = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = state.cursor + step;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = state.cursor - step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = WINDOW_S;
    if (next === null) return;
    event.preventDefault();
    setCursor(next);
  };

  els.paths.addEventListener('input', onPaths);
  els.cursor.addEventListener('input', onCursor);
  els.amplitude.addEventListener('input', onAmplitude);
  els.seed.addEventListener('change', onSeed);
  els.highlight.addEventListener('change', onHighlight);
  els.resample.addEventListener('click', onResample);
  els.reset.addEventListener('click', onReset);
  els.pathsCanvas.addEventListener('keydown', onCanvasKey);

  cleanups.push(() => els.paths.removeEventListener('input', onPaths));
  cleanups.push(() => els.cursor.removeEventListener('input', onCursor));
  cleanups.push(() => els.amplitude.removeEventListener('input', onAmplitude));
  cleanups.push(() => els.seed.removeEventListener('change', onSeed));
  cleanups.push(() => els.highlight.removeEventListener('change', onHighlight));
  cleanups.push(() => els.resample.removeEventListener('click', onResample));
  cleanups.push(() => els.reset.removeEventListener('click', onReset));
  cleanups.push(() => els.pathsCanvas.removeEventListener('keydown', onCanvasKey));
}

function bindResize() {
  if (typeof ResizeObserver !== 'function') {
    const onResize = () => scheduleRender();
    window.addEventListener('resize', onResize);
    cleanups.push(() => window.removeEventListener('resize', onResize));
    return;
  }
  const observer = new ResizeObserver(() => scheduleRender());
  for (const canvas of [els.pathsCanvas, els.histCanvas]) {
    if (canvas && canvas.parentElement) observer.observe(canvas.parentElement);
  }
  cleanups.push(() => observer.disconnect());
}

function destroy() {
  if (destroyed) return;
  destroyed = true;
  if (pendingFrame) {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
  }
  for (const cleanup of cleanups.splice(0)) {
    try {
      cleanup();
    } catch {
      /* 清理失败不应阻塞 SPA 切换 */
    }
  }
  if (window.__ltRandomProcessesLab && window.__ltRandomProcessesLab.destroy === destroy) {
    delete window.__ltRandomProcessesLab;
  }
}

/* ----------------------------------------------------------------- 启动 -- */

function bootstrap() {
  if (window.__ltRandomProcessesLab && typeof window.__ltRandomProcessesLab.destroy === 'function') {
    window.__ltRandomProcessesLab.destroy();
  }

  els.pathsCanvas = document.getElementById('paths');
  els.histCanvas = document.getElementById('histogram');
  els.paths = document.getElementById('count');
  els.cursor = document.getElementById('cursor');
  els.amplitude = document.getElementById('amplitude');
  els.seed = document.getElementById('seed');
  els.highlight = document.getElementById('highlight');
  els.resample = document.getElementById('resample');
  els.reset = document.getElementById('reset');
  els.pathsOut = document.getElementById('count-out');
  els.cursorOut = document.getElementById('cursor-out');
  els.amplitudeOut = document.getElementById('amplitude-out');
  els.seedOut = document.getElementById('seed-out');
  els.histNote = document.getElementById('histogram-note');
  els.statM = document.getElementById('stat-m');
  els.statT = document.getElementById('stat-t');
  els.statA = document.getElementById('stat-a');
  els.statSeed = document.getElementById('stat-seed');
  els.statMean = document.getElementById('stat-mean');
  els.statMeanTheory = document.getElementById('stat-mean-theory');
  els.statVar = document.getElementById('stat-var');
  els.statVarTheory = document.getElementById('stat-var-theory');

  if (!els.pathsCanvas || !els.histCanvas || !els.paths) return;

  resetControlsToDefaults();
  regenerate();
  watchTheme();
  bindControls();
  bindResize();
  window.addEventListener('pagehide', destroy, { once: true });
  cleanups.push(() => window.removeEventListener('pagehide', destroy));
  window.__ltRandomProcessesLab = { destroy };
  render();
}

function resetControlsToDefaults() {
  els.paths.value = String(DEFAULTS.paths);
  els.cursor.value = String(DEFAULTS.cursor);
  els.amplitude.value = String(DEFAULTS.amplitude);
  els.seed.value = String(DEFAULTS.seed);
  state.paths = DEFAULTS.paths;
  state.cursor = DEFAULTS.cursor;
  state.amplitude = DEFAULTS.amplitude;
  state.seed = DEFAULTS.seed;
  state.highlight = DEFAULTS.highlight;
  rebuildHighlightOptions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
