import { 
  User, 
  UserReputation, 
  Scrap, 
  Testimonial, 
  FriendSummary, 
  CommunitySummary,
  Community,
  ForumTopic,
  ForumReply,
  CommunityPoll,
  ProfileVisitor
} from '@/types';

// ===============================================================
// REDE LIMPA DO ZERO - SEM DADOS MOCKADOS
// ===============================================================

export const mockCurrentUser: User = {
  id: '',
  name: '',
  nickname: '',
  email: '',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=klubi',
  relationshipStatus: 'single',
  city: '',
  country: 'Brasil',
  bio: '',
  statusMessage: '',
  birthday: '',
  occupation: '',
  interests: {
    music: [],
    movies: [],
    books: [],
    hobbies: [],
  },
  invisibleMode: false,
  createdAt: '',
};

export const mockReputation: UserReputation = {
  userId: '',
  trustyPercent: 0,
  coolPercent: 0,
  sexyPercent: 0,
  fansCount: 0,
};

export const mockSeparationPath = [
  { id: 'me', name: 'Você' },
];

export const mockScraps: Scrap[] = [];
export const mockTestimonials: Testimonial[] = [];
export const mockFriends: FriendSummary[] = [];
export const mockCommunities: CommunitySummary[] = [];
export const mockFullCommunities: Community[] = [];
export const mockTopics: Record<string, ForumTopic[]> = {};
export const mockReplies: Record<string, ForumReply[]> = {};
export const mockPolls: Record<string, CommunityPoll> = {};
export const mockVisitors: ProfileVisitor[] = [];
