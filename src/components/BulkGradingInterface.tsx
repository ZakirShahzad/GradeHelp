import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAssignments } from '@/hooks/useAssignments';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Download,
  Trash2
} from 'lucide-react';

interface SubmissionData {
  studentName: string;
  content: string;
  file?: File;
  status: 'pending' | 'grading' | 'completed' | 'error';
  result?: any;
  error?: string;
}

interface BulkGradingInterfaceProps {
  onTabChange?: (tab: string) => void;
}

export const BulkGradingInterface: React.FC<BulkGradingInterfaceProps> = ({ onTabChange }) => {
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { toast } = useToast();
  
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [rubric, setRubric] = useState('');
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingProgress, setGradingProgress] = useState(0);

  // Handle file upload for submissions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const studentName = file.name.split('.')[0].replace(/[_-]/g, ' ');
        
        setSubmissions(prev => [...prev, {
          studentName,
          content,
          file,
          status: 'pending'
        }]);
      };
      reader.readAsText(file);
    });
  };

  // Add manual submission
  const addManualSubmission = () => {
    setSubmissions(prev => [...prev, {
      studentName: '',
      content: '',
      status: 'pending'
    }]);
  };

  // Update submission
  const updateSubmission = (index: number, field: keyof SubmissionData, value: string) => {
    setSubmissions(prev => prev.map((sub, i) => 
      i === index ? { ...sub, [field]: value } : sub
    ));
  };

  // Remove submission
  const removeSubmission = (index: number) => {
    setSubmissions(prev => prev.filter((_, i) => i !== index));
  };

  // Grade all submissions
  const gradeAllSubmissions = async () => {
    if (!selectedAssignment) {
      toast({
        title: "Assignment Required",
        description: "Please select an assignment to grade.",
        variant: "destructive"
      });
      return;
    }

    if (submissions.length === 0) {
      toast({
        title: "No Submissions",
        description: "Please add some submissions to grade.",
        variant: "destructive"
      });
      return;
    }

    setIsGrading(true);
    setGradingProgress(0);

    const validSubmissions = submissions.filter(sub => sub.studentName.trim() && sub.content.trim());

    for (let i = 0; i < validSubmissions.length; i++) {
      const submission = validSubmissions[i];
      
      try {
        // Update status to grading
        setSubmissions(prev => prev.map(sub => 
          sub === submission ? { ...sub, status: 'grading' } : sub
        ));

        // Call grading API
        const { data, error } = await supabase.functions.invoke('grade-assignments', {
          body: {
            assignmentId: selectedAssignment,
            rubric,
            submissionText: submission.content,
            studentName: submission.studentName
          }
        });

        if (error) throw error;

        // Update with result
        setSubmissions(prev => prev.map(sub => 
          sub === submission ? { 
            ...sub, 
            status: 'completed', 
            result: data.grading 
          } : sub
        ));

      } catch (error) {
        console.error('Error grading submission:', error);
        setSubmissions(prev => prev.map(sub => 
          sub === submission ? { 
            ...sub, 
            status: 'error', 
            error: error.message 
          } : sub
        ));
      }

      // Update progress
      setGradingProgress(((i + 1) / validSubmissions.length) * 100);
    }

    setIsGrading(false);
    toast({
      title: "Grading Complete",
      description: `Successfully graded ${validSubmissions.length} submissions.`,
    });
  };

  // Export results
  const exportResults = () => {
    const completedSubmissions = submissions.filter(sub => sub.status === 'completed');
    const csvContent = [
      'Student Name,Score,Percentage,Letter Grade,Feedback',
      ...completedSubmissions.map(sub => 
        `"${sub.studentName}","${sub.result.score}","${sub.result.percentage}%","${sub.result.letterGrade}","${sub.result.feedback.replace(/"/g, '""')}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grading-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">AI Grading Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload student assignments and let AI grade them automatically with detailed feedback
          </p>
        </div>

        {/* Assignment Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Assignment</CardTitle>
            <CardDescription>
              Choose the assignment you want to grade and customize the rubric
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment</Label>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments?.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.title} ({assignment.total_points} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <Button 
                  variant="outline" 
                  onClick={() => onTabChange?.('upload')}
                  className="w-full"
                >
                  Create New Assignment
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rubric">Grading Rubric (Optional)</Label>
              <Textarea
                id="rubric"
                value={rubric}
                onChange={(e) => setRubric(e.target.value)}
                placeholder="Describe specific criteria for grading this assignment..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Student Submissions
            </CardTitle>
            <CardDescription>
              Upload text files or add submissions manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  multiple
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Supported formats: .txt, .md, .doc, .docx
                </p>
              </div>
              
              <Button onClick={addManualSubmission} variant="outline">
                Add Manual Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        {submissions.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Submissions ({submissions.length})</CardTitle>
                <CardDescription>
                  Review and edit submissions before grading
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={exportResults}
                  variant="outline"
                  disabled={!submissions.some(sub => sub.status === 'completed')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
                
                <Button 
                  onClick={gradeAllSubmissions}
                  disabled={isGrading || !selectedAssignment}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  {isGrading ? 'Grading...' : 'Grade All'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isGrading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grading Progress</span>
                    <span>{Math.round(gradingProgress)}%</span>
                  </div>
                  <Progress value={gradingProgress} className="w-full" />
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {submissions.map((submission, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <Input
                          value={submission.studentName}
                          onChange={(e) => updateSubmission(index, 'studentName', e.target.value)}
                          placeholder="Student Name"
                          className="font-medium"
                        />
                        
                        <Badge 
                          variant={
                            submission.status === 'completed' ? 'default' : 
                            submission.status === 'grading' ? 'secondary' : 
                            submission.status === 'error' ? 'destructive' : 'outline'
                          }
                        >
                          {submission.status === 'completed' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {submission.status === 'error' && <AlertCircle className="mr-1 h-3 w-3" />}
                          {submission.status}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubmission(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <Textarea
                      value={submission.content}
                      onChange={(e) => updateSubmission(index, 'content', e.target.value)}
                      placeholder="Student submission text..."
                      rows={3}
                    />

                    {submission.status === 'completed' && submission.result && (
                      <div className="bg-muted p-4 rounded-md space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Grade: {submission.result.score}/{submissions.find(s => s === submission)?.result?.totalPoints || 100}</span>
                          <Badge variant="secondary">{submission.result.letterGrade}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.result.feedback?.substring(0, 200)}...
                        </p>
                      </div>
                    )}

                    {submission.status === 'error' && (
                      <div className="bg-destructive/10 p-3 rounded-md">
                        <p className="text-sm text-destructive">
                          Error: {submission.error}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BulkGradingInterface;