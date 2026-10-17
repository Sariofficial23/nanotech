import { Handshake, Info, MessageSquareText, PencilRuler, ScanSearch } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';

const STEPS = [
  {
    icon: MessageSquareText,
    title: 'Murojaat',
    text: 'Sayt orqali so‘rov qoldirasiz yoki biz bilan bog‘lanasiz.',
  },
  {
    icon: ScanSearch,
    title: 'Joyni o‘rganish',
    text: 'Maydonning joylashuvi, hajmi va texnik imkoniyatlari ko‘rib chiqiladi.',
  },
  {
    icon: PencilRuler,
    title: 'Loyihani rejalashtirish',
    text: 'Joylashtirish varianti va keyingi qadamlar birgalikda muhokama qilinadi.',
  },
  {
    icon: Handshake,
    title: 'Kelishuv va amalga oshirish',
    text: 'Shartlar kelishilgach, loyihani amalga oshirish bosqichlariga o‘tiladi.',
  },
];

export default function Process() {
  return (
    <Section id="jarayon" tone="soft" labelledBy="process-title">
      <SectionHeading
        id="process-title"
        eyebrow="Jarayon"
        title="Loyiha qanday ishlaydi?"
        lead="Birinchi murojaatdan amalga oshirishgacha — to‘rt asosiy bosqich."
      />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-brand via-white/15 to-brand lg:block"
        />
      <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <Reveal as="li" key={title} delay={0.1 * i} className="group relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
            <div className="relative">
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-soft text-brand transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-[0.2em] text-brand">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-white/60">{text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      </div>

      <Reveal>
        <div className="mt-14 flex gap-4 rounded-2xl border border-brand/30 bg-brand/10 p-5 sm:p-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          <p className="leading-relaxed text-white/80">
            Joylashtirish va amalga oshirish imkoniyati maydonning xususiyatlari, texnik shartlar va zarur
            ruxsatnomalarga bog‘liq. Har bir holat alohida ko‘rib chiqiladi.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
