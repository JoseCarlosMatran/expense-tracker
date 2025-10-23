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
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationKeys>(getTranslation(DEFAULT_LANGUAGE));
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;
    
    // Load saved language or detect browser language only after hydration
    const savedLanguage = localStorage.getItem('selectedLanguage') as SupportedLanguage;
    const initialLanguage = savedLanguage || detectBrowserLanguage();
    
    if (initialLanguage !== DEFAULT_LANGUAGE) {
      setLanguageState(initialLanguage);
      setTranslations(getTranslation(initialLanguage));
    }
  }, [isHydrated]);

  // Debug logs
  useEffect(() => {
    console.log('I18nContext - Current language:', language);
    console.log('I18nContext - Current translations keys:', Object.keys(translations));
  }, [language, translations]);

  const setLanguage = (lang: SupportedLanguage) => {
    console.log('I18nContext - Setting language to:', lang);
    setLanguageState(lang);
    setTranslations(getTranslation(lang));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', lang);
      document.documentElement.lang = lang;
      console.log('I18nContext - Language saved to localStorage and document updated');
    }
  };

  const t: TranslationFunction = (key, params) => {
    const keys = key.split('.');
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