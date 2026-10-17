/** Scroll progress (0…1) where the "arrive" photo dissolves into the "refuel" photo. */
export const CROSSFADE = { start: 0.35, end: 0.65 };

/** Captions under the scene; `from` is the scroll progress where each one starts. */
export const STORY_STEPS = [
  { from: 0, text: 'Avtomobil shoxobchaga keladi' },
  { from: 0.5, text: 'Yoqilg‘i quyilmoqda' },
];

export const stepAt = (p: number) => {
  let index = 0;
  STORY_STEPS.forEach((step, i) => {
    if (p >= step.from) index = i;
  });
  return index;
};
