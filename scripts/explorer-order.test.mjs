import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import yaml from 'js-yaml'

const config = yaml.load(fs.readFileSync(new URL('../quartz.config.yaml', import.meta.url), 'utf8'))
const explorer = config.plugins.find((entry) => entry.source === 'github:quartz-community/explorer')
const manifest = JSON.parse(fs.readFileSync(new URL('../public-notes.json', import.meta.url), 'utf8'))

function sorter() {
  assert.equal(typeof explorer?.options?.sortFn, 'string', 'Explorer needs a chapter-aware sort function')
  // The Explorer client evaluates this same function string when it builds the tree.
  return new Function('a', 'b', 'return (' + explorer.options.sortFn + ')(a, b)')
}

test('complex analysis chapters follow the published source order', () => {
  const entries = manifest.files
    .filter((entry) => entry.destination.startsWith('vault-notes/math/complex-analysis/'))
    .map((entry) => ({
      slugSegment: entry.destination.split('/').pop().replace(/\.md$/, ''),
      displayName: entry.source.split('/').pop().replace(/^\d+\.\s*/, '').replace(/\.md$/, ''),
      isFolder: false,
    }))
    .reverse()
  assert.deepEqual(entries.sort(sorter()).map((entry) => entry.slugSegment.slice(0, 2)),
    ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'])
})

test('folders stay first; unnumbered notes use natural title order', () => {
  const nodes = [
    { slugSegment: 'other', displayName: '笔记10', isFolder: false },
    { slugSegment: '01-intro', displayName: '绪论', isFolder: false },
    { slugSegment: 'a', displayName: '笔记2', isFolder: false },
    { slugSegment: '5g', displayName: '5G', isFolder: true },
  ]
  assert.deepEqual(nodes.sort(sorter()).map((node) => node.slugSegment), ['5g', '01-intro', 'a', 'other'])
})
