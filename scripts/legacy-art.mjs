// Hand-authored legacy species silhouettes; never substitute a plant-eater for a theropod.
import { writeFileSync, existsSync } from 'node:fs'
const shapes={
 brachiosaurus:'M25 88 L30 48 L27 19 Q25 8 36 8 L48 12 L45 24 L39 26 L48 56 Q73 41 102 58 L141 79 L99 68 L102 105 L91 105 L85 78 L66 78 L62 105 L51 105 L52 71 L42 58 L37 89 Z',
 apatosaurus:'M10 54 Q10 43 24 43 L59 63 Q86 49 110 68 Q136 65 157 48 Q148 76 111 78 L107 106 L97 106 L95 81 L77 82 L72 106 L62 106 L61 76 L24 57 Z',
 tyrannosaurus:'M29 18 L58 18 L65 28 L58 39 L41 40 L50 52 L73 56 L115 41 L151 44 L87 69 L78 79 L91 103 L67 103 L65 95 L60 82 L45 82 L41 104 L22 104 L24 95 L36 72 L28 50 L24 42 L11 40 L10 22 Z M40 48 L55 48 L59 57 L51 57 Z',
 allosaurus:'M19 21 L46 15 L60 24 L54 39 L35 42 L50 56 L74 54 L113 37 L154 27 L114 56 L84 71 L71 80 L80 103 L58 104 L58 94 L53 81 L36 80 L29 104 L10 104 L15 96 L26 70 L23 48 L15 41 L7 33 Z M36 47 L52 48 L59 65 L48 64 Z',
 velociraptor:'M12 38 L38 26 L55 28 L61 34 L39 43 L54 56 L78 59 L136 32 L157 28 L122 48 L85 75 L68 81 L85 98 L73 104 L58 93 L51 78 L36 84 L31 103 L10 104 L19 94 L25 72 L32 59 L24 50 Z M48 49 L67 54 L79 72 L67 68 L52 63 Z'
}
for(const [id,path] of Object.entries(shapes)) if(!existsSync(`art/source/${id}.png`)) writeFileSync(`art/${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 116" role="img" aria-label="${id} hand-drawn legacy silhouette"><path d="${path}" fill="#fff" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/><circle cx="${id==='brachiosaurus'?36: id==='apatosaurus'?18:28}" cy="${id==='brachiosaurus'?16:id==='apatosaurus'?49:id==='velociraptor'?36:28}" r="2"/></svg>\n`)
