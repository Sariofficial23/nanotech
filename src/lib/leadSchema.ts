// Shared by the contact form (client validation) and api/lead.ts (server validation).
import { z } from 'zod';

export const INTERESTS = [
  { value: 'yer-maydoni', label: 'Yer maydoni egasiman' },
  { value: 'tadbirkor', label: 'Tadbirkorman' },
  { value: 'investor', label: 'Investorman' },
  { value: 'kompaniya', label: 'Kompaniya vakiliman' },
  { value: 'boshqa', label: 'Boshqa savol' },
] as const;

export type Interest = (typeof INTERESTS)[number]['value'];

const INTEREST_VALUES = INTERESTS.map((i) => i.value) as [Interest, ...Interest[]];

export const UZ_PHONE_PATTERN = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ismingizni kiriting (kamida 2 ta harf).')
    .max(60, 'Ism 60 ta belgidan oshmasligi kerak.'),
  phone: z.string().trim().regex(UZ_PHONE_PATTERN, 'Telefon raqamini to‘liq kiriting: +998 XX XXX XX XX'),
  interest: z.enum(INTEREST_VALUES, { error: 'Qiziqish yo‘nalishini tanlang.' }),
  comment: z.string().trim().max(1000, 'Izoh 1000 ta belgidan oshmasligi kerak.'),
  /** Honeypot: hidden from people, bots tend to fill it. Must stay empty. */
  website: z.string().max(0),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export const interestLabel = (value: Interest) => INTERESTS.find((i) => i.value === value)?.label ?? value;
