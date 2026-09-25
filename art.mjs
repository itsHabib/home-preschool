import { readFileSync, existsSync } from 'node:fs'
const cache = new Map()
export function art(id, {shadow=false, className='', flip=false}={}) {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`Invalid art id: ${id}`)
  const key = `${id}${shadow?'-shadow':''}`
  if(!cache.has(key)) {
    const path=new URL(`./art/${key}.svg`,import.meta.url)
    if(!existsSync(path)) throw new Error(`Missing species art: ${key}`)
    cache.set(key,readFileSync(path,'utf8').replace(/ width="[^"]*"| height="[^"]*"/g,''))
  }
  return cache.get(key).replace('<svg ',`<svg class="art ${className}"${flip?' style="transform:scaleX(-1)"':''} `)
}
const aliases={brachio:'brachiosaurus',brachiosaurus:'brachiosaurus',apato:'apatosaurus',apatosaurus:'apatosaurus',trike:'triceratops',triceratops:'triceratops','t-rex':'tyrannosaurus','t. rex':'tyrannosaurus','t rex':'tyrannosaurus',tyrannosaurus:'tyrannosaurus',allo:'allosaurus',allosaurus:'allosaurus',raptor:'velociraptor',velociraptor:'velociraptor'}
export function sortSpecies(item) {
  if(item.species) return item.species
  const name=String(item.label??'').trim().toLowerCase()
  if(aliases[name]) return aliases[name]
  // Old size-only sorts make no species claim; retain their generic size drawings.
  if(['big','little','tall','baby','big dino','baby dino','tiny','huge'].includes(name)) return null
  if(['dino-big','dino-small'].includes(item.icon)) throw new Error(`Ambiguous dinosaur tile "${item.label}"; supply species`)
  return null
}
