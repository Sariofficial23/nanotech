import { ArrowRight, Briefcase, Handshake, LandPlot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { requestContact } from '../lib/contactIntent';
import type { Interest } from '../lib/leadSchema';

const PARTNERS: { icon: typeof LandPlot; title: string; text: string; interest: Interest }[] = [
  {
    icon: LandPlot,
    title: 'Yer maydoni egalari',
    text: 'Shahar ichida yoki yo‘l bo‘yida maydoningiz bo‘lsa, uni ko‘chma shoxobcha uchun ko‘rib chiqishni taklif qilishingiz mumkin.',
    interest: 'yer-maydoni',
  },
  {
    icon: Handshake,
    title: 'Tadbirkorlar',
    text: 'Ko‘chma shoxobcha formatida birgalikda ishlash imkoniyatlarini muhokama qilish uchun murojaat qiling.',
    interest: 'tadbirkor',
  },
  {
    icon: Briefcase,
    title: 'Investorlar',
    text: 'Loyihani rivojlantirishda ishtirok etish masalasini muhokama qilish uchun murojaat qiling.',
    interest: 'investor',
  },
];

export default function Partnership() {
  return (
    <Section id="hamkorlik" tone="brand" labelledBy="partnership-title">
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="partnership-title"
          tone="brand"
          eyebrow="Hamkorlik"
          title="NanoTech bilan hamkorlik qiling"
          lead="Ko‘chma yoqilg‘i quyish shoxobchalarini rivojlantirish bo‘yicha hamkorlikni muhokama qilish uchun biz bilan bog‘lanishingiz mumkin."
        />
        <Reveal className="shrink-0">
          <Button variant="dark" size="lg" onClick={() => requestContact()} icon={<ArrowRight className="h-4 w-4" />}>
            Hamkorlik bo‘yicha murojaat
          </Button>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {PARTNERS.map(({ icon: Icon, title, text, interest }, i) => (
          <Reveal
            as="li"
            key={title}
            delay={0.08 * i}
            className="group flex flex-col rounded-3xl border border-ink bg-ink p-7 text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgb(17_17_17/0.6)] sm:p-8"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-ink">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-white/65">{text}</p>
            <button
              type="button"
              onClick={() => requestContact(interest)}
              className="mt-7 inline-flex items-center gap-2 self-start rounded-full text-sm font-semibold text-brand underline-offset-4 hover:underline"
            >
              Murojaat qilish
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <p className="mt-8 text-sm leading-relaxed text-ink/75">
          Moliyaviy shartlar va hamkorlik tafsilotlari har bir loyiha bo‘yicha alohida muhokama qilinadi.
        </p>
      </Reveal>
    </Section>
  );
}
