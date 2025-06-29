import { Search, Filter, Map, List, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TIP_CATEGORIES, FEATURED_CITIES } from '@/lib/constants';
import { TipCategory } from '@/lib/types';

interface ExploreFiltersProps {
  selectedCity: string;
  selectedCategory: TipCategory | '';
  sortBy: 'recent' | 'popular' | 'nearby';
  showMap: boolean;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: TipCategory | '') => void;
  onSortChange: (sort: 'recent' | 'popular' | 'nearby') => void;
  onShowMapChange: (show: boolean) => void;
}

export function ExploreFilters({
  selectedCity,
  selectedCategory,
  sortBy,
  showMap,
  onCityChange,
  onCategoryChange,
  onSortChange,
  onShowMapChange,
}: ExploreFiltersProps) {
  const handleCityChange = (value: string) => {
    onCityChange(value === 'all-cities-option' ? '' : value);
  };

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all-categories-option' ? '' : value as TipCategory);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations, tips, or users..."
              className="pl-10"
            />
          </div>
        </div>

        {/* City Filter */}
        <div className="min-w-[200px]">
          <Select value={selectedCity || 'all-cities-option'} onValueChange={handleCityChange}>
            <SelectTrigger>
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-cities-option">All Cities</SelectItem>
              {FEATURED_CITIES.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}, {city.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="min-w-[200px]">
          <Select value={selectedCategory || 'all-categories-option'} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories-option">All Categories</SelectItem>
              {TIP_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center">
                    <span className="mr-2">{category.emoji}</span>
                    {category.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="min-w-[150px]">
          <Select value={sortBy} onValueChange={(value: 'recent' | 'popular' | 'nearby') => onSortChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="nearby">Nearby</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-gray-200">
          <Button
            variant={!showMap ? "default" : "ghost"}
            size="sm"
            onClick={() => onShowMapChange(false)}
            className="rounded-r-none"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={showMap ? "default" : "ghost"}
            size="sm"
            onClick={() => onShowMapChange(true)}
            className="rounded-l-none"
          >
            <Map className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}