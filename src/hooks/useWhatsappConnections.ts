
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/providers/AuthProvider';
import type { WhatsappConnection } from '@/types/database';

export function useWhatsappConnections() {
  const [connections, setConnections] = useState<WhatsappConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchConnections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Erro ao carregar conexões do WhatsApp');
    } finally {
      setIsLoading(false);
    }
  };

  const addConnection = async (connectionData?: Partial<WhatsappConnection>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .insert({
          user_id: user.id,
          name: connectionData?.name || `WhatsApp ${new Date().toLocaleString()}`,
          status: 'disconnected'
        })
        .select()
        .single();

      if (error) throw error;
      
      setConnections(prev => [...prev, data]);
      toast.success('Conexão WhatsApp adicionada com sucesso');
      return data;
    } catch (error) {
      console.error('Error adding connection:', error);
      toast.error('Erro ao adicionar conexão WhatsApp');
      throw error;
    }
  };

  const updateConnection = async (id: string, updates: Partial<WhatsappConnection>) => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_connections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setConnections(prev => prev.map(conn => conn.id === id ? data : conn));
      return data;
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Erro ao atualizar conexão WhatsApp');
      throw error;
    }
  };

  const updateConnectionName = async (id: string, name: string) => {
    return updateConnection(id, { name });
  };

  const deleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setConnections(prev => prev.filter(conn => conn.id !== id));
      toast.success('Conexão WhatsApp removida com sucesso');
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast.error('Erro ao remover conexão WhatsApp');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  return {
    connections,
    isLoading,
    fetchConnections,
    addConnection,
    updateConnection,
    updateConnectionName,
    deleteConnection
  };
}
