export type SupportedLanguage = 'en' | 'es';

export interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationKeys {
  [key: string]: any;
}

export type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;