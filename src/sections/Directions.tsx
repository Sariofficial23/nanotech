import { ArrowRight, Building2, Factory, Route, type LucideIcon } from 'lucide-react';
import Picture from '../components/ui/Picture';
import Reveal from '../components/ui/Reveal';
import { requestContact } from '../lib/contactIntent';
import type { Interest } from '../lib/leadSchema';

interface Direction {
  icon: LucideIcon;
  title: string;
  text: string;
  photo: string;
  alt: string;
  interest?: Interest;
}

const DIRECTIONS: Direction[] = [
  {
    icon: Building2,
    title: 'Shaharlar uchun',
    text: 'Shahar ichidagi kichik maydonlarga ham joylashtirish mumkin bo‘lgan ko‘chma AYoQSh.',
    photo: 'station-sunset',
    alt: 'Shahar ko‘chasidagi NANOTEX ko‘chma shoxobchasi (vizualizatsiya)',
  },
  {
    icon: Route,
    title: 'Trassalar uchun',
    text: 'Avtomobil yo‘llari va gavjum yo‘nalishlar bo‘yida haydovchilar uchun qulay yoqilg‘i nuqtasi.',
    photo: 'station-highway',
    alt: 'Trassa bo‘yidagi NANOTEX ko‘chma shoxobchasi (vizualizatsiya)',
  },
  {
    icon: Factory,
    title: 'Kompaniyalar uchun',
    text: 'Avtoparki bor korxonalar uchun o‘z hududida ko‘chma AYoQSh o‘rnatish imkoniyatini muhokama qilamiz.',
    photo: 'station-arrive',
    alt: 'Korxona hududidagi NANOTEX ko‘chma shoxobchasi (vizualizatsiya)',
    interest: 'kompaniya',
  },
];

/** Three audiences right under the hero: cities, highways, companies. */
export default function Directions() {
  return (
    <section id="yonalishlar" aria-labelledby="directions-title" className="relative bg-ink pb-20 text-white sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="directions-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Ko‘chma AYoQSh — <span className="text-brand">kim uchun?</span>
          </h2>
          <p className="text-sm text-white/50">Tasvirlar — vizualizatsiya</p>
        </Reveal>

        <ul className="grid gap-5 md:grid-cols-3">
          {DIRECTIONS.map(({ icon: Icon, title, text, photo, alt, interest }, i) => (
            <Reveal
              as="li"
              key={title}
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
                Murojaat qilish
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
