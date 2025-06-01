-- Cria a função para lidar com novos usuários
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insere id e full_name (extraído dos metadados se disponível)
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name'); 
  return new;
end;
$$;

-- Cria o trigger para executar a função após a criação de um usuário
drop trigger if exists on_auth_user_created on auth.users; -- Remove trigger antigo se existir
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- (Opcional) Atualiza perfis existentes que podem não ter sido criados
-- Insere id e full_name
insert into public.profiles (id, full_name)
select id, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing; 