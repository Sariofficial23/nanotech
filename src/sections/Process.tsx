import { Handshake, Info, MessageSquareText, PencilRuler, ScanSearch } from 'lucide-react';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { useI18n } from '../i18n/context';

const STEP_ICONS = [MessageSquareText, ScanSearch, PencilRuler, Handshake];

export default function Process() {
  const { t } = useI18n();
  const p = t.process;
  return (
    <Section id="jarayon" tone="soft" labelledBy="process-title">
      <SectionHeading id="process-title" eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

      <div className="relative mt-16">
        <div
          aria-hidden="true"
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px bg-gradient-to-r from-brand via-white/15 to-brand lg:block"
        />
        <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {p.steps.map(({ title, text }, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <Reveal as="li" key={i} delay={0.1 * i} className="group relative flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <div className="relative">
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-soft text-brand transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-bold tracking-[0.2em] text-brand">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-white/60">{text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal>
        <div className="mt-14 flex gap-4 rounded-2xl border border-brand/30 bg-brand/10 p-5 sm:p-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          <p className="leading-relaxed text-white/80">{p.note}</p>
        </div>
      </Reveal>
    </Section>
  );
}
