
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  business_type: string | null;
  business_size: string | null;
  is_admin: boolean;
  is_superadmin: boolean;
  whatsapp_connections_limit?: number;
  created_at: string;
  updated_at: string;
}

export interface TargetPreferences {
  id: string;
  user_id: string;
  target_segments: string[];
  target_locations: string[];
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  leads_limit: number;
  messages_limit: number;
  campaigns_limit: number;
  whatsapp_connections_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface Empresa {
  id?: string;
  cnpj_basico: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  tem_dados_empresa: string | null;
  tem_dados_socio: string | null;
  natureza_juridica: string | null;
  porte: number | null;
  capital_social: string | null;
  tipo_logradouro: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  codigo_municipio: number | null;
  municipio: string | null;
  uf: string | null;
  telefone_1: string | null;
  telefone_2: string | null;
  email: string | null;
  cnae_fiscal: number | null;
  cnae_descricao: string | null;
  cnae_fiscal_secundario: string | null;
  data_inicio_atividade: string | null;
  codigo_situacao_cadastral: number | null;
  situacao_cadastral: string | null;
  data_situacao_cadastral: string | null;
  motivo_situacao_cadastral: number | null;
  identificador_matriz_filial: number | null;
}

// Legacy Lead interface for compatibility
export interface Lead {
  id: string;
  user_id: string;
  cnpj: string | null;
  company_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  cnae_code: string | null;
  cnae_description: string | null;
  opening_date: string | null;
  capital_social: number | null;
  company_status: string | null;
  has_whatsapp: boolean | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  total_leads: number;
  sent_count: number;
  success_count: number;
  failed_count: number;
  response_count: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignLead {
  id: string;
  campaign_id: string;
  lead_id: string;
  message_template_id: string | null;
  whatsapp_connection_id: string | null;
  status: string;
  sent_message: string | null;
  sent_at: string | null;
  error_message: string | null;
  has_response: boolean | null;
  response_at: string | null;
  user_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageCategory {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  segment: string | null;
  created_at: string;
  updated_at: string;
  message_count?: number; // For computed fields
}

export interface MessageTemplate {
  id: string;
  category_id: string;
  content: string;
  variables_used: string[] | null;
  usage_count: number;
  response_rate: number | null;
  created_at: string;
  updated_at: string;
  name?: string; // For compatibility
  description?: string; // For compatibility
  variables?: string[]; // For compatibility
}

export interface WhatsappConnection {
  id: string;
  user_id: string;
  instance_id: string | null;
  name: string;
  status: string;
  phone_number: string | null;
  connected_at: string | null;
  last_used_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadTag {
  id: string;
  user_id: string;
  lead_id: string;
  tag: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WhatsappInstance {
  id: string;
  name: string;
  instance_id: string;
  api_key: string;
  host: string;
  is_available: boolean;
  current_user_id: string | null;
  max_free_users: number;
  current_free_users: number;
  created_at: string;
  updated_at: string;
}

// Insert types for database operations
export interface WhatsappInstanceInsert {
  name: string;
  instance_id: string;
  api_key: string;
  host?: string;
  is_available?: boolean;
  max_free_users?: number;
  current_free_users?: number;
}
