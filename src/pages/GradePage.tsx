import React from 'react';
import Navigation from '@/components/Navigation';
import BulkGradingInterface from '@/components/BulkGradingInterface';

const GradePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <BulkGradingInterface />
    </div>
  );
};

export default GradePage;