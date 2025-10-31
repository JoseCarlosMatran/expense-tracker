"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 animate-aurora bg-[length:200%_200%] bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-purple-500/20" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 lg:flex-row lg:items-center">
        <motion.div
          className="max-w-2xl space-y-8"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" /> SaaS + Generative AI
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-slate-300 sm:text-xl">{t('hero.subtitle')}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="ggup-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-950 shadow-glow transition hover:scale-[1.02]"
            >
              {t('hero.primaryCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/precios"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700/60 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              {t('hero.secondaryCta')}
            </Link>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{t('hero.trustedBy')}</p>
        </motion.div>
        <motion.div
          className="glass-panel relative flex flex-1 flex-col gap-6 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <div className="absolute -top-10 right-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 blur-3xl" />
          <h3 className="text-lg font-semibold text-white">IA generativa operativa</h3>
          <p className="text-sm text-slate-300">
            Generamos pipelines completos conectados a tu stack actual: CRM, ERP, marketing automation y sistemas financieros.
          </p>
          <div className="grid gap-4">
            {[{
              title: 'Playbooks inteligentes',
              description: 'Automatizamos onboarding, ventas y soporte con agentes coordinados.',
            }, {
              title: 'Compliance integrado',
              description: 'Modelos auditables con trazabilidad completa y controles de acceso.',
            }, {
              title: 'Entrega continua',
              description: 'Sprints semanales con métricas de ROI y experimentación controlada.',
            }].map(item => (
              <div key={item.title} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
