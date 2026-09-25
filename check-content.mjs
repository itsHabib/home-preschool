import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {checkTree} from './check-tree.mjs'
const root=new URL('.',import.meta.url)
assert.deepEqual(checkTree().errors,[])
const c=JSON.parse(readFileSync(new URL('content.json',root),'utf8'))
assert.equal(c.version,2);assert.equal(c.unit,'U1')
const expected={1:['stegosaurus','S','/s/'],2:['triceratops','T','/t/'],3:['ankylosaurus','A','/a/']}
const allIds=new Set()
for(const w of c.weeks){
 assert.deepEqual([w.dinosaur.id,w.letter.char,w.letter.phoneme],expected[w.week])
 assert(w.dinosaur.sources.length>=2);assert(w.dinosaur.sources.every(s=>s.startsWith('https://')))
 assert.equal(w.days.length,5)
 assert.equal(w.books.length,3,`${w.node}: three book choices`)
 assert.equal(w.songs.length,3,`${w.node}: three real song choices`)
 assert(w.days.filter(d=>/magnet tiles/i.test(d.needs)).length>=2,`${w.node}: tile play on two days`)
 assert(w.days.filter(d=>/playdough|dough/i.test(d.needs)).length>=2,`${w.node}: dough play on two days`)
 assert(!/mouth|no loose parts|no dough pieces|no small magnets|no fasteners|no staples/i.test(JSON.stringify(w)),`${w.node}: superseded materials rule`)
 assert(new Set(w.days.map(d=>d.why)).size===5,`${w.node}: explain each day's purpose`)
 assert.deepEqual(w,JSON.parse(readFileSync(new URL(`weeks-v2/week-0${w.week}.json`,root),'utf8')))
 for(const [i,d] of w.days.entries()){
  assert.equal(d.id,`W${w.week}-D${i+1}`);assert(!allIds.has(d.id));allIds.add(d.id)
  const plan=readFileSync(new URL(`docs/plan/L5/${d.id}.md`,root),'utf8')
  assert.deepEqual(d.milestones,plan.match(/^Serves: (.+)$/m)[1].split(/\s+/))
  assert(plan.includes(`Template: ${d.printable.template}`),`${d.id} template drift`)
  for(const key of ['invitation','decision','harder','exitCheck','needs','cardBlurb','setup','play'])assert(d[key]?.trim(),`${d.id} missing ${key}`)
  assert(/\bor\b/i.test(d.invitation),`${d.id} needs two invitations`)
  assert(d.minutes[0]>=2&&d.minutes[1]<=10&&d.minutes[1]>=d.minutes[0])
  assert(d.exitCheck.endsWith('?'),`${d.id}: optional parent note should be a question`);
  assert(!/record|uncued|independent choice is|next rung|unknown/i.test(d.exitCheck),`${d.id}: use parent language`);
  assert(d.cardBlurb.includes(d.invitation));assert(/Stop on pushback/.test(d.cardBlurb))
  assert(!/draw.the.line|trace|pencil/i.test(d.printable.instruction))
 }
}
console.log(`Content matches ${allIds.size} L5 nodes; decisions, invitations, durations and harder rungs present.`)
