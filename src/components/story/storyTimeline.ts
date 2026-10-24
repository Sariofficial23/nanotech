/** Scroll progress (0…1) where the "arrive" photo dissolves into the "refuel" photo. */
export const CROSSFADE = { start: 0.35, end: 0.65 };

/** Scroll progress where each caption starts; caption texts are i18n `story.steps` in the same order. */
export const STORY_STEP_STARTS = [0, 0.5];

export const stepAt = (p: number) => {
  let index = 0;
  STORY_STEP_STARTS.forEach((from, i) => {
    if (p >= from) index = i;
  });
  return index;
};
