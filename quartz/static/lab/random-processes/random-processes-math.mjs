/**
 * random-processes-math.mjs
 * ---------------------------------------------------------------------------
 * 随机相位正弦过程的纯函数实现，供交互实验（Canvas UI）与 Node 单元测试共用。
 *
 * 模型：x_m(t) = A * cos(2 * pi * f0 * t + theta_m)，m = 1..M
 *   - A >= 0、f0 > 0 为确定量；
 *   - theta_m 为第 m 条样本路径的随机相位，重采样时独立取自 U[0, 2pi)，
 *     采样后在整条路径的时间轴上保持不变。
 *
 * 约定：
 *   - 固定时刻 t 的取值 A cos(2 pi f0 t + Theta) 服从 [-A, A] 上的反正弦分布，
 *     密度 1 / (pi * sqrt(A^2 - x^2))（|x| < A），不是高斯分布；
 *   - 集合均值为 0，方差为 A^2 / 2；
 *   - 经验方差使用分母 M - 1（无偏样本方差），M < 2 时记为 null。
 *
 * 本文件不访问 DOM，可在浏览器与 Node 中直接导入。
 * ---------------------------------------------------------------------------
 */

const TAU = 2 * Math.PI;

/**
 * mulberry32：32 位状态的确定性伪随机数发生器，返回 [0, 1) 的函数。
 * 同一 seed 必然给出同一序列，用于"同种子同结果"的复现要求。
 * @param {number} seed 有限数值，内部截断为 32 位无符号整数
 * @returns {() => number}
 */
export function mulberry32(seed) {
  if (!Number.isFinite(seed)) {
    throw new RangeError('seed must be a finite number');
  }
  let state = Math.trunc(seed) >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 抽取 count 条样本路径的初始相位，取值于 [0, 2pi)。
 * 依序抽样的性质保证：samplePhases(seed, n) 是 samplePhases(seed, m>n) 的前缀，
 * 因此改变路径条数 M 时可以保留已有路径的相位。
 * @param {number} seed 随机种子
 * @param {number} count 路径条数（正整数）
 * @returns {number[]}
 */
export function samplePhases(seed, count) {
  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }
  const random = mulberry32(seed);
  const phases = new Array(count);
  for (let index = 0; index < count; index++) {
    phases[index] = random() * TAU;
  }
  return phases;
}

/**
 * 单条样本路径在时刻 t 的取值：x(t) = A cos(2 pi f0 t + phase)。
 * @param {{A: number, f0: number, t: number, phase: number}} options
 * @returns {number}
 */
export function cosineValue(options) {
  if (!options || typeof options !== 'object') {
    throw new RangeError('cosineValue expects an options object');
  }
  const { A, f0, t, phase } = options;
  if (!Number.isFinite(A) || A < 0) {
    throw new RangeError('A must be finite and >= 0');
  }
  if (!Number.isFinite(f0) || f0 <= 0) {
    throw new RangeError('f0 must be finite and > 0');
  }
  if (!Number.isFinite(t)) {
    throw new RangeError('t must be finite');
  }
  if (!Number.isFinite(phase)) {
    throw new RangeError('phase must be finite');
  }
  return A * Math.cos(TAU * f0 * t + phase);
}

/**
 * 集合统计量。方差用分母 M - 1（无偏样本方差）；M < 2 时无法估计，记为 null。
 * 空集合返回 { mean: null, variance: null, count: 0 }，避免出现 NaN。
 * @param {number[]} values
 * @returns {{mean: number|null, variance: number|null, count: number}}
 */
export function ensembleStats(values) {
  if (!Array.isArray(values)) {
    throw new RangeError('values must be an array');
  }
  for (const value of values) {
    if (!Number.isFinite(value)) {
      throw new RangeError('values must be finite numbers');
    }
  }
  const count = values.length;
  if (count === 0) {
    return { mean: null, variance: null, count: 0 };
  }
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  const mean = sum / count;
  if (count < 2) {
    return { mean, variance: null, count };
  }
  let squared = 0;
  for (const value of values) {
    const deviation = value - mean;
    squared += deviation * deviation;
  }
  return { mean, variance: squared / (count - 1), count };
}

/** 固定时刻的集合均值（理论值）。@returns {number} */
export function theoreticalMean() {
  return 0;
}

/**
 * 固定时刻的集合方差（理论值）A^2 / 2。
 * @param {number} A 幅度（>= 0）
 * @returns {number}
 */
export function theoreticalVariance(A) {
  if (!Number.isFinite(A) || A < 0) {
    throw new RangeError('A must be finite and >= 0');
  }
  return (A * A) / 2;
}

/**
 * [-A, A] 上反正弦分布在 x 处的概率密度：1 / (pi sqrt(A^2 - x^2))。
 * 支撑集之外、A = 0 退化、任何非法输入都返回 0，绝不返回 NaN 或 Infinity。
 * @param {number} x 取值点
 * @param {number} A 幅度（>= 0）
 * @returns {number}
 */
export function arcsineDensity(x, A) {
  if (!Number.isFinite(x) || !Number.isFinite(A) || A <= 0) {
    return 0;
  }
  if (!(Math.abs(x) < A)) {
    return 0;
  }
  const radicand = A * A - x * x;
  if (!(radicand > 0)) {
    return 0;
  }
  return 1 / (Math.PI * Math.sqrt(radicand));
}
