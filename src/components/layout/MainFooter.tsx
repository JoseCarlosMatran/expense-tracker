'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export const MainFooter = () => {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-slate-800/60 bg-slate-950/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 text-lg font-bold text-white shadow-lg">
            GG
          </div>
          <p className="text-sm text-slate-400">{t('app.metaDescription')}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t('navigation.services')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/servicios" className="transition hover:text-white">{t('services.items.automation.title')}</Link></li>
            <li><Link href="/servicios" className="transition hover:text-white">{t('services.items.web.title')}</Link></li>
            <li><Link href="/servicios" className="transition hover:text-white">{t('services.items.chatbots.title')}</Link></li>
            <li><Link href="/servicios" className="transition hover:text-white">{t('services.items.analytics.title')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">{t('navigation.pricing')}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href="/precios" className="transition hover:text-white">Launch</Link></li>
            <li><Link href="/precios" className="transition hover:text-white">Scale</Link></li>
            <li><Link href="/precios" className="transition hover:text-white">Enterprise</Link></li>
          </ul>
        </div>
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><a href="mailto:contacto@globalgoodsup.com" className="hover:text-white">contacto@globalgoodsup.com</a></div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><a href="tel:+34600000000" className="hover:text-white">+34 600 000 000</a></div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Madrid · Ciudad de México · Miami</span></div>
        </div>
      </div>
      <div className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-600">
        © {year} GlobalGoods Up. All rights reserved.
      </div>
    </footer>
  );
};

export default MainFooter;
