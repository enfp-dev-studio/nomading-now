import { useEffect, useState } from 'react';
import { MapPin, Plus, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { TipCard } from './TipCard';
import { CategoryFilter } from './CategoryFilter';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTipStore } from '@/store/useTipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { tipsApi, interactionsApi } from '@/lib/database';
import { Tip } from '@/types';
import { toast } from 'sonner';

const isDev = import.meta.env.DEV;

export function TipFeed() {
  const { 
    tips, 
    selectedCategory, 
    isLoading,
    setTips,
    setSelectedCategory,
    setLoading,
    updateTip
  } = useTipStore();
  
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const loadTips = async (showToast = false) => {
    console.log('🔄 TipFeed: Starting to load tips...');
    console.log('📊 Current state:', { 
      selectedCategory, 
      userId: user?.id, 
      isLoading,
      currentTipsCount: tips.length 
    });

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 TipFeed: Calling tipsApi...');
      
      // IMPORTANT: Pass user?.id (can be undefined for non-logged users)
      // The API should work for both logged and non-logged users
      const data = selectedCategory === 'all' 
        ? await tipsApi.getTips(user?.id) // This should work even if user?.id is undefined
        : await tipsApi.getTipsByCategory(selectedCategory, user?.id);
      
      console.log('✅ TipFeed: Received data from API:', data);
      console.log(`📈 TipFeed: Got ${data?.length || 0} tips`);
      
      // Set debug info for development
      setDebugInfo({
        apiCallTime: new Date().toISOString(),
        selectedCategory,
        userId: user?.id || 'Not logged in',
        userLoggedIn: !!user,
        dataReceived: data?.length || 0,
        firstTip: data?.[0] || null,
        rawData: data
      });
      
      setTips(data || []);
      setHasInitialLoad(true);
      
      if (!data || data.length === 0) {
        console.log('⚠️ TipFeed: No tips received from database');
        if (showToast) {
          toast.info('No tips found. The database might be empty.');
        }
      } else {
        console.log(`🎉 TipFeed: Successfully loaded ${data.length} tips`);
        if (showToast) {
          toast.success(`Loaded ${data.length} tips`);
        }
      }
      
    } catch (error) {
      console.error('💥 TipFeed: Error loading tips:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      if (showToast) {
        toast.error('Failed to load tips. Please try again.');
      }
      setTips([]);
    } finally {
      setLoading(false);
      console.log('🏁 TipFeed: Finished loading tips');
    }
  };

  // Initial load - should happen immediately when component mounts
  useEffect(() => {
    console.log('🔄 TipFeed: Initial load useEffect triggered');
    loadTips();
  }, []); // Empty dependency array for initial load

  // Category change load
  useEffect(() => {
    console.log('🔄 TipFeed: Category change useEffect triggered');
    console.log('📊 Dependencies changed:', { selectedCategory, userId: user?.id });
    if (hasInitialLoad) {
      loadTips();
    }
  }, [selectedCategory, user?.id]);

  const handleRefresh = async () => {
    console.log('🔄 TipFeed: Manual refresh triggered');
    setRefreshing(true);
    await loadTips(true);
    setRefreshing(false);
  };

  const handleLike = async (tipId: string) => {
    if (!user) {
      toast.error('Please sign in to like tips');
      return;
    }

    try {
      const isLiked = await interactionsApi.toggleLike(tipId, user.id);
      
      // Update the tip in the store
      const tip = tips.find(t => t.id === tipId);
      if (tip) {
        updateTip(tipId, {
          is_liked: isLiked,
          likes_count: tip.likes_count + (isLiked ? 1 : -1)
        });
      }

      toast.success(isLiked ? 'Tip liked! ❤️' : 'Tip unliked');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleSave = async (tipId: string) => {
    if (!user) {
      toast.error('Please sign in to save tips');
      return;
    }

    try {
      const isSaved = await interactionsApi.toggleSave(tipId, user.id);
      
      // Update the tip in the store
      const tip = tips.find(t => t.id === tipId);
      if (tip) {
        updateTip(tipId, {
          is_saved: isSaved,
          saves_count: tip.saves_count + (isSaved ? 1 : -1)
        });
      }

      toast.success(isSaved ? 'Tip saved! 📌' : 'Tip unsaved');
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to update save');
    }
  };

  const handleComment = (tipId: string) => {
    // TODO: Navigate to tip detail page or open comment modal
    console.log('Comment on tip:', tipId);
    toast.info('Comments feature coming soon! 💬');
  };

  const handleUserClick = (userId: string) => {
    // TODO: Navigate to user profile page
    console.log('View user profile:', userId);
    toast.info('User profiles feature coming soon! 👤');
  };

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  console.log('🎨 TipFeed: Rendering with state:', {
    isLoading,
    tipsCount: tips.length,
    filteredTipsCount: filteredTips.length,
    selectedCategory,
    error,
    hasInitialLoad,
    userLoggedIn: !!user
  });

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="bg-background">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="px-4 sm:px-6 py-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Failed to load tips</h3>
                  <p className="text-sm mt-1">{error}</p>
                  <Button 
                    onClick={handleRefresh}
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading && tips.length === 0) {
    return (
      <div className="bg-background">
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <div className="px-4 sm:px-6">
          <div className="space-y-4 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                </div>
                <div className="h-16 bg-muted rounded mb-3"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <div className="px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Debug info for development */}
          {isDev && debugInfo && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <div className="text-xs text-blue-800">
                  <div className="font-medium mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    🔍 Debug Info:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Last API call: {debugInfo.apiCallTime}</div>
                    <div>Category: {debugInfo.selectedCategory}</div>
                    <div>User: {debugInfo.userLoggedIn ? `${user?.nickname} (${user?.email})` : 'Not logged in'}</div>
                    <div>Tips received: {debugInfo.dataReceived}</div>
                    <div>Store tips count: {tips.length}</div>
                    <div>Filtered tips count: {filteredTips.length}</div>
                  </div>
                  {debugInfo.firstTip && (
                    <div className="mt-2">
                      <div className="font-medium">First tip sample:</div>
                      <div className="text-xs bg-white p-2 rounded mt-1 max-h-20 overflow-y-auto">
                        ID: {debugInfo.firstTip.id}<br/>
                        Content: {debugInfo.firstTip.content?.slice(0, 50)}...<br/>
                        User: {debugInfo.firstTip.user?.nickname}<br/>
                        Location: {debugInfo.firstTip.location?.city}, {debugInfo.firstTip.location?.country}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => console.log('Raw data:', debugInfo.rawData)}
                      className="text-xs h-6"
                    >
                      Log Raw Data
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleRefresh}
                      className="text-xs h-6"
                    >
                      Force Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refresh button */}
          {tips.length > 0 && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-xs gap-2"
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          )}

          {/* Empty state */}
          {filteredTips.length === 0 && !isLoading && hasInitialLoad ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <EmptyState
                icon={MapPin}
                title="No tips yet"
                description={
                  tips.length === 0 
                    ? "No tips found in the database. The database might be empty or there could be a connection issue."
                    : `No tips found in the "${selectedCategory}" category.`
                }
                action={
                  <div className="space-y-3">
                    {user && (
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Write a tip
                      </Button>
                    )}
                    {tips.length === 0 && (
                      <div className="text-center space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRefresh}
                          className="text-xs"
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Check for tips
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Visit <a href="/dev" className="text-primary hover:underline">/dev</a> to add sample data or check database connection
                        </div>
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          ) : (
            /* Tips list */
            <div className="grid gap-4 sm:gap-6">
              {filteredTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  onLike={() => handleLike(tip.id)}
                  onSave={() => handleSave(tip.id)}
                  onComment={() => handleComment(tip.id)}
                  onUserClick={() => handleUserClick(tip.user_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}