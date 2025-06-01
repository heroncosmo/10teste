
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { WhatsappInstance, WhatsappInstanceInsert } from '@/types/database';

export function useWhatsappInstances() {
  const [instances, setInstances] = useState<WhatsappInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInstances = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*');

      if (error) throw error;
      setInstances(data || []);
    } catch (error) {
      console.error('Error fetching instances:', error);
      toast.error('Erro ao carregar instâncias WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const addInstance = async (instanceData: WhatsappInstanceInsert): Promise<WhatsappInstance> => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert({
          name: instanceData.name,
          instance_id: instanceData.instance_id,
          api_key: instanceData.api_key,
          host: instanceData.host || 'https://api.z-api.io',
          is_available: instanceData.is_available ?? true,
          max_free_users: instanceData.max_free_users ?? 5,
          current_free_users: instanceData.current_free_users ?? 0
        })
        .select()
        .single();

      if (error) throw error;
      
      setInstances(prev => [...prev, data]);
      toast.success('Instância adicionada com sucesso');
      return data;
    } catch (error) {
      console.error('Error adding instance:', error);
      toast.error('Erro ao adicionar instância');
      throw error;
    }
  };

  const updateInstance = async (id: string, updates: Partial<WhatsappInstance>) => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setInstances(prev => prev.map(inst => inst.id === id ? data : inst));
      toast.success('Instância atualizada com sucesso');
      return data;
    } catch (error) {
      console.error('Error updating instance:', error);
      toast.error('Erro ao atualizar instância');
      throw error;
    }
  };

  const deleteInstance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInstances(prev => prev.filter(inst => inst.id !== id));
      toast.success('Instância removida com sucesso');
    } catch (error) {
      console.error('Error deleting instance:', error);
      toast.error('Erro ao remover instância');
      throw error;
    }
  };

  const allocateInstance = async (userId: string): Promise<WhatsappInstance> => {
    // Simulated allocation for free users
    const availableInstance = instances.find(inst => inst.is_available);
    if (!availableInstance) {
      throw new Error('Nenhuma instância disponível');
    }
    
    return availableInstance;
  };

  const releaseInstance = async (instanceId: string, userId: string) => {
    // Simulated release
    toast.success('Instância liberada');
  };

  const disconnectUser = async (instanceId: string, userId: string) => {
    // Simulated disconnect
    toast.success('Usuário desconectado da instância');
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  return {
    instances,
    isLoading,
    fetchInstances,
    addInstance,
    updateInstance,
    deleteInstance,
    allocateInstance,
    releaseInstance,
    disconnectUser
  };
}
