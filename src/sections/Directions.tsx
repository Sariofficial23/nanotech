import { ArrowRight, Building2, Factory, Route, type LucideIcon } from 'lucide-react';
import Picture from '../components/ui/Picture';
import Reveal from '../components/ui/Reveal';
import { useI18n } from '../i18n/context';
import { requestContact } from '../lib/contactIntent';
import type { Interest } from '../lib/leadSchema';

// Icon, photo and form interest per card; texts come from i18n `directions.items` in the same order.
const CARDS: { icon: LucideIcon; photo: string; interest?: Interest }[] = [
  { icon: Building2, photo: 'station-sunset' },
  { icon: Route, photo: 'station-highway' },
  { icon: Factory, photo: 'station-arrive', interest: 'kompaniya' },
];

/** Three audiences right under the hero: cities, highways, companies. */
export default function Directions() {
  const { t } = useI18n();
  const d = t.directions;
  return (
    <section id="yonalishlar" aria-labelledby="directions-title" className="relative bg-ink pb-20 text-white sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="directions-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {d.title} <span className="text-brand">{d.titleAccent}</span>
          </h2>
          <p className="text-sm text-white/50">{d.note}</p>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-3">
          {d.items.map(({ title, text, alt }, i) => {
            const { icon: Icon, photo, interest } = CARDS[i];
            return (
              <Reveal
                as="li"
                key={photo}
                delay={0.08 * i}
                className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand/60 sm:min-h-[26rem] sm:p-7"
              >
                <Picture
                  name={photo}
                  alt={alt}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink from-25% via-ink/60 via-55% to-transparent" />

                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-ink">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{text}</p>
                <button
                  type="button"
                  onClick={() => requestContact(interest)}
                  className="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-brand underline-offset-4 hover:underline"
                >
                  {d.contact}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </button>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
