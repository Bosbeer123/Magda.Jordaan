import { useId } from 'react';

// The parrot drawing, used by the flying guide and the mockups page.
// Standing upright facing right; when flying it leans forward, folds the feet away and opens two
// long wings that flap from the shoulder (the folded wing is hidden in flight).

export type ParrotPalette = 'green' | 'red' | 'scarlet';

const PALETTES: Record<ParrotPalette, {
  body: [string, string, string]; sheen: string; head: [string, string, string]; wing: [string, string, string];
  tail: [string, string]; tail2: string; accent: [string, string]; streak: string; feather: string; crest: string;
}> = {
  // Cape parrot: green body, olive-silver head, red forehead and wing bend
  green: {
    body: ['#7DBE55', '#4F983F', '#2C6A31'], sheen: '#A6D97B', head: ['#CFC3A2', '#A3926F', '#8E9A62'],
    wing: ['#4F9840', '#2D6C35', '#1C5254'], tail: ['#2C6A31', '#1A4B4D'], tail2: '#225846',
    accent: ['#F2603C', '#C21F35'], streak: '#B9E293', feather: '#1F5A3A', crest: '#EFE8D4',
  },
  // Momentum red body with a deep green wing (like a red lory): the most visible on cream and green
  red: {
    body: ['#F0533F', '#D4192F', '#9E0E25'], sheen: '#FF8C73', head: ['#F46A4E', '#D92A33', '#B3142B'],
    wing: ['#3E8C45', '#24653A', '#164B3C'], tail: ['#B3142B', '#6E0A1C'], tail2: '#24653A',
    accent: ['#FFD24A', '#F2A70E'], streak: '#FFB4A1', feather: '#123F2F', crest: '#FFE1D6',
  },
  // Scarlet macaw colours: red body, yellow shoulder, blue flight feathers
  scarlet: {
    body: ['#F0533F', '#D4192F', '#9E0E25'], sheen: '#FF8C73', head: ['#F46A4E', '#D92A33', '#B3142B'],
    wing: ['#F2B21B', '#3A7BC8', '#1F4F96'], tail: ['#C8102E', '#1F4F96'], tail2: '#2E66B0',
    accent: ['#FFD24A', '#F2A70E'], streak: '#FFB4A1', feather: '#173D73', crest: '#FFE1D6',
  },
};

export default function ParrotArt({ flying = false, palette = 'green', width = 92 }: { flying?: boolean; palette?: ParrotPalette; width?: number }) {
  const id = useId().replace(/:/g, '');
  const c = PALETTES[palette];
  const u = (n: string) => `url(#${n}${id})`;
  const BODY = 'M130 22 C 146 22, 158 32, 160 46 C 162 58, 158 66, 160 80 C 164 104, 158 132, 146 156 C 136 174, 122 188, 108 188 C 94 186, 86 170, 84 148 C 82 122, 90 100, 100 84 C 106 72, 104 56, 108 42 C 112 30, 120 22, 130 22 Z';
  // an open wing: leading edge from the shoulder up and back, scalloped primaries on the trailing edge
  const OPEN = 'M120 96 C 108 70, 86 42, 52 20 C 40 13, 26 10, 14 12 C 24 20, 22 26, 30 32 C 20 34, 22 42, 34 46 C 24 50, 28 58, 42 60 C 34 66, 40 74, 54 74 C 50 82, 60 88, 72 86 C 76 96, 90 102, 104 112 Z';
  return (
    <svg className={`pg-bird pal-${palette} ${flying ? 'is-flying' : ''}`} viewBox="0 0 200 224" width={width} height={Math.round(width * 1.12)} aria-hidden="true">
      <defs>
        <linearGradient id={`B${id}`} x1=".3" y1="0" x2=".7" y2="1"><stop offset="0" stopColor={c.body[0]} /><stop offset=".5" stopColor={c.body[1]} /><stop offset="1" stopColor={c.body[2]} /></linearGradient>
        <radialGradient id={`Bh${id}`} cx="70%" cy="45%" r="45%"><stop offset="0" stopColor={c.sheen} stopOpacity=".55" /><stop offset="1" stopColor={c.sheen} stopOpacity="0" /></radialGradient>
        <linearGradient id={`H${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.head[0]} /><stop offset=".6" stopColor={c.head[1]} /><stop offset="1" stopColor={c.head[2]} stopOpacity="0" /></linearGradient>
        <linearGradient id={`W${id}`} x1=".2" y1="0" x2=".6" y2="1"><stop offset="0" stopColor={c.wing[0]} /><stop offset=".6" stopColor={c.wing[1]} /><stop offset="1" stopColor={c.wing[2]} /></linearGradient>
        <linearGradient id={`Wo${id}`} x1="1" y1="1" x2="0" y2="0"><stop offset="0" stopColor={c.wing[0]} /><stop offset=".45" stopColor={c.wing[1]} /><stop offset="1" stopColor={c.wing[2]} /></linearGradient>
        <linearGradient id={`K${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F6EFE0" /><stop offset=".6" stopColor="#DCCAA9" /><stop offset="1" stopColor="#B49C77" /></linearGradient>
        <linearGradient id={`T${id}`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c.tail[0]} /><stop offset="1" stopColor={c.tail[1]} /></linearGradient>
        <linearGradient id={`R${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c.accent[0]} /><stop offset="1" stopColor={c.accent[1]} /></linearGradient>
      </defs>
      <g className="pg-all">
        {/* far wing, only in flight: behind the body */}
        <g className="pg-wing-far"><path d={OPEN} fill={u('Wo')} opacity=".8" transform="translate(14 -6) scale(.92)" /></g>
        <g className="pg-tail">
          <path d="M104 178 C 92 196, 80 210, 66 224 L 80 224 C 92 212, 104 198, 114 184 Z" fill={u('T')} />
          <path d="M110 180 C 102 198, 94 212, 86 224 L 96 224 C 104 212, 112 198, 118 186 Z" fill={c.tail2} />
        </g>
        <g className="pg-body">
          <path d={BODY} fill={u('B')} />
          <path d={BODY} fill={u('Bh')} />
          <g fill="none" stroke={c.streak} strokeWidth="1.3" strokeLinecap="round" opacity=".4">
            <path d="M138 104 q5 3 10 0" /><path d="M134 118 q5 3 10 0" /><path d="M142 126 q5 3 9 0" /><path d="M132 134 q5 3 10 0" /><path d="M138 146 q5 3 9 0" /><path d="M126 156 q5 3 10 0" />
          </g>
          <path d="M112 182 C 116 174, 128 172, 132 180 C 126 186, 118 188, 112 182 Z" fill={u('R')} opacity=".9" />
        </g>
        <g className="pg-head">
          <path d="M130 22 C 146 22, 158 32, 160 46 C 162 58, 158 70, 150 78 C 136 86, 116 84, 106 74 C 104 62, 104 50, 108 40 C 112 30, 120 22, 130 22 Z" fill={u('H')} />
          <path d="M134 23 C 145 22, 155 28, 159 38 C 151 36, 142 34, 134 35 C 131 31, 131 26, 134 23 Z" fill={u('R')} />
          <g fill="none" stroke={c.crest} strokeWidth="1" strokeLinecap="round" opacity=".45"><path d="M114 46 q6 -3 12 0" /><path d="M112 58 q6 -3 12 0" /><path d="M118 68 q6 -3 12 0" /></g>
          {palette !== 'green' && <path d="M133 36 C 142 33, 152 36, 156 44 C 150 52, 136 54, 130 48 C 128 43, 129 39, 133 36 Z" fill="#FFF4EC" opacity=".9" />}
          <g className="pg-eye">
            <circle cx="140" cy="44" r="7.6" fill="#ECE6D9" />
            <circle cx="140.8" cy="44" r="4.8" fill="#4A2C17" />
            <circle cx="140.8" cy="44" r="2.7" fill="#120A05" />
            <circle cx="142.4" cy="42.4" r="1.4" fill="#fff" />
          </g>
          <path d="M155 34 C 170 32, 183 43, 183 59 C 183 69, 178 75, 172 74 C 172 66, 168 60, 160 58 C 155 53, 153 44, 155 34 Z" fill={u('K')} stroke="#A88F69" strokeWidth=".8" />
          <path d="M160 58 C 168 60, 172 66, 172 74 C 165 74, 160 70, 158 64 Z" fill="#BCA47C" />
          <circle cx="158.5" cy="38.5" r="1.3" fill="#8C7656" />
        </g>
        {/* folded wing (perched) */}
        <g className="pg-wing">
          <path d="M112 84 C 126 88, 134 106, 132 130 C 130 154, 118 178, 100 208 C 92 192, 88 170, 88 148 C 88 118, 96 94, 112 84 Z" fill={u('W')} />
          <path d="M112 84 C 122 86, 130 94, 132 106 C 124 102, 116 98, 106 98 Z" fill={u('R')} />
          <g fill="none" stroke={c.feather} strokeWidth="1.5" strokeLinecap="round" opacity=".7">
            <path d="M104 118 q10 2 18 -4" /><path d="M98 132 q11 2 20 -4" /><path d="M95 146 q11 2 20 -5" />
            <path d="M96 160 C 95 176, 96 190, 100 204" /><path d="M104 158 C 103 172, 103 184, 104 196" /><path d="M112 154 C 111 166, 110 176, 108 186" />
          </g>
        </g>
        {/* near wing, only in flight: in front of the body */}
        <g className="pg-wing-near">
          <path d={OPEN} fill={u('Wo')} />
          <path d="M120 96 C 112 80, 100 64, 86 52 C 94 66, 100 80, 104 96 Z" fill={u('R')} opacity=".95" />
          <g fill="none" stroke={c.feather} strokeWidth="1.4" strokeLinecap="round" opacity=".55">
            <path d="M104 96 C 84 72, 60 52, 34 32" /><path d="M100 102 C 82 84, 62 68, 42 58" /><path d="M98 106 C 84 96, 70 86, 56 76" />
          </g>
        </g>
        <g className="pg-feet" stroke="#8E8C86" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M114 186 L 114 204 M114 204 l -10 4 M114 204 l 10 4 M114 204 l -2 -3" />
          <path d="M128 184 L 128 203 M128 203 l -10 4 M128 203 l 10 4" />
        </g>
      </g>
    </svg>
  );
}
