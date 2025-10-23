'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, BarChart3, Settings, Plus } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface ArkmLayoutProps {
  children: React.ReactNode;
}

const ArkmLayout: React.FC<ArkmLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { t } = useI18n();

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/',
      icon: Home,
    },
    {
      name: t('navigation.expenses'),
      href: '/expenses',
      icon: Calendar,
    },
    {
      name: t('navigation.add'),
      href: '/add',
      icon: Plus,
      isSpecial: true,
    },
    {
      name: t('navigation.progress'),
      href: '/progress',
      icon: BarChart3,
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="arkm-layout">
      {/* Header - Clean and Professional */}
      <header className="arkm-header sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{background: 'var(--gradient-primary)'}}>
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <h1 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>
              {t('app.name')}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="arkm-main">
        <div className="arkm-container">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - Modern Style */}
      <nav className="arkm-bottom-nav">
        <div className="flex justify-around items-center py-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const isSpecial = item.isSpecial;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div className={`
                  arkm-bottom-nav-item
                  ${isActive ? 'active' : ''}
                  ${isSpecial ? 'special' : ''}
                `}>
                  {isSpecial ? (
                    <div className="arkm-special-btn">
                      <Icon size={24} color="white" />
                    </div>
                  ) : (
                    <Icon 
                      size={24} 
                      color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} 
                    />
                  )}
                  <span className={isSpecial ? 'special-label' : ''}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <style jsx>{`
        .arkm-layout {
          min-height: 100vh;
          background: var(--gradient-bg);
          display: flex;
          flex-direction: column;
        }

        .arkm-header {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--glass-border);
        }

        .arkm-main {
          flex: 1;
          padding-bottom: 100px;
          overflow-y: auto;
        }

        .arkm-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .arkm-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--glass-border);
          box-shadow: var(--shadow-lg);
        }

        .arkm-bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          min-width: 60px;
        }

        .arkm-bottom-nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .arkm-bottom-nav-item.active {
          color: var(--accent-primary);
          background: rgba(var(--accent-primary), 0.1);
        }

        .arkm-special-btn {
          background: var(--gradient-primary);
          border-radius: 50%;
          padding: 12px;
          margin-top: -24px;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s ease;
        }

        .arkm-special-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
        }

        .special-label {
          color: var(--accent-primary);
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .arkm-container {
            padding: 16px 12px;
          }
          
          .arkm-bottom-nav-item {
            font-size: 0.7rem;
            padding: 6px 8px;
            min-width: 50px;
          }
        }
      `}</style>
    </div>
  );
};

export default ArkmLayout;