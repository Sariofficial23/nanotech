import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';
import { LOCATION } from '../config/site';
import { useI18n } from '../i18n/context';

const copy = {
  uz: { eyebrow: 'Manzilimiz', title: 'Bizni xaritada toping', lead: 'Kompaniyamiz joylashuvi. Qulay yo‘nalishni Google Maps orqali oching.', map: 'NANOTEX kompaniyasining xaritadagi manzili', open: 'Xaritada ochish', directions: 'Yo‘nalish olish' },
  ru: { eyebrow: 'Наш адрес', title: 'Найдите нас на карте', lead: 'Местоположение нашей компании. Постройте удобный маршрут в Google Maps.', map: 'Адрес компании NANOTEX на карте', open: 'Открыть карту', directions: 'Построить маршрут' },
  en: { eyebrow: 'Our location', title: 'Find us on the map', lead: 'Our company location. Open Google Maps to plan your route.', map: 'NANOTEX company location on the map', open: 'Open map', directions: 'Get directions' },
};

export default function Location() {
  const { lang } = useI18n();
  const t = copy[lang];
  return (
    <section id="manzil" aria-labelledby="location-title" className="border-t border-white/10 bg-ink-soft py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-brand uppercase"><MapPin size={16} aria-hidden="true" />{t.eyebrow}</p>
            <h2 id="location-title" className="mt-4 font-display text-3xl leading-tight font-bold sm:text-4xl">{t.title}</h2>
            <p className="mt-4 leading-relaxed text-white/60">{t.lead}</p>
          </div>
          <a href={LOCATION.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-ink hover:bg-[#ffd033]"><Navigation size={17} aria-hidden="true" />{t.directions}</a>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-ink">
          <iframe title={t.map} src={`https://www.google.com/maps?q=${LOCATION.latitude},${LOCATION.longitude}&z=16&output=embed&hl=${lang}`} width="1200" height="420" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="block h-[320px] w-full border-0 sm:h-[420px]" />
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7">
            <p className="flex items-center gap-2 font-semibold"><MapPin size={18} className="text-brand" aria-hidden="true" />NANOTEX</p>
            <a href={LOCATION.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:underline">{t.open}<ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
