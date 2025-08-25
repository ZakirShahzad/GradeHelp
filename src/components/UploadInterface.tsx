import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Users,
  Clock
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'complete' | 'error';
}

export const UploadInterface: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [rubricNotes, setRubricNotes] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadedFile[] = droppedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process
    newFiles.forEach(file => {
      setTimeout(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: Math.random() > 0.1 ? 'complete' : 'error' }
              : f
          )
        );
      }, 1000 + Math.random() * 2000);
    });
  }, []);

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

                  <Button variant="outline" className="mt-4">
                    Choose Files
                  </Button>
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
            <Button variant="outline">
              Save as Draft
            </Button>
            
            <div className="space-x-3">
              <Button variant="outline">
                Cancel
              </Button>
              <Button 
                variant="default" 
                className="gradient-primary"
                disabled={completedFiles === 0 || !assignmentTitle.trim()}
              >
                <Users className="mr-2 h-4 w-4" />
                Start Grading ({completedFiles} files)
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