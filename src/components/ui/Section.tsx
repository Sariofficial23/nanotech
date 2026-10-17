import type { ReactNode } from 'react';
import type { SectionId } from '../../config/site';
import { cn } from '../../lib/cn';
import Reveal from './Reveal';

export type Tone = 'light' | 'paper' | 'dark' | 'brand';

const TONES: Record<Tone, string> = {
  light: 'bg-white text-ink',
  paper: 'bg-paper text-ink',
  dark: 'bg-ink text-white',
  brand: 'bg-brand text-ink',
};

interface SectionProps {
  id: SectionId;
  tone?: Tone;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
}

export function Section({ id, tone = 'light', className, labelledBy, children }: SectionProps) {
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

export function SectionHeading({ id, eyebrow, title, lead, tone = 'light', align = 'left', className }: SectionHeadingProps) {
  const dark = tone === 'dark';
  const brand = tone === 'brand';
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p
        className={cn(
          'mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase',
          dark ? 'text-brand' : brand ? 'text-ink/70' : 'text-muted',
        )}
      >
        <span aria-hidden="true" className={cn('h-px w-8', dark ? 'bg-brand' : 'bg-ink/40')} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-display text-[2rem] leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]"
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-5 text-lg leading-relaxed text-pretty sm:text-xl',
            dark ? 'text-white/70' : brand ? 'text-ink/80' : 'text-muted',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
