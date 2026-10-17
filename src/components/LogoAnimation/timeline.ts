import type { Easing } from 'framer-motion';
import { NOZZLE } from './geometry';

type Bezier = [number, number, number, number];

const EASE: Record<'out' | 'soft' | 'inOut' | 'draw' | 'gravity', Bezier> = {
  out: [0.16, 1, 0.3, 1],
  soft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  draw: [0.45, 0, 0.2, 1],
  // cubic-bezier(1/3, 0, 2/3, 1/3) is exactly y = t² — uniform acceleration from rest.
  gravity: [1 / 3, 0, 2 / 3, 1 / 3],
};

export const INITIAL = {
  gearDraw: 0, gearRot: -35, gearScale: 0.86, gearFill: 0, disc: 0,
  station: 0,
  nozzleDraw: 0, nozzleFill: 0, vesselDraw: 0, tilt: 0,
  dropForm: 0, dropFall: 0, impact: 0, liquid: 0,
  mark: 0, nano: 0, tex: 0, line: 0,
  slogan: 0, wings: 0,
};

export type Key = keyof typeof INITIAL;
export type State = Record<Key, number>;
export const KEYS = Object.keys(INITIAL) as Key[];

export const FINAL: State = {
  ...(Object.fromEntries(KEYS.map((k) => [k, 1])) as State),
  gearRot: 0,
  gearScale: 1,
  tilt: 0,
};

interface Step {
  at: number;
  duration: number;
  ease?: Easing | Easing[] | Bezier;
  times?: number[];
}

// [value, target | keyframes, { at, duration, ease, times }] — seconds.
export const TIMELINE: [Key, number | number[], Step][] = [
  // 2. Gear: thin contour draws itself, assembles and settles with a small turn.
  ['gearDraw', 1, { at: 0.15, duration: 0.8, ease: EASE.draw }],
  ['gearRot', 0, { at: 0.1, duration: 1.15, ease: EASE.out }],
  ['gearScale', 1, { at: 0.1, duration: 1.15, ease: EASE.out }],
  ['gearFill', 1, { at: 0.6, duration: 0.35, ease: 'easeOut' }],
  ['disc', 1, { at: 0.62, duration: 0.5, ease: EASE.soft }],
  // The station enters while the contour reaches the bottom, so the gear's cropped edge is never seen bare.
  ['station', 1, { at: 0.45, duration: 0.7, ease: EASE.out }],
  // 3. Nozzle and drop pictogram appear inside the gear.
  ['nozzleDraw', 1, { at: 1.0, duration: 0.5, ease: EASE.draw }],
  ['vesselDraw', 1, { at: 1.12, duration: 0.45, ease: EASE.draw }],
  ['nozzleFill', 1, { at: 1.3, duration: 0.3, ease: 'easeOut' }],
  // 4. Nozzle dips, holds while the drop forms, then recoils once the weight is gone.
  ['tilt', [0, NOZZLE.tilt, NOZZLE.tilt, -0.8, 0], {
    at: 1.55, duration: 1.45, times: [0, 0.241, 0.586, 0.766, 1],
    ease: ['easeInOut', 'linear', 'easeOut', 'easeInOut'],
  }],
  // 5. Drop forms, detaches, falls under gravity into the pictogram and fills it.
  ['dropForm', 1, { at: 1.9, duration: 0.5, ease: 'linear' }],
  ['dropFall', 1, { at: 2.4, duration: 0.3, ease: EASE.gravity }],
  ['impact', 1, { at: 2.7, duration: 0.14, ease: 'easeOut' }],
  ['liquid', 1, { at: 2.68, duration: 0.55, ease: EASE.soft }],
  // 6. Company name rises out of a mask.
  ['mark', 1, { at: 2.72, duration: 0.6, ease: EASE.out }],
  ['nano', 1, { at: 2.76, duration: 0.7, ease: EASE.out }],
  ['tex', 1, { at: 2.86, duration: 0.7, ease: EASE.out }],
  ['line', 1, { at: 2.9, duration: 0.7, ease: EASE.inOut }],
  // 7. Slogan last.
  ['wings', 1, { at: 3.25, duration: 0.6, ease: EASE.inOut }],
  ['slogan', 1, { at: 3.3, duration: 0.55, ease: EASE.soft }],
];

export const LOGO_ANIMATION_DURATION = Math.max(...TIMELINE.map(([, , o]) => o.at + o.duration));
