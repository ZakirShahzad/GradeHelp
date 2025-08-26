import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  total_points: number | null;
  created_at: string;
  updated_at: string;
}

interface AssignmentWithStats extends Assignment {
  totalSubmissions: number;
  gradedSubmissions: number;
  status: 'draft' | 'active' | 'completed';
}

export const useRecentAssignments = (limit: number = 5) => {
  const [assignments, setAssignments] = useState<AssignmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentAssignments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch recent assignments
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from('assignments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (assignmentsError) {
          throw assignmentsError;
        }

        if (!assignmentsData || assignmentsData.length === 0) {
          setAssignments([]);
          return;
        }

        // For each assignment, get submission stats
        const assignmentsWithStats = await Promise.all(
          assignmentsData.map(async (assignment) => {
            // Get total submissions for this assignment
            const { count: totalSubmissions } = await supabase
              .from('submissions')
              .select('*', { count: 'exact', head: true })
              .eq('assignment_id', assignment.id)
              .eq('user_id', user.id);

            // Get graded submissions for this assignment
            const { count: gradedSubmissions } = await supabase
              .from('submissions')
              .select('*', { count: 'exact', head: true })
              .eq('assignment_id', assignment.id)
              .eq('user_id', user.id)
              .not('score', 'is', null);

            // Determine status based on submissions and due date
            let status: 'draft' | 'active' | 'completed' = 'draft';
            
            if (totalSubmissions && totalSubmissions > 0) {
              if (gradedSubmissions === totalSubmissions) {
                status = 'completed';
              } else {
                status = 'active';
              }
            } else if (assignment.due_date) {
              const dueDate = new Date(assignment.due_date);
              const now = new Date();
              if (dueDate > now) {
                status = 'active';
              }
            }

            return {
              ...assignment,
              totalSubmissions: totalSubmissions || 0,
              gradedSubmissions: gradedSubmissions || 0,
              status
            } as AssignmentWithStats;
          })
        );

        setAssignments(assignmentsWithStats);

      } catch (err) {
        console.error('Error fetching recent assignments:', err);
        setError('Failed to load recent assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAssignments();
  }, [user, limit]);

  return { assignments, loading, error };
};