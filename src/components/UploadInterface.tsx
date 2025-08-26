import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAssignments } from '@/hooks/useAssignments';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Users,
  Clock,
  Calendar
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  status: 'uploading' | 'complete' | 'error';
  uploadPath?: string;
}

interface UploadInterfaceProps {
  onTabChange?: (tab: string) => void;
}

export const UploadInterface: React.FC<UploadInterfaceProps> = ({ onTabChange }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [rubricNotes, setRubricNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { createAssignment } = useAssignments();
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFileToSupabase = async (file: File, fileId: string) => {
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('assignments')
      .upload(fileName, file);

    if (error) throw error;

    return data.path;
  };

  const handleFileSelection = (selectedFiles: FileList) => {
    const validFiles = Array.from(selectedFiles).filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files to Supabase
    newFiles.forEach(async (fileInfo) => {
      try {
        const uploadPath = await uploadFileToSupabase(fileInfo.file, fileInfo.id);
        setFiles(prev => 
          prev.map(f => 
            f.id === fileInfo.id 
              ? { ...f, status: 'complete', uploadPath }
              : f
          )
        );
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => 
          prev.map(f => 
            f.id === fileInfo.id 
              ? { ...f, status: 'error' }
              : f
          )
        );
        toast({
          title: "Upload failed",
          description: `Failed to upload ${fileInfo.name}`,
          variant: "destructive",
        });
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCreateAssignment = async () => {
    if (!assignmentTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter an assignment title.",
        variant: "destructive",
      });
      return;
    }

    const completedFiles = files.filter(f => f.status === 'complete');
    if (completedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file before creating the assignment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAssignment({
        title: assignmentTitle,
        description: rubricNotes || undefined,
        due_date: dueDate || undefined,
        total_points: totalPoints,
      });

      // Reset form
      setAssignmentTitle('');
      setRubricNotes('');
      setDueDate('');
      setTotalPoints(100);
      setFiles([]);

      // Navigate to assignments page
      onTabChange?.('assignments');
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedFiles = files.filter(f => f.status === 'complete').length;
  const totalFiles = files.length;

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-elevated/95 border-b border-border backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Upload Assignment</h1>
            <p className="text-lg text-muted-foreground">
              Upload student work for AI-powered grading and feedback
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="space-y-8">
          {/* Assignment Details */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Assignment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="e.g., Essay: American Revolution Analysis"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="points">Total Points</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(parseInt(e.target.value) || 100)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="rubric">Grading Rubric & Notes</Label>
                <Textarea
                  id="rubric"
                  value={rubricNotes}
                  onChange={(e) => setRubricNotes(e.target.value)}
                  placeholder="Describe your grading criteria, point distribution, and any special instructions..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5 text-primary" />
                Upload Student Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-primary bg-primary-light/20 scale-[1.02]' 
                    : 'border-border bg-surface hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="p-4 bg-primary-light rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Drop files here or click to upload
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports PDF, DOC, DOCX, TXT files up to 10MB each
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      Uploaded Files ({completedFiles}/{totalFiles})
                    </h4>
                    {totalFiles > 0 && (
                      <Badge variant="secondary">
                        {completedFiles === totalFiles ? 'Complete' : 'Processing...'}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg border border-border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {file.status === 'uploading' ? (
                              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            ) : file.status === 'complete' ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-destructive" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={() => onTabChange?.('assignments')}
            >
              Cancel
            </Button>
            
            <div className="space-x-3">
              <Button 
                variant="default" 
                className="gradient-primary"
                disabled={completedFiles === 0 || !assignmentTitle.trim() || isSubmitting}
                onClick={handleCreateAssignment}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create Assignment ({completedFiles} files)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <Card className="bg-accent/30 border-accent">
            <CardContent className="p-6">
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Processing Time Estimate
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-foreground">1-10 assignments:</strong>
                  <p className="text-muted-foreground">~2-5 minutes</p>
                </div>
                <div>
                  <strong className="text-foreground">11-30 assignments:</strong>
                  <p className="text-muted-foreground">~5-15 minutes</p>
                </div>
                <div>
                  <strong className="text-foreground">30+ assignments:</strong>
                  <p className="text-muted-foreground">~15-30 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadInterface;