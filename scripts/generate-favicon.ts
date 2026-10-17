// Generates public/favicon.svg from the logo geometry (same symbol as BrandMark).
// Run: npm run favicon
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GEAR, NOZZLE, VESSEL } from '../src/components/LogoAnimation/geometry.ts';

const R = 160;
const viewBox = `${GEAR.cx - R} ${GEAR.cy - R} ${R * 2} ${R * 2}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
<g transform="translate(${GEAR.cx} ${GEAR.cy})"><path d="${GEAR.path}" fill="#111111"/><path d="${GEAR.path}" fill="none" stroke="#FFD54A" stroke-width="6" stroke-linejoin="round"/><circle r="${GEAR.discR}" fill="#FFFFFF"/></g>
<path d="${VESSEL.liquid}" fill="#FFC400"/>
<path d="${VESSEL.outline}" fill="none" stroke="#111111" stroke-width="6" stroke-linejoin="round"/>
<path d="${NOZZLE.body}" fill="#FFC400" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
<path d="${NOZZLE.window}" fill="#FFFFFF" stroke="#111111" stroke-width="6" stroke-linejoin="round"/>
<path d="${NOZZLE.spout}" fill="none" stroke="#111111" stroke-width="9"/>
<path d="${NOZZLE.spoutTip}" fill="#111111"/>
</svg>
`;

const target = fileURLToPath(new URL('../public/favicon.svg', import.meta.url));
writeFileSync(target, svg);
console.log(`Wrote ${target}`);
