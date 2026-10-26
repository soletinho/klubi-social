export type RelationshipStatus = 'single' | 'dating' | 'married' | 'complicated';

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatarUrl: string;
  relationshipStatus: RelationshipStatus;
  city: string;
  country: string;
  bio: string;
  statusMessage: string;
  birthday: string;
  occupation: string;
  interests: {
    music: string[];
    movies: string[];
    books: string[];
    hobbies: string[];
  };
  invisibleMode: boolean;
  password?: string;
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

export interface FriendSummary {
  id: string;
  name: string;
  avatarUrl: string;
}

export type FriendshipStatus = 'FRIENDS' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NOT_FRIENDS';

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderNickname?: string;
  recipientId: string;
  createdAt: string;
}

export interface CommunitySummary {
  id: string;
  title: string;
  imageUrl: string;
  membersCount: number;
}

export interface ProfileVisitor {
  id: string;
  profileId: string;
  visitorId: string;
  visitorName: string;
  visitorAvatar: string;
  visitedAt: string;
  isFriend: boolean;
}

export interface Community {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  membersCount: number;
  isPrivate: boolean;
  language: string;
  createdAt: string;
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

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPoll {
  id: string;
  communityId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}
