
import { supabase } from '@/integrations/supabase/client';
import type { Campaign, CampaignLead, Empresa } from '@/types/database';
import { toast } from 'sonner';

interface WhatsAppMessage {
  phone: string;
  message: string;
  delayMessage?: number;
  shouldVaryMessage?: boolean;
}

// Sistema simulado para demonstração - Número interno da empresa
const COMPANY_WHATSAPP_NUMBER = "+55 11 9 9999-9999";
const COMPANY_NAME = "Sistema de Prospecção";

export async function simulateWhatsAppSend({ phone, message }: WhatsAppMessage) {
  // Simular delay de envio realista
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  // Simular taxa de sucesso de 95%
  const success = Math.random() > 0.05;
  
  if (success) {
    return {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      simulatedNumber: COMPANY_WHATSAPP_NUMBER
    };
  } else {
    throw new Error('Falha simulada no envio');
  }
}

export async function startSimulatedCampaign(campaignId: string, empresaIds: string[], messageContent: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    // Buscar empresas selecionadas pela ID ou CNPJ
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*')
      .in('cnpj_basico', empresaIds);

    if (empresasError) throw empresasError;

    // Atualizar campanha para ativa
    await supabase
      .from('campaigns')
      .update({ 
        status: 'active',
        started_at: new Date().toISOString(),
        total_leads: empresas?.length || 0
      })
      .eq('id', campaignId);

    let sentCount = 0;
    let successCount = 0;
    let failedCount = 0;

    // Processar cada empresa
    for (const empresa of empresas || []) {
      try {
        // Personalizar mensagem com dados da empresa
        const personalizedMessage = messageContent
          .replace(/\{nome\}/g, empresa.razao_social || empresa.nome_fantasia || 'Empresa')
          .replace(/\{cidade\}/g, empresa.municipio || 'Sua cidade')
          .replace(/\{segmento\}/g, empresa.cnae_descricao || 'Seu segmento');

        // Simular envio
        const result = await simulateWhatsAppSend({
          phone: empresa.telefone_1 || '11999999999',
          message: personalizedMessage
        });

        // Registrar envio bem-sucedido na tabela campaign_leads
        await supabase
          .from('campaign_leads')
          .insert({
            campaign_id: campaignId,
            lead_id: empresa.cnpj_basico || 'unknown',
            status: 'sent',
            sent_message: personalizedMessage,
            sent_at: new Date().toISOString()
          });

        sentCount++;
        successCount++;

        // Simular algumas respostas (20% de chance)
        if (Math.random() < 0.2) {
          await supabase
            .from('campaign_leads')
            .update({
              has_response: true,
              response_at: new Date().toISOString()
            })
            .eq('campaign_id', campaignId)
            .eq('lead_id', empresa.cnpj_basico);
        }

      } catch (error) {
        // Registrar falha
        await supabase
          .from('campaign_leads')
          .insert({
            campaign_id: campaignId,
            lead_id: empresa.cnpj_basico || 'unknown',
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Erro desconhecido',
            sent_at: new Date().toISOString()
          });

        failedCount++;
      }

      // Delay entre envios para simular comportamento humano
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));
    }

    // Finalizar campanha
    await supabase
      .from('campaigns')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        sent_count: sentCount,
        success_count: successCount,
        failed_count: failedCount,
        response_count: Math.floor(successCount * 0.2) // 20% de taxa de resposta simulada
      })
      .eq('id', campaignId);

    toast.success(`Campanha concluída! ${successCount} mensagens enviadas com sucesso.`);
    
    return {
      sent: sentCount,
      success: successCount,
      failed: failedCount,
      simulatedNumber: COMPANY_WHATSAPP_NUMBER
    };

  } catch (error) {
    console.error('Error in simulated campaign:', error);
    
    // Marcar campanha como falhou
    await supabase
      .from('campaigns')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', campaignId);

    throw error;
  }
}

export function generateSimulatedReport(campaignData: any) {
  return {
    totalMessages: campaignData.total_leads || 0,
    sentMessages: campaignData.sent_count || 0,
    successRate: campaignData.sent_count > 0 ? ((campaignData.success_count || 0) / campaignData.sent_count * 100).toFixed(1) : '0',
    responseRate: campaignData.success_count > 0 ? ((campaignData.response_count || 0) / campaignData.success_count * 100).toFixed(1) : '0',
    simulatedNumber: COMPANY_WHATSAPP_NUMBER,
    companyName: COMPANY_NAME,
    timestamp: new Date().toLocaleString('pt-BR')
  };
}

// Função para detectar se o usuário tem plano pago
export async function checkIfUserHasPaidPlan(userId: string): Promise<boolean> {
  try {
    const { data: userPlan, error } = await supabase
      .from('user_plans')
      .select(`
        *,
        plan:plans(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error) return false;

    // Se o plano não é gratuito, é pago
    return userPlan?.plan?.name !== 'Gratuito';
  } catch (error) {
    console.error('Error checking user plan:', error);
    return false;
  }
}

// Funções removidas que causavam erro
export function disconnectInstance() {
  // Placeholder function for compatibility
}

export function forceDisconnectInstance() {
  // Placeholder function for compatibility
}
