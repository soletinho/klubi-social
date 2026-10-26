'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Scrap, 
  Testimonial, 
  ProfileVisitor, 
  UserReputation, 
  Community, 
  ForumTopic, 
  ForumReply, 
  CommunityPoll 
} from '@/types';
import { db } from '@/lib/database';
import { cloudSync } from '@/lib/cloudSync';

interface RegisterData {
  name: string;
  nickname: string;
  email: string;
  password?: string;
  city: string;
  relationshipStatus: User['relationshipStatus'];
  avatarUrl?: string;
}

interface KlubiContextType {
  currentUser: User | null;
  isLoadingSession: boolean;
  login: (emailOrNick: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  deleteAccount: () => Promise<boolean>;
  
  // Usuários & Amizades
  getUserById: (id: string) => User | undefined;
  getAllUsers: () => User[];
  isFriend: (targetId: string) => boolean;
  toggleFriendship: (targetId: string) => boolean;
  getUserFriends: (userId: string) => User[];

  // Scraps
  scraps: Scrap[];
  addScrap: (recipientId: string, content: string) => void;
  deleteScrap: (scrapId: string) => void;
  getScrapsForUser: (userId: string) => Scrap[];

  // Depoimentos
  testimonials: Testimonial[];
  addTestimonial: (recipientId: string, content: string) => void;
  acceptTestimonial: (testId: string) => void;
  rejectTestimonial: (testId: string) => void;
  getTestimonialsForUser: (userId: string) => Testimonial[];

  // Comunidades
  communities: Community[];
  createCommunity: (title: string, description: string, category: string, imageUrl?: string) => Community;
  isCommunityMember: (communityId: string) => boolean;
  toggleCommunityMembership: (communityId: string) => boolean;
  getCommunityMembers: (communityId: string) => User[];
  getUserCommunities: (userId: string) => Community[];

  // Fórum
  topics: ForumTopic[];
  createTopic: (communityId: string, title: string, content: string) => ForumTopic;
  getTopicsByCommunity: (communityId: string) => ForumTopic[];
  replies: ForumReply[];
  addReply: (topicId: string, content: string) => void;
  getRepliesByTopic: (topicId: string) => ForumReply[];

  // Enquetes
  polls: CommunityPoll[];
  createPoll: (communityId: string, question: string, optionTexts: string[]) => void;
  votePoll: (pollId: string, optionId: string) => void;
  getPollByCommunity: (communityId: string) => CommunityPoll | undefined;

  // Visitantes (Quem Me Viu)
  visitors: ProfileVisitor[];
  recordVisit: (targetProfileId: string) => void;
  clearVisitors: () => void;

  // Reputação
  getReputation: (userId: string) => UserReputation;
  updateReputation: (userId: string, category: 'trusty' | 'cool' | 'sexy', level: number) => void;
  toggleFan: (userId: string) => void;
}

const KlubiContext = createContext<KlubiContextType | null>(null);

export const KlubiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Estados locais sincronizados com o banco
  const [users, setUsers] = useState<User[]>([]);
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [polls, setPolls] = useState<CommunityPoll[]>([]);
  const [visitors, setVisitors] = useState<ProfileVisitor[]>([]);

  // Carrega os dados reais do banco ao inicializar
  useEffect(() => {
    const session = db.getSessionUser();
    if (session) {
      setCurrentUser(session);
      // Garante que o usuário logado está na nuvem
      cloudSync.saveUser(session);
    }

    const localUsers = db.getUsers();
    setUsers(localUsers);

    // Se houver usuários locais, envia para a nuvem para que outros vejam
    localUsers.forEach((u) => cloudSync.saveUser(u));

    setScraps(db.getScraps());
    setTestimonials(db.getTestimonials());
    setCommunities(db.getCommunities());
    setTopics(db.getTopics());
    setReplies(db.getReplies());
    setPolls(db.getPolls());
    setVisitors(db.getVisitors());
    setIsLoadingSession(false);

    // Sincronização em nuvem com Supabase (quando as chaves estiverem configuradas)
    const syncCloudData = async () => {
      try {
        const cloudUsers = await cloudSync.fetchUsers();
        if (cloudUsers && cloudUsers.length > 0) {
          cloudUsers.forEach((u) => db.saveUser(u));
          setUsers(db.getUsers());
        }

        const cloudComms = await cloudSync.fetchCommunities();
        if (cloudComms && cloudComms.length > 0) {
          cloudComms.forEach((c) => db.saveCommunity(c));
          setCommunities(db.getCommunities());
        }

        const cloudScraps = await cloudSync.fetchScraps();
        if (cloudScraps && cloudScraps.length > 0) {
          setScraps(cloudScraps);
        }

        const cloudTests = await cloudSync.fetchTestimonials();
        if (cloudTests && cloudTests.length > 0) {
          setTestimonials(cloudTests);
        }
      } catch (err) {
        console.warn('Erro ao sincronizar com nuvem:', err);
      }
    };

    syncCloudData();
  }, []);

  // Cadastro de novo usuário do zero
  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    const cleanNick = data.nickname.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Verifica se já existe esse nickname ou e-mail
    if (db.getUserByNickname(cleanNick)) {
      return { success: false, message: 'Este apelido (@username) já está em uso.' };
    }
    if (db.getUserByEmail(data.email)) {
      return { success: false, message: 'Já existe uma conta com este e-mail.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      nickname: cleanNick,
      email: data.email.trim().toLowerCase(),
      password: data.password || '',
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanNick}`,
      relationshipStatus: data.relationshipStatus,
      city: data.city.trim() || 'Brasil',
      country: 'Brasil',
      bio: 'Acabei de entrar para o Klubi! Deixe um recado no meu mural.',
      statusMessage: 'conectado no Klubi.',
      birthday: 'Não informado',
      occupation: 'Membro',
      interests: {
        music: [],
        movies: [],
        books: [],
        hobbies: [],
      },
      invisibleMode: false,
      createdAt: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    };

    db.saveUser(newUser);
    db.setSessionUser(newUser);
    setCurrentUser(newUser);
    setUsers(db.getUsers());
    cloudSync.saveUser(newUser);

    return { success: true };
  };

  // Login com e-mail ou @apelido
  const login = async (emailOrNick: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const query = emailOrNick.trim().toLowerCase();
    const user = db.getUserByEmail(query) || db.getUserByNickname(query);

    if (!user) {
      return { success: false, message: 'Usuário não encontrado. Crie sua conta primeiro!' };
    }

    if (user.password && password && user.password !== password) {
      return { success: false, message: 'Senha incorreta.' };
    }

    db.setSessionUser(user);
    setCurrentUser(user);
    return { success: true };
  };

  // Logout
  const logout = () => {
    db.setSessionUser(null);
    setCurrentUser(null);
  };

  // Atualizar perfil
  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    db.saveUser(updated);
    db.setSessionUser(updated);
    setCurrentUser(updated);
    setUsers(db.getUsers());
    cloudSync.saveUser(updated);
  };

  // Excluir conta permanentemente
  const deleteAccount = async (): Promise<boolean> => {
    if (!currentUser) return false;
    const userId = currentUser.id;
    db.deleteUser(userId);
    setUsers(db.getUsers());
    setCurrentUser(null);
    await cloudSync.deleteUser(userId);
    return true;
  };

  // Usuários & Amizades
  const getUserById = (id: string): User | undefined => {
    return users.find((u) => u.id === id) || db.getUserById(id);
  };
  const getAllUsers = (): User[] => {
    return users.length > 0 ? users : db.getUsers();
  };

  const isFriend = (targetId: string): boolean => {
    if (!currentUser) return false;
    const friendships = db.getFriendships();
    const list = friendships[currentUser.id] || [];
    return list.includes(targetId);
  };

  const toggleFriendship = (targetId: string): boolean => {
    if (!currentUser) return false;
    const isNow = db.toggleFriendship(currentUser.id, targetId);
    return isNow;
  };

  const getUserFriends = (userId: string): User[] => {
    const friendships = db.getFriendships();
    const friendIds = friendships[userId] || [];
    return friendIds.map((id) => db.getUserById(id)).filter(Boolean) as User[];
  };

  // Scraps
  const addScrap = (recipientId: string, content: string) => {
    if (!currentUser) return;
    const newScrap: Scrap = {
      id: `scrap-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      recipientId,
      content,
      createdAt: 'Agora mesmo',
    };
    db.saveScrap(newScrap);
    setScraps(db.getScraps());
    cloudSync.saveScrap(newScrap);
  };

  const deleteScrap = (scrapId: string) => {
    db.deleteScrap(scrapId);
    setScraps(db.getScraps());
    cloudSync.deleteScrap(scrapId);
  };

  const getScrapsForUser = (userId: string): Scrap[] => {
    return scraps.filter((s) => s.recipientId === userId);
  };

  // Depoimentos
  const addTestimonial = (recipientId: string, content: string) => {
    if (!currentUser) return;
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      recipientId,
      content,
      status: 'PENDING',
      createdAt: 'Agora mesmo',
    };
    db.saveTestimonial(newTest);
    setTestimonials(db.getTestimonials());
    cloudSync.saveTestimonial(newTest);
  };

  const acceptTestimonial = (testId: string) => {
    db.updateTestimonialStatus(testId, 'ACCEPTED');
    setTestimonials(db.getTestimonials());
    cloudSync.updateTestimonialStatus(testId, 'ACCEPTED');
  };

  const rejectTestimonial = (testId: string) => {
    db.updateTestimonialStatus(testId, 'REJECTED');
    setTestimonials(db.getTestimonials());
    cloudSync.updateTestimonialStatus(testId, 'REJECTED');
  };

  const getTestimonialsForUser = (userId: string): Testimonial[] => {
    return testimonials.filter((t) => t.recipientId === userId);
  };

  // Comunidades
  const createCommunity = (title: string, description: string, category: string, imageUrl?: string): Community => {
    const newComm: Community = {
      id: `comm-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&auto=format&fit=crop&q=80',
      ownerId: currentUser?.id || 'admin',
      ownerName: currentUser?.name || 'Fundador',
      membersCount: 1,
      isPrivate: false,
      language: 'Português',
      createdAt: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    };

    db.saveCommunity(newComm);
    if (currentUser) {
      db.toggleMembership(newComm.id, currentUser.id);
    }
    setCommunities(db.getCommunities());
    cloudSync.saveCommunity(newComm);
    return newComm;
  };

  const isCommunityMember = (communityId: string): boolean => {
    if (!currentUser) return false;
    const memberships = db.getMemberships();
    return (memberships[communityId] || []).includes(currentUser.id);
  };

  const toggleCommunityMembership = (communityId: string): boolean => {
    if (!currentUser) return false;
    const isNow = db.toggleMembership(communityId, currentUser.id);
    setCommunities((prev) =>
      prev.map((c) =>
        c.id === communityId
          ? { ...c, membersCount: isNow ? c.membersCount + 1 : Math.max(1, c.membersCount - 1) }
          : c
      )
    );
    return isNow;
  };

  const getCommunityMembers = (communityId: string): User[] => {
    const memberships = db.getMemberships();
    const userIds = memberships[communityId] || [];
    return userIds.map((id) => db.getUserById(id)).filter(Boolean) as User[];
  };

  const getUserCommunities = (userId: string): Community[] => {
    const memberships = db.getMemberships();
    return communities.filter((c) => (memberships[c.id] || []).includes(userId));
  };

  // Fórum
  const createTopic = (communityId: string, title: string, content: string): ForumTopic => {
    const newTopic: ForumTopic = {
      id: `topic-${Date.now()}`,
      communityId,
      authorId: currentUser?.id || 'anon',
      authorName: currentUser?.name || 'Membro',
      authorAvatar: currentUser?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=klubi',
      title: title.trim(),
      content: content.trim(),
      isPinned: false,
      isLocked: false,
      repliesCount: 0,
      createdAt: 'Agora mesmo',
    };
    db.saveTopic(newTopic);
    setTopics(db.getTopics());
    return newTopic;
  };

  const getTopicsByCommunity = (communityId: string): ForumTopic[] => {
    return topics.filter((t) => t.communityId === communityId);
  };

  const addReply = (topicId: string, content: string) => {
    if (!currentUser) return;
    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      topicId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      content: content.trim(),
      createdAt: 'Agora mesmo',
    };
    db.saveReply(newReply);
    setReplies(db.getReplies());
    // Incrementa contagem no tópico
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, repliesCount: t.repliesCount + 1 } : t))
    );
  };

  const getRepliesByTopic = (topicId: string): ForumReply[] => {
    return replies.filter((r) => r.topicId === topicId);
  };

  // Enquetes
  const createPoll = (communityId: string, question: string, optionTexts: string[]) => {
    const newPoll: CommunityPoll = {
      id: `poll-${Date.now()}`,
      communityId,
      question: question.trim(),
      totalVotes: 0,
      options: optionTexts.map((text, idx) => ({ id: `opt-${idx}`, text, votes: 0 })),
    };
    db.savePoll(newPoll);
    setPolls(db.getPolls());
  };

  const votePoll = (pollId: string, optionId: string) => {
    db.votePoll(pollId, optionId);
    setPolls(db.getPolls());
  };

  const getPollByCommunity = (communityId: string): CommunityPoll | undefined => {
    return polls.find((p) => p.communityId === communityId);
  };

  // Visitantes
  const recordVisit = (targetProfileId: string) => {
    if (!currentUser || currentUser.id === targetProfileId || currentUser.invisibleMode) return;
    const newVisitor: ProfileVisitor = {
      id: `vis-${Date.now()}`,
      profileId: targetProfileId,
      visitorId: currentUser.id,
      visitorName: currentUser.name,
      visitorAvatar: currentUser.avatarUrl,
      visitedAt: 'Agora mesmo',
      isFriend: isFriend(targetProfileId),
    };
    db.saveVisitor(newVisitor);
    setVisitors(db.getVisitors());
  };

  const clearVisitors = () => {
    if (!currentUser) return;
    db.clearVisitors(currentUser.id);
    setVisitors(db.getVisitors());
  };

  // Reputação
  const getReputation = (userId: string): UserReputation => {
    const reps = db.getReputations();
    return (
      reps[userId] || {
        userId,
        trustyPercent: 0,
        coolPercent: 0,
        sexyPercent: 0,
        fansCount: 0,
      }
    );
  };

  const updateReputation = (userId: string, category: 'trusty' | 'cool' | 'sexy', level: number) => {
    const current = getReputation(userId);
    const percent = Math.round((level / 3) * 100);
    const updated: UserReputation = {
      ...current,
      [`${category}Percent`]: percent,
    };
    db.saveReputation(updated);
  };

  const toggleFan = (userId: string) => {
    const current = getReputation(userId);
    const updated: UserReputation = {
      ...current,
      fansCount: current.fansCount + 1,
    };
    db.saveReputation(updated);
  };

  return (
    <KlubiContext.Provider
      value={{
        currentUser,
        isLoadingSession,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        getUserById,
        getAllUsers,
        isFriend,
        toggleFriendship,
        getUserFriends,
        scraps,
        addScrap,
        deleteScrap,
        getScrapsForUser,
        testimonials,
        addTestimonial,
        acceptTestimonial,
        rejectTestimonial,
        getTestimonialsForUser,
        communities,
        createCommunity,
        isCommunityMember,
        toggleCommunityMembership,
        getCommunityMembers,
        getUserCommunities,
        topics,
        createTopic,
        getTopicsByCommunity,
        replies,
        addReply,
        getRepliesByTopic,
        polls,
        createPoll,
        votePoll,
        getPollByCommunity,
        visitors,
        recordVisit,
        clearVisitors,
        getReputation,
        updateReputation,
        toggleFan,
      }}
    >
      {children}
    </KlubiContext.Provider>
  );
};

export const useKlubi = () => {
  const context = useContext(KlubiContext);
  if (!context) {
    throw new Error('useKlubi deve ser usado dentro de um KlubiProvider');
  }
  return context;
};
