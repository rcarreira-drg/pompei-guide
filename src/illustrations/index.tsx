import { useId } from 'react';
import type { IllustrationName } from '@/content/types';

/**
 * Ilustraciones SVG originales, estilo brutalista / xilografía moderna.
 * Paleta limitada: papel, tinta, rojo pompeyano, ocre, ceniza.
 * viewBox 0 0 200 200, trazos gruesos, formas planas, tramas de hatching.
 */

const PAPER = '#f2efe6';
const INK = '#111111';
const RED = '#b4321e';
const OCHRE = '#d9a521';
const ASH = '#6b6b6b';

interface PatternIds {
  hatch: string;
  hatchAsh: string;
  cross: string;
  dots: string;
}

interface IconProps {
  ids: PatternIds;
}

function Defs({ ids }: IconProps) {
  return (
    <defs>
      <pattern id={ids.hatch} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1={0} y1={0} x2={0} y2={10} stroke={INK} strokeWidth={3} />
      </pattern>
      <pattern id={ids.hatchAsh} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width={9} height={9} fill={ASH} />
        <line x1={0} y1={0} x2={0} y2={9} stroke={INK} strokeWidth={3} />
      </pattern>
      <pattern id={ids.cross} width={10} height={10} patternUnits="userSpaceOnUse">
        <line x1={0} y1={0} x2={10} y2={10} stroke={INK} strokeWidth={2} />
        <line x1={10} y1={0} x2={0} y2={10} stroke={INK} strokeWidth={2} />
      </pattern>
      <pattern id={ids.dots} width={12} height={12} patternUnits="userSpaceOnUse">
        <circle cx={3.5} cy={3.5} r={2.2} fill={INK} />
      </pattern>
    </defs>
  );
}

/** Marco de papel + tinta compartido por todos los iconos. */
function Frame() {
  return <rect x={4} y={4} width={192} height={192} fill={PAPER} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />;
}

/* ---------- 1. VESUBIO ---------- */
function IllusVesuvio({ ids }: IconProps) {
  return (
    <g>
      {/* montaña de doble cumbre: Somma (izq., más baja) + cono del Vesubio (dcha., con cráter) */}
      <polygon
        points="20,175 65,95 95,128 112,58 120,68 130,68 138,55 180,175"
        fill={`url(#${ids.hatchAsh})`}
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="miter"
      />
      {/* tronco de la columna eruptiva, saliendo del cráter */}
      <polygon points="118,68 132,68 128,30 122,30" fill={`url(#${ids.hatchAsh})`} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      {/* nube en forma de pino/hongo, ancha y plana, hasta el borde superior */}
      <polygon
        points="85,34 50,28 47,17 65,9 80,15 100,5 120,15 136,9 153,17 150,28 116,34"
        fill={`url(#${ids.hatchAsh})`}
        stroke={INK}
        strokeWidth={7}
        strokeLinejoin="miter"
      />
      {/* relámpago dentro de la nube */}
      <polyline points="90,14 102,20 94,23 108,32" fill="none" stroke={RED} strokeWidth={4} strokeLinecap="square" strokeLinejoin="miter" />
      {/* lapilli cayendo a los lados */}
      <circle cx={38} cy={45} r={3} fill={INK} />
      <circle cx={165} cy={40} r={3} fill={INK} />
      <circle cx={28} cy={75} r={2.5} fill={INK} />
      <circle cx={172} cy={70} r={2.5} fill={INK} />
      <circle cx={44} cy={105} r={2} fill={INK} />
      <circle cx={160} cy={100} r={2} fill={INK} />
      <circle cx={95} cy={44} r={2} fill={INK} />
      <circle cx={148} cy={20} r={2} fill={INK} />
      <circle cx={60} cy={20} r={2} fill={INK} />
      <line x1={20} y1={175} x2={180} y2={175} stroke={INK} strokeWidth={8} />
      <rect x={20} y={175} width={160} height={8} fill={`url(#${ids.hatchAsh})`} stroke={INK} strokeWidth={4} />
    </g>
  );
}

/* ---------- 2. FORO ---------- */
function IllusForo({ ids }: IconProps) {
  const cols = [40, 72, 104, 136, 168];
  return (
    <g>
      <polygon points="70,58 130,58 100,30" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={30} y={58} width={146} height={14} fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      {cols.map((cx) => (
        <g key={cx}>
          <rect x={cx - 7} y={70} width={14} height={95} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
          <line x1={cx - 3} y1={72} x2={cx - 3} y2={163} stroke={INK} strokeWidth={2} />
          <line x1={cx + 3} y1={72} x2={cx + 3} y2={163} stroke={INK} strokeWidth={2} />
        </g>
      ))}
      <rect x={25} y={160} width={156} height={10} fill={INK} />
      <rect x={20} y={172} width={166} height={10} fill={`url(#${ids.hatch})`} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
    </g>
  );
}

/* ---------- 3. ANFITEATRO ---------- */
function IllusAnfiteatro() {
  const spokes: [number, number, number, number][] = [
    [136, 105, 185, 105],
    [125.5, 120.6, 160.1, 142.4],
    [100, 127, 100, 165],
    [74.5, 120.6, 39.9, 142.4],
    [64, 105, 15, 105],
    [74.5, 89.4, 39.9, 67.6],
    [100, 83, 100, 45],
    [125.5, 89.4, 160.1, 67.6],
  ];
  return (
    <g>
      <ellipse cx={100} cy={105} rx={85} ry={60} fill={ASH} stroke={INK} strokeWidth={7} />
      <ellipse cx={100} cy={105} rx={60} ry={40} fill={PAPER} stroke={INK} strokeWidth={6} />
      {spokes.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={3} />
      ))}
      <ellipse cx={100} cy={105} rx={36} ry={22} fill={OCHRE} stroke={INK} strokeWidth={6} />
      <rect x={92} y={40} width={16} height={10} fill={INK} />
      <rect x={92} y={158} width={16} height={12} fill={INK} />
    </g>
  );
}

/* ---------- 4. COLUMNA ---------- */
function IllusColumna() {
  return (
    <g>
      <rect x={60} y={175} width={80} height={12} fill={INK} />
      <rect x={68} y={163} width={64} height={12} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={78} y={55} width={44} height={110} fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      {[86, 96, 106, 116].map((x) => (
        <line key={x} x1={x} y1={58} x2={x} y2={162} stroke={INK} strokeWidth={2} />
      ))}
      <polyline points="80,100 92,106 84,116 100,122" fill="none" stroke={INK} strokeWidth={3} />
      <polygon points="70,55 130,55 120,35 80,35" fill={OCHRE} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={65} y={25} width={70} height={12} fill={INK} />
    </g>
  );
}

/* ---------- 5. FRESCO ---------- */
function IllusFresco() {
  return (
    <g>
      <rect x={25} y={25} width={150} height={150} fill={RED} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <rect x={40} y={40} width={120} height={120} fill="none" stroke={INK} strokeWidth={5} />
      <polygon points="60,120 100,150 140,120 128,160 72,160" fill={OCHRE} />
      <circle cx={100} cy={62} r={13} fill={INK} />
      <polygon points="84,46 100,28 116,46 108,40 100,35 92,40" fill={INK} />
      <polygon points="90,74 110,74 116,128 84,128" fill={INK} />
      <line x1={88} y1={82} x2={58} y2={65} stroke={INK} strokeWidth={10} strokeLinecap="square" />
      <line x1={112} y1={82} x2={142} y2={65} stroke={INK} strokeWidth={10} strokeLinecap="square" />
      <line x1={92} y1={128} x2={78} y2={162} stroke={INK} strokeWidth={10} strokeLinecap="square" />
      <line x1={108} y1={128} x2={122} y2={162} stroke={INK} strokeWidth={10} strokeLinecap="square" />
    </g>
  );
}

/* ---------- 6. LARARIUM ---------- */
function IllusLararium() {
  return (
    <g>
      <polygon points="55,70 145,70 100,35" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={65} y={70} width={14} height={80} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={121} y={70} width={14} height={80} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={79} y={75} width={42} height={70} fill={OCHRE} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
      <polygon points="100,108 108,128 100,148 92,128" fill={INK} />
      <circle cx={100} cy={146} r={6} fill={INK} />
      <rect x={60} y={150} width={80} height={20} fill={INK} />
    </g>
  );
}

/* ---------- 7. TERMOPOLIO ---------- */
function IllusTermopolio({ ids }: IconProps) {
  return (
    <g>
      <rect x={140} y={40} width={40} height={50} fill={OCHRE} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <circle cx={160} cy={55} r={14} fill={ASH} stroke={INK} strokeWidth={5} />
      <circle cx={160} cy={55} r={7} fill={INK} />
      <rect x={20} y={90} width={160} height={70} fill={OCHRE} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      {[55, 90, 125, 160].map((x) => (
        <line key={x} x1={x} y1={92} x2={x} y2={158} stroke={INK} strokeWidth={3} />
      ))}
      <rect x={20} y={125} width={160} height={35} fill={`url(#${ids.hatch})`} />
      {[55, 95, 135].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={92} r={18} fill={ASH} stroke={INK} strokeWidth={6} />
          <circle cx={cx} cy={92} r={9} fill={INK} />
        </g>
      ))}
      <rect x={15} y={158} width={170} height={8} fill={INK} />
    </g>
  );
}

/* ---------- 8. TERMAS ---------- */
function IllusTermas() {
  return (
    <g>
      <path d="M35,92 A65,45 0 0 1 165,92 Z" fill={ASH} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={35} y={88} width={130} height={8} fill={INK} />
      <circle cx={100} cy={68} r={8} fill={INK} />
      <polyline points="90,55 95,45 90,35 95,25" fill="none" stroke={INK} strokeWidth={4} />
      <polyline points="110,55 115,45 110,35 115,25" fill="none" stroke={INK} strokeWidth={4} />
      <rect x={35} y={96} width={130} height={44} fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={50} y={140} width={100} height={28} fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <polyline points="58,150 68,146 78,150 88,146 98,150 108,146 118,150 128,146 138,150" fill="none" stroke={INK} strokeWidth={3} />
      <polyline points="58,160 68,156 78,160 88,156 98,160 108,156 118,160 128,156 138,160" fill="none" stroke={INK} strokeWidth={3} />
    </g>
  );
}

/* ---------- 9. DOMUS ---------- */
function IllusDomus({ ids }: IconProps) {
  return (
    <g>
      <rect x={30} y={30} width={140} height={140} fill={PAPER} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <polygon points="30,30 170,30 120,80 80,80" fill={`url(#${ids.hatch})`} stroke={INK} strokeWidth={4} strokeLinejoin="miter" />
      <polygon points="170,30 170,170 120,120 120,80" fill={`url(#${ids.hatch})`} stroke={INK} strokeWidth={4} strokeLinejoin="miter" />
      <polygon points="170,170 30,170 80,120 120,120" fill={`url(#${ids.hatch})`} stroke={INK} strokeWidth={4} strokeLinejoin="miter" />
      <polygon points="30,170 30,30 80,80 80,120" fill={`url(#${ids.hatch})`} stroke={INK} strokeWidth={4} strokeLinejoin="miter" />
      <rect x={80} y={80} width={40} height={40} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={90} y={90} width={20} height={20} fill={OCHRE} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
    </g>
  );
}

/* ---------- 10. CALLE ---------- */
function IllusCalle({ ids }: IconProps) {
  return (
    <g>
      <polygon points="0,180 70,60 55,55 -6,172" fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <polygon points="200,180 130,60 145,55 206,172" fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <polygon points="20,180 180,180 130,60 70,60" fill={ASH} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <polygon points="20,180 180,180 130,60 70,60" fill={`url(#${ids.cross})`} />
      <rect x={70} y={150} width={60} height={14} fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={80} y={118} width={40} height={10} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={88} y={94} width={24} height={7} fill={PAPER} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
    </g>
  );
}

/* ---------- 11. PLINIO ---------- */
function IllusPlinio() {
  // hojas de la corona de laurel, repartidas en arco sobre la cabeza
  const leaves: [number, number][] = [
    [69, 54], [82, 40], [100, 33], [118, 40], [131, 54],
  ];
  // pliegues paralelos de la toga sobre los hombros
  const folds: [number, number, number, number][] = [
    [76, 122, 68, 148],
    [90, 119, 84, 149],
    [140, 122, 146, 148],
    [126, 119, 133, 149],
  ];
  return (
    <g>
      {/* pedestal con inscripción */}
      <rect x={50} y={152} width={100} height={30} fill={INK} stroke={INK} strokeWidth={2} strokeLinejoin="miter" />
      <text x={100} y={173} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} fontSize={16} fill={PAPER} letterSpacing={1}>
        PLINIVS
      </text>
      {/* hombros con toga */}
      <polygon points="55,152 145,152 130,116 70,116" fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      {folds.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={2.5} />
      ))}
      {/* banda roja diagonal (clavus) */}
      <polygon points="82,120 98,116 122,148 104,152" fill={RED} stroke={INK} strokeWidth={4} strokeLinejoin="miter" />
      {/* cuello */}
      <rect x={88} y={96} width={24} height={22} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      {/* cabeza ovalada frontal */}
      <ellipse cx={100} cy={68} rx={30} ry={34} fill={PAPER} stroke={INK} strokeWidth={7} />
      <circle cx={70} cy={74} r={6} fill={PAPER} stroke={INK} strokeWidth={5} />
      <circle cx={130} cy={74} r={6} fill={PAPER} stroke={INK} strokeWidth={5} />
      {/* rasgos mínimos, estilo moneda */}
      <line x1={89} y1={64} x2={96} y2={64} stroke={INK} strokeWidth={3} />
      <line x1={104} y1={64} x2={111} y2={64} stroke={INK} strokeWidth={3} />
      <line x1={100} y1={67} x2={100} y2={79} stroke={INK} strokeWidth={3} />
      <line x1={92} y1={87} x2={108} y2={87} stroke={INK} strokeWidth={3} />
      {/* diadema de la corona */}
      <path d="M69,58 A32,32 0 0 1 131,58" fill="none" stroke={INK} strokeWidth={4} />
      {/* hojas de laurel */}
      {leaves.map(([cx, cy], i) => (
        <polygon key={i} points={`${cx},${cy - 10} ${cx + 6},${cy} ${cx},${cy + 10} ${cx - 6},${cy}`} fill={OCHRE} stroke={INK} strokeWidth={3} strokeLinejoin="miter" />
      ))}
    </g>
  );
}

/* ---------- 12. YESO ---------- */
function IllusYeso() {
  return (
    <g>
      <rect x={20} y={155} width={160} height={16} fill={ASH} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <ellipse cx={112} cy={146} rx={56} ry={17} fill={PAPER} stroke={INK} strokeWidth={7} />
      <ellipse cx={138} cy={132} rx={16} ry={11} fill={PAPER} stroke={INK} strokeWidth={6} />
      <circle cx={54} cy={140} r={17} fill={PAPER} stroke={INK} strokeWidth={7} />
      <path d="M74,138 Q86,150 100,142" fill="none" stroke={INK} strokeWidth={3} />
    </g>
  );
}

/* ---------- 13. GLADIADOR ---------- */
function IllusGladiador() {
  return (
    <g>
      <circle cx={65} cy={115} r={26} fill={RED} stroke={INK} strokeWidth={7} />
      <line x1={65} y1={89} x2={65} y2={141} stroke={INK} strokeWidth={3} />
      <line x1={39} y1={115} x2={91} y2={115} stroke={INK} strokeWidth={3} />
      <circle cx={65} cy={115} r={6} fill={INK} />
      <polygon points="85,150 100,150 96,190 79,190" fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <polygon points="100,150 118,150 128,190 106,190" fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <polygon points="80,95 120,95 118,150 82,150" fill={OCHRE} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <polygon points="118,105 135,90 145,95 128,115" fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <polygon points="140,92 170,60 176,65 146,97" fill={INK} />
      <circle cx={100} cy={75} r={18} fill={INK} />
      <polygon points="85,60 100,32 115,60" fill={RED} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
      <rect x={93} y={72} width={14} height={4} fill={PAPER} />
    </g>
  );
}

/* ---------- 14. ANFORA ---------- */
function IllusAnfora({ ids }: IconProps) {
  return (
    <g>
      <polygon points="70,80 130,80 138,120 120,165 100,180 80,165 62,120" fill={RED} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={62} y={110} width={76} height={9} fill={OCHRE} />
      <rect x={62} y={110} width={76} height={9} fill={`url(#${ids.hatch})`} opacity={0.5} />
      <path d="M80,40 Q52,50 62,78" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="square" />
      <path d="M120,40 Q148,50 138,78" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="square" />
      <rect x={90} y={30} width={20} height={25} fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      <rect x={82} y={22} width={36} height={10} fill={INK} />
    </g>
  );
}

/* ---------- 15. MOSAICO (cave canem) ---------- */
function IllusMosaico() {
  const cell = 10;
  const ox = 35;
  const oy = 35;
  const dog: [number, number][] = [
    [9, 4], [10, 4], [9, 5], [10, 5], [11, 5],
    [10, 3],
    [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
    [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6],
    [7, 7], [7, 8], [8, 7], [8, 8],
    [3, 7], [3, 8], [4, 7], [4, 8],
    [2, 4], [1, 3],
  ];
  return (
    <g>
      <rect x={20} y={20} width={160} height={160} fill={OCHRE} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <rect x={35} y={35} width={130} height={130} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      {dog.map(([c, r], i) => (
        <rect key={i} x={ox + c * cell} y={oy + r * cell} width={cell} height={cell} fill={INK} stroke={PAPER} strokeWidth={0.5} />
      ))}
      <rect x={ox + 8 * cell} y={oy + 5 * cell} width={cell} height={cell} fill={RED} stroke={PAPER} strokeWidth={0.5} />
    </g>
  );
}

/* ---------- 16. TEATRO ---------- */
function IllusTeatro({ ids }: IconProps) {
  const radii = [30, 50, 70, 90];
  const rays = [180, 135, 90, 45, 0].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return [100 + 90 * Math.cos(rad), 150 - 90 * Math.sin(rad)] as [number, number];
  });
  return (
    <g>
      <path d="M10,150 A90,90 0 0 1 190,150 Z" fill={`url(#${ids.hatchAsh})`} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      {radii.map((r) => (
        <path key={r} d={`M${100 - r},150 A${r},${r} 0 0 1 ${100 + r},150`} fill="none" stroke={INK} strokeWidth={3} />
      ))}
      {rays.map(([x, y], i) => (
        <line key={i} x1={100} y1={150} x2={x} y2={y} stroke={INK} strokeWidth={3} />
      ))}
      <path d="M75,150 A25,25 0 0 1 125,150 Z" fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={40} y={150} width={120} height={26} fill={PAPER} stroke={INK} strokeWidth={7} strokeLinejoin="miter" />
      {[70, 97, 124].map((x) => (
        <rect key={x} x={x} y={155} width={8} height={19} fill={INK} />
      ))}
    </g>
  );
}

/* ---------- 17. LUPANAR ---------- */
function IllusLupanar() {
  return (
    <g>
      <rect x={40} y={70} width={120} height={100} fill={PAPER} stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
      <rect x={35} y={60} width={130} height={12} fill={RED} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
      <rect x={45} y={125} width={28} height={22} fill={ASH} stroke={INK} strokeWidth={5} strokeLinejoin="miter" />
      <rect x={49} y={140} width={20} height={6} fill={INK} />
      <rect x={49} y={146} width={4} height={4} fill={INK} />
      <rect x={64} y={146} width={4} height={4} fill={INK} />
      <rect x={85} y={110} width={30} height={60} fill={INK} />
      <rect x={80} y={100} width={40} height={10} fill={INK} />
      <line x1={100} y1={100} x2={100} y2={88} stroke={INK} strokeWidth={4} />
      <circle cx={100} cy={82} r={8} fill={OCHRE} stroke={INK} strokeWidth={5} />
      <line x1={100} y1={74} x2={92} y2={64} stroke={INK} strokeWidth={3} />
      <line x1={100} y1={74} x2={100} y2={62} stroke={INK} strokeWidth={3} />
      <line x1={100} y1={74} x2={108} y2={64} stroke={INK} strokeWidth={3} />
      <rect x={30} y={168} width={140} height={8} fill={INK} />
    </g>
  );
}

/* ---------- 18. PAN ---------- */
function IllusPan() {
  const wedges: [number, number, number, number][] = [
    [118, 100, 170, 100],
    [112.7, 87.3, 149.5, 50.5],
    [100, 82, 100, 30],
    [87.3, 87.3, 50.5, 50.5],
    [82, 100, 30, 100],
    [87.3, 112.7, 50.5, 149.5],
    [100, 118, 100, 170],
    [112.7, 112.7, 149.5, 149.5],
  ];
  return (
    <g>
      <circle cx={100} cy={100} r={70} fill={OCHRE} stroke={INK} strokeWidth={8} />
      <circle cx={100} cy={100} r={58} fill="none" stroke={INK} strokeWidth={3} />
      {wedges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={5} />
      ))}
      <circle cx={100} cy={100} r={18} fill="none" stroke={INK} strokeWidth={5} />
    </g>
  );
}

/* ---------- 19. CENIZA ---------- */
function IllusCeniza({ ids }: IconProps) {
  return (
    <g>
      <rect x={20} y={150} width={160} height={30} fill={INK} />
      <rect x={20} y={120} width={160} height={30} fill={ASH} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={20} y={85} width={160} height={35} fill={OCHRE} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={20} y={85} width={160} height={35} fill={`url(#${ids.dots})`} opacity={0.6} />
      <rect x={20} y={60} width={160} height={25} fill={PAPER} stroke={INK} strokeWidth={6} strokeLinejoin="miter" />
      <rect x={20} y={60} width={160} height={25} fill={`url(#${ids.dots})`} />
      <line x1={20} y1={150} x2={180} y2={150} stroke={RED} strokeWidth={4} />
      <circle cx={40} cy={25} r={3} fill={INK} />
      <circle cx={70} cy={15} r={2} fill={INK} />
      <circle cx={100} cy={30} r={4} fill={INK} />
      <circle cx={130} cy={18} r={2.5} fill={INK} />
      <circle cx={160} cy={28} r={3} fill={INK} />
      <circle cx={55} cy={45} r={2} fill={INK} />
      <circle cx={120} cy={45} r={3} fill={INK} />
      <circle cx={90} cy={50} r={2} fill={INK} />
      <rect x={20} y={20} width={160} height={160} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="miter" />
    </g>
  );
}

/* ---------- 20. BRUJULA ---------- */
function IllusBrujula() {
  type Dir = { dir: [number, number]; r: number; fill: string };
  const dirs: Dir[] = [
    { dir: [0, -1], r: 78, fill: RED },
    { dir: [0.707, -0.707], r: 60, fill: OCHRE },
    { dir: [1, 0], r: 65, fill: INK },
    { dir: [0.707, 0.707], r: 60, fill: OCHRE },
    { dir: [0, 1], r: 65, fill: INK },
    { dir: [-0.707, 0.707], r: 60, fill: OCHRE },
    { dir: [-1, 0], r: 65, fill: INK },
    { dir: [-0.707, -0.707], r: 60, fill: OCHRE },
  ];
  const cx = 100;
  const cy = 100;
  return (
    <g>
      <circle cx={cx} cy={cy} r={80} fill={PAPER} stroke={INK} strokeWidth={8} />
      {dirs.map(({ dir: [dx, dy], r, fill }, i) => {
        const px = -dy;
        const py = dx;
        const side1: [number, number] = [cx + 12 * px, cy + 12 * py];
        const side2: [number, number] = [cx - 12 * px, cy - 12 * py];
        const tip: [number, number] = [cx + r * dx, cy + r * dy];
        return (
          <polygon
            key={i}
            points={`${cx},${cy} ${side1[0]},${side1[1]} ${tip[0]},${tip[1]} ${side2[0]},${side2[1]}`}
            fill={fill}
            stroke={INK}
            strokeWidth={fill === RED ? 7 : 6}
            strokeLinejoin="miter"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={14} fill={PAPER} stroke={INK} strokeWidth={7} />
      <circle cx={cx} cy={cy} r={4} fill={INK} />
      <text x={100} y={19} textAnchor="middle" fontSize={16} fontWeight={900} fill={RED} fontFamily="sans-serif">
        N
      </text>
    </g>
  );
}

const ICONS: Record<IllustrationName, (props: IconProps) => JSX.Element> = {
  vesuvio: IllusVesuvio,
  foro: IllusForo,
  anfiteatro: IllusAnfiteatro,
  columna: IllusColumna,
  fresco: IllusFresco,
  lararium: IllusLararium,
  termopolio: IllusTermopolio,
  termas: IllusTermas,
  domus: IllusDomus,
  calle: IllusCalle,
  plinio: IllusPlinio,
  yeso: IllusYeso,
  gladiador: IllusGladiador,
  anfora: IllusAnfora,
  mosaico: IllusMosaico,
  teatro: IllusTeatro,
  lupanar: IllusLupanar,
  pan: IllusPan,
  ceniza: IllusCeniza,
  brujula: IllusBrujula,
};

const LABELS: Record<IllustrationName, string> = {
  vesuvio: 'El Vesubio en erupción',
  foro: 'El Foro con su columnata',
  anfiteatro: 'El Anfiteatro visto desde arriba',
  columna: 'Columna de orden dórico',
  fresco: 'Fresco pintado en un panel de pared',
  lararium: 'Lararium, altar doméstico',
  termopolio: 'Termopolio con dolia empotrados',
  termas: 'Las termas con su sala abovedada',
  domus: 'Domus con atrio y compluvium',
  calle: 'Calle empedrada con pasos de peatones',
  plinio: 'Plinio el Joven, busto de perfil',
  yeso: 'Calco de yeso de una víctima',
  gladiador: 'Gladiador con escudo y espada',
  anfora: 'Ánfora romana',
  mosaico: 'Mosaico "cave canem"',
  teatro: 'El Teatro Grande',
  lupanar: 'Fachada del lupanar',
  pan: 'Pan pompeyano dividido en ocho gajos',
  ceniza: 'Estratos de ceniza volcánica',
  brujula: 'Rosa de los vientos',
};

export const ILLUSTRATION_NAMES: IllustrationName[] = [
  'vesuvio', 'foro', 'anfiteatro', 'columna', 'fresco', 'lararium',
  'termopolio', 'termas', 'domus', 'calle', 'plinio', 'yeso',
  'gladiador', 'anfora', 'mosaico', 'teatro', 'lupanar', 'pan',
  'ceniza', 'brujula',
];

export function Illustration({
  name,
  className,
  title,
}: {
  name: IllustrationName;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ids: PatternIds = {
    hatch: `il-hatch-${uid}`,
    hatchAsh: `il-hatchash-${uid}`,
    cross: `il-cross-${uid}`,
    dots: `il-dots-${uid}`,
  };
  const Icon = ICONS[name];
  const label = title ?? LABELS[name] ?? name;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className={className} xmlns="http://www.w3.org/2000/svg">
      <title>{label}</title>
      <Defs ids={ids} />
      <Frame />
      <g strokeLinecap="square" strokeLinejoin="miter">
        <Icon ids={ids} />
      </g>
    </svg>
  );
}
