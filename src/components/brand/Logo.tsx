import { BRAND } from '../../config/site';
import { cn } from '../../lib/cn';
import BrandMark from './BrandMark';

interface LogoProps {
  tone?: 'light' | 'dark';
  className?: string;
}

/** Compact horizontal logo: symbol + the wordmark as drawn in the original artwork. */
export default function Logo({ tone = 'light', className }: LogoProps) {
  const onDark = tone === 'dark';
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark className="h-9 w-9 shrink-0 drop-shadow-sm sm:h-10 sm:w-10" />
      <span
        aria-hidden="true"
        className="font-display text-[1.45rem] leading-none font-black tracking-tight italic sm:text-[1.6rem]"
      >
        <span className={onDark ? 'text-white' : 'text-ink'}>NANO</span>
        <span
          className="text-brand"
          style={onDark ? undefined : { WebkitTextStroke: '1.2px #111', paintOrder: 'stroke fill' }}
        >
          TEX
        </span>
      </span>
      <span className="sr-only">{BRAND.name}</span>
    </span>
  );
}
