import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useDismiss } from '../../hooks/useDismiss';
import { useI18n } from '../../i18n/context';
import { LANGS } from '../../i18n/langs';
import { cn } from '../../lib/cn';

/** Globe + "UZ" button; lets the visitor switch between O‘zbekcha, Русский and English. */
export default function LanguageMenu() {
  const { lang, setLang, t } = useI18n();
  const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`${t.header.language}: ${current.label}`}
        title={t.header.language}
        aria-expanded={open}
        aria-controls="language-menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-10 items-center gap-1.5 rounded-full border px-2.5 text-sm font-semibold transition-colors sm:h-11 sm:px-3',
          open ? 'border-brand bg-brand text-ink' : 'border-white/20 bg-white/5 text-white hover:border-brand/70',
        )}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {current.short}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform max-sm:hidden', open && 'rotate-180')} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="language-menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-ink-soft p-2 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)]"
          >
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  lang={l.code}
                  aria-current={l.code === lang ? 'true' : undefined}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]',
                    l.code === lang && 'text-brand',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-xs font-bold text-white/50">{l.short}</span>
                    {l.label}
                  </span>
                  {l.code === lang && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
