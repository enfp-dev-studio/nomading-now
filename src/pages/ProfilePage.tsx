import { useState, useEffect } from 'react';
import { 
  Settings, 
  MapPin, 
  Heart, 
  MessageCircle,
  Bookmark,
  Edit,
  Plus,
  Trophy,
  LogOut,
  User as UserIcon,
  Globe,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TipCard } from '@/components/tips/TipCard';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';
import { profilesApi, tipsApi, interactionsApi } from '@/lib/database';
import { Tip } from '@/types';
import { toast } from 'sonner';

interface UserStats {
  tips_count: number;
  likes_received: number;
  comments_received: number;
  saves_received: number;
  cities_visited: number;
  countries_visited: number;
}

interface UserProfile {
  full_name?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  languages?: string[];
  interests?: string[];
  travel_style?: string;
  work_type?: string;
}

export function ProfilePage() {
  const { user, isLoading, signOut } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userTips, setUserTips] = useState<Tip[]>([]);
  const [likedTips, setLikedTips] = useState<Tip[]>([]);
  const [savedTips, setSavedTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load user profile and stats
      const profileData = await profilesApi.getUserProfile(user.id);
      setUserStats(profileData.stats || {
        tips_count: 0,
        likes_received: 0,
        comments_received: 0,
        saves_received: 0,
        cities_visited: 0,
        countries_visited: 0,
      });
      setUserProfile(profileData.profile || {});

      // Load user's tips
      const tips = await tipsApi.getUserTips(user.id);
      setUserTips(tips);

      // Load liked tips
      const liked = await interactionsApi.getUserLikedTips(user.id);
      setLikedTips(liked);

      // Load saved tips
      const saved = await interactionsApi.getUserSavedTips(user.id);
      setSavedTips(saved);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleTipInteraction = async (tipId: string, action: 'like' | 'save') => {
    if (!user) return;

    try {
      if (action === 'like') {
        await interactionsApi.toggleLike(tipId, user.id);
        // Refresh liked tips
        const liked = await interactionsApi.getUserLikedTips(user.id);
        setLikedTips(liked);
      } else if (action === 'save') {
        await interactionsApi.toggleSave(tipId, user.id);
        // Refresh saved tips
        const saved = await interactionsApi.getUserSavedTips(user.id);
        setSavedTips(saved);
      }
    } catch (error) {
      console.error(`Error ${action}ing tip:`, error);
      toast.error(`Failed to ${action} tip`);
    }
  };

  const getTrustBadge = (level: number) => {
    if (level >= 90) return { label: 'Master', color: 'bg-purple-100 text-purple-700' };
    if (level >= 70) return { label: 'Expert', color: 'bg-blue-100 text-blue-700' };
    if (level >= 50) return { label: 'Experienced', color: 'bg-green-100 text-green-700' };
    if (level >= 30) return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Newcomer', color: 'bg-gray-100 text-gray-700' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Profile</h1>
          </div>
        </header>

        {/* Not signed in state */}
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in to view your profile
              </h2>
              <p className="text-muted-foreground mb-6">
                Create an account or sign in to start sharing tips and building your nomad profile.
              </p>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full"
              >
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuthModal 
          open={showAuthModal} 
          onOpenChange={setShowAuthModal} 
        />
      </div>
    );
  }

  const trustBadge = getTrustBadge(user.trust_level);
  const stats = userStats || {
    tips_count: 0,
    likes_received: 0,
    comments_received: 0,
    saves_received: 0,
    cities_visited: 0,
    countries_visited: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Profile</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0">
                <AvatarImage src={user.avatar_url} alt={user.nickname} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  {user.nickname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {userProfile?.full_name || user.nickname}
                  </h2>
                  <Badge className={trustBadge.color}>
                    <Trophy className="w-3 h-3 mr-1" />
                    {trustBadge.label}
                  </Badge>
                </div>
                
                {user.bio && (
                  <p className="text-muted-foreground mb-3">{user.bio}</p>
                )}

                {userProfile?.location && (
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3" />
                    <span>{userProfile.location}</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {stats.countries_visited} countries, {stats.cities_visited} cities
                  </span>
                  <span>{user.points.toLocaleString()} points</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Social Links */}
                {(userProfile?.website || userProfile?.instagram || userProfile?.twitter || userProfile?.linkedin) && (
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                    {userProfile.website && (
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    {userProfile.instagram && (
                      <a href={`https://instagram.com/${userProfile.instagram}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {userProfile.twitter && (
                      <a href={`https://twitter.com/${userProfile.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {userProfile.linkedin && (
                      <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.tips_count}
              </div>
              <div className="text-sm text-muted-foreground">Tips written</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500 mb-1">
                {stats.likes_received}
              </div>
              <div className="text-sm text-muted-foreground">Likes received</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {stats.comments_received}
              </div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {stats.saves_received}
              </div>
              <div className="text-sm text-muted-foreground">Saves</div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Card for new users */}
        {stats.tips_count === 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to Nomad Tips! 🎉
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start sharing your travel experiences and discover amazing tips from fellow nomads.
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Write your first tip
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tabs */}
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="tips" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tips">My Tips ({stats.tips_count})</TabsTrigger>
                <TabsTrigger value="liked">Liked ({likedTips.length})</TabsTrigger>
                <TabsTrigger value="saved">Saved ({savedTips.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tips" className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading tips...</p>
                  </div>
                ) : userTips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No tips yet</p>
                    <p className="text-sm">Share your first travel tip to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTips.map((tip) => (
                      <TipCard
                        key={tip.id}
                        tip={tip}
                        onLike={() => handleTipInteraction(tip.id, 'like')}
                        onSave={() => handleTipInteraction(tip.id, 'save')}
                        onComment={() => console.log('Comment on tip:', tip.id)}
                        onUserClick={() => {}}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="liked" className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading liked tips...</p>
                  </div>
                ) : likedTips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No liked tips yet</p>
                    <p className="text-sm">Like tips you find helpful to save them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {likedTips.map((tip) => (
                      <TipCard
                        key={tip.id}
                        tip={tip}
                        onLike={() => handleTipInteraction(tip.id, 'like')}
                        onSave={() => handleTipInteraction(tip.id, 'save')}
                        onComment={() => console.log('Comment on tip:', tip.id)}
                        onUserClick={() => console.log('View user:', tip.user_id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="saved" className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading saved tips...</p>
                  </div>
                ) : savedTips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No saved tips yet</p>
                    <p className="text-sm">Save tips you want to reference later.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedTips.map((tip) => (
                      <TipCard
                        key={tip.id}
                        tip={tip}
                        onLike={() => handleTipInteraction(tip.id, 'like')}
                        onSave={() => handleTipInteraction(tip.id, 'save')}
                        onComment={() => console.log('Comment on tip:', tip.id)}
                        onUserClick={() => console.log('View user:', tip.user_id)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}