import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light';
type Size = 'md' | 'lg';

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-ink shadow-[0_8px_24px_-8px_rgb(255_196_0/0.6)] hover:bg-[#ffd033] hover:shadow-[0_12px_32px_-8px_rgb(255_196_0/0.75)]',
  dark: 'bg-ink text-white hover:bg-ink-soft hover:shadow-lift',
  outline: 'border border-ink/15 bg-white text-ink hover:border-ink/40 hover:bg-paper',
  'outline-light': 'border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/45 hover:bg-white/10',
};

const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

const buttonClasses =(variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(BASE, VARIANTS[variant], SIZES[size], className);

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}

const Content = ({ icon, children }: Pick<CommonProps, 'icon' | 'children'>) => (
  <>
    <span>{children}</span>
    {icon && (
      <span aria-hidden="true" className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
        {icon}
      </span>
    )}
  </>
);

export function ButtonLink({
  variant,
  size,
  icon,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </a>
  );
}

export function Button({
  variant,
  size,
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      <Content icon={icon}>{children}</Content>
    </button>
  );
}
