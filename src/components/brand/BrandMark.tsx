import { GEAR, NOZZLE, VESSEL } from '../LogoAnimation/geometry';

interface BrandMarkProps {
  className?: string;
  title?: string;
  /** Position when nested inside another SVG. */
  x?: number;
  y?: number;
  size?: number;
}

// The gear + nozzle + drop symbol of the logo, cropped to the gear.
// Reuses the logo geometry, so the symbol always matches the animated logo.
const R = 160;
const VIEWBOX = `${GEAR.cx - R} ${GEAR.cy - R} ${R * 2} ${R * 2}`;

export default function BrandMark({ className, title, x, y, size }: BrandMarkProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      x={x}
      y={y}
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <g transform={`translate(${GEAR.cx} ${GEAR.cy})`}>
        <path d={GEAR.path} fill="#111111" />
        <path d={GEAR.path} fill="none" stroke="#FFD54A" strokeWidth="5" strokeLinejoin="round" />
        <circle r={GEAR.discR} fill="#FFFFFF" />
      </g>
      <path d={VESSEL.liquid} fill="#FFC400" />
      <path d={VESSEL.outline} fill="none" stroke="#111111" strokeWidth="5" strokeLinejoin="round" />
      <path d={NOZZLE.body} fill="#FFC400" stroke="#111111" strokeWidth="6" strokeLinejoin="round" />
      <path d={NOZZLE.window} fill="#FFFFFF" stroke="#111111" strokeWidth="5" strokeLinejoin="round" />
      <path d={NOZZLE.spout} fill="none" stroke="#111111" strokeWidth="8.6" />
      <path d={NOZZLE.spoutTip} fill="#111111" />
      <path d={NOZZLE.tail} fill="#4a4a4a" stroke="#111111" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
