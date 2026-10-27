import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const script = path.join(import.meta.dirname, 'sync-public.mjs');
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'wiki-sync-'));
  t.after(() => rm(root, {recursive:true, force:true}));
  const vault=path.join(root,'vault'), site=path.join(root,'site'), content=path.join(site,'content');
  await mkdir(vault); await mkdir(content,{recursive:true});
  return {root,vault,site,content, manifest:path.join(root,'manifest.json')};
}
function run(f, apply=false) {
  return spawnSync(process.execPath, [script,'--vault',f.vault,'--site',f.site,'--manifest',f.manifest,...(apply?['--apply']:[])], {encoding:'utf8'});
}
async function manifest(f, files, assets=[]) { await writeFile(f.manifest,JSON.stringify({version:1,files,assets})); }

test('preview is read-only; apply publishes explicit files and rewrites mapped wikilinks', async t => {
  const f=await fixture(t); await writeFile(path.join(f.vault,'first.md'),'# 开始\n[[第二篇|继续]]');
  await writeFile(path.join(f.vault,'第二篇.md'),'# 正文');
  await manifest(f,[{source:'first.md',destination:'vault-notes/first.md'},{source:'第二篇.md',destination:'vault-notes/second.md'}]);
  let r=run(f); assert.equal(r.status,0,r.stderr); await assert.rejects(access(path.join(f.content,'vault-notes')));
  r=run(f,true); assert.equal(r.status,0,r.stderr);
  assert.match(await readFile(path.join(f.content,'vault-notes/first.md'),'utf8'), /\[\[vault-notes\/second\|继续\]\]/);
  assert.equal(await readFile(path.join(f.vault,'first.md'),'utf8'),'# 开始\n[[第二篇|继续]]');
  r=run(f,true); assert.equal(r.status,0,r.stderr);
});

test('unresolved links and missing attachments prevent apply without creating output', async t => {
  const f=await fixture(t); await writeFile(path.join(f.vault,'a.md'),'[[未知]]\n![[missing.png]]');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}]);
  const preview=run(f); assert.equal(preview.status,0); assert.match(preview.stdout,/unresolved/i);
  const applied=run(f,true); assert.notEqual(applied.status,0); await assert.rejects(access(path.join(f.content,'vault-notes')));
});

test('rejects traversal and refuses overwrite of an unrelated target', async t => {
  const f=await fixture(t); await writeFile(path.join(f.vault,'a.md'),'hello');
  await manifest(f,[{source:'../outside.md',destination:'vault-notes/a.md'}]); assert.notEqual(run(f,true).status,0);
  await mkdir(path.join(f.content,'vault-notes')); await writeFile(path.join(f.content,'vault-notes/a.md'),'existing');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}]); assert.notEqual(run(f,true).status,0);
  assert.equal(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),'existing');
});

test('secrets are blocked without echoing their values', async t => {
  const f=await fixture(t); const secret='ghp_'+'A'.repeat(36); await writeFile(path.join(f.vault,'a.md'),`credential: ${secret}`);
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}]); const result=run(f,true);
  assert.notEqual(result.status,0); assert.ok(!(result.stdout+result.stderr).includes(secret));
});

test('manual edits to a previously synced file block a later update', async t => {
  const f=await fixture(t); await writeFile(path.join(f.vault,'a.md'),'one');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}]);
  assert.equal(run(f,true).status,0);
  await writeFile(path.join(f.content,'vault-notes/a.md'),'manual edit');
  await writeFile(path.join(f.vault,'a.md'),'updated');
  assert.notEqual(run(f,true).status,0);
  assert.equal(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),'manual edit');
});

test('refuses to write when the site content directory is inside the original vault', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'content')); await writeFile(path.join(f.vault,'a.md'),'one');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}]); f.site=f.vault;
  const result=run(f,true); assert.notEqual(result.status,0);
  await assert.rejects(access(path.join(f.vault,'content/vault-notes/a.md')));
});

test('matches an explicit full path with .md even when basenames are duplicated', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'left')); await mkdir(path.join(f.vault,'right'));
  await writeFile(path.join(f.vault,'a.md'),'[[left/same.md|具体笔记]]');
  await writeFile(path.join(f.vault,'left/same.md'),'left'); await writeFile(path.join(f.vault,'right/same.md'),'right');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'},{source:'left/same.md',destination:'vault-notes/left.md'},{source:'right/same.md',destination:'vault-notes/right.md'}]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  assert.match(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),/\[\[vault-notes\/left\|具体笔记\]\]/);
});

test('explicit images are copied and embedded references are rewritten', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'assets')); await writeFile(path.join(f.vault,'a.md'),'![[图.svg|600]]');
  await writeFile(path.join(f.vault,'assets/图.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}],[{source:'assets/图.svg',destination:'vault-notes/assets/diagram.svg'}]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  assert.match(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),/!\[[^\]]*\]\(vault-notes\/assets\/diagram\.svg\)/, 'SVG 嵌入改为站点内图片路径');
});
test('unresolvedPolicy text converts unpublished links to readable text and allows apply', async t => {
  const f=await fixture(t);
  const original='# 标题\n[[未发布笔记|标签文字]]\n[[另一篇]]\n![[missing.png]]\n';
  await writeFile(path.join(f.vault,'a.md'), original);
  await writeFile(f.manifest, JSON.stringify({version:1,unresolvedPolicy:'text',files:[{source:'a.md',destination:'vault-notes/a.md'}],assets:[]}));
  const preview=run(f); assert.equal(preview.status,0,preview.stderr);
  const parsed=JSON.parse(preview.stdout);
  assert.equal(parsed.policy,'text');
  assert.equal(parsed.converted.length,3);
  assert.equal(run(f,true).status,0);
  const out=await readFile(path.join(f.content,'vault-notes/a.md'),'utf8');
  assert.match(out,/标签文字/);
  assert.ok(!out.includes('[['),'未解析链接不应保留 [[ ]] 语法');
  assert.match(out,/图片未随站点发布：missing\.png/);
  assert.equal(await readFile(path.join(f.vault,'a.md'),'utf8'), original,'原始 Vault 笔记不得被修改');
});
test('plain wikilinks to explicit assets are rewritten to asset destinations', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'assets'));
  await writeFile(path.join(f.vault,'a.md'),'见表 [[assets/x.svg|示意图]]');
  await writeFile(path.join(f.vault,'assets/x.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}],[{source:'assets/x.svg',destination:'vault-notes/assets/x.svg'}]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  assert.match(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),/\[\[vault-notes\/assets\/x\.svg\|示意图\]\]/);
});
test('escaped pipe inside table wikilinks is preserved', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'assets'));
  await writeFile(path.join(f.vault,'a.md'),'| 图 | 说明 |\n| --- | --- |\n| [[assets/x.svg\\|示意图]] | 说明 |\n');
  await writeFile(path.join(f.vault,'assets/x.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}],[{source:'assets/x.svg',destination:'vault-notes/assets/x.svg'}]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  const out=await readFile(path.join(f.content,'vault-notes/a.md'),'utf8');
  assert.match(out,/\[\[vault-notes\/assets\/x\.svg\\\|示意图\]\]/, '表格中的转义竖线必须保留');
});

test('svg embeds become markdown images; png embeds stay wikilink embeds', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'assets'));
  await writeFile(path.join(f.vault,'a.md'),'![[assets/x.svg|600]]\n\n![[assets/y.png|400]]\n');
  await writeFile(path.join(f.vault,'assets/x.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await writeFile(path.join(f.vault,'assets/y.png'),'png');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}],[
    {source:'assets/x.svg',destination:'vault-notes/assets/x.svg'},
    {source:'assets/y.png',destination:'vault-notes/assets/y.png'},
  ]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  const out=await readFile(path.join(f.content,'vault-notes/a.md'),'utf8');
  assert.match(out,/!\[[^\]]*\]\(vault-notes\/assets\/x\.svg\)/, 'SVG 应渲染为站点内图片路径');
  assert.match(out,/!\[\[vault-notes\/assets\/y\.png\|400\]\]/, 'PNG 仍用 wikilink 嵌入');
});
