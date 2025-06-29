import { ExternalLink, Globe, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BuiltOnBoltBadge } from '@/components/shared/BuiltOnBoltBadge';
import { User } from '@/lib/types';

interface ProfileLinksProps {
  user: User;
}

export function ProfileLinks({ user }: ProfileLinksProps) {
  const links = [
    {
      icon: Globe,
      label: 'Website',
      value: user.website,
      href: user.website
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: user.instagram ? `@${user.instagram}` : null,
      href: user.instagram ? `https://instagram.com/${user.instagram}` : null
    },
    {
      icon: Twitter,
      label: 'Twitter',
      value: user.twitter ? `@${user.twitter}` : null,
      href: user.twitter ? `https://twitter.com/${user.twitter}` : null
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: user.linkedin ? user.linkedin : null,
      href: user.linkedin ? `https://linkedin.com/in/${user.linkedin}` : null
    }
  ].filter(link => link.value);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Links & Social
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.length === 0 ? (
            <p className="text-gray-600 text-sm">No links added yet</p>
          ) : (
            links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  asChild
                >
                  <a href={link.href!} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{link.label}</div>
                      <div className="text-xs text-gray-600">{link.value}</div>
                    </div>
                    <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
                  </a>
                </Button>
              );
            })
          )}
          
          <Button variant="outline" className="w-full mt-4">
            Edit Links
          </Button>
        </CardContent>
      </Card>

      {/* Built on Bolt Badge in Sidebar */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <BuiltOnBoltBadge variant="compact" className="mx-auto" />
            <p className="text-xs text-gray-500 mt-2">
              This app was built using Bolt
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}