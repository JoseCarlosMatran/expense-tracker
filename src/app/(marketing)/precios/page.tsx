"use client";

import CheckoutButton from '@/components/pricing/CheckoutButton';
import { useI18n } from '@/contexts/I18nContext';

const plans: Array<{
  key: 'starter' | 'growth' | 'enterprise';
  plan: 'launch' | 'scale' | 'enterprise';
}> = [
  { key: 'starter', plan: 'launch' },
  { key: 'growth', plan: 'scale' },
  { key: 'enterprise', plan: 'enterprise' },
];

export default function PricingPage() {
  const { t, translations } = useI18n();
  const planTranslations = translations.pricing?.plans as Record<
    (typeof plans)[number]['key'],
    { name: string; price: string; period: string; description: string; features: string[] }
  >;

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-white">{t('pricing.title')}</h1>
        <p className="text-lg text-slate-300">{t('pricing.subtitle')}</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map(({ key, plan }) => {
          const planData = planTranslations?.[key] ?? {
            name: key,
            price: '',
            period: '',
            description: '',
            features: [],
          };

          return (
            <div key={key} className="glass-panel flex h-full flex-col justify-between p-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{planData.name}</h2>
                  <p className="mt-2 text-sm text-slate-300">{planData.description}</p>
                </div>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-bold">{planData.price}</span>
                  {planData.period ? <span className="text-sm text-slate-400">{planData.period}</span> : null}
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  {planData.features.map(feature => (
                    <li key={feature} className="rounded-2xl border border-slate-800/50 bg-slate-900/60 px-4 py-3">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <CheckoutButton plan={plan} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
