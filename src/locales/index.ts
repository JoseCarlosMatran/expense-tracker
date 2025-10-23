import { SupportedLanguage, Language } from '@/types/i18n';
import en from './en.json';
import es from './es.json';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
];

export const translations = {
  en,
  es,
};

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const getTranslation = (language: SupportedLanguage) => {
  return translations[language] || translations[DEFAULT_LANGUAGE];
};

export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  
  return SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang) 
    ? browserLang 
    : DEFAULT_LANGUAGE;
};