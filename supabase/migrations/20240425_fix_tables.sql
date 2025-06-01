-- Atualiza o cache do schema para ambas as tabelas
BEGIN;

-- Primeiro remove as políticas existentes para evitar problemas de dependência
DROP POLICY IF EXISTS "Admins can view all connections" ON whatsapp_connections;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON whatsapp_connections;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON whatsapp_connections;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON whatsapp_connections;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON whatsapp_connections;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Backup dos dados existentes (se houver)
CREATE TABLE IF NOT EXISTS profiles_backup AS SELECT * FROM profiles;
CREATE TABLE IF NOT EXISTS whatsapp_connections_backup AS SELECT * FROM whatsapp_connections;

-- Remove as tabelas existentes
DROP TABLE IF EXISTS whatsapp_connections CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Recria a tabela profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    is_superadmin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Restaura os dados do backup (se existirem)
INSERT INTO profiles (id, name, email, avatar_url, is_admin, is_superadmin, created_at, updated_at)
SELECT id, name, email, avatar_url, is_admin, is_superadmin, created_at, updated_at 
FROM profiles_backup
ON CONFLICT (id) DO NOTHING;

-- Recria a tabela whatsapp_connections
CREATE TABLE whatsapp_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'disconnected',
    instance_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT whatsapp_connections_status_check 
    CHECK (status IN ('connected', 'disconnected', 'connecting'))
);

-- Restaura os dados do backup (se existirem)
INSERT INTO whatsapp_connections (id, user_id, name, status, instance_id, created_at, updated_at)
SELECT id, user_id, name, status, instance_id, created_at, updated_at
FROM whatsapp_connections_backup
ON CONFLICT (id) DO NOTHING;

-- Remove as tabelas de backup
DROP TABLE IF EXISTS profiles_backup;
DROP TABLE IF EXISTS whatsapp_connections_backup;

-- Recria os índices
CREATE INDEX IF NOT EXISTS whatsapp_connections_instance_id_idx ON whatsapp_connections(instance_id);
CREATE INDEX IF NOT EXISTS whatsapp_connections_user_id_idx ON whatsapp_connections(user_id);

-- Configura as políticas de segurança (RLS) para profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Configura as políticas de segurança (RLS) para whatsapp_connections
ALTER TABLE whatsapp_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on user_id"
    ON whatsapp_connections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
    ON whatsapp_connections FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on user_id"
    ON whatsapp_connections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
    ON whatsapp_connections FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all connections"
    ON whatsapp_connections FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- Cria triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_whatsapp_connections_updated_at ON whatsapp_connections;
CREATE TRIGGER update_whatsapp_connections_updated_at
    BEFORE UPDATE ON whatsapp_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insere o perfil do superadmin se não existir
INSERT INTO profiles (id, name, email, is_admin, is_superadmin)
SELECT 
    id,
    email as name,
    email,
    true as is_admin,
    true as is_superadmin
FROM auth.users 
WHERE email = 'admin@whatsappleadpilot.com'
ON CONFLICT (id) DO NOTHING;

COMMIT; 