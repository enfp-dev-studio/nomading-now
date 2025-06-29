import { useState, useEffect } from 'react';
import { Search, Navigation, Filter, MapPin, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { MapView } from '@/components/map/MapView';
import { useTipStore } from '@/store/useTipStore';
import { Tip } from '@/types';

// Mock tips data for the map
const mockMapTips: Tip[] = [
  {
    id: '1',
    user_id: 'user1',
    content: 'This cafe has super fast WiFi and plenty of power outlets! Perfect spot for nomad work 👍',
    category: 'cafe',
    location: {
      latitude: 13.7563,
      longitude: 100.5018,
      city: 'Bangkok',
      country: 'Thailand',
      address: 'Siam Square'
    },
    likes_count: 24,
    comments_count: 5,
    saves_count: 12,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: {
      id: 'user1',
      email: 'user1@example.com',
      nickname: 'BangkokNomad',
      bio: 'Full-stack developer | Digital nomad',
      avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      points: 150,
      trust_level: 75,
      created_at: '2024-01-01T00:00:00Z'
    },
    images: ['https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800'],
    is_liked: false,
    is_saved: false
  },
  {
    id: '2',
    user_id: 'user2',
    content: 'Hidden gem restaurant! Local pad thai spot that only locals know about. Cheap and huge portions 🍜',
    category: 'food',
    location: {
      latitude: 13.7465,
      longitude: 100.5351,
      city: 'Bangkok',
      country: 'Thailand'
    },
    likes_count: 18,
    comments_count: 3,
    saves_count: 8,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    user: {
      id: 'user2',
      email: 'user2@example.com',
      nickname: 'BangkokFoodie',
      bio: 'UX Designer | Food explorer',
      points: 89,
      trust_level: 60,
      created_at: '2024-01-01T00:00:00Z'
    },
    images: ['https://images.pexels.com/photos/1600727/pexels-photo-1600727.jpeg?auto=compress&cs=tinysrgb&w=800'],
    is_liked: true,
    is_saved: false
  },
  {
    id: '3',
    user_id: 'user3',
    content: 'Great park for morning runs! Lots of locals exercise here and it\'s very safe. Recommend 6-7am 🏃‍♂️',
    category: 'exercise',
    location: {
      latitude: 13.7367,
      longitude: 100.5480,
      city: 'Bangkok',
      country: 'Thailand'
    },
    likes_count: 31,
    comments_count: 7,
    saves_count: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    user: {
      id: 'user3',
      email: 'user3@example.com',
      nickname: 'BangkokRunner',
      bio: 'Marketer | Fitness enthusiast',
      points: 220,
      trust_level: 85,
      created_at: '2024-01-01T00:00:00Z'
    },
    images: ['https://images.pexels.com/photos/3654772/pexels-photo-3654772.jpeg?auto=compress&cs=tinysrgb&w=800'],
    is_liked: false,
    is_saved: true
  },
  {
    id: '4',
    user_id: 'user4',
    content: 'Coworking space recommendation! 24/7 operation with meeting rooms. Great value monthly pass 💻',
    category: 'workspace',
    location: {
      latitude: 13.7308,
      longitude: 100.5418,
      city: 'Bangkok',
      country: 'Thailand'
    },
    likes_count: 42,
    comments_count: 12,
    saves_count: 28,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user: {
      id: 'user4',
      email: 'user4@example.com',
      nickname: 'DigitalWorker',
      bio: 'Freelance developer',
      points: 320,
      trust_level: 90,
      created_at: '2024-01-01T00:00:00Z'
    },
    images: ['https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'],
    is_liked: false,
    is_saved: false
  },
  {
    id: '5',
    user_id: 'user5',
    content: 'Clean and affordable accommodation! Great location and friendly staff. Long-term discounts available 🏠',
    category: 'accommodation',
    location: {
      latitude: 13.7650,
      longitude: 100.5380,
      city: 'Bangkok',
      country: 'Thailand'
    },
    likes_count: 35,
    comments_count: 8,
    saves_count: 22,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    user: {
      id: 'user5',
      email: 'user5@example.com',
      nickname: 'AccommodationHunter',
      bio: 'Travel blogger',
      points: 180,
      trust_level: 70,
      created_at: '2024-01-01T00:00:00Z'
    },
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800'],
    is_liked: true,
    is_saved: true
  }
];

export function MapPage() {
  const [hasLocation, setHasLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([13.7563, 100.5018]); // Default to Bangkok
  const [searchQuery, setSearchQuery] = useState('');
  const { currentLocation: storeLocation, setCurrentLocation: setStoreLocation } = useTipStore();

  const requestLocation = async () => {
    setIsLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            setStoreLocation({ latitude, longitude });
            setHasLocation(true);
            setIsLoading(false);
          },
          (error) => {
            // Silently handle geolocation errors and use fallback location
            setHasLocation(true);
            setIsLoading(false);
          }
        );
      } else {
        // Geolocation not supported, use default location
        setHasLocation(true);
        setIsLoading(false);
      }
    } catch (error) {
      // Silently handle any other errors and use fallback location
      setHasLocation(true);
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
    if (query.toLowerCase().includes('bangkok')) {
      setCurrentLocation([13.7563, 100.5018]);
      setHasLocation(true);
    }
  };

  const handleTipClick = (tip: Tip) => {
    console.log('Tip clicked:', tip);
    // TODO: Show tip details or navigate to tip detail page
  };

  const recenterMap = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          // Silently handle geolocation errors
        }
      );
    }
  };

  if (!hasLocation) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <header className="bg-card border-b border-border p-4 sm:p-6 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Map</h1>
          <p className="text-sm text-muted-foreground mb-4">Discover nomad tips around you</p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by location (e.g., Bangkok, Chiang Mai)"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <EmptyState
            icon={Navigation}
            title="Location permission needed"
            description="Allow location access to see nomad tips around your current location."
            action={
              <Button 
                onClick={requestLocation}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isLoading ? 'Getting location...' : 'Use current location'}
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header - not sticky, but at top */}
      <header className="bg-card border-b border-border p-4 sm:p-6 flex-shrink-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Map</h1>
            <p className="text-sm text-muted-foreground">Bangkok · {mockMapTips.length} tips</p>
          </div>
          <div className="flex gap-2">
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
            placeholder="Search places or addresses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Map Container - takes remaining height */}
      <div className="flex-1 relative">
        <MapView
          tips={mockMapTips}
          center={currentLocation}
          zoom={14}
          onTipClick={handleTipClick}
        />
      </div>
    </div>
  );
}