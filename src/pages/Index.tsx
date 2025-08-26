import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import CreateAssignmentPage from '@/components/CreateAssignmentPage';
import AssignmentsPage from '@/components/AssignmentsPage';
import BulkGradingInterface from '@/components/BulkGradingInterface';
import SettingsPage from '@/components/SettingsPage';
import Landing from '@/pages/Landing';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // User is not authenticated, show landing page with auth redirect
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing onLogin={() => navigate('/auth')} />;
  }

  const renderContent = () => {
    const content = (() => {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard onTabChange={setActiveTab} />;
        case 'create':
          return <CreateAssignmentPage onTabChange={setActiveTab} />;
        case 'grade':
          return <BulkGradingInterface onTabChange={setActiveTab} />;
        case 'assignments':
          return <AssignmentsPage onTabChange={setActiveTab} />;
        case 'settings':
          return <SettingsPage onTabChange={setActiveTab} />;
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
