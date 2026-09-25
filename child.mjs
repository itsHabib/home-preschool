// Reads child.json and fills the {{tokens}} in rendered pages.
// The content is written once with tokens such as {{name}}, {{they}} and
// want{{s}}; this module turns them into "Alex", "she" and "wants".
import { readFileSync } from 'node:fs'

const PRONOUNS = {
  he:   { they: 'he',   them: 'him',  their: 'his',   themself: 'himself',  s: 's', es: 'es', ies: 'ies', is: 'is',  has: 'has',  was: 'was',  does: 'does' },
  she:  { they: 'she',  them: 'her',  their: 'her',   themself: 'herself',  s: 's', es: 'es', ies: 'ies', is: 'is',  has: 'has',  was: 'was',  does: 'does' },
  they: { they: 'they', them: 'them', their: 'their', themself: 'themself', s: '',  es: '',   ies: 'y',   is: 'are', has: 'have', was: 'were', does: 'do' },
}

export const PRONOUN_SETS = Object.keys(PRONOUNS)

export function loadChild(path = new URL('./child.json', import.meta.url)) {
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  const name = String(raw.name ?? '').trim()
  if (!name) throw new Error('child.json needs a "name"')
  const pronouns = String(raw.pronouns ?? 'they').trim().toLowerCase()
  if (!PRONOUNS[pronouns]) throw new Error(`child.json "pronouns" must be he, she or they, not ${JSON.stringify(raw.pronouns)}`)
  return { name, pronouns }
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function tokens(child) {
  const set = PRONOUNS[child.pronouns]
  if (!set) throw new Error(`unknown pronoun set ${JSON.stringify(child.pronouns)}`)
  const t = { name: escapeHtml(child.name), NAME: escapeHtml(child.name.toUpperCase()), ...set }
  for (const key of ['they', 'them', 'their', 'themself']) t[capitalize(key)] = capitalize(set[key])
  return t
}

let cached
const defaultChild = () => (cached ??= loadChild())

// personalize replaces every {{token}} in text. An unknown token is a bug in
// the content, so it throws instead of printing a page with braces on it.
export function personalize(text, child = defaultChild()) {
  const t = tokens(child)
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in t)) throw new Error(`unknown token ${match}`)
    return t[key]
  })
}
