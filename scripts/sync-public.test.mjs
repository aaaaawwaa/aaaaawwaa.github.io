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

test('explicit images are copied and embedded references are rewritten', async t => {
  const f=await fixture(t); await mkdir(path.join(f.vault,'assets')); await writeFile(path.join(f.vault,'a.md'),'![[图.svg|600]]');
  await writeFile(path.join(f.vault,'assets/图.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  await manifest(f,[{source:'a.md',destination:'vault-notes/a.md'}],[{source:'assets/图.svg',destination:'vault-notes/assets/diagram.svg'}]);
  const result=run(f,true); assert.equal(result.status,0,result.stderr);
  assert.match(await readFile(path.join(f.content,'vault-notes/a.md'),'utf8'),/!\[\[vault-notes\/assets\/diagram.svg\|600\]\]/);
});
