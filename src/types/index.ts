export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  company_name?: string;
  phone?: string;
  business_type?: string;
  business_size?: string;
  is_admin: boolean;
  is_superadmin: boolean;
  created_at: string;
  updated_at: string;
} 