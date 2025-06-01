-- Atualiza o cache do schema para a tabela whatsapp_instances
BEGIN;

-- Recria a tabela temporariamente para forçar atualização do cache
CREATE TABLE whatsapp_instances_new (LIKE whatsapp_instances INCLUDING ALL);
INSERT INTO whatsapp_instances_new SELECT * FROM whatsapp_instances;
DROP TABLE whatsapp_instances;
ALTER TABLE whatsapp_instances_new RENAME TO whatsapp_instances;

-- Garante que todas as colunas estão presentes
ALTER TABLE whatsapp_instances
ADD COLUMN IF NOT EXISTS current_free_users INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_free_users INTEGER NOT NULL DEFAULT 5,
ADD COLUMN IF NOT EXISTS host TEXT NOT NULL DEFAULT 'api.w-api.app';

-- Recria os índices
CREATE INDEX IF NOT EXISTS whatsapp_instances_current_user_id_idx ON whatsapp_instances(current_user_id);
CREATE INDEX IF NOT EXISTS whatsapp_instances_instance_id_idx ON whatsapp_instances(instance_id);

COMMIT; 