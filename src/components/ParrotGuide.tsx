import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/parrot.css';

/*
  The parrot guide (a Cape parrot: green, with the red forehead).
  - On the home page it perches on the branch in the hero ([data-parrot-home]) and asks what you'd like to know.
  - Pick a topic: it says a line, flies to that block ([data-parrot-stop="<id>"]), perches on it and lights it up.
  - When its block scrolls away it flies to the corner; tap it any time to ask again.
  - On pages without that block, a topic takes you to the page instead.
  - The bubble is built so a real chat can be added later (see `Bubble` mode 'chat' placeholder).
*/

type Topic = { id: string; label: string; stop: string; say: string; href: string; more: string };

const TOPICS: Topic[] = [
  { id: 'will', label: 'Making or checking a will', stop: 'longevity', href: '/wills-and-estates', more: 'Wills & estates',
    say: 'Wills, trusts and estates. This is Magda’s home ground: she spent years winding up estates.' },
  { id: 'health', label: 'Protecting my health and income', stop: 'health', href: '/financial-planning', more: 'Financial planning',
    say: 'Medical aid, gap cover, disability and income protection, through Momentum Consult.' },
  { id: 'money', label: 'Growing and protecting my money', stop: 'prosperity', href: '/financial-planning', more: 'Financial planning',
    say: 'Investments, retirement and life cover. Objective advice across providers, including Momentum and Sanlam.' },
  { id: 'death', label: 'Someone close to me has died', stop: 'death', href: '/report-a-death', more: 'What to do first',
    say: 'I’m sorry. Here is what to do first, in order. Magda can carry the rest.' },
  { id: 'score', label: 'How ready is my family?', stop: 'score', href: '/check', more: 'Plant your sunflower',
    say: 'Plant your family\u2019s sunflower in two minutes. Then see what the weather does to it.' },
  { id: 'talk', label: 'I’d like to talk to Magda', stop: 'contact', href: '/contact', more: 'Contact Magda',
    say: 'Phone or WhatsApp is fastest. She answers people, not inboxes.' },
];


const W = 92;            // parrot size (px), the same everywhere
const H = Math.round(W * 1.12);

function Parrot({ flying }: { flying: boolean }) {
  // A Cape parrot, standing upright on a branch, facing right. One silhouette for head and body,
  // olive-silver head blending into green, red forehead and wing bend, big pale hooked beak, grey feet.
  return (
    <svg className={`pg-bird ${flying ? 'is-flying' : ''}`} viewBox="0 0 200 224" width={W} height={H} aria-hidden="true">
      <defs>
        <linearGradient id="pgB" x1=".3" y1="0" x2=".7" y2="1"><stop offset="0" stopColor="#7DBE55" /><stop offset=".5" stopColor="#4F983F" /><stop offset="1" stopColor="#2C6A31" /></linearGradient>
        <radialGradient id="pgBh" cx="70%" cy="45%" r="45%"><stop offset="0" stopColor="#A6D97B" stopOpacity=".55" /><stop offset="1" stopColor="#A6D97B" stopOpacity="0" /></radialGradient>
        <linearGradient id="pgH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFC3A2" /><stop offset=".6" stopColor="#A3926F" /><stop offset="1" stopColor="#8E9A62" stopOpacity="0" /></linearGradient>
        <linearGradient id="pgW" x1=".2" y1="0" x2=".6" y2="1"><stop offset="0" stopColor="#4F9840" /><stop offset=".6" stopColor="#2D6C35" /><stop offset="1" stopColor="#1C5254" /></linearGradient>
        <linearGradient id="pgK" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6EFE0" /><stop offset=".6" stopColor="#DCCAA9" /><stop offset="1" stopColor="#B49C77" /></linearGradient>
        <linearGradient id="pgT" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2C6A31" /><stop offset="1" stopColor="#1A4B4D" /></linearGradient>
        <linearGradient id="pgR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2603C" /><stop offset="1" stopColor="#C21F35" /></linearGradient>
      </defs>
      <g className="pg-tail">
        <path d="M104 178 C 92 196, 80 210, 66 224 L 80 224 C 92 212, 104 198, 114 184 Z" fill="url(#pgT)" />
        <path d="M110 180 C 102 198, 94 212, 86 224 L 96 224 C 104 212, 112 198, 118 186 Z" fill="#225846" />
      </g>
      <g className="pg-wing-back"><path d="M110 92 C 84 62, 48 54, 18 68 C 44 74, 72 90, 98 120 Z" fill="url(#pgW)" /></g>
      <g className="pg-body">
        <path d="M130 22 C 146 22, 158 32, 160 46 C 162 58, 158 66, 160 80 C 164 104, 158 132, 146 156 C 136 174, 122 188, 108 188 C 94 186, 86 170, 84 148 C 82 122, 90 100, 100 84 C 106 72, 104 56, 108 42 C 112 30, 120 22, 130 22 Z" fill="url(#pgB)" />
        <path d="M130 22 C 146 22, 158 32, 160 46 C 162 58, 158 66, 160 80 C 164 104, 158 132, 146 156 C 136 174, 122 188, 108 188 C 94 186, 86 170, 84 148 C 82 122, 90 100, 100 84 C 106 72, 104 56, 108 42 C 112 30, 120 22, 130 22 Z" fill="url(#pgBh)" />
        <g fill="none" stroke="#B9E293" strokeWidth="1.3" strokeLinecap="round" opacity=".4">
          <path d="M138 104 q5 3 10 0" /><path d="M134 118 q5 3 10 0" /><path d="M142 126 q5 3 9 0" /><path d="M132 134 q5 3 10 0" /><path d="M138 146 q5 3 9 0" /><path d="M126 156 q5 3 10 0" />
        </g>
        <path d="M112 182 C 116 174, 128 172, 132 180 C 126 186, 118 188, 112 182 Z" fill="url(#pgR)" opacity=".9" />
      </g>
      <g className="pg-head">
        <path d="M130 22 C 146 22, 158 32, 160 46 C 162 58, 158 70, 150 78 C 136 86, 116 84, 106 74 C 104 62, 104 50, 108 40 C 112 30, 120 22, 130 22 Z" fill="url(#pgH)" />
        <path d="M134 23 C 145 22, 155 28, 159 38 C 151 36, 142 34, 134 35 C 131 31, 131 26, 134 23 Z" fill="url(#pgR)" />
        <g fill="none" stroke="#EFE8D4" strokeWidth="1" strokeLinecap="round" opacity=".45"><path d="M114 46 q6 -3 12 0" /><path d="M112 58 q6 -3 12 0" /><path d="M118 68 q6 -3 12 0" /></g>
        <g className="pg-eye">
          <circle cx="140" cy="44" r="7.6" fill="#ECE6D9" />
          <circle cx="140.8" cy="44" r="4.8" fill="#4A2C17" />
          <circle cx="140.8" cy="44" r="2.7" fill="#120A05" />
          <circle cx="142.4" cy="42.4" r="1.4" fill="#fff" />
        </g>
        <path d="M155 34 C 170 32, 183 43, 183 59 C 183 69, 178 75, 172 74 C 172 66, 168 60, 160 58 C 155 53, 153 44, 155 34 Z" fill="url(#pgK)" stroke="#A88F69" strokeWidth=".8" />
        <path d="M160 58 C 168 60, 172 66, 172 74 C 165 74, 160 70, 158 64 Z" fill="#BCA47C" />
        <circle cx="158.5" cy="38.5" r="1.3" fill="#8C7656" />
      </g>
      <g className="pg-wing">
        <path d="M112 84 C 126 88, 134 106, 132 130 C 130 154, 118 178, 100 208 C 92 192, 88 170, 88 148 C 88 118, 96 94, 112 84 Z" fill="url(#pgW)" />
        <path d="M112 84 C 122 86, 130 94, 132 106 C 124 102, 116 98, 106 98 Z" fill="url(#pgR)" />
        <g fill="none" stroke="#1F5A3A" strokeWidth="1.5" strokeLinecap="round" opacity=".7">
          <path d="M104 118 q10 2 18 -4" /><path d="M98 132 q11 2 20 -4" /><path d="M95 146 q11 2 20 -5" />
          <path d="M96 160 C 95 176, 96 190, 100 204" /><path d="M104 158 C 103 172, 103 184, 104 196" /><path d="M112 154 C 111 166, 110 176, 108 186" />
        </g>
      </g>
      <g className="pg-feet" stroke="#8E8C86" strokeWidth="4.2" strokeLinecap="round" fill="none">
        <path d="M114 186 L 114 204 M114 204 l -10 4 M114 204 l 10 4 M114 204 l -2 -3" />
        <path d="M128 184 L 128 203 M128 203 l -10 4 M128 203 l 10 4" />
      </g>
    </svg>
  );
}

function TopicIcon({ id }: { id: string }) {
  const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'will': return <svg {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></svg>;
    case 'health': return <svg {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>;
    case 'money': return <svg {...p}><path d="M12 21v-8" /><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 11c0-4 2-7 6-7 0 4-2 7-6 7z" /></svg>;
    case 'death': return <svg {...p}><path d="M12 21c-4-3-6-6-6-10a6 6 0 0 1 12 0c0 4-2 7-6 10z" /><path d="M12 8v5" /></svg>;
    case 'score': return <svg {...p}><circle cx="12" cy="9" r="3" /><path d="M12 2v2M12 14v7M5 9H3M21 9h-2M7 4l1.5 1.5M17 4l-1.5 1.5" /></svg>;
    default: return <svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>;
  }
}

/* Facts the parrot tells when it lands. Picked at random for the section it lands on, no repeats until all are used.
   DRAFT: Magda approves every line (docs/CONTENT-TODO.md). Information, not advice. */
const FACTS: Record<string, string[]> = {
  home: [
    'Two in three South Africans don\u2019t have a will. (Sanlam survey, 2025)',
    'Parents are more likely to have funeral cover than a will: 54% against 33%.',
    'Bank accounts in your name freeze the moment the bank hears you\u2019ve died.',
    'Magda started in underwriting at Liberty and Momentum, then became an attorney.',
    'Most families meet the adviser before a death and the attorney after. Magda is both.',
    'I\u2019m a Cape parrot: South Africa\u2019s only endemic parrot, and an endangered one.',
    'Young sunflowers follow the sun across the sky. Grown ones settle facing east.',
  ],
  roots: [
    'Gap cover pays the difference when specialists charge more than your medical aid pays.',
    'Retirement annuity contributions are tax-deductible up to 27.5% of taxable income, within a yearly cap.',
    'Budget 2026 proposes raising the tax-free savings limit to R46 000 a year.',
    'A tax-free savings account has a R500 000 lifetime limit.',
    'Put more than the limit into tax-free savings and SARS taxes the excess at 40%.',
    'Without a trust, a child\u2019s inheritance goes to the Guardian\u2019s Fund and is paid out at 18.',
    'Estate duty is 20% above R3.5 million, and 25% above R30 million.',
    'A life policy pays the person named on the form, whatever your will says.',
  ],
  sunflower: [
    'Every gap you fix stands the sunflower back up. Try all three what-ifs.',
    'Income protection pays every month. Critical illness cover pays a lump sum on diagnosis.',
    'Life cover can clear the bond, so the house stays with your family.',
    'Your answers stay in your browser unless you ask for the email.',
  ],
  wills: [
    'Every page of a will must be signed.',
    'A witness to your will, or their spouse, generally can\u2019t inherit under it.',
    'An old will can still name an ex, or someone who has died. Check yours every five years.',
    'Executor\u2019s fees are up to 3.5% of the gross estate, plus VAT. They\u2019re negotiable.',
    'The Master wants the original will, not a copy.',
  ],
  planning: [
    'Gap cover pays the difference when specialists charge more than your medical aid pays.',
    'Income protection pays every month if illness or injury stops you working.',
    'A tax-free savings account has a R500 000 lifetime limit.',
    'Retirement annuity contributions are tax-deductible up to 27.5% of taxable income, within a yearly cap.',
  ],
  death: [
    'A death must be reported to the Master of the High Court within 14 days.',
    'Estates under R250 000 can use Letters of Authority, a simpler route.',
    'The Master wants the original will, not a copy.',
    'You don\u2019t have to do this alone. Magda can carry the paperwork.',
  ],
  contact: [
    'A first conversation with Magda costs nothing.',
    'WhatsApp is the quickest way to reach her.',
    'Home and hospital visits can be arranged.',
  ],
};
const PAGE_CONTEXT: Record<string, string> = {
  '/': 'home', '/wills-and-estates': 'wills', '/financial-planning': 'planning', '/check': 'sunflower',
  '/report-a-death': 'death', '/contact': 'contact',
};
const bags: Record<string, string[]> = {};
function nextFact(ctx: string) {
  const pool = FACTS[ctx] ?? FACTS.home;
  if (!bags[ctx] || bags[ctx].length === 0) bags[ctx] = [...pool].sort(() => Math.random() - 0.5);
  return bags[ctx].pop()!;
}
const PERCHABLE = '.block, .root-cards li, .portrait, .sf-stage, .card, .card-dark, .ph, .pg-inline, .layer h2';

export default function ParrotGuide() {
  const [bubble, setBubble] = useState<{ kind: 'fact' | 'menu' | 'topic'; text?: string; topic?: Topic } | null>(null);
  const [flying, setFlying] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuHost, setMenuHost] = useState<Element | null>(null);
  const birdRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: 200 });
  const vel = useRef({ x: 0, y: 0 });
  const perch = useRef<{ el: Element; fx: number } | null>(null);   // the block it's sitting on, and where along its top edge
  const goal = useRef<{ x: number; y: number } | null>(null);        // where it's flying to
  const landOn = useRef<{ el: Element; fx: number; then: (() => void) | null } | null>(null);
  const mode = useRef<'perched' | 'wander' | 'landing'>('wander');
  const timer = useRef(0);
  const facing = useRef(1);
  const reduced = useRef(false);
  const bubbleTimer = useRef<number | undefined>(undefined);

  const ctxFor = (el: Element | null) => el?.closest('[data-facts]')?.getAttribute('data-facts') ?? PAGE_CONTEXT[location.pathname.replace(/\.html$/, '')] ?? 'home';
  const spotOn = (el: Element, fx: number) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width * fx - W / 2, y: r.top - H + 8, r }; };
  const visible = (r: DOMRect) => r.top > 70 && r.top < innerHeight - 150 && r.width > 120 && r.left > -20 && r.right < innerWidth + 20;
  // Somewhere to fly to: open space, never over words. During the sunflower activity, only over the sunflower side.
  const randomSky = () => {
    const act = document.querySelector('.sf-scene');
    const ar = act?.getBoundingClientRect();
    const stage = ar && ar.top < 140 && ar.bottom > innerHeight - 140 ? document.querySelector('.sf-stage')?.getBoundingClientRect() : null;
    const box = stage ?? { left: 20, top: 40, width: innerWidth - 40, height: innerHeight * 0.7 };
    let best = { x: box.left + box.width / 2 - W / 2, y: box.top + 40 };
    for (let i = 0; i < 10; i++) {
      const x = box.left + Math.random() * Math.max(10, box.width - W);
      const y = box.top + Math.random() * Math.max(10, box.height - H);
      const hit = document.elementFromPoint(x + W / 2, y + H / 2);
      best = { x, y };
      if (!hit || !hit.closest('p, h1, h2, h3, li, button, label, input, a, .pg-inline, .sf-panel')) break;
    }
    return best;
  };

  function say(kind: 'fact' | 'topic', text: string, topic?: Topic, ms = 7500) {
    setBubble({ kind, text, topic });
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setBubble((b) => (b && b.kind !== 'menu' ? null : b)), ms);
  }

  function takeOff() {
    setBubble((b) => (b?.kind === 'menu' ? b : null));
    perch.current = null; mode.current = 'wander'; goal.current = randomSky();
    timer.current = performance.now() + 5000 + Math.random() * 5000; setFlying(true);
  }

  function pickPerch(): { el: Element; fx: number } | null {
    const els = Array.from(document.querySelectorAll(PERCHABLE)).filter((e) => visible(e.getBoundingClientRect()));
    if (!els.length) return null;
    return { el: els[Math.floor(Math.random() * els.length)], fx: 0.2 + Math.random() * 0.6 };
  }

  function flyToPerch(target: { el: Element; fx: number }, then: (() => void) | null) {
    perch.current = null; landOn.current = { ...target, then }; mode.current = 'landing'; setFlying(true);
  }

  useEffect(() => {
    try { if (sessionStorage.getItem('pg-hidden') === '1') setHidden(true); } catch { /* ignore */ }
    reduced.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMenuHost(document.querySelector('[data-parrot-menu]'));

    // Start: on its branch in the hero if there is one, else glide in from the side.
    const home = Array.from(document.querySelectorAll('[data-parrot-home]')).find((e) => e.getBoundingClientRect().width > 0);
    if (home) {
      const sp = spotOn(home, 0.5); pos.current = { x: sp.x, y: sp.y };
      perch.current = { el: home, fx: 0.5 }; mode.current = 'perched'; setFlying(false);
      timer.current = performance.now() + 9000;
      setTimeout(() => say('fact', 'Hello! I fly around and tell you useful things. Tap me any time.', undefined, 6500), 1200);
    } else {
      pos.current = { x: -W, y: innerHeight * 0.3 }; takeOff();
    }
    if (reduced.current) { perch.current = null; mode.current = 'perched'; pos.current = { x: innerWidth - W - 18, y: innerHeight - H - 16 }; setFlying(false); }

    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!reduced.current) {
        if (mode.current === 'perched' && perch.current) {
          const sp = spotOn(perch.current.el, perch.current.fx);
          if (!visible(sp.r) && !perch.current.el.matches('[data-parrot-home]')) takeOff();
          else if (perch.current.el.matches('[data-parrot-home]') && (sp.r.top < -40 || sp.r.top > innerHeight)) takeOff();
          else { pos.current = { x: sp.x, y: sp.y }; vel.current = { x: 0, y: 0 }; }
          if (now > timer.current && mode.current === 'perched' && !bubbleRef.current?.matches(':hover')) takeOff();
        } else {
          let target = goal.current ?? randomSky();
          let arrive = false;
          if (mode.current === 'landing' && landOn.current) { target = spotOn(landOn.current.el, landOn.current.fx); arrive = true; }
          const dx = target.x - pos.current.x, dy = target.y - pos.current.y, dist = Math.hypot(dx, dy);
          const speed = arrive ? Math.min(380, 60 + dist * 2.2) : 150;
          const want = { x: (dx / (dist || 1)) * speed, y: (dy / (dist || 1)) * speed };
          const steer = arrive ? 4.5 : 1.6;
          vel.current.x += (want.x - vel.current.x) * Math.min(1, steer * dt);
          vel.current.y += (want.y - vel.current.y) * Math.min(1, steer * dt);
          pos.current.x += vel.current.x * dt;
          pos.current.y += vel.current.y * dt + (arrive ? 0 : Math.sin(now / 260) * 0.35);
          if (Math.abs(vel.current.x) > 8) facing.current = vel.current.x > 0 ? 1 : -1;
          if (mode.current === 'wander' && dist < 40) goal.current = randomSky();
          if (mode.current === 'wander' && now > timer.current) {
            const p = pickPerch();
            if (p) flyToPerch(p, () => say('fact', nextFact(ctxFor(p.el))));
            else timer.current = now + 3000;
          }
          if (mode.current === 'landing' && landOn.current && dist < 4) {
            const l = landOn.current; landOn.current = null;
            perch.current = { el: l.el, fx: l.fx }; mode.current = 'perched'; setFlying(false);
            timer.current = now + 9000 + Math.random() * 4000;
            facing.current = l.fx > 0.5 ? -1 : 1;
            l.el.classList.add('parrot-glow'); setTimeout(() => l.el.classList.remove('parrot-glow'), 2600);
            l.then?.();
          }
        }
      }
      const b = birdRef.current;
      if (b) { b.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`; b.style.setProperty('--face', String(facing.current)); }
      placeBubble();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(bubbleTimer.current); };
  }, []);

  function placeBubble() {
    const bub = bubbleRef.current; if (!bub) return;
    const bw = bub.offsetWidth, bh = bub.offsetHeight, p = pos.current;
    const right = p.x + W / 2 < innerWidth / 2;
    let x = right ? p.x + W * 0.8 : p.x - bw + W * 0.2;
    let y = p.y - bh + 10;
    if (innerWidth < 640) { x = 12; y = p.y > innerHeight / 2 ? p.y - bh - 4 : p.y + H + 6; }
    x = Math.max(12, Math.min(innerWidth - bw - 12, x));
    y = Math.max(12, Math.min(innerHeight - bh - 12, y));
    bub.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    bub.dataset.side = right ? 'right' : 'left';
  }

  function choose(t: Topic) {
    const el = document.querySelector(`[data-parrot-stop="${t.stop}"]`);
    if (!el) { location.href = t.href; return; }
    setBubble(null);
    const sel = el.getAttribute('data-parrot-perch-on');
    const perchEl = (sel && document.querySelector(sel)) || el;
    const off = el.hasAttribute('data-parrot-offset') ? Number(el.getAttribute('data-parrot-offset')) : Math.max(120, innerHeight * 0.22);
    scrollTo({ top: scrollY + el.getBoundingClientRect().top - off, behavior: reduced.current ? 'auto' : 'smooth' });
    setTimeout(() => flyToPerch({ el: perchEl, fx: 0.75 }, () => say('topic', t.say, t, 11000)), reduced.current ? 0 : 700);
  }

  function onBird() {
    if (bubble?.kind === 'menu') { setBubble(null); return; }
    const ctx = ctxFor(perch.current?.el ?? document.elementFromPoint(innerWidth / 2, innerHeight / 2));
    say('fact', nextFact(ctx), undefined, 9000);
    if (mode.current === 'perched') timer.current = performance.now() + 9000;
  }
  function hide() { setHidden(true); setBubble(null); try { sessionStorage.setItem('pg-hidden', '1'); } catch { /* ignore */ } }

  const topicButtons = (big = false) => (
    <div className={`pg-topics ${big ? 'is-big' : ''}`}>
      {TOPICS.map((t, i) => (
        <button key={t.id} type="button" className={`pg-topic ${t.id === 'health' || t.id === 'money' ? 'is-momentum' : ''}`}
          style={{ animationDelay: `${150 + i * 60}ms` }} onClick={() => choose(t)}>
          <span className="pg-ico" aria-hidden="true"><TopicIcon id={t.id} /></span>
          <span className="pg-lbl">{t.label}</span>
          <span className="pg-arrow" aria-hidden="true">→</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {menuHost && createPortal(
        <div className="pg-inline">
          <p className="pg-hello">Hello. What would you like to know about?</p>
          {topicButtons(true)}
        </div>, menuHost)}

      {!hidden && (
        <button ref={birdRef} type="button" className={`pg ${flying ? 'is-flying' : 'is-perched'}`}
          aria-label="The parrot: tap for a fact" onClick={onBird}>
          <span className="pg-flip"><Parrot flying={flying} /></span>
        </button>
      )}

      {!hidden && (
        <div ref={bubbleRef} className={`pg-bubble ${bubble ? '' : 'is-hidden'}`} role="status" aria-live="polite">
          {bubble?.kind === 'fact' && (
            <div className="pg-content" key={bubble.text}>
              <p className="pg-say">{bubble.text}</p>
              <div className="pg-foot">
                <button type="button" className="pg-link" onClick={onBird}>Another one</button>
                <button type="button" className="pg-link" onClick={() => setBubble({ kind: 'menu' })}>Ask me something</button>
              </div>
            </div>
          )}
          {bubble?.kind === 'topic' && bubble.topic && (
            <div className="pg-content" key={bubble.topic.id}>
              <p className="pg-say">{bubble.text}</p>
              <div className="pg-actions">
                <a className="pg-go" href={bubble.topic.href}>{bubble.topic.more} →</a>
                <button type="button" className="pg-link" onClick={() => setBubble({ kind: 'menu' })}>Something else</button>
              </div>
            </div>
          )}
          {bubble?.kind === 'menu' && (
            <div className="pg-content" key="menu">
              <p className="pg-hello">What would you like to know about?</p>
              {topicButtons()}
              <div className="pg-foot"><button type="button" className="pg-link" onClick={hide}>Hide the parrot</button></div>
            </div>
          )}
          <button type="button" className="pg-x" aria-label="Close" onClick={() => setBubble(null)}>×</button>
        </div>
      )}
    </>
  );
}
