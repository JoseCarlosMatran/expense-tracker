'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Receipt, 
  BarChart3, 
  Building2,
  X,
  TrendingUp,
  Wallet,
  Calendar,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      description: 'Daily Progress'
    },
    { 
      name: 'Daily Diary', 
      href: '/diary', 
      icon: Calendar,
      description: 'Track Daily Expenses'
    },
    { 
      name: 'Add Expense', 
      href: '/add', 
      icon: PlusCircle,
      description: 'Quick Entry'
    },
    { 
      name: 'Transactions', 
      href: '/expenses', 
      icon: Receipt,
      description: 'View & Manage'
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: BarChart3,
      description: 'AI Insights'
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 xl:w-80 2xl:w-96 financial-gradient transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-financial-lg',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FinanceTracker</h1>
                <p className="text-xs text-white/70 -mt-1">Professional</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>

          {/* Stats Summary */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-medium text-white/80">Balance</span>
                </div>
                <p className="text-lg font-bold text-white mt-1">$2,847</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-blue-300" />
                  <span className="text-xs font-medium text-white/80">Monthly</span>
                </div>
                <p className="text-lg font-bold text-white mt-1">$1,234</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4 px-2">
              Navigation
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden',
                    isActive
                      ? 'bg-white text-slate-900 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-white/70 group-hover:text-white'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium truncate',
                      isActive ? 'text-slate-900' : ''
                    )}>
                      {item.name}
                    </div>
                    <div className={cn(
                      'text-xs truncate mt-0.5',
                      isActive ? 'text-slate-600' : 'text-white/60 group-hover:text-white/80'
                    )}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="text-xs text-white/60">
              <p className="font-medium">Finance Tracker Pro</p>
              <p className="mt-1">Professional Edition v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;