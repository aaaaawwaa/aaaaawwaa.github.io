import { squareWaveApprox } from './fourier-math.mjs';
const slider=document.querySelector('#terms');
const count=document.querySelector('#count');
const canvas=document.querySelector('#plot');
const ctx=canvas.getContext('2d');

function draw() {
  const n=Number(slider.value); count.value=String(n); count.textContent=String(n);
  const box=canvas.getBoundingClientRect(), scale=window.devicePixelRatio||1;
  canvas.width=Math.round(box.width*scale);canvas.height=Math.round(box.height*scale);
  ctx.setTransform(scale,0,0,scale,0,0);
  const w=box.width,h=box.height,pad={l:38,r:14,t:12,b:28},pw=w-pad.l-pad.r,ph=h-pad.t-pad.b;
  const xPos=x=>pad.l+(x+Math.PI)*pw/(2*Math.PI), yPos=y=>pad.t+(1.5-y)*ph/3;
  const css=getComputedStyle(document.documentElement),color=name=>css.getPropertyValue(name).trim();
  ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle=color('--line');ctx.fillStyle=color('--muted');ctx.font='11px sans-serif';
  for(const y of [-1,0,1]) {ctx.beginPath();ctx.moveTo(pad.l,yPos(y));ctx.lineTo(w-pad.r,yPos(y));ctx.stroke();ctx.fillText(String(y),8,yPos(y)+4);}
  for(const [x,label] of [[-Math.PI,'−π'],[0,'0'],[Math.PI,'π']]) {const px=xPos(x);ctx.beginPath();ctx.moveTo(px,pad.t);ctx.lineTo(px,h-pad.b);ctx.stroke();ctx.fillText(label,px-7,h-7);}
  ctx.setLineDash([5,5]);ctx.strokeStyle=color('--ideal');ctx.lineWidth=1.5;ctx.beginPath();
  ctx.moveTo(xPos(-Math.PI),yPos(-1));ctx.lineTo(xPos(0),yPos(-1));ctx.moveTo(xPos(0),yPos(1));ctx.lineTo(xPos(Math.PI),yPos(1));ctx.stroke();ctx.setLineDash([]);
  ctx.strokeStyle=color('--accent');ctx.lineWidth=2.5;ctx.beginPath();
  const steps=Math.max(400,Math.ceil(pw*2));for(let i=0;i<=steps;i++){const x=-Math.PI+2*Math.PI*i/steps,y=squareWaveApprox(x,n);if(i===0)ctx.moveTo(xPos(x),yPos(y));else ctx.lineTo(xPos(x),yPos(y));}ctx.stroke();
}
slider.addEventListener('input',draw);
document.querySelector('#reset').addEventListener('click',()=>{slider.value='5';draw();});
window.addEventListener('resize',draw);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw);
draw();
