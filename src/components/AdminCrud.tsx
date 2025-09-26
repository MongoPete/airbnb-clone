import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Property } from '@/lib/models/Property';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export function AdminCrud() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?limit=50');
      const data = await response.json();
      if (response.ok) {
        setProperties(data.properties || []);
      } else {
        toast.error('Failed to fetch properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filter properties based on search
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.market?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete property
  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Property deleted successfully');
        fetchProperties();
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  // Format price for display
  const formatPrice = (property: Property) => {
    const price = property.price?.$numberDecimal ? parseFloat(property.price.$numberDecimal) : 0;
    return Math.round(price);
  };

  // Format rating for display
  const formatRating = (property: Property) => {
    const rating = property.review_scores?.review_scores_rating ? property.review_scores.review_scores_rating / 10 : 0;
    return rating.toFixed(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">Manage your Airbnb properties</p>
        </div>
        <Dialog open={isCreateMode} onOpenChange={setIsCreateMode}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="p-4 text-center text-muted-foreground">
              <p>Create new property form would go here.</p>
              <p className="text-sm mt-2">This would integrate with the MongoDB sample_airbnb collection.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsCreateMode(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties by name, location, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold">{properties.length}</div>
          <div className="text-sm text-muted-foreground">Total Properties</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {properties.filter(p => p.host.host_is_superhost).length}
          </div>
          <div className="text-sm text-muted-foreground">Superhost Properties</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {Math.round(properties.reduce((acc, p) => acc + formatPrice(p), 0) / properties.length || 0)}
          </div>
          <div className="text-sm text-muted-foreground">Avg Price/Night</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">
            {(properties.reduce((acc, p) => acc + parseFloat(formatRating(p)), 0) / properties.length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">Avg Rating</div>
        </Card>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No properties found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property._id} className="p-4">
              <div className="flex items-center gap-4">
                {/* Property Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={property.images.picture_url}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.address.market || property.address.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">{property.property_type}</Badge>
                      {property.host.host_is_superhost && (
                        <Badge className="bg-red-500 text-white">Superhost</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.accommodates} guests</span>
                      <span>{property.bedrooms || 0} bedrooms</span>
                      <span>{property.number_of_reviews} reviews</span>
                      <span className="font-semibold text-foreground">
                        ${formatPrice(property)}/night
                      </span>
                      {parseFloat(formatRating(property)) > 0 && (
                        <span className="font-semibold text-foreground">
                          ⭐ {formatRating(property)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            View/Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Property Details</DialogTitle>
                          </DialogHeader>
                          <PropertyDetailsView property={property} />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(property._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Property Details View Component
function PropertyDetailsView({ property }: { property: Property }) {
  const price = property.price?.$numberDecimal ? parseFloat(property.price.$numberDecimal) : 0;
  const cleaningFee = property.cleaning_fee?.$numberDecimal ? parseFloat(property.cleaning_fee.$numberDecimal) : 0;
  const bathrooms = property.bathrooms?.$numberDecimal ? parseFloat(property.bathrooms.$numberDecimal) : 0;

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="font-semibold mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {property.name}
          </div>
          <div>
            <span className="font-medium">Property Type:</span> {property.property_type}
          </div>
          <div>
            <span className="font-medium">Room Type:</span> {property.room_type}
          </div>
          <div>
            <span className="font-medium">Accommodates:</span> {property.accommodates} guests
          </div>
          <div>
            <span className="font-medium">Bedrooms:</span> {property.bedrooms || 0}
          </div>
          <div>
            <span className="font-medium">Bathrooms:</span> {bathrooms}
          </div>
          <div>
            <span className="font-medium">Price:</span> ${Math.round(price)}/night
          </div>
          {cleaningFee > 0 && (
            <div>
              <span className="font-medium">Cleaning Fee:</span> ${Math.round(cleaningFee)}
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <div className="text-sm space-y-1">
          <div>{property.address.street}</div>
          {property.address.market && <div>{property.address.market}</div>}
          <div>{property.address.country}</div>
        </div>
      </div>

      {/* Host Information */}
      <div>
        <h3 className="font-semibold mb-3">Host Information</h3>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {property.host.host_picture_url ? (
              <ImageWithFallback
                src={property.host.host_picture_url}
                alt={property.host.host_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                {property.host.host_name[0]}
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{property.host.host_name}</div>
            {property.host.host_location && (
              <div className="text-sm text-muted-foreground">{property.host.host_location}</div>
            )}
            {property.host.host_is_superhost && (
              <Badge className="bg-red-500 text-white text-xs">Superhost</Badge>
            )}
          </div>
        </div>
        {property.host.host_about && (
          <p className="text-sm text-muted-foreground">{property.host.host_about}</p>
        )}
      </div>

      {/* Description */}
      {property.description && (
        <div>
          <h3 className="font-semibold mb-3">Description</h3>
          <p className="text-sm line-clamp-4">{property.description}</p>
        </div>
      )}

      {/* Amenities */}
      <div>
        <h3 className="font-semibold mb-3">Amenities ({property.amenities.length})</h3>
        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, 10).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 10 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 10} more
            </Badge>
          )}
        </div>
      </div>

      {/* Reviews Summary */}
      <div>
        <h3 className="font-semibold mb-3">Reviews</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Reviews:</span> {property.number_of_reviews}
          </div>
          {property.review_scores?.review_scores_rating && (
            <div>
              <span className="font-medium">Overall Rating:</span> {(property.review_scores.review_scores_rating / 10).toFixed(1)}/10
            </div>
          )}
        </div>
        {property.review_scores && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {property.review_scores.review_scores_accuracy && (
              <div>Accuracy: {property.review_scores.review_scores_accuracy}/10</div>
            )}
            {property.review_scores.review_scores_cleanliness && (
              <div>Cleanliness: {property.review_scores.review_scores_cleanliness}/10</div>
            )}
            {property.review_scores.review_scores_checkin && (
              <div>Check-in: {property.review_scores.review_scores_checkin}/10</div>
            )}
            {property.review_scores.review_scores_communication && (
              <div>Communication: {property.review_scores.review_scores_communication}/10</div>
            )}
            {property.review_scores.review_scores_location && (
              <div>Location: {property.review_scores.review_scores_location}/10</div>
            )}
            {property.review_scores.review_scores_value && (
              <div>Value: {property.review_scores.review_scores_value}/10</div>
            )}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {property.reviews && property.reviews.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Recent Reviews</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {property.reviews.slice(0, 3).map((review) => (
              <div key={review._id} className="border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.reviewer_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.date.$date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {review.comments}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
