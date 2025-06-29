export interface User {
  id: string;
  email: string;
  nickname: string;
  bio?: string;
  avatar_url?: string;
  points: number;
  trust_level: number;
  created_at: string;
}

export interface UserProfile {
  user_id: string;
  full_name?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  languages?: string[];
  interests?: string[];
  travel_style?: string;
  work_type?: string;
  marketing_bio?: string;
  marketing_links?: MarketingLink[];
  show_marketing?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketingLink {
  id: string;
  title: string;
  url: string;
  type: 'website' | 'portfolio' | 'social' | 'shop' | 'donation' | 'other';
  icon?: string;
}

export interface UserStats {
  user_id: string;
  tips_count: number;
  likes_received: number;
  comments_received: number;
  saves_received: number;
  cities_visited: number;
  countries_visited: number;
  last_activity: string;
  updated_at: string;
}

export interface Tip {
  id: string;
  user_id: string;
  content: string;
  category: TipCategory;
  images?: string[];
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    address?: string;
  };
  likes_count: number;
  comments_count: number;
  saves_count: number;
  created_at: string;
  updated_at?: string;
  user?: User;
  is_liked?: boolean;
  is_saved?: boolean;
}

export interface Comment {
  id: string;
  tip_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: User;
}

export interface TipLike {
  id: string;
  tip_id: string;
  user_id: string;
  created_at: string;
}

export interface TipSave {
  id: string;
  tip_id: string;
  user_id: string;
  created_at: string;
}

export type TipCategory = 
  | 'food' 
  | 'cafe' 
  | 'accommodation' 
  | 'workspace' 
  | 'exercise' 
  | 'entertainment' 
  | 'transport' 
  | 'shopping'
  | 'nature'
  | 'other';

export interface TipCategoryInfo {
  id: TipCategory;
  emoji: string;
  label: string;
  color: string;
}

export const TIP_CATEGORIES: TipCategoryInfo[] = [
  { id: 'food', emoji: '🍽️', label: 'Food', color: 'bg-red-100 text-red-700' },
  { id: 'cafe', emoji: '☕', label: 'Cafe', color: 'bg-amber-100 text-amber-700' },
  { id: 'accommodation', emoji: '🏠', label: 'Stay', color: 'bg-blue-100 text-blue-700' },
  { id: 'workspace', emoji: '💻', label: 'Work', color: 'bg-purple-100 text-purple-700' },
  { id: 'exercise', emoji: '🏃‍♂️', label: 'Fitness', color: 'bg-green-100 text-green-700' },
  { id: 'entertainment', emoji: '🎉', label: 'Fun', color: 'bg-pink-100 text-pink-700' },
  { id: 'transport', emoji: '🚗', label: 'Transport', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping', color: 'bg-orange-100 text-orange-700' },
  { id: 'nature', emoji: '🌿', label: 'Nature', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'other', emoji: '📍', label: 'Other', color: 'bg-gray-100 text-gray-700' },
];

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}