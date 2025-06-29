'use client';

import { useState, useEffect } from 'react';
import { ExploreFilters } from './ExploreFilters';
import { ExploreMap } from './ExploreMap';
import { TipsList } from './TipsList';
import { TipsService } from '@/lib/services/tips';
import { useAuth } from '@/hooks/useAuth';
import { TipCategory } from '@/lib/types';

export function ExploreContent() {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<TipCategory | ''>('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'nearby'>('popular');
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoading(true);
        const result = await TipsService.getTips({
          city: selectedCity || undefined,
          category: selectedCategory || undefined,
          userId: user?.id,
        });

        // Transform the data to match the expected format
        const transformedTips = result.map(item => ({
          id: item.tip.id,
          content: item.tip.content,
          locationName: item.tip.locationName,
          latitude: item.tip.latitude,
          longitude: item.tip.longitude,
          city: item.tip.city,
          country: item.tip.country,
          category: item.tip.category,
          photos: item.tip.photos,
          likesCount: item.tip.likesCount,
          savesCount: item.tip.savesCount,
          commentsCount: item.tip.commentsCount,
          createdAt: item.tip.createdAt,
          user: item.user,
          isLiked: item.isLiked,
          isSaved: item.isSaved,
        }));

        setTips(transformedTips);
      } catch (error) {
        console.error('Error fetching tips:', error);
        setTips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [selectedCity, selectedCategory, user?.id]);

  const sortedTips = [...tips].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return (b.likesCount + b.savesCount) - (a.likesCount + a.savesCount);
      case 'nearby':
        // In a real app, this would sort by distance from user's location
        return 0;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Nomad Tips</h1>
            <p className="text-gray-600">Discover amazing places shared by fellow nomads</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-gray-600">Loading tips...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Nomad Tips</h1>
          <p className="text-gray-600">Discover amazing places shared by fellow nomads</p>
        </div>

        <ExploreFilters
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          showMap={showMap}
          onCityChange={setSelectedCity}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
          onShowMapChange={setShowMap}
        />

        <div className="mt-6">
          {showMap ? (
            <div className="h-[calc(100vh-200px)]">
              <ExploreMap 
                tips={sortedTips} 
                userLocation={userLocation}
                onAddTip={(location) => {
                  // Handle adding new tip at location
                  console.log('Add tip at:', location);
                }}
              />
            </div>
          ) : (
            <TipsList tips={sortedTips} />
          )}
        </div>
      </div>
    </div>
  );
}