'use client';

import React from 'react';
import { Menu, Building2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CurrencySelector from '@/components/ui/CurrencySelector';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="backdrop-blur-financial border-b border-slate-200/50 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden mr-1 p-2 border-slate-200 hover:bg-slate-50"
          >
            <Menu className="h-5 w-5 text-slate-600" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="w-8 h-8 rounded-lg financial-accent-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                FinanceTracker
              </h1>
              <p className="text-xs text-slate-500 -mt-1">Pro</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-slate-600 font-medium">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          
          <div className="w-px h-6 bg-slate-200 hidden sm:block" />
          
          <CurrencySelector />
        </div>
      </div>
    </header>
  );
};

export default Header;