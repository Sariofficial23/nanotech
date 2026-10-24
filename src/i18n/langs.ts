export type Lang = 'uz' | 'ru' | 'en';

/** Order matters: Uzbek first (default), then Russian, then English. */
export const LANGS: { code: Lang; short: string; label: string }[] = [
  { code: 'uz', short: 'UZ', label: 'O‘zbekcha' },
  { code: 'ru', short: 'RU', label: 'Русский' },
  { code: 'en', short: 'EN', label: 'English' },
];

export const DEFAULT_LANG: Lang = 'uz';
const STORAGE_KEY = 'nanotex:lang';

const isLang = (value: unknown): value is Lang => LANGS.some((l) => l.code === value);

/** ?lang=ru in the URL wins (shareable links), then the visitor's saved choice, else Uzbek. */
export function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (isLang(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_LANG;
}

export function saveLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable */
  }
}
