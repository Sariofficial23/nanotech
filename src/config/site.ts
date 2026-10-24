// Single source of truth for brand name, navigation and official contacts.
// Contacts come from environment variables so they can be set in Vercel without code changes.
// An empty value means "not provided yet" — the UI then shows a neutral placeholder, never a made-up contact.

const env = (value: string | undefined) => value?.trim() || null;

export const BRAND = {
  /** Brand name in texts — matches the logo. All other copy lives in src/i18n. */
  name: 'NANOTEX',
  slogan: 'Sifat • Ishonch • Samaradorlik',
} as const;

/** Section anchors shown in the menus; their labels come from i18n `nav`. */
export const NAV_IDS = ['bosh-sahifa', 'biz-haqimizda', 'ishlarimiz', 'mahsulotlar', 'hamkorlik', 'aloqa'] as const;
export type NavId = (typeof NAV_IDS)[number];

export type SectionId = NavId | 'yonalishlar' | 'shoxobcha' | 'jarayon' | 'savol-javob' | 'yechimlar';

// Official phone numbers shown under the phone button in the header (first one is also in Contacts).
// VITE_CONTACT_PHONE may hold several numbers separated by commas.
export const PHONES: string[] = (env(import.meta.env.VITE_CONTACT_PHONE) ?? '+998 98 274 05 05')
  .split(',')
  .map((p) => p.trim())
  .filter(Boolean);

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Official contacts confirmed by the company; env variables can still override them.
const phone = PHONES[0] ?? null;
const telegram = (env(import.meta.env.VITE_CONTACT_TELEGRAM) ?? 'kuchmaAZS').replace(/^@/, '');
const instagram = (env(import.meta.env.VITE_CONTACT_INSTAGRAM) ?? 'nanotex_azs').replace(/^@/, '');

export interface ContactChannel {
  kind: 'phone' | 'telegram' | 'telegram-group' | 'instagram';
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
    href: phone ? telHref(phone) : null,
  },
  {
    kind: 'telegram',
    label: 'Telegram',
    action: 'Telegram’da yozish',
    value: telegram ? `@${telegram}` : null,
    href: telegram ? `https://t.me/${telegram}` : null,
  },
  {
    kind: 'telegram-group',
    label: 'Telegram guruhimiz',
    action: 'Telegram guruhimizga qo‘shilish',
    value: 'Guruhga qo‘shilish',
    href: 'https://t.me/+hPwzEB4SXttmZGYy',
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
