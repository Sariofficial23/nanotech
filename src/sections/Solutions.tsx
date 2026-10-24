import { Building2, ClipboardCheck, Fuel, Route, type LucideIcon } from 'lucide-react';
import BrandMark from '../components/brand/BrandMark';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { useI18n } from '../i18n/context';
import { cn } from '../lib/cn';

// Layout per card; texts come from i18n `solutions.items` in the same order.
const CARDS: { icon: LucideIcon; featured?: boolean; wide?: boolean }[] = [
  { icon: Fuel, featured: true },
  { icon: Building2 },
  { icon: Route },
  { icon: ClipboardCheck, wide: true },
];

export default function Solutions() {
  const { t } = useI18n();
  const s = t.solutions;
  return (
    <Section id="yechimlar" labelledBy="solutions-title">
      <SectionHeading id="solutions-title" eyebrow={s.eyebrow} title={s.title} lead={s.lead} />

      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {s.items.map(({ title, text }, i) => {
          const { icon: Icon, featured, wide } = CARDS[i];
          return (
            <Reveal
              as="li"
              key={i}
              delay={0.06 * i}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 sm:p-8',
                featured
                  ? 'border-brand bg-brand text-ink hover:shadow-[0_24px_60px_-20px_rgb(255_196_0/0.55)] md:col-span-2 lg:col-span-1 lg:row-span-2'
                  : 'border-white/10 bg-white/[0.04] hover:border-brand/40 hover:bg-white/[0.06]',
                wide && 'md:col-span-2',
              )}
            >
              <span
                className={cn(
                  'grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-300',
                  featured ? 'bg-ink text-brand' : 'bg-white/[0.08] text-brand group-hover:bg-brand group-hover:text-ink',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
              <p className={cn('mt-3 leading-relaxed', featured ? 'text-ink/75' : 'text-white/60')}>{text}</p>

              {featured && (
                <div aria-hidden="true" className="relative mt-6 flex flex-1 items-end justify-end max-md:-mb-2 sm:mt-10">
                  <div className="absolute right-[-3rem] bottom-[-3rem] h-56 w-56 rounded-full bg-white/40 blur-3xl" />
                  <BrandMark className="relative h-24 w-24 transition-transform sm:h-36 sm:w-36 duration-700 ease-out group-hover:rotate-[22.5deg] lg:h-44 lg:w-44" />
                </div>
              )}
            </Reveal>
          );
        })}
      </ul>

      <Reveal>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/50">{s.note}</p>
      </Reveal>
    </Section>
  );
}
