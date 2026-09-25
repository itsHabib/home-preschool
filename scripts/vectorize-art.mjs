// Convert image-model line art to true vector paths; fill enclosed regions for shadows.
import sharp from 'sharp'
import potrace from 'potrace'
import { writeFileSync } from 'node:fs'
const trace = buffer => new Promise((resolve, reject) => potrace.trace(buffer, { threshold: 160, turdSize: 8, optTolerance: .35, color: '#111111', background: 'transparent' }, (e, svg) => e ? reject(e) : resolve(svg)))
for (const id of (process.argv.slice(2).length ? process.argv.slice(2) : ['stegosaurus','triceratops','ankylosaurus','tyrannosaurus','egg','leaf','meat'])) {
  const {data,info} = await sharp(`art/source/${id}.png`).flatten({ background:'#ffffff' }).greyscale().threshold(160).raw().toBuffer({resolveWithObject:true})
  const {width:w,height:h}=info
  const line = await sharp(data,{raw:{width:w,height:h,channels:1}}).png().toBuffer()
  let left=w,top=h,right=0,bottom=0
  for(let i=0;i<data.length;i++)if(data[i]<160){const x=i%w,y=Math.floor(i/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
  const viewBox=`${Math.max(0,left-15)} ${Math.max(0,top-15)} ${right-left+30} ${bottom-top+30}`
  const crop=svg=>svg.replace(/viewBox="[^"]+"/,`viewBox="${viewBox}"`)
  const svg = crop(await trace(line))
  writeFileSync(`art/${id}.svg`,svg.replace('<svg ',`<svg role="img" aria-label="${id} line drawing" `))
  // Flood-fill only the white exterior; all enclosed white interiors become black.
  const outside=new Uint8Array(w*h), queue=new Int32Array(w*h);let head=0,tail=0
  const add=i=>{if(!outside[i]&&data[i]>160){outside[i]=1;queue[tail++]=i}}
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}
  for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
  while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x)add(i-1);if(x<w-1)add(i+1);if(y)add(i-w);if(y<h-1)add(i+w)}
  const mask=Buffer.from(outside,0,outside.length).map(v=>v?255:0)
  const shadow=await trace(await sharp(mask,{raw:{width:w,height:h,channels:1}}).png().toBuffer())
  writeFileSync(`art/${id}-shadow.svg`,crop(shadow).replace('<svg ',`<svg role="img" aria-label="${id} silhouette" `))
  console.log(`Vectorized ${id}`)
}
