import { test } from 'node:test';
import assert from 'node:assert/strict';
import { squareWaveApprox } from '../quartz/static/lab/fourier/fourier-math.mjs';

test('one term matches the first square-wave harmonic', () => {
  assert.ok(Math.abs(squareWaveApprox(Math.PI/2,1)-4/Math.PI)<1e-12);
});
test('two terms use odd harmonics and alternate at a quarter period', () => {
  assert.ok(Math.abs(squareWaveApprox(Math.PI/2,2)-(4/Math.PI)*(1-1/3))<1e-12);
});
test('the approximation is odd and vanishes at a discontinuity', () => {
  assert.ok(Math.abs(squareWaveApprox(0,15))<1e-12);
  assert.ok(Math.abs(squareWaveApprox(.7,15)+squareWaveApprox(-.7,15))<1e-12);
});
test('invalid harmonic counts are rejected',()=>{
  for(const n of [0,-1,1.5,Infinity]) assert.throws(()=>squareWaveApprox(.5,n));
});
