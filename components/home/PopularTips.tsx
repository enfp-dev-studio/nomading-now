'use client';

import { useState, useEffect } from 'react';
import { TipCard } from '@/components/shared/TipCard';
import { TipsService } from '@/lib/services/tips';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PopularTips() {
  const { user } = useAuth();
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularTips = async () => {
      try {
        setLoading(true);
        const result = await TipsService.getTips({
          limit: 4,
          userId: user?.id,
        });

        // Transform the data to match the expected format
        const transformedTips = result.map(item => ({
          id: item.tip.id,
          content: item.tip.content,
          locationName: item.tip.locationName,
          latitude: item.tip.latitude,
          longitude: item.tip.longitude,
          city: item.tip.city,
          country: item.tip.country,
          category: item.tip.category,
          photos: item.tip.photos,
          likesCount: item.tip.likesCount,
          savesCount: item.tip.savesCount,
          commentsCount: item.tip.commentsCount,
          createdAt: item.tip.createdAt,
          user: item.user,
          isLiked: item.isLiked,
          isSaved: item.isSaved,
        }));

        setTips(transformedTips);
      } catch (error) {
        console.error('Error fetching popular tips:', error);
        setTips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTips();
  }, [user?.id]);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Tips This Week
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover what fellow nomads are raving about right now
            </p>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
            <span className="ml-2 text-gray-600">Loading tips...</span>
          </div>
        </div>
      </section>
    );
  }

  if (tips.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Tips This Week
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Be the first to share amazing nomad tips!
            </p>
          </div>
          <div className="text-center">
            <Link href="/create-tip">
              <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8">
                Share Your First Tip
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trending Tips This Week
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover what fellow nomads are raving about right now
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {tips.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/explore">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8">
              See All Tips
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}