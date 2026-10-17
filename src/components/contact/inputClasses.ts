import { cn } from '../../lib/cn';

export const inputClasses = (invalid: boolean) =>
  cn(
    'block w-full rounded-xl border bg-white px-4 text-base text-ink placeholder:text-ink/35',
    'transition-[border-color,box-shadow] duration-150 outline-none',
    'focus:border-ink focus:ring-4 focus:ring-brand/40',
    invalid ? 'border-danger focus:border-danger focus:ring-danger/15' : 'border-line hover:border-ink/30',
  );
