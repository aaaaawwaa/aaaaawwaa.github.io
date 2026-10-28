import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT = fileURLToPath(new URL('./build-folder-indexes.mjs', import.meta.url))
const NL = String.fromCharCode(10)

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'folder-index-'))
  const content = path.join(root, 'content')
  fs.mkdirSync(path.join(content, 'vault-notes'), { recursive: true })
  return { root, content, mapping: path.join(root, 'folder-titles.json') }
}

function writeNote(content, rel, title) {
  const file = path.join(content, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, ['---', 'title: ' + title, '---', '', '正文', ''].join(NL))
}

function writeManualRoot(content, title) {
  fs.writeFileSync(path.join(content, 'vault-notes', 'index.md'), ['---', 'title: ' + title, '---', ''].join(NL))
}

function writeMapping(file, folders) {
  fs.writeFileSync(file, JSON.stringify({ version: 1, folders }))
}

function run(args, cwd) {
  return spawnSync(process.execPath, [SCRIPT].concat(args), { cwd, encoding: 'utf8' })
}

function baseMapping(extra) {
  return Object.assign({
    'vault-notes': { title: '学习笔记库', manual: true, source: '聚合', description: '入口' },
  }, extra || {})
}

test('covers every visible directory and fails on missing mapping', () => {
  const f = fixture()
  writeNote(f.content, 'vault-notes/a/b/note.md', '笔记')
  writeManualRoot(f.content, '学习笔记库')
  // 只登记深层目录，父目录缺失：既应报缺映射，也应报父目录未映射（面包屑会残留英文）
  writeMapping(f.mapping, baseMapping({ 'vault-notes/a/b': { title: 'B 目录', source: 'B', description: 'B' } }))
  const result = run(['--check', '--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /缺少目录映射: vault-notes\/a$|缺少目录映射: vault-notes\/a\r?$/m)
  assert.match(result.stderr, /父目录未映射/)
})

test('generates Chinese titles, is idempotent and detects stale output', () => {
  const f = fixture()
  writeNote(f.content, 'vault-notes/x/00-guide.md', '测试导读')
  writeNote(f.content, 'vault-notes/x/01-note.md', '测试笔记')
  writeManualRoot(f.content, '学习笔记库')
  writeMapping(f.mapping, baseMapping({
    'vault-notes/x': { title: '测试目录', source: '测试源', description: '测试说明' },
  }))
  const first = run(['--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(first.status, 0, first.stderr)
  const indexFile = path.join(f.content, 'vault-notes', 'x', 'index.md')
  const text = fs.readFileSync(indexFile, 'utf8')
  assert.match(text, /^title: 测试目录$/m)
  assert.match(text, /\[\[vault-notes\/x\/00-guide\|测试导读\]\]/)
  assert.match(text, /本目录对应 Obsidian 源库中的「测试源」/)
  const again = run(['--check', '--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(again.status, 0, again.stderr)
  writeMapping(f.mapping, baseMapping({
    'vault-notes/x': { title: '改名后', source: '测试源', description: '测试说明' },
  }))
  const stale = run(['--check', '--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(stale.status, 1)
  assert.match(stale.stderr, /需要运行/)
})

test('refuses to overwrite a manual directory page', () => {
  const f = fixture()
  writeNote(f.content, 'vault-notes/y/note.md', '笔记')
  writeManualRoot(f.content, '学习笔记库')
  const manual = path.join(f.content, 'vault-notes', 'y', 'index.md')
  fs.writeFileSync(manual, ['---', 'title: 人工页', '---', '', '手工内容', ''].join(NL))
  writeMapping(f.mapping, baseMapping({ 'vault-notes/y': { title: 'Y 目录', source: 'Y', description: 'Y' } }))
  const result = run(['--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /拒绝覆盖人工维护的目录页/)
  assert.match(fs.readFileSync(manual, 'utf8'), /手工内容/)
})

test('manual root page title must match mapping', () => {
  const f = fixture()
  writeNote(f.content, 'vault-notes/z/note.md', '笔记')
  writeManualRoot(f.content, '错误标题')
  writeMapping(f.mapping, baseMapping({ 'vault-notes/z': { title: 'Z 目录', source: 'Z', description: 'Z' } }))
  const result = run(['--check', '--content', f.content, '--mapping', f.mapping], f.root)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /人工入口页标题不符/)
})
