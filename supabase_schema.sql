-- ===============================================================
-- KLUBI SOCIAL - SCHEMA COMPARTILHADO GLOBAL NA NUVEM (SUPABASE)
-- Execute este script no SQL Editor do Supabase (Run)
-- ===============================================================

-- Limpeza de constraints antigas para permitir cadastros diretos
drop table if exists public.friendships cascade;
drop table if exists public.scraps cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.community_members cascade;
drop table if exists public.communities cascade;
drop table if exists public.topics cascade;
drop table if exists public.replies cascade;
drop table if exists public.visitors cascade;
drop table if exists public.profiles cascade;

-- 1. Tabela de Perfis Públicos (Profiles)
create table public.profiles (
  id text primary key,
  name text not null,
  nickname text unique not null,
  email text,
  password text,
  avatar_url text default 'https://api.dicebear.com/7.x/bottts/svg?seed=klubi',
  relationship_status text default 'single',
  city text default 'Brasil',
  country text default 'Brasil',
  bio text default '',
  status_message text default '',
  birthday text default '',
  occupation text default '',
  interests jsonb default '{"music":[],"movies":[],"books":[],"hobbies":[]}'::jsonb,
  invisible_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS e permitir leitura e gravação públicas
alter table public.profiles enable row level security;
drop policy if exists "Perfis são visíveis publicamente" on public.profiles;
create policy "Perfis são visíveis publicamente" on public.profiles for select using (true);
drop policy if exists "Qualquer pessoa pode se cadastrar" on public.profiles;
create policy "Qualquer pessoa pode se cadastrar" on public.profiles for insert with check (true);
drop policy if exists "Qualquer pessoa pode atualizar perfil" on public.profiles;
create policy "Qualquer pessoa pode atualizar perfil" on public.profiles for update using (true);

-- 2. Tabela de Comunidades
create table public.communities (
  id text primary key,
  title text not null,
  description text not null,
  category text not null,
  image_url text not null,
  owner_id text not null,
  owner_name text not null,
  members_count integer default 1,
  is_private boolean default false,
  language text default 'Português',
  created_at text not null
);

alter table public.communities enable row level security;
drop policy if exists "Comunidades visíveis publicamente" on public.communities;
create policy "Comunidades visíveis publicamente" on public.communities for select using (true);
drop policy if exists "Membros podem criar comunidades" on public.communities;
create policy "Membros podem criar comunidades" on public.communities for insert with check (true);
drop policy if exists "Membros podem atualizar comunidades" on public.communities;
create policy "Membros podem atualizar comunidades" on public.communities for update using (true);

-- 3. Membros de Comunidades
create table public.community_members (
  id uuid default gen_random_uuid() primary key,
  community_id text not null,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (community_id, user_id)
);

alter table public.community_members enable row level security;
drop policy if exists "Membros de comunidades visíveis" on public.community_members;
create policy "Membros de comunidades visíveis" on public.community_members for select using (true);
drop policy if exists "Membros podem entrar em comunidades" on public.community_members;
create policy "Membros podem entrar em comunidades" on public.community_members for insert with check (true);
drop policy if exists "Membros podem sair de comunidades" on public.community_members;
create policy "Membros podem sair de comunidades" on public.community_members for delete using (true);

-- 4. Tabela de Amizades (Friendships)
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  friend_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, friend_id)
);

alter table public.friendships enable row level security;
drop policy if exists "Amizades visíveis" on public.friendships;
create policy "Amizades visíveis" on public.friendships for select using (true);
drop policy if exists "Amizades podem ser criadas" on public.friendships;
create policy "Amizades podem ser criadas" on public.friendships for insert with check (true);
drop policy if exists "Amizades podem ser desfeitas" on public.friendships;
create policy "Amizades podem ser desfeitas" on public.friendships for delete using (true);

-- 5. Tabela de Scraps (Mural de Recados)
create table public.scraps (
  id text primary key,
  sender_id text not null,
  sender_name text not null,
  sender_avatar text not null,
  recipient_id text not null,
  content text not null,
  created_at text not null
);

alter table public.scraps enable row level security;
drop policy if exists "Scraps visíveis publicamente" on public.scraps;
create policy "Scraps visíveis publicamente" on public.scraps for select using (true);
drop policy if exists "Postar scraps" on public.scraps;
create policy "Postar scraps" on public.scraps for insert with check (true);
drop policy if exists "Excluir scraps" on public.scraps;
create policy "Excluir scraps" on public.scraps for delete using (true);

-- 6. Tabela de Depoimentos (Testimonials)
create table public.testimonials (
  id text primary key,
  sender_id text not null,
  sender_name text not null,
  sender_avatar text not null,
  recipient_id text not null,
  content text not null,
  status text check (status in ('PENDING', 'ACCEPTED', 'REJECTED')) default 'PENDING' not null,
  created_at text not null
);

alter table public.testimonials enable row level security;
drop policy if exists "Depoimentos visibilidade" on public.testimonials;
create policy "Depoimentos visibilidade" on public.testimonials for select using (true);
drop policy if exists "Criar depoimentos" on public.testimonials;
create policy "Criar depoimentos" on public.testimonials for insert with check (true);
drop policy if exists "Atualizar depoimentos" on public.testimonials;
create policy "Atualizar depoimentos" on public.testimonials for update using (true);
drop policy if exists "Excluir depoimentos" on public.testimonials;
create policy "Excluir depoimentos" on public.testimonials for delete using (true);

-- 7. Tabela de Tópicos do Fórum
create table public.topics (
  id text primary key,
  community_id text not null,
  author_id text not null,
  author_name text not null,
  author_avatar text not null,
  title text not null,
  content text not null,
  created_at text not null
);

alter table public.topics enable row level security;
drop policy if exists "Tópicos visíveis" on public.topics;
create policy "Tópicos visíveis" on public.topics for select using (true);
drop policy if exists "Criar tópicos" on public.topics;
create policy "Criar tópicos" on public.topics for insert with check (true);

-- 8. Tabela de Respostas do Fórum
create table public.replies (
  id text primary key,
  topic_id text not null,
  author_id text not null,
  author_name text not null,
  author_avatar text not null,
  content text not null,
  created_at text not null
);

alter table public.replies enable row level security;
drop policy if exists "Respostas visíveis" on public.replies;
create policy "Respostas visíveis" on public.replies for select using (true);
drop policy if exists "Criar respostas" on public.replies;
create policy "Criar respostas" on public.replies for insert with check (true);

-- 9. Tabela de Visitantes (Quem Me Viu)
create table public.visitors (
  id text primary key,
  profile_id text not null,
  visitor_id text not null,
  visitor_name text not null,
  visitor_avatar text not null,
  visited_at text not null,
  is_friend boolean default false
);

alter table public.visitors enable row level security;
drop policy if exists "Visitantes visíveis" on public.visitors;
create policy "Visitantes visíveis" on public.visitors for select using (true);
drop policy if exists "Registrar visita" on public.visitors;
create policy "Registrar visita" on public.visitors for insert with check (true);
