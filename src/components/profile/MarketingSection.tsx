import { useState } from 'react';
import { 
  ExternalLink, 
  Edit, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Globe,
  Briefcase,
  Users,
  ShoppingBag,
  Coffee,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MarketingLink, UserProfile } from '@/types';
import { profilesApi } from '@/lib/database';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MarketingSectionProps {
  userProfile: UserProfile | null;
  isOwner: boolean;
  onProfileUpdate?: (profile: UserProfile) => void;
}

const LINK_TYPES = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { value: 'social', label: 'Social Media', icon: Users },
  { value: 'shop', label: 'Shop/Store', icon: ShoppingBag },
  { value: 'donation', label: 'Buy Me Coffee', icon: Coffee },
  { value: 'other', label: 'Other', icon: LinkIcon },
];

const getLinkTypeIcon = (type: string) => {
  const linkType = LINK_TYPES.find(t => t.value === type);
  return linkType ? linkType.icon : LinkIcon;
};

const getLinkTypeColor = (type: string) => {
  const colors = {
    website: 'bg-blue-100 text-blue-700 border-blue-200',
    portfolio: 'bg-purple-100 text-purple-700 border-purple-200',
    social: 'bg-pink-100 text-pink-700 border-pink-200',
    shop: 'bg-green-100 text-green-700 border-green-200',
    donation: 'bg-orange-100 text-orange-700 border-orange-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[type as keyof typeof colors] || colors.other;
};

export function MarketingSection({ userProfile, isOwner, onProfileUpdate }: MarketingSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [marketingBio, setMarketingBio] = useState(userProfile?.marketing_bio || '');
  const [marketingLinks, setMarketingLinks] = useState<MarketingLink[]>(
    userProfile?.marketing_links || []
  );
  const [showMarketing, setShowMarketing] = useState(userProfile?.show_marketing || false);

  const addLink = () => {
    const newLink: MarketingLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      type: 'website',
    };
    setMarketingLinks([...marketingLinks, newLink]);
  };

  const updateLink = (id: string, field: keyof MarketingLink, value: string) => {
    setMarketingLinks(links =>
      links.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const removeLink = (id: string) => {
    setMarketingLinks(links => links.filter(link => link.id !== id));
  };

  const handleSave = async () => {
    if (!userProfile?.user_id) return;

    setIsSaving(true);
    try {
      // Filter out empty links
      const validLinks = marketingLinks.filter(link => 
        link.title.trim() && link.url.trim()
      );

      const updates = {
        marketing_bio: marketingBio.trim() || null,
        marketing_links: validLinks,
        show_marketing: showMarketing,
      };

      const updatedProfile = await profilesApi.updateUserProfile(userProfile.user_id, updates);
      
      if (onProfileUpdate) {
        onProfileUpdate({ ...userProfile, ...updates });
      }

      setIsEditing(false);
      toast.success('Marketing profile updated successfully!');
    } catch (error) {
      console.error('Error updating marketing profile:', error);
      toast.error('Failed to update marketing profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setMarketingBio(userProfile?.marketing_bio || '');
    setMarketingLinks(userProfile?.marketing_links || []);
    setShowMarketing(userProfile?.show_marketing || false);
    setIsEditing(false);
  };

  // Don't show section if user hasn't enabled marketing and it's not the owner
  if (!isOwner && !userProfile?.show_marketing) {
    return null;
  }

  // Don't show if no content and not owner
  if (!isOwner && !userProfile?.marketing_bio && (!userProfile?.marketing_links || userProfile.marketing_links.length === 0)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            About Me
          </CardTitle>
          {isOwner && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <Label htmlFor="show-marketing" className="font-medium">
                  Show on public profile
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to see your marketing information
                </p>
              </div>
              <Switch
                id="show-marketing"
                checked={showMarketing}
                onCheckedChange={setShowMarketing}
              />
            </div>

            {/* Bio Editor */}
            <div className="space-y-2">
              <Label htmlFor="marketing-bio">About Me (Markdown supported)</Label>
              <Textarea
                id="marketing-bio"
                placeholder="Tell others about yourself, your work, or what you offer... 

You can use **bold**, *italic*, and [links](https://example.com)

Examples:
- 🚀 Full-stack developer specializing in React & Node.js
- 📸 Travel photographer capturing nomad life
- 💼 Digital marketing consultant helping startups grow
- 🎨 UI/UX designer creating beautiful experiences"
                value={marketingBio}
                onChange={(e) => setMarketingBio(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Use markdown formatting to make your bio stand out
              </p>
            </div>

            {/* Links Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>External Links</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLink}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Link
                </Button>
              </div>

              {marketingLinks.map((link) => (
                <div key={link.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={link.type}
                      onValueChange={(value) => updateLink(link.id, 'type', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LINK_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-3 h-3" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      placeholder="My Portfolio"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      placeholder="https://example.com"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLink(link.id)}
                      className="h-8 w-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {marketingLinks.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No links added yet. Click "Add Link" to get started.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Display Mode */}
            {userProfile?.marketing_bio && (
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
            )}

            {userProfile?.marketing_links && userProfile.marketing_links.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userProfile.marketing_links.map((link) => {
                    const IconComponent = getLinkTypeIcon(link.type);
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border rounded-lg hover:bg-muted transition-colors group"
                      >
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate flex-1">
                          {link.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state for owner */}
            {isOwner && !userProfile?.marketing_bio && (!userProfile?.marketing_links || userProfile.marketing_links.length === 0) && (
              <div className="text-center py-6 text-muted-foreground">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm mb-3">Share more about yourself with fellow nomads</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Add About Me Section
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}