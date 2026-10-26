-- ===============================================================
-- KLUBI SOCIAL - SCHEMA ROBUSTO E IDEMPOTENTE PARA O SUPABASE
-- Pode ser executado múltiplas vezes sem erros!
-- ===============================================================

-- 0. Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Tabela de Perfis Públicos (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  nickname text unique not null,
  avatar_url text default 'https://api.dicebear.com/7.x/bottts/svg?seed=klubi',
  relationship_status text default 'single',
  city text default '',
  country text default 'Brasil',
  bio text default '',
  status_message text default '',
  birthday text default '',
  occupation text default '',
  invisible_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;
drop policy if exists "Perfis são visíveis publicamente" on public.profiles;
create policy "Perfis são visíveis publicamente" on public.profiles for select using (true);

drop policy if exists "Usuários podem atualizar seu próprio perfil" on public.profiles;
create policy "Usuários podem atualizar seu próprio perfil" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Usuários podem inserir seu próprio perfil" on public.profiles;
create policy "Usuários podem inserir seu próprio perfil" on public.profiles for insert with check (auth.uid() = id);

-- 2. Tabela de Amizades (Friendships)
create table if not exists public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, friend_id)
);

alter table public.friendships enable row level security;
drop policy if exists "Amizades visíveis para todos" on public.friendships;
create policy "Amizades visíveis para todos" on public.friendships for select using (true);

drop policy if exists "Usuários podem adicionar amizades" on public.friendships;
create policy "Usuários podem adicionar amizades" on public.friendships for insert with check (auth.uid() = user_id);

drop policy if exists "Usuários podem desfazer amizades" on public.friendships;
create policy "Usuários podem desfazer amizades" on public.friendships for delete using (auth.uid() = user_id);

-- 3. Tabela de Scraps (Mural de Recados)
create table if not exists public.scraps (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.scraps enable row level security;
drop policy if exists "Scraps visíveis publicamente" on public.scraps;
create policy "Scraps visíveis publicamente" on public.scraps for select using (true);

drop policy if exists "Usuários autenticados podem postar scraps" on public.scraps;
create policy "Usuários autenticados podem postar scraps" on public.scraps for insert with check (auth.uid() = sender_id);

drop policy if exists "Remetente ou destinatário podem apagar scraps" on public.scraps;
create policy "Remetente ou destinatário podem apagar scraps" on public.scraps for delete using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- 4. Tabela de Depoimentos (Testimonials)
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  status text check (status in ('PENDING', 'ACCEPTED', 'REJECTED')) default 'PENDING' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.testimonials enable row level security;
drop policy if exists "Depoimentos visibilidade" on public.testimonials;
create policy "Depoimentos visibilidade" on public.testimonials for select using (status = 'ACCEPTED' or auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "Usuários podem enviar depoimentos" on public.testimonials;
create policy "Usuários podem enviar depoimentos" on public.testimonials for insert with check (auth.uid() = sender_id);

drop policy if exists "Destinatário pode moderar status" on public.testimonials;
create policy "Destinatário pode moderar status" on public.testimonials for update using (auth.uid() = recipient_id);

drop policy if exists "Destinatário ou remetente podem excluir depoimentos" on public.testimonials;
create policy "Destinatário ou remetente podem excluir depoimentos" on public.testimonials for delete using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- 5. Tabela de Comunidades
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  image_url text default 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&auto=format&fit=crop&q=80',
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.communities enable row level security;
drop policy if exists "Comunidades visíveis publicamente" on public.communities;
create policy "Comunidades visíveis publicamente" on public.communities for select using (true);

drop policy if exists "Usuários autenticados podem criar comunidades" on public.communities;
create policy "Usuários autenticados podem criar comunidades" on public.communities for insert with check (auth.uid() = owner_id);

-- 6. Tabela de Membros de Comunidades
create table if not exists public.community_members (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (community_id, user_id)
);

alter table public.community_members enable row level security;
drop policy if exists "Membros visíveis para todos" on public.community_members;
create policy "Membros visíveis para todos" on public.community_members for select using (true);

drop policy if exists "Usuários podem entrar em comunidades" on public.community_members;
create policy "Usuários podem entrar em comunidades" on public.community_members for insert with check (auth.uid() = user_id);

drop policy if exists "Usuários podem sair de comunidades" on public.community_members;
create policy "Usuários podem sair de comunidades" on public.community_members for delete using (auth.uid() = user_id);

-- 7. Tabela de Tópicos do Fórum
create table if not exists public.topics (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  is_pinned boolean default false,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.topics enable row level security;
drop policy if exists "Tópicos visíveis para todos" on public.topics;
create policy "Tópicos visíveis para todos" on public.topics for select using (true);

drop policy if exists "Membros podem criar tópicos" on public.topics;
create policy "Membros podem criar tópicos" on public.topics for insert with check (auth.uid() = author_id);

-- 8. Tabela de Respostas do Fórum
create table if not exists public.replies (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.topics(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.replies enable row level security;
drop policy if exists "Respostas visíveis para todos" on public.replies;
create policy "Respostas visíveis para todos" on public.replies for select using (true);

drop policy if exists "Usuários podem responder tópicos" on public.replies;
create policy "Usuários podem responder tópicos" on public.replies for insert with check (auth.uid() = author_id);

-- 9. Tabela de Visitantes (Quem Me Viu)
create table if not exists public.profile_visitors (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  visitor_id uuid references public.profiles(id) on delete cascade not null,
  visited_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profile_visitors enable row level security;
drop policy if exists "Dono pode ver seus visitantes" on public.profile_visitors;
create policy "Dono pode ver seus visitantes" on public.profile_visitors for select using (auth.uid() = profile_id);

drop policy if exists "Usuários podem registrar visitas" on public.profile_visitors;
create policy "Usuários podem registrar visitas" on public.profile_visitors for insert with check (auth.uid() = visitor_id);

-- 10. Trigger Automático para criar perfil ao criar conta no Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, nickname, avatar_url, city, relationship_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Novo Membro'),
    coalesce(new.raw_user_meta_data->>'nickname', lower(replace(split_part(new.email, '@', 1), '.', '_'))),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id),
    coalesce(new.raw_user_meta_data->>'city', 'São Paulo, SP'),
    coalesce(new.raw_user_meta_data->>'relationship_status', 'single')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
