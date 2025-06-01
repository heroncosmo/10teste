-- Configura as instâncias do WhatsApp
BEGIN;

-- Cria a tabela de instâncias do WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_instances (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    instance_id TEXT NOT NULL,
    api_key TEXT NOT NULL,
    host TEXT NOT NULL DEFAULT 'api.w-api.app',
    is_available BOOLEAN NOT NULL DEFAULT true,
    current_user_id UUID REFERENCES auth.users(id),
    max_free_users INTEGER NOT NULL DEFAULT 5,
    current_free_users INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configura RLS para whatsapp_instances
ALTER TABLE whatsapp_instances ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes se houver
DROP POLICY IF EXISTS "Admins can manage instances" ON whatsapp_instances;
DROP POLICY IF EXISTS "Users can view available instances" ON whatsapp_instances;

-- Recria as políticas
CREATE POLICY "Admins can manage instances"
    ON whatsapp_instances
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND (is_admin = true OR is_superadmin = true)
        )
    );

CREATE POLICY "Users can view available instances"
    ON whatsapp_instances FOR SELECT
    USING (true);

-- Drop a função existente primeiro
DROP FUNCTION IF EXISTS allocate_whatsapp_instance(UUID);

-- Função para alocar instância do WhatsApp
CREATE OR REPLACE FUNCTION allocate_whatsapp_instance(user_id UUID)
RETURNS whatsapp_instances
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    instance whatsapp_instances;
BEGIN
    -- Primeiro, tenta encontrar uma instância onde o usuário já está conectado
    SELECT * INTO instance
    FROM whatsapp_instances
    WHERE current_user_id = $1
    LIMIT 1;

    -- Se já estiver conectado, retorna a mesma instância
    IF instance IS NOT NULL THEN
        RETURN instance;
    END IF;

    -- Procura uma instância disponível com espaço
    SELECT * INTO instance
    FROM whatsapp_instances
    WHERE is_available = true
    AND (current_free_users < max_free_users OR current_free_users IS NULL)
    ORDER BY current_free_users ASC NULLS FIRST
    LIMIT 1;

    IF instance IS NULL THEN
        RAISE EXCEPTION 'Não há instâncias disponíveis no momento. Por favor, tente novamente mais tarde.';
    END IF;

    -- Atualiza a instância com o novo usuário
    UPDATE whatsapp_instances
    SET 
        current_user_id = $1,
        current_free_users = COALESCE(current_free_users, 0) + 1,
        updated_at = NOW()
    WHERE id = instance.id
    RETURNING * INTO instance;

    RETURN instance;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro para debug
        RAISE NOTICE 'Erro ao alocar instância: %', SQLERRM;
        -- Re-raise o erro para o cliente
        RAISE EXCEPTION 'Erro ao alocar instância do WhatsApp: %', SQLERRM;
END;
$$;

-- Insere uma instância padrão se não existir nenhuma
INSERT INTO whatsapp_instances (
    id,
    name, 
    instance_id, 
    api_key, 
    host, 
    max_free_users,
    is_available,
    current_free_users
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'WhatsApp Padrão',
    'default-instance',
    'default-key',
    'api.w-api.app',
    5,
    true,
    0
)
ON CONFLICT (id) DO UPDATE SET
    is_available = true,
    max_free_users = 5;

COMMIT; 