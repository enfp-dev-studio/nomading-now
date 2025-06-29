import { Navigation } from '@/components/layout/Navigation';
import { ExploreContent } from '@/components/explore/ExploreContent';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ExploreContent />
    </div>
  );
}