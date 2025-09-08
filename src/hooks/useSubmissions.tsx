import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  student_id?: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  score?: number;
  feedback?: string;
  submitted_at?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  student?: Student;
}

export interface CreateSubmissionData {
  assignment_id: string;
  student_id: string;
  score?: number;
  feedback?: string;
  submitted_at?: string;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch submissions for an assignment
  const fetchSubmissions = async (assignmentId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          student:students(*)
        `)
        .eq('assignment_id', assignmentId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .order('last_name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  // Create a new submission
  const createSubmission = async (submissionData: CreateSubmissionData) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submissions')
      .insert({
        ...submissionData,
        user_id: user.id,
      })
      .select(`
        *,
        student:students(*)
      `)
      .single();

    if (error) throw error;

    setSubmissions(prev => [data, ...prev]);
    toast({
      title: "Success",
      description: "Submission created successfully.",
    });

    return data;
  };

  // Update a submission (usually with grading results)
  const updateSubmission = async (id: string, updates: Partial<CreateSubmissionData>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        student:students(*)
      `)
      .single();

    if (error) throw error;

    setSubmissions(prev => prev.map(sub => 
      sub.id === id ? data : sub
    ));

    return data;
  };

  // Create a new student
  const createStudent = async (studentData: {
    first_name: string;
    last_name: string;
    email?: string;
    student_id?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('students')
      .insert({
        ...studentData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    setStudents(prev => [...prev, data]);
    toast({
      title: "Success",
      description: "Student added successfully.",
    });

    return data;
  };

  // Bulk create submissions for an assignment
  const createBulkSubmissions = async (assignmentId: string, studentIds: string[]) => {
    if (!user) throw new Error('User not authenticated');

    const submissionsData = studentIds.map(studentId => ({
      assignment_id: assignmentId,
      student_id: studentId,
      user_id: user.id,
    }));

    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionsData)
      .select(`
        *,
        student:students(*)
      `);

    if (error) throw error;

    setSubmissions(prev => [...(data || []), ...prev]);
    toast({
      title: "Success",
      description: `Created ${data?.length || 0} submissions.`,
    });

    return data;
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  return {
    submissions,
    students,
    loading,
    error,
    fetchSubmissions,
    fetchStudents,
    createSubmission,
    updateSubmission,
    createStudent,
    createBulkSubmissions,
  };
};