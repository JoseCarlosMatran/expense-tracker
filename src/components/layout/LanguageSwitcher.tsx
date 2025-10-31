'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/locales';
import { useI18n } from '@/contexts/I18nContext';
import type { SupportedLanguage } from '@/types/i18n';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative text-sm">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 font-medium text-slate-200 shadow-sm transition hover:border-slate-500 hover:text-white"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{language}</span>
      </button>
      {isOpen ? (
        <div className="absolute right-0 mt-2 min-w-[180px] rounded-2xl border border-slate-800/80 bg-slate-900/95 p-2 shadow-xl">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-800/60 ${
                language === lang.code ? 'bg-slate-800/80 text-white' : 'text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                {lang.nativeName}
              </span>
              {language === lang.code && <span className="text-xs text-ggup-secondary">●</span>}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LanguageSwitcher;
