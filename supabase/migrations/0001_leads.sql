-- Leads from the website, with the POPIA consent record kept beside each one.
-- Run once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.leads (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  form                   text not null,              -- 'estate-check', 'contact', ...
  name                   text not null,
  email                  text not null,
  answers                jsonb,                      -- estate check answers
  score                  smallint,
  marketing_consent      boolean not null default false,
  consent_ip             text,
  consent_user_agent     text,
  privacy_notice_version text,
  status                 text not null default 'new' -- new / contacted / meeting / client / closed
    check (status in ('new','contacted','meeting','client','closed')),
  notes                  text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));

-- Lock it down: row level security ON with no public policies.
-- Only the Netlify function (service role key) and the Supabase dashboard can read or write.
alter table public.leads enable row level security;
