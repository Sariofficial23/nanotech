const PREFIX = '+998 ';

/** Formats any input into "+998 XX XXX XX XX" while typing. */
export function formatUzPhone(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);

  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean);
  return PREFIX + parts.join(' ');
}

export const PHONE_PREFIX = PREFIX;
