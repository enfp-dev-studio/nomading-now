import { useState, useEffect } from 'react';
import { Search, Navigation, Filter, MapPin, Crosshair, LogIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { AuthModal } from '@/components/auth/AuthModal';
import { MapView } from '@/components/map/MapView';
import { useTipStore } from '@/store/useTipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { tipsApi } from '@/lib/database';
import { Tip } from '@/types';
import { toast } from 'sonner';

// 방콕 기본 위치 (데모용)
const BANGKOK_LOCATION = {
  lat: 13.7563,
  lng: 100.5018,
  name: 'Bangkok, Thailand'
};

export function MapPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    isActual: boolean;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mapTips, setMapTips] = useState<Tip[]>([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const { currentLocation: storeLocation, setCurrentLocation: setStoreLocation } = useTipStore();

  // Load tips from database
  const loadTips = async () => {
    try {
      setLoadingTips(true);
      console.log('Loading tips from database...');
      
      const tips = await tipsApi.getTips(user?.id);
      console.log('Loaded tips:', tips);
      
      setMapTips(tips);
      
      if (tips.length === 0) {
        toast.info('No tips found in the database yet. Create some tips to see them on the map!');
      } else {
        console.log(`Loaded ${tips.length} tips for the map`);
      }
    } catch (error) {
      console.error('Error loading tips:', error);
      toast.error('Failed to load tips from database');
      setMapTips([]);
    } finally {
      setLoadingTips(false);
    }
  };

  // Load tips when component mounts or user changes
  useEffect(() => {
    loadTips();
  }, [user?.id]);

  // 사용자 위치 가져오기 (실제 위치 또는 방콕 기본 위치)
  useEffect(() => {
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = {
              lat: latitude,
              lng: longitude,
              isActual: true,
              name: 'Your Location'
            };
            setUserLocation(location);
            setCurrentLocation([latitude, longitude]);
            setStoreLocation({ latitude, longitude });
            console.log('✅ 실제 사용자 위치 사용:', { latitude, longitude });
          },
          (error) => {
            console.log('⚠️ 위치 권한 거부 또는 오류, 방콕 기본 위치 사용:', error.message);
            // 위치 권한이 거부되거나 오류가 발생하면 방콕을 기본 위치로 사용
            const location = {
              lat: BANGKOK_LOCATION.lat,
              lng: BANGKOK_LOCATION.lng,
              isActual: false,
              name: 'Bangkok (Demo Location)'
            };
            setUserLocation(location);
            setCurrentLocation([BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]);
            setStoreLocation({ latitude: BANGKOK_LOCATION.lat, longitude: BANGKOK_LOCATION.lng });
            
            // 사용자에게 알림 (한 번만)
            if (!sessionStorage.getItem('location-demo-notified')) {
              toast.info('위치 권한이 없어 방콕을 기본 위치로 사용합니다 📍', {
                duration: 4000,
              });
              sessionStorage.setItem('location-demo-notified', 'true');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 300000,
          }
        );
      } else {
        console.log('⚠️ Geolocation 미지원, 방콕 기본 위치 사용');
        const location = {
          lat: BANGKOK_LOCATION.lat,
          lng: BANGKOK_LOCATION.lng,
          isActual: false,
          name: 'Bangkok (Demo Location)'
        };
        setUserLocation(location);
        setCurrentLocation([BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]);
        setStoreLocation({ latitude: BANGKOK_LOCATION.lat, longitude: BANGKOK_LOCATION.lng });
        
        if (!sessionStorage.getItem('location-demo-notified')) {
          toast.info('위치 서비스가 지원되지 않아 방콕을 기본 위치로 사용합니다 📍', {
            duration: 4000,
          });
          sessionStorage.setItem('location-demo-notified', 'true');
        }
      }
    };

    getUserLocation();
  }, [setStoreLocation]);

  const requestLocation = async () => {
    setIsLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = {
              lat: latitude,
              lng: longitude,
              isActual: true,
              name: 'Your Location'
            };
            setUserLocation(location);
            setCurrentLocation([latitude, longitude]);
            setStoreLocation({ latitude, longitude });
            setIsLoading(false);
            toast.success('실제 위치로 업데이트되었습니다 📍');
          },
          (error) => {
            console.log('위치 권한 거부:', error.message);
            setIsLoading(false);
            toast.info('위치 권한이 거부되어 방콕 기본 위치를 계속 사용합니다 📍');
          }
        );
      } else {
        setIsLoading(false);
        toast.info('위치 서비스가 지원되지 않아 방콕을 기본 위치로 사용합니다 📍');
      }
    } catch (error) {
      setIsLoading(false);
      toast.info('위치를 가져올 수 없어 방콕을 기본 위치로 사용합니다 📍');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Simple search implementation for major cities
    const searchLower = query.toLowerCase();
    
    if (searchLower.includes('bangkok') || searchLower.includes('방콕')) {
      setCurrentLocation([13.7563, 100.5018]);
      toast.success('Moved to Bangkok');
    } else if (searchLower.includes('chiang mai') || searchLower.includes('치앙마이')) {
      setCurrentLocation([18.7883, 98.9853]);
      toast.success('Moved to Chiang Mai');
    } else if (searchLower.includes('phuket') || searchLower.includes('푸켓')) {
      setCurrentLocation([7.8804, 98.3923]);
      toast.success('Moved to Phuket');
    } else if (searchLower.includes('seoul') || searchLower.includes('서울')) {
      setCurrentLocation([37.5665, 126.9780]);
      toast.success('Moved to Seoul');
    } else if (searchLower.includes('tokyo') || searchLower.includes('도쿄')) {
      setCurrentLocation([35.6762, 139.6503]);
      toast.success('Moved to Tokyo');
    } else if (searchLower.includes('singapore') || searchLower.includes('싱가포르')) {
      setCurrentLocation([1.3521, 103.8198]);
      toast.success('Moved to Singapore');
    } else if (searchLower.includes('kuala lumpur') || searchLower.includes('쿠알라룸푸르')) {
      setCurrentLocation([3.1390, 101.6869]);
      toast.success('Moved to Kuala Lumpur');
    } else if (searchLower.includes('ho chi minh') || searchLower.includes('saigon') || searchLower.includes('호치민')) {
      setCurrentLocation([10.8231, 106.6297]);
      toast.success('Moved to Ho Chi Minh City');
    } else if (searchLower.includes('hanoi') || searchLower.includes('하노이')) {
      setCurrentLocation([21.0285, 105.8542]);
      toast.success('Moved to Hanoi');
    } else if (searchLower.includes('manila') || searchLower.includes('마닐라')) {
      setCurrentLocation([14.5995, 120.9842]);
      toast.success('Moved to Manila');
    } else if (searchLower.includes('jakarta') || searchLower.includes('자카르타')) {
      setCurrentLocation([-6.2088, 106.8456]);
      toast.success('Moved to Jakarta');
    } else if (query.trim()) {
      toast.info(`Search for "${query}" - try Bangkok, Chiang Mai, Seoul, Tokyo, etc.`);
    }
  };

  const handleTipClick = (tip: Tip) => {
    console.log('Tip clicked:', tip);
  };

  const recenterMap = () => {
    if (userLocation) {
      setCurrentLocation([userLocation.lat, userLocation.lng]);
      const message = userLocation.isActual 
        ? '실제 위치로 중심을 맞췄습니다 📍' 
        : '방콕 데모 위치로 중심을 맞췄습니다 📍';
      toast.success(message);
    } else {
      // Fallback to Bangkok
      setCurrentLocation([BANGKOK_LOCATION.lat, BANGKOK_LOCATION.lng]);
      toast.info('방콕으로 중심을 맞췄습니다 📍');
    }
  };

  const handleTipCreated = async () => {
    await loadTips();
    toast.success('Map updated with your new tip!');
  };

  const handleRefreshTips = async () => {
    await loadTips();
    toast.success('Tips refreshed!');
  };

  const getCurrentLocationName = () => {
    const [lat, lng] = currentLocation;
    
    if (userLocation) {
      // Check if current location matches user location
      if (Math.abs(lat - userLocation.lat) < 0.01 && Math.abs(lng - userLocation.lng) < 0.01) {
        return userLocation.name;
      }
    }
    
    // Check if it's close to known cities
    if (Math.abs(lat - 13.7563) < 0.1 && Math.abs(lng - 100.5018) < 0.1) return 'Bangkok';
    if (Math.abs(lat - 18.7883) < 0.1 && Math.abs(lng - 98.9853) < 0.1) return 'Chiang Mai';
    if (Math.abs(lat - 7.8804) < 0.1 && Math.abs(lng - 98.3923) < 0.1) return 'Phuket';
    if (Math.abs(lat - 37.5665) < 0.1 && Math.abs(lng - 126.9780) < 0.1) return 'Seoul';
    if (Math.abs(lat - 35.6762) < 0.1 && Math.abs(lng - 139.6503) < 0.1) return 'Tokyo';
    if (Math.abs(lat - 1.3521) < 0.1 && Math.abs(lng - 103.8198) < 0.1) return 'Singapore';
    
    return 'Current Location';
  };

  return (
    <>
      <div className="h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sm:p-6 flex-shrink-0 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Map</h1>
              <p className="text-sm text-muted-foreground">
                {loadingTips ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                    Loading tips...
                  </span>
                ) : (
                  <>
                    {getCurrentLocationName()} · {mapTips.length} tips
                    {user && (
                      <span className="ml-2 text-primary">• Click map to add tips</span>
                    )}
                    {userLocation && !userLocation.isActual && (
                      <span className="ml-2 text-green-600">• Demo location (Bangkok)</span>
                    )}
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              {!user && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAuthModal(true)}
                  className="flex-shrink-0"
                >
                  <LogIn className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Sign In to Add Tips</span>
                  <span className="sm:hidden">Sign In</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshTips}
                disabled={loadingTips}
                className="flex-shrink-0"
              >
                <RefreshCw className={`w-4 h-4 sm:mr-1 ${loadingTips ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestLocation}
                disabled={isLoading}
                className="flex-shrink-0"
              >
                <Navigation className={`w-4 h-4 sm:mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {userLocation?.isActual ? 'Update Location' : 'Get Real Location'}
                </span>
                <span className="sm:hidden">Location</span>
              </Button>
              <Button variant="outline" size="sm" onClick={recenterMap} className="flex-shrink-0">
                <Crosshair className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Recenter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Filter className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search cities (Bangkok, Chiang Mai, Seoul, Tokyo, Singapore...)"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>
        </header>

        {/* Map Container */}
        <div className="flex-1 relative">
          {loadingTips ? (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-[1000]">
              <div className="bg-card p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">Loading tips from database...</span>
                </div>
              </div>
            </div>
          ) : (
            <MapView
              tips={mapTips}
              center={currentLocation}
              zoom={15}
              onTipClick={handleTipClick}
              onTipCreated={handleTipCreated}
            />
          )}
        </div>

        {/* Debug info for development */}
        {import.meta.env.DEV && (
          <div className="absolute bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-[1000]">
            <div>Tips loaded: {mapTips.length}</div>
            <div>User: {user ? user.nickname : 'Not signed in'}</div>
            <div>Loading: {loadingTips ? 'Yes' : 'No'}</div>
            <div>Location: {getCurrentLocationName()}</div>
            <div>Coords: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}</div>
            <div>User Location: {userLocation ? (userLocation.isActual ? 'Real GPS' : 'Demo (Bangkok)') : 'None'}</div>
          </div>
        )}
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </>
  );
}