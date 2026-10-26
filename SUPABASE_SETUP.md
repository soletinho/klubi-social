# 🚀 Guia de Conexão com o Supabase (Klubi Social do Zero)

Siga este passo a passo rápido (leva menos de 3 minutos e é 100% gratuito) para conectar o banco de dados do **Klubi** na nuvem e permitir cadastros reais:

---

### Passo 1: Criar o Projeto no Supabase
1. Acesse **[supabase.com](https://supabase.com)** e faça login com sua conta do GitHub ou Google.
2. Clique em **"New Project"**.
3. Dê o nome **Klubi Social**, defina uma senha de banco segura e selecione a região mais próxima (ex: *South America - São Paulo*).
4. Clique em **"Create new project"** e aguarde cerca de 1 minuto enquanto o Supabase prepara seu banco PostgreSQL.

---

### Passo 2: Executar o Schema do Banco (Tabelas do Klubi)
1. No menu lateral esquerdo do painel do Supabase, clique no ícone **SQL Editor** (ou pressione as teclas de atalho).
2. Clique em **"New Query"**.
3. Abra o arquivo [`supabase_schema.sql`](./supabase_schema.sql) que criei na raiz do projeto, copie todo o seu conteúdo e cole no editor do Supabase.
4. Clique no botão verde **"Run"** (Executar).
5. Pronto! Todas as tabelas (`profiles`, `scraps`, `testimonials`, `communities`, `topics`, `replies`, `visitors`, `friendships`) e as regras de segurança já estão criadas.

---

### Passo 3: Colar as Chaves de Acesso no Klubi
1. No painel do seu projeto no Supabase, vá em **Project Settings** (ícone de engrenagem) -> **API**.
2. Copie os dois valores:
   - **Project URL**
   - **Project API Keys (`anon` / `public`)**
3. Abra o arquivo [`.env.local`](./.env.local) na raiz do projeto e substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-longa-aqui
```

4. Salve o arquivo e reinicie o servidor do Next.js se necessário (`npm run dev`).

---

### Passo 4: Cadastrar e Iniciar a Rede do Zero!
1. Acesse **[http://localhost:3000/register](http://localhost:3000/register)**.
2. Crie sua conta real (Nome, apelido, e-mail, senha, cidade).
3. O Klubi agora carregará diretamente o seu perfil real, limpo, sem amigos, comunidades ou recados fakes.
4. Você pode enviar o link para seus amigos se cadastrarem e a rede crescerá organicamente!
