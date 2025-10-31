"use client";

import ContactForm from '@/components/contact/ContactForm';
import ChatbotWidget from '@/components/contact/ChatbotWidget';
import { useI18n } from '@/contexts/I18nContext';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-semibold text-white">{t('contact.title')}</h1>
        <p className="mt-4 text-lg text-slate-300">{t('contact.subtitle')}</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <ContactForm />
        <ChatbotWidget />
      </div>
    </div>
  );
}
