import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/sunflower.css';

/*
  The Sunflower — Magda's centrepiece.
  Act 1 · Your plan today: direct questions. Every yes grows the sunflower; the score fills.
  Act 2 · What if…: pick "I pass away", "I can't work" or "Critical illness". The months play out.
          Every gap in the plan is an event: petals fall, the head droops, the sky clouds over.
  Act 3 · Fix it: tick the fixes (tagged Momentum Consult or M Jordaan Attorney), replay, it stands tall.
          Then: send the plan to Magda on WhatsApp, or by email.

  DRAFT WORDING — Magda approves every line (docs/CONTENT-TODO.md). Information, not advice.
*/

type Pillar = 'health' | 'prosperity' | 'longevity';
type Val = 'yes' | 'part' | 'no' | 'na';
type By = 'momentum' | 'attorney';
type Opt = { id: string; label: string; val?: Val };
type Q = { id: string; q: string; pillar?: Pillar; points?: number; by?: By; fix?: string; opts: Opt[] };

const PERSON: Record<string, string> = {
  wife: 'your wife', husband: 'your husband', partner: 'your partner', daughter: 'your daughter', son: 'your son', friend: 'your friend',
};

const QS: Q[] = [
  { id: 'who', q: 'First, who is your person? The one who makes the calls if something happens to you.',
    opts: [{ id: 'wife', label: 'My wife' }, { id: 'husband', label: 'My husband' }, { id: 'partner', label: 'My partner' },
      { id: 'daughter', label: 'My daughter' }, { id: 'son', label: 'My son' }, { id: 'friend', label: 'A friend' }] },
  { id: 'cash', pillar: 'prosperity', points: 12, by: 'momentum', fix: 'Three months of living money where {who} can reach it',
    q: 'Could {who} pay R40\u00a0000 next week without your bank card?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'n', label: 'No', val: 'no' }, { id: 'u', label: 'Not sure', val: 'no' }] },
  { id: 'will', pillar: 'longevity', points: 16, by: 'attorney', fix: 'A current will, with the original where {who} can find it',
    q: 'Do you have a will, and does {who} know where the original is?',
    opts: [{ id: 'y', label: 'Yes, and they know where', val: 'yes' }, { id: 'hidden', label: 'Yes, but nobody knows where', val: 'part' },
      { id: 'old', label: 'Yes, but it’s over five years old', val: 'part' }, { id: 'n', label: 'No will', val: 'no' }] },
  { id: 'executor', pillar: 'longevity', points: 8, by: 'attorney', fix: 'An executor who has said yes, and a back-up',
    q: 'Has your executor said yes, out loud?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'n', label: 'Not asked / none named', val: 'no' }] },
  { id: 'benef', pillar: 'prosperity', points: 10, by: 'momentum', fix: 'Every policy and fund paying the right person',
    q: 'Checked who your policies and retirement funds pay out to, in the last two years?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'n', label: 'No', val: 'no' }, { id: 'na', label: 'I have none', val: 'na' }] },
  { id: 'cover', pillar: 'prosperity', points: 12, by: 'momentum', fix: 'Life cover that clears the bond and debts',
    q: 'If you died tomorrow, would your life cover clear the bond and your debts?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'p', label: 'Partly', val: 'part' }, { id: 'n', label: 'No', val: 'no' }, { id: 'na', label: 'No debts', val: 'na' }] },
  { id: 'income', pillar: 'health', points: 12, by: 'momentum', fix: 'Income protection if you can’t work',
    q: 'If you couldn’t work for a year, would a monthly income still come in?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'n', label: 'No', val: 'no' }, { id: 'na', label: 'I’m retired', val: 'na' }] },
  { id: 'dread', pillar: 'health', points: 10, by: 'momentum', fix: 'A lump sum if you’re diagnosed with a critical illness',
    q: 'Cancer, a heart attack, a stroke: is there a lump sum that pays out on diagnosis?',
    opts: [{ id: 'y', label: 'Yes', val: 'yes' }, { id: 'n', label: 'No', val: 'no' }, { id: 'u', label: 'Not sure', val: 'no' }] },
  { id: 'medical', pillar: 'health', points: 10, by: 'momentum', fix: 'Gap cover next to your medical aid',
    q: 'Would a specialist and hospital bill be covered: medical aid and gap cover?',
    opts: [{ id: 'y', label: 'Both', val: 'yes' }, { id: 'p', label: 'Medical aid only', val: 'part' }, { id: 'n', label: 'Neither', val: 'no' }] },
  { id: 'kids', pillar: 'longevity', points: 10, by: 'attorney', fix: 'A guardian and a trust for your children, in your will',
    q: 'Children under 18: does your will name a guardian and set up a trust?',
    opts: [{ id: 'y', label: 'Both', val: 'yes' }, { id: 'p', label: 'Guardian only', val: 'part' }, { id: 'n', label: 'Neither', val: 'no' }, { id: 'na', label: 'No young children', val: 'na' }] },
  { id: 'dogs', q: 'Last one. Who feeds the dogs on a bad day?',
    opts: [{ id: 'agreed', label: 'Someone has agreed' }, { id: 'sort', label: 'We’d sort it out' }, { id: 'none', label: 'No pets' }] },
];
const SCORED = QS.filter((q) => q.points);
const QBY: Record<string, Q> = Object.fromEntries(QS.map((q) => [q.id, q]));

type Tone = 'good' | 'bad' | 'mild' | 'note';
type Beat = { at: string; text: string; tone: Tone; hurt: number; q?: string };
type Scenario = { id: string; label: string; intro: string; beats: (v: (id: string) => Val | undefined, who: string) => Beat[] };

const sentence = (t: string) => t.replace(/(^|[.!?] )([a-z])/g, (_m, a: string, c: string) => a + c.toUpperCase());
const B = (at: string, tone: Tone, text: string, q?: string): Beat => ({
  at, tone, text: sentence(text), q, hurt: tone === 'bad' ? (q ? (QBY[q].points ?? 10) / 100 * 1.7 : .12) : tone === 'mild' ? (q ? (QBY[q].points ?? 10) / 100 * .8 : .06) : tone === 'good' ? -.03 : 0,
});

const SCENARIOS: Scenario[] = [
  { id: 'death', label: 'I pass away', intro: 'It’s a Tuesday. You don’t come home.',
    beats: (v, who) => {
      const out: Beat[] = [];
      out.push(v('cash') === 'yes' ? B('Day 1', 'good', `${who} pays the funeral from money in their own name.`, 'cash')
        : B('Day 1', 'bad', `The bank freezes the accounts in your name. The funeral goes on a credit card.`, 'cash'));
      const w = v('will');
      out.push(w === 'yes' ? B('Week 2', 'good', 'The original will goes to the Master. Your wishes stand.', 'will')
        : w === 'part' ? B('Week 2', 'mild', 'The will is missing or out of date. Weeks of searching and arguing.', 'will')
        : B('Week 2', 'bad', 'No will. The law decides who inherits, not you.', 'will'));
      out.push(v('executor') === 'yes' && w !== 'no' ? B('Week 2', 'good', 'Your executor reports the estate within 14 days.', 'executor')
        : B('Week 2', 'bad', w === 'no' ? 'Nobody is named to wind up the estate. The Master must appoint someone.' : 'Your executor hears it first at the funeral, and hesitates.', 'executor'));
      const be = v('benef');
      if (be === 'yes') out.push(B('Month 2', 'good', `The policy pays ${who} directly, outside the estate.`, 'benef'));
      if (be === 'no') out.push(B('Month 2', 'bad', 'The policy pays the name on an old form.', 'benef'));
      const c = v('cover');
      if (c === 'yes') out.push(B('Month 3', 'good', `Life cover clears the bond. The house stays with ${who}.`, 'cover'));
      if (c === 'part') out.push(B('Month 3', 'mild', `Debts are paid from the estate first. ${who} gets what’s left.`, 'cover'));
      if (c === 'no') out.push(B('Month 3', 'bad', 'Debts come first. The house may have to be sold.', 'cover'));
      const k = v('kids');
      if (k === 'yes') out.push(B('Month 6', 'good', 'The guardian you chose raises the children. The trust pays school fees.', 'kids'));
      if (k === 'part') out.push(B('Month 6', 'mild', 'The children’s money waits in the Guardian’s Fund and is paid out at 18.', 'kids'));
      if (k === 'no') out.push(B('Month 6', 'bad', 'No guardian named. A court may decide who raises your children.', 'kids'));
      return out;
    } },
  { id: 'disability', label: 'I can’t work any more', intro: 'An accident. You’re alive, but you can’t work.',
    beats: (v, who) => {
      const out: Beat[] = [];
      const m = v('medical');
      out.push(m === 'yes' ? B('Week 1', 'good', 'Hospital and specialists covered.', 'medical')
        : m === 'part' ? B('Week 1', 'mild', 'Specialists charge more than medical aid pays. The shortfall is yours.', 'medical')
        : B('Week 1', 'bad', 'The hospital bill comes out of savings.', 'medical'));
      const i = v('income');
      if (i === 'yes') out.push(B('Month 1', 'good', 'Income protection starts paying. The household carries on.', 'income'));
      if (i === 'no') out.push(B('Month 1', 'bad', 'Your salary stops. The bond doesn’t.', 'income'));
      if (i === 'na') out.push(B('Month 1', 'note', 'Your pension carries on.'));
      out.push(v('cash') === 'yes' ? B('Month 3', 'good', `${who} has money to bridge the gap.`, 'cash')
        : B('Month 3', 'bad', 'No emergency money. The credit card takes the strain.', 'cash'));
      if (i === 'no') out.push(B('Month 6', 'bad', `${who} goes back to work, or the house goes on the market.`, 'income'));
      return out;
    } },
  { id: 'illness', label: 'A critical illness', intro: 'A diagnosis on a Thursday afternoon.',
    beats: (v, who) => {
      const out: Beat[] = [];
      const d = v('dread');
      out.push(d === 'yes' ? B('Month 1', 'good', 'A lump sum pays out: treatment, travel, time to heal.', 'dread')
        : B('Month 1', 'bad', 'The extras of treatment come from savings.', 'dread'));
      const m = v('medical');
      out.push(m === 'yes' ? B('Month 1', 'good', 'Medical aid and gap cover carry the hospital bills.', 'medical')
        : m === 'part' ? B('Month 2', 'mild', 'Specialist shortfalls arrive every month.', 'medical')
        : B('Month 2', 'bad', 'Every specialist visit is paid in cash.', 'medical'));
      const i = v('income');
      if (i === 'yes') out.push(B('Month 3', 'good', 'Income keeps coming while you recover.', 'income'));
      if (i === 'no') out.push(B('Month 3', 'bad', `Months off work, no income. ${who} carries everything.`, 'income'));
      out.push(v('cash') === 'yes' ? B('Month 6', 'good', 'Savings are dented, not gone.', 'cash')
        : B('Month 6', 'bad', 'The savings are gone.', 'cash'));
      return out;
    } },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const say = (t: string, who: string) => t.replace(/\{Who\}/g, cap(who)).replace(/\{who\}/g, who);

function useTween(value: number, ms = 900) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const t0 = performance.now(), a = from.current; let raf = 0;
    const f = (now: number) => { const t = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - t, 3); const x = a + (value - a) * e; setV(x); from.current = x; if (t < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf);
  }, [value]);
  return v;
}

/* ── The flower ─────────────────────────────────────────── */
const PETALS = 22;
const SEEDS = Array.from({ length: 90 }, (_, i) => { const a = i * 2.39996, r = 2.9 * Math.sqrt(i); return [Math.cos(a) * r, Math.sin(a) * r, 1.15 + (i / 90) * .9]; });

function Sunflower({ growth, vitality, mood }: { growth: number; vitality: number; mood: 'calm' | 'storm' | 'sun' }) {
  // growth 0..1 = how tall; vitality 0..1 = how upright / how many petals
  const g = Math.max(.08, growth);
  const vit = Math.max(0, Math.min(1, vitality));
  const height = 70 + g * 300;
  const droop = (1 - vit) * 1;                         // 0 upright … 1 hanging
  const baseX = 210, baseY = 470;
  const hx = baseX + droop * 70, hy = baseY - height + droop * 60;
  const c1x = baseX - 10, c1y = baseY - height * .45;
  const c2x = baseX + droop * 10, c2y = hy + 40 + droop * 30;
  const headRot = droop * 62;
  const headScale = .35 + g * .65;
  const petalsShown = Math.round(PETALS * Math.min(1, vit * 1.08));
  const petalColor = vit > .55 ? '#F5B800' : vit > .3 ? '#E2A92E' : '#C59A4A';
  const leafDroop = droop * 28;
  const sky = mood === 'storm' ? ['#AEB9BC', '#D6DCD7'] : vit < .5 ? ['#C9D3D2', '#E6E9DF'] : ['#F7E6B5', '#EEF2E2'];
  const sunOpacity = mood === 'storm' ? .15 : .35 + vit * .65;
  const leafAt = (t: number) => ({ x: baseX + (c1x - baseX) * t * .6 + droop * 20 * t, y: baseY - height * t });

  return (
    <svg className="sf-svg" viewBox="0 0 420 520" preserveAspectRatio="xMidYMax slice" role="img" aria-label={`A sunflower: ${vit > .7 ? 'standing tall' : vit > .4 ? 'drooping' : 'wilting'}`}>
      <defs>
        <linearGradient id="sf-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" className="sf-stop" style={{ stopColor: sky[0] }} /><stop offset="1" className="sf-stop" style={{ stopColor: sky[1] }} />
        </linearGradient>
        <linearGradient id="tPF" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#E58A00" /><stop offset=".45" stopColor="#F7B500" /><stop offset="1" stopColor="#FFD84A" /></linearGradient>
        <linearGradient id="tPB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#C96E00" /><stop offset="1" stopColor="#EDA400" /></linearGradient>
        <radialGradient id="tD"><stop offset="0" stopColor="#22140A" /><stop offset=".55" stopColor="#3C2410" /><stop offset=".85" stopColor="#5E4119" /><stop offset="1" stopColor="#8B6A22" /></radialGradient>
        <radialGradient id="sf-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#FFE08A" stopOpacity=".9" /><stop offset="1" stopColor="#FFE08A" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x="0" y="0" width="420" height="520" fill="url(#sf-sky)" />
      <g className="sf-sun" style={{ opacity: sunOpacity }}>
        <circle cx="330" cy="92" r="80" fill="url(#sf-glow)" />
        <circle cx="330" cy="92" r="30" fill="#F7C948" />
      </g>
      <g className={`sf-clouds ${mood === 'storm' ? 'is-on' : ''}`}>
        <path d="M250 110 a26 26 0 0 1 50 -10 a22 22 0 0 1 40 12 a18 18 0 0 1 -4 36 h-82 a20 20 0 0 1 -4 -38z" fill="#8E9A9C" />
        <path d="M70 70 a20 20 0 0 1 38 -8 a17 17 0 0 1 30 10 a14 14 0 0 1 -3 28 h-62 a16 16 0 0 1 -3 -30z" fill="#9FAAAB" />
      </g>
      {mood === 'storm' && <g className="sf-rain" stroke="#7E8B8D" strokeWidth="2" strokeLinecap="round">{Array.from({ length: 14 }, (_, i) => <line key={i} x1={60 + i * 24} y1={150 + (i % 3) * 20} x2={54 + i * 24} y2={166 + (i % 3) * 20} style={{ animationDelay: `${(i % 5) * .15}s` }} />)}</g>}

      {/* ground */}
      <path d="M0 468 C 100 452, 200 462, 280 470 S 380 478, 420 464 V 520 H 0 Z" fill="#B5CDAF" />
      <path d="M0 488 C 120 474, 260 494, 420 482 V 520 H 0 Z" fill="#9DBE97" />
      {[30, 70, 330, 372].map((x, i) => <path key={i} d={`M${x} 478 q 3 -14 ${i % 2 ? 7 : -5} -20 M${x + 7} 478 q 0 -11 5 -16`} stroke="#6F9A6C" strokeWidth="2" fill="none" strokeLinecap="round" />)}

      {/* stem */}
      <path d={`M${baseX} ${baseY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${hx} ${hy}`} fill="none" stroke="#4E8B3A" strokeWidth={6 + g * 4} strokeLinecap="round" />
      {/* leaves */}
      {[.32, .55].map((t, i) => {
        const p = leafAt(t), side = i === 0 ? -1 : 1;
        return (
          <g key={i} className="sf-leaf" style={{ transform: `translate(${p.x}px, ${p.y}px) rotate(${side * (35 + leafDroop)}deg) scale(${Math.min(1, g * 1.4)})` }}>
            <path d={`M0 0 C ${side * 14} -30, ${side * 50} -40, ${side * 80} -22 C ${side * 70} -2, ${side * 60} 18, ${side * 34} 22 C ${side * 18} 22, ${side * 6} 12, 0 0 Z`} fill={i ? '#5E9C47' : '#4E8B3A'} />
            <path d={`M0 0 C ${side * 24} -4, ${side * 50} -10, ${side * 74} -20 M${side * 30} -6 l ${side * 8} -14 M${side * 48} -10 l ${side * 6} 14`} stroke="#3E7430" strokeWidth="1.5" fill="none" />
          </g>
        );
      })}
      {/* head */}
      <g className="sf-head" style={{ transform: `translate(${hx}px, ${hy}px) rotate(${headRot}deg) scale(${headScale})` }}>
        {Array.from({ length: PETALS }, (_, i) => i < petalsShown ? (
          <path key={`b${i}`} d="M0 -32 C 10 -40, 12 -62, 0 -82 C -12 -62, -10 -40, 0 -32 Z" fill={vit > .55 ? 'url(#tPB)' : '#B8862E'} transform={`rotate(${(360 / PETALS) * i + 360 / PETALS / 2})`} />
        ) : null)}
        {Array.from({ length: PETALS }, (_, i) => {
          const a = (360 / PETALS) * i;
          const fallen = i >= petalsShown;
          return (
            <g key={i} className={`sf-petal ${fallen ? 'is-fallen' : ''}`} style={{ ['--fx' as string]: `${(i % 2 ? 1 : -1) * (30 + (i * 13) % 50)}px`, ['--fr' as string]: `${(i * 47) % 180 - 90}deg`, transitionDelay: fallen ? `${(i % 6) * .08}s` : `${(i % 8) * .04}s` }}>
              <path d="M0 -34 C 12 -44, 14 -72, 0 -94 C -14 -72, -12 -44, 0 -34 Z" fill={vit > .55 ? 'url(#tPF)' : petalColor} transform={`rotate(${a})`} />
            </g>
          );
        })}
        <circle r="38" fill="url(#tD)" />
        <circle r="36" fill="none" stroke="#C99A33" strokeWidth="4" strokeDasharray="2.4 3.4" opacity=".75" />
        {SEEDS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * .8} fill={i % 3 ? '#7A5226' : '#2E1C0C'} opacity=".85" />)}
      </g>
    </svg>
  );
}

function ScenIcon({ id }: { id: string }) {
  const p = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (id === 'death') return <svg {...p}><path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18z" /></svg>;
  if (id === 'disability') return <svg {...p}><path d="M12 3v2M5 12a7 7 0 0 1 14 0H5zM12 12v6a2 2 0 0 1-4 0" /></svg>;
  return <svg {...p}><path d="M13 3 6 13h5l-1 8 7-10h-5l1-8z" /></svg>;
}

/* ── The experience ─────────────────────────────────────── */
type Act = 'plan' | 'pick' | 'play' | 'fix';

export default function SunflowerTest({ whatsapp = '', title = '' }: { whatsapp?: string; title?: string }) {
  const [ans, setAns] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [act, setAct] = useState<Act>('plan');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [beat, setBeat] = useState(-1);
  const [fixed, setFixed] = useState<string[]>([]);
  const [replayed, setReplayed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const listRef = useRef<HTMLOListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const who = PERSON[ans.who] ?? 'your family';
  const cur = QS[step];

  // Values, with fixes applied when replaying
  const rawVal = (id: string) => QBY[id]?.opts.find((o) => o.id === ans[id])?.val;
  const val = (id: string): Val | undefined => {
    const v = rawVal(id);
    if (replayed && fixed.includes(id) && (v === 'no' || v === 'part')) return 'yes';
    return v;
  };

  const score = useMemo(() => {
    let e = 0, t = 0;
    for (const q of SCORED) {
      const v = rawVal(q.id); if (!v || v === 'na') continue;
      t += q.points!; e += v === 'yes' ? q.points! : v === 'part' ? q.points! / 2 : 0;
    }
    return t ? Math.round((e / t) * 100) : 0;
  }, [ans]);
  const fixedScore = useMemo(() => {
    let e = 0, t = 0;
    for (const q of SCORED) {
      let v = rawVal(q.id); if (!v || v === 'na') continue;
      if (fixed.includes(q.id) && (v === 'no' || v === 'part')) v = 'yes';
      t += q.points!; e += v === 'yes' ? q.points! : v === 'part' ? q.points! / 2 : 0;
    }
    return t ? Math.round((e / t) * 100) : 0;
  }, [ans, fixed]);

  const beats = useMemo(() => (scenario ? scenario.beats(val, who) : []), [scenario, ans, fixed, replayed, who]);
  const played = beats.slice(0, beat + 1);
  const hurt = played.reduce((s, b) => s + b.hurt, 0);

  // Flower state
  const answeredCount = SCORED.filter((q) => ans[q.id]).length;
  const growthTarget = act === 'plan' ? Math.min(1, (step / (QS.length - 1)) * 1.02) : 1;
  const baseVitality = .25 + (score / 100) * .75;
  const vitalityTarget = act === 'plan' ? (answeredCount ? baseVitality : .7)
    : act === 'play' ? Math.max(.02, Math.min(1, (replayed ? .25 + (fixedScore / 100) * .75 : baseVitality) - hurt))
    : act === 'fix' ? Math.max(.02, Math.min(1, (replayed ? .25 + (fixedScore / 100) * .75 : baseVitality) - hurt))
    : baseVitality;
  const growth = useTween(growthTarget, 900);
  const vitality = useTween(vitalityTarget, 1100);
  const shownScore = useTween(act === 'fix' && fixed.length ? fixedScore : score, 900);
  const mood: 'calm' | 'storm' | 'sun' = (act === 'play' || act === 'fix') && vitalityTarget < .4 ? 'storm' : 'calm';

  // Playback
  useEffect(() => {
    if (act !== 'play' || !scenario) return;
    if (beat >= beats.length - 1) { const t = setTimeout(() => setAct('fix'), 1600); return () => clearTimeout(t); }
    const t = setTimeout(() => setBeat((b) => b + 1), beat < 0 ? 900 : 1900);
    return () => clearTimeout(t);
  }, [act, beat, beats.length, scenario]);
  useEffect(() => { listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [beat]);

  function pick(id: string) {
    setAns((a) => ({ ...a, [cur.id]: id }));
    setTimeout(() => {
      if (step >= QS.length - 1) { setAct('pick'); return; }
      setStep((s) => s + 1);
    }, 420);
  }
  function back() {
    if (step === 0) return;
    const prev = QS[step - 1]; const a = { ...ans }; delete a[prev.id]; delete a[cur.id];
    setAns(a); setStep(step - 1);
  }
  function play(s: Scenario, replay = false) {
    setScenario(s); setReplayed(replay); setBeat(-1); setAct('play');
    rootRef.current?.closest('.sf-scene')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function restart() { setAns({}); setStep(0); setAct('plan'); setScenario(null); setBeat(-1); setFixed([]); setReplayed(false); setSent('idle'); }

  // Fixes = gaps in the plan (shown in the scenario first)
  const gapQs = SCORED.filter((q) => { const v = rawVal(q.id); return v === 'no' || v === 'part'; });
  const inScenario = new Set(beats.filter((b) => b.tone === 'bad' || b.tone === 'mild').map((b) => b.q));
  const orderedFixes = [...gapQs].sort((a, b) => Number(inScenario.has(b.id)) - Number(inScenario.has(a.id)) || b.points! - a.points!);
  const toggle = (id: string) => setFixed((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const plan = (fixed.length ? orderedFixes.filter((q) => fixed.includes(q.id)) : orderedFixes).map((q) => say(q.fix!, who));
  const waText = encodeURIComponent(
    `Hi Magda, I planted the sunflower on your website. My family readiness score is ${score}/100` +
    (scenario ? `, and in "${scenario.label}" it wilted.` : '.') + '\n' +
    (plan.length ? `I'd like to put these in place:\n${plan.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n` : '') + 'Can we talk?',
  );
  const waHref = whatsapp ? `https://wa.me/${whatsapp}?text=${waText}` : '/contact';

  async function sendPlan(e: React.FormEvent) {
    e.preventDefault(); setSent('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ form: 'sunflower', name, email, answers: { ...ans, scenario: scenario?.id ?? '', fixes: fixed.join(',') }, score, marketingConsent: consent }) });
      setSent(r.ok ? 'sent' : 'error');
    } catch { setSent('error'); }
  }

  const actIndex = act === 'plan' ? 0 : act === 'fix' ? 2 : 1;
  const status = act === 'plan' ? (answeredCount ? 'Growing' : 'A seed') : act === 'pick' ? 'Ready for weather' : act === 'play' ? (beat >= 0 ? beats[beat]?.at ?? '' : scenario?.intro ?? '') : replayed ? 'After your fixes' : 'After the storm';

  return (
    <div className="sf" ref={rootRef}>
      <div className="sf-head">
      {title && <h2 className="sf-title">{title}</h2>}
      <ol className="sf-acts" aria-label="Three steps">
        {['Your plan today', 'What if…', 'Fix it'].map((l, i) => (
          <li key={l} className={i === actIndex ? 'is-on' : i < actIndex ? 'is-done' : ''}><span>{i + 1}</span>{l}</li>
        ))}
      </ol>
      </div>

      <div className="sf-grid">
        {/* Stage */}
        <div className="sf-stage">
          <Sunflower growth={growth} vitality={vitality} mood={mood} />
          <div className="sf-hud">
            <div className="sf-score"><span>{Math.round(shownScore)}</span><small>/100</small></div>
            <p className="sf-status" key={status}>{status}</p>
          </div>
        </div>

        {/* Panel */}
        <div className="sf-panel" ref={panelRef}>
          {act === 'plan' && cur && (
            <div className="sf-q" key={cur.id}>
              <p className="sf-count">
                {step === 0 ? 'Plant your sunflower' : `Question ${step} of ${QS.length - 1}`}
                {cur.pillar && <span className={`sf-tag t-${cur.pillar}`}>{cur.pillar === 'health' ? 'Health' : cur.pillar === 'prosperity' ? 'Prosperity' : 'Longevity'}</span>}
              </p>
              <h3>{say(cur.q, who)}</h3>
              <div className={`sf-opts ${cur.opts.length <= 3 && cur.id !== 'who' ? 'is-row' : ''}`} role="radiogroup" aria-label={say(cur.q, who)}>
                {cur.opts.map((o, i) => (
                  <button key={o.id} type="button" role="radio" aria-checked={ans[cur.id] === o.id}
                    className={`sf-opt ${ans[cur.id] === o.id ? 'is-on' : ''} v-${o.val ?? 'x'}`} style={{ animationDelay: `${50 + i * 45}ms` }}
                    onClick={() => pick(o.id)}>{o.label}</button>
                ))}
              </div>
              {step > 0 && <button type="button" className="sf-back" onClick={back}>← Back</button>}
            </div>
          )}

          {act === 'pick' && (
            <div className="sf-q">
              <p className="sf-count">Your score: {score}/100</p>
              <h3>Your sunflower is planted. Now, the weather.</h3>
              <p className="sf-hint">Pick what happens. Watch the months play out for {who}.</p>
              <div className="sf-scen">
                {SCENARIOS.map((s, i) => (
                  <button key={s.id} type="button" className={`sf-scen-btn s-${s.id}`} style={{ animationDelay: `${80 + i * 80}ms` }} onClick={() => play(s)}>
                    <span className="sf-scen-icon" aria-hidden="true"><ScenIcon id={s.id} /></span>
                    <span><b>{s.label}</b><small>{s.intro}</small></span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(act === 'play' || act === 'fix') && scenario && (
            <div className="sf-q">
              <p className="sf-count">{replayed ? 'Replay, with your fixes' : scenario.label}</p>
              <h3 className="sf-intro">{scenario.intro}</h3>
              <ol className="sf-beats" ref={listRef}>
                {played.map((b, i) => (
                  <li key={`${scenario.id}-${replayed}-${i}`} className={`sf-beat b-${b.tone}`}>
                    <span className="sf-at">{b.at}</span>
                    <span>{b.text}</span>
                  </li>
                ))}
              </ol>
              {act === 'play' && <button type="button" className="sf-skip" onClick={() => { setBeat(beats.length - 1); }}>Skip ahead</button>}
            </div>
          )}

          {act === 'fix' && scenario && (
            <div className="sf-fix">
              {orderedFixes.length === 0 ? (
                <h3>It held. Your family is in good hands.</h3>
              ) : (
                <>
                  <h3>{replayed && fixed.length ? `With these in place, your score is ${fixedScore}.` : `What keeps it standing:`}</h3>
                  <ul className="sf-fixes">
                    {orderedFixes.map((q, i) => {
                      const on = fixed.includes(q.id);
                      const gain = Math.round(((rawVal(q.id) === 'part' ? q.points! / 2 : q.points!) / Math.max(1, SCORED.reduce((t, x) => t + (rawVal(x.id) && rawVal(x.id) !== 'na' ? x.points! : 0), 0))) * 100);
                      return (
                        <li key={q.id} style={{ animationDelay: `${100 + i * 70}ms` }}>
                          <button type="button" className={`sf-fixbtn ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(q.id)}>
                            <span className="sf-tick" aria-hidden="true">{on ? '✓' : ''}</span>
                            <span className="sf-fixtext">{say(q.fix!, who)}
                              <small className={q.by === 'momentum' ? 'by-momentum' : 'by-attorney'}>{q.by === 'momentum' ? 'Momentum Consult · financial planning' : 'M Jordaan Attorney · wills & estates'}</small>
                            </span>
                            <span className="sf-gain">+{gain}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="btn-row">
                    <button type="button" className="btn btn-primary" disabled={!fixed.length} onClick={() => play(scenario, true)}>Replay with my fixes</button>
                    <button type="button" className="btn btn-ghost" onClick={() => { setAct('pick'); setReplayed(false); }}>Try another what-if</button>
                  </div>
                </>
              )}
              <div className="sf-cta">
                <a className="btn btn-red sf-wa" href={waHref} target={whatsapp ? '_blank' : undefined} rel="noopener">
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-4-1L3 20l1.2-4.6A8.4 8.4 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4z" /></svg>
                  Send my plan to Magda
                </a>
                <button type="button" className="sf-link" onClick={restart}>Start again</button>
              </div>
              {sent !== 'sent' ? (
                <form className="sf-form" onSubmit={sendPlan}>
                  <p className="sf-hint">Or have your sunflower and plan emailed to you.</p>
                  <div className="sf-fields">
                    <div><label htmlFor="sf-name">Name</label><input id="sf-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
                    <div><label htmlFor="sf-email">Email</label><input id="sf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
                  </div>
                  <label className="check-row"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Also send me Magda&rsquo;s articles (about twice a month). I can unsubscribe any time.</span></label>
                  <p className="small muted">Your details are used to send your plan. <a href="/privacy">Privacy notice</a>.</p>
                  <button type="submit" className="btn btn-ghost" disabled={sent === 'sending'}>{sent === 'sending' ? 'Sending…' : 'Email me my plan'}</button>
                  {sent === 'error' && <p role="alert" className="small">That didn&rsquo;t go through. Try again, or WhatsApp Magda.</p>}
                </form>
              ) : <p className="sf-hint">On its way to {email}.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
