import { 
  ExternalLink, 
  Briefcase,
  Globe,
  Users,
  ShoppingBag,
  Coffee,
  Link as LinkIcon,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserProfile } from '@/types';

interface UserMarketingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  userProfile: UserProfile | null;
}

const getLinkTypeIcon = (type: string) => {
  const icons = {
    website: Globe,
    portfolio: Briefcase,
    social: Users,
    shop: ShoppingBag,
    donation: Coffee,
    other: LinkIcon,
  };
  return icons[type as keyof typeof icons] || LinkIcon;
};

const getTrustBadge = (level: number) => {
  if (level >= 90) return { label: 'Master', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '👑' };
  if (level >= 70) return { label: 'Expert', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '⭐' };
  if (level >= 50) return { label: 'Experienced', color: 'bg-green-100 text-green-700 border-green-200', icon: '✨' };
  if (level >= 30) return { label: 'Beginner', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🌱' };
  return { label: 'Newcomer', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '👋' };
};

export function UserMarketingModal({ open, onOpenChange, user, userProfile }: UserMarketingModalProps) {
  const trustBadge = getTrustBadge(user.trust_level);

  // Don't show if no marketing content
  if (!userProfile?.show_marketing || (!userProfile?.marketing_bio && (!userProfile?.marketing_links || userProfile.marketing_links.length === 0))) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar_url} alt={user.nickname} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.nickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{user.nickname}</span>
                <Badge className={`text-xs px-2 py-0.5 ${trustBadge.color}`}>
                  <span className="mr-1">{trustBadge.icon}</span>
                  {trustBadge.label}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {user.points.toLocaleString()} points • Trust Level {user.trust_level}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Bio */}
          {user.bio && (
            <div>
              <h4 className="font-medium text-sm mb-2">Bio</h4>
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            </div>
          )}

          {/* Marketing Bio */}
          {userProfile?.marketing_bio && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                About Me
              </h4>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {userProfile.marketing_bio.split('\n').map((line, index) => {
                    // Simple markdown parsing for bold, italic, and links
                    let processedLine = line
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
                    
                    return (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: processedLine }}
                        className="mb-1"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Marketing Links */}
          {userProfile?.marketing_links && userProfile.marketing_links.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3">Links</h4>
              <div className="space-y-2">
                {userProfile.marketing_links.map((link) => {
                  const IconComponent = getLinkTypeIcon(link.type);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted transition-colors group"
                    >
                      <IconComponent className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate flex-1">
                        {link.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Additional Profile Info */}
          {userProfile && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {userProfile.location && (
                  <div>
                    <span className="font-medium">Location</span>
                    <p className="text-muted-foreground">{userProfile.location}</p>
                  </div>
                )}
                {userProfile.work_type && (
                  <div>
                    <span className="font-medium">Work</span>
                    <p className="text-muted-foreground">{userProfile.work_type}</p>
                  </div>
                )}
                {userProfile.travel_style && (
                  <div>
                    <span className="font-medium">Travel Style</span>
                    <p className="text-muted-foreground">{userProfile.travel_style}</p>
                  </div>
                )}
                {userProfile.languages && userProfile.languages.length > 0 && (
                  <div>
                    <span className="font-medium">Languages</span>
                    <p className="text-muted-foreground">{userProfile.languages.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}