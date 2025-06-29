import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { TIP_CATEGORIES, Tip } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  MessageCircle,
  ExternalLink,
  Plus,
  Palette,
  Navigation,
} from 'lucide-react';
import { CreateTipModal } from '@/components/tips/CreateTipModal';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 방콕 기본 위치 (데모용)
const BANGKOK_LOCATION = {
  lat: 13.7563,
  lng: 100.5018,
  name: 'Bangkok, Thailand'
};

interface MapViewProps {
  tips: Tip[];
  center: LatLngExpression;
  zoom?: number;
  onTipClick?: (tip: Tip) => void;
  onTipCreated?: () => void;
}

// Map style options with better English support
const MAP_STYLES = {
  // CartoDB Voyager - Clean with some color (DEFAULT)
  voyager: {
    name: 'Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  // CartoDB Positron - Very clean, minimal style
  clean: {
    name: 'Clean',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  // Standard OpenStreetMap
  standard: {
    name: 'Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  // Stamen Toner Lite - Very minimal
  minimal: {
    name: 'Minimal',
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

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

// Create add tip icon
const createAddTipIcon = () => {
  const svgString = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
      <text x="20" y="26" text-anchor="middle" font-size="20" fill="white">+</text>
    </svg>
  `;

  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// Create user location icon - distinctive blue pulsing marker
const createUserLocationIcon = (isActualLocation: boolean = false) => {
  const color = isActualLocation ? '#3b82f6' : '#10b981'; // Blue for actual, green for demo
  const strokeColor = isActualLocation ? '#1d4ed8' : '#059669';
  
  const svgString = `
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="userGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${strokeColor};stop-opacity:1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Outer pulse ring -->
      <circle cx="25" cy="25" r="22" fill="${color}" opacity="0.3" stroke="${strokeColor}" stroke-width="1"/>
      <!-- Inner circle -->
      <circle cx="25" cy="25" r="15" fill="url(#userGradient)" stroke="#ffffff" stroke-width="3" filter="url(#glow)"/>
      <!-- Center dot -->
      <circle cx="25" cy="25" r="6" fill="#ffffff"/>
      <!-- Navigation icon -->
      <path d="M25 18 L28 25 L25 32 L22 25 Z" fill="${strokeColor}"/>
    </svg>
  `;

  const encodedSvg = btoa(unescape(encodeURIComponent(svgString)));

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${encodedSvg}`,
    iconSize: [50, 50],
    iconAnchor: [25, 25], // Center the icon
    popupAnchor: [0, -25],
    className: 'user-location-marker', // For CSS animations
  });
};

// Component to handle map events and updates
function MapController({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

// Component to handle map clicks for adding tips
function MapClickHandler({
  onLocationSelect,
  isEnabled,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  isEnabled: boolean;
}) {
  useMapEvents({
    click: (e) => {
      if (isEnabled) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export function MapView({
  tips,
  center,
  zoom = 15,
  onTipClick,
  onTipCreated,
}: MapViewProps) {
  const { user } = useAuthStore();
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [showCreateTipModal, setShowCreateTipModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addTipMode, setAddTipMode] = useState(false);
  const [tempMarker, setTempMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>('voyager');
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    isActual: boolean; // 실제 위치인지 데모 위치인지 구분
    name: string;
  } | null>(null);
  const [showUserLocation, setShowUserLocation] = useState(true); // 기본적으로 표시

  // 사용자 위치 가져오기 (실제 위치 또는 방콕 기본 위치)
  useEffect(() => {
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ 
              lat: latitude, 
              lng: longitude, 
              isActual: true,
              name: 'Your Location'
            });
            console.log('✅ 실제 사용자 위치 사용:', { latitude, longitude });
          },
          (error) => {
            console.log('⚠️ 위치 권한 거부 또는 오류, 방콕 기본 위치 사용:', error.message);
            // 위치 권한이 거부되거나 오류가 발생하면 방콕을 기본 위치로 사용
            setUserLocation({ 
              lat: BANGKOK_LOCATION.lat, 
              lng: BANGKOK_LOCATION.lng, 
              isActual: false,
              name: 'Bangkok (Demo Location)'
            });
            toast.info('위치 권한이 없어 방콕을 기본 위치로 사용합니다 📍');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000, // 5초 타임아웃
            maximumAge: 300000, // 5분간 캐시
          }
        );
      } else {
        console.log('⚠️ Geolocation 미지원, 방콕 기본 위치 사용');
        // Geolocation이 지원되지 않으면 방콕을 기본 위치로 사용
        setUserLocation({ 
          lat: BANGKOK_LOCATION.lat, 
          lng: BANGKOK_LOCATION.lng, 
          isActual: false,
          name: 'Bangkok (Demo Location)'
        });
        toast.info('위치 서비스가 지원되지 않아 방콕을 기본 위치로 사용합니다 📍');
      }
    };

    getUserLocation();
  }, []);

  const handleTipClick = (tip: Tip) => {
    setSelectedTip(tip);
    onTipClick?.(tip);
  };

  const openInGoogleMaps = (tip: Tip) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${tip.location.latitude},${tip.location.longitude}`;
    window.open(url, '_blank');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    if (!user) {
      toast.error('Please sign in to add tips');
      return;
    }

    setTempMarker({ lat, lng });
    setSelectedLocation({ latitude: lat, longitude: lng });
    setShowCreateTipModal(true);
    setAddTipMode(false);
  };

  const handleCreateTipModalClose = () => {
    setShowCreateTipModal(false);
    setSelectedLocation(null);
    setTempMarker(null);
    setAddTipMode(false);
  };

  const handleTipCreated = () => {
    setTempMarker(null);
    onTipCreated?.();
  };

  const toggleAddTipMode = () => {
    if (!user) {
      toast.error('Please sign in to add tips');
      return;
    }
    setAddTipMode(!addTipMode);
    setTempMarker(null);
  };

  // 내 위치로 이동 (실제 위치 또는 방콕)
  const goToMyLocation = () => {
    if (userLocation) {
      // 지도 중심을 사용자 위치로 이동하는 로직은 부모 컴포넌트에서 처리
      const message = userLocation.isActual 
        ? '실제 위치로 이동했습니다 📍' 
        : '방콕 데모 위치로 이동했습니다 📍';
      toast.success(message);
    } else {
      toast.error('위치 정보를 가져올 수 없습니다');
    }
  };

  const currentStyle = MAP_STYLES[mapStyle];

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-y-2">
        {user && (
          <div className="">
            <Button
              onClick={toggleAddTipMode}
              className={`shadow-lg ${
                addTipMode
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary hover:bg-primary/90'
              }`}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUserLocation(!showUserLocation)}
            className={`shadow-lg bg-white ${
              showUserLocation ? 'border-blue-500 text-blue-600' : ''
            }`}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
        {/* Map Style Selector */}
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="shadow-lg bg-white"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Map Style</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(MAP_STYLES).map(([key, style]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setMapStyle(key as keyof typeof MAP_STYLES)}
                  className={mapStyle === key ? 'bg-accent' : ''}
                >
                  {style.name}
                  {key === 'voyager' && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (Default)
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full z-0"
        zoomControl={true}
        attributionControl={true}
        preferCanvas={true}
      >
        <MapController center={center} zoom={zoom} />
        <MapClickHandler
          onLocationSelect={handleLocationSelect}
          isEnabled={addTipMode}
        />

        <TileLayer
          attribution={currentStyle.attribution}
          url={currentStyle.url}
          maxZoom={19}
          subdomains={['a', 'b', 'c']}
          detectRetina={true}
        />

        {/* User's location marker (actual or demo) */}
        {showUserLocation && userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon(userLocation.isActual)}
            zIndexOffset={1000} // Make sure it appears on top
          >
            <Popup className="custom-popup" minWidth={200}>
              <div className="p-2 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Navigation className={`w-4 h-4 ${userLocation.isActual ? 'text-blue-600' : 'text-green-600'}`} />
                  <span className={`font-medium ${userLocation.isActual ? 'text-blue-700' : 'text-green-700'}`}>
                    {userLocation.name}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {userLocation.isActual 
                    ? 'GPS 기반 실제 위치' 
                    : '데모용 기본 위치 (방콕)'
                  }
                </div>
                <div className="text-xs text-gray-500">
                  {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                </div>
                {!userLocation.isActual && (
                  <div className="text-xs text-green-600 mt-2 bg-green-50 p-1 rounded">
                    💡 위치 권한을 허용하면 실제 위치를 사용할 수 있습니다
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Existing tips */}
        {tips.map((tip) => {
          const category = TIP_CATEGORIES.find(
            (cat) => cat.id === tip.category
          );
          const icon = category
            ? createCategoryIcon(tip.category, category.emoji)
            : undefined;

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
                      <AvatarImage
                        src={tip.user?.avatar_url}
                        alt={tip.user?.nickname}
                      />
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
                          <Badge
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {category.emoji} {category.label}
                          </Badge>
                        )}
                        {tip.user?.trust_level && tip.user.trust_level > 50 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0"
                          >
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

        {/* Temporary marker for new tip location */}
        {tempMarker && (
          <Marker
            position={[tempMarker.lat, tempMarker.lng]}
            icon={createAddTipIcon()}
          >
            <Popup>
              <div className="p-2 text-center">
                <div className="text-sm font-medium text-green-700 mb-2">
                  New Tip Location
                </div>
                <div className="text-xs text-gray-600">
                  Creating tip at this location...
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Create Tip Modal */}
      <CreateTipModal
        open={showCreateTipModal}
        onOpenChange={setShowCreateTipModal}
        location={selectedLocation}
        onTipCreated={handleTipCreated}
      />
    </div>
  );
}