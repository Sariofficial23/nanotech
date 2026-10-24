import { AnimatePresence, motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { PHONES, telHref } from '../../config/site';
import { useDismiss } from '../../hooks/useDismiss';
import { useI18n } from '../../i18n/context';
import { cn } from '../../lib/cn';

/** Phone button in the header; opens a small list of the official numbers. */
export default function PhoneMenu() {
  const { t } = useI18n();
  const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
  if (!PHONES.length) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t.header.phones}
        title={t.header.phones}
        aria-expanded={open}
        aria-controls="phone-menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'grid h-10 w-10 place-items-center rounded-full border transition-colors sm:h-11 sm:w-11',
          open ? 'border-brand bg-brand text-ink' : 'border-white/20 bg-white/5 text-white hover:border-brand hover:bg-brand hover:text-ink',
        )}
      >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="phone-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-10 mt-2 w-64 origin-top-right rounded-2xl max-sm:fixed max-sm:inset-x-4 max-sm:top-[4.25rem] max-sm:mt-0 max-sm:w-auto border border-white/10 bg-ink-soft p-2 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]"
          >
            <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-white/50 uppercase">{t.header.phones}</p>
            <ul>
              {PHONES.map((number) => (
                <li key={number}>
                  <a
                    href={telHref(number)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.06]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-ink">
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold tabular-nums">{number}</span>
                      <span className="block text-xs text-white/50">{t.header.call}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
