'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Currency, DEFAULT_CURRENCY, CURRENCIES, formatCurrency, formatCurrencyCompact, getCurrencySymbol, getCurrencyFlag, detectUserCurrency } from '@/types/currency';
import { useHydration } from '@/hooks/useHydration';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatAmount: (amount: number) => string;
  formatAmountCompact: (amount: number) => string;
  getCurrencyInfo: () => Currency | undefined;
  currencySymbol: string;
  currencyFlag: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);
  const isHydrated = useHydration();

  useEffect(() => {
    if (!isHydrated) return;
    
    // Load saved currency from localStorage or detect user currency only after hydration
    const savedCurrency = localStorage.getItem('expense-tracker-currency');
    const initialCurrency = savedCurrency || detectUserCurrency();
    if (initialCurrency !== DEFAULT_CURRENCY) {
      setCurrencyState(initialCurrency);
    }
  }, [isHydrated]);

  // Debug logs
  useEffect(() => {
    console.log('CurrencyContext - Current currency:', currency);
  }, [currency]);

  const setCurrency = (newCurrency: string) => {
    console.log('CurrencyContext - Setting currency to:', newCurrency);
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('expense-tracker-currency', newCurrency);
      console.log('CurrencyContext - Currency saved to localStorage');
    }
  };

  const formatAmount = (amount: number): string => {
    return formatCurrency(amount, currency);
  };

  const formatAmountCompact = (amount: number): string => {
    return formatCurrencyCompact(amount, currency);
  };

  const getCurrencyInfo = (): Currency | undefined => {
    return CURRENCIES.find(c => c.code === currency);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatAmount,
      formatAmountCompact,
      getCurrencyInfo,
      currencySymbol: getCurrencySymbol(currency),
      currencyFlag: getCurrencyFlag(currency)
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};