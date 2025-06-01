export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      campaign_leads: {
        Row: {
          campaign_id: string
          created_at: string
          error_message: string
          has_response: boolean
          id: string
          lead_id: string
          message_template_id: string
          response_at: string
          sent_at: string
          sent_message: string
          status: string
          updated_at: string
          user_notes: string
          whatsapp_connection_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          error_message?: string
          has_response?: boolean
          id?: string
          lead_id: string
          message_template_id: string
          response_at?: string
          sent_at?: string
          sent_message?: string
          status?: string
          updated_at?: string
          user_notes?: string
          whatsapp_connection_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          error_message?: string
          has_response?: boolean
          id?: string
          lead_id?: string
          message_template_id?: string
          response_at?: string
          sent_at?: string
          sent_message?: string
          status?: string
          updated_at?: string
          user_notes?: string
          whatsapp_connection_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          target_cnae: string | null
          target_count: number
          target_location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
          target_cnae?: string | null
          target_count?: number
          target_location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          target_cnae?: string | null
          target_count?: number
          target_location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      empresas: {
        Row: {
          abertura: string | null
          bairro: string | null
          capital_social: number | null
          cep: string | null
          cnae_fiscal: number | null
          cnae_descricao: string | null
          cnpj: string
          complemento: string | null
          ddd_1: string | null
          ddd_2: string | null
          ddd_fax: string | null
          email: string | null
          id: string
          logradouro: string | null
          municipio: string | null
          natureza_juridica: string | null
          nome_fantasia: string | null
          numero: string | null
          porte: string | null
          razao_social: string
          situacao_cadastral: string | null
          telefone_1: string | null
          telefone_2: string | null
          tipo_logradouro: string | null
          uf: string | null
        }
        Insert: {
          abertura?: string | null
          bairro?: string | null
          capital_social?: number | null
          cep?: string | null
          cnae_fiscal?: number | null
          cnae_descricao?: string | null
          cnpj: string
          complemento?: string | null
          ddd_1?: string | null
          ddd_2?: string | null
          ddd_fax?: string | null
          email?: string | null
          id?: string
          logradouro?: string | null
          municipio?: string | null
          natureza_juridica?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          porte?: string | null
          razao_social: string
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
          tipo_logradouro?: string | null
          uf?: string | null
        }
        Update: {
          abertura?: string | null
          bairro?: string | null
          capital_social?: number | null
          cep?: string | null
          cnae_fiscal?: number | null
          cnae_descricao?: string | null
          cnpj?: string
          complemento?: string | null
          ddd_1?: string | null
          ddd_2?: string | null
          ddd_fax?: string | null
          email?: string | null
          id?: string
          logradouro?: string | null
          municipio?: string | null
          natureza_juridica?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          porte?: string | null
          razao_social?: string
          situacao_cadastral?: string | null
          telefone_1?: string | null
          telefone_2?: string | null
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
          tag_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          tag_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          tag_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_tags_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: {
          cnae: string | null
          cnpj: string
          companyName: string
          created_at: string
          description: string
          email: string | null
          employeeCount: string
          id: number
          isHot: boolean
          location: string
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          cnae?: string | null
          cnpj: string
          companyName: string
          created_at?: string
          description: string
          email?: string | null
          employeeCount?: string
          id?: number
          isHot?: boolean
          location: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          cnae?: string | null
          cnpj?: string
          companyName?: string
          created_at?: string
          description?: string
          email?: string | null
          employeeCount?: string
          id?: number
          isHot?: boolean
          location?: string
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      message_templates: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          message_text: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          message_text: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          message_text?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "message_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_templates_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      plans: {
        Row: {
          created_at: string
          credits: number
          description: string
          features: Json
          id: string
          is_active: boolean
          name: string
          price_monthly: number
          price_yearly: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits: number
          description: string
          features: Json
          id?: string
          is_active?: boolean
          name: string
          price_monthly: number
          price_yearly: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number
          description?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number
          price_yearly?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      target_preferences: {
        Row: {
          created_at: string
          id: string
          preference_data: Json
          preference_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          preference_data: Json
          preference_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          preference_data?: Json
          preference_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "target_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      unlocked_leads: {
        Row: {
          id: number
          lead_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: number
          lead_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: number
          lead_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_leads_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_credits: {
        Row: {
          id: number
          user_id: string
          credits_total: number
          credits_used: number
          plan_type: "free" | "basic" | "premium" | "enterprise"
          plan_started_at: string
          plan_expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          credits_total: number
          credits_used?: number
          plan_type?: "free" | "basic" | "premium" | "enterprise"
          plan_started_at?: string
          plan_expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          credits_total?: number
          credits_used?: number
          plan_type?: "free" | "basic" | "premium" | "enterprise"
          plan_started_at?: string
          plan_expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_plans: {
        Row: {
          active: boolean
          created_at: string
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_status: string
          plan_id: string
          starts_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string
          plan_id: string
          starts_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string
          plan_id?: string
          starts_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plans_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      whatsapp_connections: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_connected: string | null
          phone_number: string
          qr_code: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_connected?: string | null
          phone_number: string
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_connected?: string | null
          phone_number?: string
          qr_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_connections_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      whatsapp_instances: {
        Row: {
          created_at: string
          id: string
          instance_key: string
          is_active: boolean
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instance_key: string
          is_active?: boolean
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instance_key?: string
          is_active?: boolean
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      use_credit_transaction: {
        Args: {
          p_user_id: string
          p_lead_id: string
        }
        Returns: undefined
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
} 