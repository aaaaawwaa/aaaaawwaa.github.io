import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
test('render check rejects visible KaTeX errors and accepts rendered formulas', async t=>{
 const dir=await mkdtemp(path.join(tmpdir(),'wiki-math-'));
 t.after(()=>rm(dir,{recursive:true,force:true}));
 const script=path.join(import.meta.dirname,'check-math-render.mjs');
 await writeFile(path.join(dir,'a.html'),'<span class="katex">x</span>');
 assert.equal(spawnSync(process.execPath,[script,dir]).status,0);
 await writeFile(path.join(dir,'b.html'),'<span class="katex-error" title="bad">broken</span>');
 const result=spawnSync(process.execPath,[script,dir],{encoding:'utf8'});
 assert.equal(result.status,1);
 assert.match(result.stdout,/b\.html/);
});