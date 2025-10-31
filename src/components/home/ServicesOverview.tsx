"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrainCircuit, Bot, ChartBarDecreasing, FileText, Network, Server } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const icons = {
  automation: BrainCircuit,
  web: Network,
  chatbots: Bot,
  analytics: ChartBarDecreasing,
  accounting: FileText,
  software: Server,
} as const;

export const ServicesOverview = () => {
  const { t } = useI18n();

  const services = Object.entries(icons).map(([key, Icon]) => ({
    key: key as keyof typeof icons,
    Icon,
    title: t(`services.items.${key}.title`),
    description: t(`services.items.${key}.description`),
  }));

  return (
    <section className="mx-auto mt-24 max-w-6xl px-6">
      <div className="mb-12 flex flex-col gap-4 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t('services.title')}</h2>
        <p className="text-base text-slate-300 sm:text-lg">{t('services.subtitle')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map(({ key, Icon, title, description }, index) => (
          <motion.div
            key={key}
            className="glass-panel relative overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/40 via-sky-500/40 to-purple-500/40 blur-3xl" />
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/80 text-ggup-secondary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
            <Link
              href="/servicios"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ggup-secondary transition hover:text-white"
            >
              {t('app.ctaSecondary')}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesOverview;
