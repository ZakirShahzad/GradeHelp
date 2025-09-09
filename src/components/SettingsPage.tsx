import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  School, 
  BookOpen, 
  Settings, 
  Save,
  Trash2,
  Plus,
  X
} from 'lucide-react';

interface SettingsPageProps {
  onTabChange?: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onTabChange }) => {
  const { profile, loading: profileLoading } = useProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Profile form state
  const [displayName, setDisplayName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [yearsTeaching, setYearsTeaching] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [preferredGradingStyle, setPreferredGradingStyle] = useState('');
  
  // Grade levels and subjects
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [newGradeLevel, setNewGradeLevel] = useState('');
  const [newSubject, setNewSubject] = useState('');
  
  // Loading states
  const [saving, setSaving] = useState(false);
  
  // Populate form with profile data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setSchoolName(profile.school_name || '');
      setYearsTeaching(profile.years_teaching?.toString() || '');
      setStudentCount(profile.student_count?.toString() || '');
      setPreferredGradingStyle(profile.preferred_grading_style || '');
      setGradeLevels(profile.grade_levels || []);
      setSubjects(profile.subjects || []);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          school_name: schoolName,
          years_teaching: yearsTeaching ? parseInt(yearsTeaching) : null,
          student_count: studentCount ? parseInt(studentCount) : null,
          preferred_grading_style: preferredGradingStyle,
          grade_levels: gradeLevels,
          subjects: subjects,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addGradeLevel = () => {
    if (newGradeLevel && !gradeLevels.includes(newGradeLevel)) {
      setGradeLevels([...gradeLevels, newGradeLevel]);
      setNewGradeLevel('');
    }
  };

  const removeGradeLevel = (level: string) => {
    setGradeLevels(gradeLevels.filter(g => g !== level));
  };

  const addSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Password reset function
  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "No email found for password reset.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Data export function
  const handleDataExport = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [assignmentsRes, submissionsRes, studentsRes] = await Promise.all([
        supabase.from('assignments').select('*').eq('user_id', user.id),
        supabase.from('submissions').select('*').eq('user_id', user.id),
        supabase.from('students').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        profile: profile,
        assignments: assignmentsRes.data || [],
        submissions: submissionsRes.data || [],
        students: studentsRes.data || [],
        exported_at: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gradeai-data-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been exported and downloaded as a JSON file.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, teaching preferences, and account settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="teaching" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Teaching
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed from this interface
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Enter your school name"
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teaching Settings */}
          <TabsContent value="teaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Information
                </CardTitle>
                <CardDescription>
                  Configure your teaching context for better AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsTeaching">Years Teaching</Label>
                    <Input
                      id="yearsTeaching"
                      type="number"
                      value={yearsTeaching}
                      onChange={(e) => setYearsTeaching(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="studentCount">Number of Students</Label>
                    <Input
                      id="studentCount"
                      type="number"
                      value={studentCount}
                      onChange={(e) => setStudentCount(e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Grade Levels */}
                <div className="space-y-3">
                  <Label>Grade Levels You Teach</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {gradeLevels.map((level) => (
                      <Badge key={level} variant="secondary" className="flex items-center gap-1">
                        {level}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeGradeLevel(level)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select value={newGradeLevel} onValueChange={setNewGradeLevel}>
                      <SelectTrigger className="flex-1">
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
                        <SelectItem value="College">College</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addGradeLevel} disabled={!newGradeLevel}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Subjects */}
                <div className="space-y-3">
                  <Label>Subjects You Teach</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                        {subject}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeSubject(subject)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter subject name"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    />
                    <Button onClick={addSubject} disabled={!newSubject}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Grading Style */}
                <div className="space-y-2">
                  <Label htmlFor="gradingStyle">Preferred Grading Style</Label>
                  <Select value={preferredGradingStyle} onValueChange={setPreferredGradingStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grading style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional (A-F)</SelectItem>
                      <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
                      <SelectItem value="standards">Standards-Based</SelectItem>
                      <SelectItem value="mastery">Mastery-Based</SelectItem>
                      <SelectItem value="rubric">Rubric-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Teaching Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about assignment updates
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Save Grades</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save grades as you work
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Suggestions</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable AI-powered grading suggestions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Account Actions</h4>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handlePasswordReset}
                    >
                      Change Password
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleDataExport}
                    >
                      Export My Data
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;