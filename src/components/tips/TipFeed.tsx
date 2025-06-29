import { useEffect, useState } from 'react';
import { MapPin, Plus, RefreshCw } from 'lucide-react';
import { TipCard } from './TipCard';
import { CategoryFilter } from './CategoryFilter';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useTipStore } from '@/store/useTipStore';
import { useAuthStore } from '@/store/useAuthStore';
import { tipsApi, interactionsApi } from '@/lib/database';
import { Tip } from '@/types';
import { toast } from 'sonner';

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

  const loadTips = async () => {
    try {
      setLoading(true);
      const data = selectedCategory === 'all' 
        ? await tipsApi.getTips(user?.id)
        : await tipsApi.getTipsByCategory(selectedCategory, user?.id);
      setTips(data);
    } catch (error) {
      console.error('Error loading tips:', error);
      toast.error('Failed to load tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTips();
  }, [selectedCategory, user?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTips();
    setRefreshing(false);
    toast.success('Tips refreshed!');
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
    // TODO: Navigate to user profile
    console.log('View user profile:', userId);
    toast.info('User profiles feature coming soon! 👤');
  };

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

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
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
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

          {filteredTips.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <EmptyState
                icon={MapPin}
                title="No tips yet"
                description="Be the first to share a tip in this category!"
                action={
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Write a tip
                  </Button>
                }
              />
            </div>
          ) : (
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