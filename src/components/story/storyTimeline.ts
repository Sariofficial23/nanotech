/** Scroll timeline (0…1): car A arrives, refuels, leaves; then car B does the same. */
export const STORY = {
  a: { arrive: 0.17, leave: 0.4, gone: 0.54 },
  b: { start: 0.52, arrive: 0.66, leave: 0.88, gone: 1 },
};

/** Captions shown under the scene; `from` is the scroll progress where each one starts. */
export const STORY_STEPS = [
  { from: 0, text: 'Avtomobil shoxobchaga yaqinlashmoqda' },
  { from: STORY.a.arrive, text: 'Yoqilg‘i quyilmoqda' },
  { from: STORY.a.leave, text: 'Mijoz yo‘lida davom etadi' },
  { from: STORY.b.start, text: 'Navbatdagi avtomobil keladi' },
  { from: STORY.b.arrive, text: 'Yoqilg‘i quyilmoqda' },
  { from: STORY.b.leave, text: 'Yana yo‘lga — shoxobcha keyingi mijozni kutadi' },
];

export const stepAt = (p: number) => {
  let index = 0;
  STORY_STEPS.forEach((step, i) => {
    if (p >= step.from) index = i;
  });
  return index;
};
