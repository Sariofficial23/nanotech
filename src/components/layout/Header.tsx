import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../../config/site';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrolled } from '../../hooks/useScrolled';
import { cn } from '../../lib/cn';
import Logo from '../brand/Logo';
import { ButtonLink } from '../ui/Button';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export default function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  // Over the dark hero the header is transparent with light text; once scrolled it becomes a light bar.
  const solid = scrolled || open;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
        solid ? 'border-b border-line bg-white/90 shadow-[0_1px_0_rgb(17_17_17/0.02)] backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#bosh-sahifa" className="rounded-lg" aria-label="NanoTech — bosh sahifa" onClick={() => setOpen(false)}>
          <Logo tone={solid ? 'light' : 'dark'} />
        </a>

        <nav aria-label="Asosiy menyu" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors',
                      solid ? 'text-ink/70 hover:text-ink' : 'text-white/75 hover:text-white',
                      isActive && (solid ? 'text-ink' : 'text-white'),
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className={cn('absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full', 'bg-brand')}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="#aloqa" variant="primary" className="max-sm:hidden" icon={<ArrowRight className="h-4 w-4" />}>
            Bog‘lanish
          </ButtonLink>
          <button
            type="button"
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full border transition-colors lg:hidden',
              solid ? 'border-line bg-white text-ink' : 'border-white/20 bg-white/5 text-white',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
          >
            <nav aria-label="Mobil menyu" className="px-4 pt-4 pb-8 sm:px-6">
              <ul className="divide-y divide-line">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.25 }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? 'true' : undefined}
                      className="flex items-center justify-between py-4 font-display text-2xl font-semibold"
                    >
                      {item.label}
                      <ArrowRight
                        aria-hidden="true"
                        className={cn('h-5 w-5', active === item.id ? 'text-brand-deep' : 'text-ink/25')}
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <ButtonLink href="#aloqa" size="lg" className="mt-8 w-full" onClick={() => setOpen(false)}>
                Bog‘lanish
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
