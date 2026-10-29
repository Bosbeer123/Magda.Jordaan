# Compliance rules (never broken)

The website and every social post are **advertisements** under the FAIS General Code of Conduct (s14).
Momentum Consult must sign off the site and the social-media process before launch.

| Rule | In practice | Where it lives in code |
|---|---|---|
| Never "independent" (General Code s3(5)) | Say "objective advice across a range of providers, including Momentum and Sanlam" | CLAUDE.md rule 2 |
| FSP identified on every page (s4, s14) | FSP footer text | `compliance.fspFooter` in `src/config/site.ts`, rendered by `Base.astro` |
| Advertising (s14, 2020) | Factual, balanced, plain; no projected returns; no belittling other providers; genuine testimonials only, marked "not financial advice"; keep every post 5 years; documented approval | `approvedBy` / `approvedOn` in article front matter; approval log in the WhatsApp pipeline |
| Non-FAIS services flagged (s7(5)) | Legal work is by M Jordaan Attorney, a separate practice, not FSCA-regulated | `compliance.legalServicesFlag`; `legal` prop on pages |
| Attorney publicity (LPC Code paras 7–8, 18) | No disparaging comparisons, no "superior", no client names without written consent; no referral fees between the law practice and the FSP | Copy review |
| Momentum social-media policy | General information only, disclaimer, logo/advert approval, sign-off if Tyrone runs accounts, no client photos or tags | `compliance.postDisclaimer` under every post |
| POPIA direct marketing (amended regs, 17 Apr 2025) | Opt-in for email/WhatsApp marketing; separate **unticked** box; privacy notice at the point of collection; unsubscribe in every email; keep consent records | `EstateCheck.tsx` form; `leads` consent columns |
| POPIA security (s19, s21, s22) | RLS on; secrets only in Netlify env; operator agreement with Supabase; breach notification plan | `0001_leads.sql`; Phase 2 checklist in BRIEF.md |

**Post disclaimer** (under every LinkedIn/Facebook post, automatically):
> General information only, not financial or legal advice. Magda Jordaan is a representative of Momentum Consult (Pty) Ltd, an authorised FSP (5503), and an admitted attorney.
