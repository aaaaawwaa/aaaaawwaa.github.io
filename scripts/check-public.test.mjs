import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const script=path.join(import.meta.dirname,'check-public.mjs');
test('scanner blocks credentials without printing them and accepts ordinary notes',async t=>{
  const root=await mkdtemp(path.join(tmpdir(),'wiki-scan-')); t.after(()=>rm(root,{recursive:true,force:true}));
  const content=path.join(root,'content'); await mkdir(content);
  await writeFile(path.join(content,'safe.md'),'# 通信原理\n安全的示例内容');
  await writeFile(path.join(content,'map.canvas'),'{"nodes":[],"edges":[]}');
  await writeFile(path.join(content,'table.base'),'views: []');
  const run=()=>spawnSync(process.execPath,[script,'--content',content],{encoding:'utf8'});
  assert.equal(run().status,0);
  const secret='ghp_'+'Z'.repeat(36); await writeFile(path.join(content,'leak.md'),secret);
  const result=run(); assert.notEqual(result.status,0); assert.ok(!(result.stdout+result.stderr).includes(secret));
});
test('scanner blocks PDF and private frontmatter',async t=>{
  const root=await mkdtemp(path.join(tmpdir(),'wiki-scan-')); t.after(()=>rm(root,{recursive:true,force:true}));
  await writeFile(path.join(root,'draft.md'),'---\nprivate: true\n---\n# 内容');
  await writeFile(path.join(root,'book.pdf'),'sample');
  const result=spawnSync(process.execPath,[script,'--content',root],{encoding:'utf8'});
  assert.notEqual(result.status,0); assert.match(result.stdout,/draft.md/); assert.match(result.stdout,/book.pdf/);
});
