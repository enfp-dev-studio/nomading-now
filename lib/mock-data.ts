import type { User } from '@/lib/db/schema';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    username: 'sarahwanders',
    fullName: 'Sarah Chen',
    avatarUrl: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    bio: 'Full-stack developer & coffee enthusiast ☕ Building remote-first products',
    location: 'Bangkok, Thailand',
    website: 'https://sarahchen.dev',
    instagram: 'sarahwanders',
    twitter: 'sarahwanders',
    linkedin: null,
    points: 1250,
    trustLevel: 'guru',
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z')
  },
  {
    id: '2',
    email: 'alex@example.com',
    username: 'alexnomad',
    fullName: 'Alex Rodriguez',
    avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2',
    bio: 'UX Designer exploring the world one city at a time 🌍',
    location: 'Lisbon, Portugal',
    website: 'https://alexrodriguez.design',
    instagram: null,
    twitter: null,
    linkedin: 'alexrodriguez',
    points: 650,
    trustLevel: 'expert',
    createdAt: new Date('2024-02-20T00:00:00Z'),
    updatedAt: new Date('2024-02-20T00:00:00Z')
  }
];

// Mock tips data for fallback when database is empty
export const mockTips = [
  {
    id: '1',
    userId: '1',
    content: 'Amazing co-working space with super fast WiFi (500+ Mbps) and the best matcha latte in the city! Great for focus work, open 24/7. Has phone booths for calls and quiet zones.',
    locationName: 'Hubud Co-working Space',
    latitude: '13.7563',
    longitude: '100.5018',
    city: 'Bangkok',
    country: 'Thailand',
    category: 'coworking',
    photos: ['https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=800'],
    likesCount: 42,
    savesCount: 28,
    commentsCount: 8,
    createdAt: new Date('2024-03-10T14:30:00Z'),
    updatedAt: new Date('2024-03-10T14:30:00Z')
  },
  {
    id: '2',
    userId: '2',
    content: 'Hidden gem! Best pad thai I\'ve ever had and super cheap (60 THB). The owner speaks English and always remembers regular customers. Cash only, no tourists - just locals!',
    locationName: 'Som Tam Nua',
    latitude: '13.7400',
    longitude: '100.5300',
    city: 'Bangkok',
    country: 'Thailand',
    category: 'food',
    photos: ['https://images.pexels.com/photos/4394716/pexels-photo-4394716.jpeg?auto=compress&cs=tinysrgb&w=800'],
    likesCount: 67,
    savesCount: 45,
    commentsCount: 12,
    createdAt: new Date('2024-03-09T11:15:00Z'),
    updatedAt: new Date('2024-03-09T11:15:00Z')
  }
];