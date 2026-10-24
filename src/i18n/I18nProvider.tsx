import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { I18nContext } from './context';
import { en } from './en';
import { initialLang, saveLang, type Lang } from './langs';
import { ru } from './ru';
import { uz, type Dict } from './uz';

const DICTS: Record<Lang, Dict> = { uz, ru, en };

function setMeta(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute('content', content);
}

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const t = DICTS[lang];

  // Keep <html lang>, the tab title and the share/search descriptions in the chosen language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    setMeta('meta[name="description"]', t.meta.description);
    setMeta('meta[property="og:description"]', t.meta.description);
    setMeta('meta[property="og:locale"]', { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' }[lang]);
  }, [lang, t]);

  const value = useMemo(
    () => ({
      lang,
      t,
      setLang: (next: Lang) => {
        saveLang(next);
        setLangState(next);
      },
    }),
    [lang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
