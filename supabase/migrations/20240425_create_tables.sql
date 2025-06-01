-- Primeiro, remove a tabela se ela existir
DROP TABLE IF EXISTS whatsapp_connections CASCADE;

-- Cria a tabela whatsapp_connections
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

-- Cria os índices necessários
CREATE INDEX whatsapp_connections_instance_id_idx ON whatsapp_connections(instance_id);
CREATE INDEX whatsapp_connections_user_id_idx ON whatsapp_connections(user_id);

-- Configura as políticas de segurança (RLS)
ALTER TABLE whatsapp_connections ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
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

-- Cria trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_whatsapp_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_whatsapp_connections_updated_at
    BEFORE UPDATE ON whatsapp_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_whatsapp_connections_updated_at(); 