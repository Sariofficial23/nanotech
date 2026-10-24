import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { NAV_IDS } from '../../config/site';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrolled } from '../../hooks/useScrolled';
import { useI18n } from '../../i18n/context';
import { cn } from '../../lib/cn';
import Logo from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import LanguageMenu from './LanguageMenu';
import PhoneMenu from './PhoneMenu';

const SECTION_IDS = NAV_IDS;

export default function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  // Over the dark hero the header is transparent with light text; once scrolled it becomes a light bar.
  const solid = scrolled || open;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setOpen(false);
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
        solid ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <a href="#bosh-sahifa" className="rounded-lg" aria-label={t.header.home} onClick={() => setOpen(false)}>
          <Logo tone="dark" />
        </a>

        <nav aria-label={t.header.mainMenu} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV_IDS.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-2.5 py-2 text-[0.85rem] font-medium transition-colors',
                      'text-white/70 hover:text-white',
                      isActive && 'text-white',
                    )}
                  >
                    {t.nav[id]}
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <PhoneMenu />
          <LanguageMenu />
          <button
            type="button"
            className={cn(
              'grid h-11 w-11 place-items-center rounded-full border transition-colors xl:hidden',
              'border-white/20 bg-white/5 text-white hover:bg-white/10',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
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
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 bg-ink text-white xl:hidden"
          >
            <nav aria-label={t.header.mobileMenu} className="px-4 pt-4 pb-8 sm:px-6">
              <ul className="divide-y divide-white/10">
                {NAV_IDS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.25 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === id ? 'true' : undefined}
                      className="flex items-center justify-between py-4 font-display text-2xl font-semibold"
                    >
                      {t.nav[id]}
                      <ArrowRight
                        aria-hidden="true"
                        className={cn('h-5 w-5', active === id ? 'text-brand' : 'text-white/25')}
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <ButtonLink href="#aloqa" size="lg" className="mt-8 w-full" onClick={() => setOpen(false)}>
                {t.header.contact}
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
