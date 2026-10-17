import { Building2, ClipboardCheck, Fuel, Route, type LucideIcon } from 'lucide-react';
import BrandMark from '../components/brand/BrandMark';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { cn } from '../lib/cn';

interface Solution {
  icon: LucideIcon;
  title: string;
  text: string;
  featured?: boolean;
  wide?: boolean;
}

const SOLUTIONS: Solution[] = [
  {
    icon: Fuel,
    title: 'Ixcham AYOQSH',
    text: 'Kichik maydonga moslashtirilgan zamonaviy yoqilg‘i quyish shoxobchasi formati. NanoTech aynan shu formatni rivojlantirishga yo‘naltirilgan.',
    featured: true,
  },
  {
    icon: Building2,
    title: 'Shahar uchun yechimlar',
    text: 'Shahar muhitidagi maydonlarda ixcham shoxobcha joylashtirish variantlarini birgalikda o‘rganish mumkin.',
  },
  {
    icon: Route,
    title: 'Avtomobil yo‘llari uchun',
    text: 'Trassalar va qatnovi gavjum yo‘nalishlar bo‘yidagi joylar uchun yechimlarni muhokama qilish mumkin.',
  },
  {
    icon: ClipboardCheck,
    title: 'Loyihani amalga oshirish',
    text: 'Muhokama, rejalashtirish va amalga oshirish bosqichlari har bir loyiha uchun alohida kelishiladi.',
    wide: true,
  },
];

export default function Solutions() {
  return (
    <Section id="yechimlar" tone="paper" labelledBy="solutions-title">
      <SectionHeading
        id="solutions-title"
        eyebrow="Yechimlarimiz"
        title="Ixcham format — turli joylar uchun"
        lead="Ixcham yoqilg‘i quyish shoxobchasi shahar ichida ham, avtomobil yo‘llari bo‘yida ham ko‘rib chiqilishi mumkin bo‘lgan format."
      />

      <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
        {SOLUTIONS.map(({ icon: Icon, title, text, featured, wide }, i) => (
          <Reveal
            as="li"
            key={title}
            delay={0.06 * i}
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-3xl border p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 sm:p-8',
              featured
                ? 'border-ink bg-ink text-white hover:shadow-lift md:col-span-2 lg:col-span-1 lg:row-span-2'
                : 'border-line bg-white shadow-card hover:border-ink/20 hover:shadow-lift',
              wide && 'md:col-span-2',
            )}
          >
            <span
              className={cn(
                'grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-300',
                featured ? 'bg-brand text-ink' : 'bg-paper text-ink group-hover:bg-brand',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold">{title}</h3>
            <p className={cn('mt-3 leading-relaxed', featured ? 'text-white/70' : 'text-muted')}>{text}</p>

            {featured && (
              <div aria-hidden="true" className="relative mt-10 flex flex-1 items-end justify-end">
                <div className="absolute right-[-3rem] bottom-[-3rem] h-56 w-56 rounded-full bg-brand/20 blur-3xl" />
                <BrandMark className="relative h-36 w-36 transition-transform duration-700 ease-out group-hover:rotate-[22.5deg] lg:h-44 lg:w-44" />
              </div>
            )}
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted">
          Har bir yo‘nalish bo‘yicha aniq imkoniyatlar va shartlar loyiha asosida alohida muhokama qilinadi.
        </p>
      </Reveal>
    </Section>
  );
}
