import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, MapPin, Route, Zap } from 'lucide-react';
import { requestContact } from '../lib/contactIntent';
import { Button, ButtonLink } from '../components/ui/Button';
import CountUp from '../components/ui/CountUp';
import Picture from '../components/ui/Picture';

const HIGHLIGHTS = [
  { icon: Zap, label: 'Ko‘chma format' },
  { icon: MapPin, label: 'Shahar uchun' },
  { icon: Route, label: 'Avtomobil yo‘llari uchun' },
];

const ease = [0.22, 1, 0.36, 1] as const;

interface HeroProps {
  /** False while the logo intro covers the page, so the entrance plays when it is actually visible. */
  ready?: boolean;
}

export default function Hero({ ready = true }: HeroProps) {
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section
      id="bosh-sahifa"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink pt-28 pb-16 text-white sm:pt-32 lg:flex lg:min-h-[100svh] lg:items-center lg:pt-24 lg:pb-20"
    >
      {/* Background: slow-drifting brand glow + faint grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 animate-grid [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_70%)]" />
        <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] animate-drift rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-15%] h-[30rem] w-[30rem] animate-drift-slow rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8">
        <div>
          <motion.p
            {...appear(0.05)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white/80 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_12px_2px_rgb(255_196_0/0.7)]" aria-hidden="true" />
            Ko‘chma AYoQSh loyihasi
          </motion.p>

          <motion.h1
            id="hero-title"
            {...appear(0.15)}
            aria-label="Oyiga 1 000 dollardan 5 000 dollargacha va undan ham ko‘proq daromad qilishni xohlaysizmi?"
            className="font-display text-[2.4rem] leading-[1.04] font-bold tracking-tight text-balance sm:text-6xl lg:text-[4.2rem]"
          >
            <span aria-hidden="true">
              Oyiga{' '}
              <span className="relative inline-block whitespace-nowrap text-brand [text-shadow:0_0_40px_rgb(255_196_0/0.45)]">
                $1 000 dan
              </span>{' '}
              <span className="whitespace-nowrap text-brand">$<CountUp to={5000} start={ready} /> gacha</span>{' '}
              va undan ham ko‘proq daromad qilishni xohlaysizmi?
            </span>
          </motion.h1>

          <motion.p {...appear(0.28)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty sm:text-xl">
            Hamkorlarimizdan ayrimlari ilk oylardanoq oyiga $5 000 dan ortiq daromad qilmoqda.{' '}
            <span className="text-white/60">
              NanoTech — yoqilg‘i quyishning yangi formati: shaharlar va avtomobil yo‘llari uchun ko‘chma shoxobchalar.
            </span>
          </motion.p>

          <motion.div {...appear(0.4)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => requestContact()} icon={<ArrowRight className="h-4 w-4" />}>
              Hamkorlikni boshlash
            </Button>
            <ButtonLink href="#biz-haqimizda" size="lg" variant="outline-light" icon={<ArrowDown className="h-4 w-4" />}>
              Loyihamiz bilan tanishing
            </ButtonLink>
          </motion.div>
          <motion.p {...appear(0.46)} className="mt-4 max-w-xl text-xs leading-relaxed text-white/45">
            * Daromad kafolatlanmaydi: natija joylashuv, savdo hajmi va boshqa omillarga bog‘liq.
          </motion.p>

          <motion.ul {...appear(0.52)} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: 0.25, ease }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-2 shadow-[0_40px_120px_-40px_rgb(255_196_0/0.35)] sm:p-3">
            <Picture
              name="station-sunset"
              alt="NanoTech ko‘chma yoqilg‘i quyish shoxobchasi quyosh botishida (vizualizatsiya)"
              sizes="(min-width: 1024px) 46vw, 100vw"
              priority
              className="block aspect-[1672/941] h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-white/40">Vizualizatsiya</p>
        </motion.div>
      </div>
    </section>
  );
}
