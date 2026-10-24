import { ArrowRight, Briefcase, Handshake, LandPlot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import Logo from '../components/brand/Logo';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { useI18n } from '../i18n/context';
import { requestContact } from '../lib/contactIntent';
import type { Interest } from '../lib/leadSchema';

// Icon and form interest per card; texts come from i18n `partnership.cards` in the same order.
const CARDS: { icon: typeof LandPlot; interest: Interest }[] = [
  { icon: LandPlot, interest: 'yer-maydoni' },
  { icon: Handshake, interest: 'tadbirkor' },
  { icon: Briefcase, interest: 'investor' },
];

export default function Partnership() {
  const { t } = useI18n();
  const p = t.partnership;
  return (
    <Section id="hamkorlik" tone="brand" labelledBy="partnership-title">
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          id="partnership-title"
          tone="brand"
          eyebrow={p.eyebrow}
          title={<>{p.titleBefore}<Logo tone="dark" className="align-middle rounded-2xl bg-ink px-4 py-2.5 shadow-lg" />{p.titleAfter}</>}
          lead={p.lead}
        />
        <Reveal className="shrink-0">
          <Button variant="dark" size="lg" onClick={() => requestContact()} icon={<ArrowRight className="h-4 w-4" />}>
            {p.cta}
          </Button>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {p.cards.map(({ title, text }, i) => {
          const { icon: Icon, interest } = CARDS[i];
          return (
            <Reveal
              as="li"
              key={interest}
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
                {p.contact}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </Reveal>
          );
        })}
      </ul>

      <Reveal>
        <p className="mt-8 text-sm leading-relaxed text-ink/75">{p.note}</p>
      </Reveal>
    </Section>
  );
}
