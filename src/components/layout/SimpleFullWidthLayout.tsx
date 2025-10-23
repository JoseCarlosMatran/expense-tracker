'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Home, Calendar, BarChart3, Settings, Plus, PieChart, CreditCard } from 'lucide-react';
import BottomTabs from '@/components/navigation/BottomTabs';

interface SimpleFullWidthLayoutProps {
  children: React.ReactNode;
}

const SimpleFullWidthLayout: React.FC<SimpleFullWidthLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Expenses', href: '/diary', icon: CreditCard },
    { name: 'Add Expense', href: '/add', icon: Plus },
    { name: 'Analytics', href: '/progress', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: 'none',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)',
      backgroundImage: `
        url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.03' fill='%234a7c59'%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3Ccircle cx='150' cy='50' r='3'/%3E%3Ccircle cx='50' cy='150' r='3'/%3E%3Ccircle cx='150' cy='150' r='3'/%3E%3Cpath d='M20,60 L40,40 L60,80 L80,20 L100,60 L120,40 L140,70 L160,30 L180,60' stroke='%23d4af37' stroke-width='1' fill='none'/%3E%3Crect x='30' y='120' width='8' height='40' fill='%232d5a3d'/%3E%3Crect x='50' y='110' width='8' height='50' fill='%232d5a3d'/%3E%3Crect x='70' y='130' width='8' height='30' fill='%232d5a3d'/%3E%3Crect x='90' y='105' width='8' height='55' fill='%232d5a3d'/%3E%3C/g%3E%3C/svg%3E"),
        url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.02' fill='none' stroke='%23d4af37' stroke-width='1'%3E%3Ccircle cx='150' cy='150' r='80'/%3E%3Cpath d='M100,100 Q150,120 200,100 T300,120' /%3E%3Cpath d='M50,200 L100,180 L150,210 L200,170 L250,200' /%3E%3C/g%3E%3C/svg%3E")
      `,
      backgroundSize: '400px 400px, 600px 600px',
      backgroundPosition: '0 0, 200px 200px',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #2d5a3d 0%, #4a7c59 100%)',
        borderBottom: '2px solid #d4af37',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(45, 90, 61, 0.3)'
      }}>
        <div style={{
          width: '100%',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleMenu}
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#d4af37',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Menu size={24} />
            </button>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#d4af37',
              margin: 0
            }}>
              FinanceTracker Pro
            </h1>
          </div>
          
          <div style={{ display: 'none', alignItems: 'center', gap: '24px' }}>
            <Link 
              href="/add" 
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
                color: '#2d5a3d',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={16} />
              Add Expense
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex'
        }}>
          <div 
            onClick={closeMenu}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          />
          
          <div style={{
            position: 'relative',
            width: '320px',
            height: '100%',
            background: '#2d5a3d',
            boxShadow: '0 10px 50px rgba(45, 90, 61, 0.5)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid #4a7c59'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                margin: 0
              }}>Menu</h2>
              <button
                onClick={closeMenu}
                style={{
                  color: 'white',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <nav style={{ flex: 1, padding: '24px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          color: isActive ? '#2d5a3d' : 'rgba(255, 255, 255, 0.8)',
                          background: isActive ? 'linear-gradient(135deg, #d4af37, #ffd700)' : 'transparent',
                          textDecoration: 'none',
                          fontWeight: isActive ? '600' : '400',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content - FORCED FULL WIDTH */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        width: '100vw',
        maxWidth: 'none',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'none',
          padding: '24px'
        }}>
          {children}
        </div>
      </main>

      {/* Mobile FAB */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 40,
        display: 'block'
      }}>
        <Link 
          href="/add" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
            color: '#2d5a3d',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.5)',
            transition: 'all 0.3s'
          }}
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Navigation Tabs */}
      <BottomTabs />
    </div>
  );
};

export default SimpleFullWidthLayout;