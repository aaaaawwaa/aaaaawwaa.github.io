#!/usr/bin/env node
/**
 * scripts/check-links-source.mjs
 * -----------------------------------------------------------------------------
 * 源码级链接检查：不依赖构建产物，直接校验 content/ 里 Markdown 的链接目标。
 *
 * 与 audit-site.mjs 的区别：
 *   - audit-site.mjs 检查的是「构建后 HTML 里的 href 能否解析到文件」；
 *   - 本脚本检查的是「作者写的链接目标本身是否与文件名逐字符一致（大小写敏感）」。
 *
 * 为什么需要它：Quartz 5.0.0 的链接生成在不同插件来源下行为不同
 * （本地 npm 预构建版会把 slug 转小写，CI 从源码构建的版本保持原大小写），
 * 只依赖构建产物检查会出现「本地通过、CI 404」的情况。
 * 因此作者书写的目标必须与磁盘上的真实文件名完全一致（本项目统一小写 kebab-case）。
 *
 * 用法：node scripts/check-links-source.mjs
 * 退出码：0 = 全部可解析；1 = 存在问题。
 * -----------------------------------------------------------------------------
 */
import fs from "node:fs"
import path from "node:path"

const CONTENT = path.resolve(process.cwd(), "content")

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name.startsWith(".")) continue
      out.push(...walk(full))
    } else if (entry.isFile()) out.push(full)
  }
  return out
}

if (!fs.existsSync(CONTENT)) {
  console.error("content/ 不存在")
  process.exit(1)
}

const files = walk(CONTENT)
const rels = files.map((f) => path.relative(CONTENT, f).split(path.sep).join("/"))
const mdSet = new Set(rels.filter((r) => r.endsWith(".md")))
const fileSet = new Set(rels)
// 建立 basename（不含扩展名）到完整路径的映射，用于解析 shortest 形式的双链
const baseSet = new Set(rels.filter((r) => r.endsWith(".md")).map((r) => path.basename(r, ".md")))

function stripCode(line) {
  return line.replace(/`[^`]*`/g, "")
}

const problems = []
let checked = 0

for (const rel of rels.filter((r) => r.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(CONTENT, rel), "utf8")
  const lines = raw.split(/\r?\n/)
  let inFence = false
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return
    }
    if (inFence) return
    const clean = stripCode(line)
    // [[target#anchor|alias]]
    for (const m of clean.matchAll(/\[\[([^\]]+?)\]\]/g)) {
      const inner = m[1]
      // 表格内的双链会用 \| 转义竖线，解析时需去掉末尾反斜杠
      const target = inner.split("|")[0].replace(/\\$/, "").split("#")[0].trim()
      if (!target) continue
      checked++
      // 附件型双链（图片、SVG 时序图）直接指向 content 内真实文件
      if (fileSet.has(target)) continue
      const withExt = target.endsWith(".md") ? target : target + ".md"
      if (mdSet.has(withExt)) continue
      if (baseSet.has(path.basename(withExt, ".md"))) continue
      // 大小写不敏感地找一下，区分「断链」与「仅大小写不一致」
      const lower = withExt.toLowerCase()
      const caseOnly = rels.find((r) => r.toLowerCase() === lower)
      problems.push({
        page: rel,
        line: i + 1,
        target,
        reason: caseOnly ? `仅大小写不一致（磁盘文件为 ${caseOnly}）` : "目标不存在",
      })
    }
    // 相对路径 Markdown 链接 ../x/y.md 或 ./x/y.md
    for (const m of clean.matchAll(/\]\(([^)\s]+)\)/g)) {
      const href = m[1]
      if (/^(?:https?:|mailto:|#|data:)/.test(href)) continue
      const cleanHref = href.split("#")[0].split("?")[0]
      if (!cleanHref) continue
      checked++
      let decoded = cleanHref
      try { decoded = decodeURIComponent(cleanHref) } catch { /* keep */ }
      const resolved = decoded.startsWith("/")
        ? decoded.slice(1)
        : path.posix.normalize(path.posix.join(path.posix.dirname(rel), decoded))
      // Quartz 对 "vault-notes/assets/x.svg" 这类写法按 content 根路径解析，
      // 因此同时尝试「根路径相对」与「文件所在目录相对」两种解释
      const rootRel = decoded.replace(/^\.\//, "").replace(/^\/+/, "")
      const candidates = [
        rootRel,
        rootRel + ".md",
        rootRel.replace(/\/$/, "") + "/index.md",
        resolved,
        resolved + ".md",
        resolved.replace(/\/$/, "") + "/index.md",
      ]
      if (candidates.some((c) => mdSet.has(c) || fileSet.has(c))) continue
      const lower = resolved.toLowerCase()
      const caseOnly = rels.find((r) => r.toLowerCase() === lower)
      problems.push({
        page: rel,
        line: i + 1,
        target: href,
        reason: caseOnly ? `仅大小写不一致（磁盘文件为 ${caseOnly}）` : "目标不存在",
      })
    }
  })
}

console.log("=== 源码级链接检查（大小写敏感） ===")
console.log(`Markdown 文件: ${rels.filter((r) => r.endsWith(".md")).length} | 链接: ${checked} | 问题: ${problems.length}`)
if (problems.length > 0) {
  for (const p of problems.slice(0, 40)) {
    console.log(`  ${p.page}:${p.line}  ->  ${p.target}  （${p.reason}）`)
  }
  if (problems.length > 40) console.log(`  …… 其余 ${problems.length - 40} 条省略`)
  process.exitCode = 1
} else {
  console.log("全部链接目标与磁盘文件名逐字符一致。")
}