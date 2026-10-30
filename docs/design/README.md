# Design direction

Five directions were mocked up on the canvas "Magda Jordaan — 5 website directions":

| | Direction | Look |
|---|---|---|
| A | Sea & Sand | Sand ground, deep sea blue, waves and gulls, large round portrait |
| B | Straight Talk | Near-black editorial page, scarlet accent, "No fine print" |
| C | Forest Ledger | Cream and forest green, botanical silhouettes, printable "first weeks after a death" ledger |
| D | The Life File | Product-led, readiness check in the hero |
| E | Plain Paper | White, black, one red line, numbered sections, published fee table |

Recommendation from the plan: **A or C** for the body, with **D's estate check as the hero** of the home page.

**When Magda chooses:** put screenshots or exported HTML of the chosen direction in this folder
(e.g. `chosen-A-home.png`, `chosen-A.html`) and write the choice below. Claude Code applies it by replacing
the tokens in `src/styles/global.css` and the home page layout.

## Chosen: "Garden" (29 Oct 2026)
Replaces A · Sea & Sand. Calm, botanical and modular: rounded blocks, paper and sage ground, deep green ink,
**Momentum red** (`--momentum`) on everything Momentum Consult / financial planning, gold for prosperity.
Three pillars: Health (red) · Prosperity (gold) · Longevity (green). Plants draw themselves as you scroll (`.grow`, `.bud`).

- Tokens: `src/styles/global.css`
- Hero: Magda's intro with the parrot guide (`src/components/ParrotGuide.tsx`, `src/styles/parrot.css`)
- Centrepiece: the Sunflower in three acts (`src/components/SunflowerTest.tsx`, `src/styles/sunflower.css`)
- Retired and deleted (in git history if ever needed): `EstateCheck.tsx`, `FirstThirtyDays.tsx`, `ReadinessGarden.tsx`, `FeedbackBird.tsx`, `SunflowerField.astro`, `garden.css`, `netlify/functions/feedback.ts`, `0002_feedback.sql`
