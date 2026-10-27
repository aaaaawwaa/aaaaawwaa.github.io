export function squareWaveApprox(x, terms) {
  if (!Number.isInteger(terms) || terms < 1 || !Number.isFinite(x)) {
    throw new RangeError('Expected a finite angle and a positive integer term count');
  }
  let sum = 0;
  for (let k = 0; k < terms; k++) {
    const harmonic = 2 * k + 1;
    sum += Math.sin(harmonic * x) / harmonic;
  }
  return 4 * sum / Math.PI;
}
