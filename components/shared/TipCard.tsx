'use client';

import { useState } from 'react';
import { Heart, Bookmark, MessageCircle, MapPin, ExternalLink, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TRUST_LEVELS, TIP_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { TipsService } from '@/lib/services/tips';

interface TipCardProps {
  tip: {
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
    isLiked?: boolean;
    isSaved?: boolean;
  };
}

export function TipCard({ tip }: TipCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(tip.isLiked || false);
  const [isSaved, setIsSaved] = useState(tip.isSaved || false);
  const [likesCount, setLikesCount] = useState(tip.likesCount);
  const [savesCount, setSavesCount] = useState(tip.savesCount);
  const [isLoading, setIsLoading] = useState(false);

  const category = TIP_CATEGORIES.find(cat => cat.id === tip.category);
  const trustLevel = TRUST_LEVELS[tip.user?.trustLevel as keyof typeof TRUST_LEVELS] || TRUST_LEVELS.newbie;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like tips');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await TipsService.likeTip(tip.id, user.id);
      
      setIsLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
      
      toast.success(result.liked ? 'Tip liked!' : 'Like removed');
    } catch (error) {
      toast.error('Failed to update like');
      console.error('Error liking tip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save tips');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await TipsService.saveTip(tip.id, user.id);
      
      setIsSaved(result.saved);
      setSavesCount(prev => result.saved ? prev + 1 : prev - 1);
      
      toast.success(result.saved ? 'Tip saved!' : 'Removed from saved');
    } catch (error) {
      toast.error('Failed to update save');
      console.error('Error saving tip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tip.locationName} - ${tip.city}`,
          text: tip.content,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${tip.latitude},${tip.longitude}`;
    window.open(url, '_blank');
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
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={tip.user?.avatarUrl || undefined} alt={tip.user?.fullName} />
                <AvatarFallback>{tip.user?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{tip.user?.fullName}</span>
                  <Badge variant="secondary" className={cn("text-xs", trustLevel.color)}>
                    {trustLevel.label}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{tip.city}, {tip.country}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(tip.createdAt)}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Location and Category */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900">{tip.locationName}</h3>
            {category && (
              <Badge className={cn("text-white", category.color)}>
                <span className="mr-1">{category.emoji}</span>
                {category.label}
              </Badge>
            )}
          </div>
        </div>

        {/* Photo */}
        {tip.photos && tip.photos.length > 0 && (
          <div className="relative h-64 overflow-hidden">
            <img
              src={tip.photos[0]}
              alt={tip.locationName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 pt-3">
          <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">{tip.content}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center space-x-1 text-gray-600 hover:text-red-600",
                  isLiked && "text-red-600"
                )}
                onClick={handleLike}
                disabled={isLoading}
              >
                <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{tip.commentsCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center space-x-1 text-gray-600 hover:text-yellow-600",
                  isSaved && "text-yellow-600"
                )}
                onClick={handleSave}
                disabled={isLoading}
              >
                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                <span>{savesCount}</span>
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={openInMaps}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View in Maps</span>
              <span className="sm:hidden">Maps</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}