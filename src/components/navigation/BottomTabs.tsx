'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, BarChart3, TrendingUp, Settings } from 'lucide-react';

const BottomTabs: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/expenses', label: 'Expenses', icon: BarChart3 },
    { href: '/add', label: 'Add', icon: Plus, isSpecial: true },
    { href: '/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind tabs */}
      <div style={{ height: '80px' }} />
      
      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--finance-card-bg, rgba(255, 255, 255, 0.95))',
        borderTop: '1px solid var(--finance-border, rgba(45, 90, 61, 0.1))',
        backdropFilter: 'blur(10px)',
        padding: '8px 0',
        zIndex: 1000,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: tab.isSpecial ? '8px' : '12px 8px',
                  minWidth: '60px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  background: tab.isSpecial 
                    ? 'linear-gradient(135deg, var(--finance-gold-primary, #d4af37) 0%, #ffd700 100%)'
                    : 'transparent',
                  borderRadius: tab.isSpecial ? '50%' : '8px',
                  transform: tab.isSpecial ? 'translateY(-8px)' : 'none',
                  boxShadow: tab.isSpecial 
                    ? '0 4px 12px rgba(212, 175, 55, 0.3)' 
                    : 'none',
                  width: tab.isSpecial ? '56px' : 'auto',
                  height: tab.isSpecial ? '56px' : 'auto',
                }}
              >
                <Icon 
                  size={tab.isSpecial ? 24 : 20} 
                  style={{ 
                    color: tab.isSpecial 
                      ? 'var(--finance-text-primary, #2d5a3d)'
                      : active 
                        ? 'var(--finance-green-primary, #2d5a3d)' 
                        : 'var(--finance-text-secondary, #4a7c59)',
                    marginBottom: tab.isSpecial ? 0 : '4px'
                  }} 
                />
                {!tab.isSpecial && (
                  <span style={{
                    fontSize: '12px',
                    fontWeight: active ? '600' : '400',
                    color: active 
                      ? 'var(--finance-green-primary, #2d5a3d)' 
                      : 'var(--finance-text-secondary, #4a7c59)',
                  }}>
                    {tab.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default BottomTabs;