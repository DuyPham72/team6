import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FilterPreferences {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  onlyAvailable: boolean;
}

interface SearchFiltersProps {
  onFilterChange: (filters: FilterPreferences) => void;
}

const AMENITIES = [
  'Parking',
  'Gym',
  'Pool',
  'Pet Friendly',
  'Furnished',
  'Laundry',
  'Security',
  'Study Room',
];

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([500, 2000]);
  const [minRating, setMinRating] = React.useState(0);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = React.useState(false);

  React.useEffect(() => {
    onFilterChange({
      priceRange,
      minRating,
      amenities: selectedAmenities,
      onlyAvailable,
    });
  }, [priceRange, minRating, selectedAmenities, onlyAvailable]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]] as [number, number]);
  };

  const handleClearFilters = () => {
    setPriceRange([500, 2000]);
    setMinRating(0);
    setSelectedAmenities([]);
    setOnlyAvailable(false);
    onFilterChange({
      priceRange: [500, 2000],
      minRating: 0,
      amenities: [],
      onlyAvailable: false,
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-white">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
        >
          Clear All
        </button>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-white text-lg">Price Range</h3>
        <Slider
          defaultValue={[500, 2000]}
          min={0}
          max={3000}
          step={100}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-white">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-white text-lg">Minimum Rating</h3>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`p-2 rounded-full transition-colors ${
                minRating >= rating ? 'text-yellow-400' : 'text-white/80'
              }`}
            >
              <Star size={20} fill={minRating >= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-white text-lg">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => (
            <Badge
              key={amenity}
              variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
              className={`cursor-pointer ${selectedAmenities.includes(amenity) ? 'text-white' : 'text-white/90'}`}
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={onlyAvailable}
          onCheckedChange={setOnlyAvailable}
        />
        <Label htmlFor="available" className="text-white text-base">Show only available</Label>
      </div>
    </div>
  );
} 