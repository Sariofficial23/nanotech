// Single source of truth for brand name, navigation and official contacts.
// Contacts come from environment variables so they can be set in Vercel without code changes.
// An empty value means "not provided yet" — the UI then shows a neutral placeholder, never a made-up contact.

const env = (value: string | undefined) => value?.trim() || null;

export const BRAND = {
  /** Name used in texts. The logo artwork itself reads "NANOTEX". */
  name: 'NanoTech',
  slogan: 'Sifat • Ishonch • Samaradorlik',
  description:
    'NanoTech — shaharlar va avtomobil yo‘llari uchun ixcham yoqilg‘i quyish shoxobchalarini yaratish va rivojlantirishga yo‘naltirilgan loyiha.',
} as const;

export const NAV_ITEMS = [
  { id: 'bosh-sahifa', label: 'Bosh sahifa' },
  { id: 'biz-haqimizda', label: 'Biz haqimizda' },
  { id: 'yechimlar', label: 'Yechimlarimiz' },
  { id: 'hamkorlik', label: 'Hamkorlik' },
  { id: 'aloqa', label: 'Aloqa' },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]['id'] | 'shoxobcha' | 'jarayon' | 'savol-javob';

// Official contacts confirmed by the company; env variables can still override them.
const phone = env(import.meta.env.VITE_CONTACT_PHONE) ?? '+998 98 274 05 05';
const telegram = (env(import.meta.env.VITE_CONTACT_TELEGRAM) ?? 'kuchmaAZS').replace(/^@/, '');
const instagram = (env(import.meta.env.VITE_CONTACT_INSTAGRAM) ?? 'nanotex_azs').replace(/^@/, '');

export interface ContactChannel {
  kind: 'phone' | 'telegram' | 'instagram';
  label: string;
  /** Accessible name for icon-only links. */
  action: string;
  value: string | null;
  href: string | null;
}

export const CONTACTS: ContactChannel[] = [
  {
    kind: 'phone',
    label: 'Telefon',
    action: `Qo‘ng‘iroq qilish: ${phone}`,
    value: phone,
    href: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null,
  },
  {
    kind: 'telegram',
    label: 'Telegram',
    action: 'Telegram’da yozish',
    value: telegram ? `@${telegram}` : null,
    href: telegram ? `https://t.me/${telegram}` : null,
  },
  {
    kind: 'instagram',
    label: 'Instagram',
    action: 'Instagram sahifamiz',
    value: instagram ? `@${instagram}` : null,
    href: instagram ? `https://www.instagram.com/${instagram}` : null,
  },
];

export const hasAnyContact = CONTACTS.some((c) => c.value);
