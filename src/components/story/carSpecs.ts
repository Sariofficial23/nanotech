// Side-view car drawings, facing right. Local units: ground at y = 0, front at x ≈ 440, y grows downward (so heights are negative).

export type CarModel = 'sedan' | 'suv';

interface Detail {
  d: string;
  fill: string;
  opacity?: number;
}

export interface CarSpec {
  body: string;
  windows: string[];
  lines: string[];
  details: Detail[];
  wheels: number[];
  wheelY: number;
  wheelR: number;
  archR: number;
  /** Fuel filler position (where the nozzle goes). */
  filler: { x: number; y: number };
  rails?: string;
}

export const CAR_SPECS: Record<CarModel, CarSpec> = {
  sedan: {
    body: 'M8,-27L8,-56Q8,-66 20,-70L96,-76Q132,-110 180,-116L262,-117Q292,-116 316,-96L344,-80L404,-72Q430,-68 434,-54L434,-27Z',
    windows: [
      'M114,-80Q142,-106 178,-110L206,-110L206,-80Z',
      'M212,-110L260,-111Q286,-110 306,-94L320,-80L212,-80Z',
    ],
    lines: ['M209,-80V-30', 'M318,-80V-30', 'M112,-77V-30'],
    details: [
      { d: 'M418,-70L433,-63L433,-57L416,-59Z', fill: '#FFF3C4' },
      { d: 'M8,-67H17V-52H8Z', fill: '#D62828' },
      { d: 'M226,-70H242V-67H226Z', fill: '#000000', opacity: 0.22 },
      { d: 'M296,-100L310,-100L312,-92L298,-92Z', fill: '#000000', opacity: 0.3 },
    ],
    wheels: [96, 352],
    wheelY: -27,
    wheelR: 27,
    archR: 32,
    filler: { x: 46, y: -62 },
  },
  suv: {
    body: 'M6,-30L6,-84Q6,-96 16,-100L36,-106Q52,-132 84,-136Q180,-146 274,-140Q294,-139 310,-126L350,-100L406,-93Q434,-87 438,-66L438,-30Z',
    windows: [
      'M58,-108Q70,-126 92,-128L188,-133L188,-108Z',
      'M196,-133L272,-134Q290,-133 302,-122L326,-108L196,-108Z',
    ],
    lines: ['M192,-108V-32', 'M330,-104V-32', 'M56,-106V-32'],
    details: [
      { d: 'M424,-90L438,-82L438,-74L422,-78Z', fill: '#FFF3C4' },
      { d: 'M6,-88H15V-66H6Z', fill: '#D62828' },
      { d: 'M6,-42H438V-30H6Z', fill: '#000000', opacity: 0.35 },
      { d: 'M214,-98H230V-95H214Z', fill: '#FFFFFF', opacity: 0.25 },
      { d: 'M300,-110L314,-110L318,-102L302,-102Z', fill: '#000000', opacity: 0.35 },
    ],
    rails: 'M92,-141Q180,-150 268,-144',
    wheels: [98, 354],
    wheelY: -30,
    wheelR: 30,
    archR: 35,
    filler: { x: 48, y: -72 },
  },
};
