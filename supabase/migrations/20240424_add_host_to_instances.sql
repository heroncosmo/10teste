-- Adiciona a coluna host na tabela whatsapp_instances
ALTER TABLE whatsapp_instances
ADD COLUMN host TEXT NOT NULL DEFAULT 'api.w-api.app';

-- Atualiza o tipo WhatsappInstance
DROP TYPE IF EXISTS WhatsappInstance;
CREATE TYPE WhatsappInstance AS (
  id UUID,
  name TEXT,
  instance_id TEXT,
  api_key TEXT,
  host TEXT,
  is_available BOOLEAN,
  current_user_id UUID,
  max_free_users INTEGER,
  current_free_users INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
); 