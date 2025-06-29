import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Bookmark, MapPin, Calendar, Award, ExternalLink, User, Info } from 'lucide-react';
import { useState } from 'react';
import { Tip, TIP_CATEGORIES } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { UserMarketingModal } from '@/components/profile/UserMarketingModal';
import { profilesApi } from '@/lib/database';
import { UserProfile } from '@/types';
import { cn } from '@/lib/utils';

interface TipCardProps {
  tip: Tip;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onUserClick?: () => void;
}

export function TipCard({ tip, onLike, onSave, onComment, onUserClick }: TipCardProps) {
  const [showUserModal, setShowUserModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const category = TIP_CATEGORIES.find(cat => cat.id === tip.category);
  const timeAgo = formatDistanceToNow(new Date(tip.created_at), { 
    addSuffix: true
  });

  const getTrustBadge = (level: number) => {
    if (level >= 90) return { label: 'Master', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👑' };
    if (level >= 70) return { label: 'Expert', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '⭐' };
    if (level >= 50) return { label: 'Experienced', color: 'bg-green-100 text-green-700 border-green-200', icon: '✨' };
    if (level >= 30) return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🌱' };
    return { label: 'Newcomer', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '👋' };
  };

  const trustBadge = getTrustBadge(tip.user?.trust_level || 0);
  const joinDate = tip.user?.created_at ? new Date(tip.user.created_at) : null;

  const handleUserClick = async () => {
    if (!tip.user) return;
    
    try {
      setLoadingProfile(true);
      const profileData = await profilesApi.getUserProfileWithMarketing(tip.user.id);
      setUserProfile(profileData.profile);
      setShowUserModal(true);
      onUserClick?.();
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-4 sm:p-6">
          {/* Enhanced Header with User Profile */}
          <div className="flex items-start gap-3 mb-4">
            {/* User Avatar with Hover Card */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar 
                    className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 ring-2 ring-primary/10 hover:ring-primary/30 transition-all" 
                    onClick={handleUserClick}
                  >
                    <AvatarImage src={tip.user?.avatar_url} alt={tip.user?.nickname} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {tip.user?.nickname?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80" side="top">
                <div className="space-y-3">
                  {/* Profile Header */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={tip.user?.avatar_url} alt={tip.user?.nickname} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {tip.user?.nickname?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{tip.user?.nickname}</h4>
                      <p className="text-sm text-muted-foreground">{tip.user?.email}</p>
                    </div>
                  </div>

                  {/* Bio */}
                  {tip.user?.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.user.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-semibold text-lg text-foreground">{tip.user?.points || 0}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-foreground">{tip.user?.trust_level || 0}</div>
                      <div className="text-xs text-muted-foreground">Trust Level</div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="flex justify-center">
                    <Badge className={cn("text-xs px-3 py-1", trustBadge.color)}>
                      <span className="mr-1">{trustBadge.icon}</span>
                      {trustBadge.label}
                    </Badge>
                  </div>

                  {/* Join Date */}
                  {joinDate && (
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {joinDate.toLocaleDateString()}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleUserClick}
                    disabled={loadingProfile}
                  >
                    {loadingProfile ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Info className="w-3 h-3 mr-2" />
                    )}
                    View Profile
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            {/* User Info and Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* User Name and Trust Badge */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 
                      className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors truncate"
                      onClick={handleUserClick}
                    >
                      {tip.user?.nickname}
                    </h4>
                    {tip.user?.trust_level && tip.user.trust_level > 0 && (
                      <Badge className={cn("text-xs px-2 py-0.5 whitespace-nowrap", trustBadge.color)}>
                        <span className="mr-1">{trustBadge.icon}</span>
                        {trustBadge.label}
                      </Badge>
                    )}
                  </div>

                  {/* Location and Time */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{tip.location.city}, {tip.location.country}</span>
                    </div>
                    <span>•</span>
                    <span className="whitespace-nowrap">{timeAgo}</span>
                  </div>

                  {/* User Stats Preview */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{tip.user?.points || 0} points</span>
                    </div>
                    {tip.user?.trust_level && tip.user.trust_level > 30 && (
                      <div className="flex items-center gap-1">
                        <span>Trust Level {tip.user.trust_level}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                {category && (
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
                    category.color
                  )}>
                    <span>{category.emoji}</span>
                    <span className="hidden sm:inline">{category.label}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <p className="text-foreground leading-relaxed text-sm sm:text-base">
              {tip.content}
            </p>
          </div>

          {/* Images */}
          {tip.images && tip.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {tip.images.slice(0, 4).map((image, index) => (
                <div 
                  key={index}
                  className={cn(
                    "aspect-square bg-muted rounded-lg overflow-hidden",
                    tip.images!.length === 1 && "col-span-2 aspect-video"
                  )}
                >
                  <img 
                    src={image} 
                    alt={`Tip image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Enhanced Actions Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-2 h-auto text-xs sm:text-sm hover:bg-red-50",
                  tip.is_liked && "text-red-500 hover:text-red-600"
                )}
                onClick={onLike}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 mr-1",
                    tip.is_liked && "fill-current"
                  )} 
                />
                <span>{tip.likes_count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-muted-foreground text-xs sm:text-sm hover:bg-blue-50 hover:text-blue-600"
                onClick={onComment}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{tip.comments_count}</span>
              </Button>

              {/* View on Map Button */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-muted-foreground text-xs sm:text-sm hover:bg-green-50 hover:text-green-600"
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${tip.location.latitude},${tip.location.longitude}`;
                  window.open(url, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Map</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Button */}
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "p-2 h-auto hover:bg-primary/10",
                  tip.is_saved && "text-primary hover:text-primary"
                )}
                onClick={onSave}
              >
                <Bookmark 
                  className={cn(
                    "w-4 h-4",
                    tip.is_saved && "fill-current"
                  )} 
                />
              </Button>

              {/* User Profile Quick Access */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto text-muted-foreground hover:bg-primary/10 hover:text-primary"
                onClick={handleUserClick}
                disabled={loadingProfile}
              >
                {loadingProfile ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Marketing Modal */}
      {tip.user && (
        <UserMarketingModal
          open={showUserModal}
          onOpenChange={setShowUserModal}
          user={tip.user}
          userProfile={userProfile}
        />
      )}
    </>
  );
}