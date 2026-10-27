#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function scanText(text) {
  const hits=[];
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text)) hits.push('私钥');
  if (/\b(?:ghp_|github_pat_|sk-proj-|sk-)[A-Za-z0-9_-]{20,}\b/.test(text)) hits.push('令牌');
  if (/\bAKIA[0-9A-Z]{16}\b/.test(text)) hits.push('AWS 密钥标识');
  if (/\b(?:api[_-]?key|access[_-]?token|password|secret)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{20,}/i.test(text)) hits.push('凭据赋值');
  const frontmatter=text.match(/^---\s*\n([\s\S]*?)\n---(?:\s|$)/)?.[1] || '';
  if (/^\s*(?:private|draft)\s*:\s*true\s*$/im.test(frontmatter) || /^\s*publish\s*:\s*false\s*$/im.test(frontmatter)) hits.push('私人或草稿标记');
  return hits;
}
export function unsafeSvg(text) {
  return /<script\b|\bon\w+\s*=|<foreignObject\b|@import|(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|javascript:|data:)/i.test(text);
}

async function run() {
  const args=process.argv.slice(2); if(args.length!==2||args[0]!=='--content') throw new Error('用法：node check-public.mjs --content <content目录>');
  const root=await fs.realpath(args[1]), findings=[]; let count=0;
  async function walk(dir) {
    for(const entry of await fs.readdir(dir,{withFileTypes:true})) {
      const full=path.join(dir,entry.name), rel=path.relative(root,full).replaceAll('\\','/');
      if(entry.isSymbolicLink()){findings.push({file:rel,type:'符号链接'});continue;}
      if(entry.name.startsWith('.')||/^(?:private|_drafts|_vault-raw)$/i.test(entry.name)){findings.push({file:rel,type:'隐藏或私有路径'});continue;}
      if(entry.isDirectory()){await walk(full);continue;}
      if(!entry.isFile()){findings.push({file:rel,type:'特殊文件'});continue;}
      count++; const ext=path.extname(entry.name).toLowerCase();
      if(!['.md','.canvas','.base','.png','.jpg','.jpeg','.gif','.webp','.svg'].includes(ext)){findings.push({file:rel,type:'未允许的文件类型'});continue;}
      if(['.md','.canvas','.base'].includes(ext)) for(const type of scanText(await fs.readFile(full,'utf8')))findings.push({file:rel,type});
      if(ext==='.svg'&&unsafeSvg(await fs.readFile(full,'utf8')))findings.push({file:rel,type:'SVG 含活动内容或外部引用'});
    }
  }
  await walk(root); console.log(JSON.stringify({files:count,findings},null,2));
  if(findings.length)process.exitCode=1;
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url) run().catch(e=>{console.error(e.message);process.exitCode=1;});
