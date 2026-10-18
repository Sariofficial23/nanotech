import { CONTACTS } from '../../config/site';
import { cn } from '../../lib/cn';
import { CHANNEL_ICONS } from './channelIcons';

/** Round icon buttons for phone / Telegram / Instagram (only channels that have a link). */
export default function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn('flex items-center gap-1.5 sm:gap-2', className)}>
      {CONTACTS.filter((c) => c.href).map((channel) => {
        const Icon = CHANNEL_ICONS[channel.kind];
        const external = channel.kind !== 'phone';
        return (
          <li key={channel.kind}>
            <a
              href={channel.href ?? undefined}
              aria-label={channel.action}
              title={channel.value ?? undefined}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-brand hover:bg-brand hover:text-ink sm:h-10 sm:w-10"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
