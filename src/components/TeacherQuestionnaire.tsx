import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'College/University', 'Adult Education'
];

const SUBJECTS = [
  'English/Language Arts', 'Mathematics', 'Science', 'Social Studies', 'History',
  'Foreign Languages', 'Art', 'Music', 'Physical Education', 'Computer Science',
  'Special Education', 'Other'
];

interface TeacherQuestionnaireProps {
  onComplete: () => void;
}

const TeacherQuestionnaire: React.FC<TeacherQuestionnaireProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    schoolName: '',
    gradeLevels: [] as string[],
    subjects: [] as string[],
    yearsTeaching: '',
    studentCount: '',
    preferredGradingStyle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGradeLevelChange = (gradeLevel: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        gradeLevels: [...prev.gradeLevels, gradeLevel]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        gradeLevels: prev.gradeLevels.filter(level => level !== gradeLevel)
      }));
    }
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          school_name: formData.schoolName,
          grade_levels: formData.gradeLevels,
          subjects: formData.subjects,
          years_teaching: parseInt(formData.yearsTeaching) || null,
          student_count: parseInt(formData.studentCount) || null,
          preferred_grading_style: formData.preferredGradingStyle,
          onboarding_completed: true
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome aboard!",
        description: "Your teaching profile has been set up successfully.",
      });

      onComplete();
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">GradeHelp</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Tell us about your teaching
          </h1>
          <p className="text-muted-foreground">
            Help us customize GradeHelp to fit your classroom perfectly
          </p>
        </div>

        {/* Questionnaire Form */}
        <Card className="p-8 card-elevated">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">{error}</p>
              </div>
            )}

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Your Name</span>
              </Label>
              <Input
                id="displayName"
                type="text"
                placeholder="How should we address you? (e.g., Ms. Johnson, Mr. Smith)"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="bg-surface transition-colors"
                required
              />
            </div>

            {/* School Name */}
            <div className="space-y-2">
              <Label htmlFor="schoolName" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>School Name</span>
              </Label>
              <Input
                id="schoolName"
                type="text"
                placeholder="Lincoln Elementary School"
                value={formData.schoolName}
                onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                className="bg-surface transition-colors"
              />
            </div>

            {/* Grade Levels */}
            <div className="space-y-4">
              <Label className="text-base font-medium">What grade levels do you teach?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {GRADE_LEVELS.map((grade) => (
                  <div key={grade} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade}`}
                      checked={formData.gradeLevels.includes(grade)}
                      onCheckedChange={(checked) => handleGradeLevelChange(grade, checked as boolean)}
                    />
                    <Label htmlFor={`grade-${grade}`} className="text-sm">{grade}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-4">
              <Label className="text-base font-medium">What subjects do you teach?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SUBJECTS.map((subject) => (
                  <div key={subject} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={formData.subjects.includes(subject)}
                      onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    />
                    <Label htmlFor={`subject-${subject}`} className="text-sm">{subject}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Years Teaching & Student Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="yearsTeaching" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Years Teaching</span>
                </Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, yearsTeaching: value }))}>
                  <SelectTrigger className="bg-surface">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">First year</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-20">11-20 years</SelectItem>
                    <SelectItem value="20+">20+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCount" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Approximate Student Count</span>
                </Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, studentCount: value }))}>
                  <SelectTrigger className="bg-surface">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-20">1-20 students</SelectItem>
                    <SelectItem value="21-50">21-50 students</SelectItem>
                    <SelectItem value="51-100">51-100 students</SelectItem>
                    <SelectItem value="101-200">101-200 students</SelectItem>
                    <SelectItem value="200+">200+ students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grading Style */}
            <div className="space-y-4">
              <Label className="text-base font-medium">What's your preferred grading approach?</Label>
              <RadioGroup
                value={formData.preferredGradingStyle}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferredGradingStyle: value }))}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed-feedback" id="detailed" />
                  <Label htmlFor="detailed">Detailed feedback with specific suggestions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quick-scores" id="quick" />
                  <Label htmlFor="quick">Quick scores with brief comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rubric-based" id="rubric" />
                  <Label htmlFor="rubric">Rubric-based grading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">Flexible - varies by assignment</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading || !formData.displayName.trim() || formData.gradeLevels.length === 0 || formData.subjects.length === 0}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span>Setting up your profile...</span>
                </div>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TeacherQuestionnaire;