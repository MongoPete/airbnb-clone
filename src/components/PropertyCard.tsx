import React from 'react';
import { Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Property } from '@/lib/models/Property';

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
  onClick: (property: Property) => void;
}

export function PropertyCard({ property, onToggleFavorite, onClick }: PropertyCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
      <div className="relative">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              property.isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
            }`}
          />
        </Button>
        {property.superhost && (
          <Badge className="absolute top-3 left-3 bg-background text-foreground">
            Superhost
          </Badge>
        )}
      </div>
      
      <div className="p-4" onClick={() => onClick(property)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="line-clamp-1 mb-1">{property.title}</h3>
            <p className="text-muted-foreground mb-2">{property.location}</p>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{property.rating}</span>
            <span className="text-xs text-muted-foreground">({property.reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="font-semibold">${property.price}</span>
          <span className="text-muted-foreground">night</span>
        </div>
      </div>
    </div>
  );
}