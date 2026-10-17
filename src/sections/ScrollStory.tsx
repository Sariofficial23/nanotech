import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ChevronsDown } from 'lucide-react';
import StationScene from '../components/story/StationScene';
import { STORY_STEPS, stepAt } from '../components/story/storyTimeline';
import { forceMotion } from '../lib/intro';

const TITLE = 'Ixcham shoxobchada jarayon qanday ko‘rinadi?';

function Heading() {
  return (
    <div className="w-full max-w-6xl">
      <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-brand uppercase">
        <span aria-hidden="true" className="h-px w-8 bg-brand" />
        Vizualizatsiya
      </p>
      <h2 id="story-title" className="font-display text-2xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">
        {TITLE}
      </h2>
    </div>
  );
}

/** Scroll-driven scene: the page scroll moves the cars in and out of the station. */
function AnimatedStory({ zoom }: { zoom: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // A light spring smooths out coarse mouse-wheel steps without lagging behind the scroll.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const [step, setStep] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    const next = stepAt(p);
    setStep((current) => (current === next ? current : next));
  });
  const hint = useTransform(progress, [0, 0.05], [1, 0]);
  const bar = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="shoxobcha" aria-labelledby="story-title" className="relative h-[260svh] bg-ink text-white">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-4 px-4 pt-20 pb-6 sm:gap-6 sm:px-6 lg:px-8">
        <Heading />

        <div className="relative w-full max-w-6xl lg:w-[min(100%,calc((100svh-15rem)*1672/941))]">
          <StationScene
            progress={progress}
            zoom={zoom}
            className="rounded-2xl border border-white/10 shadow-[0_40px_120px_-40px_rgb(255_196_0/0.35)] sm:rounded-[1.75rem]"
          />
          <motion.div
            style={{ opacity: hint }}
            className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center sm:bottom-5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur sm:text-sm">
              <ChevronsDown className="h-4 w-4 animate-bounce text-brand" aria-hidden="true" />
              Pastga aylantiring
            </span>
          </motion.div>
        </div>

        <div className="flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-7 text-base font-medium sm:text-lg" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3"
              >
                <span className="font-display text-sm font-bold text-brand">{String(step + 1).padStart(2, '0')}</span>
                {STORY_STEPS[step].text}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 sm:w-56" aria-hidden="true">
            <motion.div style={{ scaleX: bar }} className="h-full origin-left rounded-full bg-brand" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ScrollStory() {
  // Reduced motion keeps the scroll-driven crossfade (opacity only) but drops the zoom.
  const reduce = Boolean(useReducedMotion()) && !forceMotion();
  return <AnimatedStory zoom={!reduce} />;
}
