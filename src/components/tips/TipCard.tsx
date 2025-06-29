import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Bookmark, MapPin } from 'lucide-react';
import { Tip, TIP_CATEGORIES } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TipCardProps {
  tip: Tip;
  onLike?: () => void;
  onSave?: () => void;
  onComment?: () => void;
  onUserClick?: () => void;
}

export function TipCard({ tip, onLike, onSave, onComment, onUserClick }: TipCardProps) {
  const category = TIP_CATEGORIES.find(cat => cat.id === tip.category);
  const timeAgo = formatDistanceToNow(new Date(tip.created_at), { 
    addSuffix: true
  });

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar 
            className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer flex-shrink-0" 
            onClick={onUserClick}
          >
            <AvatarImage src={tip.user?.avatar_url} alt={tip.user?.nickname} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {tip.user?.nickname?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 
                className="font-semibold text-foreground cursor-pointer hover:text-primary truncate"
                onClick={onUserClick}
              >
                {tip.user?.nickname}
              </h4>
              {tip.user?.trust_level && tip.user.trust_level > 50 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                  Trust {tip.user.trust_level}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{tip.location.city}</span>
              <span>•</span>
              <span className="whitespace-nowrap">{timeAgo}</span>
            </div>
          </div>

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

        {/* Content */}
        <p className="text-foreground mb-3 leading-relaxed text-sm sm:text-base">
          {tip.content}
        </p>

        {/* Images */}
        {tip.images && tip.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-3">
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

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "p-2 h-auto text-xs sm:text-sm",
                tip.is_liked && "text-red-500"
              )}
              onClick={onLike}
            >
              <Heart 
                className={cn(
                  "w-4 h-4 mr-1",
                  tip.is_liked && "fill-current"
                )} 
              />
              <span className="hidden sm:inline">{tip.likes_count}</span>
              <span className="sm:hidden">{tip.likes_count}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto text-muted-foreground text-xs sm:text-sm"
              onClick={onComment}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{tip.comments_count}</span>
              <span className="sm:hidden">{tip.comments_count}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-2 h-auto",
              tip.is_saved && "text-primary"
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
        </div>
      </CardContent>
    </Card>
  );
}