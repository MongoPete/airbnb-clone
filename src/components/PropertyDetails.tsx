import React, { useState } from 'react';
import { ArrowLeft, Share, Heart, Star, Users, Bath, Wifi, Car, Coffee } from 'lucide-react';
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

  // Extract data from MongoDB structure
  const price = property.price?.$numberDecimal ? parseFloat(property.price.$numberDecimal) : 0;
  const rating = property.review_scores?.review_scores_rating ? property.review_scores.review_scores_rating / 10 : 0;
  const reviewCount = property.number_of_reviews || 0;
  const location = `${property.address.street}, ${property.address.market || property.address.country}`;
  const bathrooms = property.bathrooms?.$numberDecimal ? parseFloat(property.bathrooms.$numberDecimal) : 0;
  
  // Create images array from the single image object
  const images = [
    property.images.picture_url,
    property.images.xl_picture_url,
    property.images.medium_url,
    property.images.thumbnail_url
  ].filter(Boolean);

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Wifi': <Wifi className="h-4 w-4" />,
    'WiFi': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Kitchen': <Coffee className="h-4 w-4" />,
    'Paid parking off premises': <Car className="h-4 w-4" />,
    'Coffee maker': <Coffee className="h-4 w-4" />,
    'Washer': <Bath className="h-4 w-4" />,
    'TV': <Users className="h-4 w-4" />,
  };

  // Use real reviews from MongoDB data
  const reviews = property.reviews?.slice(0, 5).map(review => ({
    id: review._id,
    user: review.reviewer_name,
    rating: 5, // MongoDB doesn't store individual review ratings, so default to 5
    comment: review.comments,
    date: new Date(review.date.$date).toLocaleDateString()
  })) || [];

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
              onClick={() => onToggleFavorite(property._id)}
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
          src={images[currentImageIndex] || property.images.picture_url}
          alt={property.name}
          className="w-full h-80 object-cover"
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">{property.name}</h1>
            <p className="text-muted-foreground mb-2">{location}</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{property.property_type}</Badge>
              <Badge variant="outline">{property.room_type}</Badge>
              {property.host.host_is_superhost && (
                <Badge className="bg-red-500 text-white">Superhost</Badge>
              )}
            </div>
          </div>
          {rating > 0 && (
            <div className="flex items-center gap-1 ml-4">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({reviewCount} reviews)</span>
            </div>
          )}
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={property.host.host_picture_url} alt={property.host.host_name} />
            <AvatarFallback>
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">{property.host.host_name[0]}</span>
              </div>
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Hosted by {property.host.host_name}</p>
            <p className="text-sm text-muted-foreground">
              {property.host.host_is_superhost ? 'Superhost' : 'Host'} • 
              {property.host.host_response_time && ` ${property.host.host_response_time} response`}
            </p>
            {property.host.host_location && (
              <p className="text-xs text-muted-foreground">{property.host.host_location}</p>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>
              {property.accommodates} guests • 
              {property.bedrooms ? ` ${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}` : ''} • 
              {property.beds ? ` ${property.beds} bed${property.beds !== 1 ? 's' : ''}` : ''} • 
              {bathrooms > 0 ? ` ${bathrooms} bathroom${bathrooms !== 1 ? 's' : ''}` : ''}
            </span>
          </div>
          {property.minimum_nights && (
            <div className="text-sm text-muted-foreground">
              Minimum stay: {property.minimum_nights} night{property.minimum_nights !== '1' ? 's' : ''}
            </div>
          )}
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
            <span>{rating.toFixed(1)} · {reviewCount} reviews</span>
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
              <span>${Math.round(price)}</span>
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