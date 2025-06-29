import supabase from '@/lib/db/connection';
import type { NewTip, TipWithUser, Tip } from '@/lib/db/types';

export class TipsService {
  static async createTip(tipData: NewTip): Promise<Tip> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .insert([tipData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating tip:', error);
      throw new Error('Failed to create tip');
    }
  }

  static async getTips(options: {
    limit?: number;
    offset?: number;
    city?: string;
    category?: string;
    userId?: string;
    search?: string;
  } = {}): Promise<TipWithUser[]> {
    try {
      const { limit = 20, offset = 0, city, category, userId, search } = options;

      let query = supabase
        .from('tips')
        .select(`
          *,
          user:users(id, username, full_name, avatar_url, trust_level)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (search) {
        query = query.or(`content.ilike.%${search}%,location_name.ilike.%${search}%,city.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tips:', error);
      return [];
    }
  }

  static async getTipById(tipId: string, userId?: string): Promise<TipWithUser | null> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(id, username, full_name, avatar_url, trust_level)
        `)
        .eq('id', tipId)
        .single();

      if (error) throw error;
      if (!data) return null;

      let isLiked = false;
      let isSaved = false;

      // Check if user has liked/saved this tip
      if (userId) {
        const [likeResult, saveResult] = await Promise.all([
          supabase
            .from('tip_likes')
            .select('id')
            .eq('tip_id', tipId)
            .eq('user_id', userId)
            .single(),
          supabase
            .from('tip_saves')
            .select('id')
            .eq('tip_id', tipId)
            .eq('user_id', userId)
            .single()
        ]);

        isLiked = !likeResult.error;
        isSaved = !saveResult.error;
      }

      return {
        ...data,
        isLiked,
        isSaved
      };
    } catch (error) {
      console.error('Error fetching tip by ID:', error);
      return null;
    }
  }

  static async likeTip(tipId: string, userId: string): Promise<{ liked: boolean }> {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('tip_likes')
        .select('id')
        .eq('tip_id', tipId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('tip_likes')
          .delete()
          .eq('tip_id', tipId)
          .eq('user_id', userId);

        // Decrement likes count
        await supabase.rpc('decrement_likes_count', { tip_id: tipId });

        return { liked: false };
      } else {
        // Like
        await supabase
          .from('tip_likes')
          .insert([{ tip_id: tipId, user_id: userId }]);

        // Increment likes count
        await supabase.rpc('increment_likes_count', { tip_id: tipId });

        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw new Error('Failed to toggle like');
    }
  }

  static async saveTip(tipId: string, userId: string): Promise<{ saved: boolean }> {
    try {
      // Check if already saved
      const { data: existingSave } = await supabase
        .from('tip_saves')
        .select('id')
        .eq('tip_id', tipId)
        .eq('user_id', userId)
        .single();

      if (existingSave) {
        // Unsave
        await supabase
          .from('tip_saves')
          .delete()
          .eq('tip_id', tipId)
          .eq('user_id', userId);

        // Decrement saves count
        await supabase.rpc('decrement_saves_count', { tip_id: tipId });

        return { saved: false };
      } else {
        // Save
        await supabase
          .from('tip_saves')
          .insert([{ tip_id: tipId, user_id: userId }]);

        // Increment saves count
        await supabase.rpc('increment_saves_count', { tip_id: tipId });

        return { saved: true };
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      throw new Error('Failed to toggle save');
    }
  }

  static async getUserTips(userId: string, limit = 20, offset = 0): Promise<TipWithUser[]> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(id, username, full_name, avatar_url, trust_level)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user tips:', error);
      return [];
    }
  }

  static async getTipStats(userId: string): Promise<{ totalTips: number; totalLikes: number; totalSaves: number }> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('likes_count, saves_count')
        .eq('user_id', userId);

      if (error) throw error;

      const totalTips = data?.length || 0;
      const totalLikes = data?.reduce((sum, tip) => sum + (tip.likes_count || 0), 0) || 0;
      const totalSaves = data?.reduce((sum, tip) => sum + (tip.saves_count || 0), 0) || 0;

      return { totalTips, totalLikes, totalSaves };
    } catch (error) {
      console.error('Error fetching tip stats:', error);
      return { totalTips: 0, totalLikes: 0, totalSaves: 0 };
    }
  }

  static async deleteTip(tipId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tips')
        .delete()
        .eq('id', tipId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error deleting tip:', error);
      throw new Error('Failed to delete tip');
    }
  }

  static async updateTip(tipId: string, userId: string, updates: Partial<NewTip>): Promise<Tip | null> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', tipId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tip:', error);
      throw new Error('Failed to update tip');
    }
  }
}
