#!/usr/bin/env node
/**
 * scripts/audit-site.mjs
 * -----------------------------------------------------------------------------
 * 对 Quartz 构建产物做静态自检（不需要浏览器）：
 *   1. 统计页面数量；
 *   2. 检查站内链接与静态资源是否存在（断链检查，兼容 Quartz 5 的 clean URL 形式）；
 *   3. 检查全文搜索/知识图谱共用的内容索引是否生成、是否包含中文；
 *   4. 统计 Mermaid、LaTeX、代码块、表格、Callout 等富内容的渲染数量；
 *   5. 检查 RSS / sitemap 是否生成。
 *
 * 用法：
 *   node scripts/audit-site.mjs                # 检查 public/
 *   node scripts/audit-site.mjs --dir public --strict
 * -----------------------------------------------------------------------------
 */
import fs from "node:fs"
import path from "node:path"

const args = process.argv.slice(2)
const dirArg = args.includes("--dir") ? args[args.indexOf("--dir") + 1] : "public"
const strict = args.includes("--strict")
const PUBLIC = path.resolve(process.cwd(), dirArg)

if (!fs.existsSync(PUBLIC)) {
  console.error(`FAIL: output directory not found: ${PUBLIC}`)
  process.exit(1)
}

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const files = walk(PUBLIC)
const fileSet = new Set(files.map((f) => path.relative(PUBLIC, f).replace(/\\/g, "/")))
const htmlFiles = files.filter((f) => f.endsWith(".html"))

const stats = {
  pages: htmlFiles.length,
  files: files.length,
  brokenLinks: [],
  externalLinks: 0,
  internalLinks: 0,
  anchors: 0,
  mermaid: 0,
  katex: 0,
  codeBlocks: 0,
  tables: 0,
  callouts: 0,
  chinesePages: 0,
}

const LINK_RE = /(?:href|src)="([^"]+)"/g

function resolveTarget(rel, clean) {
  // 模拟浏览器 URL 解析：超出站点根目录的 ".." 会被钳制在根，而不是保留成上级相对路径
  const isAbsolute = clean.startsWith("/")
  const stripped = clean.replace(/^\/+/, "").replace(/\/+$/, "")
  if (stripped === "") return "index.html" // 指向站点根目录
  const segments = isAbsolute ? [] : path.posix.dirname(rel).split("/").filter((s) => s && s !== ".")
  for (const part of stripped.split("/")) {
    if (!part || part === ".") continue
    if (part === "..") segments.pop()
    else segments.push(part)
  }
  const joined = segments.join("/")
  if (joined === "" || joined === ".") return "index.html"
  return joined
}

function candidatesFor(target, isDirHint) {
  const cands = [target]
  if (isDirHint) cands.unshift(target.replace(/\/+$/, "") + "/index.html")
  cands.push(target + ".html")
  cands.push(target.replace(/\/+$/, "") + "/index.html")
  cands.push(target.replace(/\/+$/, "") + "/index.html".replace("/index.html", ".html"))
  return cands
}

for (const file of htmlFiles) {
  const rel = path.relative(PUBLIC, file).replace(/\\/g, "/")
  const html = fs.readFileSync(file, "utf8")
  stats.mermaid += (html.match(/class="[^"]*mermaid[^"]*"/g) ?? []).length
  stats.katex += (html.match(/class="katex[ "]/g) ?? []).length
  stats.codeBlocks += (html.match(/data-rehype-pretty-code-figure/g) ?? []).length
  stats.tables += (html.match(/<table/g) ?? []).length
  stats.callouts += (html.match(/class="callout[ "]/g) ?? []).length
  if (/[\u4e00-\u9fa5]/.test(html)) stats.chinesePages++

  for (const match of html.matchAll(LINK_RE)) {
    let href = match[1]
    if (!href || href.startsWith("data:") || href.startsWith("mailto:") || href.startsWith("javascript:")) continue
    if (href.startsWith("#")) {
      stats.anchors++
      continue
    }
    if (/^https?:\/\//i.test(href)) {
      stats.externalLinks++
      continue
    }
    stats.internalLinks++
    const clean = href.split("#")[0].split("?")[0]
    if (!clean) {
      stats.anchors++
      continue
    }
    let decoded = clean
    try {
      decoded = decodeURIComponent(clean)
    } catch {
      /* keep raw */
    }
    const target = resolveTarget(rel, decoded)
    const isDirHint = decoded.endsWith("/") || decoded.endsWith("/.") || decoded === ".." || decoded === "."
    const ok = candidatesFor(target, isDirHint).some((c) => fileSet.has(c))
    if (!ok) stats.brokenLinks.push({ page: rel, href })
  }
}

// 全文搜索与知识图谱共用 static/contentIndex.json（Quartz 5 客户端按此构建索引）
const indexFile = ["static/contentIndex.json", "contentIndex.json", "static/searchIndex.json", "searchIndex.json"].find((f) =>
  fileSet.has(f),
)
let indexEntries = 0
let indexHasChinese = false
if (indexFile) {
  const raw = fs.readFileSync(path.join(PUBLIC, indexFile), "utf8")
  try {
    const json = JSON.parse(raw)
    indexEntries = Object.keys(json).length
  } catch {
    /* ignore */
  }
  indexHasChinese = /[\u4e00-\u9fa5]/.test(raw)
}

const checks = [
  ["页面数量 > 0", stats.pages > 0, `${stats.pages} 个 HTML 页面`],
  ["站内断链为 0", stats.brokenLinks.length === 0, `${stats.brokenLinks.length} 个断链`],
  ["内容索引存在（搜索 + 图谱）", Boolean(indexFile), indexFile ?? "未找到 contentIndex.json"],
  ["内容索引包含中文", indexHasChinese, `索引条目 ${indexEntries} 条`],
  ["Mermaid 图已渲染", stats.mermaid > 0, `${stats.mermaid} 处 mermaid 容器`],
  ["LaTeX 公式已渲染", stats.katex > 0, `${stats.katex} 处 katex 标记`],
  ["代码块已高亮", stats.codeBlocks > 0, `${stats.codeBlocks} 个代码块`],
  ["中文页面正常", stats.chinesePages > 0, `${stats.chinesePages}/${stats.pages} 个页面含中文`],
  ["RSS 已生成", fileSet.has("index.xml"), "index.xml"],
  ["sitemap 已生成", fileSet.has("sitemap.xml"), "sitemap.xml"],
]

console.log("=== LumenTrace Wiki 构建产物自检 ===")
console.log(`输出目录: ${PUBLIC}`)
console.log("")
for (const [name, ok, detail] of checks) {
  console.log(`${ok ? "[PASS]" : "[FAIL]"} ${name} — ${detail}`)
}
console.log("")
console.log("--- 统计 ---")
console.log(`页面: ${stats.pages} | 文件: ${stats.files} | 站内链接: ${stats.internalLinks} | 外链: ${stats.externalLinks} | 锚点: ${stats.anchors}`)
console.log(`Mermaid: ${stats.mermaid} | KaTeX: ${stats.katex} | 代码块: ${stats.codeBlocks} | 表格: ${stats.tables} | Callout: ${stats.callouts}`)

if (stats.brokenLinks.length > 0) {
  console.log("")
  console.log("--- 断链明细（最多 40 条）---")
  for (const b of stats.brokenLinks.slice(0, 40)) console.log(`  ${b.page} -> ${b.href}`)
}

const failed = checks.filter(([, ok]) => !ok)
if (failed.length > 0 || (strict && stats.brokenLinks.length > 0)) process.exitCode = 1
