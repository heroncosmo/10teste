export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  is_admin?: boolean;
  is_superadmin?: boolean;
  whatsapp_connections_limit?: number;
  created_at?: string;
  updated_at?: string;
} 