import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Star,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Coffee,
  Tv,
  Save,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/use-local-storage';

interface FilterPreferences {
  priceRange: [number, number];
  amenities: string[];
  minRating: number;
  availability: boolean;
}

interface SearchFiltersProps {
  onFilterChange: (filters: FilterPreferences) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [savedPreferences, setSavedPreferences] = useLocalStorage<FilterPreferences>(
    'search-preferences',
    {
      priceRange: [500, 2000],
      amenities: [],
      minRating: 0,
      availability: true,
    }
  );

  const [priceRange, setPriceRange] = useState<[number, number]>(savedPreferences.priceRange);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(savedPreferences.amenities);
  const [minRating, setMinRating] = useState<number>(savedPreferences.minRating);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(savedPreferences.availability);

  const amenitiesList = [
    { icon: Wifi, label: 'WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Waves, label: 'Pool' },
    { icon: Dumbbell, label: 'Gym' },
    { icon: Coffee, label: 'Kitchen' },
    { icon: Tv, label: 'TV Room' },
  ];

  useEffect(() => {
    const filters: FilterPreferences = {
      priceRange,
      amenities: selectedAmenities,
      minRating,
      availability: showOnlyAvailable,
    };
    onFilterChange(filters);
  }, [priceRange, selectedAmenities, minRating, showOnlyAvailable]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSavePreferences = () => {
    setSavedPreferences({
      priceRange,
      amenities: selectedAmenities,
      minRating,
      availability: showOnlyAvailable,
    });
  };

  const handleClearFilters = () => {
    setPriceRange([500, 2000]);
    setSelectedAmenities([]);
    setMinRating(0);
    setShowOnlyAvailable(false);
    onFilterChange({
      priceRange: [500, 2000],
      amenities: [],
      minRating: 0,
      availability: false,
    });
  };

  return (
    <div className="bg-gray-900/80 border border-violet-500/30 rounded-lg p-6 space-y-6">
      {/* Price Range Slider */}
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
        <h3 className="text-lg font-semibold text-white mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={priceRange}
            min={500}
            max={2000}
            step={50}
            onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
            className="w-full [&>[role=slider]]:bg-violet-500 [&>[role=slider]]:border-violet-400 [&_[data-orientation=horizontal]]:bg-violet-500/50"
          />
          <div className="flex justify-between text-sm text-violet-200">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              onClick={() => handleAmenityToggle(label)}
              className={`flex items-center gap-2 ${
                selectedAmenities.includes(label)
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              variant="primary"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Minimum Rating</h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`${
                minRating >= rating
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              variant="primary"
            >
              <Star
                className={`w-5 h-5 ${
                  minRating >= rating ? 'fill-current' : ''
                }`}
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      {/* <div>
        <Button
          onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
          className={`w-full ${
            showOnlyAvailable
              ? 'bg-violet-600 hover:bg-violet-700'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          variant="outline"
        >
          {showOnlyAvailable ? 'Show All' : 'Show Only Available'}
        </Button>
      </div> */}

      {/* Save Preferences */}
    </div>
  );
};

export default SearchFilters; 