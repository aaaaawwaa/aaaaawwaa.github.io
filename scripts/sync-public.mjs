#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { scanText, unsafeSvg } from './check-public.mjs';

const args=process.argv.slice(2), options={apply:false};
for (let i=0;i<args.length;i++) {
  const arg=args[i];
  if (arg==='--apply') options.apply=true;
  else if (['--vault','--site','--manifest'].includes(arg) && args[i+1]) options[arg.slice(2)]=args[++i];
  else { console.error(`未知或缺少值的参数：${arg}`); process.exit(2); }
}
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const norm = value => value.replaceAll('\\','/').replace(/^\.\//,'');
// 默认标题：去掉文件名前的编号/字母前缀，保留中文标题本身
function defaultTitle(source) {
  const base = path.posix.basename(source, '.md');
  return base.replace(/^\s*(?:[0-9]+[.、_\-\s]+|[A-Z][.、\s]+)/, '').trim() || base;
}
function safeRelative(value) {
  if (typeof value!=='string' || !value || path.isAbsolute(value) || /^[a-z]:/i.test(value)) throw new Error('清单含无效或绝对路径');
  const p=norm(value), parts=p.split('/');
  if (parts.some(x=>!x||x==='.'||x==='..') || parts.some(x=>x.startsWith('.'))) throw new Error('清单路径含禁止的隐藏目录或越界片段');
  return p;
}
async function noSymlinks(root, rel, allowMissing=false) {
  let p=root;
  for (const part of rel.split('/')) {
    p=path.join(p,part);
    try { const s=await fs.lstat(p); if (s.isSymbolicLink()) throw new Error('路径不允许符号链接'); }
    catch(e) { if (e.code==='ENOENT' && allowMissing) return; throw e; }
  }
}
async function main() {
  if (!options.vault||!options.site||!options.manifest) throw new Error('用法：node sync-public.mjs --vault <Vault> --site <Wiki> --manifest <清单> [--apply]');
  const vault=await fs.realpath(options.vault), site=await fs.realpath(options.site), content=await fs.realpath(path.join(site,'content'));
  function inside(root, target) {
    const relative=path.relative(root,target);
    return relative==='' || (relative!=='..' && !relative.startsWith('..'+path.sep) && !path.isAbsolute(relative));
  }
  if (inside(vault,site) || inside(site,vault)) throw new Error('Vault 与 Wiki 项目目录不能相同或嵌套');
  const config=JSON.parse(await fs.readFile(options.manifest,'utf8'));
  if (config.version!==1||!Array.isArray(config.files)||!Array.isArray(config.assets)) throw new Error('清单必须包含 version=1、files 和 assets 数组');
  const policy=config.unresolvedPolicy==='text'?'text':'error';
  const entries=[...config.files.map(x=>({...x,kind:'note'})),...config.assets.map(x=>({...x,kind:'asset'}))];
  const destSet=new Set(), sourceSet=new Set(), byName=new Map();
  for (const x of entries) {
    x.source=safeRelative(x.source); x.destination=safeRelative(x.destination);
    if (!/^vault-notes\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.[a-z0-9]+$/.test(x.destination)) throw new Error(`目标必须是 vault-notes 下的小写英文短横线路径：${x.destination}`);
    if (x.kind==='note' && (!x.source.toLowerCase().endsWith('.md')||!x.destination.endsWith('.md'))) throw new Error('笔记必须为 Markdown');
    if (x.kind==='asset' && (!/\.(?:png|jpe?g|gif|webp|svg)$/i.test(x.source)||!/\.(?:png|jpe?g|gif|webp|svg)$/.test(x.destination))) throw new Error('附件仅支持明确列出的图片和 SVG');
    if (path.extname(x.source).toLowerCase()!==path.extname(x.destination).toLowerCase()) throw new Error('源和目标扩展名不一致');
    const key=x.destination.toLowerCase(); if(destSet.has(key)||sourceSet.has(x.source.toLowerCase())) throw new Error('清单存在重复源或目标');
    destSet.add(key); sourceSet.add(x.source.toLowerCase());
    await noSymlinks(vault,x.source); await noSymlinks(content,x.destination,true);
    const name=path.posix.basename(x.source).replace(/\.md$/i,'').toLowerCase();
    if (!byName.has(name)) byName.set(name,[]); byName.get(name).push(x);
  }
  const unresolved=[], secrets=[], outputs=[];
  function find(target, current, kind) {
    let raw=norm(target).split('#')[0].trim();
    if (!raw) return null;
    const relative=path.posix.normalize(path.posix.join(path.posix.dirname(current.source),raw));
    const key=value=>kind==='note'?value.toLowerCase().replace(/\.md$/i,''):value.toLowerCase();
    const keys=[key(raw),key(relative)];
    let matches=entries.filter(x=>x.kind===kind && keys.includes(x.source.toLowerCase().replace(kind==='note'?/\.md$/i:/$^/,'')));
    if (!matches.length) matches=(byName.get(path.posix.basename(raw).replace(/\.md$/i,'').toLowerCase())||[]).filter(x=>x.kind===kind);
    return matches.length===1 ? matches[0] : null;
  }
  for (const x of entries) {
    const data=await fs.readFile(path.join(vault,...x.source.split('/')));
    if(x.kind==='asset') { if(x.source.toLowerCase().endsWith('.svg') && unsafeSvg(data.toString('utf8'))) throw new Error(`SVG 含活动内容或外部引用：${x.source}`); outputs.push({x,data}); continue; }
    let text=data.toString('utf8');
    const findings=scanText(text); if(findings.length) secrets.push({file:x.source,types:findings});
    let inFence=false;
    text=text.split('\n').map(line=>{
      if (/^\s*(```|~~~)/.test(line)) {inFence=!inFence;return line;} if(inFence) return line;
      const saved=[]; line=line.replace(/`[^`]*`/g,m=>{saved.push(m);return `@@WIKICODE${saved.length-1}@@`;});
      line=line.replace(/(!?)\[\[([^\]]+)\]\]/g,(all,embed,inner)=>{
        const escapedPipe=inner.includes('\\|');
        const [raw,...labels]=inner.split('|'), target=raw.replace(/\\$/,'').trim();
        if(target.startsWith('#')) return all;
        const base=target.split('#')[0], kind=embed?'asset':'note', match=find(base,x,kind);
        // 非嵌入的 [[file.svg]] 是对附件的普通链接：若清单里有该附件，改写为指向站点内附件路径的链接
        if(!match && !embed && kind==='note') {
          const linkedAsset=find(base,x,'asset');
          if(linkedAsset) {
            const anchorPart=target.includes('#')?'#'+target.split('#').slice(1).join('#'):'';
            const sep=escapedPipe?'\\|':'|';
            const label=labels.length?sep+labels.join(sep):'';
            return '[['+linkedAsset.destination+anchorPart+label+']]';
          }
        }
        if(!match) {
          unresolved.push({file:x.source,target:base,embed:Boolean(embed),action:policy==='text'?'text':'error'});
          if(policy!=='text') return all;
          if(embed) return `*（图片未随站点发布：${path.posix.basename(base)}）*`;
          const fallback=(labels.length?labels.join('|'):path.posix.basename(base).replace(/\.md$/i,'')).trim();
          return fallback || base;
        }
        const anchor=target.includes('#')?'#'+target.split('#').slice(1).join('#'):'';
        const out=kind==='note'?match.destination.replace(/\.md$/,''):match.destination;
        // Quartz 对 ![[x.svg]] 会渲染成 <object data="...">，而链接改写只处理 img src，
        // 因此 SVG 嵌入改用 Markdown 图片语法，浏览器会得到正确的相对路径。
        if(embed && kind==='asset' && out.toLowerCase().endsWith('.svg')) {
          const alt=labels.length?labels.join('|'):path.posix.basename(out,'.svg');
          return `![${alt}](${out})`;
        }
        const sep=escapedPipe?'\\|':'|';
        const label=labels.length?sep+labels.join(sep):'';
        return `${embed}[[${out}${anchor}${label}]]`;
      });
      line=line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(all,alt,url)=>{
        if(/^(?:https?:|data:)/i.test(url)) return all;
        // 已是站点内目标路径的图片（如由 SVG 嵌入改写的 ![](vault-notes/assets/x.svg)）
        // 不再二次改写，交由 Quartz 统一计算相对地址
        if(/^vault-notes\//i.test(url)) return all;
        let target=url; try { target=decodeURIComponent(url); } catch {}
        const match=find(target,x,'asset');
        if(!match){
          unresolved.push({file:x.source,target,embed:true,action:policy==='text'?'text':'error'});
          return policy==='text' ? `*（图片未随站点发布：${path.posix.basename(target)}）*` : all;
        }
        return `![${alt}](./${path.posix.relative(path.posix.dirname(x.destination),match.destination)})`;
      });
      // 正文中的中文标签（如独占一行的 #概念解析）会让 Quartz 生成 tag 链接，
      // 该路径在 Linux 上触发插件异常（Invalid code point）。转义为字面量文本，保持可读。
      line=line.replace(/(^|\s)#([\u4e00-\u9fff][^\s#]*)/g,(all,pre,tag)=>pre+'\\#'+tag);
      return line.replace(/@@WIKICODE(\d+)@@/g,(_,i)=>saved[Number(i)]);
    }).join('\n');
    if(!/^---\s*\n/.test(text)) text=`---\ntitle: ${JSON.stringify(x.title||defaultTitle(x.source))}\n---\n\n${text}`;
    else if(!/^title\s*:/im.test(text.split(/\n---\s*\n/,1)[0])) text=text.replace(/^---\s*\n/,`---\ntitle: ${JSON.stringify(x.title||defaultTitle(x.source))}\n`);
    outputs.push({x,data:Buffer.from(text,'utf8')});
  }
  const statePath=path.join(site,'.quartz','sync-public-state.json'); let state={};
  try {state=JSON.parse(await fs.readFile(statePath,'utf8'));} catch(e) {if(e.code!=='ENOENT')throw e;}
  const conflicts=[];
  for(const {x,data} of outputs) {
    const target=path.join(content,...x.destination.split('/'));
    try {const current=await fs.readFile(target); if(state[x.destination]!==hash(current)) conflicts.push(x.destination);}
    catch(e){if(e.code!=='ENOENT')throw e;}
  }
  const converted=unresolved.filter(u=>u.action==='text');
  console.log(JSON.stringify({mode:options.apply?'apply':'preview',policy,notes:config.files.length,assets:config.assets.length,unresolved,converted,secretFindings:secrets,conflicts},null,2));
  if(secrets.length||conflicts.length||(options.apply&&unresolved.length&&policy!=='text')) throw new Error('存在待处理问题，未执行同步');
  if(options.apply&&converted.length) console.log(`已把 ${converted.length} 个未发布的关联目标转为可读文字（见 converted 列表）。`);
  if(!options.apply)return;
  for(const {x,data} of outputs) {
    const target=path.join(content,...x.destination.split('/')); await fs.mkdir(path.dirname(target),{recursive:true});
    await fs.writeFile(target,data); state[x.destination]=hash(data);
  }
  await fs.mkdir(path.dirname(statePath),{recursive:true}); await fs.writeFile(statePath,JSON.stringify(state,null,2)+'\n');
  console.log('同步完成；没有删除任何站点文件。');
}
main().catch(e=>{ console.error(e.message); process.exitCode=1; });