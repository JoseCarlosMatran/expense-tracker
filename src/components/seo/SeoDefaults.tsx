'use client';

import { DefaultSeo } from 'next-seo';

export const SeoDefaults = () => (
  <DefaultSeo
    titleTemplate="%s | GlobalGoods Up"
    defaultTitle="GlobalGoods Up"
    description="Automatizamos tu web en tiempo récord con IA generativa."
    additionalMetaTags={[
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      {
        name: 'theme-color',
        content: '#0f172a',
      },
    ]}
    additionalLinkTags={[
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ]}
    openGraph={{
      type: 'website',
      locale: 'es_ES',
      siteName: 'GlobalGoods Up',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://globalgoods-up.vercel.app'}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'GlobalGoods Up',
        },
      ],
    }}
    twitter={{
      handle: '@globalgoodsup',
      site: '@globalgoodsup',
      cardType: 'summary_large_image',
    }}
  />
);

export default SeoDefaults;
