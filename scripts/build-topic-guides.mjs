import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

// Topic ownership is explicit: publishing a note does not assign it to an arbitrary folder UI.
const topics = [
  ['mathematics/index.md', ['math/'], '数学工具与课程笔记'],
  ['signal-processing/index.md', ['dsp/'], '数字信号处理知识点索引'],
  ['signal-processing/random-processes.md', ['random-signals/'], '随机信号、估计与检测'],
  ['communication/index.md', ['communication/','digital-modulation/'], '从信道到编码的知识点'],
  ['communication/mobile-networks.md', ['5g/'], '移动通信的知识点'],
  ['digital-systems/index.md', ['fpga/'], 'RTL、工具链与时序知识点'],
  ['programming/index.md', ['matlab/'], 'MATLAB 与算法验证'],
  ['maps/knowledge-network.md', ['maps/'], '跨学科知识地图'],
];
const labels = {math:'数学', 'linear-algebra':'线性代数', probability:'概率论与数理统计', 'complex-analysis':'复变函数与场论', dsp:'数字信号处理', 'random-signals':'随机信号处理', communication:'通信原理', 'digital-modulation':'数字调制', fpga:'FPGA 基础', verilog:'Verilog', combinational:'组合逻辑', sequential:'时序逻辑', vivado:'Vivado 设计流程', base:'基础流程', sta:'静态时序分析', matlab:'MATLAB', maps:'知识关联', '5g':'5G', '6g':'6G', phy:'物理层', 'engineering-simulation':'工程实践'};
const begin='<!-- topic-index:start -->', end='<!-- topic-index:end -->';
const config=JSON.parse(await fs.readFile('public-notes.json','utf8'));
const covered=new Set();
for (const [target,prefixes,title] of topics) {
  const selected=config.files.filter(x=>prefixes.some(prefix=>x.destination.startsWith('vault-notes/'+prefix)));
  const groups=new Map();
  for (const entry of selected) {
    if(covered.has(entry.destination))throw new Error('Duplicate topic ownership: '+entry.destination);
    covered.add(entry.destination);
    const note=matter(await fs.readFile(path.join('content',entry.destination),'utf8'));
    const parts=entry.destination.split('/').slice(1,-1);
    const key=parts.map(part=>labels[part]||part).join(' / ');
    if(!groups.has(key))groups.set(key,[]);
    const name=note.data.title || path.basename(entry.source,'.md');
    groups.get(key).push(`- [[${entry.destination.replace(/\.md$/,'')}|${name}]]`);
  }
  const section=[begin,`## ${title}`, '', ...[...groups].flatMap(([label,items])=>[`### ${label}`,'',...items,'']),end].join('\n');
  const filename=path.join('content',target);
  let text=await fs.readFile(filename,'utf8');
  const original=text;
  const a=text.indexOf(begin), b=text.indexOf(end);
  if((a>=0)!==(b>=0))throw new Error('Incomplete generated section: '+target);
  text=a>=0?text.slice(0,a)+section+text.slice(b+end.length):text.trimEnd()+'\n\n'+section+'\n';
  if(process.argv.includes('--check')) { if(text!==original)throw new Error('Topic guide is stale: '+target); }
  else await fs.writeFile(filename,text);
  console.log(`${target}: ${selected.length} notes`);
}
if(covered.size!==config.files.length)throw new Error('Some published notes have no topic entry');
console.log(`Topic coverage: ${covered.size}/${config.files.length}`);