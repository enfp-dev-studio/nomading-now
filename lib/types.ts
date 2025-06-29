// Re-export types from database schema
export type { 
  User, 
  NewUser, 
  Tip, 
  NewTip, 
  TipLike, 
  NewTipLike, 
  TipSave, 
  NewTipSave, 
  Comment, 
  NewComment 
} from './db/schema';

// Legacy types for backward compatibility
export type TipCategory = 
  | 'food'
  | 'cafe'
  | 'coworking'
  | 'accommodation'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'nature'
  | 'culture';

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  tips_count: number;
  featured_image?: string;
  description?: string;
}