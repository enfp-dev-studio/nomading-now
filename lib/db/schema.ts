import { pgTable, text, uuid, integer, decimal, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  instagram: text('instagram'),
  twitter: text('twitter'),
  linkedin: text('linkedin'),
  points: integer('points').default(0).notNull(),
  trustLevel: text('trust_level').default('newbie').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tips table
export const tips = pgTable('tips', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  locationName: text('location_name').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  category: text('category').notNull(),
  photos: text('photos').array(),
  likesCount: integer('likes_count').default(0).notNull(),
  savesCount: integer('saves_count').default(0).notNull(),
  commentsCount: integer('comments_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tip likes table
export const tipLikes = pgTable('tip_likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tipId: uuid('tip_id').notNull().references(() => tips.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userTipUnique: unique().on(table.userId, table.tipId),
}));

// Tip saves table
export const tipSaves = pgTable('tip_saves', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tipId: uuid('tip_id').notNull().references(() => tips.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userTipUnique: unique().on(table.userId, table.tipId),
}));

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tipId: uuid('tip_id').notNull().references(() => tips.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tips: many(tips),
  likes: many(tipLikes),
  saves: many(tipSaves),
  comments: many(comments),
}));

export const tipsRelations = relations(tips, ({ one, many }) => ({
  user: one(users, {
    fields: [tips.userId],
    references: [users.id],
  }),
  likes: many(tipLikes),
  saves: many(tipSaves),
  comments: many(comments),
}));

export const tipLikesRelations = relations(tipLikes, ({ one }) => ({
  user: one(users, {
    fields: [tipLikes.userId],
    references: [users.id],
  }),
  tip: one(tips, {
    fields: [tipLikes.tipId],
    references: [tips.id],
  }),
}));

export const tipSavesRelations = relations(tipSaves, ({ one }) => ({
  user: one(users, {
    fields: [tipSaves.userId],
    references: [users.id],
  }),
  tip: one(tips, {
    fields: [tipSaves.tipId],
    references: [tips.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  tip: one(tips, {
    fields: [comments.tipId],
    references: [tips.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;
export type TipLike = typeof tipLikes.$inferSelect;
export type NewTipLike = typeof tipLikes.$inferInsert;
export type TipSave = typeof tipSaves.$inferSelect;
export type NewTipSave = typeof tipSaves.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;