import { Link } from "react-router-dom";
import { ArrowRight, MapPin, DollarSign, Home, Users, Award, TrendingUp, Bed, Bath, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProperties } from "@/lib/api";

const stats = [
  { icon: Home, label: "Properties", value: "150+" },
  { icon: Users, label: "Happy Clients", value: "500+" },
  { icon: Award, label: "Years Experience", value: "8+" },
  { icon: TrendingUp, label: "Growth Rate", value: "40% YoY" }
];

export default function Index() {
  // Fetch featured properties from API
  const { data: featuredProperties = [], isLoading } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: fetchFeaturedProperties
  });

  // Format price for display
  const formatPrice = (price: string, status: string) => {
    const numPrice = parseFloat(price);
    if (status === 'rent' || status === 'rented') {
      return `$${numPrice.toLocaleString()}/mo`;
    }
    return `$${numPrice.toLocaleString()}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-real-dark-blue via-real-light-blue to-real-dark-blue text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-real-red rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-real-sage rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect Real Estate Investment
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
              Discover premium land and properties across Ghana's fastest-growing locations. Expert guidance for your investment journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/properties">
                <Button className="bg-real-red hover:bg-real-red/90 text-white px-8 py-6 text-lg gap-2 w-full sm:w-auto">
                  Explore Properties <ArrowRight size={20} />
                </Button>
              </Link>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-real-dark-blue px-8 py-6 text-lg w-full sm:w-auto">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <Icon className="text-real-red" size={32} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-real-dark-blue mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-real-dark-blue mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">Handpicked investments ready for you</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-real-red"></div>
              <p className="mt-4 text-gray-600">Loading featured properties...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredProperties.slice(0, 3).map((property) => (
                <Link to={`/properties/${property.id}`} key={property.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group cursor-pointer">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {property.primary_image ? (
                        <img
                          src={property.primary_image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Home size={48} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-real-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {property.status === 'sale' ? 'For Sale' : property.status === 'rent' ? 'For Rent' : property.status}
                      </div>
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
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} className="text-real-red" />
                          {property.city}, {property.state}
                        </div>
                        {property.square_feet && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Home size={16} className="text-real-red" />
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

          <div className="text-center">
            <Link to="/properties">
              <Button className="bg-real-dark-blue hover:bg-real-dark-blue/90 text-white px-8 py-3 text-lg gap-2">
                View All Properties <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-real-dark-blue mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-real-red rounded-lg flex items-center justify-center mb-4">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-real-dark-blue mb-3">Expert Team</h3>
              <p className="text-gray-600">
                Experienced professionals with deep market knowledge and proven track record in real estate investments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-real-red rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-real-dark-blue mb-3">Best ROI</h3>
              <p className="text-gray-600">
                Strategic locations selected for maximum appreciation and rental yield potential over time.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-real-red rounded-lg flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-real-dark-blue mb-3">Client Support</h3>
              <p className="text-gray-600">
                Comprehensive support from property selection through legal documentation and handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-real-dark-blue text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Invest?</h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Get in touch with our team today and start your journey towards building wealth through real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-real-red hover:bg-real-red/90 text-white px-8 py-6 text-lg gap-2"
              onClick={() => window.open(`https://wa.me/233000000000?text=I'm interested in your properties`)}
            >
              Message on WhatsApp
            </Button>
            <a
              href="tel:+233000000000"
              className="inline-flex items-center justify-center px-8 py-6 bg-white text-real-dark-blue font-semibold rounded-lg hover:bg-gray-100 transition text-lg gap-2"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
