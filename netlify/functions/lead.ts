// POST /api/lead : stores a lead and its POPIA consent record in Supabase.
// Runs on Netlify (server side), so the Supabase service key never reaches the browser.
// Env vars (Netlify > Site configuration > Environment variables): see .env.example.

type Lead = {
  form?: string;
  name?: string;
  email?: string;
  phone?: string;
  answers?: Record<string, string>;
  score?: number;
  marketingConsent?: boolean;
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return json(503, { error: 'Lead storage not configured yet' });

  let body: Lead;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 200);
  const name = String(body.name ?? '').trim().slice(0, 120);
  const phone = String(body.phone ?? '').replace(/[^\d+ ]/g, '').trim().slice(0, 20);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneOk = phone.replace(/\D/g, '').length >= 9;
  // A call-back needs a phone number; everything else needs an email. Name always.
  if (!name || (body.form === 'callback' ? !phoneOk : !emailOk)) return json(400, { error: 'Name and a way to reach you are required' });
  // Answers are small key/value pairs; cap them so nobody can post a novel.
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(body.answers ?? {}).slice(0, 30)) answers[String(k).slice(0, 40)] = String(v).slice(0, 300);
  if (phone) answers.phone = phone;

  const row = {
    form: String(body.form ?? 'unknown').slice(0, 40),
    name,
    email: emailOk ? email : '',
    answers: Object.keys(answers).length ? answers : null,
    score: typeof body.score === 'number' ? body.score : null,
    marketing_consent: body.marketingConsent === true,
    consent_ip: req.headers.get('x-nf-client-connection-ip') ?? null,
    consent_user_agent: (req.headers.get('user-agent') ?? '').slice(0, 300),
    privacy_notice_version: process.env.PRIVACY_NOTICE_VERSION ?? 'unset',
  };

  const res = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      // Legacy service_role keys are JWTs and go in both headers; new sb_secret_ keys go in apikey only.
      ...(key.startsWith('eyJ') ? { authorization: `Bearer ${key}` } : {}),
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error('Supabase insert failed', res.status, await res.text());
    return json(502, { error: 'Could not save' });
  }

  // Optional: add to MailerLite. The report sequence is triggered by the group;
  // the articles group only when the person ticked the consent box.
  const ml = process.env.MAILERLITE_API_KEY;
  if (ml && emailOk) {
    const groups = [process.env.MAILERLITE_GROUP_REPORT];
    if (row.marketing_consent) groups.push(process.env.MAILERLITE_GROUP_ARTICLES);
    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: { authorization: `Bearer ${ml}`, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ email, fields: { name, estate_score: row.score }, groups: groups.filter(Boolean) }),
    });
    if (!mlRes.ok) console.error('MailerLite failed', mlRes.status, await mlRes.text());
  }

  return json(200, { ok: true });
};

export const config = { path: '/api/lead' };
