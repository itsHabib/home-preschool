// Actual Chromium screen + print checks, screenshots, and Letter PDFs for human QA.
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {createHash} from 'node:crypto'
const files=process.argv.slice(2)
if(!files.length)throw new Error('Usage: node scripts/verify-print.mjs kit-week-01.html binder.html')
const out=resolve('output/verification');mkdirSync(out,{recursive:true})
const browser=await chromium.launch({headless:true})
const reports=[]
try {
 for(const file of files){
  const name=file.replace(/\.html$/,'');const page=await browser.newPage({viewport:{width:1000,height:1150},deviceScaleFactor:1})
  await page.goto(pathToFileURL(resolve(file)).href);await page.evaluate(()=>document.fonts.ready)
  const report={file,sha256:createHash('sha256').update(readFileSync(file)).digest('hex'),pages:await page.locator('.page').count(),modes:{}}
  for(const mode of ['screen','print']){
   await page.emulateMedia({media:mode})
   report.modes[mode]=await page.locator('.page').evaluateAll(pages=>pages.map((p,i)=>{
    const box=p.getBoundingClientRect(),cs=getComputedStyle(p),bad=[]
    if(Math.abs(box.width-816)>1 || Math.abs(box.height-1056)>1)bad.push({issue:"not US Letter at 96 CSS px/in",width:box.width,height:box.height})
    const inset={left:box.left+parseFloat(cs.paddingLeft),right:box.right-parseFloat(cs.paddingRight),top:box.top+parseFloat(cs.paddingTop),bottom:box.bottom-parseFloat(cs.paddingBottom)}
    for(const el of p.querySelectorAll('*')){
     if(el instanceof SVGElement && el.tagName.toLowerCase()!=='svg')continue
     const r=el.getBoundingClientRect();if(!r.width||!r.height)continue
     if(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1)bad.push({element:el.tagName+'.'+(el.getAttribute('class')??''),issue:'outside page',rect:{x:r.x-box.x,y:r.y-box.y,w:r.width,h:r.height}})
     if(!(el instanceof SVGElement) && (el.scrollHeight>el.clientHeight+2||el.scrollWidth>el.clientWidth+2) && getComputedStyle(el).display!=='inline')bad.push({element:el.tagName+'.'+el.className,issue:'content overflow',scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight]})
    }
    const direct=[...p.children].filter(x=>x.getBoundingClientRect().height)
    for(const el of direct){const r=el.getBoundingClientRect();if(r.bottom>inset.bottom+2)bad.push({element:el.className,issue:'outside print-safe padding'})}
    return {page:i+1,width:box.width,height:box.height,errors:bad}
   }))
   if(mode==='screen')for(let i=0;i<report.pages;i++)await page.locator('.page').nth(i).screenshot({path:resolve(out,`${name}-page-${String(i+1).padStart(2,'0')}.png`)})
  }
  await page.pdf({path:resolve(out,`${name}.pdf`),format:'Letter',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false})
  writeFileSync(resolve(out,`${name}.json`),JSON.stringify(report,null,2)+'\n');reports.push(report);await page.close()
 }
}finally{await browser.close()}
const errors=reports.flatMap(r=>Object.entries(r.modes).flatMap(([mode,pages])=>pages.flatMap(p=>p.errors.map(e=>({file:r.file,mode,page:p.page,...e})))))
console.log(JSON.stringify({files:reports.map(r=>({file:r.file,pages:r.pages})),errors},null,2));process.exitCode=errors.length?1:0
