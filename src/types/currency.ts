export interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
  flag: string;
  countries: string[];
  symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Currency[] = [
  { 
    code: 'USD', 
    name: 'US Dollar', 
    symbol: '$', 
    locale: 'en-US',
    flag: '🇺🇸',
    countries: ['United States'],
    symbolPosition: 'before'
  },
  { 
    code: 'EUR', 
    name: 'Euro', 
    symbol: '€', 
    locale: 'de-DE',
    flag: '🇪🇺',
    countries: ['Germany', 'France', 'Italy', 'Spain', 'Netherlands'],
    symbolPosition: 'after'
  },
  { 
    code: 'GBP', 
    name: 'British Pound', 
    symbol: '£', 
    locale: 'en-GB',
    flag: '🇬🇧',
    countries: ['United Kingdom'],
    symbolPosition: 'before'
  },
  { 
    code: 'MXN', 
    name: 'Mexican Peso', 
    symbol: '$', 
    locale: 'es-MX',
    flag: '🇲🇽',
    countries: ['Mexico'],
    symbolPosition: 'before'
  },
  { 
    code: 'CAD', 
    name: 'Canadian Dollar', 
    symbol: 'C$', 
    locale: 'en-CA',
    flag: '🇨🇦',
    countries: ['Canada'],
    symbolPosition: 'before'
  },
  { 
    code: 'JPY', 
    name: 'Japanese Yen', 
    symbol: '¥', 
    locale: 'ja-JP',
    flag: '🇯🇵',
    countries: ['Japan'],
    symbolPosition: 'before'
  },
  { 
    code: 'AUD', 
    name: 'Australian Dollar', 
    symbol: 'A$', 
    locale: 'en-AU',
    flag: '🇦🇺',
    countries: ['Australia'],
    symbolPosition: 'before'
  },
  { 
    code: 'CHF', 
    name: 'Swiss Franc', 
    symbol: 'CHF', 
    locale: 'de-CH',
    flag: '🇨🇭',
    countries: ['Switzerland'],
    symbolPosition: 'after'
  },
  { 
    code: 'BRL', 
    name: 'Brazilian Real', 
    symbol: 'R$', 
    locale: 'pt-BR',
    flag: '🇧🇷',
    countries: ['Brazil'],
    symbolPosition: 'before'
  },
  { 
    code: 'CNY', 
    name: 'Chinese Yuan', 
    symbol: '¥', 
    locale: 'zh-CN',
    flag: '🇨🇳',
    countries: ['China'],
    symbolPosition: 'before'
  },
  { 
    code: 'INR', 
    name: 'Indian Rupee', 
    symbol: '₹', 
    locale: 'en-IN',
    flag: '🇮🇳',
    countries: ['India'],
    symbolPosition: 'before'
  },
  { 
    code: 'KRW', 
    name: 'South Korean Won', 
    symbol: '₩', 
    locale: 'ko-KR',
    flag: '🇰🇷',
    countries: ['South Korea'],
    symbolPosition: 'before'
  },
];

export const DEFAULT_CURRENCY = 'USD';

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${amount}`;
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(amount);
};

export const formatCurrencyCompact = (amount: number, currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `${amount}`;
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || currencyCode;
};

export const getCurrencyFlag = (currencyCode: string): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.flag || '💱';
};

export const detectUserCurrency = (): string => {
  if (typeof window === 'undefined') return DEFAULT_CURRENCY;
  
  try {
    const locale = navigator.language;
    const currency = CURRENCIES.find(c => c.locale === locale);
    return currency?.code || DEFAULT_CURRENCY;
  } catch {
    return DEFAULT_CURRENCY;
  }
};

export const getCurrencyByCountry = (countryCode: string): Currency | undefined => {
  const countryToCurrency: Record<string, string> = {
    'US': 'USD',
    'CA': 'CAD',
    'GB': 'GBP',
    'EU': 'EUR',
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'JP': 'JPY',
    'AU': 'AUD',
    'CH': 'CHF',
    'MX': 'MXN',
    'BR': 'BRL',
    'CN': 'CNY',
    'IN': 'INR',
    'KR': 'KRW',
  };
  
  const currencyCode = countryToCurrency[countryCode];
  return CURRENCIES.find(c => c.code === currencyCode);
};