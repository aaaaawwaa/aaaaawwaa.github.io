import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sampleNormals,
  samplePhases,
  sinePaths,
  randomWalkPaths,
  ensembleStats,
  meanPath,
  variancePath,
  theorySineVariance,
  theoryWalkVariance,
  THEORY_SINE_MEAN,
  THEORY_WALK_MEAN,
} from "../quartz/static/lab/stationarity/stationarity-math.mjs";

const close = (a, b, tol) => Math.abs(a - b) <= tol;

test("deterministic samplers are reproducible and prefix-stable", () => {
  assert.deepEqual(sampleNormals(7, 4), sampleNormals(7, 4));
  assert.deepEqual(sampleNormals(7, 4), sampleNormals(7, 8).slice(0, 4));
  assert.deepEqual(samplePhases(9, 3), samplePhases(9, 6).slice(0, 3));
  assert.notDeepEqual(sampleNormals(7, 4), sampleNormals(8, 4));
});

test("random walk starts at zero and accumulates increments", () => {
  const steps = 20;
  const sigma = 1.5;
  const walk = randomWalkPaths({ seed: 11, paths: 3, steps, sigma });
  assert.equal(walk.length, 3);
  for (const path of walk) {
    assert.equal(path.length, steps + 1);
    assert.equal(path[0], 0);
    const increments = sampleNormals(11, 3 * steps).map((v) => v * sigma);
    const m = walk.indexOf(path);
    assert.ok(close(path[1], increments[m * steps], 1e-12));
  }
});

test("walk ensemble variance grows like n sigma^2", () => {
  const steps = 40;
  const sigma = 1;
  const paths = 400;
  const walk = randomWalkPaths({ seed: 3, paths, steps, sigma });
  const variance = variancePath(walk);
  assert.ok(close(variance[0], 0, 1e-12));
  const expected = steps * sigma * sigma;
  assert.ok(Math.abs(variance[steps] - expected) / expected < 0.2, "variance at n=" + steps + " was " + variance[steps]);
  assert.ok(variance[steps] > variance[10], "variance should grow with n");
  assert.ok(Math.abs(meanPath(walk)[steps]) < 0.35, "walk mean should stay near 0");
  assert.equal(THEORY_WALK_MEAN, 0);
  assert.equal(theoryWalkVariance(10, 2), 40);
});

test("random-phase sine has constant theory moments", () => {
  const steps = 60;
  const amplitude = 2;
  const sine = sinePaths({ seed: 5, paths: 400, steps, amplitude, freq: 1.5 });
  const mean = meanPath(sine);
  const variance = variancePath(sine);
  for (const value of mean) assert.ok(Math.abs(value) < 0.2 * amplitude, "sine mean should be near 0");
  for (const value of variance) assert.ok(Math.abs(value - amplitude * amplitude / 2) < 0.15, "sine variance should be near A^2/2");
  assert.equal(THEORY_SINE_MEAN, 0);
  assert.equal(theorySineVariance(2), 2);
});

test("ensembleStats reports M-1 variance and null for a single path", () => {
  const stats = ensembleStats([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.equal(stats.count, 8);
  assert.ok(close(stats.mean, 5, 1e-12));
  assert.ok(close(stats.variance, 32 / 7, 1e-12));
  assert.deepEqual(ensembleStats([3.5]), { mean: 3.5, variance: null, count: 1 });
});

test("degenerate and boundary parameters stay finite", () => {
  const zeroA = sinePaths({ seed: 1, paths: 5, steps: 4, amplitude: 0, freq: 1.5 });
  assert.ok(zeroA.every((path) => path.every((v) => v === 0)));
  const zeroSigma = randomWalkPaths({ seed: 1, paths: 5, steps: 4, sigma: 0 });
  assert.ok(zeroSigma.every((path) => path.every((v) => v === 0)));
  assert.equal(theoryWalkVariance(0, 3), 0);
  const stats = ensembleStats([1, 2, 3]);
  assert.ok(Number.isFinite(stats.mean) && Number.isFinite(stats.variance));
});

test("invalid parameters raise RangeError", () => {
  const bad = [
    () => sinePaths({ seed: 1, paths: 0, steps: 4, amplitude: 1, freq: 1 }),
    () => sinePaths({ seed: 1, paths: 2, steps: 0, amplitude: 1, freq: 1 }),
    () => sinePaths({ seed: 1, paths: 2, steps: 4, amplitude: -1, freq: 1 }),
    () => sinePaths({ seed: 1, paths: 2, steps: 4, amplitude: 1, freq: 0 }),
    () => randomWalkPaths({ seed: 1, paths: 2, steps: 4, sigma: -0.5 }),
    () => sampleNormals(1, 0),
  ];
  for (const fn of bad) assert.throws(fn, RangeError);
});
