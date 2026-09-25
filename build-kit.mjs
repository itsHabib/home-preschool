// Builds kit-week-01.html … kit-week-08.html from content.json.
// One printable page per day (from each day's `printable` template) + pull-and-do cards.
// Re-runnable: `node build-kit.mjs`
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { art, sortSpecies } from './art.mjs'
import { personalize } from './child.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const parsed = JSON.parse(readFileSync(join(__dir, 'content.json'), 'utf8'))
const weeks = parsed.result?.weeks ?? parsed.weeks
weeks.sort((a, b) => a.week - b.week)

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const NUM_WORDS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

const ink = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#4a3f26' : '#ffffff'
}
const shade = (hex, amt) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))))
  return '#' + [f(r), f(g), f(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

// ---------- dino art (same drawings as build.mjs) ----------
const footprint = (color, size = 26) => `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 40 44" fill="${color}" aria-hidden="true"><ellipse cx="20" cy="30" rx="10" ry="9"/><ellipse cx="11" cy="14" rx="3.4" ry="6"/><ellipse cx="20" cy="10" rx="3.4" ry="6.5"/><ellipse cx="29" cy="14" rx="3.4" ry="6"/></svg>`

const brachioPaths = (color) => {
  const belly = shade(color, .24), deep = shade(color, -.2)
  return `<path d="M96 60 Q 132 55 146 74 Q 126 64 98 68 Z" fill="${color}"/>
    <ellipse cx="78" cy="58" rx="34" ry="21" fill="${color}"/>
    <ellipse cx="78" cy="64" rx="26" ry="12" fill="${belly}"/>
    <rect x="54" y="70" width="11" height="23" rx="5.5" fill="${deep}"/>
    <rect x="88" y="70" width="11" height="23" rx="5.5" fill="${deep}"/>
    <rect x="68" y="72" width="11" height="21" rx="5.5" fill="${color}"/>
    <rect x="100" y="72" width="11" height="21" rx="5.5" fill="${color}"/>
    <path d="M50 50 Q 32 42 30 16 Q 30 6 40 7 Q 44 26 62 44 Z" fill="${color}"/>
    <ellipse cx="34" cy="14" rx="12" ry="9.5" fill="${color}"/>
    <ellipse cx="21" cy="17" rx="6" ry="4.6" fill="${color}"/>
    <circle cx="37" cy="11" r="2.1" fill="#3B322E"/>`
}
const brachiosaurus = (color, size = 128) => `<svg width="${size}" height="${size * 0.64}" viewBox="0 0 150 96" aria-hidden="true">${brachioPaths(color)}</svg>`

const triBodyPaths = (color) => {
  const belly = shade(color, .24), deep = shade(color, -.2)
  return `<path d="M92 56 Q 118 54 128 66 Q 112 60 94 62 Z" fill="${color}"/>
    <ellipse cx="74" cy="52" rx="32" ry="20" fill="${color}"/>
    <ellipse cx="74" cy="58" rx="25" ry="12" fill="${belly}"/>
    <rect x="54" y="66" width="11" height="22" rx="5.5" fill="${deep}"/>
    <rect x="84" y="66" width="11" height="22" rx="5.5" fill="${deep}"/>
    <rect x="66" y="68" width="11" height="20" rx="5.5" fill="${color}"/>
    <rect x="94" y="68" width="11" height="20" rx="5.5" fill="${color}"/>
    <path d="M54 34 Q 40 18 24 26 Q 15 35 22 50 Q 32 60 50 56 Q 54 46 54 34 Z" fill="${deep}"/>
    <ellipse cx="32" cy="48" rx="16" ry="13" fill="${color}"/>
    <path d="M16 50 Q 7 52 11 59 Q 18 56 22 54 Z" fill="${deep}"/>
    <circle cx="31" cy="46" r="2" fill="#3B322E"/>`
}
const triHornPaths = (fillOrStroke) => {
  const horns = ['M22 40 Q 20 30 26 30 Q 28 38 27 43 Z', 'M31 33 Q 29 15 37 13 Q 41 26 38 38 Z', 'M38 35 Q 38 20 45 19 Q 47 30 44 40 Z']
  return horns.map((d) => `<path d="${d}" ${fillOrStroke}/>`).join('')
}
const triceratops = (color, size = 128) =>
  `<svg width="${size}" height="${size * 0.66}" viewBox="0 0 140 92" aria-hidden="true">${triBodyPaths(color)}${triHornPaths('fill="#F4EAD8"')}</svg>`

const nestSvg = (color, size = 120) => {
  const deep = shade(color, -.22), egg = shade(color, .34)
  return `<svg width="${size}" height="${size * 0.72}" viewBox="0 0 130 94" aria-hidden="true">
    <ellipse cx="47" cy="54" rx="15" ry="19" fill="${egg}" stroke="${deep}" stroke-width="2"/>
    <ellipse cx="76" cy="52" rx="15" ry="19" fill="${egg}" stroke="${deep}" stroke-width="2"/>
    <ellipse cx="61" cy="46" rx="15" ry="19" fill="${color}" stroke="${deep}" stroke-width="2"/>
    <circle cx="60" cy="42" r="2.4" fill="${deep}"/><circle cx="66" cy="53" r="2" fill="${deep}"/><circle cx="55" cy="50" r="2" fill="${deep}"/>
    <path d="M20 66 Q 61 86 102 66 Q 111 75 98 82 Q 61 98 24 82 Q 11 75 20 66 Z" fill="${deep}"/></svg>`
}

const heroDino = (n, color, size = 64) => {
  if (n === 3) return nestSvg(color, size)
  if (n === 4 || n === 7) return triceratops(color, size)
  return brachiosaurus(color, size)
}

// ---------- template pieces ----------
const dotTarget = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="18" fill="none" stroke="#CBB89E" stroke-width="2.5" stroke-dasharray="2 7"/>`
const dashed = (accent) => `fill="#fff" stroke="${accent}" stroke-width="4" stroke-dasharray="3 12"`

// each item drawing lives in a 160x190 viewBox and includes its own dot target
const countItems = {
  egg: (a) => `<ellipse cx="80" cy="95" rx="56" ry="76" ${dashed(a)}/>${dotTarget(80, 95)}`,
  footprint: (a) => `<g transform="translate(10,15) scale(3.5)"><g fill="none" stroke="${a}" stroke-width="1.3" stroke-dasharray="1 3.5"><ellipse cx="20" cy="30" rx="10" ry="9"/><ellipse cx="11" cy="14" rx="3.4" ry="6"/><ellipse cx="20" cy="10" rx="3.4" ry="6.5"/><ellipse cx="29" cy="14" rx="3.4" ry="6"/></g></g>${dotTarget(80, 120)}`,
  leaf: (a) => `<path d="M80 12 Q 148 92 80 182 Q 12 92 80 12 Z" ${dashed(a)}/><path d="M80 30 L 80 165" stroke="${a}" stroke-width="3" stroke-dasharray="3 10" fill="none"/>${dotTarget(80, 97)}`,
  bone: (a) => `<g ${dashed(a)}><circle cx="34" cy="72" r="17"/><circle cx="34" cy="118" r="17"/><circle cx="126" cy="72" r="17"/><circle cx="126" cy="118" r="17"/><rect x="34" y="80" width="92" height="30" rx="9"/></g>${dotTarget(80, 95)}`,
  dino: (a) => `<g transform="translate(2,45)">${brachioPaths(shade(a, .45))}</g>${dotTarget(80, 100)}`,
  horn: (a) => `<path d="M80 175 Q 56 95 74 28 Q 79 12 86 28 Q 102 95 80 175 Z" ${dashed(a)}/>${dotTarget(80, 115)}`,
}

const renderDotCount = (p, accent) => {
  const n = Math.max(1, Math.min(6, p.count ?? 3))
  const draw = countItems[p.item] ?? countItems.egg
  const cells = Array.from({ length: n }, () => `<svg viewBox="0 0 160 190" class="count-cell">${draw(accent)}</svg>`).join('')
  return `<div class="big-num">${n}</div>
  <div class="count-grid cols-${Math.min(n, 3)}">${cells}</div>
  <div class="count-line">${esc(p.question ?? 'How many?')} &nbsp;…<b>${NUM_WORDS[n]}!</b></div>`
}

const renderTrace = (p, accent, weekChar) => {
  const text = String(p.text ?? weekChar).toUpperCase().slice(0, 4)
  const spans = [...text].map((ch) => `<tspan stroke="${ch === weekChar.toUpperCase() ? accent : '#C7BEAE'}">${esc(ch)}</tspan>`).join('')
  const size = text.length === 1 ? 280 : 240
  const trail = [accent, shade(accent, .3), accent, shade(accent, .3)].map((c) => footprint(c, 30)).join('')
  return `<svg class="trace-svg" viewBox="0 0 1000 300" aria-label="${esc(text)} in dotted letters to trace">
    <text x="500" y="225" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="${size}" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 16">${spans}</text>
  </svg>
  <div class="trace-hint">${esc(p.subline ?? '')}</div>
  <div class="fptrail">${trail}</div>`
}

const RAINBOW = ['#E23B2E', '#E8833A', '#F4B400', '#4F7942', '#3A7CA5', '#8E6CB8']
const renderColorHunt = (p, accent, colorName) => {
  const labels = (p.labels ?? []).slice(0, 6)
  while (labels.length < 6) labels.push('your choice!')
  const rainbow = /rainbow/i.test(colorName)
  const cells = labels.map((l, i) => `<div class="hunt-cell"><div class="hunt-dot" style="border-color:${rainbow ? RAINBOW[i] : shade(accent, .25)}"></div><div class="hunt-lbl">${esc(l)}</div></div>`).join('')
  return `<div class="hunt-grid">${cells}</div>`
}

const sortIcons = {
  leaf: () => `<path d="M45 6 Q 78 38 45 74 Q 12 38 45 6 Z" fill="#6FA060"/><path d="M45 14 L 45 66" stroke="#527947" stroke-width="2.5" fill="none"/>`,
  meat: () => `<ellipse cx="34" cy="42" rx="26" ry="20" fill="#C97B4A" transform="rotate(-24 34 42)"/><rect x="48" y="27" width="30" height="9" rx="4.5" fill="#EDE6D4" transform="rotate(24 48 27)"/><circle cx="78" cy="36" r="7" fill="#EDE6D4"/><circle cx="72" cy="46" r="7" fill="#EDE6D4"/>`,
  egg: () => `<ellipse cx="45" cy="40" rx="24" ry="32" fill="#F7F1E3" stroke="#D8CBB0" stroke-width="2.5"/><circle cx="40" cy="32" r="3" fill="#D8CBB0"/><circle cx="52" cy="46" r="2.5" fill="#D8CBB0"/>`,
  bone: () => `<g fill="#EDE6D4" stroke="#C9BCA0" stroke-width="2"><circle cx="18" cy="30" r="9"/><circle cx="18" cy="50" r="9"/><circle cx="72" cy="30" r="9"/><circle cx="72" cy="50" r="9"/><rect x="18" y="33" width="54" height="14" rx="5"/></g>`,
  footprint: () => `<g transform="translate(23,0) scale(1.7)" fill="#8f7a5f"><ellipse cx="14" cy="30" rx="10" ry="9"/><ellipse cx="5" cy="14" rx="3.4" ry="6"/><ellipse cx="14" cy="10" rx="3.4" ry="6.5"/><ellipse cx="23" cy="14" rx="3.4" ry="6"/></g>`,
  'dino-big': (a) => `<g transform="scale(0.62) translate(-2,10)">${brachioPaths(a)}</g>`,
  'dino-small': (a) => `<g transform="scale(0.45) translate(30,60)">${triBodyPaths(shade(a, -.12))}${triHornPaths('fill="#F4EAD8"')}</g>`,
  star: () => `<path d="M45 8 L54 32 L80 32 L59 48 L67 73 L45 58 L23 73 L31 48 L10 32 L36 32 Z" fill="#E7B84B"/>`,
}
export const renderSortMat = (p, accent) => {
  const zone = (label) => `<div class="sort-zone"><div class="sort-head">${esc(label)}</div></div>`
  const items = (p.items ?? []).slice(0, 6)
  const tiles = items.map((it) => {
    const species = sortSpecies(it)
    if (species) return `<div class="tile" data-species="${esc(species)}">${art(species)}<div class="tile-lbl">${esc(it.label)}</div></div>`
    const draw = sortIcons[it.icon] ?? sortIcons.star
    return `<div class="tile"><svg viewBox="0 0 90 80">${draw(accent)}</svg><div class="tile-lbl">${esc(it.label ?? '')}</div></div>`
  }).join('')
  return `<div class="sort-zones">${zone(p.leftLabel ?? 'this side')}${zone(p.rightLabel ?? 'that side')}</div>
  <div class="cut-strip"><div class="cut-note">✂ grown-up cuts these — {{name}} sorts them onto the mat</div><div class="tiles">${tiles}</div></div>`
}

const pdScenes = {
  nest: (p, a) => {
    const n = Math.max(1, Math.min(5, p.count ?? 3))
    const gap = 560 / (n + 1)
    const eggs = Array.from({ length: n }, (_, i) => `<ellipse cx="${30 + gap * (i + 1)}" cy="185" rx="52" ry="70" ${dashed(a)}/>`).join('')
    return `<svg viewBox="0 0 620 400" class="pd-svg">${eggs}
      <path d="M70 250 Q 310 350 550 250 Q 590 300 520 336 Q 310 420 100 336 Q 30 300 70 250 Z" fill="#B07A46"/>
      <path d="M70 250 Q 310 350 550 250" fill="none" stroke="#8f6236" stroke-width="4" stroke-linecap="round"/></svg>`
  },
  'triceratops-horns': (p, a) => {
    const bigHorns = ['M18 46 Q 12 22 24 19 Q 30 34 28 48 Z', 'M29 38 Q 27 2 41 1 Q 48 22 41 42 Z', 'M41 40 Q 44 10 55 12 Q 59 28 50 46 Z']
      .map((d) => `<path d="${d}" fill="none" stroke="${shade(a, -.3)}" stroke-width="2.4" stroke-dasharray="2 3.5"/>`).join('')
    return `<svg viewBox="0 0 140 104" class="pd-svg" style="max-width:6in">
    <g transform="translate(0,10)">${triBodyPaths(a)}${bigHorns}</g></svg>`
  },
  letter: (p, a, weekChar) => `<svg viewBox="0 0 700 560" class="pd-svg" style="max-width:5.6in">
    <text x="350" y="470" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="520" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round">${esc(weekChar)}</text></svg>`,
  'footprint-trail': (p, a) => {
    const n = Math.max(1, Math.min(5, p.count ?? 4))
    const prints = Array.from({ length: n }, (_, i) => `<g transform="translate(${20 + i * (580 / n)},${i % 2 ? 60 : 10}) scale(2.6)"><g fill="none" stroke="${a}" stroke-width="1.5" stroke-dasharray="1 3.5"><ellipse cx="20" cy="30" rx="10" ry="9"/><ellipse cx="11" cy="14" rx="3.4" ry="6"/><ellipse cx="20" cy="10" rx="3.4" ry="6.5"/><ellipse cx="29" cy="14" rx="3.4" ry="6"/></g></g>`).join('')
    return `<svg viewBox="0 0 620 190" class="pd-svg">${prints}</svg>`
  },
}
const renderPlaydough = (p, accent, weekChar) => {
  const scene = pdScenes[p.scene] ?? pdScenes.nest
  return `${scene(p, accent, weekChar)}
  <div class="count-line" style="font-size:19px">${esc(p.prompt ?? '')}</div>
  <div class="pd-tip">Slip this page into a sheet protector — playdough wipes right off and the mat is reusable.</div>`
}

const renderPathCount = (p, accent) => {
  const n = Math.max(3, Math.min(6, p.steps ?? 4))
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    return { x: 80 + 460 * t, y: 330 - 240 * t + (i % 2 ? 40 : -20), rot: i % 2 ? 14 : -12 }
  })
  const trail = pts.map((pt, i) => `<g transform="translate(${pt.x - 40},${pt.y - 46}) rotate(${pt.rot} 40 44) scale(2)"><g fill="none" stroke="${accent}" stroke-width="1.6" stroke-dasharray="1 3.5"><ellipse cx="20" cy="30" rx="10" ry="9"/><ellipse cx="11" cy="14" rx="3.4" ry="6"/><ellipse cx="20" cy="10" rx="3.4" ry="6.5"/><ellipse cx="29" cy="14" rx="3.4" ry="6"/></g></g>
    <circle cx="${pt.x}" cy="${pt.y + 62}" r="17" fill="${shade(accent, .82)}" stroke="${accent}" stroke-width="2"/>
    <text x="${pt.x}" y="${pt.y + 69}" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="20" fill="${shade(accent, -.3)}">${i + 1}</text>`).join('')
  const last = pts[n - 1]
  return `<svg viewBox="0 0 640 440" class="pd-svg">
    <g transform="translate(0,330)">${brachioPaths(shade(accent, .35)).replaceAll('<svg', '')}</g>
    ${trail}
    <g transform="translate(${Math.min(last.x + 10, 510)},${Math.max(last.y - 90, 4)})">${nestSvg(accent, 96).replace(/<svg[^>]*>/, '<g>').replace('</svg>', '</g>')}</g>
  </svg>
  <div class="count-line" style="font-size:19px">${esc(p.prompt ?? 'Stomp a finger on each footprint — one number per step!')}</div>`
}

// ---------- v2 decision templates (requested by L5 nodes) ----------
export const v2Templates = ['count-and-match','odd-one-out','shadow-match','pattern-strip','feed-the-dino','coloring-page','mini-book']
const propPair = (items) => `<div class="prop-pair">${items.map(id=>`<div>${art(id)}</div>`).join('')}</div>`
const dots = (count, variant) => {
  const layouts = { '3a':[[45,35],[115,85],[185,35]], '3b':[[50,75],[115,40],[180,75]], '4a':[[55,30],[175,30],[55,90],[175,90]], '4b':[[35,75],[90,35],[145,85],[200,45]] }
  const coords=layouts[`${count}${variant}`]
  if(!coords) throw new Error(`Unsupported dot arrangement ${count}${variant}`)
  return `<svg class="dot-set" viewBox="0 0 230 120" aria-label="${count} eggs">${coords.map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="17" fill="white" stroke="#111" stroke-width="3"/>`).join('')}</svg>`
}
const factStrip = w => `<div class="fact-strip"><b>Say it:</b> ${esc(w.dinosaur.say)} · <b>Ate:</b> ${esc(w.dinosaur.diet)}<br><b>Lived:</b> ${esc(w.dinosaur.era)} · <b>Wow:</b> ${esc(w.dinosaur.feature)}</div>`
const eatingScene = id => `<div class="eating-scene ${id}">${art(id,{flip:id==='triceratops',className:'eating-dino'})}${art('leaf',{className:'bite-leaf'})}</div>`
export function renderV2(pr,w) {
  const p=pr.params??{},dino=w.dinosaur.id
  if(pr.template==='count-and-match') return `<div class="match-host">${art(dino)}</div><div class="v2-grid match-grid">${[[3,'a'],[4,'a'],[4,'b'],[3,'b']].map(([n,v])=>`<div class="match-card">${dots(n,v)}<div class="panel-name">{{NAME}}</div></div>`).join('')}</div><p class="assembly">Grown-up: cut four egg cards along dashed borders. Keep the dinosaur header as a pen marker.<br>Set one target above two choices; put the fourth card aside. Shuffle choices between turns.</p><div class="numeral-reference">Grown-up reference — set aside before play: 3 · 4</div>`
  if(pr.template==='odd-one-out') return `<div class="v2-grid odd-grid">${(p.species??['stegosaurus','triceratops','ankylosaurus','tyrannosaurus']).map(id=>`<div class="picture-card">${art(id)}<span class="panel-name">{{NAME}}</span></div>`).join('')}</div><p class="assembly">Grown-up: share the dinner story on the card first. Cut and shuffle these pictures for a later choice.<br>These dinosaurs are a comparison set, not a scene of animals living together.</p>`
  if(pr.template==='shadow-match') return `<div class="shadow-targets">${(p.species??['ankylosaurus','stegosaurus','triceratops']).map(id=>`<div>${art(id,{shadow:true})}</div>`).join('')}</div><div class="shadow-piece">${art(dino)}<span class="panel-name">{{NAME}}</span></div><p class="assembly">Grown-up: cut out the lower picture along its dashed border. Keep the three shadows together.<br>{{name}} can place the picture below a shadow or point; their sizes are not a life-size comparison.</p>`
  if(pr.template==='pattern-strip') {
    const seq=p.sequence??['leaf','egg','leaf','egg'];const choices=p.choices??[seq[1],seq[0]]
    if(seq.length!==4 || seq[0]===seq[1] || seq[0]!==seq[2] || seq[1]!==seq[3]) throw new Error('U1 pattern must be ABAB')
    if(choices.length!==2 || new Set(choices).size!==2 || choices.some(id=>!seq.includes(id))) throw new Error('Pattern needs both continuation choices')
    if((p.gaps??1)!==1) throw new Error('U1 printed pattern has one gap; extensions use replenished floor tiles')
    return `<div class="pattern-host">${art(dino)}</div><div class="pattern-row" style="grid-template-columns:repeat(${seq.length+1},1fr)">${seq.map(id=>`<div>${art(id)}</div>`).join('')}<div class="empty-step"></div></div><div class="pattern-choices">${choices.map(id=>`<div>${art(id)}<span class="panel-name">{{NAME}}</span></div>`).join('')}</div><p class="assembly">Grown-up: keep the row whole. Cut the two choice cards and shuffle them.<br>Point to a choice or put it below the blank; the cards are deliberately larger than the boxes.</p>`
  }
  if(pr.template==='feed-the-dino') return `<div class="feeding-top">${art(dino)}<span class="ride-number">${p.count??4}</span></div><div class="meal-space"></div>${propPair(['meat','leaf'])}<p class="assembly">Grown-up: use playdough for pretend food on a washable mat or sheet protector.<br>The blank plate has no counting slots. Food pictures are symbols; keep them on the page.</p>`
  if(pr.template==='coloring-page') return `<div class="coloring-hero">${art(dino)}</div><div class="dinosaur-name"><span class="isolated-letter">${esc(w.letter.char)}</span> ${esc(w.dinosaur.name)}</div>${factStrip(w)}`
  if(pr.template==='mini-book') {
    const panels=[`${art(dino)}<div class="book-label">${esc(w.dinosaur.name)}</div><span class="book-sound">${esc(w.letter.char)}</span>`,`${eatingScene(dino)}<div class="book-label">It eats plants.</div>`,`<div class="book-sound">${esc(w.letter.char)}</div>${propPair(p.soundChoices)}<div class="book-label">Which starts with ${esc(w.letter.phoneme)}?</div>`,`${art(dino,{className:'book-small'})}<div class="book-label">A round resting place</div><div class="book-blank"></div>`]
    return `<div class="v2-grid book-grid">${panels.map((body,i)=>`<div class="book-panel"><span class="book-number">${i+1}</span>${body}<span class="panel-name">{{NAME}}</span></div>`).join('')}</div><p class="assembly">Grown-up: cut four pages and stack 1–4; a clip or ring is fine. Read the captions aloud.<br>Last page: a pretend resting place for a dough loop or a crayon circle. No reading expected from {{name}}.</p>`
  }
  throw new Error(`Unknown v2 template: ${pr.template}`)
}

const renderPrintableBody = (pr, w) => {
  if (v2Templates.includes(pr.template)) return renderV2(pr,w)
  const accent = w.color.hex, ch = w.letter.char
  if (pr.template === 'trace') return renderTrace(pr.params ?? {}, accent, ch)
  if (pr.template === 'dot-count') return renderDotCount(pr.params ?? {}, accent)
  if (pr.template === 'color-hunt') return renderColorHunt(pr.params ?? {}, accent, w.color.name)
  if (pr.template === 'sort-mat') return renderSortMat(pr.params ?? {}, accent)
  if (pr.template === 'playdough-mat') return renderPlaydough(pr.params ?? {}, accent, ch)
  if (pr.template === 'path-count') return renderPathCount(pr.params ?? {}, accent)
  throw new Error(`Unknown printable template: ${pr.template}`)
}

// ---------- pages ----------
const dayPage = (w, d) => {
  const pr = d.printable
  if (!pr) return ''
  const center = pr.template === 'color-hunt' || pr.template === 'sort-mat' ? 'style="justify-content:flex-start;"' : ''
  return `
<div class="page ${w.dinosaur ? 'v2-page' : ''}" data-node="${esc(d.id)}">
  <span class="eyebrow">Week ${w.week} Kit · ${esc(d.day)} · {{NAME}}</span>
  <div class="p-title">${esc(pr.title)}</div>
  
  <div class="instr">${esc(pr.instruction)}</div>
  <div class="grow" ${center}>${renderPrintableBody(pr, w)}</div>
  ${w.dinosaur ? `<div class="decision-footer"><b>{{name}} decides:</b> ${esc(d.decision)}<br><b>If {{they}} want{{s}} more:</b> ${esc(d.harder)}</div>` : ''}
</div>`
}

const dayCard = (w, d) => {
  const star = /IF YOU ONLY DO ONE THING/i.test(d.what) ? '<span class="star">★ if you do one thing</span>' : ''
  const cls = { Monday: 'mon', Tuesday: 'tue', Wednesday: 'wed', Thursday: 'thu', Friday: 'fri' }[d.day] ?? 'mon'
  return `<div class="card ${cls}">
    <span class="day-tab">${esc(d.day)}${w.dinosaur ? ' · {{NAME}} · 2–10 min' : ''}</span>${star}
    <div class="card-title">${esc(d.title)}</div>
    <div class="card-what">${d.setup ? `<b>Set out:</b> ${esc(d.setup)}<br><b>Say:</b> “${esc(d.invitation)}”<br>${esc(d.play)}` : esc(d.cardBlurb ?? d.what)}</div>
    ${w.dinosaur && d.day==='Monday' ? factStrip(w) : ''}
    ${w.dinosaur ? `<div class="card-detail"><b>{{name}} decides:</b> ${esc(d.decision)}</div><div class="card-detail"><b>If {{they}} want{{s}} more:</b> ${esc(d.harder)}</div><div class="card-detail"><b>Optional note:</b> ${esc(d.exitCheck)}</div>` : ''}
    <div class="card-foot">
      <div class="need"><b>You'll need</b><br>${esc(d.needs ?? 'see the binder')}</div>
      ${w.dinosaur ? art(w.dinosaur.id,{className:'card-dino'}) : heroDino(w.week, w.color.hex, 60)}
    </div>
  </div>`
}

const howtoCard = (w) => w.dinosaur ? `<div class="card howto-v2"><span class="day-tab">{{NAME}} · grown-up card</span><div class="card-title">A little play is plenty.</div><div class="card-what">Set it out and play nearby. Each card offers two ways in; {{they}} can say no to both. Choose one short route, not every suggestion. Stop on pushback and save it for another day.<br><br>Stay with {{them}} for 2–10 minutes of floor play. Playdough, magnet tiles, Lego, crayons, cut cards, clips and rings are fine. Adult cuts the printed pieces. Use scrap paper for free circles; no tracing or pencil work.<br><br>Print US Letter, actual size (100%), headers/footers off. Pages 1–5 are play pages; 6–8 hold these cards. The daily card explains any cutting. Keep the card beside you, outside {{their}} puzzle choices.<br><br>Books and songs are a basket to choose from, not homework. One book and one roar count. If you feel like jotting something down afterward, the question on each card is enough.</div></div>` : `<div class="card" style="border-style:dashed;background:#F6F1E6;">
    <span class="day-tab" style="background:#7C9473;color:#fff;">How to use this kit</span>
    <div class="card-title" style="font-size:20px;">One page + one card a day.</div>
    <div class="card-what">Each morning, pull the day's card onto the fridge and set out its page. The ★ cards are the "if you only do one thing" days. Pages go in sheet protectors — dot and trace with a dry-erase marker and they're reusable. If a day gets away from you, no guilt: <b>one book and one roar counts.</b> 🦕</div>
  </div>`

const cardPages = (w) => {
  const cards = w.days.map((d) => dayCard(w, d))
  cards.push(howtoCard(w))
  const pages = []
  for (let i = 0; i < cards.length; i += 2) {
    pages.push(`
<div class="page cards-page">
  <div class="cards-head">✂ Pull-and-Do Cards · cut along the dotted line · keep by the fridge</div>
  ${cards[i]}
  ${cards[i + 1] ? `<div class="cut"></div>${cards[i + 1]}` : ''}
</div>`)
  }
  return pages.join('')
}

const kitCss = (w) => {
  const a = w.color.hex
  return `
  :root{--paper:#FBF7EF;--card:#FFFFFF;--ink:#3B322E;--ink-soft:#6E645D;--accent:${a};--deep:${shade(a, -.25)};--soft:${shade(a, .25)};--aink:${ink(a)};--gold:#E7A54B;--line:#EAE1D2;}
  *{box-sizing:border-box;}html,body{margin:0;padding:0;}
  body{background:var(--paper);color:var(--ink);font-family:"Nunito","Segoe UI",system-ui,sans-serif;line-height:1.4;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  h1,h2,.day-tab,.card-title,.eyebrow,.p-title,.count-line,.big-num,.sort-head,.trace-hint{font-family:"Baloo 2","Segoe UI",system-ui,sans-serif;}
  .page{width:8.5in;height:11in;margin:0 auto;padding:0.55in 0.6in;background:var(--paper);position:relative;overflow:visible;display:flex;flex-direction:column;}
  .eyebrow{align-self:flex-start;font-weight:700;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--aink);background:var(--accent);padding:4px 13px;border-radius:999px;}
  .p-title{font-size:33px;margin:10px 0 2px;color:var(--ink);font-weight:700;}
  .p-sub{font-size:13.5px;color:var(--ink-soft);font-weight:600;font-style:italic;margin-bottom:6px;}
  .instr{font-size:13px;color:var(--deep);font-weight:700;background:color-mix(in srgb, var(--accent) 14%, #fff);border-radius:12px;padding:9px 14px;margin:6px 0 0;}
  .grow{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;}
  /* trace */
  .trace-svg{width:100%;height:auto;}
  .trace-hint{font-size:16px;color:var(--ink);font-weight:600;text-align:center;margin-top:6px;}
  .fptrail{display:flex;gap:26px;justify-content:center;margin-top:12px;opacity:.55;}
  .fptrail svg:nth-child(even){transform:translateY(10px) rotate(12deg);}
  /* dot-count */
  .big-num{position:absolute;right:0;top:-10px;font-weight:700;font-size:120px;color:#EEE7D6;line-height:1;z-index:0;}
  .count-grid{display:grid;gap:22px 34px;z-index:1;}
  .cols-1{grid-template-columns:1fr;}.cols-2{grid-template-columns:1fr 1fr;}.cols-3{grid-template-columns:1fr 1fr 1fr;}
  .count-cell{width:1.85in;height:auto;}
  .count-line{font-weight:700;font-size:22px;color:var(--ink);text-align:center;margin-top:16px;z-index:1;}
  .count-line b{color:var(--accent);}
  /* hunt */
  .hunt-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px 30px;width:100%;margin-top:20px;}
  .hunt-cell{display:flex;flex-direction:column;align-items:center;gap:8px;}
  .hunt-dot{width:112px;height:112px;border-radius:50%;border:3.5px dashed var(--soft);background:#fff;}
  .hunt-lbl{font-size:13px;color:var(--ink-soft);font-weight:600;}
  /* sort-mat */
  .sort-zones{display:flex;gap:20px;width:100%;margin-top:14px;}
  .sort-zone{flex:1;height:3.1in;border:3px dashed var(--soft);border-radius:18px;background:#fff;}
  .sort-head{margin:12px auto 0;width:fit-content;font-weight:700;font-size:15px;color:var(--aink);background:var(--accent);padding:3px 16px;border-radius:999px;}
  .cut-strip{width:100%;margin-top:22px;border-top:2px dashed #CFC6B6;padding-top:8px;}
  .cut-note{text-align:center;font-size:11.5px;font-weight:700;color:#B7AE9E;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
  .tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
  .tile{border:2.5px dashed #CFC6B6;border-radius:12px;background:#fff;padding:8px 6px 5px;display:flex;flex-direction:column;align-items:center;}
  .tile svg{width:1.1in;height:auto;}
  .tile-lbl{font-size:12px;font-weight:700;color:var(--ink-soft);}
  /* playdough + path */
  .pd-svg{width:100%;max-width:6.6in;height:auto;}
  .pd-tip{margin-top:10px;font-size:11.5px;font-weight:700;color:var(--ink-soft);background:#F3EEE2;border-radius:999px;padding:5px 16px;}
  /* cards */
  .cards-page{padding:0.4in 0.5in;}
  .cards-head{font-size:12px;color:var(--ink-soft);font-weight:700;text-align:center;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;}
  .card{border:2px solid var(--line);border-radius:16px;background:var(--card);padding:16px 20px;height:4.5in;position:relative;display:flex;flex-direction:column;}
  .cut{border-top:2px dashed #CFC6B6;text-align:center;margin:12px 0;position:relative;}
  .cut span{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--paper);padding:0 10px;color:#B7AE9E;font-size:14px;}
  .day-tab{align-self:flex-start;font-size:11px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--aink);background:var(--accent);padding:3px 12px;border-radius:999px;}
  .card.tue .day-tab,.card.thu .day-tab{background:var(--gold);color:#5b4a1f;}
  .card.wed .day-tab{background:var(--soft);color:${ink(shade(a, .25))};}
  .card-title{font-size:23px;font-weight:700;margin:8px 0 6px;color:var(--ink);}
  .card-what{font-size:14px;color:var(--ink);line-height:1.5;flex:1;}
  .card-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;border-top:1px dashed var(--line);padding-top:8px;margin-top:8px;}
  .need{font-size:11.5px;color:var(--ink-soft);}
  .need b{color:var(--deep);font-family:"Baloo 2",sans-serif;text-transform:uppercase;letter-spacing:.06em;font-size:10px;}
  .star{position:absolute;top:14px;right:16px;font-size:11px;font-weight:700;color:var(--gold);font-family:"Baloo 2",sans-serif;background:#FBF1DC;padding:3px 9px;border-radius:999px;}
  /* v2: local fonts, generous black-and-white play surfaces, no hidden overflow. */
  .art{display:block;width:100%;height:100%;object-fit:contain;}
  .v2-page{background:white;padding:.45in .55in;}
  .v2-page .p-title{font-size:27px;line-height:1.15;margin:10px 0 4px;}
  .v2-page .p-sub{font-size:11px;margin-bottom:2px;}
  .v2-page .instr{font-size:12px;line-height:1.4;}
  .v2-page .grow{min-height:0;flex:1;justify-content:center;gap:12px;width:100%;padding:10px 0;}
  .v2-grid{display:grid;grid-template-columns:1fr 1fr;width:100%;gap:14px;}
  .decision-footer{flex:0 0 auto;border-top:1px solid #bbb;padding-top:9px;font-size:11px;line-height:1.45;color:#292929;}
  .prop-pair{flex-shrink:0;grid-template-rows:minmax(0,1fr);display:grid;grid-template-columns:1fr 1fr;gap:28px;width:100%;height:1.1in;}
  .prop-pair>div{min-height:0;min-width:0;height:100%;display:flex;justify-content:center;}
  .prop-pair .art{min-height:0;max-height:100%;max-width:2.4in;}
  .coloring-hero{width:100%;height:5.4in;flex-shrink:1;min-height:0;}
  .coloring-hero>.art{width:100%;height:100%;}
  .sound-letter{font-size:85px;font-weight:750;color:#111;}
  .fact-bubble{font-size:13px;border:1px solid #999;border-radius:18px;padding:7px 15px;}
  .round-space{width:100%;height:1.45in;border-bottom:1px solid #bbb;flex-shrink:0;}
  .round-space>span{font-size:10px;color:#666;}
  .match-grid{gap:18px;}
  .match-card{height:2.2in;border:1px dashed #888;position:relative;padding:15px 12px;display:flex;flex-direction:column;justify-content:center;}
  .dot-set{width:100%;height:1.55in;}
  .panel-name{display:block;font-size:10px;letter-spacing:.12em;color:#555;}
  .fold-band{position:absolute;bottom:0;left:0;right:0;height:30px;border-top:1px dashed #999;text-align:center;font-size:9px;padding:7px 0;}
  .assembly{font-size:10px;line-height:1.4;text-align:center;margin:0;}
  .odd-grid{gap:18px;}
  .picture-card{height:2.55in;border:1px dashed #888;padding:15px;display:flex;flex-direction:column;gap:4px;}
  .picture-card .art{min-height:0;flex:1;}
  .shadow-targets{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;height:2in;}
  .shadow-targets>div{border:1px solid #999;padding:10px;min-width:0;min-height:0;}
  .shadow-piece{width:100%;height:2.15in;border:1px dashed #888;padding:8px 18px;display:flex;flex-direction:column;align-items:center;}
  .shadow-piece>.art{min-height:0;flex:1;max-width:4.8in;}
  .pattern-host{height:1.2in;width:2.2in;align-self:flex-start;}
  .pattern-row{display:grid;width:100%;gap:6px;}
  .pattern-row>div{height:1.1in;border:1px solid #888;padding:9px;min-width:0;}
  .pattern-choices{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;margin-top:20px;}
  .pattern-choices>div{height:2.25in;border:1px dashed #888;padding:16px;display:flex;flex-direction:column;align-items:center;}
  .pattern-choices .art{min-height:0;flex:1;max-width:2.4in;}
  .feeding-top{width:100%;height:1.8in;display:flex;align-items:center;justify-content:space-between;}
  .feeding-top .art{max-width:3.5in;}
  .ride-number{font-size:28px;align-self:flex-start;color:#666;}
  .meal-space{width:100%;height:2.4in;border:2px solid #777;border-radius:35px;}
  .book-grid{gap:12px;}
  .book-panel{height:2.85in;border:1px dashed #888;padding:18px 12px 10px;position:relative;display:flex;align-items:center;flex-direction:column;gap:5px;}
  .book-number{position:absolute;left:5px;top:3px;font-size:9px;color:#666;}
  .book-panel>.art{height:1.45in;max-width:2.65in;}
  .book-panel>.book-leaf{height:.55in;}
  .book-label{font-size:14px;text-align:center;}
  .book-sound{font-size:32px;line-height:1.1;}
  .book-panel .prop-pair{height:1.35in;gap:15px;}
  .book-panel .panel-name{margin-top:auto;}
  .book-panel>.book-small{height:.6in;align-self:flex-start;width:1in;}
  .book-blank{width:100%;flex:1;}
  .card-detail{font-size:11px;line-height:1.4;margin-top:7px;}
  .card-dino{width:75px;height:58px;}
  .card-what{flex:0 1 auto;}
  .card-foot{margin-top:auto;}
  .card-title{font-size:21px;line-height:1.15;}
  .card-what{font-size:12px;line-height:1.45;}
  .howto-v2 .card-what{font-size:12px;line-height:1.5;}

  .fact-strip{font-size:11px;line-height:1.5;border-top:1px solid #aaa;padding:7px 0;width:100%;}
  .card .fact-strip{font-size:10px;line-height:1.4;margin-top:5px;}
  .isolated-letter{display:inline-block;border:1px solid #777;padding:0 12px;margin-right:12px;font-size:48px;}
  .dinosaur-name{font-size:36px;font-weight:750;line-height:1.2;text-align:center;}
  .match-host{height:.8in;width:1.5in;align-self:flex-start;}
  .numeral-reference{font-size:10px;border-top:1px dashed #999;padding-top:5px;}
  .eating-scene{position:relative;width:100%;height:1.95in;}
  .eating-scene>.eating-dino{position:absolute;left:12%;top:0;width:88%;height:100%;}
  .eating-scene>.bite-leaf{position:absolute;left:1%;top:57%;width:20%;height:30%;transform:rotate(-45deg);}
  .eating-scene.triceratops>.bite-leaf{left:4%;top:57%;transform:rotate(45deg);}
  .eating-scene.ankylosaurus>.bite-leaf{top:52%;}
  @media print{@page{size:Letter;margin:0;}body{background:#fff;}.page{margin:0;break-after:page;}.page:last-child{break-after:auto;}}
  @media screen{body{padding:24px 0;}.page{box-shadow:0 8px 34px rgba(70,90,60,.15);border-radius:6px;margin-bottom:24px;}}`
}

export const buildKit = (w) => personalize(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Week ${w.week} Kit — ${esc(w.theme)} (print &amp; play)</title>

<style>${kitCss(w)}</style>
</head><body>
${w.days.map((d) => dayPage(w, d)).join('\n')}
${cardPages(w)}
</body></html>`)

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
let built = 0
const requested = process.argv.find(a=>a.startsWith('--week='))?.split('=')[1]
const selected = weeks.filter(w=>!requested || w.week === Number(requested))
for (const w of selected) {
  const missing = w.days.filter((d) => !d.printable).length
  if (missing) {
    console.warn(`week ${w.week}: ${missing} day(s) missing printable — skipped that page`)
  }
  const nn = String(w.week).padStart(2, '0')
  writeFileSync(join(__dir, `kit-week-${nn}.html`), buildKit(w).replace(/[ \t]+$/gm, ''))
  built++
}
console.log(`Built ${built} kit(s): ${selected.map(w=>'kit-week-'+String(w.week).padStart(2,'0')+'.html').join(', ')} — ${selected.reduce((n,w)=>n+w.days.length,0)} play pages + parent cards.`)

}
