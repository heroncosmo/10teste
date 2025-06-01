export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_leads: {
        Row: {
          campaign_id: string
          created_at: string
          error_message: string | null
          has_response: boolean | null
          id: string
          lead_id: string
          message_template_id: string | null
          response_at: string | null
          sent_at: string | null
          sent_message: string | null
          status: string | null
          updated_at: string
          user_notes: string | null
          whatsapp_connection_id: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          error_message?: string | null
          has_response?: boolean | null
          id?: string
          lead_id: string
          message_template_id?: string | null
          response_at?: string | null
          sent_at?: string | null
          sent_message?: string | null
          status?: string | null
          updated_at?: string
          user_notes?: string | null
          whatsapp_connection_id?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          error_message?: string | null
          has_response?: boolean | null
          id?: string
          lead_id?: string
          message_template_id?: string | null
          response_at?: string | null
          sent_at?: string | null
          sent_message?: string | null
          status?: string | null
          updated_at?: string
          user_notes?: string | null
          whatsapp_connection_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_leads_message_template_id_fkey"
            columns: ["message_template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_leads_whatsapp_connection_id_fkey"
            columns: ["whatsapp_connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          failed_count: number | null
          id: string
          name: string
          response_count: number | null
          sent_count: number | null
          started_at: string | null
          status: string | null
          success_count: number | null
          total_leads: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          failed_count?: number | null
          id?: string
          name: string
          response_count?: number | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          success_count?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          failed_count?: number | null
          id?: string
          name?: string
          response_count?: number | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          success_count?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      empresas: {
        Row: {
          bairro: string | null
          capital_social: string | null
          cep: string | null
          cnae_descricao: string | null
          cnae_fiscal: number | null
          cnae_fiscal_secundario: string | null
          cnpj_basico: string | null
          codigo_municipio: number | null
          codigo_situacao_cadastral: number | null
          complemento: string | null
          data_inicio_atividade: string | null
          data_situacao_cadastral: string | null
          email: string | null
          identificador_matriz_filial: number | null
          logradouro: string | null
          motivo_situacao_cadastral: number | null
          municipio: string | null
          natureza_juridica: string | null
          nome_fantasia: string | null
          numero: string | null
          porte: number | null
          razao_social: string | null
          situacao_cadastral: string | null
          telefone_1: string | null
          telefone_2: string | null
          tem_dados_empresa: string | null
          tem_dados_socio: string | null
          tipo_logradouro: string | null
          uf: string | null
        }
        Insert: {
          bairro?: string | null
          capital_social?: string | null
          cep?: string | null
          cnae_descricao?: string | null
          cnae_fiscal?: number | null
          cnae_fiscal_secundario?: string | null
          cnpj_basico?: string | null
          codigo_municipio?: number | null
          codigo_situacao_cadastral?: number | null
          complemento?: string | null
          data_inicio_atividade?: string | null
          data_situacao_cadastral?: string | null
          email?: string | null
          identificador_matriz_filial?: number | null
          logradouro?: string | null
          motivo_situacao_cadastral?: number | null
          municipio?: string | null
          natureza_juridica?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          porte?: number | null
          razao_social?: string | null
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
          tem_dados_empresa?: string | null
          tem_dados_socio?: string | null
          tipo_logradouro?: string | null
          uf?: string | null
        }
        Update: {
          bairro?: string | null
          capital_social?: string | null
          cep?: string | null
          cnae_descricao?: string | null
          cnae_fiscal?: number | null
          cnae_fiscal_secundario?: string | null
          cnpj_basico?: string | null
          codigo_municipio?: number | null
          codigo_situacao_cadastral?: number | null
          complemento?: string | null
          data_inicio_atividade?: string | null
          data_situacao_cadastral?: string | null
          email?: string | null
          identificador_matriz_filial?: number | null
          logradouro?: string | null
          motivo_situacao_cadastral?: number | null
          municipio?: string | null
          natureza_juridica?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          porte?: number | null
          razao_social?: string | null
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
          tem_dados_empresa?: string | null
          tem_dados_socio?: string | null
          tipo_logradouro?: string | null
          uf?: string | null
        }
        Relationships: []
      }
      lead_tags: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          notes: string | null
          tag: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          notes?: string | null
          tag: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          notes?: string | null
          tag?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          capital_social: number | null
          city: string | null
          cnae_code: string | null
          cnae_description: string | null
          cnpj: string | null
          company_name: string
          company_status: string | null
          created_at: string
          email: string | null
          has_whatsapp: boolean | null
          id: string
          opening_date: string | null
          phone: string
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          capital_social?: number | null
          city?: string | null
          cnae_code?: string | null
          cnae_description?: string | null
          cnpj?: string | null
          company_name: string
          company_status?: string | null
          created_at?: string
          email?: string | null
          has_whatsapp?: boolean | null
          id?: string
          opening_date?: string | null
          phone: string
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          capital_social?: number | null
          city?: string | null
          cnae_code?: string | null
          cnae_description?: string | null
          cnpj?: string | null
          company_name?: string
          company_status?: string | null
          created_at?: string
          email?: string | null
          has_whatsapp?: boolean | null
          id?: string
          opening_date?: string | null
          phone?: string
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          segment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          segment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          segment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          response_rate: number | null
          updated_at: string
          usage_count: number | null
          variables_used: string[] | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          response_rate?: number | null
          updated_at?: string
          usage_count?: number | null
          variables_used?: string[] | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          response_rate?: number | null
          updated_at?: string
          usage_count?: number | null
          variables_used?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "message_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          campaigns_limit: number
          created_at: string
          description: string | null
          id: string
          leads_limit: number
          messages_limit: number
          name: string
          price_monthly: number
          updated_at: string
          whatsapp_connections_limit: number
        }
        Insert: {
          campaigns_limit?: number
          created_at?: string
          description?: string | null
          id?: string
          leads_limit?: number
          messages_limit?: number
          name: string
          price_monthly?: number
          updated_at?: string
          whatsapp_connections_limit?: number
        }
        Update: {
          campaigns_limit?: number
          created_at?: string
          description?: string | null
          id?: string
          leads_limit?: number
          messages_limit?: number
          name?: string
          price_monthly?: number
          updated_at?: string
          whatsapp_connections_limit?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_size: string | null
          business_type: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          is_superadmin: boolean | null
          updated_at: string
          user_id: string
          whatsapp_connections_limit: number | null
        }
        Insert: {
          business_size?: string | null
          business_type?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_superadmin?: boolean | null
          updated_at?: string
          user_id: string
          whatsapp_connections_limit?: number | null
        }
        Update: {
          business_size?: string | null
          business_type?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_superadmin?: boolean | null
          updated_at?: string
          user_id?: string
          whatsapp_connections_limit?: number | null
        }
        Relationships: []
      }
      target_preferences: {
        Row: {
          created_at: string
          id: string
          target_locations: string[] | null
          target_segments: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_locations?: string[] | null
          target_segments?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_locations?: string[] | null
          target_segments?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean | null
          payment_reference: string | null
          plan_id: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_reference?: string | null
          plan_id: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_reference?: string | null
          plan_id?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_connections: {
        Row: {
          connected_at: string | null
          created_at: string
          error_message: string | null
          id: string
          instance_id: string | null
          last_used_at: string | null
          name: string
          phone_number: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          last_used_at?: string | null
          name: string
          phone_number?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instance_id?: string | null
          last_used_at?: string | null
          name?: string
          phone_number?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_connections_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          api_key: string
          created_at: string
          current_free_users: number | null
          current_user_id: string | null
          host: string
          id: string
          instance_id: string
          is_available: boolean | null
          max_free_users: number | null
          name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          current_free_users?: number | null
          current_user_id?: string | null
          host?: string
          id?: string
          instance_id: string
          is_available?: boolean | null
          max_free_users?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          current_free_users?: number | null
          current_user_id?: string | null
          host?: string
          id?: string
          instance_id?: string
          is_available?: boolean | null
          max_free_users?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
