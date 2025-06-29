import { TrendingUp, Heart, Bookmark, MessageCircle } from 'lucide-react';

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: '89%',
      label: 'Success Rate',
      description: 'Tips that helped nomads find great spots'
    },
    {
      icon: Heart,
      value: '25K+',
      label: 'Likes Given',
      description: 'Community appreciation for quality tips'
    },
    {
      icon: Bookmark,
      value: '18K+',
      label: 'Tips Saved',
      description: 'Bookmarked for future travel plans'
    },
    {
      icon: MessageCircle,
      value: '5.2K',
      label: 'Comments',
      description: 'Active discussions and follow-up questions'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Nomads Worldwide
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our community shares real experiences that make a difference in fellow nomads' journeys
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-gray-800 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}