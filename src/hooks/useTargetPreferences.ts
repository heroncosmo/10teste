import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { TargetPreferences } from '@/types/database';
import { toast } from 'sonner';

export function useTargetPreferences() {
  const [preferences, setPreferences] = useState<TargetPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('target_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          setPreferences(null);
        } else {
          throw error;
        }
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching target preferences:', error);
      toast.error('Falha ao carregar preferências de público-alvo');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<TargetPreferences>) => {
    if (!user) return null;
    
    try {
      // If we already have preferences, update them
      if (preferences) {
        const { data, error } = await supabase
          .from('target_preferences')
          .update(updates)
          .eq('id', preferences.id)
          .select();

        if (error) throw error;
        setPreferences(data[0]);
        toast.success('Preferências atualizadas com sucesso');
        return data[0];
      } 
      // Otherwise, create new preferences
      else {
        const { data, error } = await supabase
          .from('target_preferences')
          .insert({
            user_id: user.id,
            ...updates
          })
          .select();

        if (error) throw error;
        setPreferences(data[0]);
        toast.success('Preferências criadas com sucesso');
        return data[0];
      }
    } catch (error) {
      console.error('Error updating target preferences:', error);
      toast.error('Falha ao atualizar preferências de público-alvo');
      return null;
    }
  };

  return {
    preferences,
    isLoading,
    fetchPreferences,
    updatePreferences
  };
}
