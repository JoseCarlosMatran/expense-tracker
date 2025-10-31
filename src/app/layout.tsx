import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import Providers from './providers';
import './globals.css';
import { detectLanguageFromHeader } from '@/locales';
import type { SupportedLanguage } from '@/types/i18n';
import { SeoDefaults } from '@/components/seo/SeoDefaults';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GlobalGoods Up | Automatización con IA para negocios',
  description:
    'GlobalGoods Up crea soluciones SaaS impulsadas por IA generativa: automatizaciones, sitios web, chatbots y analítica de datos para escalar tu negocio.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://globalgoods-up.vercel.app'),
  keywords: [
    'automatización con IA',
    'IA generativa',
    'chatbots para empresas',
    'servicios de automatización',
    'SaaS con inteligencia artificial',
  ],
  openGraph: {
    title: 'GlobalGoods Up | Automatizamos tu web en tiempo récord con IA generativa',
    description:
      'Servicios de automatización y desarrollo de productos digitales con IA generativa. Escala tu negocio con soluciones inteligentes.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://globalgoods-up.vercel.app',
    siteName: 'GlobalGoods Up',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@globalgoodsup',
    title: 'GlobalGoods Up',
    description: 'Automatizamos tu web en tiempo récord con IA generativa.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = headers().get('accept-language');
  const initialLanguage: SupportedLanguage = detectLanguageFromHeader(acceptLanguage);

  return (
    <html lang={initialLanguage} suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased`} suppressHydrationWarning>
        <SeoDefaults />
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
    </html>
  );
}
