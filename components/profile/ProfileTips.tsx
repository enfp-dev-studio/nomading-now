import { TipCard } from '@/components/shared/TipCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileTipsProps {
  tips: Array<{
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
  }>;
}

export function ProfileTips({ tips }: ProfileTipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tips ({tips.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {tips.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tips yet</h3>
            <p className="text-gray-600">Share your first nomad tip to help the community!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}