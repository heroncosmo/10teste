-- Adiciona colunas para controle de usuários gratuitos
ALTER TABLE whatsapp_instances
ADD COLUMN max_free_users INTEGER NOT NULL DEFAULT 5,
ADD COLUMN current_free_users INTEGER NOT NULL DEFAULT 0;

-- Atualiza a função de alocação de instâncias
CREATE OR REPLACE FUNCTION allocate_whatsapp_instance(user_id UUID)
RETURNS whatsapp_instances
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  instance whatsapp_instances;
BEGIN
  -- Procura uma instância disponível com espaço para usuários gratuitos
  SELECT * INTO instance
  FROM whatsapp_instances
  WHERE is_available = true
  AND current_free_users < max_free_users
  ORDER BY current_free_users ASC
  LIMIT 1;

  IF instance IS NULL THEN
    RAISE EXCEPTION 'Não há instâncias disponíveis para usuários gratuitos';
  END IF;

  -- Atualiza a instância com o novo usuário
  UPDATE whatsapp_instances
  SET 
    current_user_id = user_id,
    current_free_users = current_free_users + 1
  WHERE id = instance.id
  RETURNING * INTO instance;

  RETURN instance;
END;
$$; 