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
  // Extract data from MongoDB structure
  const price = property.price?.$numberDecimal ? parseFloat(property.price.$numberDecimal) : 0;
  const rating = property.review_scores?.review_scores_rating ? property.review_scores.review_scores_rating / 10 : 0;
  const reviewCount = property.number_of_reviews || 0;
  const location = `${property.address.market || property.address.country}`;
  const imageUrl = property.images.picture_url || property.images.medium_url || '/placeholder-property.jpg';
  
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative">
        <ImageWithFallback
          src={imageUrl}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property._id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              property.isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
            }`}
          />
        </Button>
        {property.host.host_is_superhost && (
          <Badge className="absolute top-3 left-3 bg-background text-foreground">
            Superhost
          </Badge>
        )}
        <Badge className="absolute bottom-3 left-3 bg-background/90 text-foreground text-xs">
          {property.property_type}
        </Badge>
      </div>
      
      <div className="p-4" onClick={() => onClick(property)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2 mb-1 text-sm">{property.name}</h3>
            <p className="text-muted-foreground text-sm mb-1">{location}</p>
            <p className="text-muted-foreground text-xs line-clamp-1">{property.room_type}</p>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-semibold">${Math.round(price)}</span>
            <span className="text-muted-foreground text-sm">night</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {property.accommodates} guests • {property.bedrooms || 0} bed{(property.bedrooms || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}