# Magda Jordaan — website and lead engine

Public website for Magda Jordaan (Financial Adviser at Momentum Consult, and admitted attorney), Lyttelton, Centurion.
Built and maintained by Tyrone. **Completely separate from Onside / OnsideOS**: never import from, link to or share
a database with any Onside project.

Read first: `docs/BRIEF.md` (what we're building), `docs/COMPLIANCE.md` (rules that are never broken),
`docs/CONTENT-TODO.md` (facts still missing). The chosen design direction goes in `docs/design/`.

## Stack
- **Astro** (static site) on **Netlify**. Pages are `.astro` files in `src/pages`; every page is pre-rendered HTML so Google can read it.
- **React** only for interactive pieces ("islands"), e.g. `src/components/EstateCheck.tsx` loaded with `client:load`. Do not turn whole pages into React.
- **Articles** are Markdown files in `src/content/articles` (schema in `src/content.config.ts`). `draft: true` never reaches the live site.
- **Netlify Functions** in `netlify/functions` for anything that needs a secret (e.g. `/api/lead`).
- **Supabase** (own project, EU region) for leads. SQL changes go in `supabase/migrations/NNNN_name.sql`, numbered, never edited after they've been run.
- Phase 2 (Dec–Jan): Life File and estate tracker as a separate React/Vite app on `app.` subdomain, same Supabase project.

## Rules
1. All facts about Magda (phone, address, wording of the FSP footer) come from `src/config/site.ts`. Never hard-code them in pages.
2. Never write "independent" anywhere. Use "objective advice across a range of providers, including Momentum and Sanlam".
3. Every page uses `layouts/Base.astro` (it carries the FSP footer). Pages about wills, estates or trusts pass `legal` to show the non-FAIS flag.
4. No projected returns, no "best"/"leading"/"superior", no comparisons with other advisers or firms, no client names or photos, no fear-selling.
5. Any form that collects personal info: marketing consent is a separate, **unticked** checkbox; link the privacy notice at the form; store the consent record (see `0001_leads.sql`).
6. Never put a secret key in `src/` or `public/` (they ship to the browser). Secrets live in Netlify env vars only.
7. Voice: short sentences, "I" not "we", plain South African English, warm and direct. Readers are often 55+: 18px base font, high contrast, big buttons.
8. Run `npm run build` before saying a change is done; it must pass.

## Commands
- `npm install` · `npm run dev` (http://localhost:4321) · `npm run build` · `npm run preview`
- Test the lead form locally with the Netlify CLI: `npx netlify dev` (needs `.env`, see `.env.example`).
