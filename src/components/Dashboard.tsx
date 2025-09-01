import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Clock, TrendingUp, Award, Upload, FileText, CheckCircle, AlertCircle, Users, Brain, Loader2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRecentAssignments } from '@/hooks/useRecentAssignments';
interface DashboardProps {
  onTabChange?: (tab: string) => void;
}
export const Dashboard: React.FC<DashboardProps> = ({
  onTabChange
}) => {
  const navigate = useNavigate();
  const {
    profile,
    loading: profileLoading
  } = useProfile();
  const {
    stats,
    loading: statsLoading
  } = useDashboardStats();
  const {
    assignments,
    loading: assignmentsLoading
  } = useRecentAssignments(3);
  const teacherName = profile?.display_name || 'Teacher';
  return <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-elevated/95 border-b border-border backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {profileLoading ? <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-80" />
                </div> : <>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Welcome back, {teacherName}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {profile?.school_name ? <>Teaching at {profile.school_name} • Your AI grading assistant is ready</> : 'Your AI grading assistant is ready to help'}
                  </p>
                  {profile?.subjects && profile.subjects.length > 0 && <div className="flex flex-wrap gap-2 pt-2">
                      {profile.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary">{subject}</Badge>
                      ))}
                    </div>}
                </>}
            </div>
            <Button variant="premium" size="lg" className="shadow-lg hover:shadow-xl" onClick={() => navigate('/create')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Assignment
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 animate-fade-in-up">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Assignments Graded */}
          <Card className="card-elevated hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-success-light rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-7 w-7 text-success" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assignments Graded</p>
                  {statsLoading ? <Skeleton className="h-10 w-16 mt-1" /> : <p className="text-4xl font-bold text-foreground mt-1">{stats?.assignmentsGraded || 0}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Saved */}
          <Card className="card-elevated hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-primary-light rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-7 w-7 text-primary" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Hours Saved</p>
                  {statsLoading ? <Skeleton className="h-10 w-16 mt-1" /> : <p className="text-4xl font-bold text-foreground mt-1">{stats?.hoursEstimated || 0}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className="card-elevated hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-warning-light rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-7 w-7 text-warning" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avg Score</p>
                  {statsLoading ? <Skeleton className="h-10 w-16 mt-1" /> : <p className="text-4xl font-bold text-foreground mt-1">
                      {stats?.averageScore ? `${stats.averageScore}%` : '--'}
                    </p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className="card-elevated hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="p-3 bg-accent rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Students</p>
                  {statsLoading ? <Skeleton className="h-10 w-16 mt-1" /> : <p className="text-4xl font-bold text-foreground mt-1">{stats?.totalStudents || 0}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Assignments */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Recent Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignmentsLoading ? <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>)}
                  </div> : assignments.length === 0 ? <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No assignments yet</p>
                    <p className="text-muted-foreground mb-4">
                      Create your first assignment to get started with AI-powered grading
                    </p>
                    <Button variant="outline" onClick={() => navigate('/create')}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Assignment
                    </Button>
                  </div> : <div className="space-y-4">
                    {assignments.map(assignment => <div key={assignment.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {assignment.status === 'completed' ? <CheckCircle className="h-5 w-5 text-success" /> : assignment.status === 'active' ? <Clock className="h-5 w-5 text-warning" /> : <AlertCircle className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignment.gradedSubmissions}/{assignment.totalSubmissions} graded
                              {assignment.due_date && <span className="ml-2">
                                  • Due {new Date(assignment.due_date).toLocaleDateString()}
                                </span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {assignment.total_points && <Badge variant="secondary">{assignment.total_points} pts</Badge>}
                          <Badge variant={assignment.status === 'completed' ? 'default' : assignment.status === 'active' ? 'secondary' : 'outline'}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>)}
                    
                    {assignments.length >= 3 && <div className="pt-4 border-t border-border">
                        <Button variant="ghost" className="w-full" onClick={() => navigate('/assignments')}>
                          View All Assignments
                        </Button>
                      </div>}
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <div>
            <Card className="card-elevated mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Grading Accuracy</span>
                      <span className="text-sm text-muted-foreground">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Style Consistency</span>
                      <span className="text-sm text-muted-foreground">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Upload more writing samples to improve style matching</li>
                      <li>• Consider adjusting rubric weights for math assignments</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;