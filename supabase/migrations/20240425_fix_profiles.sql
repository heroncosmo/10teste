-- Atualiza o cache do schema para a tabela profiles
BEGIN;

-- Remove a tabela antiga se existir
DROP TABLE IF EXISTS profiles;

-- Cria a nova tabela
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

-- Configura as políticas de segurança (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Cria trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
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
    EXECUTE FUNCTION update_profiles_updated_at();

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