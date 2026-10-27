#!/usr/bin/env node
/**
 * scripts/provision-plugins.ts
 * -----------------------------------------------------------------------------
 * Quartz 5 的插件默认通过 `npx quartz plugin install` 从 GitHub 克隆源码并本地构建。
 * 在无法稳定访问 GitHub 的网络环境下（例如中国大陆直连），该流程会长时间卡住或失败。
 *
 * 本脚本提供一个**等价的离线备选方案**：
 *   1. 读取 quartz.config.yaml 中所有 github:quartz-community/<name> 插件；
 *   2. 从 npm 仓库获取同名官方插件包（内容为构建好的 dist/，由同一仓库发布）；
 *   3. 解包到 .quartz/plugins/<name>，并初始化一个本地 git 仓库，
 *      让 Quartz 的安装器认为插件已就绪（否则每次构建都会尝试克隆并等待超时）；
 *   4. 调用 Quartz 官方 regeneratePluginIndex() 生成 .quartz/plugins/index.ts。
 *
 * 使用前提：网络可以访问 npm registry（本项目默认使用 npmmirror 镜像）。
 * 在 GitHub 可正常访问的环境中，直接使用 npx quartz plugin install 即可，无需本脚本。
 *
 * 用法：
 *   npx tsx scripts/provision-plugins.ts            # 增量补齐缺失插件
 *   npx tsx scripts/provision-plugins.ts --force    # 全部重新拉取
 * -----------------------------------------------------------------------------
 */
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { execFileSync, execSync } from "node:child_process"
import YAML from "yaml"
import { regeneratePluginIndex } from "../quartz/plugins/loader/gitLoader"

const ROOT = process.cwd()
const PLUGINS_DIR = path.join(ROOT, ".quartz", "plugins")
const CONFIG_PATH = path.join(ROOT, "quartz.config.yaml")
const PREFIX = "github:quartz-community/"
const force = process.argv.includes("--force")

interface PluginEntry {
  source: string
  enabled?: boolean
}

function readPluginNames(): string[] {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8")
  const json = YAML.parse(raw) as { plugins?: PluginEntry[] }
  const names = new Set<string>()
  for (const entry of json.plugins ?? []) {
    if (typeof entry.source === "string" && entry.source.startsWith(PREFIX)) {
      names.add(entry.source.slice(PREFIX.length).split("#")[0])
    }
  }
  return [...names].sort()
}

function git(cwd: string, args: string[]) {
  execFileSync("git", args, { cwd, stdio: "ignore", env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } })
}

function initLocalGitRepo(dir: string, name: string) {
  // 让 Quartz 安装器的 resolveRef 成功，从而跳过 GitHub 克隆
  git(dir, ["init", "-q"])
  git(dir, ["add", "-A"])
  git(dir, [
    "-c", "user.name=LumenTrace",
    "-c", "user.email=lumentrace@local",
    "commit", "-q", "-m", `provision: ${name} from npm`,
  ])
}

function provision(name: string) {
  const dir = path.join(PLUGINS_DIR, name)
  const distEntry = path.join(dir, "dist", "index.js")
  if (!force && fs.existsSync(distEntry) && fs.existsSync(path.join(dir, ".git"))) {
    console.log(`  = ${name}: already provisioned`)
    return true
  }

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "quartz-plugin-"))
  try {
    const spec = `@quartz-community/${name}@latest`
    const packed = execSync(`npm pack ${spec} --pack-destination "${tmp}" --silent`, {
      cwd: ROOT,
      encoding: "utf-8",
    })
      .trim()
      .split(/\r?\n/)
      .pop() as string
    const tgz = path.join(tmp, packed)
    if (!fs.existsSync(tgz)) throw new Error(`npm pack produced no tarball for ${spec}`)

    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })
    fs.mkdirSync(dir, { recursive: true })
    execSync(`tar -xzf "${tgz}" -C "${dir}" --strip-components=1`, { stdio: "ignore" })
    if (!fs.existsSync(distEntry)) throw new Error("tarball has no dist/index.js")

    initLocalGitRepo(dir, name)
    console.log(`  + ${name}: provisioned from npm`)
    return true
  } catch (err) {
    console.log(`  x ${name}: ${err instanceof Error ? err.message : String(err)}`)
    return false
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}

async function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error("quartz.config.yaml not found; run this script from the project root.")
    process.exit(1)
  }
  const names = readPluginNames()
  console.log(`Provisioning ${names.length} Quartz plugin(s) from npm...`)
  fs.mkdirSync(PLUGINS_DIR, { recursive: true })

  let ok = 0
  for (const name of names) {
    if (provision(name)) ok++
  }

  await regeneratePluginIndex({ verbose: true })
  console.log(`\nDone: ${ok}/${names.length} plugins provisioned.`)
  if (ok !== names.length) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
