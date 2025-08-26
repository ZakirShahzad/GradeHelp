import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Calendar,
  Save,
  Plus,
  X,
  BookOpen
} from 'lucide-react';

interface CreateAssignmentPageProps {
  onTabChange?: (tab: string) => void;
}

export const CreateAssignmentPage: React.FC<CreateAssignmentPageProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalPoints, setTotalPoints] = useState('100');
  const [dueDate, setDueDate] = useState('');
  const [rubric, setRubric] = useState('');
  
  // Additional fields
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [instructions, setInstructions] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  
  // Loading state
  const [creating, setCreating] = useState(false);

  const addLearningObjective = () => {
    if (newObjective.trim() && !learningObjectives.includes(newObjective.trim())) {
      setLearningObjectives([...learningObjectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const removeLearningObjective = (objective: string) => {
    setLearningObjectives(learningObjectives.filter(obj => obj !== objective));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create assignments.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for the assignment.",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          total_points: parseInt(totalPoints) || 100,
          due_date: dueDate || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Store additional metadata in a separate table or as JSON if needed
      // For now, we'll include it in the description
      const enhancedDescription = `${description.trim()}

${subject ? `Subject: ${subject}` : ''}
${gradeLevel ? `Grade Level: ${gradeLevel}` : ''}
${instructions ? `\nInstructions:\n${instructions}` : ''}
${learningObjectives.length > 0 ? `\nLearning Objectives:\n${learningObjectives.map(obj => `• ${obj}`).join('\n')}` : ''}
${rubric ? `\nRubric:\n${rubric}` : ''}`;

      // Update with enhanced description
      await supabase
        .from('assignments')
        .update({ description: enhancedDescription })
        .eq('id', data.id);

      toast({
        title: "Assignment Created",
        description: `"${title}" has been created successfully.`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setTotalPoints('100');
      setDueDate('');
      setRubric('');
      setSubject('');
      setGradeLevel('');
      setInstructions('');
      setLearningObjectives([]);

      // Redirect to assignments page
      onTabChange?.('assignments');

    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating the assignment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Assignment</h1>
              <p className="text-muted-foreground">
                Create a new assignment for your students
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide the essential details for your assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Assignment Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Essay on Climate Change"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalPoints">Total Points</Label>
                  <Input
                    id="totalPoints"
                    type="number"
                    value={totalPoints}
                    onChange={(e) => setTotalPoints(e.target.value)}
                    placeholder="100"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="pe">Physical Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">Kindergarten</SelectItem>
                      <SelectItem value="1">1st Grade</SelectItem>
                      <SelectItem value="2">2nd Grade</SelectItem>
                      <SelectItem value="3">3rd Grade</SelectItem>
                      <SelectItem value="4">4th Grade</SelectItem>
                      <SelectItem value="5">5th Grade</SelectItem>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade</SelectItem>
                      <SelectItem value="9">9th Grade</SelectItem>
                      <SelectItem value="10">10th Grade</SelectItem>
                      <SelectItem value="11">11th Grade</SelectItem>
                      <SelectItem value="12">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Date (Optional)
                </Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Assignment Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a clear description of what students need to do..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Detailed Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Instructions</CardTitle>
              <CardDescription>
                Provide comprehensive instructions and expectations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instructions">Step-by-step Instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="1. Read the provided materials&#10;2. Research additional sources&#10;3. Write a 500-word essay..."
                  rows={4}
                />
              </div>

              {/* Learning Objectives */}
              <div className="space-y-3">
                <Label>Learning Objectives</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {learningObjectives.map((objective) => (
                    <Badge key={objective} variant="secondary" className="flex items-center gap-1">
                      {objective}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeLearningObjective(objective)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Students will be able to analyze..."
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningObjective())}
                  />
                  <Button type="button" onClick={addLearningObjective} disabled={!newObjective.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rubric">Grading Rubric</Label>
                <Textarea
                  id="rubric"
                  value={rubric}
                  onChange={(e) => setRubric(e.target.value)}
                  placeholder="Describe your grading criteria...&#10;&#10;Excellent (90-100): Demonstrates thorough understanding...&#10;Good (80-89): Shows good grasp of concepts...&#10;Satisfactory (70-79): Basic understanding evident..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onTabChange?.('assignments')}
            >
              Cancel
            </Button>
            
            <Button type="submit" disabled={creating}>
              <Save className="mr-2 h-4 w-4" />
              {creating ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentPage;