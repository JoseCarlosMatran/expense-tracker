"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export const CTASection = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto mt-28 max-w-5xl px-6">
      <motion.div
        className="ggup-gradient-accent relative overflow-hidden rounded-3xl p-10 text-slate-50 shadow-glow"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <h3 className="text-2xl font-semibold text-white">{t('contact.title')}</h3>
            <p className="text-base text-white/80">{t('contact.subtitle')}</p>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02]"
          >
            <CalendarCheck className="h-5 w-5" />
            {t('app.cta')}
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
