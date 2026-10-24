import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, MapPin, Route, Zap } from 'lucide-react';
import { requestContact } from '../lib/contactIntent';
import { Button, ButtonLink } from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import HeroSlider from '../components/hero/HeroSlider';
import { useI18n } from '../i18n/context';

const HIGHLIGHT_ICONS = [Zap, MapPin, Route];

const ease = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  /** False while the logo intro covers the page, so the entrance plays when it is actually visible. */
  ready?: boolean;
}

export default function Hero({ ready = true }: HeroProps) {
  const { t, lang } = useI18n();
  const h = t.hero;
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      id="bosh-sahifa"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink pt-24 pb-16 text-white sm:pt-28 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-20"
    >

      {/* Background: slow-drifting brand glow + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 animate-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_70%)]" />
        <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] animate-drift rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-15%] h-[30rem] w-[30rem] animate-drift-slow rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-[96rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10 lg:px-8">
        <div>
          <motion.p
            {...appear(0.05)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/80 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_2px_rgb(255_196_0/0.7)]" aria-hidden="true" />
            {h.badge}
          </motion.p>

          <motion.h1
            id="hero-title"
            {...appear(0.15)}
            aria-label={h.title.aria}
            className="font-display text-[2.4rem] leading-[1.04] font-bold tracking-tight text-balance sm:text-6xl lg:text-[3rem] xl:text-[3.6rem]"
          >
            <span aria-hidden="true">
              {h.title.before}{' '}
              <span className="relative inline-block whitespace-nowrap text-brand [text-shadow:0_0_40px_rgb(255_196_0/0.45)]">
                {h.title.from}
              </span>{' '}
              <span className="whitespace-nowrap text-brand">{h.title.toPrefix}<CountUp to={5000} start={ready} separator={lang === 'en' ? ',' : undefined} />{h.title.toSuffix}</span>{' '}
              {h.title.after}
            </span>
          </motion.h1>

          <motion.p {...appear(0.28)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty sm:text-xl">
            {h.lead}{' '}
            <span className="text-white/60">
              {h.leadMuted}
            </span>
          </motion.p>

          <motion.div {...appear(0.4)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => requestContact()} icon={<ArrowRight className="h-4 w-4" />}>
              {h.ctaPrimary}
            </Button>
            <ButtonLink href="#biz-haqimizda" size="lg" variant="outline-light" icon={<ArrowDown className="h-4 w-4" />}>
              {h.ctaSecondary}
            </ButtonLink>
          </motion.div>
          <motion.p {...appear(0.46)} className="mt-4 max-w-xl text-xs leading-relaxed text-white/45">
            {h.disclaimer}
          </motion.p>

          <motion.ul {...appear(0.52)} className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
            {h.highlights.map((label, i) => {
              const Icon = HIGHLIGHT_ICONS[i];
              return (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                {label}
              </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Stations in different places (city, highway, mountains…), swipeable, next to the headline. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="max-lg:order-first"
        >
          <HeroSlider />
        </motion.div>
      </div>
    </section>
  );
}
