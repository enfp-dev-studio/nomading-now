// Database types for our application
export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  points: number;
  trust_level: string;
  created_at: string;
  updated_at: string;
}

export interface Tip {
  id: string;
  user_id: string;
  content: string;
  location_name: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  category: string;
  photos?: string[];
  likes_count: number;
  saves_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface TipLike {
  id: string;
  user_id: string;
  tip_id: string;
  created_at: string;
}

export interface TipSave {
  id: string;
  user_id: string;
  tip_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  tip_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Input types for creating new records
export type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;
export type NewTip = Omit<Tip, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'saves_count' | 'comments_count'>;
export type NewComment = Omit<Comment, 'id' | 'created_at' | 'updated_at'>;

// Extended types with user information
export interface TipWithUser extends Tip {
  user: Pick<User, 'id' | 'username' | 'full_name' | 'avatar_url' | 'trust_level'>;
  isLiked?: boolean;
  isSaved?: boolean;
}
