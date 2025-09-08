import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { useSubmissions, Student } from '@/hooks/useSubmissions';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  UserCheck,
  Mail,
  IdCard
} from 'lucide-react';

interface StudentManagementProps {
  onStudentSelect?: (students: Student[]) => void;
  selectedStudents?: string[];
}

export const StudentManagement: React.FC<StudentManagementProps> = ({
  onStudentSelect,
  selectedStudents = []
}) => {
  const { students, createStudent, loading } = useSubmissions();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    student_id: ''
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedStudents);

  const handleAddStudent = async () => {
    if (!newStudent.first_name.trim() || !newStudent.last_name.trim()) {
      return;
    }

    try {
      await createStudent({
        first_name: newStudent.first_name.trim(),
        last_name: newStudent.last_name.trim(),
        email: newStudent.email.trim() || undefined,
        student_id: newStudent.student_id.trim() || undefined,
      });

      // Reset form
      setNewStudent({
        first_name: '',
        last_name: '',
        email: '',
        student_id: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    const updatedIds = selectedIds.includes(studentId)
      ? selectedIds.filter(id => id !== studentId)
      : [...selectedIds, studentId];
    
    setSelectedIds(updatedIds);
    
    if (onStudentSelect) {
      const selectedStudentObjects = students.filter(s => updatedIds.includes(s.id));
      onStudentSelect(selectedStudentObjects);
    }
  };

  const selectAll = () => {
    const allIds = students.map(s => s.id);
    setSelectedIds(allIds);
    if (onStudentSelect) {
      onStudentSelect(students);
    }
  };

  const selectNone = () => {
    setSelectedIds([]);
    if (onStudentSelect) {
      onStudentSelect([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Student Management
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's information to add them to your class.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={newStudent.first_name}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newStudent.last_name}
                      onChange={(e) => setNewStudent(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="student@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID (Optional)</Label>
                  <Input
                    id="studentId"
                    value={newStudent.student_id}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, student_id: e.target.value }))}
                    placeholder="Enter student ID"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddStudent}
                  disabled={!newStudent.first_name.trim() || !newStudent.last_name.trim()}
                >
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage your students and select who to include in grading batches.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {students.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedIds.length} of {students.length} students selected
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Select None
              </Button>
            </div>
          </div>
        )}

        {students.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Students Added</h3>
            <p className="text-muted-foreground mb-4">
              Add students to start creating assignments and grading their work.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Student
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 max-h-80 overflow-y-auto">
            {students.map((student) => (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedIds.includes(student.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleStudentToggle(student.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(student.id)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedIds.includes(student.id) && (
                      <UserCheck className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {student.first_name} {student.last_name}
                      </span>
                      {student.student_id && (
                        <Badge variant="outline" className="text-xs">
                          <IdCard className="mr-1 h-3 w-3" />
                          {student.student_id}
                        </Badge>
                      )}
                    </div>
                    {student.email && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Mail className="mr-1 h-3 w-3" />
                        {student.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentManagement;