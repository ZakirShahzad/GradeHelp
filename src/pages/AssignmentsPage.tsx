import React from 'react';
import Navigation from '@/components/Navigation';
import AssignmentsPage from '@/components/AssignmentsPage';

const AssignmentsPageWrapper = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AssignmentsPage />
    </div>
  );
};

export default AssignmentsPageWrapper;