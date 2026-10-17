import { LandPlot, MapPinned, ScanSearch } from 'lucide-react';
import Picture from '../components/ui/Picture';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';

const CONCEPT = [
  {
    icon: LandPlot,
    title: 'Ixcham format',
    text: 'Shoxobcha kichik maydonlarga joylashtirishga mo‘ljallangan yechim sifatida rivojlantiriladi.',
  },
  {
    icon: MapPinned,
    title: 'Shahar va yo‘llar uchun',
    text: 'Shahar ichidagi hududlar va avtomobil yo‘llari bo‘yidagi joylar ko‘rib chiqiladi.',
  },
  {
    icon: ScanSearch,
    title: 'Har bir joyga alohida yondashuv',
    text: 'Joylashtirish imkoniyati maydonning xususiyatlari va texnik shartlarga qarab baholanadi.',
  },
];

export default function About() {
  return (
    <Section id="biz-haqimizda" labelledBy="about-title">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="Biz haqimizda"
            title="NanoTech haqida"
            lead="NanoTech — ixcham yoqilg‘i quyish shoxobchalarini yaratish va ularni rivojlantirishga qaratilgan loyiha. Biz shaharlar va avtomobil yo‘llarida joylashtirish mumkin bo‘lgan zamonaviy yechimlarni rivojlantirishga intilamiz."
          />

          <ul className="mt-10 space-y-6">
            {CONCEPT.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={0.08 * i} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-ink">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1} className="relative">
          <div aria-hidden="true" className="bg-grid-dark absolute -inset-6 -z-10 rounded-[2.5rem] [mask-image:radial-gradient(closest-side,black,transparent)]" />
          <div className="overflow-hidden rounded-[2rem] border border-line bg-white p-2 shadow-card sm:p-3">
            <Picture
              name="station-highway"
              alt="Avtomobil yo‘li bo‘yidagi NanoTech ixcham shoxobchasi (vizualizatsiya)"
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="block aspect-[1672/941] h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted">Vizualizatsiya. Haqiqiy loyihalar ko‘rinishi farq qilishi mumkin.</p>
        </Reveal>
      </div>
    </Section>
  );
}
