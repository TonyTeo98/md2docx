import { createContext, useContext, useCallback } from 'react';
import type { ReactNode, FC } from 'react';
import { useStore } from '../../store';
import { zh, en, ja, ko, fr, de, es, pt, ru } from './locales';
import type { Locale } from './locales';
import type { Language } from '../../types';

const locales: Record<Language, Locale> = { zh, en, ja, ko, fr, de, es, pt, ru };

// Language display names (in their native language)
export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ru: 'Русский',
};

// Language list for selector
export const languageList: { code: Language; name: string }[] = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
];

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path; // Return key if not found
    }
  }

  return typeof value === 'string' ? value : path;
}

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: FC<I18nProviderProps> = ({ children }) => {
  const language = useStore((state) => state.settings.language);
  const setLanguage = useStore((state) => state.setLanguage);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const locale = locales[language];
      let text = getNestedValue(locale as unknown as Record<string, unknown>, key);

      // Replace parameters like {name} with actual values
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

export default I18nProvider;
