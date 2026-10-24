import { createContext, useContext } from 'react';
import type { Lang } from './langs';
import { uz, type Dict } from './uz';

export interface I18nValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nValue>({ lang: 'uz', t: uz, setLang: () => {} });

export const useI18n = () => useContext(I18nContext);
