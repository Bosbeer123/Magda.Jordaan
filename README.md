# magda-jordaan-web

Website and lead engine for Magda Jordaan, Financial Adviser and attorney, Centurion.

**Astro** static site · **React** for the estate check · **Netlify** hosting and functions · **Supabase** for leads.

```
npm install
npm run dev      # http://localhost:4321
npm run build
```

| Where | What |
|---|---|
| `docs/SETUP.md` | Step-by-step: GitHub org, Supabase, Netlify, domain, MailerLite |
| `docs/BRIEF.md` | What we're building and in what order |
| `docs/COMPLIANCE.md` | FAIS / LPC / POPIA rules and where each is enforced |
| `docs/CONTENT-TODO.md` | Facts still needed from Magda and Momentum Consult |
| `docs/design/` | The chosen design direction |
| `CLAUDE.md` | Instructions Claude Code reads first |
| `src/config/site.ts` | Every fact about Magda, in one place |
| `src/pages/` | One file per page |
| `src/content/articles/` | Articles as Markdown (`draft: true` stays off the live site) |
| `src/components/EstateCheck.tsx` | The estate readiness check |
| `netlify/functions/lead.ts` | `/api/lead`: saves leads + consent to Supabase, adds to MailerLite |
| `supabase/migrations/` | Database tables, run in order |
