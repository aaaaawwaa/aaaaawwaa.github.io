import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mulberry32,
  samplePhases,
  cosineValue,
  ensembleStats,
  theoreticalMean,
  theoreticalVariance,
  arcsineDensity,
} from '../quartz/static/lab/random-processes/random-processes-math.mjs';

const TAU = 2 * Math.PI;

// Solve A cos(u_i + phi) = x_i for (A cos phi, A sin phi) and return phi in [0, 2pi).
// Used to check that one sample path keeps the same phase at every time instant.
function recoverPhase(A, f0, t1, x1, t2, x2) {
  const u1 = TAU * f0 * t1;
  const u2 = TAU * f0 * t2;
  const c1 = Math.cos(u1);
  const s1 = Math.sin(u1);
  const c2 = Math.cos(u2);
  const s2 = Math.sin(u2);
  const det = s1 * c2 - c1 * s2;
  assert.ok(Math.abs(det) > 1e-6, 'the two sample times must be linearly independent');
  const p = (s1 * x2 - x1 * s2) / det;
  const q = (c1 * x2 - c2 * x1) / det;
  const phi = Math.atan2(q, p);
  return phi < 0 ? phi + TAU : phi;
}

test('the same seed reproduces the phase sequence', () => {
  const first = samplePhases(42, 8);
  const second = samplePhases(42, 8);
  assert.equal(first.length, 8);
  assert.deepEqual(first, second);
});

test('different seeds produce different phase sequences', () => {
  assert.notDeepEqual(samplePhases(1, 8), samplePhases(2, 8));
});

test('every phase lies in the half-open interval [0, 2pi)', () => {
  for (const seed of [0, 1, 7, 12345, 2147483647]) {
    for (const phase of samplePhases(seed, 40)) {
      assert.ok(Number.isFinite(phase), 'phase must be finite');
      assert.ok(phase >= 0 && phase < TAU, `phase ${phase} outside [0, 2pi) for seed ${seed}`);
    }
  }
});

test('a longer draw starts with the shorter draw', () => {
  const long = samplePhases(2024, 40);
  for (const m of [1, 3, 8, 17, 40]) {
    assert.deepEqual(samplePhases(2024, m), long.slice(0, m));
  }
});

test('mulberry32 is deterministic and stays in [0, 1)', () => {
  const a = mulberry32(9);
  const b = mulberry32(9);
  for (let i = 0; i < 64; i++) {
    const value = a();
    assert.equal(value, b());
    assert.ok(value >= 0 && value < 1);
  }
});

test('cosineValue follows x(t) = A cos(2 pi f0 t + phase)', () => {
  const A = 2;
  const f0 = 1.5;
  const t = 0.25;
  const phase = 0.7;
  assert.ok(Math.abs(cosineValue({ A, f0, t, phase }) - A * Math.cos(TAU * f0 * t + phase)) < 1e-12);
  assert.equal(cosineValue({ A: 3, f0: 2, t: 0, phase: 0 }), 3);
  assert.ok(Math.abs(cosineValue({ A: 3, f0: 2, t: 0, phase: Math.PI / 2 })) < 1e-12);
  assert.ok(Math.abs(cosineValue({ A: 3, f0: 2, t: 0, phase: Math.PI }) + 3) < 1e-12);
});

test('both time endpoints of the observation window are usable', () => {
  const A = 1.7;
  const f0 = 2;
  const phase = 1.234;
  const T = 1;
  assert.ok(Math.abs(cosineValue({ A, f0, t: 0, phase }) - A * Math.cos(phase)) < 1e-12);
  assert.ok(Math.abs(cosineValue({ A, f0, t: T, phase }) - A * Math.cos(phase)) < 1e-12);
  for (const t of [0, 0.25, 0.5, 0.75, T]) {
    const value = cosineValue({ A, f0, t, phase });
    assert.ok(Number.isFinite(value) && Math.abs(value) <= A + 1e-12);
  }
});

test('one sample path keeps one fixed phase at every time instant', () => {
  const A = 1.5;
  const f0 = 3;
  const phase = 2;
  const t1 = 0.02;
  const t2 = 0.09;
  const x1 = cosineValue({ A, f0, t: t1, phase });
  const x2 = cosineValue({ A, f0, t: t2, phase });
  assert.ok(Math.abs(recoverPhase(A, f0, t1, x1, t2, x2) - phase) < 1e-9);
  assert.notEqual(cosineValue({ A, f0, t: t2, phase: 2.1 }), x2);
});

test('ensembleStats uses the sample variance with denominator M - 1', () => {
  const stats = ensembleStats([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.equal(stats.count, 8);
  assert.equal(stats.mean, 5);
  assert.ok(Math.abs(stats.variance - 32 / 7) < 1e-12);
});

test('a single sample reports a mean and an unknown variance', () => {
  assert.deepEqual(ensembleStats([3.5]), { mean: 3.5, variance: null, count: 1 });
});

test('an empty ensemble reports null statistics instead of NaN', () => {
  const stats = ensembleStats([]);
  assert.equal(stats.count, 0);
  assert.equal(stats.mean, null);
  assert.equal(stats.variance, null);
});

test('the theoretical moments are 0 and A^2 / 2', () => {
  assert.equal(theoreticalMean(), 0);
  assert.equal(theoreticalVariance(2), 2);
  assert.equal(theoreticalVariance(0), 0);
  assert.ok(Math.abs(theoreticalVariance(1.3) - 1.3 * 1.3 / 2) < 1e-12);
});

test('the arcsine density is symmetric and positive inside the support', () => {
  const A = 1.3;
  assert.ok(Math.abs(arcsineDensity(0, A) - 1 / (Math.PI * A)) < 1e-12);
  for (const x of [0.12, 0.4, 0.9, 1.24]) {
    assert.ok(arcsineDensity(x, A) > 0);
    assert.ok(Math.abs(arcsineDensity(x, A) - arcsineDensity(-x, A)) < 1e-15);
  }
});

test('the arcsine density vanishes outside the support', () => {
  assert.equal(arcsineDensity(1.5, 1), 0);
  assert.equal(arcsineDensity(-1.5, 1), 0);
  assert.equal(arcsineDensity(1, 1), 0);
  assert.equal(arcsineDensity(-1, 1), 0);
});

test('the arcsine density stays finite near the edges', () => {
  const density = arcsineDensity(0.999999, 1);
  assert.ok(Number.isFinite(density) && density > 0);
});

test('A = 0 collapses the ensemble to zero without NaN', () => {
  const values = samplePhases(5, 10).map((phase) => cosineValue({ A: 0, f0: 1.5, t: 0.3, phase }));
  assert.ok(values.every((value) => value === 0));
  const stats = ensembleStats(values);
  assert.equal(stats.mean, 0);
  assert.equal(stats.variance, 0);
  assert.ok(Number.isFinite(stats.variance));
  assert.equal(arcsineDensity(0, 0), 0);
});

test('the arcsine density degrades to 0 on invalid input', () => {
  assert.equal(arcsineDensity(0.3, 0), 0);
  assert.equal(arcsineDensity(0, -1), 0);
  assert.equal(arcsineDensity(Number.NaN, 1), 0);
  assert.equal(arcsineDensity(0.5, Number.NaN), 0);
  assert.equal(arcsineDensity(Number.POSITIVE_INFINITY, 1), 0);
});

test('invalid model parameters raise RangeError', () => {
  const bad = [
    { A: -1, f0: 1, t: 0, phase: 0 },
    { A: Number.NaN, f0: 1, t: 0, phase: 0 },
    { A: Number.POSITIVE_INFINITY, f0: 1, t: 0, phase: 0 },
    { A: 1, f0: 0, t: 0, phase: 0 },
    { A: 1, f0: -2, t: 0, phase: 0 },
    { A: 1, f0: Number.NaN, t: 0, phase: 0 },
    { A: 1, f0: 1, t: Number.NaN, phase: 0 },
    { A: 1, f0: 1, t: Number.POSITIVE_INFINITY, phase: 0 },
    { A: 1, f0: 1, t: 0, phase: Number.NaN },
  ];
  for (const args of bad) {
    assert.throws(() => cosineValue(args), RangeError);
  }
});

test('invalid phase counts and seeds raise RangeError', () => {
  for (const count of [0, -1, 1.5, Number.POSITIVE_INFINITY, Number.NaN]) {
    assert.throws(() => samplePhases(1, count), RangeError);
  }
  for (const seed of [Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => samplePhases(seed, 4), RangeError);
  }
});

test('negative amplitudes are rejected where a variance is being described', () => {
  assert.throws(() => theoreticalVariance(-1), RangeError);
  assert.throws(() => ensembleStats('not an array'), RangeError);
});
