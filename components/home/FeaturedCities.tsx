import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FEATURED_CITIES } from '@/lib/constants';
import Link from 'next/link';

export function FeaturedCities() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Nomad Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore tips from the most loved cities by digital nomads around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {FEATURED_CITIES.map((city, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {city.tips_count} tips
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{city.country}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{city.description}</p>
                <Link href={`/explore?city=${encodeURIComponent(city.name)}`}>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-sky-600 hover:text-sky-700">
                    Explore tips
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/explore">
            <Button variant="outline" size="lg" className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50">
              View All Cities
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}