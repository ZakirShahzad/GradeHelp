import React from 'react';
import Navigation from '@/components/Navigation';
import SettingsPage from '@/components/SettingsPage';

const SettingsPageWrapper = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <SettingsPage />
    </div>
  );
};

export default SettingsPageWrapper;