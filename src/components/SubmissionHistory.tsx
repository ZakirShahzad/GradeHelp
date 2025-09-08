import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useSubmissions, Submission } from '@/hooks/useSubmissions';
import { useAssignments } from '@/hooks/useAssignments';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  User, 
  Search,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface SubmissionHistoryProps {
  assignmentId?: string;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ assignmentId }) => {
  const { submissions, loading, fetchSubmissions } = useSubmissions();
  const { assignments } = useAssignments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(assignmentId || '');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'student'>('date');

  useEffect(() => {
    if (selectedAssignment) {
      fetchSubmissions(selectedAssignment);
    }
  }, [selectedAssignment, fetchSubmissions]);

  const filteredSubmissions = submissions.filter(submission => {
    const studentName = submission.student 
      ? `${submission.student.first_name} ${submission.student.last_name}`
      : '';
    return studentName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.score || 0) - (a.score || 0);
      case 'student':
        const nameA = a.student ? `${a.student.first_name} ${a.student.last_name}` : '';
        const nameB = b.student ? `${b.student.first_name} ${b.student.last_name}` : '';
        return nameA.localeCompare(nameB);
      case 'date':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const getGradeColor = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    if (score >= 70) return 'outline';
    return 'destructive';
  };

  const exportResults = () => {
    if (sortedSubmissions.length === 0) return;

    const csvContent = [
      'Student Name,Score,Percentage,Feedback,Submitted At,Graded At',
      ...sortedSubmissions
        .filter(sub => sub.score !== null && sub.score !== undefined)
        .map(sub => {
          const studentName = sub.student 
            ? `${sub.student.first_name} ${sub.student.last_name}`
            : 'Unknown Student';
          const score = sub.score || 0;
          const assignment = assignments?.find(a => a.id === sub.assignment_id);
          const totalPoints = assignment?.total_points || 100;
          const percentage = Math.round((score / totalPoints) * 100);
          
          return `"${studentName}","${score}","${percentage}%","${(sub.feedback || '').replace(/"/g, '""')}","${sub.submitted_at || ''}","${sub.graded_at || ''}"`;
        })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${selectedAssignment}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedAssignmentData = assignments?.find(a => a.id === selectedAssignment);
  const gradedSubmissions = submissions.filter(sub => sub.score !== null && sub.score !== undefined);
  const averageScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / gradedSubmissions.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Submission History
            </div>
            <Button 
              onClick={exportResults}
              variant="outline"
              disabled={gradedSubmissions.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            View and manage all student submissions and grades
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assignment</label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment" />
                </SelectTrigger>
                <SelectContent>
                  {assignments?.map(assignment => (
                    <SelectItem key={assignment.id} value={assignment.id}>
                      {assignment.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name..."
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={(value: 'date' | 'score' | 'student') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="student">Student Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          {selectedAssignmentData && gradedSubmissions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{submissions.length}</div>
                <div className="text-sm text-muted-foreground">Total Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{gradedSubmissions.length}</div>
                <div className="text-sm text-muted-foreground">Graded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {averageScore.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {selectedAssignmentData.total_points}
                </div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading submissions...</p>
            </div>
          ) : sortedSubmissions.length === 0 ? (
            <div className="p-8 text-center">
              {!selectedAssignment ? (
                <>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Assignment Selected</h3>
                  <p className="text-muted-foreground">Choose an assignment to view submissions</p>
                </>
              ) : (
                <>
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Submissions Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No submissions match your search' : 'No submissions for this assignment yet'}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {sortedSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {submission.score !== null && submission.score !== undefined ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {submission.student 
                            ? `${submission.student.first_name} ${submission.student.last_name}`
                            : 'Unknown Student'
                          }
                        </span>
                        {submission.student?.email && (
                          <span className="text-sm text-muted-foreground">
                            ({submission.student.email})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(submission.created_at), 'MMM d, yyyy')}
                        </div>
                        {submission.graded_at && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Graded {format(new Date(submission.graded_at), 'MMM d')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {submission.score !== null && submission.score !== undefined && (
                      <Badge variant={getGradeColor(submission.score)} className="font-mono">
                        {submission.score}/{selectedAssignmentData?.total_points || 100}
                      </Badge>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionHistory;