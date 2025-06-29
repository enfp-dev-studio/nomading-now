import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularTips } from '@/components/home/PopularTips';
import { FeaturedCities } from '@/components/home/FeaturedCities';
import { StatsSection } from '@/components/home/StatsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-orange-50">
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturedCities />
        <PopularTips />
      </main>
    </div>
  );
}