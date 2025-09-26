'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { SearchHeader } from '@/components/SearchHeader';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyDetails } from '@/components/PropertyDetails';
import { BookingModal } from '@/components/BookingModal';
import { FilterSheet } from '@/components/FilterSheet';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FavoritesTab } from '@/components/FavoritesTab';
import { ProfileTab } from '@/components/ProfileTab';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/lib/models/Property';
import { toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user ID for testing
  const userId = 'test-user-123';

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, [searchQuery, fetchProperties]);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/properties?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      } else {
        // Fallback to mock data if API fails
        setProperties(mockProperties);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      // Fallback to mock data
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Mock data matching MongoDB structure for fallback
  const mockProperties: Property[] = [
    {
      _id: '1',
      name: 'Modern Downtown Apartment',
      property_type: 'Apartment',
      room_type: 'Entire home/apt',
      accommodates: 4,
      bedrooms: 2,
      number_of_reviews: 127,
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer'],
      price: { $numberDecimal: '150.00' },
      images: {
        picture_url: 'https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1ODkxMzcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        medium_url: 'https://images.unsplash.com/photo-1755829634812-77614455c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGhvdGVsfGVufDF8fHx8MTc1ODg1ODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      host: {
        host_id: '1',
        host_name: 'Sarah',
        host_is_superhost: true,
        host_has_profile_pic: true,
        host_identity_verified: true
      },
      address: {
        street: 'New York, NY',
        country: 'United States',
        location: { type: 'Point', coordinates: [-74.0060, 40.7128] }
      },
      review_scores: {
        review_scores_rating: 49
      },
      isFavorite: false,
    },
    {
      _id: '2',
      name: 'Luxury Villa with Ocean View',
      property_type: 'Villa',
      room_type: 'Entire home/apt',
      accommodates: 8,
      bedrooms: 4,
      number_of_reviews: 89,
      amenities: ['WiFi', 'Pool', 'Hot tub', 'Parking', 'Kitchen'],
      price: { $numberDecimal: '320.00' },
      images: {
        picture_url: 'https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2YWNhdGlvbiUyMGhvbWUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NTg5MDcxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        medium_url: 'https://images.unsplash.com/photo-1597508625000-b4d358850e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1ODg1MzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      },
      host: {
        host_id: '2',
        host_name: 'Mike',
        host_is_superhost: false,
        host_has_profile_pic: true,
        host_identity_verified: true
      },
      address: {
        street: 'Miami, FL',
        country: 'United States',
        location: { type: 'Point', coordinates: [-80.1918, 25.7617] }
      },
      review_scores: {
        review_scores_rating: 48
      },
      isFavorite: true,
    },
  ];

  const handleToggleFavorite = async (propertyId: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, propertyId }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local state
        setProperties(prev => 
          prev.map(property => 
            property._id === propertyId 
              ? { ...property, isFavorite: data.isFavorite }
              : property
          )
        );
        
        const property = properties.find(p => p._id === propertyId);
        toast(
          data.isFavorite ? 'Added to wishlist' : 'Removed from wishlist',
          {
            description: property?.name,
          }
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleBooking = (property: Property) => {
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (bookingDetails: Record<string, unknown>) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingDetails,
          userId,
          propertyId: selectedProperty?._id,
        }),
      });

      if (response.ok) {
        toast('Booking confirmed!', {
          description: `Your reservation for ${selectedProperty?.name} has been confirmed.`,
        });
        setShowBookingModal(false);
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: Record<string, unknown>) => {
    toast('Filters applied', {
      description: 'Search results updated based on your preferences.',
    });
  };

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (property.address.market && property.address.market.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const favoriteProperties = properties.filter(property => property.isFavorite);

  if (selectedProperty) {
  return (
      <>
        <PropertyDetails
          property={selectedProperty}
          onBack={() => setSelectedProperty(null)}
          onToggleFavorite={handleToggleFavorite}
          onBook={handleBooking}
        />
        {showBookingModal && (
          <BookingModal
            property={selectedProperty}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onConfirm={handleConfirmBooking}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {activeTab === 'search' && (
        <>
          <SearchHeader
            onSearch={handleSearch}
            onFilterToggle={() => setShowFilterSheet(true)}
            searchQuery={searchQuery}
          />
          
          {/* Quick Filters */}
          <div className="px-4 py-3 flex gap-2 overflow-x-auto">
            <Badge variant="outline" className="whitespace-nowrap">Entire homes</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Amazing pools</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Beachfront</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Luxury</Badge>
            <Badge variant="outline" className="whitespace-nowrap">Pet-friendly</Badge>
          </div>

          {/* Property Grid */}
          <div className="px-4 pb-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={handlePropertyClick}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'favorites' && (
        <FavoritesTab
          favoriteProperties={favoriteProperties}
          onToggleFavorite={handleToggleFavorite}
          onPropertyClick={handlePropertyClick}
        />
      )}

      {activeTab === 'trips' && (
        <div className="p-4 pt-8">
          <h1 className="mb-4">Trips</h1>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trips booked...yet!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Time to dust off your bags and start planning your next adventure.
            </p>
          </div>
        </div>
      )}

      {/* Admin functionality removed */}

      {activeTab === 'profile' && <ProfileTab />}

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <FilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}