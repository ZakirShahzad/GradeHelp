import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Award,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Brain
} from 'lucide-react';

interface DashboardProps {
  teacherName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  teacherName = "Ms. Johnson" 
}) => {
  const stats = {
    assignmentsGraded: 142,
    hoursShaved: 38,
    averageGrade: 87.2,
    studentsHelped: 156
  };

  const recentAssignments = [
    { id: 1, title: "Essay: American Revolution", status: "completed", grade: "A-", students: 28 },
    { id: 2, title: "Math Quiz: Quadratic Equations", status: "in-progress", students: 32 },
    { id: 3, title: "Science Lab Report", status: "pending", students: 25 },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {teacherName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Your AI grading assistant is ready to help
              </p>
            </div>
            <Button variant="default" size="lg" className="gradient-primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload Assignment
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-success-light rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Assignments Graded</p>
                  <p className="text-3xl font-bold text-foreground">{stats.assignmentsGraded}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-light rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Hours Saved</p>
                  <p className="text-3xl font-bold text-foreground">{stats.hoursShaved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-warning-light rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                  <p className="text-3xl font-bold text-foreground">{stats.averageGrade}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Students Helped</p>
                  <p className="text-3xl font-bold text-foreground">{stats.studentsHelped}</p>
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
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div 
                      key={assignment.id}
                      className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="mr-3">
                          {assignment.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : assignment.status === 'in-progress' ? (
                            <Clock className="h-5 w-5 text-warning" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.students} students</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assignment.grade && (
                          <Badge variant="secondary">{assignment.grade}</Badge>
                        )}
                        <Badge 
                          variant={
                            assignment.status === 'completed' ? 'default' : 
                            assignment.status === 'in-progress' ? 'secondary' : 'outline'
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
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

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Assignment
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All Assignments
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="mr-2 h-4 w-4" />
                    Grading Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;