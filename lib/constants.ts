import { MapPin, Coffee, Wifi, Home, Car, Music, ShoppingBag, Heart, Trees, Camera } from 'lucide-react';

export const TIP_CATEGORIES = [
  { id: 'food', label: 'Food & Restaurants', icon: MapPin, color: 'bg-red-500', emoji: '🍽️' },
  { id: 'cafe', label: 'Cafes & Coffee', icon: Coffee, color: 'bg-amber-500', emoji: '☕' },
  { id: 'coworking', label: 'Work Spaces', icon: Wifi, color: 'bg-blue-500', emoji: '💻' },
  { id: 'accommodation', label: 'Stay', icon: Home, color: 'bg-green-500', emoji: '🏠' },
  { id: 'transport', label: 'Transport', icon: Car, color: 'bg-purple-500', emoji: '🚌' },
  { id: 'entertainment', label: 'Entertainment', icon: Music, color: 'bg-pink-500', emoji: '🎭' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-indigo-500', emoji: '🛍️' },
  { id: 'health', label: 'Health & Fitness', icon: Heart, color: 'bg-rose-500', emoji: '💪' },
  { id: 'nature', label: 'Nature & Parks', icon: Trees, color: 'bg-emerald-500', emoji: '🌳' },
  { id: 'culture', label: 'Culture & Arts', icon: Camera, color: 'bg-violet-500', emoji: '🎨' },
] as const;

export const FEATURED_CITIES = [
  {
    name: 'Bangkok',
    country: 'Thailand',
    image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 1247,
    description: 'The ultimate nomad hub with amazing food, fast internet, and affordable living'
  },
  {
    name: 'Chiang Mai',
    country: 'Thailand',
    image: 'https://images.pexels.com/photos/2598142/pexels-photo-2598142.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 892,
    description: 'Peaceful mountain city with thriving digital nomad community'
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    image: 'https://images.pexels.com/photos/2157404/pexels-photo-2157404.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 634,
    description: 'Charming European city with great weather and co-working spaces'
  },
  {
    name: 'Mexico City',
    country: 'Mexico',
    image: 'https://images.pexels.com/photos/3566135/pexels-photo-3566135.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 521,
    description: 'Vibrant culture, delicious food, and growing tech scene'
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.pexels.com/photos/2474692/pexels-photo-2474692.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 789,
    description: 'Tropical paradise with beautiful beaches and nomad-friendly areas'
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=800',
    tips_count: 445,
    description: 'High-tech metropolis with incredible food and unique culture'
  }
];

export const TRUST_LEVELS = {
  newbie: { label: 'Newbie', color: 'text-gray-600', min_points: 0 },
  traveler: { label: 'Traveler', color: 'text-blue-600', min_points: 100 },
  expert: { label: 'Expert', color: 'text-purple-600', min_points: 500 },
  guru: { label: 'Guru', color: 'text-orange-600', min_points: 1000 },
};