'use client';

import { ReactNode, useMemo } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import { I18nProvider } from '@/contexts/I18nContext';
import type { SupportedLanguage } from '@/types/i18n';

interface ProvidersProps {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
  initialSession?: Session | null;
}

export const Providers = ({ children, initialLanguage, initialSession = null }: ProvidersProps) => {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      <I18nProvider initialLanguage={initialLanguage}>{children}</I18nProvider>
    </SessionContextProvider>
  );
};

export default Providers;
