export type SupportedLanguage = 'en' | 'es';

export interface Language {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
}

export interface TranslationKeys {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TranslationFunction = (key: string, params?: Record<string, string | number>) => string;