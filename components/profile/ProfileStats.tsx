import { TrendingUp, Heart, Bookmark, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/lib/types';

interface ProfileStatsProps {
  user: User;
  stats: {
    totalTips: number;
    totalLikes: number;
    totalSaves: number;
    totalComments: number;
  } | null;
  tipsCount: number;
}

export function ProfileStats({ user, stats, tipsCount }: ProfileStatsProps) {
  const displayStats = [
    {
      icon: TrendingUp,
      label: 'Tips Shared',
      value: stats?.totalTips || tipsCount,
      color: 'text-blue-600'
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: stats?.totalLikes || 0,
      color: 'text-red-600'
    },
    {
      icon: Bookmark,
      label: 'Times Saved',
      value: stats?.totalSaves || 0,
      color: 'text-yellow-600'
    },
    {
      icon: MessageCircle,
      label: 'Comments',
      value: stats?.totalComments || 0,
      color: 'text-green-600'
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${stat.color} mb-2`}>
                  <Icon className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Trust Score</div>
              <div className="text-2xl font-bold text-orange-600">{user.points}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Community Impact</div>
              <div className="text-lg font-semibold text-gray-900">
                {user.trustLevel === 'guru' ? 'Very High' : 
                 user.trustLevel === 'expert' ? 'High' :
                 user.trustLevel === 'traveler' ? 'Medium' : 'Growing'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}