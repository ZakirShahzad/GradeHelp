import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  assignmentsTotal: number;
  assignmentsGraded: number;
  totalStudents: number;
  totalClasses: number;
  averageScore: number;
  hoursEstimated: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch assignments count
        const { count: totalAssignments } = await supabase
          .from('assignments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch graded submissions count (submissions with score)
        const { count: gradedSubmissions } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('score', 'is', null);

        // Fetch total students count
        const { count: totalStudents } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch total classes count
        const { count: totalClasses } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Fetch average score from submissions
        const { data: submissions } = await supabase
          .from('submissions')
          .select('score')
          .eq('user_id', user.id)
          .not('score', 'is', null);

        const averageScore = submissions && submissions.length > 0 
          ? submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / submissions.length
          : 0;

        // Estimate hours saved (rough calculation: 5 minutes per graded submission)
        const hoursEstimated = Math.round((gradedSubmissions || 0) * 5 / 60 * 10) / 10;

        setStats({
          assignmentsTotal: totalAssignments || 0,
          assignmentsGraded: gradedSubmissions || 0,
          totalStudents: totalStudents || 0,
          totalClasses: totalClasses || 0,
          averageScore: Math.round(averageScore * 10) / 10,
          hoursEstimated
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading, error };
};