import React from 'react';
import Navigation from '@/components/Navigation';
import CreateAssignmentPage from '@/components/CreateAssignmentPage';

const CreatePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CreateAssignmentPage />
    </div>
  );
};

export default CreatePage;