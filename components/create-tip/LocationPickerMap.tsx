'use client';

import dynamic from 'next/dynamic';

// Dynamically import the real map component to avoid SSR issues
const RealLocationPickerMap = dynamic(() => import('./RealLocationPickerMap').then(mod => ({ default: mod.RealLocationPickerMap })), {
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

interface LocationPickerMapProps {
  currentLocation: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  maxRadius: number; // in meters
}

export function LocationPickerMap({ currentLocation, onLocationSelect, maxRadius }: LocationPickerMapProps) {
  return (
    <RealLocationPickerMap 
      currentLocation={currentLocation}
      onLocationSelect={onLocationSelect}
      maxRadius={maxRadius}
    />
  );
}