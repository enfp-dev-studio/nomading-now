import { TipCategory, TIP_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: TipCategory | 'all';
  onCategoryChange: (category: TipCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-card border-b border-border">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 p-4 sm:px-6">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            className={cn(
              "min-w-fit px-3 sm:px-4 text-xs sm:text-sm",
              selectedCategory === 'all' && "bg-primary hover:bg-primary/90"
            )}
            onClick={() => onCategoryChange('all')}
          >
            All
          </Button>
          
          {TIP_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              className={cn(
                "min-w-fit px-3 sm:px-4 gap-1 text-xs sm:text-sm",
                selectedCategory === category.id && "bg-primary hover:bg-primary/90"
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <span>{category.emoji}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}