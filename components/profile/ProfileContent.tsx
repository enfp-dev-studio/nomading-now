'use client';

import { useState, useEffect } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileTips } from './ProfileTips';
import { ProfileLinks } from './ProfileLinks';
import { TipsService } from '@/lib/services/tips';
import { useAuth } from '@/hooks/useAuth';

export function ProfileContent() {
  const { user, userProfile } = useAuth();
  const [userTips, setUserTips] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !userProfile) return;

      try {
        setLoading(true);
        
        // Fetch user tips
        const tipsResult = await TipsService.getUserTips(user.id);
        const transformedTips = tipsResult.map(item => ({
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
        }));
        setUserTips(transformedTips);

        // Fetch user stats
        const statsResult = await TipsService.getTipStats(user.id);
        setStats(statsResult);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, userProfile]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-gray-600">Loading profile data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader user={userProfile} />
            <ProfileStats user={userProfile} stats={stats} tipsCount={userTips.length} />
            <ProfileTips tips={userTips} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileLinks user={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}