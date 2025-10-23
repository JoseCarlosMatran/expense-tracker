'use client';

import React, { useState, useEffect } from 'react';
import { User, Target, Globe, Palette, Bell, HelpCircle, LogOut, Edit, Save, X, Check, DollarSign } from 'lucide-react';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserProfile } from '@/types/daily-tracker';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import RadioGroup from '@/components/ui/RadioGroup';
import ThemeSelector from '@/components/themes/ThemeSelector';
import { getCurrencySymbol, getCurrencyFlag, CURRENCIES } from '@/types/currency';

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const { formatAmount, currency, setCurrency } = useCurrency();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(false);
  const [editingTheme, setEditingTheme] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [tempBudget, setTempBudget] = useState('');
  const [tempLanguage, setTempLanguage] = useState(language || 'en');
  const [tempTheme, setTempTheme] = useState(theme || 'light');
  const [editingCurrency, setEditingCurrency] = useState(false);
  const [tempCurrency, setTempCurrency] = useState(currency || 'USD');
  const [editingNotifications, setEditingNotifications] = useState(false);
  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    dailyReminders: false,
    weeklyReports: true,
  });

  useEffect(() => {
    const userProfile = dailyTrackerService.getUserProfile();
    setProfile(userProfile);
    
    // Load saved notifications
    if (typeof window !== 'undefined') {
      const savedNotifications = localStorage.getItem('expense-tracker-notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }
    
    // Initialize temp values with current values
    setTempLanguage(language || 'en');
    setTempCurrency(currency || 'USD');
    setTempTheme(theme || 'light');
    
    setIsLoading(false);
  }, [language, currency, theme]);

  // Debug logging
  useEffect(() => {
    console.log('Settings - Current values:', { language, currency, theme });
  }, [language, currency, theme]);

  const handleUpdateProfile = () => {
    setEditingProfile(true);
    setTempProfile(profile ? { ...profile } : null);
  };

  const handleSaveProfile = () => {
    if (tempProfile) {
      dailyTrackerService.saveUserProfile(tempProfile);
      setProfile(tempProfile);
    }
    setEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setTempProfile(null);
    setEditingProfile(false);
  };

  const handleUpdateBudget = () => {
    setEditingBudget(true);
    setTempBudget(profile?.dailyLimit.toString() || '');
  };

  const handleSaveBudget = () => {
    if (profile && tempBudget && !isNaN(Number(tempBudget))) {
      const updatedProfile = { ...profile, dailyLimit: Number(tempBudget) };
      dailyTrackerService.saveUserProfile(updatedProfile);
      setProfile(updatedProfile);
    }
    setEditingBudget(false);
  };

  const handleCancelBudget = () => {
    setTempBudget('');
    setEditingBudget(false);
  };

  const handleUpdateLanguage = () => {
    setEditingLanguage(true);
  };

  const handleSaveLanguage = () => {
    console.log('Changing language to:', tempLanguage);
    setLanguage(tempLanguage as 'en' | 'es');
    setEditingLanguage(false);
  };

  const handleCancelLanguage = () => {
    setTempLanguage(language || 'en');
    setEditingLanguage(false);
  };

  const handleUpdateTheme = () => {
    setEditingTheme(true);
  };

  const handleSaveTheme = () => {
    console.log('Saving theme:', tempTheme);
    setTheme(tempTheme as 'light' | 'dark' | 'blue');
    setEditingTheme(false);
  };

  const handleCancelTheme = () => {
    setTempTheme(theme || 'light');
    setEditingTheme(false);
  };

  const handleUpdateCurrency = () => {
    setEditingCurrency(true);
  };

  const handleSaveCurrency = () => {
    console.log('Changing currency to:', tempCurrency);
    setCurrency(tempCurrency);
    setEditingCurrency(false);
  };

  const handleCancelCurrency = () => {
    setTempCurrency(currency || 'USD');
    setEditingCurrency(false);
  };

  const handleUpdateNotifications = () => {
    setEditingNotifications(true);
  };

  const handleSaveNotifications = () => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('expense-tracker-notifications', JSON.stringify(notifications));
    }
    setEditingNotifications(false);
  };

  const handleCancelNotifications = () => {
    // Reset from localStorage or defaults
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('expense-tracker-notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    }
    setEditingNotifications(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  const getLanguageDisplay = (lang: string) => {
    switch (lang) {
      case 'es': return 'Español';
      case 'en': return 'English (US)';
      default: return 'English (US)';
    }
  };

  const getThemeDisplay = (theme: string) => {
    switch (theme) {
      case 'dark': return '🌙 Dark Mode';
      case 'blue': return '💙 Professional Blue';
      case 'light': return '☀️ Light Mode';
      default: return '☀️ Light Mode';
    }
  };

  const menuItems = [
    {
      icon: User,
      title: t('settings.profile.title'),
      subtitle: profile ? `${t('settings.profile.monthlyIncome')}: ${profile.monthlyIncome}` : t('settings.profile.setupPrompt'),
      action: handleUpdateProfile,
      isEditing: editingProfile,
      editContent: editingProfile && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.profile.monthlyIncome')}</label>
            <Input
              type="number"
              value={tempProfile?.monthlyIncome || ''}
              onChange={(e) => setTempProfile(prev => prev ? {...prev, monthlyIncome: Number(e.target.value)} : null)}
              label={t('settings.profile.name')}
              placeholder="Enter your name"
              variant="floating"
            />
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelProfile}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: Target,
      title: t('settings.budget.title'),
      subtitle: profile ? formatAmount(profile.dailyLimit) : t('settings.budget.setupPrompt'),
      action: handleUpdateBudget,
      isEditing: editingBudget,
      editContent: editingBudget && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.budget.dailyLimit')}</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              label={t('settings.budget.dailyLimit')}
              placeholder="0.00"
              variant="floating"
            />
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveBudget}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelBudget}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: Globe,
      title: t('settings.language.title'),
      subtitle: getLanguageDisplay(language || 'en'),
      action: handleUpdateLanguage,
      isEditing: editingLanguage,
      editContent: editingLanguage && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.language.label')}</label>
            <Select
              value={tempLanguage}
              onChange={setTempLanguage}
              label={t('settings.language.label')}
              placeholder="Select language"
              variant="floating"
              options={[
                { value: "en", label: "English (US)", icon: Globe },
                { value: "es", label: "Español", icon: Globe }
              ]}
            />
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveLanguage}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelLanguage}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: Palette,
      title: t('settings.theme.title'),
      subtitle: getThemeDisplay(theme || 'light'),
      action: handleUpdateTheme,
      isEditing: editingTheme,
      editContent: editingTheme && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.theme.colorTheme')}</label>
            <RadioGroup
              name="theme"
              value={tempTheme}
              onChange={setTempTheme}
              label={t('settings.theme.colorTheme')}
              variant="modern"
              options={[
                { value: "light", label: "Light Mode", description: "Classic bright theme", icon: Palette },
                { value: "dark", label: "Dark Mode", description: "Easy on the eyes", icon: Palette },
                { value: "blue", label: "Professional Blue", description: "Modern professional theme", icon: Palette }
              ]}
            />
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveTheme}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelTheme}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: DollarSign,
      title: t('settings.currency.title'),
      subtitle: `${getCurrencyFlag(currency)} ${currency} (${getCurrencySymbol(currency)})`,
      action: handleUpdateCurrency,
      isEditing: editingCurrency,
      editContent: editingCurrency && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.currency.label')}</label>
            <Select
              value={tempCurrency}
              onChange={setTempCurrency}
              label={t('settings.currency.label')}
              placeholder="Select currency"
              variant="floating"
              searchable
              options={[
                { value: "USD", label: "🇺🇸 US Dollar (USD)", description: "United States Dollar", icon: DollarSign },
                { value: "EUR", label: "🇪🇺 Euro (EUR)", description: "European Union Euro", icon: DollarSign },
                { value: "GBP", label: "🇬🇧 British Pound (GBP)", description: "British Pound Sterling", icon: DollarSign },
                { value: "CAD", label: "🇨🇦 Canadian Dollar (CAD)", description: "Canadian Dollar", icon: DollarSign },
                { value: "AUD", label: "🇦🇺 Australian Dollar (AUD)", description: "Australian Dollar", icon: DollarSign },
                { value: "JPY", label: "🇯🇵 Japanese Yen (JPY)", description: "Japanese Yen", icon: DollarSign },
                { value: "MXN", label: "🇲🇽 Mexican Peso (MXN)", description: "Mexican Peso", icon: DollarSign },
                { value: "BRL", label: "🇧🇷 Brazilian Real (BRL)", description: "Brazilian Real", icon: DollarSign }
              ]}
            />
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveCurrency}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelCurrency}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: Bell,
      title: t('settings.notifications.title'),
      subtitle: t('settings.notifications.enabled', { count: Object.values(notifications).filter(Boolean).length }),
      action: handleUpdateNotifications,
      isEditing: editingNotifications,
      editContent: editingNotifications && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{t('settings.notifications.budgetAlerts')}</div>
                <div className="text-sm text-gray-500">{t('settings.notifications.budgetAlertsDesc')}</div>
              </div>
              <Checkbox
                checked={notifications.budgetAlerts}
                onChange={(checked) => setNotifications(prev => ({...prev, budgetAlerts: checked}))}
                variant="modern"
                color="primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{t('settings.notifications.dailyReminders')}</div>
                <div className="text-sm text-gray-500">{t('settings.notifications.dailyRemindersDesc')}</div>
              </div>
              <Checkbox
                checked={notifications.dailyReminders}
                onChange={(checked) => setNotifications(prev => ({...prev, dailyReminders: checked}))}
                variant="modern"
                color="warning"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{t('settings.notifications.weeklyReports')}</div>
                <div className="text-sm text-gray-500">{t('settings.notifications.weeklyReportsDesc')}</div>
              </div>
              <Checkbox
                checked={notifications.weeklyReports}
                onChange={(checked) => setNotifications(prev => ({...prev, weeklyReports: checked}))}
                variant="modern"
                color="success"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button size="sm" onClick={handleSaveNotifications}>
              <Save className="h-4 w-4 mr-2" />{t('common.save')}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelNotifications}>
              <X className="h-4 w-4 mr-2" />{t('common.cancel')}
            </Button>
          </div>
        </div>
      )
    },
    {
      icon: HelpCircle,
      title: t('settings.help.title'),
      subtitle: t('settings.help.subtitle'),
      action: () => console.log('Help clicked'),
      isEditing: false
    }
  ];

  return (
    <div className="space-y-6 w-full" style={{width: '100%', maxWidth: 'none'}}>
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold text-green-800 tracking-tight">{t('settings.title')}</h1>
        <p className="mt-2 text-lg text-green-600">{t('settings.subtitle')}</p>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {profile.name}
              </h3>
              <div className="text-sm text-gray-600">
                {t('settings.profile.dailyBudget')}: {formatAmount(profile.dailyLimit)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {t('settings.profile.member')}
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-500">{t('settings.currentSettings')}</div>
                <div className="text-sm font-medium text-gray-700">
                  🌐 {getLanguageDisplay(language || 'en')} • {getCurrencyFlag(currency)} {currency}
                </div>
              </div>
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </div>
                </div>
                <div className="text-gray-400">
                  {item.isEditing ? (
                    <Edit className="h-5 w-5 text-blue-500" />
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </button>
              
              {/* Edit Content */}
              {item.editContent && (
                <div className="border-t border-gray-100">
                  {item.editContent}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* App Info */}
      <div className="arkm-card p-4">
        <div className="text-center space-y-2">
          <div className="text-lg font-semibold" style={{color: 'var(--accent-primary)'}}>
            {t('app.name')}
          </div>
          <div className="text-sm text-gray-600">
            {t('app.version')} 1.0.0
          </div>
          <div className="text-xs text-gray-500">
            {t('app.tagline')}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full" style={{width: '100%'}}>
        <div className="arkm-stat-card">
          <div className="text-lg font-bold" style={{color: 'var(--accent-primary)'}}>7</div>
          <div className="text-xs text-gray-600">{t('settings.stats.daysActive')}</div>
        </div>
        <div className="arkm-stat-card">
          <div className="text-lg font-bold" style={{color: 'var(--accent-success)'}}>85%</div>
          <div className="text-xs text-gray-600">{t('settings.stats.budgetSuccess')}</div>
        </div>
        <div className="arkm-stat-card">
          <div className="text-lg font-bold" style={{color: 'var(--accent-warning)'}}>12</div>
          <div className="text-xs text-gray-600">{t('settings.stats.categoriesUsed')}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;