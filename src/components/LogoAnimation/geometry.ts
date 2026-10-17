// Vector reconstruction of the NANOTEX logo.
// All coordinates use the 640×640 pixel grid of the original raster
// (public/brand/nanotex-logo-original.jpg), so the original can be
// overlaid 1:1 for comparison.

export const VIEWBOX = { x: 36, y: 62, w: 564, h: 496 };

export const COLORS = {
  bg: '#FCBB0A',
  yellow: '#FFC20E',
  yellowLight: '#FFD54A',
  yellowDeep: '#E2A400',
  black: '#121212',
  ink: '#262626',
  white: '#FFFFFF',
  steel: '#5B5B5B',
};

const round = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;
const polar = (r: number, deg: number) => `${round(r * Math.cos(rad(deg)))} ${round(r * Math.sin(rad(deg)))}`;

/** Gear outline centred at (0,0). One tooth points straight up, like the original. */
export function buildGear({ teeth = 8, outer = 157, root = 134, tipHalf = 9.5, rootHalf = 14.5, start = -90 } = {}) {
  const step = 360 / teeth;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = start + i * step;
    d += i === 0 ? `M${polar(root, a - rootHalf)}` : `A${root} ${root} 0 0 1 ${polar(root, a - rootHalf)}`;
    d += `L${polar(outer, a - tipHalf)}A${outer} ${outer} 0 0 1 ${polar(outer, a + tipHalf)}L${polar(root, a + rootHalf)}`;
  }
  return `${d}A${root} ${root} 0 0 1 ${polar(root, start - rootHalf)}Z`;
}

export const GEAR = {
  cx: 313,
  cy: 411,
  path: buildGear(),
  discR: 114,
  ringR: 121,
  // The original crops the gear along the station base.
  clip: 'M90 200H570V516L452 532L209 507H90Z',
};

/**
 * Teardrop with the tip on top.
 * @param cx  horizontal centre
 * @param tipY y of the tip
 * @param cy  y of the round body centre
 * @param r   body radius
 */
export function dropPath(cx: number, tipY: number, cy: number, r: number) {
  const k = cy - tipY;
  const c1y = tipY + k * 0.3;
  return (
    `M${round(cx)} ${round(tipY)}` +
    `C${round(cx - r * 0.2)} ${round(c1y)} ${round(cx - r)} ${round(cy - r * 0.75)} ${round(cx - r)} ${round(cy)}` +
    `A${round(r)} ${round(r)} 0 0 0 ${round(cx + r)} ${round(cy)}` +
    `C${round(cx + r)} ${round(cy - r * 0.75)} ${round(cx + r * 0.2)} ${round(c1y)} ${round(cx)} ${round(tipY)}Z`
  );
}

export const NOZZLE = {
  // Rotation pivot for the "just finished refuelling" tilt (centre of the grip).
  pivot: { x: 265, y: 385 },
  tilt: 6,
  body:
    'M301 322L252 346.5Q247.5 348.5 246.5 353L229.5 406Q228.5 411 233.5 411.5' +
    'L281 415Q284.5 415.2 285.5 412L302 368.5L296 358L307.5 341L306 333.5Z',
  window: 'M268 368L288 372L282.5 401L260 396.5Z',
  tail: 'M226 413L224.5 421.5Q224.5 425.5 228.5 426L235 426.5Q238.5 426.5 238.8 423L239.5 414',
  spout: 'M304 328C308 321 313 318.5 320 317.5L334 315.6',
  spoutCore: 'M308.5 325.5C311.5 321.5 315 320 320.5 319.2L331 317.8',
  spoutTip: 'M332 310.6L338.4 310L339.6 321.8L333 322.4Z',
};

// Drop pictogram next to the nozzle: black outline "vessel" + yellow liquid.
export const VESSEL = {
  cx: 342.5,
  outline: dropPath(342.5, 336.5, 367.2, 14.3),
  liquid: dropPath(342.5, 343.5, 367.2, 10.2),
  liquidTop: 341,
  liquidBottom: 382,
};

// The falling droplet: forms under the spout tip (tilted state) and falls into the vessel.
export const DROPLET = {
  x: 342.5,
  attachY: 329.5,
  r: 4.4,
  neck: 6,
  landY: 379, // inner bottom of the vessel
};

export const STATION = {
  base: 'M206 499L330 506L508 513L507 519L452 532L209 507Z',
  baseEdge: 'M330 506L508 513',
  backWall: 'M400 394L540 396V415L438 422V513H384Z',
  roof: 'M380 395L509 360L541 377V401L410 398Z',
  roofEdge: 'M509 360L541 377',
  fascia: 'M375 389L505 355L509 360.5L380 395Z',
  pillar: 'M375.5 391L410.5 388L384 514L352.5 512Z',
  panel: 'M225 442L373 401L352.5 511L225 502Z',
  panelTop: 'M219 437L377 390L375.5 397L225 443Z',
  panelSide: 'M210 440L225 442V502L210 500Z',
  pole: { x: 450.5, y: 394, w: 6, h: 120 },
};

export const WORDMARK = {
  disc: { cx: 102, cy: 168, rimR: 46, r: 40.5 },
  topLine:
    'M118 120.5L195 119.5L320 86L436 114L548 124L562 133L556 134L546 128L434 120L321 93L197 124L118 122.5Z',
  topHighlight: 'M197 117.2L320 83.6L436 111.6L548 121.6',
  wingLeft: 'M88 226L156 232L166 238.5L274 252L274 254.5L165 244.5L154 238L88 227.5Z',
  wingRight: 'M561 227L491 230.5L486 236.5L370 253L370 255.5L487 243L492 236.5L561 228.2Z',
};
