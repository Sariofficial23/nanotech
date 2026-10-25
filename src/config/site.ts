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

// Official numbers confirmed by the company, shared by every contact block.
export const PHONES = ['+998 90 299 79 96', '+998 98 274 05 05'] as const;

export const LOCATION = {
  latitude: 39.74082,
  longitude: 64.457152,
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=39.74082,64.457152',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=39.74082,64.457152',
} as const;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Official contacts confirmed by the company; env variables can still override them.
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
  ...PHONES.map((phone): ContactChannel => ({
    kind: 'phone',
    label: 'Telefon',
    action: `Qo‘ng‘iroq qilish: ${phone}`,
    value: phone,
    href: phone ? telHref(phone) : null,
  })),
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
