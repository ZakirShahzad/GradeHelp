import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect authenticated users to dashboard
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

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
    return <Landing onLogin={() => navigate('/signin')} />;
  }

  // This should not be reached as authenticated users are redirected to dashboard
  return null;
};

export default Index;
