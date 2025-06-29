'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RealLocationPickerMapProps {
  currentLocation: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  maxRadius: number; // in meters
}

export function RealLocationPickerMap({ currentLocation, onLocationSelect, maxRadius }: RealLocationPickerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const selectedMarkerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Calculate distance between two points in meters
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        // Check if the container already has a Leaflet map instance
        if (mapRef.current && (mapRef.current as any)._leaflet_id) {
          console.warn('Map container is already initialized, skipping initialization');
          return;
        }

        // Dynamic import to avoid SSR issues
        const L = (await import('leaflet')).default;
        
        // Fix for default markers in webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map centered on current location
        const map = L.map(mapRef.current!).setView([currentLocation.lat, currentLocation.lng], 16);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add current location marker
        const currentIcon = L.divIcon({
          className: 'custom-current-marker',
          html: `
            <div class="relative">
              <div class="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
              <div class="absolute inset-0 w-6 h-6 bg-blue-600 rounded-full opacity-30 animate-ping"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        currentMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], {
          icon: currentIcon,
          zIndexOffset: 1000
        }).addTo(map);

        // Add radius circle
        radiusCircleRef.current = L.circle([currentLocation.lat, currentLocation.lng], {
          radius: maxRadius,
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          color: '#3b82f6',
          weight: 2,
          opacity: 0.5
        }).addTo(map);

        // Handle map clicks
        map.on('click', (e: any) => {
          const clickedLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
          const distance = calculateDistance(
            currentLocation.lat, 
            currentLocation.lng,
            clickedLocation.lat, 
            clickedLocation.lng
          );

          if (distance <= maxRadius) {
            setSelectedLocation(clickedLocation);
            
            // Remove existing selected marker
            if (selectedMarkerRef.current) {
              map.removeLayer(selectedMarkerRef.current);
            }

            // Add new selected marker
            const selectedIcon = L.divIcon({
              className: 'custom-selected-marker',
              html: `
                <div class="relative">
                  <div class="w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <div class="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            selectedMarkerRef.current = L.marker([clickedLocation.lat, clickedLocation.lng], {
              icon: selectedIcon,
              zIndexOffset: 999
            }).addTo(map);
          }
        });

        setIsMapReady(true);

      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [currentLocation, maxRadius]);

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleUseCurrentLocation = () => {
    onLocationSelect(currentLocation);
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="relative w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full cursor-crosshair"
        style={{ minHeight: '400px' }}
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-sm">Select Location</span>
            </div>
            <div className="text-xs text-gray-500">
              Max: {formatDistance(maxRadius)} radius
            </div>
          </div>
          
          {selectedLocation ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-700">
                <div className="font-medium">Selected Location:</div>
                <div className="font-mono text-xs text-gray-500">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </div>
                <div className="text-xs text-green-600">
                  ✓ {formatDistance(calculateDistance(
                    currentLocation.lat, 
                    currentLocation.lng,
                    selectedLocation.lat, 
                    selectedLocation.lng
                  ))} from your current location
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleConfirmLocation}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  size="sm"
                >
                  Use This Location
                </Button>
                <Button 
                  onClick={() => setSelectedLocation(null)}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                Click anywhere within the blue circle to select a location
              </div>
              <Button 
                onClick={handleUseCurrentLocation}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Your current location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Selected location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-blue-600 opacity-50"></div>
              <span>Allowed area</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[999]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading map...</div>
          </div>
        </div>
      )}

      {/* Custom styles for markers */}
      <style jsx global>{`
        .custom-current-marker,
        .custom-selected-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}