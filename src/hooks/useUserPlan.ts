
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Plan, UserPlan } from '@/types/database';
import { toast } from 'sonner';

interface UserPlanDetails extends UserPlan {
  plan: Plan;
}

export function useUserPlan() {
  const [userPlan, setUserPlan] = useState<UserPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserPlan();
    } else {
      setUserPlan(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserPlan = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_plans')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setUserPlan(null);
        } else {
          throw error;
        }
      } else {
        setUserPlan(data as UserPlanDetails);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
      toast.error('Falha ao carregar informações do plano');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userPlan,
    isLoading,
    refetch: fetchUserPlan
  };
}
