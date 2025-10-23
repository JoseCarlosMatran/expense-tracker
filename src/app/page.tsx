'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import EnhancedDashboard from '@/components/dashboard/EnhancedDashboard';
import WelcomeAnimation from '@/components/onboarding/WelcomeAnimation';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { dailyTrackerService } from '@/lib/daily-tracker';
import { UserProfile } from '@/types/daily-tracker';

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userProfile = dailyTrackerService.getUserProfile();
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

    setProfile(userProfile);
    setShowOnboarding(!userProfile);
    setShowWelcome(Boolean(userProfile && !hasSeenWelcome));
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    dailyTrackerService.saveUserProfile(newProfile);
    setProfile(newProfile);
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    dailyTrackerService.saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  if (showWelcome && profile) {
    return (
      <WelcomeAnimation 
        onComplete={handleWelcomeComplete}
        userName={profile.name}
      />
    );
  }

  if (profile) {
    return (
      <EnhancedDashboard 
        profile={profile}
        onUpdateProfile={handleProfileUpdate}
      />
    );
  }

  // Fallback to traditional dashboard
  return <Dashboard />;
}