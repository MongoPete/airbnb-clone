'use client'
import React, { useState, useEffect } from 'react';
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
  }, [searchQuery]);

  const fetchProperties = async () => {
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
  };

  // Mock data for initial testing
  const mockProperties: Property[] = [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      location: 'New York, NY',
      price: 150,
      rating: 4.9,
      reviewCount: 127,
      images: [
        'https://images.unsplash.com/photo-1662454419622-a41092ecd245?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1ODkxMzcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1755829634812-77614455c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGhvdGVsfGVufDF8fHx8MTc1ODg1ODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      host: 'Sarah',
      type: 'Entire apartment',
      amenities: ['WiFi', 'Kitchen', 'Air conditioning', 'Washer'],
      superhost: true,
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Luxury Villa with Ocean View',
      location: 'Miami, FL',
      price: 320,
      rating: 4.8,
      reviewCount: 89,
      images: [
        'https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2YWNhdGlvbiUyMGhvbWUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NTg5MDcxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1597508625000-b4d358850e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1ODg1MzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      host: 'Mike',
      type: 'Entire villa',
      amenities: ['WiFi', 'Pool', 'Hot tub', 'Parking', 'Kitchen'],
      superhost: false,
      isFavorite: true,
    },
    {
      id: '3',
      title: 'Cozy City Loft',
      location: 'Chicago, IL',
      price: 95,
      rating: 4.7,
      reviewCount: 203,
      images: [
        'https://images.unsplash.com/photo-1616116408164-54aaffd852b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwYmFsY29ueSUyMHZpZXd8ZW58MXx8fHwxNzU4OTA3MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1755829634812-77614455c061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGhvdGVsfGVufDF8fHx8MTc1ODg1ODQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      host: 'Emma',
      type: 'Private room',
      amenities: ['WiFi', 'Kitchen', 'Gym'],
      superhost: true,
      isFavorite: false,
    },
    {
      id: '4',
      title: 'Beachfront Paradise',
      location: 'San Diego, CA',
      price: 280,
      rating: 4.9,
      reviewCount: 156,
      images: [
        'https://images.unsplash.com/photo-1597508625000-b4d358850e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwb2NlYW4lMjB2aWV3fGVufDF8fHx8MTc1ODg1MzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        'https://images.unsplash.com/photo-1622015663319-e97e697503ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2YWNhdGlvbiUyMGhvbWUlMjBleHRlcmlvcnxlbnwxfHx8fDE3NTg5MDcxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      ],
      host: 'David',
      type: 'Entire house',
      amenities: ['WiFi', 'Kitchen', 'Parking', 'Pool', 'Hot tub'],
      superhost: true,
      isFavorite: false,
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
            property.id === propertyId 
              ? { ...property, isFavorite: data.isFavorite }
              : property
          )
        );
        
        const property = properties.find(p => p.id === propertyId);
        toast(
          data.isFavorite ? 'Added to wishlist' : 'Removed from wishlist',
          {
            description: property?.title,
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
          propertyId: selectedProperty?.id,
        }),
      });

      if (response.ok) {
        toast('Booking confirmed!', {
          description: `Your reservation for ${selectedProperty?.title} has been confirmed.`,
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
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
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
                    key={property.id}
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