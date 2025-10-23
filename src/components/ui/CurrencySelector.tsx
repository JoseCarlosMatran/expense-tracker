'use client';

import React, { useState } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { Currency, CURRENCIES, POPULAR_CURRENCIES } from '@/types/currency';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  className?: string;
  showPopular?: boolean;
  showSearch?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ 
  className = '',
  showPopular = true,
  showSearch = false
}) => {
  const { currency, setCurrency, currencyFlag } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentCurrency = CURRENCIES.find(c => c.code === currency);
  
  const filteredCurrencies = CURRENCIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.countries.some(country => country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const popularCurrencies = CURRENCIES.filter(c => POPULAR_CURRENCIES.includes(c.code));
  const otherCurrencies = filteredCurrencies.filter(c => !POPULAR_CURRENCIES.includes(c.code));

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-left flex items-center justify-between hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{currencyFlag}</span>
          <div>
            <div className="font-semibold text-slate-900">{currency}</div>
            <div className="text-sm text-slate-500">{currentCurrency?.name}</div>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden">
            {showSearch && (
              <div className="p-3 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search currencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            <div className="max-h-60 overflow-y-auto">
              {showPopular && searchTerm === '' && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    Popular
                  </div>
                  {popularCurrencies.map((curr) => (
                    <CurrencyOption
                      key={`popular-${curr.code}`}
                      currency={curr}
                      isSelected={curr.code === currency}
                      onSelect={() => handleCurrencyChange(curr.code)}
                    />
                  ))}
                  <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                    All Currencies
                  </div>
                </>
              )}
              
              {(searchTerm === '' ? otherCurrencies : filteredCurrencies).map((curr) => (
                <CurrencyOption
                  key={curr.code}
                  currency={curr}
                  isSelected={curr.code === currency}
                  onSelect={() => handleCurrencyChange(curr.code)}
                />
              ))}
              
              {filteredCurrencies.length === 0 && searchTerm && (
                <div className="px-4 py-8 text-center text-slate-500">
                  No currencies found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface CurrencyOptionProps {
  currency: Currency;
  isSelected: boolean;
  onSelect: () => void;
}

const CurrencyOption: React.FC<CurrencyOptionProps> = ({ currency, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{currency.flag}</span>
        <div>
          <div className="font-medium text-slate-900">{currency.code}</div>
          <div className="text-sm text-slate-500">
            {currency.name}
            {currency.countries.length > 1 && (
              <span className="ml-1">• {currency.countries.length} countries</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-400">{currency.symbol}</span>
        {isSelected && (
          <Check className="h-5 w-5 text-blue-600" />
        )}
      </div>
    </button>
  );
};

export default CurrencySelector;