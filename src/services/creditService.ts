import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/lib/database.types';

// Tipos para uso no serviço
export type UserCredits = Database['public']['Tables']['user_credits']['Row'];
export type PlanType = 'free' | 'basic' | 'premium' | 'enterprise';

// Configurações dos planos
export const PLAN_CONFIG = {
  free: {
    credits: 10,
    unlimitedSearch: false,
    filterCnae: false,
    autoWhatsapp: false,
    autopilot: false,
    duration: 0, // Em dias (0 = sem expiração)
    price: 0
  },
  basic: {
    credits: 50,
    unlimitedSearch: true,
    filterCnae: true,
    autoWhatsapp: false,
    autopilot: false,
    duration: 30,
    price: 29.90
  },
  premium: {
    credits: 150,
    unlimitedSearch: true,
    filterCnae: true,
    autoWhatsapp: true,
    autopilot: false,
    duration: 30,
    price: 89.90
  },
  enterprise: {
    credits: 500,
    unlimitedSearch: true,
    filterCnae: true,
    autoWhatsapp: true,
    autopilot: true,
    duration: 30,
    price: 199.90
  }
};

// Serviço para gerenciar créditos e desbloqueios
export const creditService = {
  // Obter créditos do usuário
  getUserCredits: async (userId: string): Promise<UserCredits | null> => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar créditos do usuário:', error);
      return null;
    }
    
    return data;
  },
  
  // Inicializar créditos para um novo usuário
  initializeUserCredits: async (userId: string, planType: PlanType = 'free'): Promise<boolean> => {
    const plan = PLAN_CONFIG[planType];
    
    // Definir datas de início e expiração
    const startDate = new Date();
    const expiryDate = plan.duration > 0 
      ? new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000)
      : null;
    
    const { error } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        credits_total: plan.credits,
        credits_used: 0,
        plan_type: planType,
        plan_started_at: startDate.toISOString(),
        plan_expires_at: expiryDate ? expiryDate.toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erro ao inicializar créditos do usuário:', error);
      return false;
    }
    
    return true;
  },
  
  // Atualizar plano do usuário
  updateUserPlan: async (userId: string, planType: PlanType): Promise<boolean> => {
    const plan = PLAN_CONFIG[planType];
    
    // Obter créditos atuais
    const currentCredits = await creditService.getUserCredits(userId);
    if (!currentCredits) return false;
    
    // Definir datas de início e expiração
    const startDate = new Date();
    const expiryDate = plan.duration > 0 
      ? new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000)
      : null;
    
    const { error } = await supabase
      .from('user_credits')
      .update({
        credits_total: plan.credits,
        plan_type: planType,
        plan_started_at: startDate.toISOString(),
        plan_expires_at: expiryDate ? expiryDate.toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao atualizar plano do usuário:', error);
      return false;
    }
    
    return true;
  },
  
  // Verificar se o usuário tem créditos disponíveis
  hasAvailableCredits: async (userId: string): Promise<boolean> => {
    const credits = await creditService.getUserCredits(userId);
    if (!credits) return false;
    
    // Verificar se o plano expirou
    if (credits.plan_expires_at) {
      const expiryDate = new Date(credits.plan_expires_at);
      if (expiryDate < new Date()) {
        return false;
      }
    }
    
    return credits.credits_used < credits.credits_total;
  },
  
  // Obter quantidade de créditos restantes
  getRemainingCredits: async (userId: string): Promise<number> => {
    const credits = await creditService.getUserCredits(userId);
    if (!credits) return 0;
    
    return Math.max(0, credits.credits_total - credits.credits_used);
  },
  
  // Consumir um crédito
  useCredit: async (userId: string, leadId: string): Promise<boolean> => {
    // Verificar se o usuário tem créditos disponíveis
    const hasCredits = await creditService.hasAvailableCredits(userId);
    if (!hasCredits) return false;
    
    // Iniciar uma transação para garantir atomicidade
    const { error: transactionError } = await supabase.rpc('use_credit_transaction', {
      p_user_id: userId,
      p_lead_id: leadId
    });
    
    if (transactionError) {
      console.error('Erro ao consumir crédito:', transactionError);
      
      // Fallback se a função RPC não estiver disponível
      // 1. Incrementar créditos usados
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          credits_used: supabase.sql`credits_used + 1`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Erro ao atualizar créditos usados:', updateError);
        return false;
      }
      
      // 2. Registrar o lead desbloqueado
      const { error: unlockError } = await supabase
        .from('unlocked_leads')
        .insert({
          user_id: userId,
          lead_id: leadId,
          unlocked_at: new Date().toISOString()
        });
      
      if (unlockError) {
        console.error('Erro ao registrar lead desbloqueado:', unlockError);
        return false;
      }
    }
    
    return true;
  },
  
  // Verificar se um lead já foi desbloqueado pelo usuário
  isLeadUnlocked: async (userId: string, leadId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('unlocked_leads')
      .select('*')
      .eq('user_id', userId)
      .eq('lead_id', leadId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = No results found
      console.error('Erro ao verificar se lead está desbloqueado:', error);
      return false;
    }
    
    return !!data;
  },
  
  // Obter leads desbloqueados pelo usuário
  getUnlockedLeads: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('unlocked_leads')
      .select('lead_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erro ao buscar leads desbloqueados:', error);
      return [];
    }
    
    return data.map(item => item.lead_id);
  }
};

export default creditService; 