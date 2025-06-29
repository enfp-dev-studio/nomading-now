'use client';

import dynamic from 'next/dynamic';

// Dynamically import the real map component to avoid SSR issues
const RealMap = dynamic(() => import('./RealMap').then(mod => ({ default: mod.RealMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg border border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
        <div className="text-sm text-gray-600">Loading map...</div>
      </div>
    </div>
  )
});

interface ExploreMapProps {
  tips: Array<{
    id: string;
    content: string;
    locationName: string;
    latitude: string;
    longitude: string;
    city: string;
    country: string;
    category: string;
    photos?: string[] | null;
    likesCount: number;
    savesCount: number;
    commentsCount: number;
    createdAt: Date;
    user?: {
      id: string;
      username: string;
      fullName: string;
      avatarUrl?: string | null;
      trustLevel: string;
    } | null;
  }>;
  userLocation?: { lat: number; lng: number } | null;
  onAddTip?: (location: { lat: number; lng: number }) => void;
}

export function ExploreMap({ tips, userLocation, onAddTip }: ExploreMapProps) {
  return (
    <RealMap 
      tips={tips} 
      userLocation={userLocation} 
      onAddTip={onAddTip} 
    />
  );
}