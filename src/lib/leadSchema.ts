// Shared by the contact form (client validation) and api/lead.ts (server validation).
import { z } from 'zod';

export const INTERESTS = [
  { value: 'yer-maydoni', label: 'Yer maydoni egasiman' },
  { value: 'tadbirkor', label: 'Tadbirkorman' },
  { value: 'investor', label: 'Investorman' },
  { value: 'kompaniya', label: 'Kompaniya vakiliman' },
  { value: 'mahsulotlar', label: 'Mahsulotlar' },
  { value: 'boshqa', label: 'Boshqa savol' },
] as const;

export type Interest = (typeof INTERESTS)[number]['value'];

const INTEREST_VALUES = INTERESTS.map((i) => i.value) as [Interest, ...Interest[]];

export const UZ_PHONE_PATTERN = /^\+998 \d{2} \d{3} \d{2} \d{2}$/;

// Error messages are codes; the form shows them in the visitor's language (i18n form.validation).
export type ValidationCode = 'name_min' | 'name_max' | 'phone' | 'interest' | 'comment_max';

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'name_min')
    .max(60, 'name_max'),
  phone: z.string().trim().regex(UZ_PHONE_PATTERN, 'phone'),
  interest: z.enum(INTEREST_VALUES, { error: 'interest' }),
  comment: z.string().trim().max(1000, 'comment_max'),
  /** Honeypot: hidden from people, bots tend to fill it. Must stay empty. */
  website: z.string().max(0),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export const interestLabel = (value: Interest) => INTERESTS.find((i) => i.value === value)?.label ?? value;
