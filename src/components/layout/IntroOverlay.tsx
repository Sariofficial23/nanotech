import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import { forceMotion, markIntroSeen } from '../../lib/intro';

// Only first-time visitors see the intro, so its code is loaded on demand.
const LogoAnimation = lazy(() => import('../LogoAnimation'));

const MAX_DURATION_MS = 6500;

interface IntroOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function IntroOverlay({ open, onClose }: IntroOverlayProps) {
  const { t } = useI18n();
  useEffect(() => {
    if (!open) return undefined;
    markIntroSeen();
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const safety = window.setTimeout(onClose, MAX_DURATION_MS);
    return () => {
      root.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(safety);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[60] grid place-items-center bg-[#FCBB0A] px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
        >
          <motion.div
            className="w-full max-w-[560px]"
            exit={{ scale: 0.94, y: -12, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
          >
            <Suspense fallback={<div className="aspect-[564/496] w-full" />}>
              <LogoAnimation forceMotion={forceMotion()} onComplete={() => window.setTimeout(onClose, 450)} />
            </Suspense>
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 bottom-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink/90 px-5 text-sm font-semibold text-white transition-colors hover:bg-ink sm:right-8 sm:bottom-8"
          >
            {t.intro.skip}
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
