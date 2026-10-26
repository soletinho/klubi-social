import { 
  User, 
  Scrap, 
  Testimonial, 
  Community, 
  ForumTopic, 
  ForumReply, 
  CommunityPoll, 
  ProfileVisitor,
  UserReputation 
} from '@/types';

// Chaves do LocalStorage
const STORAGE_KEYS = {
  USERS: 'klubi_users_v1',
  SESSION: 'klubi_session_v1',
  SCRAPS: 'klubi_scraps_v1',
  TESTIMONIALS: 'klubi_testimonials_v1',
  COMMUNITIES: 'klubi_communities_v1',
  MEMBERS: 'klubi_members_v1',
  TOPICS: 'klubi_topics_v1',
  REPLIES: 'klubi_replies_v1',
  POLLS: 'klubi_polls_v1',
  VISITORS: 'klubi_visitors_v1',
  FRIENDSHIPS: 'klubi_friendships_v1',
  REPUTATIONS: 'klubi_reputations_v1',
};

// Helper seguro para leitura no client-side
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }
}

export const db = {
  // Usuários
  getUsers: (): User[] => getItem<User[]>(STORAGE_KEYS.USERS, []),
  saveUser: (user: User): void => {
    const users = db.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    setItem(STORAGE_KEYS.USERS, users);
  },
  getUserById: (id: string): User | undefined => {
    const users = db.getUsers();
    return users.find((u) => u.id === id);
  },
  getUserByEmail: (email: string): User | undefined => {
    const users = db.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserByNickname: (nickname: string): User | undefined => {
    const users = db.getUsers();
    return users.find((u) => u.nickname.toLowerCase() === nickname.toLowerCase());
  },

  // Sessão atual
  getSessionUser: (): User | null => getItem<User | null>(STORAGE_KEYS.SESSION, null),
  setSessionUser: (user: User | null): void => setItem(STORAGE_KEYS.SESSION, user),

  // Scraps
  getScraps: (): Scrap[] => getItem<Scrap[]>(STORAGE_KEYS.SCRAPS, []),
  saveScrap: (scrap: Scrap): void => {
    const scraps = db.getScraps();
    setItem(STORAGE_KEYS.SCRAPS, [scrap, ...scraps]);
  },
  deleteScrap: (id: string): void => {
    const scraps = db.getScraps().filter((s) => s.id !== id);
    setItem(STORAGE_KEYS.SCRAPS, scraps);
  },

  // Depoimentos
  getTestimonials: (): Testimonial[] => getItem<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []),
  saveTestimonial: (test: Testimonial): void => {
    const tests = db.getTestimonials();
    setItem(STORAGE_KEYS.TESTIMONIALS, [test, ...tests]);
  },
  updateTestimonialStatus: (id: string, status: 'ACCEPTED' | 'REJECTED'): void => {
    if (status === 'REJECTED') {
      const tests = db.getTestimonials().filter((t) => t.id !== id);
      setItem(STORAGE_KEYS.TESTIMONIALS, tests);
    } else {
      const tests = db.getTestimonials().map((t) => (t.id === id ? { ...t, status } : t));
      setItem(STORAGE_KEYS.TESTIMONIALS, tests);
    }
  },

  // Comunidades
  getCommunities: (): Community[] => getItem<Community[]>(STORAGE_KEYS.COMMUNITIES, []),
  saveCommunity: (comm: Community): void => {
    const list = db.getCommunities();
    setItem(STORAGE_KEYS.COMMUNITIES, [comm, ...list]);
  },
  getCommunityById: (id: string): Community | undefined => {
    return db.getCommunities().find((c) => c.id === id);
  },

  // Membros de comunidades: Record<communityId, userId[]>
  getMemberships: (): Record<string, string[]> => getItem<Record<string, string[]>>(STORAGE_KEYS.MEMBERS, {}),
  toggleMembership: (communityId: string, userId: string): boolean => {
    const memberships = db.getMemberships();
    const current = memberships[communityId] || [];
    let isMember = false;
    if (current.includes(userId)) {
      memberships[communityId] = current.filter((id) => id !== userId);
      isMember = false;
    } else {
      memberships[communityId] = [...current, userId];
      isMember = true;
    }
    setItem(STORAGE_KEYS.MEMBERS, memberships);
    return isMember;
  },

  // Tópicos
  getTopics: (): ForumTopic[] => getItem<ForumTopic[]>(STORAGE_KEYS.TOPICS, []),
  saveTopic: (topic: ForumTopic): void => {
    const list = db.getTopics();
    setItem(STORAGE_KEYS.TOPICS, [topic, ...list]);
  },

  // Respostas
  getReplies: (): ForumReply[] => getItem<ForumReply[]>(STORAGE_KEYS.REPLIES, []),
  saveReply: (reply: ForumReply): void => {
    const list = db.getReplies();
    setItem(STORAGE_KEYS.REPLIES, [...list, reply]);
  },

  // Enquetes
  getPolls: (): CommunityPoll[] => getItem<CommunityPoll[]>(STORAGE_KEYS.POLLS, []),
  savePoll: (poll: CommunityPoll): void => {
    const list = db.getPolls();
    setItem(STORAGE_KEYS.POLLS, [poll, ...list]);
  },
  votePoll: (pollId: string, optionId: string): void => {
    const polls = db.getPolls().map((p) => {
      if (p.id === pollId) {
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          options: p.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        };
      }
      return p;
    });
    setItem(STORAGE_KEYS.POLLS, polls);
  },

  // Visitantes (Quem Me Viu)
  getVisitors: (): ProfileVisitor[] => getItem<ProfileVisitor[]>(STORAGE_KEYS.VISITORS, []),
  saveVisitor: (visitor: ProfileVisitor): void => {
    const list = db.getVisitors().filter(
      (v) => !(v.profileId === visitor.profileId && v.visitorId === visitor.visitorId)
    );
    setItem(STORAGE_KEYS.VISITORS, [visitor, ...list]);
  },
  clearVisitors: (profileId: string): void => {
    const list = db.getVisitors().filter((v) => v.profileId !== profileId);
    setItem(STORAGE_KEYS.VISITORS, list);
  },

  // Amizades: Record<userId, friendId[]>
  getFriendships: (): Record<string, string[]> => getItem<Record<string, string[]>>(STORAGE_KEYS.FRIENDSHIPS, {}),
  toggleFriendship: (userId: string, targetId: string): boolean => {
    const friendships = db.getFriendships();
    const userFriends = friendships[userId] || [];
    let isNow = false;

    if (userFriends.includes(targetId)) {
      friendships[userId] = userFriends.filter((id) => id !== targetId);
      isNow = false;
    } else {
      friendships[userId] = [...userFriends, targetId];
      isNow = true;
    }
    setItem(STORAGE_KEYS.FRIENDSHIPS, friendships);
    return isNow;
  },

  // Reputações
  getReputations: (): Record<string, UserReputation> => getItem<Record<string, UserReputation>>(STORAGE_KEYS.REPUTATIONS, {}),
  saveReputation: (rep: UserReputation): void => {
    const reps = db.getReputations();
    reps[rep.userId] = rep;
    setItem(STORAGE_KEYS.REPUTATIONS, reps);
  },
};
