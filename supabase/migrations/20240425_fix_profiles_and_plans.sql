-- Corrige a tabela de perfis preservando dados existentes
BEGIN;

-- Não vamos recriar a tabela profiles, apenas adicionar as colunas que faltam se necessário
DO $$ 
BEGIN
    -- Adiciona coluna is_admin se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Adiciona coluna is_superadmin se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_superadmin') THEN
        ALTER TABLE profiles ADD COLUMN is_superadmin BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- Configura RLS para profiles se ainda não estiver configurado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes se houver
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recria as políticas
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Não vamos recriar a tabela plans pois ela já existe com a estrutura correta
-- Apenas vamos garantir que as políticas de segurança estejam corretas
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Remove política existente se houver
DROP POLICY IF EXISTS "Plans are viewable by everyone" ON plans;

-- Recria a política
CREATE POLICY "Plans are viewable by everyone"
    ON plans FOR SELECT
    USING (true);

-- Cria a tabela de planos do usuário se não existir
CREATE TABLE IF NOT EXISTS user_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configura RLS para user_plans
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- Remove política existente se houver
DROP POLICY IF EXISTS "Users can view their own plans" ON user_plans;

-- Recria a política
CREATE POLICY "Users can view their own plans"
    ON user_plans FOR SELECT
    USING (auth.uid() = user_id);

COMMIT; 