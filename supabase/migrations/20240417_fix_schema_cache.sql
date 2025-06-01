-- Recria a tabela whatsapp_connections com a estrutura correta
CREATE TABLE IF NOT EXISTS whatsapp_connections_new (
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

-- Copia os dados da tabela antiga para a nova
INSERT INTO whatsapp_connections_new (id, user_id, name, status, instance_id, created_at, updated_at)
SELECT id, user_id, name, status, instance_id, created_at, updated_at
FROM whatsapp_connections;

-- Remove a tabela antiga
DROP TABLE IF EXISTS whatsapp_connections;

-- Renomeia a nova tabela
ALTER TABLE whatsapp_connections_new RENAME TO whatsapp_connections;

-- Cria os índices necessários
CREATE INDEX IF NOT EXISTS whatsapp_connections_instance_id_idx ON whatsapp_connections(instance_id);
CREATE INDEX IF NOT EXISTS whatsapp_connections_user_id_idx ON whatsapp_connections(user_id);

-- Atualiza as funções RLS (Row Level Security)
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

-- Cria trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_whatsapp_connections_updated_at ON whatsapp_connections;

CREATE TRIGGER update_whatsapp_connections_updated_at
    BEFORE UPDATE ON whatsapp_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 