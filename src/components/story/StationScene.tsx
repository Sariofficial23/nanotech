import { motion, useTransform, type MotionValue } from 'framer-motion';
import Picture from '../ui/Picture';
import { CROSSFADE } from './storyTimeline';

interface StationSceneProps {
  progress: MotionValue<number>;
  /** Slow zoom; turned off for visitors who prefer reduced motion (the crossfade itself is just opacity). */
  zoom?: boolean;
  className?: string;
}

const SIZES = '(min-width: 1280px) 1200px, 100vw';

/** Two renders from the same camera: the car arriving dissolves into the car being refuelled, with a slow zoom. */
export default function StationScene({ progress, zoom = true, className }: StationSceneProps) {
  const refuel = useTransform(progress, [CROSSFADE.start, CROSSFADE.end], [0, 1]);
  const scale = useTransform(progress, [0, 1], [1, zoom ? 1.06 : 1]);

  return (
    <div className={`relative aspect-[1672/941] w-full overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ scale }} className="absolute inset-0 origin-[70%_70%]">
        <Picture
          name="station-arrive"
          alt="Avtomobil NANOTEX shoxobchasiga yaqinlashmoqda (vizualizatsiya)"
          sizes={SIZES}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.div style={{ opacity: refuel }} className="absolute inset-0">
          <Picture
            name="station-refuel"
            alt="NANOTEX shoxobchasida avtomobilga yoqilg‘i quyilmoqda (vizualizatsiya)"
            sizes={SIZES}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
