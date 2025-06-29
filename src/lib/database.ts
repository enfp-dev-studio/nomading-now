import { supabase } from './supabase';
import { Tip, User, Comment, UserProfile } from '@/types';

// Tips API
export const tipsApi = {
  // Get all tips with user info and interaction status
  async getTips(userId?: string) {
    console.log('🔍 [tipsApi.getTips] Starting database query...', { 
      userId: userId || 'Not provided (non-logged user)',
      hasUserId: !!userId 
    });
    
    try {
      // First, let's check if we can connect to the database at all
      console.log('🔍 [tipsApi.getTips] Testing database connection...');
      const { data: testData, error: testError } = await supabase
        .from('tips')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ [tipsApi.getTips] Database connection failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      console.log('✅ [tipsApi.getTips] Database connection successful');

      // Now let's try to get the actual data
      console.log('🔍 [tipsApi.getTips] Executing main query...');
      
      let query = supabase
        .from('tips')
        .select(`
          *,
          user:users(*),
          is_liked:tip_likes!left(user_id),
          is_saved:tip_saves!left(user_id)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error('❌ [tipsApi.getTips] Query error:', error);
        throw new Error(`Query failed: ${error.message}`);
      }

      console.log('✅ [tipsApi.getTips] Raw database response:', data);
      console.log(`📊 [tipsApi.getTips] Found ${data?.length || 0} tips in database`);

      if (!data || data.length === 0) {
        console.log('⚠️ [tipsApi.getTips] No tips found in database');
        return [];
      }

      // Transform the data to match our Tip interface
      const transformedTips = data.map((tip, index) => {
        console.log(`🔄 [tipsApi.getTips] Transforming tip ${index + 1}:`, {
          id: tip.id,
          content: tip.content?.slice(0, 50) + '...',
          user: tip.user?.nickname,
          location: `${tip.city}, ${tip.country}`,
          hasUser: !!tip.user,
          userId: tip.user_id
        });
        
        const transformedTip = {
          ...tip,
          location: {
            latitude: Number(tip.latitude),
            longitude: Number(tip.longitude),
            city: tip.city,
            country: tip.country,
            address: tip.address,
          },
          // Only check likes/saves if user is logged in
          is_liked: userId ? tip.is_liked?.some((like: any) => like.user_id === userId) : false,
          is_saved: userId ? tip.is_saved?.some((save: any) => save.user_id === userId) : false,
        };
        
        return transformedTip;
      }) as Tip[];

      console.log('🎉 [tipsApi.getTips] Successfully transformed tips');
      console.log(`📈 [tipsApi.getTips] Returning ${transformedTips.length} tips`);
      
      return transformedTips;
    } catch (error) {
      console.error('💥 [tipsApi.getTips] Error in getTips:', error);
      throw error;
    }
  },

  // Get tips by category
  async getTipsByCategory(category: string, userId?: string) {
    console.log('🔍 [tipsApi.getTipsByCategory] Fetching tips by category:', { 
      category, 
      userId: userId || 'Not provided (non-logged user)',
      hasUserId: !!userId 
    });
    
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(*),
          is_liked:tip_likes!left(user_id),
          is_saved:tip_saves!left(user_id)
        `)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [tipsApi.getTipsByCategory] Database error:', error);
        throw error;
      }

      console.log(`✅ [tipsApi.getTipsByCategory] Found ${data?.length || 0} tips for category: ${category}`);

      return data?.map(tip => ({
        ...tip,
        location: {
          latitude: Number(tip.latitude),
          longitude: Number(tip.longitude),
          city: tip.city,
          country: tip.country,
          address: tip.address,
        },
        // Only check likes/saves if user is logged in
        is_liked: userId ? tip.is_liked?.some((like: any) => like.user_id === userId) : false,
        is_saved: userId ? tip.is_saved?.some((save: any) => save.user_id === userId) : false,
      })) as Tip[] || [];
    } catch (error) {
      console.error('💥 [tipsApi.getTipsByCategory] Error in getTipsByCategory:', error);
      throw error;
    }
  },

  // Get tips by user
  async getUserTips(userId: string) {
    console.log('🔍 [tipsApi.getUserTips] Fetching user tips:', { userId });
    
    try {
      const { data, error } = await supabase
        .from('tips')
        .select(`
          *,
          user:users(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ [tipsApi.getUserTips] Database error:', error);
        throw error;
      }

      console.log(`✅ [tipsApi.getUserTips] Found ${data?.length || 0} tips for user: ${userId}`);

      return data?.map(tip => ({
        ...tip,
        location: {
          latitude: Number(tip.latitude),
          longitude: Number(tip.longitude),
          city: tip.city,
          country: tip.country,
          address: tip.address,
        },
      })) as Tip[] || [];
    } catch (error) {
      console.error('💥 [tipsApi.getUserTips] Error in getUserTips:', error);
      throw error;
    }
  },

  // Create a new tip
  async createTip(tip: Omit<Tip, 'id' | 'created_at' | 'updated_at' | 'user' | 'likes_count' | 'comments_count' | 'saves_count'>) {
    console.log('🔍 [tipsApi.createTip] Creating new tip:', {
      user_id: tip.user_id,
      category: tip.category,
      city: tip.location.city,
      content: tip.content.slice(0, 50) + '...'
    });
    
    try {
      const { data, error } = await supabase
        .from('tips')
        .insert({
          user_id: tip.user_id,
          content: tip.content,
          category: tip.category,
          images: tip.images || [],
          latitude: tip.location.latitude,
          longitude: tip.location.longitude,
          city: tip.location.city,
          country: tip.location.country,
          address: tip.location.address,
        })
        .select(`
          *,
          user:users(*)
        `)
        .single();

      if (error) {
        console.error('❌ [tipsApi.createTip] Error creating tip:', error);
        throw error;
      }

      console.log('✅ [tipsApi.createTip] Created tip:', data.id);

      return {
        ...data,
        location: {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          city: data.city,
          country: data.country,
          address: data.address,
        },
      } as Tip;
    } catch (error) {
      console.error('💥 [tipsApi.createTip] Error in createTip:', error);
      throw error;
    }
  },

  // Update a tip
  async updateTip(tipId: string, updates: Partial<Tip>) {
    const updateData: any = {};
    
    if (updates.content) updateData.content = updates.content;
    if (updates.category) updateData.category = updates.category;
    if (updates.images) updateData.images = updates.images;
    if (updates.location) {
      updateData.latitude = updates.location.latitude;
      updateData.longitude = updates.location.longitude;
      updateData.city = updates.location.city;
      updateData.country = updates.location.country;
      updateData.address = updates.location.address;
    }

    const { data, error } = await supabase
      .from('tips')
      .update(updateData)
      .eq('id', tipId)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      location: {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        city: data.city,
        country: data.country,
        address: data.address,
      },
    } as Tip;
  },

  // Delete a tip
  async deleteTip(tipId: string) {
    const { error } = await supabase
      .from('tips')
      .delete()
      .eq('id', tipId);

    if (error) throw error;
  },
};

// Interactions API
export const interactionsApi = {
  // Like/unlike a tip
  async toggleLike(tipId: string, userId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('tip_likes')
      .select('id')
      .eq('tip_id', tipId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('tip_likes')
        .delete()
        .eq('tip_id', tipId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return false; // unliked
    } else {
      // Like
      const { error } = await supabase
        .from('tip_likes')
        .insert({ tip_id: tipId, user_id: userId });
      
      if (error) throw error;
      return true; // liked
    }
  },

  // Save/unsave a tip
  async toggleSave(tipId: string, userId: string) {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from('tip_saves')
      .select('id')
      .eq('tip_id', tipId)
      .eq('user_id', userId)
      .single();

    if (existingSave) {
      // Unsave
      const { error } = await supabase
        .from('tip_saves')
        .delete()
        .eq('tip_id', tipId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return false; // unsaved
    } else {
      // Save
      const { error } = await supabase
        .from('tip_saves')
        .insert({ tip_id: tipId, user_id: userId });
      
      if (error) throw error;
      return true; // saved
    }
  },

  // Get user's liked tips
  async getUserLikedTips(userId: string) {
    const { data, error } = await supabase
      .from('tip_likes')
      .select(`
        tip:tips(
          *,
          user:users(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      ...item.tip,
      location: {
        latitude: Number(item.tip.latitude),
        longitude: Number(item.tip.longitude),
        city: item.tip.city,
        country: item.tip.country,
        address: item.tip.address,
      },
      is_liked: true,
    })) as Tip[] || [];
  },

  // Get user's saved tips
  async getUserSavedTips(userId: string) {
    const { data, error } = await supabase
      .from('tip_saves')
      .select(`
        tip:tips(
          *,
          user:users(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(item => ({
      ...item.tip,
      location: {
        latitude: Number(item.tip.latitude),
        longitude: Number(item.tip.longitude),
        city: item.tip.city,
        country: item.tip.country,
        address: item.tip.address,
      },
      is_saved: true,
    })) as Tip[] || [];
  },
};

// Comments API
export const commentsApi = {
  // Get comments for a tip
  async getTipComments(tipId: string) {
    const { data, error } = await supabase
      .from('tip_comments')
      .select(`
        *,
        user:users(*)
      `)
      .eq('tip_id', tipId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Comment[];
  },

  // Add a comment
  async addComment(tipId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('tip_comments')
      .insert({
        tip_id: tipId,
        user_id: userId,
        content,
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data as Comment;
  },

  // Update a comment
  async updateComment(commentId: string, content: string) {
    const { data, error } = await supabase
      .from('tip_comments')
      .update({ content })
      .eq('id', commentId)
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) throw error;
    return data as Comment;
  },

  // Delete a comment
  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('tip_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },
};

// User profiles API
export const profilesApi = {
  // Get user profile with stats
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*),
        stats:user_stats(*)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user profile with marketing info (for public viewing)
  async getUserProfileWithMarketing(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profile:user_profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...updates,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update user basic info
  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};