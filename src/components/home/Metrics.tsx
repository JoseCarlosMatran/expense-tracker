"use client";

import { motion } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

const metrics = [
  { key: 'metrics.automation', value: '320+' },
  { key: 'metrics.roi', value: '218%' },
  { key: 'metrics.timeSaved', value: '12k' },
  { key: 'metrics.satisfaction', value: '4.95/5' },
];

export const Metrics = () => {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-5xl px-6">
      <div className="grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-900/40 p-8 shadow-glass backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            className="space-y-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <p className="text-sm uppercase tracking-wide text-slate-400">{t(metric.key)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Metrics;
