"use client";

import { BrainCircuit, Bot, ChartBarDecreasing, FileText, Network, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

const icons = {
  automation: BrainCircuit,
  web: Network,
  chatbots: Bot,
  analytics: ChartBarDecreasing,
  accounting: FileText,
  software: Server,
} as const;

export default function ServicesPage() {
  const { t, translations } = useI18n();
  const servicesTranslations = translations.services?.items as Record<
    keyof typeof icons,
    { title: string; description: string }
  >;
  const services = Object.entries(icons).map(([key, Icon]) => ({
    key,
    Icon,
    title: servicesTranslations?.[key as keyof typeof icons]?.title ?? '',
    description: servicesTranslations?.[key as keyof typeof icons]?.description ?? '',
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-white">{t('services.title')}</h1>
        <p className="text-lg text-slate-300">{t('services.subtitle')}</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {services.map(({ key, Icon, title, description }, index) => (
          <motion.article
            key={key}
            className="glass-panel relative overflow-hidden p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/20 to-purple-500/20 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 text-ggup-secondary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm text-slate-300">{description}</p>
              <ul className="mt-6 grid gap-2 text-sm text-slate-400">
                <li className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                  • Diagnóstico express y roadmap de 30 días
                </li>
                <li className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                  • Integraciones con tus herramientas actuales
                </li>
                <li className="rounded-2xl border border-slate-800/60 bg-slate-900/50 px-4 py-3">
                  • Métricas en tiempo real y documentación completa
                </li>
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
