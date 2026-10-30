import { useId } from 'react';

// The lioness: Magda's second mascot. Side view, facing right, flat illustration in the same style as the parrot.
// Poses: 'lie' (sphinx pose: front paws forward, head up), 'walk' (legs swing, see lion.css), 'stand'.
// `yawn` opens the jaw. Classes on the parts are animated by src/styles/lion.css.

export type LionPose = 'lie' | 'walk' | 'stand' | 'head';

export default function LionArt({ pose = 'lie', yawn = false, width = 170, mono }: { pose?: LionPose; yawn?: boolean; width?: number; mono?: string }) {
  const id = useId().replace(/:/g, '');
  const u = (n: string) => (mono ? mono : `url(#${n}${id})`);
  const c = (hex: string) => (mono ? mono : hex);
  const lying = pose === 'lie';
  // a soft darker edge on the big shapes, so she reads as drawn rather than cut out
  const line = mono ? {} : { stroke: '#8C5E30', strokeOpacity: 0.32, strokeWidth: 1.2 };
  const shade = mono ? 'transparent' : '#9C6428';
  const light = mono ? 'transparent' : '#F6E3BC';

  // head + neck (shared by all poses); placed with a transform per pose
  const head = (
    <g className="ln-head">
      {/* ear (back) */}
      <path className="ln-ear" d="M36 7 C 31 -4, 38 -12, 47 -9 C 53 -7, 55 1, 51 8 Z" fill={u('fur')} stroke={c('#7A4E2A')} strokeWidth="1.6" />
      <path d="M41 4 C 39 -2, 42 -6, 47 -5 C 50 -3, 50 1, 48 5 Z" fill={c('#8A5A33')} opacity=".75" />
      {/* skull and muzzle */}
      <path d="M22 26 C 22 8, 38 -2, 56 0 C 70 1, 82 8, 88 17 C 96 21, 103 27, 104 34 C 104 40, 100 44, 95 45 C 93 51, 86 56, 76 57 C 63 59, 48 58, 38 54 C 26 49, 22 38, 22 26 Z" fill={u('fur')} {...line} />
      <path d="M34 10 C 44 2, 60 1, 74 7" stroke={c('#B57B36')} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".35" />
      {/* cheek ruff, lighter */}
      <path d="M30 40 C 36 50, 50 56, 64 56 C 56 50, 52 44, 50 36 C 44 40, 36 42, 30 40 Z" fill={c('#F1D6A3')} opacity=".55" />
      {/* pale muzzle */}
      <path d="M78 30 C 87 27, 99 30, 103 37 C 102 44, 93 48, 82 48 C 74 45, 72 35, 78 30 Z" fill={c('#F6E7C8')} />
      {/* brow shading and eye */}
      <path d="M58 16 C 64 12, 72 13, 77 17" stroke={c('#9A6A35')} strokeWidth="2" fill="none" strokeLinecap="round" opacity=".6" />
      {/* the pale marks above and below a lioness's eye */}
      <path d="M59 25.5 C 64 28.5, 71 28.5, 76 24.5" stroke={c('#F6E7C8')} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M62 17.5 C 66 15.5, 71 15.5, 74 17.5" stroke={c('#F1D6A3')} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".8" />
      <g className="ln-eye">
        <path d="M60 22 C 64 18, 71 18, 75 22 C 71 25.5, 64 25.5, 60 22 Z" fill={c('#3B2412')} />
        <path d="M62.5 22 C 65 20, 70 20, 72.5 22 C 70 24, 65 24, 62.5 22 Z" fill={c('#D59A2A')} />
        <circle cx="68.5" cy="22" r="1.7" fill={c('#1C0E06')} />
        <circle cx="69.6" cy="21.2" r=".7" fill="#fff" opacity={mono ? 0 : 1} />
      </g>
      {/* the dark "tear line" running from the eye down the muzzle */}
      <path d="M75.5 23.5 C 79.5 27, 81.5 31, 82 36" stroke={c('#6B4423')} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".8" />
      {/* nose */}
      <path d="M95 24.5 C 100.5 25, 104.5 28.5, 104 33 C 100.5 34.5, 96 33, 94.5 29.5 Z" fill={c('#A45C4E')} />
      <path d="M95 24.5 C 100.5 25, 104.5 28.5, 104 33" stroke={c('#5C2E22')} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* upper lip line */}
      <path d="M103 35.5 C 101 39.5, 97 41.5, 92 41.5 C 89 43.5, 84 44.5, 80 43.5" stroke={c('#8C5E3C')} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {/* whisker dots */}
      <g fill={c('#B98A55')} opacity=".7"><circle cx="89" cy="35.5" r=".9" /><circle cx="93" cy="37.5" r=".9" /><circle cx="90" cy="39.5" r=".9" /></g>
      {/* mouth interior + lower jaw (rotates open for a yawn) */}
      <path className="ln-mouth" d="M58 45 C 72 43, 86 43, 96 43 C 94 52, 80 58, 64 56 Z" fill={c('#7A2A22')} />
      <path className="ln-tongue" d="M70 52 C 77 48, 87 48.5, 90 49.5 C 85 55, 76 57, 70 52 Z" fill={c('#D86B6B')} />
      <g className="ln-jaw">
        <path d="M56 46 C 70 46, 84 45, 94 43 C 93 49, 86 55, 76 56.5 C 65 58, 56 55, 50 51 Z" fill={u('fur')} />
        <path d="M62 50 C 72 50.5, 85 49, 92 45.5 C 90 52, 83 56, 74 56.5 C 67 56.5, 62 54, 62 50 Z" fill={c('#FBF0DA')} />
      </g>
      <g className="ln-teeth" fill="#FFF8EA" opacity={mono ? 0 : 1}><path d="M89 43.5 l 2 4 l 2 -4 Z" /><path d="M81 44 l 1.6 3 l 1.6 -3 Z" /></g>
    </g>
  );

  const tail = (
    <g className="ln-tail">
      <path d="M8 0 C -10 6, -26 22, -30 42 C -33 56, -28 66, -20 68" stroke={u('fur')} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M-24 60 C -30 64, -30 74, -22 78 C -14 80, -10 74, -12 66 C -14 61, -19 58, -24 60 Z" fill={c('#5C3A22')} />
    </g>
  );

  const leg = (cls: string, d: string, far = false) => (
    <g className={cls}><path d={d} fill={far ? u('furFar') : u('fur')} {...line} /></g>
  );

  if (pose === 'head') return (
    <svg className="ln ln-mark" viewBox="18 -14 90 76" width={width} height={Math.round((width * 76) / 90)} aria-hidden="true">
      <defs><linearGradient id={`fur${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6B872" /><stop offset=".55" stopColor="#D09A4E" /><stop offset="1" stopColor="#B57B36" /></linearGradient></defs>
      {head}
    </svg>
  );

  return (
    <svg className={`ln ${lying ? 'is-lying' : 'is-' + pose} ${yawn ? 'is-yawning' : ''}`} viewBox="-40 -30 350 230" width={width} height={Math.round((width * 230) / 350)} aria-hidden="true">
      <defs>
        <linearGradient id={`fur${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6B872" /><stop offset=".55" stopColor="#D09A4E" /><stop offset="1" stopColor="#B57B36" /></linearGradient>
        <linearGradient id={`furFar${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C38C45" /><stop offset="1" stopColor="#9C6A2E" /></linearGradient>
        <linearGradient id={`belly${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E6B872" stopOpacity="0" /><stop offset="1" stopColor="#F3DDB0" /></linearGradient>
      </defs>
      {/* soft ground shadow */}
      <ellipse cx="160" cy="192" rx={lying ? 132 : 100} ry="7" fill="#14322B" opacity={mono ? 0 : 0.14} />

      {lying ? (
        <g className="ln-body-wrap">
          {/* tail along the ground, dark tuft at the end */}
          <g className="ln-tail">
            <path d="M74 170 C 52 178, 30 184, 12 180 C 0 177, -8 170, -6 160" stroke={u('fur')} strokeWidth="7.5" fill="none" strokeLinecap="round" />
            <path d="M-11 163 C -17 156, -13 146, -5 146 C 3 147, 4 156, -1 162 Z" fill={c('#4A2C18')} />
          </g>
          {/* far front leg */}
          <path d="M206 164 C 222 162, 248 164, 268 168 C 276 170, 278 177, 272 180 L 210 182 Z" fill={u('furFar')} />
          <g className="ln-breathe">
            {/* body: dip behind the shoulders, hump of the shoulder blade */}
            <path d="M70 154 C 68 130, 86 114, 114 112 C 138 111, 152 116, 170 110 C 186 104, 204 102, 216 110 C 228 118, 234 136, 230 154 C 226 172, 214 184, 196 188 L 98 189 C 78 186, 70 172, 70 154 Z" fill={u('fur')} {...line} />
            <path d="M88 122 C 104 114, 132 114, 152 117 C 170 112, 190 103, 210 106 C 196 114, 176 122, 152 126 C 130 129, 106 128, 88 122 Z" fill={shade} opacity=".38" />
            <path d="M104 184 C 134 188, 182 188, 208 182 C 194 174, 150 174, 104 180 Z" fill={light} opacity=".7" />
            {/* haunch */}
            <path d="M66 152 C 66 126, 92 112, 118 120 C 142 128, 148 160, 136 180 C 124 194, 92 194, 78 184 C 69 176, 66 164, 66 152 Z" fill={u('fur')} {...line} />
            <path d="M80 136 C 92 124, 116 122, 132 134" stroke={shade} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".4" />
            <path d="M88 130 C 98 124, 112 124, 120 130" stroke={light} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".5" />
            {/* back paw tucked forward */}
            <path d="M114 180 C 128 176, 152 178, 166 182 C 174 184, 175 191, 167 193 L 120 193 C 110 192, 108 184, 114 180 Z" fill={u('fur')} {...line} />
            <path d="M158 186 l 0 6 M164 185.5 l 0 6.5" stroke={c('#8C5E3C')} strokeWidth="1.2" opacity=".6" />
          </g>
          {/* chest and neck, held up */}
          <path d="M196 118 C 202 98, 214 82, 230 78 C 246 76, 258 90, 258 110 C 258 132, 248 150, 232 158 C 214 162, 200 152, 196 136 Z" fill={u('fur')} {...line} />
          <path d="M232 112 C 246 118, 252 134, 246 150 C 236 156, 226 152, 222 144 C 226 134, 228 122, 232 112 Z" fill={light} opacity=".75" />
          {/* near front leg: elbow, forearm, big soft paw */}
          <path d="M196 142 C 208 134, 226 142, 230 158 L 232 168 C 250 170, 272 172, 288 174 C 298 175, 302 184, 294 190 C 280 193, 240 193, 210 192 C 192 190, 186 160, 196 142 Z" fill={u('fur')} {...line} />
          <path d="M202 172 C 212 180, 224 181, 234 177" stroke={shade} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".4" />
          <path d="M278 183 l 0 7 M284 182 l 0.5 8 M290 182 l 1 7" stroke={c('#8C5E3C')} strokeWidth="1.2" opacity=".6" />
          <g transform="translate(194 52)">{head}</g>
        </g>
      ) : (
        <g className="ln-body-wrap">
          {leg('ln-leg ln-leg-bf', 'M80 108 C 92 106, 100 116, 98 128 L 95 174 C 97 180, 100 184, 96 188 L 80 188 C 76 187, 78 181, 81 175 L 78 130 Z', true)}
          {leg('ln-leg ln-leg-ff', 'M188 112 C 198 110, 205 116, 204 126 L 201 175 C 203 180, 206 184, 202 188 L 187 188 C 183 187, 185 181, 188 175 L 186 126 Z', true)}
          <g transform="translate(64 86)">{tail}</g>
          <g className="ln-breathe">
            <path d="M60 96 C 60 78, 78 68, 104 68 C 128 68, 146 72, 166 68 C 184 64, 204 62, 218 68 C 230 74, 236 90, 232 106 C 228 120, 220 128, 208 132 C 194 136, 182 134, 170 132 C 150 136, 120 138, 100 134 C 78 130, 60 116, 60 96 Z" fill={u('fur')} {...line} />
            <path d="M80 78 C 104 70, 130 72, 150 74 C 170 70, 192 64, 214 68 C 198 76, 176 82, 150 84 C 126 86, 100 86, 80 78 Z" fill={shade} opacity=".35" />
            <path d="M96 124 C 130 132, 176 132, 214 120 C 206 134, 186 138, 168 134 C 146 138, 116 138, 100 134 C 96 131, 95 128, 96 124 Z" fill={u('belly')} />
          </g>
          {leg('ln-leg ln-leg-bn', 'M68 92 C 86 86, 108 98, 108 120 C 106 138, 100 150, 100 160 L 102 175 C 105 180, 109 184, 105 188 L 88 188 C 84 187, 86 181, 90 175 L 86 152 C 74 140, 64 116, 68 92 Z')}
          {leg('ln-leg ln-leg-fn', 'M198 106 C 210 104, 220 110, 220 122 L 216 175 C 219 180, 223 184, 219 188 L 202 188 C 198 187, 200 181, 203 175 L 200 124 Z')}
          <path d="M196 80 C 202 62, 220 52, 238 54 C 252 64, 252 96, 236 114 C 218 120, 200 108, 196 80 Z" fill={u('fur')} {...line} />
          <path d="M232 76 C 244 82, 248 98, 240 110 C 232 112, 226 106, 226 98 C 228 90, 230 82, 232 76 Z" fill={light} opacity=".7" />
          <g transform="translate(206 24)">{head}</g>
        </g>
      )}
    </svg>
  );
}
