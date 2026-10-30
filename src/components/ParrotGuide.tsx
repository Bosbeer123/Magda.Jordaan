import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/parrot.css';
import ParrotArt, { type ParrotPalette } from './ParrotArt';

/*
  The parrot guide (scarlet macaw colours; see ParrotArt.tsx for the others).
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


/** Parrot colours: 'green' (Cape parrot), 'red' (red with green wings) or 'scarlet' (macaw). */
const PARROT_PALETTE: ParrotPalette = 'scarlet';

const W = 92;            // parrot size (px), the same everywhere
const H = Math.round(W * 1.12);

function Parrot({ flying }: { flying: boolean }) {
  return <ParrotArt flying={flying} palette={PARROT_PALETTE} width={W} />;
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
  // The parrot never talks over the page on its own: when it lands it shows a small "…" badge; a tap gets the fact.
  const [hint, setHint] = useState(false);
  const hintTimer = useRef<number | undefined>(undefined);
  const showHint = () => { setHint(true); clearTimeout(hintTimer.current); hintTimer.current = window.setTimeout(() => setHint(false), 8000); };
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
  // A perch spot ([data-parrot-perch], on a branch drawn on a box) is small; a block is usable when it's wide enough.
  const isSpot = (el: Element | null | undefined) => !!el?.matches('[data-parrot-perch]');
  const visible = (r: DOMRect, el?: Element | null) => isSpot(el)
    ? r.top > 110 && r.top < innerHeight - 8 && r.left > 30 && r.right < innerWidth - 30   // a branch, or the lioness's back
    : r.top > 70 && r.top < innerHeight - 150 && r.width > 120 && r.left > -20 && r.right < innerWidth + 20;
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
    // Prefer a branch when one is on screen; otherwise any box.
    const spots = Array.from(document.querySelectorAll('[data-parrot-perch]')).filter((e) => visible(e.getBoundingClientRect(), e));
    if (spots.length && Math.random() < 0.75) return { el: spots[Math.floor(Math.random() * spots.length)], fx: 0.5 };
    const els = Array.from(document.querySelectorAll(PERCHABLE)).filter((e) => visible(e.getBoundingClientRect()) && !e.querySelector(':scope > .nook'));
    if (!els.length) return spots.length ? { el: spots[0], fx: 0.5 } : null;
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
      setTimeout(showHint, 1500);
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
          if (!visible(sp.r, perch.current.el) && !perch.current.el.matches('[data-parrot-home]')) takeOff();
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
            if (p) flyToPerch(p, showHint);
            else timer.current = now + 3000;
          }
          if (mode.current === 'landing' && landOn.current && dist < 4) {
            const l = landOn.current; landOn.current = null;
            perch.current = { el: l.el, fx: l.fx }; mode.current = 'perched'; setFlying(false);
            timer.current = now + 9000 + Math.random() * 4000;
            facing.current = isSpot(l.el) ? Number((l.el as HTMLElement).dataset.face ?? -1) : l.fx > 0.5 ? -1 : 1;
            if (l.el.closest('[data-lion]')) dispatchEvent(new CustomEvent('parrot-on-lion', { detail: { el: l.el } }));   // she yawns at him
            else { const glow = isSpot(l.el) ? l.el.closest(PERCHABLE) ?? l.el.parentElement! : l.el;
              glow.classList.add('parrot-glow'); setTimeout(() => glow.classList.remove('parrot-glow'), 2600); }
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

  // The speech bubble goes beside the parrot, wherever it covers the least text on the page.
  // Candidate spots are scored every ~150ms (or when the bubble changes size); in between it simply follows the bird.
  const bubbleSpot = useRef({ t: 0, w: 0, h: 0, dx: 0, dy: 0, side: 'right' });
  const TEXTY = 'p, h1, h2, h3, h4, li, label, input, select, textarea, button, a, img, .btn, .ask-menu';
  function textHits(x: number, y: number, w: number, h: number) {
    let n = 0;
    for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
      const px = x + (w * (i + 0.5)) / 5, py = y + (h * (j + 0.5)) / 4;
      if (px < 4 || py < 4 || px > innerWidth - 4 || py > innerHeight - 4) { n += 3; continue; }
      const under = document.elementsFromPoint(px, py).find((e) => !e.closest('.pg, .pg-bubble'));
      if (under && under.closest(TEXTY) && !under.closest('svg')) n++;
    }
    return n;
  }
  function placeBubble() {
    const bub = bubbleRef.current; if (!bub) return;
    const bw = bub.offsetWidth, bh = bub.offsetHeight, p = pos.current;
    const spot = bubbleSpot.current, now = performance.now();
    if (now - spot.t > 150 || Math.abs(spot.w - bw) > 2 || Math.abs(spot.h - bh) > 2) {
      const g = 8;
      const cands = [
        { dx: W * 0.8, dy: -bh + 10, side: 'right' },          // up and right
        { dx: -bw + W * 0.2, dy: -bh + 10, side: 'left' },     // up and left
        { dx: W + g, dy: (H - bh) / 2, side: 'right' },        // beside, right
        { dx: -bw - g, dy: (H - bh) / 2, side: 'left' },       // beside, left
        { dx: W * 0.8, dy: H - 6, side: 'right' },             // down and right
        { dx: -bw + W * 0.2, dy: H - 6, side: 'left' },        // down and left
        { dx: (W - bw) / 2, dy: -bh - g, side: 'right' },      // straight above
      ];
      let best = cands[0], bestN = Infinity;
      if (bub.querySelector('.pg-hello') || bw === 0) { best = p.x + W / 2 < innerWidth / 2 ? cands[0] : cands[1]; }
      else for (const c of cands) {
        const n = textHits(p.x + c.dx, p.y + c.dy, bw, bh);
        if (n < bestN) { best = c; bestN = n; }
        if (n === 0) break;
      }
      Object.assign(spot, { t: now, w: bw, h: bh, dx: best.dx, dy: best.dy, side: best.side });
    }
    let x = p.x + spot.dx, y = p.y + spot.dy;
    x = Math.max(12, Math.min(innerWidth - bw - 12, x));
    y = Math.max(12, Math.min(innerHeight - bh - 12, y));
    bub.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    bub.dataset.side = spot.side;
  }

  function choose(t: Topic) {
    const el = document.querySelector(`[data-parrot-stop="${t.stop}"]`);
    if (!el) { location.href = t.href; return; }
    setBubble(null);
    const sel = el.getAttribute('data-parrot-perch-on');
    const spot = el.querySelector(':scope > .nook [data-parrot-perch]');
    const perchEl = (sel && document.querySelector(sel)) || spot || el;
    const off = el.hasAttribute('data-parrot-offset') ? Number(el.getAttribute('data-parrot-offset')) : Math.max(120, innerHeight * 0.22);
    scrollTo({ top: scrollY + el.getBoundingClientRect().top - off, behavior: reduced.current ? 'auto' : 'smooth' });
    setTimeout(() => flyToPerch({ el: perchEl, fx: spot && perchEl === spot ? 0.5 : 0.75 }, () => say('topic', t.say, t, 11000)), reduced.current ? 0 : 700);
  }

  function onBird() {
    setHint(false);
    if (bubble?.kind === 'menu') { setBubble(null); return; }
    const ctx = ctxFor(perch.current?.el ?? document.elementFromPoint(innerWidth / 2, innerHeight / 2));
    say('fact', nextFact(ctx), undefined, 8000);
    if (mode.current === 'perched') timer.current = performance.now() + 9000;
  }
  function hide() { setHidden(true); setBubble(null); try { sessionStorage.setItem('pg-hidden', '1'); } catch { /* ignore */ } dispatchEvent(new Event('mascots-hide')); }

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
          {hint && !bubble && !flying && <span className="pg-hint" aria-hidden="true">…</span>}
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
              <div className="pg-foot"><button type="button" className="pg-link" onClick={hide}>Hide the animals</button></div>
            </div>
          )}
          <button type="button" className="pg-x" aria-label="Close" onClick={() => setBubble(null)}>×</button>
        </div>
      )}
    </>
  );
}
