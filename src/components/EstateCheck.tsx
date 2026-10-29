import { useState } from 'react';

// DRAFT questions: Magda to approve wording. Outputs are gaps and questions only,
// never product recommendations (FAIS: information, not advice).
const QUESTIONS = [
  { id: 'will', q: 'Do you have a signed will made in the last five years?', gap: 'Your will is missing or out of date.' },
  { id: 'will_location', q: 'Does someone you trust know exactly where the original will is?', gap: 'Nobody knows where the original will is. Banks and the Master need the original, not a copy.' },
  { id: 'executor', q: 'Have you named an executor, and have they agreed?', gap: 'No agreed executor. The Master may appoint one, and the family may have to provide security.' },
  { id: 'beneficiaries', q: 'Have you checked the beneficiaries on your policies and retirement funds in the last two years?', gap: 'Beneficiary nominations not checked. They override your will, so the wrong name means the wrong person gets paid.' },
  { id: 'marriage', q: 'Do you know whether you are married in or out of community of property, and how that affects your estate?', gap: 'Your marital regime and its effect on the estate are unclear.' },
  { id: 'cash', q: 'Would your family have cash to live on for three months while the estate is frozen?', gap: 'Your family may have no cash for the first months. Bank accounts are frozen when someone dies.' },
  { id: 'children', q: 'If you have children under 18, have you named a guardian and arranged how their money will be held? (No young children? Answer yes.)', gap: 'No guardian or trust for minor children. Their money could end up in the Guardian\'s Fund until they turn 18.' },
  { id: 'list', q: 'Is there one list of your accounts, policies, debts and passwords that your family can find?', gap: 'No single list of your affairs. Families lose months, and sometimes money, searching for accounts.' },
] as const;

type Answer = 'yes' | 'no' | 'unsure';
type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function EstateCheck() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketing, setMarketing] = useState(false); // POPIA: unticked by default
  const [status, setStatus] = useState<Status>('idle');

  const answered = Object.keys(answers).length;
  const done = answered === QUESTIONS.length;
  const score = QUESTIONS.filter((x) => answers[x.id] === 'yes').length;
  const gaps = QUESTIONS.filter((x) => answers[x.id] && answers[x.id] !== 'yes');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ form: 'estate-check', name, email, answers, score, marketingConsent: marketing }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="estate-check">
      <ol className="questions">
        {QUESTIONS.map((x) => (
          <li key={x.id}>
            <p>{x.q}</p>
            <div className="choices" role="radiogroup" aria-label={x.q}>
              {(['yes', 'no', 'unsure'] as Answer[]).map((a) => (
                <button
                  type="button"
                  key={a}
                  role="radio"
                  aria-checked={answers[x.id] === a}
                  className={answers[x.id] === a ? 'chosen' : ''}
                  onClick={() => setAnswers({ ...answers, [x.id]: a })}
                >
                  {a === 'yes' ? 'Yes' : a === 'no' ? 'No' : 'Not sure'}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="card result" aria-live="polite">
        {!done && <p className="muted">{answered} of {QUESTIONS.length} answered</p>}
        {done && (
          <>
            <h2>Your score: {score} out of {QUESTIONS.length}</h2>
            {gaps.length === 0 ? (
              <p>Your family is in a better position than most. Check it again once a year.</p>
            ) : (
              <>
                <p>The gaps your family would face today:</p>
                <ul>{gaps.map((g) => <li key={g.id}>{g.gap}</li>)}</ul>
              </>
            )}
          </>
        )}
      </div>

      {done && status !== 'sent' && (
        <form className="card" onSubmit={submit}>
          <h2>Get your full report by email</h2>
          <p className="muted">What each gap means for your family, and what to do about it.</p>
          <label htmlFor="ec-name">Your name</label>
          <input id="ec-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <label htmlFor="ec-email">Your email</label>
          <input id="ec-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <label className="check-row">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            <span>Also send me Magda's articles by email (about twice a month). I can unsubscribe at any time.</span>
          </label>
          <p className="small muted">
            I use your details to send your report. See the <a href="/privacy">privacy notice</a>.
          </p>
          <button className="btn" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Email me my report'}
          </button>
          {status === 'error' && <p role="alert">Something went wrong. Please try again, or phone me.</p>}
        </form>
      )}
      {status === 'sent' && <p className="card">Thank you. Your report is on its way to {email}.</p>}
    </div>
  );
}
