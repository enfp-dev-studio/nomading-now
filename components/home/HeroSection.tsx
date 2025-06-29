import { ArrowRight, Users, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Discover the World Through 
            <span className="bg-gradient-to-r from-sky-600 to-orange-500 bg-clip-text text-transparent"> Nomad Eyes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Share and discover the best spots for digital nomads worldwide. From co-working spaces to hidden food gems, 
            get insider tips from fellow nomads who've been there.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/explore">
            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 text-lg">
              Explore Tips
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/create-tip">
            <Button size="lg" variant="outline" className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-3 text-lg">
              Share Your Tip
            </Button>
          </Link>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-sky-100 rounded-lg mx-auto mb-2">
              <Users className="w-6 h-6 text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">12K+</div>
            <div className="text-sm text-gray-600">Active Nomads</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.2K</div>
            <div className="text-sm text-gray-600">Tips Shared</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">150</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
        </div>
      </div>
    </section>
  );
}