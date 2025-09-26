import React from 'react';
import { Heart } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import { Property } from '@/lib/models/Property';

interface FavoritesTabProps {
  favoriteProperties: Property[];
  onToggleFavorite: (id: string) => void;
  onPropertyClick: (property: Property) => void;
}

export function FavoritesTab({ favoriteProperties, onToggleFavorite, onPropertyClick }: FavoritesTabProps) {
  if (favoriteProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="mb-2">No wishlists yet</h2>
        <p className="text-muted-foreground">
          Tap the heart icon on any listing to save your favorites here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4">Wishlists</h1>
      <div className="grid grid-cols-1 gap-4">
        {favoriteProperties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            onToggleFavorite={onToggleFavorite}
            onClick={onPropertyClick}
          />
        ))}
      </div>
    </div>
  );
}