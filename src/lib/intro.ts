export const INTRO_STORAGE_KEY = 'nanotech:intro-seen';

const params = () => new URLSearchParams(window.location.search);

/**
 * The logo intro plays once per browser (first visit) and never for visitors who prefer reduced motion.
 * `?intro` forces it for testing, `?force-motion` additionally ignores the reduced-motion setting.
 */
export function shouldShowIntro(): boolean {
  if (params().has('intro')) return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return !window.localStorage.getItem(INTRO_STORAGE_KEY);
  } catch {
    return false;
  }
}

export const forceMotion = () => params().has('force-motion');

export function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, '1');
  } catch {
    /* storage unavailable — the intro may simply show again next time */
  }
}
