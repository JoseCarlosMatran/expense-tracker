"use client";

import { Users, ShieldCheck, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

export default function AboutPage() {
  const { t, translations } = useI18n();
  const values = translations.about?.values as string[];
  const team = translations.about?.team as Array<{ name: string; role: string; bio: string }>;

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold text-white">{t('about.title')}</h1>
        <p className="text-lg text-slate-300">{t('about.mission')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[{
          icon: ShieldCheck,
          title: values?.[0] ?? '',
        }, {
          icon: Timer,
          title: values?.[1] ?? '',
        }, {
          icon: Users,
          title: values?.[2] ?? '',
        }].map(({ icon: Icon, title }, index) => (
          <motion.div
            key={title}
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/60 text-ggup-secondary">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-300">{title}</p>
          </motion.div>
        ))}
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">{t('about.teamTitle')}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {team?.map(member => (
            <div key={member.name} className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-white">{member.name}</h3>
              <p className="text-sm uppercase tracking-wide text-ggup-secondary">{member.role}</p>
              <p className="mt-3 text-sm text-slate-300">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
