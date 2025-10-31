'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, TranslationKeys, TranslationFunction } from '@/types/i18n';
import { getTranslation, detectBrowserLanguage, DEFAULT_LANGUAGE } from '@/locales';
import { useHydration } from '@/hooks/useHydration';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationFunction;
  translations: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: SupportedLanguage;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children, initialLanguage }) => {
  const resolvedInitialLanguage = initialLanguage ?? DEFAULT_LANGUAGE;
  const [language, setLanguageState] = useState<SupportedLanguage>(resolvedInitialLanguage);
  const [translations, setTranslations] = useState<TranslationKeys>(getTranslation(resolvedInitialLanguage));
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;
    
    // Load saved language or detect browser language only after hydration
    const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    const detectedLanguage = savedLanguage || detectBrowserLanguage();

    if (detectedLanguage && detectedLanguage !== language) {
      setLanguageState(detectedLanguage);
      setTranslations(getTranslation(detectedLanguage));
    }
  }, [isHydrated, language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    setTranslations(getTranslation(lang));

    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', lang);
      document.documentElement.lang = lang;
    }
  };

  const t: TranslationFunction = (key, params) => {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value || typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // Replace parameters in translation
    if (params) {
      return Object.keys(params).reduce((str, paramKey) => {
        return str.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
      }, value);
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t,
      translations,
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};