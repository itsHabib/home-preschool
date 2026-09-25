# Art library

U1's six source PNGs were generated with the built-in imagegen tool on 2026-09-05 (local date), then converted to true SVG paths with `node scripts/vectorize-art.mjs`. The SVGs do not embed bitmaps. Original model outputs are preserved in `source/`; derived silhouettes fill the closed outline of the same drawing. The transparent leaf source is composited against white for vector conversion.

Source checks: `docs/verification/u1-facts.md`. The agent inspected the generated drawings for the three defining silhouettes: plates and tail spikes, three horns and frill, armor and tail club. Art is stylized, not a scale reconstruction or exact plate-count diagram. A parent's physical print and recognition check is still open.

Prompt prefix: Use case scientific-educational; preschool printable coloring line drawing for SVG conversion. Pure black clean bold smooth outlines on pure white, enclosed white fill areas. Full object centered with white margin; no cropped edges, shadows, textures, shading, scenery, text, labels or watermark. Simple generous coloring spaces; professional natural-history children's illustration.

- **stegosaurus**: one anatomically recognizable Stegosaurus in side view, small low head, large back with upright alternating broad kite-shaped plates, four legs, long tail ending in four spikes. Source: `source/stegosaurus.png`.
- **triceratops**: one anatomically recognizable Triceratops in slight three-quarter side view so exactly three horns are visible: two long brow horns and one short nose horn, a large bony frill behind the head, beak, four sturdy legs, tapering tail. Source: `source/triceratops.png`.
- **ankylosaurus**: one anatomically recognizable Ankylosaurus in side view, low broad four-legged body, bony armor scutes across back, squat wide head with small cheek horns, long tail ending in one large rounded bony club. No Stegosaurus upright plates, no huge shoulder spikes. Source: `source/ankylosaurus.png`.
- **egg**: one simple generic uncracked egg, oval with slightly narrower upper end, no spots, no nest, no species-specific claim. Source: `source/egg.png`.
- **leaf**: one simple generic leaf symbol with a central vein and short stem, no flowers, no background. Source: `source/leaf.png`.
- **meat**: one simple generic pretend meat steak symbol, rounded outer edge with one small round bone cross-section inside, friendly non-graphic food pictogram, no blood. Source: `source/meat.png`.

`sun`, `cup`, `sock`, `ball`, `towel`, and `apple` are hand-authored SVG pictograms (`scripts/prop-art.mjs`). Brachiosaurus, Apatosaurus, Tyrannosaurus, Allosaurus and Velociraptor are distinct hand-authored legacy illustrations (`scripts/legacy-art.mjs`), retained only to repair the old sort-mat renderer. They are not U1 dinosaur choices or new planned weeks. `sortSpecies` maps the old labels to these species explicitly; an ambiguous dinosaur tile fails instead of silently showing a different species.

## U1 review round 1

T. rex now uses an image-model source (`source/tyrannosaurus.png`) and traced SVG, replacing the legacy hand-authored drawing for a consistent four-dinosaur choice set. Prompt: one isolated full-body Tyrannosaurus rex facing left; pure white background, clean black contours, no shading/text/scenery; large head, tiny two-fingered arms, muscular hind legs, horizontal body and balancing tail; friendly coloring-book style. Inspected for recognizable head, arms and tail before tracing.

Mini-book eating scenes arrange the existing editable SVG dinosaur and leaf at its mouth in HTML/CSS. They are pretend feeding illustrations, not fossil habitat reconstructions. `legacy-art.mjs` preserves any species with an image-model source; it cannot replace the new T. rex accidentally.
