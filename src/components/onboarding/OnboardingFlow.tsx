'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, Wallet, Target, Globe, Bell } from 'lucide-react';
import { UserProfile } from '@/types/daily-tracker';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Button from '@/components/ui/Button';
import CurrencySelector from '@/components/ui/CurrencySelector';
import LanguageSelector from '@/components/ui/LanguageSelector';

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

type OnboardingStep = 'welcome' | 'income' | 'limits' | 'preferences' | 'notifications' | 'complete';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { t, language } = useI18n();
  const { currency } = useCurrency();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    dailyLimit: '',
    enableNotifications: false,
    dailyReminderTime: '18:00',
    enableLimitWarnings: true,
    enableAchievements: true,
  });

  const steps: OnboardingStep[] = ['welcome', 'income', 'limits', 'preferences', 'notifications', 'complete'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    const monthlyIncome = parseFloat(formData.monthlyIncome);
    const dailyLimit = formData.dailyLimit 
      ? parseFloat(formData.dailyLimit)
      : (monthlyIncome * 0.7) / 30; // Default to 70% of income divided by 30 days

    const profile = dailyTrackerService.createDefaultProfile(
      monthlyIncome,
      currency,
      language
    );

    // Update with user preferences
    profile.dailyLimit = dailyLimit;
    profile.notificationSettings = {
      enabled: formData.enableNotifications,
      dailyReminder: {
        enabled: formData.enableNotifications,
        time: formData.dailyReminderTime,
      },
      limitWarnings: {
        enabled: formData.enableLimitWarnings,
        thresholds: [75, 90, 100],
      },
      achievements: {
        enabled: formData.enableAchievements,
      },
    };

    onComplete(profile);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep 
            onNext={handleNext}
            onSkip={onSkip}
          />
        );
      
      case 'income':
        return (
          <IncomeStep
            value={formData.monthlyIncome}
            onChange={(value) => setFormData(prev => ({ ...prev, monthlyIncome: value }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'limits':
        return (
          <LimitsStep
            monthlyIncome={parseFloat(formData.monthlyIncome) || 0}
            value={formData.dailyLimit}
            onChange={(value) => setFormData(prev => ({ ...prev, dailyLimit: value }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'preferences':
        return (
          <PreferencesStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'notifications':
        return (
          <NotificationsStep
            enableNotifications={formData.enableNotifications}
            dailyReminderTime={formData.dailyReminderTime}
            enableLimitWarnings={formData.enableLimitWarnings}
            enableAchievements={formData.enableAchievements}
            onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      
      case 'complete':
        return (
          <CompleteStep
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl xl:max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

// Individual Step Components
interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onSkip }) => {
  const { t } = useI18n();
  
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <Wallet className="h-10 w-10 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        {t('onboarding.welcome')}
      </h1>
      
      <p className="text-lg text-slate-600 mb-8">
        {t('onboarding.welcomeSubtitle')}
      </p>
      
      <div className="space-y-4">
        <Button onClick={onNext} size="xl" className="w-full">
          {t('onboarding.getStarted')}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        
        <button
          onClick={onSkip}
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          {t('onboarding.skipForNow')}
        </button>
      </div>
    </div>
  );
};

interface IncomeStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const IncomeStep: React.FC<IncomeStepProps> = ({ value, onChange, onNext, onBack }) => {
  const { t } = useI18n();
  const { currencySymbol, formatAmount } = useCurrency();
  
  const isValid = value && parseFloat(value) > 0;
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
          <Wallet className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('onboarding.monthlyIncomeTitle')}
        </h2>
        
        <p className="text-slate-600">
          {t('onboarding.monthlyIncomeDescription')}
        </p>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('common.monthlyIncome')}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">
            {currencySymbol}
          </span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        
        {value && parseFloat(value) > 0 && (
          <p className="mt-2 text-sm text-slate-600">
            Recommended daily limit: {formatAmount((parseFloat(value) * 0.7) / 30)}
          </p>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          {t('common.next')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface LimitsStepProps {
  monthlyIncome: number;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const LimitsStep: React.FC<LimitsStepProps> = ({ monthlyIncome, value, onChange, onNext, onBack }) => {
  const { t } = useI18n();
  const { currencySymbol, formatAmount } = useCurrency();
  
  const recommendedLimit = (monthlyIncome * 0.7) / 30;
  const currentLimit = value ? parseFloat(value) : recommendedLimit;
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-blue-100 flex items-center justify-center">
          <Target className="h-8 w-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('onboarding.dailyLimitTitle')}
        </h2>
        
        <p className="text-slate-600">
          {t('onboarding.dailyLimitDescription')}
        </p>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('dailyTracker.dailyLimit')}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">
            {currencySymbol}
          </span>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={recommendedLimit.toFixed(2)}
            className="w-full pl-10 pr-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Recommended: {formatAmount(recommendedLimit)} per day
          </p>
          <p className="text-sm text-blue-600 mt-1">
            This is 70% of your monthly income divided by 30 days
          </p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Button onClick={onNext} className="flex-1">
          {t('common.next')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface PreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep: React.FC<PreferencesStepProps> = ({ onNext, onBack }) => {
  const { t } = useI18n();
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-purple-100 flex items-center justify-center">
          <Globe className="h-8 w-8 text-purple-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('onboarding.currencySelection')}
        </h2>
        
        <p className="text-slate-600">
          Choose your preferred currency and language
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.currency')}
          </label>
          <CurrencySelector showPopular showSearch />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t('common.language')}
          </label>
          <LanguageSelector />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Button onClick={onNext} className="flex-1">
          {t('common.next')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface NotificationsStepProps {
  enableNotifications: boolean;
  dailyReminderTime: string;
  enableLimitWarnings: boolean;
  enableAchievements: boolean;
  onChange: (field: string, value: boolean | string) => void;
  onNext: () => void;
  onBack: () => void;
}

const NotificationsStep: React.FC<NotificationsStepProps> = ({
  enableNotifications,
  dailyReminderTime,
  enableLimitWarnings,
  enableAchievements,
  onChange,
  onNext,
  onBack
}) => {
  const { t } = useI18n();
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-amber-100 flex items-center justify-center">
          <Bell className="h-8 w-8 text-amber-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('onboarding.notificationSetup')}
        </h2>
        
        <p className="text-slate-600">
          Stay on track with helpful reminders
        </p>
      </div>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Daily Reminders</h3>
            <p className="text-sm text-slate-600">Get reminded to log your expenses</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={(e) => onChange('enableNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {enableNotifications && (
          <div className="ml-4 p-3 bg-slate-50 rounded-lg">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Reminder Time
            </label>
            <input
              type="time"
              value={dailyReminderTime}
              onChange={(e) => onChange('dailyReminderTime', e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Budget Warnings</h3>
            <p className="text-sm text-slate-600">Get alerted when approaching limits</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableLimitWarnings}
              onChange={(e) => onChange('enableLimitWarnings', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-900">Achievement Notifications</h3>
            <p className="text-sm text-slate-600">Celebrate your financial milestones</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableAchievements}
              onChange={(e) => onChange('enableAchievements', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Button onClick={onNext} className="flex-1">
          {t('common.next')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

interface CompleteStepProps {
  onComplete: () => void;
  onBack: () => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ onComplete, onBack }) => {
  const { t } = useI18n();
  
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        All Set!
      </h2>
      
      <p className="text-lg text-slate-600 mb-8">
        {t('onboarding.letsStart')}
      </p>
      
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Button onClick={onComplete} className="flex-1">
          {t('onboarding.completeSetup')}
          <CheckCircle className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;