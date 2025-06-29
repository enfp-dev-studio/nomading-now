import { withDatabase } from '@/lib/db/connection';
import { tips, users, tipLikes, tipSaves, comments } from '@/lib/db/schema';
import { eq, desc, and, sql, count, or, ilike } from 'drizzle-orm';
import type { NewTip } from '@/lib/db/schema';

export class TipsService {
  static async createTip(tipData: NewTip) {
    return withDatabase(async (db) => {
      try {
        const newTip = await db
          .insert(tips)
          .values(tipData)
          .returning();

        return newTip[0];
      } catch (error) {
        console.error('Error creating tip:', error);
        throw new Error('Failed to create tip');
      }
    });
  }

  static async getTips(options: {
    limit?: number;
    offset?: number;
    city?: string;
    category?: string;
    userId?: string;
    search?: string;
  } = {}) {
    return withDatabase(async (db) => {
      try {
        const { limit = 20, offset = 0, city, category, userId, search } = options;

      let query = db
        .select({
          tip: tips,
          user: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
            trustLevel: users.trustLevel,
          },
          isLiked: sql<boolean>`CASE WHEN ${tipLikes.id} IS NOT NULL THEN true ELSE false END`,
          isSaved: sql<boolean>`CASE WHEN ${tipSaves.id} IS NOT NULL THEN true ELSE false END`,
        })
        .from(tips)
        .leftJoin(users, eq(tips.userId, users.id))
        .leftJoin(
          tipLikes,
          and(
            eq(tipLikes.tipId, tips.id),
            userId ? eq(tipLikes.userId, userId) : sql`false`
          )
        )
        .leftJoin(
          tipSaves,
          and(
            eq(tipSaves.tipId, tips.id),
            userId ? eq(tipSaves.userId, userId) : sql`false`
          )
        )
        .orderBy(desc(tips.createdAt))
        .limit(limit)
        .offset(offset);

      // Build where conditions
      const whereConditions = [];
      
      if (city) {
        whereConditions.push(eq(tips.city, city));
      }

      if (category) {
        whereConditions.push(eq(tips.category, category));
      }

      if (search) {
        whereConditions.push(
          or(
            ilike(tips.content, `%${search}%`),
            ilike(tips.locationName, `%${search}%`),
            ilike(tips.city, `%${search}%`)
          )
        );
      }

      // Apply where conditions if any
      if (whereConditions.length > 0) {
        query = query.where(
          whereConditions.length === 1 
            ? whereConditions[0] 
            : and(...whereConditions)
        ) as any;
      }

      return await query;
    } catch (error) {
      console.error('Error fetching tips:', error);
      return [];
    }
  }

  static async getTipById(tipId: string, userId?: string) {
    try {
      const result = await db
        .select({
          tip: tips,
          user: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
            trustLevel: users.trustLevel,
          },
          isLiked: sql<boolean>`CASE WHEN ${tipLikes.id} IS NOT NULL THEN true ELSE false END`,
          isSaved: sql<boolean>`CASE WHEN ${tipSaves.id} IS NOT NULL THEN true ELSE false END`,
        })
        .from(tips)
        .leftJoin(users, eq(tips.userId, users.id))
        .leftJoin(
          tipLikes,
          and(
            eq(tipLikes.tipId, tips.id),
            userId ? eq(tipLikes.userId, userId) : sql`false`
          )
        )
        .leftJoin(
          tipSaves,
          and(
            eq(tipSaves.tipId, tips.id),
            userId ? eq(tipSaves.userId, userId) : sql`false`
          )
        )
        .where(eq(tips.id, tipId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching tip by ID:', error);
      return null;
    }
  }

  static async likeTip(tipId: string, userId: string) {
    try {
      // Check if already liked
      const existingLike = await db
        .select()
        .from(tipLikes)
        .where(and(eq(tipLikes.tipId, tipId), eq(tipLikes.userId, userId)))
        .limit(1);

      if (existingLike.length > 0) {
        // Unlike
        await db
          .delete(tipLikes)
          .where(and(eq(tipLikes.tipId, tipId), eq(tipLikes.userId, userId)));

        // Decrease likes count
        await db
          .update(tips)
          .set({ 
            likesCount: sql`${tips.likesCount} - 1`,
            updatedAt: new Date()
          })
          .where(eq(tips.id, tipId));

        return { liked: false };
      } else {
        // Like
        await db
          .insert(tipLikes)
          .values({ tipId, userId });

        // Increase likes count
        await db
          .update(tips)
          .set({ 
            likesCount: sql`${tips.likesCount} + 1`,
            updatedAt: new Date()
          })
          .where(eq(tips.id, tipId));

        return { liked: true };
      }
    } catch (error) {
      console.error('Error liking tip:', error);
      throw new Error('Failed to like tip');
    }
  }

  static async saveTip(tipId: string, userId: string) {
    try {
      // Check if already saved
      const existingSave = await db
        .select()
        .from(tipSaves)
        .where(and(eq(tipSaves.tipId, tipId), eq(tipSaves.userId, userId)))
        .limit(1);

      if (existingSave.length > 0) {
        // Unsave
        await db
          .delete(tipSaves)
          .where(and(eq(tipSaves.tipId, tipId), eq(tipSaves.userId, userId)));

        // Decrease saves count
        await db
          .update(tips)
          .set({ 
            savesCount: sql`${tips.savesCount} - 1`,
            updatedAt: new Date()
          })
          .where(eq(tips.id, tipId));

        return { saved: false };
      } else {
        // Save
        await db
          .insert(tipSaves)
          .values({ tipId, userId });

        // Increase saves count
        await db
          .update(tips)
          .set({ 
            savesCount: sql`${tips.savesCount} + 1`,
            updatedAt: new Date()
          })
          .where(eq(tips.id, tipId));

        return { saved: true };
      }
    } catch (error) {
      console.error('Error saving tip:', error);
      throw new Error('Failed to save tip');
    }
  }

  static async getUserTips(userId: string, limit = 20, offset = 0) {
    try {
      return await db
        .select({
          tip: tips,
          user: {
            id: users.id,
            username: users.username,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
            trustLevel: users.trustLevel,
          },
        })
        .from(tips)
        .leftJoin(users, eq(tips.userId, users.id))
        .where(eq(tips.userId, userId))
        .orderBy(desc(tips.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Error fetching user tips:', error);
      return [];
    }
  }

  static async getTipStats(userId: string) {
    try {
      const stats = await db
        .select({
          totalTips: count(tips.id),
          totalLikes: sql<number>`COALESCE(SUM(${tips.likesCount}), 0)`,
          totalSaves: sql<number>`COALESCE(SUM(${tips.savesCount}), 0)`,
          totalComments: sql<number>`COALESCE(SUM(${tips.commentsCount}), 0)`,
        })
        .from(tips)
        .where(eq(tips.userId, userId));

      return stats[0];
    } catch (error) {
      console.error('Error fetching tip stats:', error);
      return {
        totalTips: 0,
        totalLikes: 0,
        totalSaves: 0,
        totalComments: 0,
      };
    }
  }

  static async deleteTip(tipId: string, userId: string) {
    try {
      const result = await db
        .delete(tips)
        .where(and(eq(tips.id, tipId), eq(tips.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error deleting tip:', error);
      throw new Error('Failed to delete tip');
    }
  }

  static async updateTip(tipId: string, userId: string, updates: Partial<NewTip>) {
    try {
      const result = await db
        .update(tips)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(tips.id, tipId), eq(tips.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating tip:', error);
      throw new Error('Failed to update tip');
    }
  }
}