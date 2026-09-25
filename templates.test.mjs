import assert from 'node:assert/strict'
import {renderV2,v2Templates,renderSortMat,buildKit} from './build-kit.mjs'
import {sortSpecies} from './art.mjs'
const w={week:1,dinosaur:{id:'stegosaurus',name:'Stegosaurus',feature:'Back plates and tail spikes.'},letter:{char:'S',phoneme:'/s/'},color:{name:'green',hex:'#4F7942'},theme:'Stegosaurus',days:[]}
for(const template of v2Templates){const html=renderV2({template,params:{soundChoices:['sun','cup']}},w);assert(html.includes('<svg'));assert(!html.includes('undefined'))}
const labels=['brachio','trike','apato','t-rex','allo','raptor']
const items=labels.map((label,i)=>({icon:i%2?'dino-small':'dino-big',label}))
const html=renderSortMat({items},'#4F7942')
assert.equal(new Set(items.map(sortSpecies)).size,6)
for(const item of items)assert(html.includes(`data-species="${sortSpecies(item)}"`))
assert.throws(()=>renderSortMat({items:[{icon:'dino-small',label:'mystery'}]},'#4F7942'),/Ambiguous/)
assert.throws(()=>renderV2({template:'mistyped'},w),/Unknown/)
assert(!buildKit(w).includes('fonts.googleapis'))
console.log('Seven templates render; six old diet tiles map to six species; ambiguous art and unknown templates fail.')

// Reject unsolvable or accidental-answer patterns before a parent can print them.
assert.throws(()=>renderV2({template:'pattern-strip',params:{choices:['leaf','leaf']}},w),/both continuation choices/)
assert.throws(()=>renderV2({template:'pattern-strip',params:{sequence:['leaf','egg','egg','leaf']}},w),/ABAB/)
assert.throws(()=>renderV2({template:'pattern-strip',params:{gaps:2}},w),/one gap/)
const match=renderV2({template:'count-and-match'},w)
assert.equal((match.match(/aria-label="3 eggs"/g)||[]).length,2)
assert.equal((match.match(/aria-label="4 eggs"/g)||[]).length,2)
assert.equal((match.match(/<ellipse /g)||[]).length,14)
assert(!match.includes('fold-band'))
const shadows=renderV2({template:'shadow-match'},w)
for(const species of ['stegosaurus','triceratops','ankylosaurus']) assert(shadows.includes(`${species} silhouette`))
assert(!shadows.includes('egg silhouette'))
const odd=renderV2({template:'odd-one-out'},w)
for(const species of ['stegosaurus','triceratops','ankylosaurus','tyrannosaurus']) assert(odd.includes(`${species} line drawing`))
console.log('Exercise controls: quantity pairs, three dinosaur shadows, four diet choices, and solvable one-gap patterns.')
