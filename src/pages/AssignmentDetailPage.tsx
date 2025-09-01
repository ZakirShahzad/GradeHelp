import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Users, Edit, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAssignments } from '@/hooks/useAssignments';
import { Skeleton } from '@/components/ui/skeleton';

const AssignmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assignments, loading, deleteAssignment } = useAssignments();
  
  const assignment = assignments.find(a => a.id === id);

  const getStatusBadge = (assignment: any) => {
    const now = new Date();
    const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
    
    if (dueDate && dueDate < now) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (dueDate) {
      return <Badge variant="secondary">Active</Badge>;
    }
    return <Badge variant="outline">Draft</Badge>;
  };

  const handleDelete = async () => {
    if (assignment && window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignment.id);
        navigate('/assignments');
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card className="card-elevated">
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => navigate('/assignments')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Button>
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assignment Not Found</h2>
              <p className="text-muted-foreground">The assignment you're looking for doesn't exist or has been deleted.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate('/assignments')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>

        <div className="space-y-6">
          {/* Assignment Header */}
          <Card className="card-elevated">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold mb-2">{assignment.title}</CardTitle>
                  <p className="text-muted-foreground">
                    Created on {new Date(assignment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(assignment)}
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {assignment.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{assignment.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assignment.due_date && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {assignment.total_points && (
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Points</p>
                      <p className="text-sm text-muted-foreground">{assignment.total_points} points</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Submissions</p>
                    <p className="text-sm text-muted-foreground">0 submissions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Section */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
                <p className="text-muted-foreground">
                  Students haven't submitted any work for this assignment yet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;