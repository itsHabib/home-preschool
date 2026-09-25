# Design notes: why the weeks look like this

This is the second version of the kit. The first one was a set of eight
themed weeks built from six printable templates. It was run with a real
three-year-old for a few weeks, and the feedback shaped everything here.

## What the first version got wrong

1. **The pictures lied.** The "leaf-eaters vs meat-eaters" sort mat had only two
   dinosaur drawings, so a "T. rex" tile was drawn as a triceratops. The page was
   wrong, not the child. The fix was one clear drawing per dinosaur, which became
   the whole point of v2.
2. **Repetitive, and the child never had to think.** Every week was a shuffle of the
   same six templates, and every page handed over the answer ("dab one dot per
   egg"). There was no activity where the child had to *choose* something.
3. **The floor was set too low.** A match that needs a decision (count this, find
   the card with the same amount) was more fun than any page in the packet, and
   the child could already do more than the pages asked.

## The shape

**One dinosaur per week. Its first letter is the letter of the week.** Everything
in the week hangs off that dinosaur: how to say it, what it ate, where it lived,
one wow fact, its coloring page, and, ideally, a toy version on the table all week.

| Wk | Dinosaur | Say it | Letter (sound) | Ate | Stand-out feature |
|----|----------|--------|----------------|-----|-------------------|
| 1 | Stegosaurus | STEG-oh-SORE-us | **S** /s/ | plants | back plates, spiky tail |
| 2 | Triceratops | try-SAIR-uh-tops | **T** /t/ | plants | three horns, frill |
| 3 | Ankylosaurus | ANG-kih-loh-SORE-us | **A** /a/ as in *ankle* | plants | armor, club tail |
| 4 | Parasaurolophus | PAIR-uh-SORE-OL-uh-fus | **P** /p/ | plants | head crest, honks |
| 5 | Iguanodon | ig-WAH-nuh-don | **I** /i/ as in *it* | plants | thumb spike |
| 6 | Tyrannosaurus rex | tie-RAN-oh-SORE-us | **T** again, first blending week | **meat** | tiny arms, huge teeth |
| 7 | Diplodocus | dih-PLOD-uh-kus | **D** /d/ | plants | whip tail, longest |
| 8 | Velociraptor | vuh-LOSS-ih-RAP-tor | **V** /v/ | **meat** | sickle claw, feathers |

Weeks 1–3 (Unit 1) are built and print-checked. Weeks 4–8 are planned at the
unit level in `curriculum-tree.md` and get detailed only after the first unit has
been run and the level check repeated.

**Why these letters and not the child's name.** Most three-year-olds do not
recognise letters yet, so there is nothing to build on there. The child's name
runs alongside as a thread instead: it is printed on every play page for optional
finger exploration, never as a week's target. **S, A, T, P, I** are the first five
letters of every synthetic-phonics program (the SATPIN set), because with just
those five sounds a child can blend real words: *sat, sit, tap, tip, pat, pit, at,
it, sip.* By week 6 a child can be sounding out "sit" with letter tiles. That is
the road to reading, and the dinosaurs happen to line up with it. T. rex sits at
week 6 on purpose: it is the first *meat-eater* after five plant-eaters, so "which
one eats meat?" becomes a real question with a memorable answer, and the repeated
T lets that week be a blending week instead of a new-letter week.

Adjust the list to whatever toy dinosaurs you actually have. A dinosaur in the
hand beats a dinosaur on paper.

## Every activity has a decision moment

The v2 rule: **no page tells the child the answer.** Each activity has one
decision only the child can make, plus a harder rung written on the parent card
for when they are still hungry.

- **Count-and-match**: cards with egg groups; the child pairs the card with the
  same amount. Ladder: dots-to-dots → dots-to-numeral → numeral-to-toys-in-hand
  ("give me 4").
- **Odd one out**: four dinosaurs, one is the meat-eater. The child picks it and
  says why.
- **Shadow match**: dinosaur silhouettes to their pictures. It forces a look at
  *shape* (plates vs horns vs crest), which is how the eats-meat/eats-plants
  confusion goes away.
- **What's missing**: line up four or five toy dinosaurs, the child closes their
  eyes, one vanishes. Which one? Working memory plus naming.
- **Pattern strips**: ABAB, then ABC, with magnet tiles or dinosaurs. The child
  places the next one.
- **Magnet-tile builds**: a fence taller than the stegosaurus, a pen that fits
  exactly 3 eggs, the letter S out of tiles. Measuring: "how many tiles tall is
  triceratops?"
- **Feed the dino**: a plate with N leaves or N steaks; the plant-eater gets leaves,
  the meat-eater gets meat, *and* the right amount.
- **Coloring page** of the week's dinosaur, with its name in big letters and the
  week's letter set apart.
- **Sound hunt**: two spoken words, "which one starts with /s/?" Then oral
  blending: "s…un, what did I say?"
- **Mini-book**: a four-panel adult-read book that grows with the letters taught.
  Week 1 is picture-plus-one-caption; by week 6 it is "Sam sat. Tip sat. Sit,
  Sam!" with the dinosaur as the character.

Repetition still happens, but on purpose: the *skill* repeats, the *dinosaur and
the puzzle* change.

## What stays from the first version

- The strands and the ladders in `CURRICULUM.md`. The ladders were right; the
  starting rung was too low.
- One printable page a day, sheet-protector reusable, fridge cards.
- Books and songs per week, hands-on first, pencils never.
- The `weeks-v2/` → `build.mjs` / `build-kit.mjs` pipeline. v2 adds templates and a
  per-dinosaur art library; it does not throw the generator away.

## How a unit gets built

1. **Art first.** One clear line drawing per dinosaur, plus eggs, leaf and meat.
   The line art is generated with an image model, checked by a person ("does this
   actually look like an ankylosaurus?"), then traced to SVG.
2. **Templates** in `build-kit.mjs` for the activity types above.
3. **Week content** in `weeks-v2/`, at the level the latest level check says.
4. **Regenerate** the binder and kits, print week 1, run it, and revise from the
   first week's notes before touching the next unit.

## Unit 1 decisions

- The focal dinosaur is the weekly star. The other Unit 1 dinosaurs and T. rex may
  appear as contrast choices; this does not introduce their names as phonics
  targets or imply they lived together.
- Playdough, magnet tiles, building bricks, crayons, cut cards, clips and rings are
  normal materials with a parent present. Magnet-tile builds and playdough are core
  play every week, not rewards.
- Coloring pages give the dinosaur most of the page, with a large name and a
  pronunciation/diet/period/feature strip. Sound games live on the parent card and
  in the adult-read mini-book.
- Cards use plain invitations, a clear setup, one optional question about what
  happened, and one extension. Three real books and three real songs make a basket
  to choose from, not a daily checklist.
- No draw-the-line work until the child can draw a controlled line (milestone M1
  in the tree).
