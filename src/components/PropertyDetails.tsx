import React, { useState } from 'react';
import { ArrowLeft, Share, Heart, Star, Users, Bed, Bath, Wifi, Car, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Property } from '@/lib/models/Property';

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  onBook: (property: Property) => void;
}

export function PropertyDetails({ property, onBack, onToggleFavorite, onBook }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Kitchen': <Coffee className="h-4 w-4" />,
    'Bath': <Bath className="h-4 w-4" />,
    'Bed': <Bed className="h-4 w-4" />,
  };

  const reviews = [
    {
      id: '1',
      user: 'Sarah M.',
      rating: 5,
      comment: 'Amazing place! Clean, comfortable, and exactly as described. The host was very responsive.',
      date: '2 weeks ago'
    },
    {
      id: '2',
      user: 'Mike R.',
      rating: 5,
      comment: 'Perfect location and beautiful apartment. Would definitely stay again!',
      date: '1 month ago'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onToggleFavorite(property.id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  property.isFavorite ? 'fill-red-500 text-red-500' : 'text-foreground'
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <ImageWithFallback
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="mb-2">{property.title}</h1>
            <p className="text-muted-foreground mb-2">{property.location}</p>
            {property.superhost && (
              <Badge className="mb-2">Superhost</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 ml-4">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span>{property.rating}</span>
            <span className="text-muted-foreground">({property.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-12 w-12">
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span>{property.host[0]}</span>
            </div>
          </Avatar>
          <div>
            <p>Hosted by {property.host}</p>
            <p className="text-sm text-muted-foreground">Superhost · 4 years hosting</p>
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>4 guests · 2 bedrooms · 2 beds · 1 bathroom</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h3 className="mb-3">What this place offers</h3>
          <div className="grid grid-cols-2 gap-3">
            {property.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                {amenityIcons[amenity] || <div className="h-4 w-4" />}
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span>{property.rating} · {property.reviewCount} reviews</span>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">{review.user[0]}</span>
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm">{review.user}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span>${property.price}</span>
              <span className="text-muted-foreground">night</span>
            </div>
            <p className="text-sm text-muted-foreground">Dec 15-20</p>
          </div>
          <Button onClick={() => onBook(property)} className="px-8">
            Reserve
          </Button>
        </div>
      </div>
    </div>
  );
}