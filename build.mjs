// Builds binder.html from content.json (the workflow-generated dino weeks).
// Re-runnable: tweak this file and `node build.mjs` to regenerate the binder.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { art } from './art.mjs'
import { personalize } from './child.mjs'

const __dir = dirname(fileURLToPath(import.meta.url))
const parsed = JSON.parse(readFileSync(join(__dir, 'content.json'), 'utf8'))
const weeks = parsed.result?.weeks ?? parsed.weeks
weeks.sort((a, b) => a.week - b.week)

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

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

// ---------- dinosaur art (SVG, tinted to any color) ----------
const footprint = (color, size = 26) => `<svg class="fp" width="${size}" height="${size * 1.1}" viewBox="0 0 40 44" fill="${color}" aria-hidden="true"><ellipse cx="20" cy="30" rx="10" ry="9"/><ellipse cx="11" cy="14" rx="3.4" ry="6"/><ellipse cx="20" cy="10" rx="3.4" ry="6.5"/><ellipse cx="29" cy="14" rx="3.4" ry="6"/></svg>`

const brachiosaurus = (color, size = 128) => {
  const belly = shade(color, .24), deep = shade(color, -.2)
  return `<svg width="${size}" height="${size * 0.64}" viewBox="0 0 150 96" aria-hidden="true">
    <path d="M96 60 Q 132 55 146 74 Q 126 64 98 68 Z" fill="${color}"/>
    <ellipse cx="78" cy="58" rx="34" ry="21" fill="${color}"/>
    <ellipse cx="78" cy="64" rx="26" ry="12" fill="${belly}"/>
    <rect x="54" y="70" width="11" height="23" rx="5.5" fill="${deep}"/>
    <rect x="88" y="70" width="11" height="23" rx="5.5" fill="${deep}"/>
    <rect x="68" y="72" width="11" height="21" rx="5.5" fill="${color}"/>
    <rect x="100" y="72" width="11" height="21" rx="5.5" fill="${color}"/>
    <path d="M50 50 Q 32 42 30 16 Q 30 6 40 7 Q 44 26 62 44 Z" fill="${color}"/>
    <ellipse cx="34" cy="14" rx="12" ry="9.5" fill="${color}"/>
    <ellipse cx="21" cy="17" rx="6" ry="4.6" fill="${color}"/>
    <circle cx="37" cy="11" r="2.1" fill="#3B322E"/></svg>`
}

const triceratops = (color, size = 128) => {
  const belly = shade(color, .24), deep = shade(color, -.2), horn = '#F4EAD8'
  return `<svg width="${size}" height="${size * 0.66}" viewBox="0 0 140 92" aria-hidden="true">
    <path d="M92 56 Q 118 54 128 66 Q 112 60 94 62 Z" fill="${color}"/>
    <ellipse cx="74" cy="52" rx="32" ry="20" fill="${color}"/>
    <ellipse cx="74" cy="58" rx="25" ry="12" fill="${belly}"/>
    <rect x="54" y="66" width="11" height="22" rx="5.5" fill="${deep}"/>
    <rect x="84" y="66" width="11" height="22" rx="5.5" fill="${deep}"/>
    <rect x="66" y="68" width="11" height="20" rx="5.5" fill="${color}"/>
    <rect x="94" y="68" width="11" height="20" rx="5.5" fill="${color}"/>
    <path d="M54 34 Q 40 18 24 26 Q 15 35 22 50 Q 32 60 50 56 Q 54 46 54 34 Z" fill="${deep}"/>
    <ellipse cx="32" cy="48" rx="16" ry="13" fill="${color}"/>
    <path d="M16 50 Q 7 52 11 59 Q 18 56 22 54 Z" fill="${deep}"/>
    <path d="M22 40 Q 20 30 26 30 Q 28 38 27 43 Z" fill="${horn}"/>
    <path d="M31 33 Q 29 15 37 13 Q 41 26 38 38 Z" fill="${horn}"/>
    <path d="M38 35 Q 38 20 45 19 Q 47 30 44 40 Z" fill="${horn}" opacity="0.9"/>
    <circle cx="31" cy="46" r="2" fill="#3B322E"/></svg>`
}

const stegosaurus = (color, size = 128) => {
  const belly = shade(color, .24), deep = shade(color, -.2), plate = shade(color, -.34)
  return `<svg width="${size}" height="${size * 0.6}" viewBox="0 0 152 90" aria-hidden="true">
    <path d="M106 54 Q 132 52 144 60 Q 128 58 108 60 Z" fill="${color}"/>
    <path d="M136 55 l 9 -7 M139 60 l 10 -3" stroke="${deep}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="76" cy="54" rx="34" ry="19" fill="${color}"/>
    <ellipse cx="76" cy="60" rx="26" ry="11" fill="${belly}"/>
    <rect x="54" y="66" width="11" height="20" rx="5.5" fill="${deep}"/>
    <rect x="88" y="66" width="11" height="20" rx="5.5" fill="${deep}"/>
    <rect x="66" y="68" width="11" height="18" rx="5.5" fill="${color}"/>
    <rect x="98" y="68" width="11" height="18" rx="5.5" fill="${color}"/>
    <path d="M42 52 Q 26 50 22 58 Q 32 63 46 60 Z" fill="${color}"/>
    <ellipse cx="28" cy="55" rx="8" ry="6" fill="${color}"/>
    <circle cx="25" cy="54" r="1.7" fill="#3B322E"/>
    <path d="M54 38 l 6 -15 l 7 15 Z" fill="${plate}"/>
    <path d="M68 34 l 7 -18 l 8 18 Z" fill="${plate}"/>
    <path d="M84 35 l 7 -16 l 7 16 Z" fill="${plate}"/>
    <path d="M98 39 l 6 -13 l 6 13 Z" fill="${plate}"/></svg>`
}

const nest = (color, size = 120) => {
  const deep = shade(color, -.22), egg = shade(color, .34)
  return `<svg width="${size}" height="${size * 0.72}" viewBox="0 0 130 94" aria-hidden="true">
    <ellipse cx="47" cy="54" rx="15" ry="19" fill="${egg}" stroke="${deep}" stroke-width="2"/>
    <ellipse cx="76" cy="52" rx="15" ry="19" fill="${egg}" stroke="${deep}" stroke-width="2"/>
    <ellipse cx="61" cy="46" rx="15" ry="19" fill="${color}" stroke="${deep}" stroke-width="2"/>
    <circle cx="60" cy="42" r="2.4" fill="${deep}"/><circle cx="66" cy="53" r="2" fill="${deep}"/><circle cx="55" cy="50" r="2" fill="${deep}"/>
    <path d="M20 66 Q 61 86 102 66 Q 111 75 98 82 Q 61 98 24 82 Q 11 75 20 66 Z" fill="${deep}"/></svg>`
}

const heroDino = (n, color) => {
  if (n === 3) return nest(color, 118)
  if (n === 8) return `<span class="duo">${brachiosaurus(color, 94)}${triceratops(shade(color, -.06), 100)}</span>`
  if (n === 4 || n === 7) return triceratops(color, 122)
  if (n === 5 || n === 6) return stegosaurus(color, 126)
  return brachiosaurus(color, 130) // weeks 1, 2, default
}

const squiggle = (color) => `<svg class="squiggle" viewBox="0 0 210 9" fill="none" aria-hidden="true">
  <path d="M2 6 Q 16 1 30 6 T 58 6 T 86 6 T 114 6 T 142 6 T 170 6 T 198 6" stroke="${color}" stroke-width="3" stroke-linecap="round"/></svg>`

// ---------- week page ----------
const renderWeek = (w) => {
  const accent = w.color.hex, aink = ink(accent)
  const days = w.days.map((d) => `
      <div class="day">
        <span class="day-tab">${esc(d.day)}</span>
        <div class="day-title">${esc(d.title)}</div>
        <div class="day-what">${esc(d.invitation ?? d.what)}</div>
        <div class="day-skill"><b>{{name}} decides:</b> ${esc(d.decision ?? d.hiddenSkill)}<br><em><b>If welcome:</b> ${esc(d.harder ?? d.why)}</em></div>

      </div>`).join('')
  const books = w.books.map((b) => `<li><b>${esc(b.title)}</b> · ${esc(b.author)}<em>${esc(b.note)}</em></li>`).join('')
  const songs = w.songs.map((s) => `<li>${esc(s)}</li>`).join('')
  const mats = w.materials.map((m) => `<li>${esc(m)}</li>`).join('')

  return `
  <section class="page week" style="--accent:${accent};--aink:${aink}">
    <header class="wk-head">
      <div>
        <span class="eyebrow">Week ${w.week} &nbsp;·&nbsp; {{name}}'s Dino Preschool</span>
        <h1>${esc(w.theme)}</h1>
        <div class="subtitle">${esc(w.tagline)}</div>
        ${w.dinosaur ? `<div class="dino-fact">${esc(w.dinosaur.say)} · Ate ${esc(w.dinosaur.diet)} · ${esc(w.dinosaur.era)}<br>${esc(w.dinosaur.feature)}</div>` : ''}
        ${squiggle(accent)}
      </div>
      <div class="wk-hero">${w.dinosaur ? art(w.dinosaur.id) : heroDino(w.week, accent)}</div>
    </header>

    <div class="focus">
      <div class="focus-pill">
        <div class="focus-label">This week's letter</div>
        <div class="focus-big">${esc(w.letter.char)}</div>
        <div class="focus-sub">${esc(w.letter.sound)}</div>
      </div>
      <div class="focus-pill">
        <div class="focus-label">This week's number idea</div>
        <div class="focus-sub big-sub">${esc(w.number.focus)}</div>
      </div>
      <div class="focus-pill">
        <div class="focus-label">Color of the week</div>
        <div class="focus-big"><span class="swatch"></span>${esc(w.color.name)}</div>
        <div class="focus-sub"><b>Big idea:</b> ${esc(w.bigIdea)}</div>
      </div>
    </div>

    <div class="grownup">
      <div><span class="gu-label">Letter tip</span>${esc(w.letter.hint)}</div>
      <div><span class="gu-label">Number tip</span>${esc(w.number.parentTip)}</div>
    </div>

    <h2 class="section-h">${footprint(accent, 18)}Five gentle activities — one a day</h2>
    <div class="days">${days}</div>

    <div class="foot">
      <div class="foot-card"><div class="foot-title">Book basket · pick one</div><ul class="books">${books}</ul></div>
      <div class="foot-card"><div class="foot-title">Songs · pick one</div><ul>${songs}</ul></div>
      <div class="foot-card"><div class="foot-title">You'll need</div><ul>${mats}</ul></div>
    </div>


  </section>`
}

// ---------- cover ----------
const dots = weeks.map((w) => `<span class="wk-dot" style="background:${w.color.hex}" title="Week ${w.week}"></span>`).join('')
const cover = `
  <section class="page cover">
    <div class="cover-dinos">${weeks.map(w=>`<div>${art(w.dinosaur.id)}</div>`).join('')}</div>
    <span class="cover-eyebrow">A gentle home preschool for {{name}}</span>
    <h1 class="cover-title">{{name}} <span>&amp;</span> the Dinosaurs</h1>
    <div class="cover-sub">Unit 1 · Plant-eaters with armor<br>${weeks.length} ${weeks.length===1?'week':'weeks'} ready for play</div>
    <div class="cover-dots">${dots}</div>
    <div class="cover-foot">${footprint('#7C9473', 18)} {{name}} can choose a dinosaur picture to explore, or a book to share.</div>
  </section>`

// ---------- how to use ----------
const howto = `
  <section class="page howto">
    <span class="eyebrow">{{NAME}} · Start here</span>
    <h1 class="howto-h1">Set it out. Play nearby.</h1>
    <p class="lead">Offer the day's two invitations and let {{name}} choose either, or neither. Hands first on the floor for <b>2–10 minutes</b>. Stop when {{they}} push{{es}} back. One page and one parent card is plenty; no pencils, sitting lessons or finishing requirement.</p>
    <div class="rhythm-card"><div class="rc-title">A day can be this simple</div><div class="rc-flow">A book · play together · outside · one small invitation · another book</div></div>
    <div class="three">
      <div class="three-card"><div class="tc-h">Talk and listen</div>Name the dinosaur and notice what {{name}} notices. Let {{them}} point, gesture, or talk. Adults read all book captions in Unit 1.</div>
      <div class="three-card"><div class="tc-h">Sounds first</div>Start from zero. Unit 1 introduces S /s/, T /t/, A /a/ within the initial s a t p i n set. Use sounds, not letter names; clip /t/ without an added “uh.” Oral blending comes before letter-tile words. Tricky words wait until R4, two at a time.</div>
      <div class="three-card"><div class="tc-h">Quantity means something</div>Start with 3–4 objects. Let {{name}} select the equal set or stop at the requested amount. Five is a stretch only when four is secure. Numerals ride along without testing.</div>
    </div>
    <div class="worksheet-note"><b>Hands and thinking.</b> Matching means pairing, placing or pointing; no draw-the-line pages before M1. Invite free circular hand movement and an optional fat-crayon circle. No hand guidance. Finger movement is practice, not evidence that M0 is met. Patterns leave the next item for {{name}} to choose.</div>
    <p class="lead"><b>Prepare once.</b> Print US Letter at 100%, browser headers/footers off. Adult cuts the pieces described on each card. Playdough, magnet tiles, Lego, crayons, clips and rings are fine with a parent present. A sheet protector or washable mat makes dough cleanup easy. {{NAME}} is on each page for optional finger exploration.</p>
    <p class="lead"><b>Notice without testing.</b> If you want to remember something after play, use the short question on the card. Skip it whenever you like. Let {{them}} say no and come back another day. Run the play checks in the level check, then a Week 1 observation, before planning the next unit.</p>
    <div class="closing">{{name}}'s choice today: a picture game, or round play beside a dinosaur. A harder rung is on every day's card if {{they}} want{{s}} more.</div>
  </section>`

// ---------- the two ladders ----------
const numRungs = [
  ['6', 'Add within 5 with objects — optional stretch', ''],
  ['5', 'Compare groups: more, fewer, same', ''],
  ['4', 'Connect written numerals to quantity', 'later — rides along casually'],
  ['3', 'Stop at 5 from a larger pile', 'Next'],
  ['2', 'Count 1–4 objects with meaning', 'Start here'],
  ['1', 'One touch per number word; separate rote counting', ''],
]
const letRungs = [
  ['6', 'Read decodable sentences and tell what happened'],
  ['5', 'Build and read CVC words; tricky words from R4'],
  ['4', 'Blend spoken sounds before word tiles'],
  ['3', 'Connect the first six sounds to s a t p i n'],
  ['2', 'Hear first sounds in familiar spoken words'],
  ['1', 'Enjoy books and notice print — no letters known yet'],
]
const numLadder = numRungs.map((r) => `
    <div class="rung ${r[2] === 'Start here' ? 'here' : ''} ${r[2] === 'Next' ? 'next' : ''} ${/later/.test(r[2]) ? 'later' : ''}">
      <span class="rung-n">${r[0]}</span><span class="rung-t">${esc(r[1])}</span>
      ${r[2] ? `<span class="rung-tag">${esc(r[2])}</span>` : ''}
    </div>`).join('')
const letLadder = letRungs.map((r) => `
    <div class="rung"><span class="rung-n">${r[0]}</span><span class="rung-t">${esc(r[1])}</span></div>`).join('')

const ladders = `
  <section class="page ladders">
    <span class="eyebrow" style="background:#F3E4B8;color:#8a6d16">{{NAME}} · Where we start</span>
    <h1 class="howto-h1">Small steps, one rung at a time</h1>
    ${squiggle('#E7B84B')}
    <p class="lead">They aren't competing, so run both every week (that's how the weeks are built). The order that <b>does</b> matter is <b>within</b> each skill — climb one rung at a time. Unit 1 assumes a starting point of counting <b>1–4 objects with meaning</b>, no letters recognized yet, and no circle drawn yet. Run the level check first; start where {{name}} is, and let {{their}} response set the next rung.</p>
    <div class="ladder-wrap">
      <div class="ladder"><div class="ladder-h">The Number Ladder</div>${numLadder}</div>
      <div class="ladder"><div class="ladder-h">The Letter Ladder</div>${letLadder}</div>
    </div>
    <div class="ladder-foot">{{name}} can choose dot cards or a pile of blocks. {{Their}} decision: which has the same amount? If four is comfortable and {{they}} want{{s}} more, offer five. Numerals ride along without testing.</div>
  </section>`

const css = `
:root{--paper:#FBF7EF;--card:#FFFFFF;--ink:#3B322E;--ink-soft:#6E645D;--sage:#7C9473;--sage-deep:#5F7757;--gold:#E7B84B;--line:#EAE1D2;--accent:#7C9473;--aink:#fff;}
*{box-sizing:border-box;}html,body{margin:0;padding:0;}
body{background:var(--paper);color:var(--ink);font-family:"Nunito","Segoe UI",system-ui,sans-serif;line-height:1.42;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
h1,h2,.eyebrow,.day-tab,.focus-label,.foot-title,.rc-title,.tc-h,.ladder-h,.cover-title,.howto-h1{font-family:"Baloo 2","Segoe UI",system-ui,sans-serif;}
.page{width:8.5in;height:11in;margin:0 auto;padding:0.5in 0.55in;background:var(--paper);position:relative;overflow:visible;}
.eyebrow{display:inline-block;font-weight:700;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--aink);background:var(--accent);padding:4px 12px;border-radius:999px;}
.squiggle{display:block;width:210px;height:9px;margin-top:6px;}
.closing{margin-top:14px;text-align:center;font-family:"Baloo 2",sans-serif;font-weight:600;font-size:13px;color:var(--ink-soft);background:color-mix(in srgb, var(--accent) 12%, #fff);border-radius:12px;padding:9px 14px;}
.fp{vertical-align:middle;}
.week .section-h{margin-bottom:4px;}
.wk-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px;}
.wk-head h1{font-size:34px;line-height:1.03;margin:8px 0 2px;color:var(--ink);}
.subtitle{font-size:13.5px;color:var(--ink-soft);font-style:italic;font-weight:600;}
.wk-hero{flex:0 0 auto;padding-top:6px;}
.duo{display:flex;align-items:flex-end;gap:2px;}
.focus{display:flex;gap:9px;margin:6px 0 10px;}
.focus-pill{flex:1;border:1.5px solid var(--line);border-top:4px solid var(--accent);border-radius:14px;padding:9px 12px 10px;background:var(--card);}
.focus-label{font-size:9.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);}
.focus-big{font-family:"Baloo 2",sans-serif;font-weight:700;font-size:26px;line-height:1.05;margin-top:1px;color:var(--accent);display:flex;align-items:center;gap:7px;}
.focus-pill:nth-child(3) .focus-big{font-size:17px;}
.swatch{width:16px;height:16px;border-radius:50%;background:var(--accent);border:1.5px solid rgba(0,0,0,.08);}
.focus-sub{font-size:11px;color:var(--ink-soft);margin-top:3px;line-height:1.3;}
.focus-sub.big-sub{font-size:12px;color:var(--ink);font-weight:600;margin-top:2px;}
.grownup{display:grid;grid-template-columns:1fr 1fr;gap:9px;background:#F3EEE2;border-radius:12px;padding:9px 12px;margin-bottom:12px;font-size:10.8px;color:var(--ink-soft);line-height:1.36;}
.gu-label{display:inline-block;font-family:"Baloo 2",sans-serif;font-weight:700;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--sage-deep);background:#E7EFDE;padding:1px 7px;border-radius:999px;margin-right:5px;}
.section-h{font-family:"Baloo 2",sans-serif;font-weight:700;font-size:14px;color:var(--ink);display:flex;align-items:center;gap:8px;margin:0 0 8px;}
.days{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:10px;}
.day{border:1.5px solid var(--line);border-radius:14px;background:var(--card);padding:9px 12px 10px;break-inside:avoid;}
.day:last-child{grid-column:1 / -1;}
.day-tab{display:inline-block;font-family:"Baloo 2",sans-serif;font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--aink);background:var(--accent);padding:2px 10px;border-radius:999px;}
.day-title{font-family:"Baloo 2",sans-serif;font-weight:700;font-size:15px;margin:6px 0 3px;color:var(--ink);}
.day-what{font-size:11.5px;color:var(--ink);line-height:1.4;}
.day-skill{margin-top:4px;font-size:10px;color:var(--sage-deep);line-height:1.35;border-top:1px dashed var(--line);padding-top:4px;}
.day-skill em{color:var(--ink-soft);}
.day-kit{margin-top:5px;font-family:"Baloo 2",sans-serif;font-weight:600;font-size:10px;color:var(--aink);background:var(--accent);border-radius:999px;padding:2px 10px;display:inline-block;}
.foot{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:9px;margin-bottom:4px;}
.foot-card{border:1.5px solid var(--line);border-radius:14px;background:var(--card);padding:9px 12px 10px;break-inside:avoid;}
.foot-title{font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--sage-deep);margin-bottom:5px;}
.foot-card ul{margin:0;padding-left:15px;font-size:10.8px;color:var(--ink);line-height:1.45;}
.foot-card li{margin-bottom:3px;}.foot-card .books li{margin-bottom:5px;}
.foot-card em{display:block;color:var(--ink-soft);font-size:9.7px;line-height:1.3;}
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 50% 24%, #FFFDF8, var(--paper));}
.cover-dinos{display:flex;gap:10px;align-items:flex-end;margin-bottom:18px;}
.cover-eyebrow{font-family:"Baloo 2",sans-serif;font-weight:600;font-size:13px;letter-spacing:.22em;text-transform:uppercase;color:var(--sage-deep);}
.cover-title{font-size:62px;line-height:1.2;margin:14px 0 4px;color:var(--ink);font-weight:700;}
.cover-title span{color:var(--gold);}
.cover-sub{font-size:17px;color:var(--ink-soft);font-weight:600;line-height:1.5;max-width:6.4in;}
.cover-dots{display:flex;gap:9px;margin:32px 0 28px;}
.wk-dot{width:20px;height:20px;border-radius:50%;box-shadow:0 1px 0 rgba(0,0,0,.06);}
.cover-foot{display:flex;align-items:center;gap:8px;font-family:"Baloo 2",sans-serif;font-weight:600;font-size:13px;color:var(--ink-soft);}
.howto-h1{font-size:34px;margin:8px 0 2px;color:var(--ink);}
.lead{font-size:14px;line-height:1.55;color:var(--ink);margin:12px 0 16px;}
.rhythm-card{background:#F3EEE2;border-radius:16px;padding:13px 16px;margin-bottom:16px;}
.rc-title{font-weight:700;font-size:14px;color:var(--sage-deep);margin-bottom:8px;}
.rc-title span{font-family:"Nunito",sans-serif;font-weight:600;font-size:12px;color:var(--ink-soft);font-style:italic;}
.rc-flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;color:var(--ink);font-weight:600;}
.rc-flow i{color:var(--gold);font-style:normal;font-weight:800;}
.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;margin-bottom:15px;}
.three-card{border:1.5px solid var(--line);border-radius:14px;background:var(--card);padding:12px 13px;font-size:11.8px;line-height:1.45;color:var(--ink);}
.tc-h{font-family:"Baloo 2",sans-serif;font-weight:700;font-size:14px;color:var(--sage-deep);margin-bottom:5px;}
.worksheet-note{background:#FBEEE6;border:1.5px solid #F3D6C9;border-radius:14px;padding:11px 14px;font-size:12px;line-height:1.5;color:var(--ink);}
.ladder-wrap{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:6px;}
.ladder-h{font-size:16px;color:var(--ink);margin-bottom:9px;text-align:center;}
.rung{display:flex;align-items:center;gap:10px;border:1.5px solid var(--line);border-radius:12px;background:var(--card);padding:9px 12px;margin-bottom:7px;position:relative;}
.rung-n{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:#EFE7D6;color:var(--ink-soft);font-family:"Baloo 2",sans-serif;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;}
.rung-t{font-size:12px;color:var(--ink);font-weight:600;line-height:1.3;}
.rung-tag{position:absolute;right:10px;top:-9px;font-family:"Baloo 2",sans-serif;font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:2px 9px;border-radius:999px;background:var(--sage);color:#fff;}
.rung.here{border-color:var(--sage);background:#EEF3E8;}.rung.here .rung-n{background:var(--sage);color:#fff;}
.rung.next{border-color:var(--gold);background:#FBF3DC;}.rung.next .rung-n{background:var(--gold);color:#6a5312;}.rung.next .rung-tag{background:var(--gold);color:#6a5312;}
.rung.later .rung-tag{background:#D8C4B0;color:#5a4636;}
.ladder-foot{margin-top:14px;background:#F3EEE2;border-radius:12px;padding:11px 14px;font-size:12px;line-height:1.5;color:var(--ink);text-align:center;}
.art{width:100%;height:100%;display:block;} .cover-dinos>div{width:1.8in;height:1.6in;} .wk-hero{width:1.5in;height:1.1in;} .week .closing{font-size:11px;padding:6px 10px;margin-top:8px;} .week .day-title{font-size:14px;} .dino-fact{font-size:10px;line-height:1.5;margin-top:5px;} .days .day-what{font-size:10.5px;} .day-skill{font-size:9px;} .focus{margin-bottom:10px;} .focus-sub{font-size:10px;} .grownup{font-size:10px;} h1{font-size:28px;}
@media screen{body{padding:26px 0;}.page{box-shadow:0 8px 34px rgba(70,90,60,.15);border-radius:6px;margin-bottom:26px;}}
@media print{@page{size:Letter;margin:0;}body{background:#fff;}.page{box-shadow:none;border-radius:0;margin:0;break-after:page;}.page:last-child{break-after:auto;}}
`

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{name}} &amp; the Dinosaurs — Home Preschool Binder</title>

<style>${css}</style>
</head><body>
${cover}
${howto}
${ladders}
${weeks.map(renderWeek).join('\n')}
</body></html>`

writeFileSync(join(__dir, 'binder.html'), personalize(html).replace(/[ \t]+$/gm, ''))
console.log(`Built binder.html — cover + how-to + ladders + ${weeks.length} dino weeks (${weeks.reduce((n, w) => n + w.days.length, 0)} activities).`)
