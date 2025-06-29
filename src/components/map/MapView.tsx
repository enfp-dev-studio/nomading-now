import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { TIP_CATEGORIES, Tip } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  tips: Tip[];
  center: LatLngExpression;
  zoom?: number;
  onTipClick?: (tip: Tip) => void;
}

// Custom marker icons for different categories
const createCategoryIcon = (category: string, emoji: string) => {
  const svgString = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#ffc0cb" stroke="#ffffff" stroke-width="3"/>
      <text x="20" y="26" text-anchor="middle" font-size="16" fill="black">${emoji}</text>
    </svg>
  `;
  
  // Properly encode Unicode characters for btoa
  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Component to handle map events and updates
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

export function MapView({ tips, center, zoom = 13, onTipClick }: MapViewProps) {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const handleTipClick = (tip: Tip) => {
    setSelectedTip(tip);
    onTipClick?.(tip);
  };

  const openInGoogleMaps = (tip: Tip) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${tip.location.latitude},${tip.location.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapController center={center} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {tips.map((tip) => {
          const category = TIP_CATEGORIES.find(cat => cat.id === tip.category);
          const icon = category ? createCategoryIcon(tip.category, category.emoji) : undefined;
          
          return (
            <Marker
              key={tip.id}
              position={[tip.location.latitude, tip.location.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => handleTipClick(tip),
              }}
            >
              <Popup className="custom-popup" minWidth={280} maxWidth={320}>
                <div className="p-2">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={tip.user?.avatar_url} alt={tip.user?.nickname} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {tip.user?.nickname?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {tip.user?.nickname}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        {category && (
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {category.emoji} {category.label}
                          </Badge>
                        )}
                        {tip.user?.trust_level && tip.user.trust_level > 50 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            Trust {tip.user.trust_level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-900 mb-3 leading-relaxed line-clamp-3">
                    {tip.content}
                  </p>

                  {/* Image */}
                  {tip.images && tip.images.length > 0 && (
                    <div className="mb-3">
                      <img 
                        src={tip.images[0]} 
                        alt="Tip image"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {tip.likes_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {tip.comments_count}
                      </span>
                    </div>
                    <span className="truncate">{tip.location.city}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs h-8"
                      onClick={() => openInGoogleMaps(tip)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View on map
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}