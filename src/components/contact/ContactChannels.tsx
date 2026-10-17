import { Mail, Phone, Send, type LucideIcon } from 'lucide-react';
import { CONTACTS, type ContactChannel } from '../../config/site';
import { cn } from '../../lib/cn';

const ICONS: Record<ContactChannel['kind'], LucideIcon> = {
  phone: Phone,
  telegram: Send,
  email: Mail,
};

interface ContactChannelsProps {
  tone?: 'dark' | 'light';
  compact?: boolean;
  className?: string;
}

/** Official contacts. Channels without a value show a neutral "will be added" placeholder. */
export default function ContactChannels({ tone = 'dark', compact = false, className }: ContactChannelsProps) {
  const dark = tone === 'dark';
  return (
    <ul className={cn(compact ? 'space-y-3' : 'space-y-3.5', className)}>
      {CONTACTS.map((channel) => {
        const Icon = ICONS[channel.kind];
        const body = (
          <>
            <span
              className={cn(
                'grid shrink-0 place-items-center rounded-xl',
                compact ? 'h-9 w-9' : 'h-11 w-11',
                dark ? 'bg-white/8 text-brand' : 'bg-paper text-ink',
              )}
            >
              <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className={cn('block text-xs tracking-wide uppercase', dark ? 'text-white/50' : 'text-muted')}>
                {channel.label}
              </span>
              {channel.value ? (
                <span className={cn('block truncate font-medium', compact ? 'text-sm' : 'text-base')}>{channel.value}</span>
              ) : (
                <span className={cn('block text-sm italic', dark ? 'text-white/45' : 'text-muted')}>Tez orada qo‘shiladi</span>
              )}
            </span>
          </>
        );

        return (
          <li key={channel.kind}>
            {channel.href ? (
              <a
                href={channel.href}
                target={channel.kind === 'telegram' ? '_blank' : undefined}
                rel={channel.kind === 'telegram' ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center gap-3.5 rounded-2xl transition-colors',
                  !compact && 'p-2 -m-2',
                  dark ? 'hover:text-brand' : 'hover:text-brand-deep',
                )}
              >
                {body}
              </a>
            ) : (
              <div className={cn('flex items-center gap-3.5', !compact && 'p-2 -m-2')}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
