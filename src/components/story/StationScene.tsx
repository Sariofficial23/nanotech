import { motion, useTransform, type MotionValue } from 'framer-motion';
import BrandMark from '../brand/BrandMark';
import Picture from '../ui/Picture';
import Car from './Car';
import { CAR_SPECS, type CarModel } from './carSpecs';
import { STORY } from './storyTimeline';

// Scene units = pixels of the station photo (1672 × 941); the SVG overlay scales with the photo.
const W = 1672;
const H = 941;
const GROUND = 822;
const CAR_SCALE = 1.3;
const START_X = -640;
const STOP_X = 886;
const END_X = 1760;
const PUMP = { x: 772, y: 808, s: 1.25 };
const HOSE_START = { x: PUMP.x + 54 * PUMP.s, y: PUMP.y - 96 * PUMP.s };

const linear = (t: number) => t;
const easeOut = (t: number) => 1 - (1 - t) ** 3; // braking
const easeIn = (t: number) => t ** 3; // pulling away

function fillerPoint(model: CarModel) {
  const f = CAR_SPECS[model].filler;
  return { x: STOP_X + f.x * CAR_SCALE, y: GROUND + f.y * CAR_SCALE };
}

function hosePath(model: CarModel) {
  const end = fillerPoint(model);
  return `M${HOSE_START.x},${HOSE_START.y} C${HOSE_START.x + 14},${HOSE_START.y + 80} ${end.x - 60},${end.y + 50} ${end.x - 8},${end.y + 6} L${end.x},${end.y}`;
}

function Hose({ model, connect }: { model: CarModel; connect: MotionValue<number> }) {
  const end = fillerPoint(model);
  const opacity = useTransform(connect, (v) => (v > 0.01 ? 1 : 0));
  const nozzle = useTransform(connect, [0.85, 1], [0, 1]);
  return (
    <motion.g style={{ opacity }}>
      <motion.path d={hosePath(model)} fill="none" stroke="#111111" strokeWidth="6" strokeLinecap="round" style={{ pathLength: connect }} />
      <motion.g style={{ opacity: nozzle }}>
        <path d={`M${end.x - 18},${end.y + 12} L${end.x},${end.y}`} stroke="#FFC400" strokeWidth="9" strokeLinecap="round" />
        <circle cx={end.x} cy={end.y} r="4" fill="#111111" />
      </motion.g>
    </motion.g>
  );
}

interface StationSceneProps {
  progress: MotionValue<number>;
  priority?: boolean;
  className?: string;
}

export default function StationScene({ progress, priority = false, className }: StationSceneProps) {
  const { a, b } = STORY;

  const xA = useTransform(progress, [0, a.arrive, a.leave, a.gone], [START_X, STOP_X, STOP_X, END_X], {
    ease: [easeOut, linear, easeIn],
  });
  const xB = useTransform(progress, [0, b.start, b.arrive, b.leave, b.gone], [START_X, START_X, STOP_X, STOP_X, END_X], {
    ease: [linear, easeOut, linear, easeIn],
  });

  // Nozzle goes in shortly after the car stops and comes out just before it leaves.
  const hoseA = useTransform(progress, [a.arrive, a.arrive + 0.03, a.leave - 0.03, a.leave], [0, 1, 1, 0]);
  const hoseB = useTransform(progress, [b.arrive, b.arrive + 0.03, b.leave - 0.03, b.leave], [0, 1, 1, 0]);
  const gauge = useTransform(
    progress,
    [0, a.arrive + 0.03, a.leave - 0.03, a.leave, b.arrive + 0.03, b.leave - 0.03, b.leave],
    [0, 0, 1, 0, 0, 1, 0],
  );
  const gaugeWidth = useTransform(gauge, (v) => 32 * v);
  const screenGlow = useTransform(progress, (p) =>
    (p > a.arrive + 0.03 && p < a.leave - 0.03) || (p > b.arrive + 0.03 && p < b.leave - 0.03) ? 1 : 0.35,
  );

  return (
    // Phones get a taller 4:3 frame. Photo (object-cover) and overlay (xMidYMid slice) crop the same
    // centred window, x ≈ 208…1463, which still contains the pump and the parked car.
    <div className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-[1672/941] ${className ?? ''}`}>
      <Picture
        name="station-front"
        alt="NanoTech ixcham yoqilg‘i quyish shoxobchasi — old tomondan ko‘rinish (vizualizatsiya)"
        sizes="(min-width: 1280px) 1200px, 100vw"
        priority={priority}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Fuel dispenser */}
        <g transform={`translate(${PUMP.x} ${PUMP.y}) scale(${PUMP.s})`}>
          <ellipse cx="26" cy="1" rx="34" ry="5" fill="#000000" opacity="0.25" />
          <rect x="0" y="-6" width="52" height="6" rx="1.5" fill="#2a2a2a" />
          <rect x="4" y="-166" width="44" height="160" rx="6" fill="#1d1d1d" />
          <rect x="4" y="-166" width="44" height="30" rx="6" fill="#FFC400" />
          <rect x="4" y="-142" width="44" height="6" fill="#FFC400" />
          <rect x="10" y="-128" width="32" height="22" rx="3" fill="#0e1a14" />
          <motion.rect x="12" y="-125" width="28" height="16" rx="2" fill="#5BE08A" style={{ opacity: screenGlow }} />
          <rect x="10" y="-98" width="32" height="5" rx="2.5" fill="#3a3a3a" />
          <motion.rect x="10" y="-98" height="5" rx="2.5" fill="#FFC400" style={{ width: gaugeWidth }} />
          <BrandMark x={14} y={-84} size={24} />
          <rect x="48" y="-112" width="9" height="30" rx="3" fill="#FFC400" />
        </g>

        <Car model="sedan" color="#F2F2EF" x={xA} groundY={GROUND} scale={CAR_SCALE} />
        <Car model="suv" color="#56626E" x={xB} groundY={GROUND} scale={CAR_SCALE} />

        <Hose model="sedan" connect={hoseA} />
        <Hose model="suv" connect={hoseB} />
      </svg>
    </div>
  );
}
