import Accordion from '../components/ui/Accordion';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';
import { useI18n } from '../i18n/context';

export default function Faq() {
  const { t } = useI18n();
  const f = t.faq;
  return (
    <Section id="savol-javob" tone="soft" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="faq-title" eyebrow={f.eyebrow} title={f.title} lead={f.lead} />
        <Reveal delay={0.1}>
          <Accordion items={f.items} />
        </Reveal>
      </div>
    </Section>
  );
}
