'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Home, Calendar, BarChart3, Settings, Plus, PieChart, CreditCard } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface NewFinanceLayoutProps {
  children: React.ReactNode;
}

const NewFinanceLayout: React.FC<NewFinanceLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      key: 'home'
    },
    {
      name: 'Expenses',
      href: '/diary',
      icon: CreditCard,
      key: 'expenses'
    },
    {
      name: 'Add Expense',
      href: '/add',
      icon: Plus,
      key: 'add'
    },
    {
      name: 'Analytics',
      href: '/progress',
      icon: BarChart3,
      key: 'analytics'
    },
    {
      name: 'Reports',
      href: '/analytics',
      icon: PieChart,
      key: 'reports'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      key: 'settings'
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen finance-bg" style={{width: '100vw', maxWidth: 'none', overflowX: 'hidden'}}>
      {/* Background overlay */}
      <div className="fixed inset-0 finance-overlay pointer-events-none z-0" />
      
      {/* Header */}
      <header className="finance-header sticky top-0 z-50 shadow-lg">
        <div className="w-full px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleMenu}
                className="finance-menu-btn"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-finance-gold-primary">
                FinanceTracker Pro
              </h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/add" className="finance-btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${
        isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div className={`absolute left-0 top-0 h-full w-80 bg-finance-green-primary shadow-2xl transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-finance-green-secondary">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <button
                onClick={closeMenu}
                className="text-white hover:text-finance-gold-primary transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-6">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`finance-nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content - FULL WIDTH FORCE */}
      <main className="relative z-10 w-screen min-h-screen" style={{width: '100vw', maxWidth: 'none'}}>
        <div className="w-full px-4 lg:px-8 py-6" style={{width: '100%', maxWidth: 'none'}}>
          <div className="w-full" style={{width: '100%', maxWidth: 'none'}}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Link href="/add" className="finance-fab">
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default NewFinanceLayout;