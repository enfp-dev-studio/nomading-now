'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuiltOnBoltBadgeProps {
  variant?: 'default' | 'minimal' | 'compact';
  className?: string;
}

export function BuiltOnBoltBadge({ variant = 'default', className = '' }: BuiltOnBoltBadgeProps) {
  const handleClick = () => {
    window.open('https://bolt.new', '_blank', 'noopener,noreferrer');
  };

  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`text-xs text-gray-500 hover:text-gray-700 h-auto p-1 ${className}`}
      >
        Built on Bolt
        <ExternalLink className="w-3 h-3 ml-1" />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={handleClick}
        className={`inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer transition-colors text-xs text-gray-600 ${className}`}
      >
        <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
        </div>
        <span>Built on Bolt</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg cursor-pointer transition-all hover:shadow-sm group ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">Built on Bolt</span>
          <span className="text-xs text-gray-500">Powered by StackBlitz</span>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </div>
  );
}