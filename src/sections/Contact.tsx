import { lazy, Suspense, useEffect } from 'react';
import ContactChannels from '../components/contact/ContactChannels';
import Reveal from '../components/ui/Reveal';
import { Section, SectionHeading } from '../components/ui/Section';

// The form (react-hook-form + zod) is below the fold: load it separately, as soon as the browser is idle.
const loadForm = () => import('../components/contact/ContactForm');
const ContactForm = lazy(loadForm);

function FormPlaceholder() {
  return (
    <div
      aria-busy="true"
      aria-label="Shakl yuklanmoqda"
      className="min-h-[41rem] animate-pulse rounded-[1.75rem] bg-white/95 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.6)]"
    />
  );
}

export default function Contact() {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    idle(() => void loadForm());
  }, []);

  return (
    <Section id="aloqa" tone="dark" labelledBy="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_20%_30%,black_10%,transparent_60%)]" />
        <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] animate-drift-slow rounded-full bg-brand/15 blur-[120px]" />
      </div>

      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            id="contact-title"
            tone="dark"
            eyebrow="Aloqa"
            title="Biz bilan bog‘laning"
            lead="Hamkorlik, maydon taklifi yoki savollaringiz bo‘yicha so‘rov qoldiring."
          />
          <Reveal delay={0.1} className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
            <p className="mb-5 text-sm font-semibold text-white/80">Rasmiy kontaktlar</p>
            <ContactChannels tone="dark" />
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <Suspense fallback={<FormPlaceholder />}>
            <ContactForm />
          </Suspense>
        </Reveal>
      </div>
    </Section>
  );
}
