import { User, Community, Scrap, Testimonial, ForumTopic, ForumReply, ProfileVisitor } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export const cloudSync = {
  // 1. Perfis / Usuários
  async fetchUsers(): Promise<User[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error || !data) return null;

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        nickname: p.nickname,
        email: p.email || '',
        password: p.password || '',
        avatarUrl: p.avatar_url,
        relationshipStatus: p.relationship_status,
        city: p.city,
        country: p.country,
        bio: p.bio,
        statusMessage: p.status_message,
        birthday: p.birthday,
        occupation: p.occupation,
        interests: p.interests || { music: [], movies: [], books: [], hobbies: [] },
        invisibleMode: p.invisible_mode,
        createdAt: p.created_at
          ? new Date(p.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          : 'Recente',
      }));
    } catch (e) {
      console.warn('Erro ao carregar usuários do Supabase:', e);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        avatar_url: user.avatarUrl,
        relationship_status: user.relationshipStatus,
        city: user.city,
        country: user.country,
        bio: user.bio,
        status_message: user.statusMessage,
        birthday: user.birthday,
        occupation: user.occupation,
        interests: user.interests,
        invisible_mode: user.invisibleMode,
      });
    } catch (e) {
      console.warn('Erro ao salvar usuário no Supabase:', e);
    }
  },

  async deleteUser(userId: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('profiles').delete().eq('id', userId);
      await supabase.from('friendships').delete().or(`user_id.eq.${userId},friend_id.eq.${userId}`);
      await supabase.from('scraps').delete().or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      await supabase.from('testimonials').delete().or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      await supabase.from('visitors').delete().or(`profile_id.eq.${userId},visitor_id.eq.${userId}`);
    } catch (e) {
      console.warn('Erro ao excluir usuário no Supabase:', e);
    }
  },

  // 2. Comunidades
  async fetchCommunities(): Promise<Community[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('communities').select('*');
      if (error || !data) return null;

      return data.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        imageUrl: c.image_url,
        ownerId: c.owner_id,
        ownerName: c.owner_name,
        membersCount: c.members_count || 1,
        isPrivate: c.is_private || false,
        language: c.language || 'Português',
        createdAt: c.created_at,
      }));
    } catch (e) {
      return null;
    }
  },

  async saveCommunity(comm: Community): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('communities').upsert({
        id: comm.id,
        title: comm.title,
        description: comm.description,
        category: comm.category,
        image_url: comm.imageUrl,
        owner_id: comm.ownerId,
        owner_name: comm.ownerName,
        members_count: comm.membersCount,
        is_private: comm.isPrivate,
        language: comm.language,
        created_at: comm.createdAt,
      });
    } catch (e) {
      console.warn('Erro ao salvar comunidade no Supabase:', e);
    }
  },

  // 3. Scraps
  async fetchScraps(): Promise<Scrap[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('scraps').select('*');
      if (error || !data) return null;

      return data.map((s: any) => ({
        id: s.id,
        senderId: s.sender_id,
        senderName: s.sender_name,
        senderAvatar: s.sender_avatar,
        recipientId: s.recipient_id,
        content: s.content,
        createdAt: s.created_at,
      }));
    } catch (e) {
      return null;
    }
  },

  async saveScrap(scrap: Scrap): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('scraps').insert({
        id: scrap.id,
        sender_id: scrap.senderId,
        sender_name: scrap.senderName,
        sender_avatar: scrap.senderAvatar,
        recipient_id: scrap.recipientId,
        content: scrap.content,
        created_at: scrap.createdAt,
      });
    } catch (e) {
      console.warn('Erro ao salvar scrap no Supabase:', e);
    }
  },

  async deleteScrap(id: string): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('scraps').delete().eq('id', id);
    } catch (e) {
      console.warn('Erro ao deletar scrap no Supabase:', e);
    }
  },

  // 4. Depoimentos
  async fetchTestimonials(): Promise<Testimonial[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (error || !data) return null;

      return data.map((t: any) => ({
        id: t.id,
        senderId: t.sender_id,
        senderName: t.sender_name,
        senderAvatar: t.sender_avatar,
        recipientId: t.recipient_id,
        content: t.content,
        status: t.status,
        createdAt: t.created_at,
      }));
    } catch (e) {
      return null;
    }
  },

  async saveTestimonial(test: Testimonial): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('testimonials').insert({
        id: test.id,
        sender_id: test.senderId,
        sender_name: test.senderName,
        sender_avatar: test.senderAvatar,
        recipient_id: test.recipientId,
        content: test.content,
        status: test.status,
        created_at: test.createdAt,
      });
    } catch (e) {
      console.warn('Erro ao salvar depoimento no Supabase:', e);
    }
  },

  async updateTestimonialStatus(id: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      if (status === 'REJECTED') {
        await supabase.from('testimonials').delete().eq('id', id);
      } else {
        await supabase.from('testimonials').update({ status }).eq('id', id);
      }
    } catch (e) {
      console.warn('Erro ao atualizar depoimento no Supabase:', e);
    }
  },
};
