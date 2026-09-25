// Assemble only the U1 weeks already built in post-order; no implicit future weeks.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs'
const dir=new URL('./weeks-v2/',import.meta.url)
const weeks=readdirSync(dir).filter(f=>/^week-0[123]\.json$/.test(f)).sort().map(f=>JSON.parse(readFileSync(new URL(f,dir),'utf8')))
writeFileSync(new URL('./content.json',import.meta.url),JSON.stringify({version:2,unit:'U1',calibration:'docs/level-check.md',weeks},null,2)+'\n')
console.log(`Assembled ${weeks.length} built U1 week(s)`)
