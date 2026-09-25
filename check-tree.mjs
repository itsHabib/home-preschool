// Validate plan structure and count distinct activity opportunities, never mastery.
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('.', import.meta.url))
const fields = ['Parent', 'Serves', 'Goal', 'Exit check', 'Children', 'Constraints inherited', 'Open questions']
const ids = (s = '') => s.match(/\b(?:[RNLMT]\d+|U\d+|W\d+(?:-D\d+)?)\b/g) ?? []
export function checkTree(dir = join(root, 'docs/plan')) {
  const errors = [], nodes = new Map()
  const walk = (p) => readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(p, e.name)) : e.name.endsWith('.md') ? [join(p, e.name)] : [])
  const files = walk(dir).filter(p => /[/\\]L\d+[/\\]/.test(p))
  const known = new Set([...readFileSync(join(root, 'docs/curriculum-tree.md'), 'utf8').matchAll(/^\| ([RNLMT]\d+) \|/gm)].map(m => m[1]))
  for (const file of files) {
    const text = readFileSync(file, 'utf8'), id = basename(file, '.md')
    const matches = [...text.matchAll(/^(Parent|Serves|Goal|Exit check|Children|Constraints inherited|Open questions):[ \t]*(.*)$/gm)]
    if (matches.map(m => m[1]).join('|') !== fields.join('|')) errors.push(`${id}: seven schema sections missing, repeated or out of order`)
    const node = { id, file }
    matches.forEach((m, i) => { node[m[1]] = text.slice(m.index + m[1].length + 1, matches[i + 1]?.index ?? text.length).trim() })
    for (const field of fields.filter(f => f !== 'Children')) if (!node[field] || /^(none|tbd|todo)$/i.test(node[field]) && field !== 'Open questions') errors.push(`${id}: ${field} missing`)
    node.parent = node.Parent?.match(/^([A-Z]\d+(?:-D\d+)?)/)?.[1]
    node.serves = [...new Set(ids(node.Serves))]
    node.children = ids(node.Children)
    if (!node.parent) errors.push(`${id}: no parent`)
    if (!node.serves.length) errors.push(`${id}: no milestone served`)
    for (const m of node.serves) if (!known.has(m)) errors.push(`${id}: unknown milestone ${m}`)
    if (nodes.has(id)) errors.push(`${id}: duplicate id`)
    nodes.set(id, node)
  }
  if (!nodes.size) errors.push('No plan nodes found')
  for (const n of nodes.values()) {
    const parent = nodes.get(n.parent)
    if (!parent && !(n.parent === 'L2' && /^U\d+$/.test(n.id))) errors.push(`${n.id}: parent ${n.parent} does not exist`)
    if (parent && !parent.children.includes(n.id)) errors.push(`${n.id}: not listed by parent`)
    if (parent) for (const m of n.serves) if (!parent.serves.includes(m)) errors.push(`${n.id}: ${m} not served by parent`)
    for (const id of n.children) if (nodes.get(id)?.parent !== n.id) errors.push(`${n.id}: child ${id} missing or points elsewhere`)
    if (/^W\d+$/.test(n.id)) {
      for (const strand of 'RNLMT') if (!n.serves.some(m => m.startsWith(strand))) errors.push(`${n.id}: no ${strand} milestone`)
      if (n.children.length !== 5) errors.push(`${n.id}: expected five activity children`)
    }
    if (/^W\d+-D\d+$/.test(n.id)) {
      if (n.children.length) errors.push(`${n.id}: activity must be a leaf`)
      for (const label of ['Template:', 'Decision the child makes:', 'Invitation', 'Harder rung:', 'Materials:']) if (!n.Goal?.includes(label)) errors.push(`${n.id}: Goal missing ${label}`)
    }
  }
  const coverage = {}
  for (const unit of [...nodes.values()].filter(n => /^U\d+$/.test(n.id))) {
    const leaves = new Set(), visiting = new Set()
    function descend(id) {
      if (visiting.has(id)) { errors.push(`${unit.id}: cycle at ${id}`); return }
      const n = nodes.get(id); if (!n) return
      visiting.add(id)
      if (/^W\d+-D\d+$/.test(id)) leaves.add(id)
      n.children.forEach(descend); visiting.delete(id)
    }
    descend(unit.id)
    coverage[unit.id] = Object.fromEntries(unit.serves.map(m => [m, [...leaves].filter(id => nodes.get(id).serves.includes(m)).length]))
    for (const [m, count] of Object.entries(coverage[unit.id])) if (count < 3) errors.push(`${unit.id}: ${m} served by ${count} activities; needs at least three`)
  }
  return { nodes: nodes.size, coverage, errors }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkTree(process.argv[2] ? resolve(process.argv[2]) : undefined)
  console.log(JSON.stringify(result, null, 2))
  process.exitCode = result.errors.length ? 1 : 0
}
