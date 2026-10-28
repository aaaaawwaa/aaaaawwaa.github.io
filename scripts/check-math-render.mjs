import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'public');
let pages=0, errors=0;
async function walk(dir){
 for(const item of await fs.readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory())await walk(file);
  else if(item.isFile()&&item.name.endsWith('.html')){
   pages++;
   const html=await fs.readFile(file,'utf8');
   const count=(html.match(/class=["'][^"']*\bkatex-error\b[^"']*["']/g)||[]).length;
   if(count){errors+=count;console.log(`${path.relative(root,file)}: ${count} KaTeX errors`);}
  }
 }
}
await walk(root);
console.log(`Math render check: ${pages} pages, ${errors} errors`);
if(!pages||errors)process.exitCode=1;