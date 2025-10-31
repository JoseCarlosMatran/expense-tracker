'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '@/contexts/I18nContext';
import LanguageSwitcher from './LanguageSwitcher';

const marketingLinks = [
  { href: '/', key: 'navigation.home' },
  { href: '/servicios', key: 'navigation.services' },
  { href: '/precios', key: 'navigation.pricing' },
  { href: '/sobre-nosotros', key: 'navigation.about' },
  { href: '/blog', key: 'navigation.blog' },
  { href: '/contacto', key: 'navigation.contact' },
];

const appLinks = [
  { href: '/panel', key: 'navigation.dashboard' },
  { href: '/admin', key: 'navigation.admin' },
];

export const MainHeader = () => {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const renderLink = (href: string, label: string) => {
    const isActive = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={clsx(
          'rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-white',
          isActive ? 'text-white' : 'text-slate-300'
        )}
        onClick={() => setIsOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-purple-500 text-lg font-bold shadow-lg">
            GG
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-xl font-semibold tracking-tight">GlobalGoods Up</span>
            <span className="text-xs text-slate-400">{t('app.shortDescription')}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {marketingLinks.map(link => renderLink(link.href, t(link.key)))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          {appLinks.map(link => renderLink(link.href, t(link.key)))}
          <Link
            href="/precios"
            className="ggup-gradient inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-slate-950 shadow-glow transition hover:scale-[1.02] hover:shadow-ggup"
          >
            {t('navigation.getStarted')}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/70 text-white md:hidden"
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="md:hidden">
          <div className="mx-6 mb-6 space-y-4 rounded-3xl border border-slate-800/80 bg-slate-900/90 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              <Link
                href="/precios"
                className="ggup-gradient inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow"
                onClick={() => setIsOpen(false)}
              >
                {t('navigation.getStarted')}
              </Link>
            </div>
            <div className="grid gap-3">
              {marketingLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-transparent bg-slate-800/40 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-ggup-border"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
            <div className="grid gap-3">
              {appLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-slate-800/60 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-ggup-border hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default MainHeader;
