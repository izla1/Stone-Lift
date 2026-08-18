import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Lang, TKey } from './translations';

interface Ctx { lang: Lang; setLang: (l: Lang) => void; t: TKey; dir: 'ltr' | 'rtl'; }
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');

  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('lang', l); };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const value: Ctx = { lang, setLang, t: translations[lang], dir: lang === 'ar' ? 'rtl' : 'ltr' };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
