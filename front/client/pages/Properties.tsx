import { Link } from "react-router-dom";
import { MapPin, Home, DollarSign, Filter, ChevronDown, ArrowRight, Bed, Bath, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { fetchProperties, Property } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Properties() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");

  // Fetch properties from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', selectedType, selectedStatus, sortBy],
    queryFn: () => fetchProperties({
      property_type: selectedType || undefined,
      status: selectedStatus || undefined,
      ordering: sortBy === 'price-low' ? 'price' : sortBy === 'price-high' ? '-price' : '-created_at'
    })
  });

  const properties = data?.results || [];

  // Log API response for debugging
  useEffect(() => {
    if (data) {
      console.log('API Response:', {
        count: data.count,
        properties: properties.length,
        firstProperty: properties[0]
      });
      
      // Log image URLs
      properties.forEach(prop => {
        console.log(`Property ${prop.id} (${prop.title}):`, {
          primary_image: prop.primary_image,
          has_image: !!prop.primary_image
        });
      });
    }
    if (error) {
      console.error('API Error:', error);
    }
  }, [data, error, properties]);

  // Format price for display
  const formatPrice = (price: string, status: string) => {
    const numPrice = parseFloat(price);
    if (status === 'rent' || status === 'rented') {
      return `$${numPrice.toLocaleString()}/mo`;
    }
    return `$${numPrice.toLocaleString()}`;
  };

  // Get property type display name
  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'house': 'House',
      'apartment': 'Apartment',
      'condo': 'Condo',
      'townhouse': 'Townhouse',
      'land': 'Land',
      'commercial': 'Commercial'
    };
    return labels[type] || type;
  };

  // Get status display name
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'sale': 'For Sale',
      'rent': 'For Rent',
      'sold': 'Sold',
      'rented': 'Rented'
    };
    return labels[status] || status;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-r from-real-dark-blue to-real-light-blue text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Our Properties</h1>
          <p className="text-gray-100">Browse our complete collection of investment opportunities</p>
          {data && (
            <p className="text-gray-200 mt-2">
              Showing {properties.length} of {data.count} properties
            </p>
          )}
        </div>
      </section>

      {/* Filters & Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col gap-6">
              {/* Property Type Filter */}
              <div>
                <div className="flex items-center gap-2 text-real-dark-blue font-semibold mb-3">
                  <Filter size={20} />
                  Filter By Type:
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedType === null
                        ? "bg-real-red text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Types
                  </button>
                  {["house", "apartment", "condo", "townhouse", "land", "commercial"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                        selectedType === type
                          ? "bg-real-red text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getPropertyTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <div className="flex items-center gap-2 text-real-dark-blue font-semibold mb-3">
                  <Filter size={20} />
                  Filter By Status:
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedStatus === null
                        ? "bg-real-red text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Status
                  </button>
                  {["sale", "rent", "sold", "rented"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                        selectedStatus === status
                          ? "bg-real-red text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <span className="text-gray-600 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-real-red transition focus:outline-none focus:ring-2 focus:ring-real-red/20"
                >
                  <option value="created_at">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-real-red"></div>
              <p className="mt-4 text-gray-600">Loading properties...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold mb-2">Failed to load properties</p>
              <p className="text-red-500 text-sm">Please make sure the backend server is running on http://localhost:8000</p>
            </div>
          )}

          {/* Properties Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Link to={`/properties/${property.id}`} key={property.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gray-200">
                      {property.primary_image ? (
                        <img
                          src={property.primary_image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Image failed to load:', {
                              url: property.primary_image,
                              property: property.title,
                              propertyId: property.id
                            });
                            // Hide broken image
                            e.currentTarget.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', {
                              url: property.primary_image,
                              property: property.title
                            });
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Home size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                        property.status === "sale" || property.status === "rent" ? "bg-real-red" : "bg-gray-500"
                      }`}>
                        {getStatusLabel(property.status)}
                      </div>
                      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                        {getPropertyTypeLabel(property.property_type)}
                      </div>
                      {property.featured && (
                        <div className="absolute bottom-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-real-dark-blue mb-2 group-hover:text-real-red transition line-clamp-2">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center justify-between gap-2 text-gray-700">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-real-red flex-shrink-0" />
                            {property.city}, {property.state}
                          </div>
                          {property.google_maps_url && (
                            <a
                              href={property.google_maps_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-real-red hover:text-real-dark-blue transition"
                              title="View on Google Maps"
                            >
                              <Map size={16} />
                            </a>
                          )}
                        </div>
                        {property.square_feet && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Home size={16} className="text-real-red flex-shrink-0" />
                            {property.square_feet.toLocaleString()} sq ft
                          </div>
                        )}
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-4 text-gray-700">
                            <div className="flex items-center gap-1">
                              <Bed size={16} className="text-real-red" />
                              <span>{property.bedrooms} bed</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath size={16} className="text-real-red" />
                              <span>{property.bathrooms} bath</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-real-red">
                            {formatPrice(property.price, property.status)}
                          </span>
                          <ArrowRight className="text-real-red group-hover:translate-x-1 transition-transform" size={20} />
                        </div>
                        
                        {/* Map Button */}
                        {property.google_maps_url && (
                          <a
                            href={property.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-real-red text-real-red hover:bg-real-red hover:text-white transition-colors gap-2"
                              size="sm"
                            >
                              <Map size={16} />
                              View on Map
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && !error && properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No properties found matching your filters.</p>
              <Button
                onClick={() => {
                  setSelectedType(null);
                  setSelectedStatus(null);
                }}
                className="mt-4 bg-real-red hover:bg-real-red/90 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-real-dark-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Didn't find what you're looking for?</h2>
          <p className="text-lg text-gray-100 mb-6">
            Contact our team for personalized property recommendations
          </p>
          <Button
            className="bg-real-red hover:bg-real-red/90 text-white px-8 py-3 text-lg gap-2"
            onClick={() => window.open(`https://wa.me/233000000000?text=I'm looking for a specific property. Can you help?`)}
          >
            Get in Touch
          </Button>
        </div>
      </section>
    </Layout>
  );
}
