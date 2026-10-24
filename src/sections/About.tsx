import { LandPlot, MapPinned, ScanSearch } from 'lucide-react';
import Logo from '../components/brand/Logo';
import Picture from '../components/ui/Picture';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { useI18n } from '../i18n/context';

const CONCEPT_ICONS = [LandPlot, MapPinned, ScanSearch];

export default function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <Section id="biz-haqimizda" tone="soft" labelledBy="about-title" wide>
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow={a.eyebrow}
            title={<>{a.titleBefore}<Logo tone="dark" className="align-middle" />{a.titleAfter}</>}
            lead={a.lead}
          />

          <ul className="mt-10 space-y-6">
            {a.concept.map(({ title, text }, i) => {
              const Icon = CONCEPT_ICONS[i];
              return (
                <Reveal as="li" key={title} delay={0.08 * i} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{title}</h3>
                    <p className="mt-1 leading-relaxed text-white/60">{text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="relative">
          <div aria-hidden="true" className="bg-grid absolute -inset-6 -z-10 rounded-[2.5rem] [mask-image:radial-gradient(closest-side,black,transparent)]" />
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-2 shadow-[0_40px_120px_-40px_rgb(255_196_0/0.25)] sm:p-3">
            <Picture
              name="station-highway"
              alt={a.photoAlt}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="block aspect-[1672/941] h-auto w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <p className="mt-3 text-center text-xs text-white/40">{a.photoNote}</p>
        </Reveal>
      </div>
    </Section>
  );
}
