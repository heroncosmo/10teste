-- Adiciona a coluna instance_id na tabela whatsapp_connections
ALTER TABLE whatsapp_connections
ADD COLUMN instance_id UUID REFERENCES whatsapp_instances(id);

-- Atualiza o tipo da tabela
ALTER TYPE WhatsappConnection ADD ATTRIBUTE instance_id UUID; 