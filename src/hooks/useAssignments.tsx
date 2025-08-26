import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  class_id: string | null;
  total_points: number | null;
  created_at: string;
  updated_at: string;
}

interface CreateAssignmentData {
  title: string;
  description?: string;
  due_date?: string;
  class_id?: string;
  total_points?: number;
}

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAssignments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError);
        setError(assignmentsError.message);
      } else {
        setAssignments(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignmentData: CreateAssignmentData) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert({
        ...assignmentData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Assignment created successfully!",
    });

    // Refresh assignments list
    await fetchAssignments();
    return data;
  };

  const updateAssignment = async (id: string, updates: Partial<CreateAssignmentData>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('assignments')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update assignment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Assignment updated successfully!",
    });

    // Refresh assignments list
    await fetchAssignments();
    return data;
  };

  const deleteAssignment = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Assignment deleted successfully!",
    });

    // Refresh assignments list
    await fetchAssignments();
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  return {
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    refetch: fetchAssignments,
  };
};