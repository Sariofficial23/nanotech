import { CONTACTS } from '../../config/site';
import { useI18n } from '../../i18n/context';
import { cn } from '../../lib/cn';
import { CHANNEL_ICONS } from './channelIcons';

interface ContactChannelsProps {
  tone?: 'dark' | 'light';
  compact?: boolean;
  className?: string;
}

/** Official phone numbers and social contact links. */
export default function ContactChannels({ tone = 'dark', compact = false, className }: ContactChannelsProps) {
  const { t } = useI18n();
  const ACTIONS = t.channels;
  const dark = tone === 'dark';
  return (
    <ul className={cn('grid grid-cols-2 gap-3', className)}>
      {CONTACTS.filter((channel) => channel.href).map((channel) => {
        const Icon = CHANNEL_ICONS[channel.kind];
        return (
          <li key={channel.href} className="min-w-0">
            <a
              href={channel.href!}
              aria-label={channel.kind === 'phone' ? `${ACTIONS.phone}: ${channel.value}` : ACTIONS[channel.kind]}
              target={channel.kind === 'phone' ? undefined : '_blank'}
              rel={channel.kind === 'phone' ? undefined : 'noopener noreferrer'}
              className={cn(
                'group flex h-full min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border p-3 text-center transition-colors',
                dark ? 'border-white/10 bg-white/[0.03] hover:border-brand/60 hover:bg-brand/10' : 'border-ink/15 hover:border-ink/40',
              )}
            >
              <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-full', dark ? 'bg-white/8 text-brand' : 'bg-paper text-ink')}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className={cn('font-medium leading-snug', compact ? 'text-xs' : 'text-sm')}>
                {channel.kind === 'phone' ? channel.value : ACTIONS[channel.kind]}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
