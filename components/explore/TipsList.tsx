import { TipCard } from '@/components/shared/TipCard';

interface TipsListProps {
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
    isLiked?: boolean;
    isSaved?: boolean;
  }>;
}

export function TipsList({ tips }: TipsListProps) {
  if (tips.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 17H9v-2.5A3.5 3.5 0 0112.5 11h3A3.5 3.5 0 0119 14.5V17z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tips found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {tips.length} tip{tips.length === 1 ? '' : 's'} found
          </h2>
          <div className="text-sm text-gray-600">
            Showing the best matches for your search
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </div>
  );
}