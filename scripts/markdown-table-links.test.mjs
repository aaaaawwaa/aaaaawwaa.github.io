import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// GFM 表格单元格里的 [[目标|别名]] 必须把竖线转义成 \|，否则整行被拆列、链接不会生成。
function findBrokenTableLinks(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const problems = [];
  let inFence = false;
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    if (!/^\s*\|/.test(line)) return;
    const matches = line.match(/\[\[[^\]]+\]\]/g) || [];
    for (const match of matches) {
      const inner = match.slice(2, -2);
      const pipe = inner.indexOf("|");
      if (pipe >= 0 && inner[pipe - 1] !== "\\") {
        problems.push(path.relative(repoRoot, file) + ":" + (index + 1) + " 未转义表格双链: " + match);
      }
    }
  });
  return problems;
}

test("table cells never contain unescaped wikilink aliases", () => {
  const problems = walk(contentRoot).flatMap(findBrokenTableLinks);
  assert.deepEqual(problems, [], problems.join("\n"));
});

test("the detector catches an unescaped alias (self-check)", () => {
  const tmp = path.join(fs.mkdtempSync(path.join(path.dirname(contentRoot), ".table-link-")), "sample.md");
  fs.writeFileSync(tmp, "| 关系 | 说明 |\n| --- | --- |\n| a | 见 [[x/y|别名]] |\n| b | 见 [[x/z\\|别名]] |\n");
  const problems = findBrokenTableLinks(tmp);
  assert.equal(problems.length, 1, JSON.stringify(problems));
  assert.match(problems[0], /x\/y\|别名/);
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
});
