# Product Requirement Document (PRD): Projeto Nostalgia (Clone do Orkut)

---

## 1. Visão Geral e Objetivos do Produto

O **Projeto Nostalgia** tem como objetivo recriar a arquitetura, a dinâmica social e a interface clássica do Orkut (era 2004–2009). Ao contrário das plataformas sociais contemporâneas orientadas a feeds verticais infinitos e algoritmos de engajamento passivo, o Orkut era centrado na navegação ativa, identidade explícita, reputação comunitária, fóruns temáticos assíncronos e laços sociais deliberados.

### Objetivos Principais
- Fornecer uma interface nostálgica e autêntica adaptada aos padrões modernos de responsividade, tipografia e acessibilidade.
- Implementar as mecânicas sociais centrais: Perfil, Graus de Separação, Termômetro de Reputação, Scraps (mural público), Depoimentos com fila de aprovação, Fóruns de Comunidade e Quem Me Viu.
- Fornecer arquitetura desacoplada e modular para fácil expansão e deploy no Antigravity.

---

## 2. Stack Tecnológica e Arquitetura

- **Framework Web:** Next.js (App Router, TypeScript).
- **Estilização:** Tailwind CSS (tokens customizados para recriar a paleta clássica).
- **Ícones:** Lucide React (substitutos vetoriais modernos para a iconografia clássica).
- **Animações e Transições:** Framer Motion (para modais, abas e notificações toast).
- **Gerenciamento de Formulários & Validação:** React Hook Form + Zod.
- **Sanitização de Dados:** DOMPurify no frontend e sanitizador no backend contra injeções XSS.
- **Armazenamento de Estado & Cache Local:** React Context / Zustand / TanStack Query.

---

## 3. Diretrizes de Design & Paleta de Cores (Design System)

A interface deve manter a estrutura rígida de caixas e cantos arredondados, evitando o design excessivamente minimalista moderno:

- **Azul Primário (Header e Navegação):** `#2B589A`
- **Azul Secundário (Links e Acentos):** `#3B73C4`
- **Fundo Global:** `#EDF2F7`
- **Branco dos Cartões:** `#FFFFFF`
- **Bordas dos Cartões:** `#CBD5E1`
- **Rosa Orkut (Destaques, Notificações e Fãs):** `#C2005A`
- **Amarelo Dourado (Estrela de Fã):** `#F59E0B`
- **Ícones do Termômetro:**
  - *Confiável:* Amarelo / Dourado (`#EAB308`)
  - *Legal:* Azul Gelo (`#06B6D4`)
  - *Sexy:* Vermelho Cereja (`#EF4444`)

---

## 4. Estrutura de Informação & Rotas

| Rota | Descrição | Componentes Principais |
| :--- | :--- | :--- |
| `/login` e `/register` | Autenticação e entrada na rede | LoginForm, RegisterForm, LogoCard |
| `/home` | Dashboard pessoal e feed de atualizações | UserSidebar, QuickNav, RecentScrapsList, CommunityUpdates |
| `/profile/[id]` | Perfil público de qualquer usuário | ProfileHeader, DegreesOfSeparation, ReputationMeter, ProfileTabs, FriendsGrid, CommunitiesGrid |
| `/profile/[id]/scraps` | Mural de recados públicos | ScrapForm, ScrapList, ScrapItem, DeleteModal |
| `/profile/[id]/testimonials` | Depoimentos públicos e fila de aprovação | TestimonialList, PendingQueue (apenas dono), TestimonialForm |
| `/profile/[id]/visitors` | Histórico "Quem Me Viu" | VisitorsGrid, PrivacyToggleNotice |
| `/communities` | Catálogo e busca de comunidades | CategoryNav, SearchBar, CommunityCardGrid |
| `/communities/[id]` | Página principal da comunidade | CommunityHero, TopicList, PollSection, MembersGrid |
| `/communities/[id]/topics/[topicId]` | Fórum de discussão linear | TopicHeader, PostList, ReplyEditor, PaginationNav |

---

## 5. Requisitos Funcionais Detalhados

### 5.1 Perfil do Usuário
- **Sidebar do Perfil:**
  - Foto de exibição quadrada com bordas arredondadas.
  - Indicador de status de relacionamento (Solteiro, Namorando, Casado, Em caso complicado).
  - Contadores numéricos clicáveis: Amigos, Comunidades, Scraps, Depoimentos, Fãs.
  - Botões de ação contextual: "Adicionar Amigo", "Enviar Recado", "Escrever Depoimento".
- **Graus de Separação:**
  - Barra de navegação visual indicando a menor distância de amizades entre o visitante logado e o dono da página visitada (ex: `Você > André > Beatriz > Perfil Atual`).
- **Termômetro de Reputação:**
  - Três eixos de votação:
    - Confiável (Smile/Halo): 1 a 3 pontos.
    - Legal (Cubo de gelo): 1 a 3 pontos.
    - Sexy (Coração): 1 a 3 pontos.
  - Exibição percentual ou por preenchimento de ícones acumulados com base na média dos votos dos amigos.
  - Botão de "Fã" (adiciona +1 estrela ao perfil do avaliado).
- **Abas de Informação:**
  - *Geral:* Quem sou eu, aniversário, localização, idiomas, ocupação.
  - *Gostos Pessoais:* Músicas, filmes, livros, hobbies.
  - *Profissional:* Formação acadêmica e ocupação atual.
- **Quem Me Viu:**
  - Registro de visitas aos perfis contendo: usuário visitante, avatar e data/hora.
  - Modo Invisível: Caso o usuário ative a navegação invisível nas configurações, suas visitas não serão salvas nos perfis alheios, mas ele perde o acesso total à lista de quem visitou seu próprio perfil.

### 5.2 Scraps (Mural de Recados)
- Mural público aberto a todos os amigos (ou público em geral, dependendo da configuração de privacidade).
- Editor de texto com suporte a formatação básica segura (Negrito, Itálico, Sublinhado, Cores e Links).
- Lógica de moderação:
  - O autor pode apagar o scrap que enviou.
  - O dono do perfil pode apagar qualquer scrap postado em seu mural.

### 5.3 Depoimentos (Testimonials)
- Mensagens de apreço com caráter permanente e público.
- **Fila de Moderação Mandatória:**
  - Qualquer depoimento submetido entra com status inicial `PENDING`.
  - O destinatário recebe notificação interna de depoimento pendente.
  - O destinatário pode ler a mensagem no painel privado e escolher entre duas ações:
    - **Aceitar:** O depoimento torna-se público na aba de depoimentos do perfil.
    - **Recusar:** O depoimento é excluído sem ser publicado.

### 5.4 Comunidades e Fóruns
- **Metadados da Comunidade:** Nome, foto de identificação, descrição, categoria temática (ex: Cidades, Entretenimento, Tecnologia, Humor) e contagem de participantes.
- **Fórum Linear:**
  - Criação de tópicos por membros da comunidade.
  - Discussões estruturadas em ordem cronológica com paginação clássica (10 a 20 mensagens por página).
  - Poderes de moderação: criador e moderadores podem fixar tópicos no topo (`pinned`) ou trancar para novas respostas (`locked`).
- **Enquetes:**
  - Criação de enquetes com opções de voto único e barra de porcentagem visual calculada em tempo real.

---

## 6. Modelo de Entidades e Tipagens (TypeScript)

```typescript
export type RelationshipStatus = 'single' | 'dating' | 'married' | 'complicated';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  relationshipStatus: RelationshipStatus;
  city: string;
  country: string;
  bio: string;
  invisibleMode: boolean;
  createdAt: string;
}

export interface UserReputation {
  userId: string;
  trustyPercent: number; // 0 a 100%
  coolPercent: number;   // 0 a 100%
  sexyPercent: number;   // 0 a 100%
  fansCount: number;
}

export interface Scrap {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  content: string;
  createdAt: string;
}

export type TestimonialStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Testimonial {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  content: string;
  status: TestimonialStatus;
  createdAt: string;
}

export interface ProfileVisitor {
  id: string;
  profileId: string;
  visitorId: string;
  visitorName: string;
  visitorAvatar: string;
  visitedAt: string;
}

export interface Community {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  ownerId: string;
  membersCount: number;
  isPrivate: boolean;
}

export interface ForumTopic {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  repliesCount: number;
  createdAt: string;
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}
```

---

## 7. Diretrizes de Layout e Componentização para o Antigravity

Ao gerar a tela principal do perfil, o layout deve seguir a clássica divisão de três colunas:

```
+-----------------------------------------------------------------------------------+
|  HEADER SUPERIOR (#2B589A) - Logo, Barra de Pesquisa, Menu de Navegação Global    |
+-----------------------------------------------------------------------------------+
|  COLUNA ESQUERDA (22%)  |  COLUNA CENTRAL (53%)          |  COLUNA DIREITA (25%)  |
|  - Foto de Perfil       |  - Título / Nome do Usuário    |  - Amigos (9 miniaturas|
|  - Ações Rápidas        |  - Graus de Separação          |    em grid 3x3 com     |
|  - Contadores Numéricos |  - Termômetro de Reputação     |    link 'Ver todos')   |
|  - Links Secundários    |  - Abas: Geral / Pessoal       |  - Comunidades (9 itens|
|                         |  - Mural de Recados Recentes   |    em grid 3x3)        |
+-----------------------------------------------------------------------------------+
```

---

## 8. Prompt de Inicialização Recomendado para o Antigravity

```markdown
Atue como Desenvolvedor Fullstack Sênior especialista em Next.js (App Router), Tailwind CSS e Lucide Icons.

Utilize o arquivo PRD_Orkut_Clone.md fornecido para implementar a versão inicial do projeto:

1. Configure a paleta de cores retrô no Tailwind (azul #2B589A, rosa #C2005A, fundo #EDF2F7).
2. Construa o layout clássico de 3 colunas responsivo.
3. Desenvolva os componentes interativos do perfil:
   - `UserSidebar`: avatar, status de relacionamento e contadores.
   - `ReputationMeter`: confiável, legal, sexy e contador de fãs.
   - `DegreesOfSeparation`: régua com o trajeto de amigos.
   - `Scrapbook`: mural de recados com formulário e botão de exclusão.
   - `TestimonialsManager`: lista de depoimentos e aba de aprovação para o dono.
4. Popule a tela com dados mockados em TypeScript fiéis à experiência do Orkut.
```