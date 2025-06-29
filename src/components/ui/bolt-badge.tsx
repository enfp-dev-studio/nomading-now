import { ExternalLink } from 'lucide-react';

interface BoltBadgeProps {
  variant?: 'floating' | 'fixed';
}

export function BoltBadge({ variant = 'fixed' }: BoltBadgeProps) {
  const handleClick = () => {
    window.open('https://bolt.new/', '_blank', 'noopener,noreferrer');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className="fixed bottom-24 right-4 z-50 lg:hidden group"
        aria-label="Powered by Bolt.new"
      >
        <div className="relative">
          {/* Main badge */}
          <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
            <img 
              src="/white_circle_360x360.png" 
              alt="Bolt.new" 
              className="w-8 h-8"
            />
          </div>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Powered by Bolt.new
              <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full hover:bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md"
      aria-label="Powered by Bolt.new"
    >
      <img 
        src="/white_circle_360x360.png" 
        alt="Bolt.new" 
        className="w-4 h-4"
      />
      <span className="text-xs font-medium text-gray-700 hidden sm:inline">
        Powered by Bolt
      </span>
      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-gray-700" />
    </button>
  );
}