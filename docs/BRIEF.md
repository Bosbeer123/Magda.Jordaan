# Brief

Full plan: the Claude doc "Magda Jordaan — website, lead engine and app plan". This is the build summary.

## Positioning
**The adviser who has wound up the estates that bad planning leaves behind.**
A practising deceased-estates attorney and a franchise-principal financial adviser in one person. Nobody else in
Centurion/Pretoria publishes fees, names credentials or speaks plainly. Lead with the estate angle.

## Audience
- **Buyers:** 55+, Centurion / Lyttelton / Irene / Midstream / Pretoria East. On Facebook and WhatsApp, not LinkedIn.
- **Referrers:** adult children, accountants, conveyancers, HR people, undertakers. On LinkedIn.

## Phase 1: website (this repo)
| Page | Path | Status |
|---|---|---|
| Home | `/` | starter copy |
| Financial planning | `/financial-planning` | starter copy |
| Wills & estates | `/wills-and-estates` | starter copy, fee missing |
| Estate readiness check | `/check` | working; questions need Magda's OK; report email in MailerLite |
| Reporting a death | `/report-a-death` | Master's list; under-R250k variant missing |
| Articles | `/articles` | 1 draft example |
| Contact | `/contact` | facts missing |
| Privacy notice | `/privacy` | draft structure |
| PAIA manual | `/paia` | missing |

The estate check is the hero of the home page whichever design wins: it turns a visitor into a lead without Magda doing anything.

## The chain (outside this repo, built next)
Sunday voice note → transcription → Claude drafts 3 posts in her voice → WhatsApp approval ("1" posts, "2" + voice note
to change; every approval logged) → Buffer / LinkedIn API → mirrored to Facebook page and WhatsApp Channel.
Approved articles get committed to `src/content/articles` with `draft: false`, `approvedBy`, `approvedOn` → Netlify rebuilds.

Leads: `/check` → `/api/lead` → Supabase `leads` + MailerLite → 6-email nurture → Cal.com booking → Monday WhatsApp
"three people to phone this week".

## First twelve posts / articles
1. The will in the drawer nobody knew about (story)
2. What "Letters of Executorship" are and why the bank wants them (explainer)
3. Ask Magda: "My father died without a will. What now?"
4. Your beneficiary nomination beats your will (story)
5. Reporting a death to the Master: the documents a family must gather (carousel)
6. Ask Magda: "Who should I make my executor?"
7. Why an estate takes a year, and how to make it months (story)
8. The cash your family needs in the first three months (explainer)
9. Ask Magda: "Do I really need life cover at 58?"
10. Married in community of property? Your will is half the story (story)
11. The estate readiness checklist (carousel; the lead magnet)
12. Ask Magda: "What does an executor actually cost?" (3.5% + VAT, negotiable)

## Phase 2 (Dec–Jan): the app on `app.<domain>`
React/Vite + same Supabase project (upgrade to Pro first). No will builder.
- **Life File**: where the will is, policies, accounts, property, debts, digital accounts, who to phone. Stores locations, not documents (v1). Printable branded pack; yearly nudge.
- **Estate progress tracker**: `/estate/<id>`, magic-link login for families; milestones (reported, Letters issued, creditors advertised, SARS cleared, L&D account lodged, inspection, distribution); Magda updates by WhatsApp.
- Before real client data: Magda registered as Information Officer, operator agreement with Supabase, MFA, retention policy, breach plan.
- Afrikaans/English toggle across site and app.
