import { useEffect, useRef, useState } from 'react';
import LionArt, { type LionPose } from './LionArt';
import { LION_LINES } from './LionArt.guide';
import '../styles/lion.css';

/*
  The lioness guide. She lies in a bottom corner of the screen, breathes, flicks her tail and yawns now and then.
  Every minute or so she gets up and walks to the other corner. Tap her and she tells you something useful.
  - While the hero (with its own lioness, [data-lion-home]) is on screen, she stays out of sight.
  - She never speaks unprompted: after a walk a small "…" badge invites a tap, so nothing covers the page.
  - The hero lioness asks her to speak with a 'lion-say' event.
  - "Hide the animals" in the parrot's menu hides her too (sessionStorage 'pg-hidden').
*/

const W_DESK = 150, W_MOB = 112;
const GAP = 14;
let bag: string[] = [];
const nextLine = () => { if (!bag.length) bag = [...LION_LINES].sort(() => Math.random() - 0.5); return bag.pop()!; };

export default function LionGuide() {
  const [pose, setPose] = useState<LionPose>('lie');
  const [yawn, setYawn] = useState(false);
  const [say, setSay] = useState<{ text: string; x: number; y: number } | null>(null);
  const [hint, setHint] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [away, setAway] = useState(true);   // off screen (hero visible)
  const elRef = useRef<HTMLButtonElement>(null);
  const x = useRef(-200), face = useRef(1), side = useRef<'left' | 'right'>('left');
  const target = useRef<number | null>(null);
  const w = useRef(W_DESK);
  const nextYawn = useRef(0), nextWalk = useRef(0);
  const sayTimer = useRef<number | undefined>(undefined);
  const awayRef = useRef(true), sayingRef = useRef(false);
  useEffect(() => { sayingRef.current = !!say; }, [say]);

  const restX = (s: 'left' | 'right') => (s === 'left' ? GAP : innerWidth - w.current - GAP);

  function speak(text: string, anchor?: DOMRect) {
    const r = anchor ?? elRef.current?.getBoundingClientRect();
    if (!r) return;
    setHint(false);
    setSay({ text, x: r.left + r.width / 2, y: r.top });
    clearTimeout(sayTimer.current);
    sayTimer.current = window.setTimeout(() => setSay(null), 9000);
  }

  useEffect(() => {
    try { if (sessionStorage.getItem('pg-hidden') === '1') setHidden(true); } catch { /* ignore */ }
    const onHide = () => setHidden(true);
    addEventListener('mascots-hide', onHide);
    const onSay = (e: Event) => { const el = (e as CustomEvent).detail?.el as Element | undefined; speak(nextLine(), el?.getBoundingClientRect()); };
    addEventListener('lion-say', onSay);
    const onParrot = (e: Event) => {
      const el = (e as CustomEvent).detail?.el as Element | undefined;
      if (el && elRef.current?.contains(el)) { setHint(false); setYawn(true); window.setTimeout(() => setYawn(false), 2200); }
    };
    addEventListener('parrot-on-lion', onParrot);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // a bubble never stays behind when the page moves under it
    let sayY = scrollY;
    const onScroll = () => { if (sayingRef.current && Math.abs(scrollY - sayY) > 30) setSay(null); if (!sayingRef.current) sayY = scrollY; };
    addEventListener('scroll', onScroll, { passive: true });
    w.current = innerWidth < 640 ? W_MOB : W_DESK;

    let raf = 0, last = performance.now();
    nextYawn.current = last + 9000; nextWalk.current = last + 40000;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      w.current = innerWidth < 640 ? W_MOB : W_DESK;
      const home = document.querySelector('[data-lion-home]')?.getBoundingClientRect();
      const heroOn = !!home && home.bottom > 0 && home.top < innerHeight;
      if (heroOn) {
        // hero lioness is showing: slip away to the left
        if (!awayRef.current) { awayRef.current = true; setAway(true); setSay(null); }
        x.current = -w.current - 40; target.current = null; side.current = 'left'; setPose('lie');
      } else {
        if (awayRef.current) {
          // walk in from the left edge to the left corner
          awayRef.current = false; setAway(false); x.current = -w.current; target.current = restX('left'); face.current = 1; setPose('walk');
        }
        if (target.current !== null) {
          const dx = target.current - x.current;
          const step = (reduced ? 4000 : 120) * dt;
          if (Math.abs(dx) <= step) {
            x.current = target.current; target.current = null; setPose('lie');
            nextYawn.current = now + 6000 + Math.random() * 8000; nextWalk.current = now + 45000 + Math.random() * 25000;
            setHint(true); window.setTimeout(() => setHint(false), 9000);
          } else x.current += Math.sign(dx) * step;
        } else {
          x.current = restX(side.current);
          if (!reduced && now > nextYawn.current) {
            setYawn(true); window.setTimeout(() => setYawn(false), 2400);
            nextYawn.current = now + 16000 + Math.random() * 14000;
          }
          if (!reduced && now > nextWalk.current && !sayingRef.current) {
            side.current = side.current === 'left' ? 'right' : 'left';
            face.current = side.current === 'right' ? 1 : -1;
            setPose('stand');
            window.setTimeout(() => { target.current = restX(side.current); setPose('walk'); }, 600);
            nextWalk.current = now + 1e9;
          }
        }
      }
      const el = elRef.current;
      if (el) {
        el.style.transform = `translate3d(${x.current}px, 0, 0)`;
        el.style.setProperty('--face', String(target.current !== null ? Math.sign(target.current - x.current) || face.current : side.current === 'right' ? -1 : 1));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener('mascots-hide', onHide); removeEventListener('lion-say', onSay); removeEventListener('scroll', onScroll); removeEventListener('parrot-on-lion', onParrot); clearTimeout(sayTimer.current); };
  }, []);

  if (hidden) return null;
  const bw = Math.min(300, innerWidth - 24);
  return (
    <>
      <button ref={elRef} type="button" data-lion data-pose={pose} className={`lg ${away ? 'is-away' : ''}`} aria-label="The lioness: tap for something useful"
        style={{ width: w.current }} onClick={() => (say ? setSay(null) : speak(nextLine()))}>
        <span className="lg-flip"><LionArt pose={pose} yawn={yawn} width={w.current} /></span>
        {hint && !say && <span className="lg-hint" aria-hidden="true">…</span>}
        {/* a spot on her back where the parrot can ride along */}
        <span className="lg-perch" data-parrot-perch data-face="1" />
      </button>
      {say && (
        <div className="lg-say" role="status" aria-live="polite"
          style={{ width: bw, left: Math.max(12, Math.min(innerWidth - bw - 12, say.x - bw / 2)), top: Math.max(12, say.y - 12), transform: 'translateY(-100%)' }}>
          <p>{say.text}</p>
          <div className="lg-foot">
            <a href="/contact#callback">Ask Magda</a>
            <button type="button" onClick={() => speak(nextLine())}>Another one</button>
          </div>
          <button type="button" className="lg-x" aria-label="Close" onClick={() => setSay(null)}>×</button>
        </div>
      )}
    </>
  );
}
