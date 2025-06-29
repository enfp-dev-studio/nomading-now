'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X, Target, Heart, Bookmark, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TIP_CATEGORIES, TRUST_LEVELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface RealMapProps {
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

export function RealMap({ tips, userLocation, onAddTip }: RealMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [showAddTipMode, setShowAddTipMode] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

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

        // Initialize map centered on Bangkok
        const map = L.map(mapRef.current!).setView([13.7563, 100.5018], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstanceRef.current = map;
        setIsMapReady(true);

        // Handle map clicks for adding tips
        map.on('click', (e: any) => {
          if (showAddTipMode && onAddTip) {
            onAddTip({ lat: e.latlng.lat, lng: e.latlng.lng });
            setShowAddTipMode(false);
          }
        });

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
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !userLocation) return;

    const updateUserMarker = async () => {
      const L = (await import('leaflet')).default;

      // Remove existing user marker
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }

      // Create custom user location icon
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative">
            <div class="${cn(
              'bg-blue-600 rounded-full border-2 border-white shadow-lg',
              showAddTipMode ? 'w-6 h-6 animate-pulse' : 'w-4 h-4'
            )}"></div>
            <div class="${cn(
              'absolute inset-0 bg-blue-600 rounded-full opacity-30 animate-ping',
              showAddTipMode ? 'w-6 h-6' : 'w-4 h-4'
            )}"></div>
            ${showAddTipMode ? `
              <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Your Location
              </div>
            ` : ''}
          </div>
        `,
        iconSize: showAddTipMode ? [24, 24] : [16, 16],
        iconAnchor: showAddTipMode ? [12, 12] : [8, 8]
      });

      // Add user marker
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);

      // Center map on user location when entering add tip mode
      if (showAddTipMode) {
        mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
      }
    };

    updateUserMarker();
  }, [userLocation, isMapReady, showAddTipMode]);

  // Update tip markers
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return;

    const updateTipMarkers = async () => {
      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Add tip markers
      tips.forEach((tip) => {
        const category = TIP_CATEGORIES.find(cat => cat.id === tip.category);
        
        const tipIcon = L.divIcon({
          className: 'custom-tip-marker',
          html: `
            <div class="${cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow-lg hover:scale-110 transition-transform cursor-pointer',
              category?.color || 'bg-sky-500',
              showAddTipMode && 'opacity-60'
            )}">
              ${category?.emoji || '📍'}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([parseFloat(tip.latitude), parseFloat(tip.longitude)], {
          icon: tipIcon
        }).addTo(mapInstanceRef.current);

        // Add click handler for tip selection
        marker.on('click', () => {
          if (!showAddTipMode) {
            setSelectedTip(tip);
          }
        });

        // Add tooltip
        if (!showAddTipMode) {
          marker.bindTooltip(tip.locationName, {
            direction: 'top',
            offset: [0, -10]
          });
        }

        markersRef.current.push(marker);
      });
    };

    updateTipMarkers();
  }, [tips, isMapReady, showAddTipMode]);

  const handleAddTipMode = () => {
    setShowAddTipMode(!showAddTipMode);
    setSelectedTip(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm font-medium text-gray-900">
            {tips.length} tips in this area
          </span>
        </div>
        
        <Button
          onClick={handleAddTipMode}
          className={cn(
            "flex items-center gap-2",
            showAddTipMode ? "bg-red-600 hover:bg-red-700" : "bg-sky-600 hover:bg-sky-700"
          )}
        >
          {showAddTipMode ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Tip
            </>
          )}
        </Button>
        
        {showAddTipMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 max-w-64">
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 mt-0.5 text-blue-600" />
              <div>
                <div className="font-medium mb-1">Add Tip Mode</div>
                <div>Your location is shown in blue. Click anywhere on the map to add a tip at that location.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        className={cn(
          "w-full h-full",
          showAddTipMode && "cursor-crosshair"
        )}
        style={{ minHeight: '400px' }}
      />

      {/* Selected Tip Detail Panel */}
      {selectedTip && !showAddTipMode && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000]">
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedTip.user?.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">{selectedTip.user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-gray-900 truncate">{selectedTip.user?.fullName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {TRUST_LEVELS[selectedTip.user?.trustLevel || 'newbie'].label}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{selectedTip.city}, {selectedTip.country}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(selectedTip.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedTip(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedTip.locationName}</h3>
                <p className="text-sm text-gray-700 line-clamp-2">{selectedTip.content}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Heart className="w-3 h-3" />
                    <span>{selectedTip.likesCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <MessageCircle className="w-3 h-3" />
                    <span>{selectedTip.commentsCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Bookmark className="w-3 h-3" />
                    <span>{selectedTip.savesCount}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="text-xs">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
        .custom-user-marker,
        .custom-tip-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          padding: 4px 8px !important;
        }
        
        .leaflet-tooltip-top:before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
      `}</style>
    </div>
  );
}