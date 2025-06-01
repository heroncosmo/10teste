-- Atualiza o cache do schema
BEGIN;

-- Força a atualização do cache do schema para whatsapp_connections
ALTER TABLE whatsapp_connections 
  ALTER COLUMN instance_id SET DATA TYPE TEXT;

-- Força a atualização do cache do schema para profiles
ALTER TABLE profiles 
  ALTER COLUMN name SET DATA TYPE TEXT;

COMMIT; 