-- Remove a coluna instance_id existente
ALTER TABLE whatsapp_connections DROP COLUMN IF EXISTS instance_id;

-- Remove o atributo instance_id do tipo
DROP TYPE IF EXISTS WhatsappConnection;

-- Recria a coluna instance_id com o tipo correto
ALTER TABLE whatsapp_connections
ADD COLUMN instance_id TEXT;

-- Cria os índices necessários
CREATE INDEX IF NOT EXISTS whatsapp_connections_instance_id_idx ON whatsapp_connections(instance_id);
CREATE INDEX IF NOT EXISTS whatsapp_connections_user_id_idx ON whatsapp_connections(user_id);

-- Adiciona as constraints necessárias
ALTER TABLE whatsapp_connections
ALTER COLUMN user_id SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'disconnected',
ADD CONSTRAINT whatsapp_connections_status_check 
CHECK (status IN ('connected', 'disconnected', 'connecting')); 