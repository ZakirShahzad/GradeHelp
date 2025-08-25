import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import UploadInterface from '@/components/UploadInterface';
import { FileText, Settings } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'upload':
          return <UploadInterface />;
        case 'assignments':
          return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
              <div className="text-center space-y-4 animate-fade-in-up">
                <div className="p-4 bg-primary-light rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Assignment Management</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Comprehensive assignment tracking and analytics coming soon...
                </p>
              </div>
            </div>
          );
        case 'settings':
          return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
              <div className="text-center space-y-4 animate-fade-in-up">
                <div className="p-4 bg-primary-light rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Settings className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Grading Settings</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Customize AI behavior, rubric preferences, and teaching style adaptation...
                </p>
              </div>
            </div>
          );
        default:
          return <Dashboard />;
      }
    })();

    return (
      <div 
        key={activeTab}
        className="animate-fade-in-up"
      >
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
