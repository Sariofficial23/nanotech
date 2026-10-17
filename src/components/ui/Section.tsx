import type { ReactNode } from 'react';
import type { SectionId } from '../../config/site';
import { cn } from '../../lib/cn';
import Reveal from './Reveal';

// The whole site is dark like the hero; "soft" alternates with "dark" so sections stay distinct,
// and "brand" (yellow) is the single accent band.
export type Tone = 'dark' | 'soft' | 'brand';

const TONES: Record<Tone, string> = {
  dark: 'bg-ink text-white border-t border-white/[0.06]',
  soft: 'bg-ink-soft text-white border-t border-white/[0.06]',
  brand: 'bg-brand text-ink',
};

interface SectionProps {
  id: SectionId;
  tone?: Tone;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

export function Section({ id, tone = 'dark', className, labelledBy, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn('relative isolate overflow-hidden py-20 sm:py-24 lg:py-32', TONES[tone], className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ id, eyebrow, title, lead, tone = 'dark', align = 'left', className }: SectionHeadingProps) {
  const brand = tone === 'brand';
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p
        className={cn(
          'mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase',
          brand ? 'text-ink/70' : 'text-brand',
        )}
      >
        <span aria-hidden="true" className={cn('h-px w-8', brand ? 'bg-ink/40' : 'bg-brand')} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-display text-[2rem] leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]"
      >
        {title}
      </h2>
      {lead && (
        <p className={cn('mt-5 text-lg leading-relaxed text-pretty sm:text-xl', brand ? 'text-ink/80' : 'text-white/70')}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}
