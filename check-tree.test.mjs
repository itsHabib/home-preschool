import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { checkTree } from './check-tree.mjs'
const source = new URL('./docs/plan/', import.meta.url)
assert.deepEqual(checkTree().errors, [], 'Real plan must pass first')
const cases = [
  ['missing parent', 'L5/W1-D1.md', s => s.replace(/^Parent:.*$/m, 'Parent:'), /parent/i],
  ['empty week coverage', 'L4/W1.md', s => s.replace(/^Serves:.*$/m, 'Serves:'), /no milestone/],
  ['missing exit', 'L5/W1-D1.md', s => s.replace(/Exit check:[\s\S]*?(?=Children:)/, 'Exit check:\n'), /Exit check missing/],
  ['undercovered milestone', 'L5/W1-D4.md', s => s.replace(/^Serves:.*$/m, 'Serves: L1'), /T1 served by 2/],
]
for (const [name, file, mutate, expected] of cases) {
  const temp = mkdtempSync(join(tmpdir(), 'preschool-plan-'))
  try {
    cpSync(source, temp, { recursive: true })
    const path = join(temp, file)
    writeFileSync(path, mutate(readFileSync(path, 'utf8')))
    assert(checkTree(temp).errors.some(e => expected.test(e)), `Did not reject ${name}`)
    console.log(`Rejected: ${name}`)
  } finally { rmSync(temp, { recursive: true, force: true }) }
}
