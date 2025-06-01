-- Verifica a estrutura atual da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Adiciona colunas de controle de acesso na tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN NOT NULL DEFAULT false;

-- Define o usuário como super admin e admin
UPDATE profiles
SET is_superadmin = true,
    is_admin = true
FROM auth.users
WHERE profiles.id = auth.users.id
AND auth.users.email = 'admin@whatsappleadpilot.com';

-- Cria política de segurança para super admin
DROP POLICY IF EXISTS "Super admins can do everything" ON profiles;

CREATE POLICY "Super admins can do everything"
ON profiles
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id 
    FROM profiles 
    WHERE is_superadmin = true
  )
); 