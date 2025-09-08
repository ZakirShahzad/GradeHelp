import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, FileText, Users, Edit, Trash2, Target, BookOpen, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAssignments } from '@/hooks/useAssignments';
import SubmissionHistory from '@/components/SubmissionHistory';
import { format } from 'date-fns';

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

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Assignment Details</TabsTrigger>
            <TabsTrigger value="submissions">Submissions & Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Assignment Header */}
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold mb-2 flex items-center">
                      <BookOpen className="mr-3 h-6 w-6 text-primary" />
                      {assignment.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Created {format(new Date(assignment.created_at), 'MMMM d, yyyy')}
                      </div>
                      {assignment.due_date && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Due {format(new Date(assignment.due_date), 'MMMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assignment)}
                    <Button variant="outline" size="sm" onClick={() => navigate('/create')}>
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
              <CardContent className="space-y-6">
                {assignment.description && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Description
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {assignment.description}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Assignment Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-primary/20">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {assignment.total_points}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </CardContent>
                  </Card>

                  <Card className="border-success/20">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="h-8 w-8 text-success" />
                      </div>
                      <div className="text-2xl font-bold text-success">0</div>
                      <p className="text-sm text-muted-foreground">Submissions</p>
                    </CardContent>
                  </Card>

                  <Card className="border-warning/20">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-8 w-8 text-warning" />
                      </div>
                      <div className="text-2xl font-bold text-warning">0</div>
                      <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionHistory assignmentId={assignment.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;