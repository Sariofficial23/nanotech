// Brand glyphs (Lucide no longer ships brand icons). Both follow currentColor.

interface IconProps {
  className?: string;
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M21.94 4.34a1.2 1.2 0 0 0-1.62-1.3L2.86 9.77c-1.18.46-1.17 1.13-.21 1.42l4.48 1.4 1.73 5.3c.21.58.1.82.72.82.48 0 .69-.22.96-.48l2.16-2.1 4.49 3.32c.83.46 1.42.22 1.63-.77l2.95-13.9-.01-.01ZM9.4 13.43l8.36-5.28c.42-.25.8-.12.49.16l-7.16 6.46-.28 2.98-1.41-4.32Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
