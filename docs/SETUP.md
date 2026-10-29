# Setup guide — step by step

Do these in order. Each step ends with a check so you know it worked.
Time: about 1½ hours for steps 1–5. Step 6 (MailerLite) can wait.

**Accounts belong to Magda's business.** Where you can, sign up with an email for her website work
(e.g. her own address, or a new one like `web@<herdomain>` once the domain exists) and add yourself as admin.
Keep every password in a password manager and share it with her.

---

## 1. Run it on your laptop

1. Check Node: open PowerShell and run `node -v`. You need **v22.23 or newer** (v24 is fine).
   If it's older, install the LTS from nodejs.org.
2. In PowerShell:
   ```
   cd $HOME\Projects\magda-jordaan-web
   npm install
   npm run dev
   ```
3. Open http://localhost:4321

**Check:** the home page shows "The adviser who has wound up the estates…" and the estate check works
(the email step will say "Something went wrong" until step 3 and 4 are done; that's expected).

---

## 2. GitHub: new organisation and repo

1. github.com → your avatar (top right) → **Your organizations** → **New organization** → **Free**.
   - Name: `magda-jordaan` (or similar). Contact email: Magda's. "Belongs to: My personal account" is fine for now; you can transfer ownership to her later.
2. In the new org: **Repositories → New repository**
   - Name: `website` · **Private** · do **not** add a README, .gitignore or licence (the project has them).
3. Back in PowerShell, in the project folder:
   ```
   git init
   git add .
   git commit -m "Launch pad: Astro site, estate check, lead function, docs"
   git branch -M main
   git remote add origin https://github.com/magda-jordaan/website.git
   git push -u origin main
   ```
   (Change `magda-jordaan` to the org name you picked.)

**Check:** the repo page on GitHub shows the files, and there is **no `.env` file** in the list.

---

## 3. Supabase: a separate organisation and project

Do **not** add this to the Onside organisation or the OnsideAPP project.

1. supabase.com/dashboard → organisation dropdown (top left) → **New organization**
   - Name: `Magda Jordaan` · Type: Personal/Company · Plan: **Free**
2. **New project**
   - Name: `magda-jordaan-web`
   - Database password: generate one, save it in your password manager
   - Region: **Central EU (Frankfurt)** or **West EU (London)** (closest to SA with GDPR protection; the privacy notice says EU)
3. When it's ready: **SQL Editor → New query** → paste everything from `supabase/migrations/0001_leads.sql` → **Run**.
4. **Project Settings → API keys** → copy:
   - the **Project URL** (`https://xxxx.supabase.co`)
   - the **secret** key (`sb_secret_…`; or under "Legacy API keys", the `service_role` key)

**Check:** **Table Editor** shows a `leads` table with a lock icon / "RLS enabled".

> Free projects pause after a week with no activity. That's fine while building. Upgrade to **Pro** before the
> Life File (Phase 2) stores real client data, for backups and no pausing.

---

## 4. Netlify: connect the repo and deploy

1. app.netlify.com → **Add new project → Import an existing project → GitHub**.
   - When GitHub asks which repositories Netlify may see, choose **Only select repositories** → `magda-jordaan/website`
     (you may need to click **Configure the Netlify app on GitHub** and grant access to the new org).
2. Build settings are read from `netlify.toml`. Leave them as they are.
3. Before the first deploy (or right after): **Project configuration → Environment variables → Add**:
   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | Project URL from step 3 |
   | `SUPABASE_SERVICE_ROLE_KEY` | secret key from step 3 (tick **Contains secret values**) |
   | `PRIVACY_NOTICE_VERSION` | `2026-10-draft` |
4. **Deploys → Trigger deploy → Deploy project**. Rename the site under **Project configuration → Change project name**
   (e.g. `magda-jordaan` → `magda-jordaan.netlify.app`).

**Check:** open the `.netlify.app` link, do the estate check with your own email, submit → "Thank you".
In Supabase **Table Editor → leads** your row is there, with the consent fields filled in.

From now on: every `git push` to `main` redeploys the site automatically.

---

## 5. The domain

1. Check and register **magdajordaan.co.za** (first choice; `.com` as a backup) at any SA registrar
   (e.g. Afrihost, Xneelo, Domains.co.za). The **registrant must be Magda**, not you or Onside.
   You only need the domain, not their hosting.
2. Netlify → **Domain management → Add a domain** → `magdajordaan.co.za` → follow the steps.
   Easiest: let Netlify manage DNS and change the nameservers at the registrar to the four Netlify gives you.
   Add `www` too; Netlify redirects one to the other and issues the HTTPS certificate itself.
3. If the domain ends up different, change it in `astro.config.mjs` (`site:`) and `public/robots.txt`, then push.

**Check:** https://magdajordaan.co.za loads with the padlock (DNS can take a few hours).

> Want her email on the domain later (magda@…)? Google Workspace or Microsoft 365 add MX records in Netlify DNS.
> Don't do this before checking whether Momentum Consult requires her to use her Consult email for client work.

---

## 6. MailerLite (when the report email is written)

1. mailerlite.com → free account in Magda's name.
2. **Subscribers → Groups**: create `Estate check report` and `Articles`. Copy each group's ID.
3. **Integrations → API → Generate new token**.
4. Add to Netlify env vars: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_REPORT`, `MAILERLITE_GROUP_ARTICLES`. Redeploy.
5. **Automations → New**: trigger "joins group `Estate check report`" → the report email, then the 6-week sequence.
6. Add a custom field `estate_score` (number) so the email can mention the score.

**Check:** do the estate check again → you appear in MailerLite and receive the report.

---

## 7. Working with Claude Code

Open the project folder in Claude Code. It reads `CLAUDE.md` automatically. Good first prompts:

- "Read docs/BRIEF.md and docs/design/. Apply direction **[A/C/…]** to the starter site: replace the tokens in
  `src/styles/global.css` and the home page layout. Keep every rule in CLAUDE.md."
- "Write the next article from the twelve-post list in docs/BRIEF.md as a draft in src/content/articles."

Before launch, go through `docs/CONTENT-TODO.md` until there is nothing in [BRACKETS] left:
`npm run build` then search the `dist` folder for `[`.
