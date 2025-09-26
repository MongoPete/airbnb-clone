import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function FilterSheet({ isOpen, onClose, onApplyFilters }: FilterSheetProps) {
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  if (!isOpen) return null;

  const propertyTypes = [
    'Entire home/apt',
    'Private room',
    'Shared room',
    'Hotel room'
  ];

  const amenities = [
    'WiFi',
    'Kitchen',
    'Parking',
    'Air conditioning',
    'Pool',
    'Hot tub',
    'Gym',
    'Washer'
  ];

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      priceRange,
      propertyTypes: selectedTypes,
      amenities: selectedAmenities
    });
    onClose();
  };

  const handleClear = () => {
    setPriceRange([50, 500]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-background rounded-t-3xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button variant="ghost" onClick={handleClear}>
            Clear all
          </Button>
          <h2>Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Price Range */}
          <div>
            <Label className="mb-4 block">Price range</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={1000}
                min={10}
                step={10}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}+</span>
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Label className="mb-3 block">Type of place</Label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`p-3 border border-border rounded-lg cursor-pointer text-center text-sm transition-colors ${
                    selectedTypes.includes(type)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="mb-3 block">Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Filters Summary */}
          {(selectedTypes.length > 0 || selectedAmenities.length > 0) && (
            <div>
              <Label className="mb-3 block">Selected filters</Label>
              <div className="flex flex-wrap gap-2">
                {selectedTypes.map((type) => (
                  <Badge key={type} variant="secondary">
                    {type}
                  </Badge>
                ))}
                {selectedAmenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button onClick={handleApply} className="w-full h-12">
            Show {Math.floor(Math.random() * 100 + 50)} places
          </Button>
        </div>
      </div>
    </div>
  );
}