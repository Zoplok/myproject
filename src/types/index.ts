export type Page = 'home' | 'stream' | 'profile' | 'dashboard';

export interface Stream {
  id: string;
  title: string;
  streamerName: string;
  streamerAvatar: string;
  thumbnail: string;
  category: string;
  viewers: number;
  followers: number;
  totalViews: number;
  tags: string[];
  isLive: boolean;
  startedAt: string;
  aiRecommended?: boolean;
  aiReason?: string;
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  viewers: number;
  streams: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  usernameColor: string;
  message: string;
  timestamp: string;
  badges: Badge[];
  isHighlighted?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface Badge {
  type: 'moderator' | 'vip' | 'subscriber' | 'broadcaster' | 'verified';
  label: string;
}

export interface AIHighlight {
  id: string;
  title: string;
  timestamp: string;
  thumbnail: string;
  duration: string;
  clipType: 'funny' | 'clutch' | 'rage' | 'hype' | 'skill';
}

export interface AnalyticsStat {
  label: string;
  value: string;
  change: number;
  period: string;
}

export interface StreamerProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: number;
  totalViews: number;
  subscriberCount: number;
  isVerified: boolean;
  socialLinks: { platform: string; url: string }[];
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  category: string;
}

export interface Clip {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  duration: string;
  createdAt: string;
}
