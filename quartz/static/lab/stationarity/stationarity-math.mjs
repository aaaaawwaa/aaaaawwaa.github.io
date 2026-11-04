/**
 * stationarity-math.mjs —「宽平稳 vs 非平稳」对比实验的纯函数层。
 *
 * 两个模型（同一时间轴 n = 0..N，N = steps）：
 *   1) 随机相位正弦  x_m[n] = A cos(2π f0 n/N + θ_m)，θ_m ~ U[0,2π)，f0 单位 Hz、窗口 1 s；
 *   2) 零均值随机游走  w_m[n] = Σ_{k=1..n} ε_m[k]，ε ~ N(0, σ²) i.i.d.，w_m[0] = 0。
 *
 * 理论矩（固定 n）：
 *   正弦：E[x]=0，Var(x)=A²/2（与 n 无关）；
 *   随机游走：E[w]=0，Var(w)=n σ²（随 n 增长，因此非平稳）。
 *
 * 所有采样器都由 seed 确定性生成，且长序列是短序列的前缀（改 M 不换已有样本）。
 */

export const MAX_PATHS = 500; // UI 默认 8、滑块上限 40；纯函数允许更大集合用于统计测试
export const MAX_STEPS = 240;
export const THEORY_SINE_MEAN = 0;
export const THEORY_WALK_MEAN = 0;

const TAU = 2 * Math.PI;

function assertPositiveInt(value, name) {
  if (!Number.isInteger(value) || value < 1) throw new RangeError(name + " must be a positive integer");
}

function assertFiniteNumber(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(name + " must be finite");
}

/** mulberry32：确定性伪随机数发生器。 */
export function mulberry32(seed) {
  assertFiniteNumber(seed, "seed");
  let state = Math.trunc(seed) >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** count 个标准正态样本（Box–Muller），确定性且前缀稳定。 */
export function sampleNormals(seed, count) {
  assertPositiveInt(count, "count");
  const random = mulberry32(seed);
  const out = new Array(count);
  for (let i = 0; i < count; i += 2) {
    const u1 = 1 - random();
    const u2 = random();
    const radius = Math.sqrt(-2 * Math.log(u1));
    const angle = TAU * u2;
    out[i] = radius * Math.cos(angle);
    if (i + 1 < count) out[i + 1] = radius * Math.sin(angle);
  }
  return out;
}

/** count 个 U[0,2π) 相位，确定性且前缀稳定。 */
export function samplePhases(seed, count) {
  assertPositiveInt(count, "count");
  const random = mulberry32(seed);
  const out = new Array(count);
  for (let i = 0; i < count; i++) out[i] = random() * TAU;
  return out;
}

function validateCommon({ paths, steps }) {
  assertPositiveInt(paths, "paths");
  assertPositiveInt(steps, "steps");
  if (paths > MAX_PATHS) throw new RangeError("paths must be <= " + MAX_PATHS);
  if (steps > MAX_STEPS) throw new RangeError("steps must be <= " + MAX_STEPS);
}

/** 随机相位正弦：paths × (steps+1) 的样本矩阵。 */
export function sinePaths({ seed, paths, steps, amplitude, freq }) {
  validateCommon({ paths, steps });
  assertFiniteNumber(amplitude, "amplitude");
  if (amplitude < 0) throw new RangeError("amplitude must be >= 0");
  assertFiniteNumber(freq, "freq");
  if (freq <= 0) throw new RangeError("freq must be > 0");
  const phases = samplePhases(seed, paths);
  const matrix = new Array(paths);
  for (let m = 0; m < paths; m++) {
    const row = new Array(steps + 1);
    for (let n = 0; n <= steps; n++) {
      row[n] = amplitude * Math.cos(TAU * freq * (n / steps) + phases[m]);
    }
    matrix[m] = row;
  }
  return matrix;
}

/** 零均值随机游走：paths × (steps+1) 的样本矩阵，w[0]=0。 */
export function randomWalkPaths({ seed, paths, steps, sigma }) {
  validateCommon({ paths, steps });
  assertFiniteNumber(sigma, "sigma");
  if (sigma < 0) throw new RangeError("sigma must be >= 0");
  const increments = sampleNormals(seed, paths * steps);
  const matrix = new Array(paths);
  for (let m = 0; m < paths; m++) {
    const row = new Array(steps + 1);
    row[0] = 0;
    for (let n = 1; n <= steps; n++) {
      row[n] = row[n - 1] + sigma * increments[m * steps + (n - 1)];
    }
    matrix[m] = row;
  }
  return matrix;
}

/** 集合统计量（方差分母 M−1；M<2 时为 null）。 */
export function ensembleStats(values) {
  if (!Array.isArray(values)) throw new RangeError("values must be an array");
  for (const value of values) {
    if (!Number.isFinite(value)) throw new RangeError("values must be finite numbers");
  }
  const count = values.length;
  if (count === 0) return { mean: null, variance: null, count: 0 };
  let sum = 0;
  for (const value of values) sum += value;
  const mean = sum / count;
  if (count < 2) return { mean, variance: null, count };
  let squared = 0;
  for (const value of values) {
    const deviation = value - mean;
    squared += deviation * deviation;
  }
  return { mean, variance: squared / (count - 1), count };
}

/** 每一列（时刻 n）的集合均值。 */
export function meanPath(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) throw new RangeError("matrix must be non-empty");
  const steps = matrix[0].length;
  const out = new Array(steps);
  for (let n = 0; n < steps; n++) {
    let sum = 0;
    for (const row of matrix) sum += row[n];
    out[n] = sum / matrix.length;
  }
  return out;
}

/** 每一列（时刻 n）的集合方差（分母 M−1；M<2 时该列为 null）。 */
export function variancePath(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) throw new RangeError("matrix must be non-empty");
  const paths = matrix.length;
  const steps = matrix[0].length;
  if (paths < 2) return new Array(steps).fill(null);
  const means = meanPath(matrix);
  const out = new Array(steps);
  for (let n = 0; n < steps; n++) {
    let squared = 0;
    for (const row of matrix) {
      const deviation = row[n] - means[n];
      squared += deviation * deviation;
    }
    out[n] = squared / (paths - 1);
  }
  return out;
}

export function theorySineVariance(amplitude) {
  assertFiniteNumber(amplitude, "amplitude");
  if (amplitude < 0) throw new RangeError("amplitude must be >= 0");
  return (amplitude * amplitude) / 2;
}

export function theoryWalkVariance(n, sigma) {
  assertFiniteNumber(n, "n");
  assertFiniteNumber(sigma, "sigma");
  if (n < 0) throw new RangeError("n must be >= 0");
  if (sigma < 0) throw new RangeError("sigma must be >= 0");
  return n * sigma * sigma;
}
