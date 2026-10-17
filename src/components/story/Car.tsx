import { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { CAR_SPECS, type CarModel } from './carSpecs';

interface CarProps {
  model: CarModel;
  color: string;
  /** Horizontal position in scene units (the car's rear). */
  x: MotionValue<number>;
  groundY: number;
  scale: number;
}

const SPOKES = [0, 72, 144, 216, 288];

function Wheel({ cx, cy, r, arch, rotate }: { cx: number; cy: number; r: number; arch: number; rotate: MotionValue<number> }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={arch} fill="#141414" />
      <motion.g style={{ rotate, transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r={r} fill="#1c1c1c" />
        <circle r={r * 0.6} fill="#d5d8dc" />
        {SPOKES.map((a) => (
          <path key={a} d={`M0,0L0,${-r * 0.56}`} stroke="#8d9299" strokeWidth={r * 0.13} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
        <circle r={r * 0.15} fill="#4a4d52" />
        <circle cy={-r * 0.86} r={r * 0.06} fill="#e9e9e9" opacity="0.75" />
      </motion.g>
    </g>
  );
}

/** Side-view car; its wheels turn in proportion to the distance it travels. */
export default function Car({ model, color, x, groundY, scale }: CarProps) {
  const spec = CAR_SPECS[model];
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  // distance (scene px) → wheel angle: angle = distance / radius.
  const degPerPx = 180 / Math.PI / (spec.wheelR * scale);
  const rotate = useTransform(x, (v) => v * degPerPx);

  return (
    <motion.g style={{ x }}>
      <g transform={`translate(0 ${groundY}) scale(${scale})`}>
        <defs>
          <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b4654" />
            <stop offset="1" stopColor="#0f1419" />
          </linearGradient>
        </defs>

        <ellipse cx="220" cy="2" rx="238" ry="9" fill="#000000" opacity="0.28" />
        <rect x="16" y={spec.wheelY} width="408" height="12" rx="4" fill="#1b1b1b" />

        {spec.wheels.map((cx) => (
          <Wheel key={cx} cx={cx} cy={spec.wheelY} r={spec.wheelR} arch={spec.archR} rotate={rotate} />
        ))}

        <path d={spec.body} fill={color} />
        <path d={spec.body} fill={`url(#${uid}-shade)`} />
        {spec.windows.map((d) => (
          <path key={d} d={d} fill={`url(#${uid}-glass)`} />
        ))}
        {spec.windows.map((d) => (
          <path key={`${d}-hl`} d={d} fill="#ffffff" opacity="0.08" transform="translate(0 -1)" />
        ))}
        {spec.lines.map((d) => (
          <path key={d} d={d} stroke="#000000" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
        ))}
        {spec.rails && <path d={spec.rails} stroke="#16181b" strokeWidth="3.5" strokeLinecap="round" />}
        {spec.details.map((detail) => (
          <path key={detail.d} d={detail.d} fill={detail.fill} opacity={detail.opacity ?? 1} />
        ))}
        <circle cx={spec.filler.x} cy={spec.filler.y} r="5" fill="none" stroke="#000000" strokeOpacity="0.28" strokeWidth="1.5" />
      </g>
    </motion.g>
  );
}
