import assert from 'node:assert/strict'
import { readFileSync, readdirSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { loadChild, personalize, PRONOUN_SETS } from './child.mjs'

const root = new URL('.', import.meta.url)
const sample = '{{NAME}}: {{They}} {{is}} here. If {{they}} want{{s}} more, let {{them}} choose {{their}} own; {{they}} push{{es}} back and tr{{ies}} again. {{name}} decides.'

assert.equal(personalize(sample, { name: 'Alex', pronouns: 'they' }),
  'ALEX: They are here. If they want more, let them choose their own; they push back and try again. Alex decides.')
assert.equal(personalize(sample, { name: 'Mia', pronouns: 'she' }),
  'MIA: She is here. If she wants more, let her choose her own; she pushes back and tries again. Mia decides.')
assert.equal(personalize(sample, { name: 'Sam', pronouns: 'he' }),
  'SAM: He is here. If he wants more, let him choose his own; he pushes back and tries again. Sam decides.')
assert.equal(personalize('{{name}} & co', { name: 'A<b>&c', pronouns: 'he' }), 'A&lt;b&gt;&amp;c & co', 'the name is HTML-escaped')
assert.throws(() => personalize('{{nope}}', { name: 'Alex', pronouns: 'they' }), /unknown token/)

const dir = mkdtempSync(join(tmpdir(), 'child-'))
const file = join(dir, 'child.json')
writeFileSync(file, JSON.stringify({ name: ' Noor ', pronouns: 'She' }))
assert.deepEqual(loadChild(file), { name: 'Noor', pronouns: 'she' })
writeFileSync(file, JSON.stringify({ name: 'Noor', pronouns: 'xe' }))
assert.throws(() => loadChild(file), /he, she or they/)
writeFileSync(file, JSON.stringify({ pronouns: 'he' }))
assert.throws(() => loadChild(file), /needs a "name"/)

// Every rendered source must personalize cleanly for every pronoun set:
// no token left behind, no raw pronoun that skipped the tokens, and no
// "they wants"-style mismatch.
const sources = ['build.mjs', 'build-kit.mjs', ...readdirSync(new URL('./weeks-v2/', root)).map((f) => `weeks-v2/${f}`)]
const singular = /\bthey (is|was|has|does|wants|builds|turns|makes|looks|picks|handles|covers|chooses|pushes|tries|stops|puts|says|feels|needs|gets|counts|points|decides)\b/i
for (const src of sources) {
  const text = readFileSync(new URL(src, root), 'utf8')
  assert(!/\b(he|him|his|himself|noah)\b/i.test(text), `${src}: raw pronoun or name left in the source`)
  for (const pronouns of PRONOUN_SETS) {
    const out = personalize(text, { name: 'Alex', pronouns })
    assert(!out.includes('{{'), `${src}: token left after personalizing as ${pronouns}`)
    if (pronouns === 'they') assert(!singular.test(out), `${src}: singular verb after "they": ${out.match(singular)?.[0]}`)
  }
}
console.log(`Personalization: ${PRONOUN_SETS.length} pronoun sets across ${sources.length} sources, no leftovers.`)
