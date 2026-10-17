import { cn } from '../../lib/cn';

export const inputClasses = (invalid: boolean) =>
  cn(
    'block w-full rounded-xl border bg-white/[0.04] px-4 text-base text-white placeholder:text-white/35 [color-scheme:dark]',
    'transition-[border-color,box-shadow] duration-150 outline-none',
    'focus:border-brand focus:ring-4 focus:ring-brand/20',
    invalid ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-white/15 hover:border-white/30',
  );
