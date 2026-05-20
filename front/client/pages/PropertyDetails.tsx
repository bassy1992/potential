import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Home,
  DollarSign,
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  Bed,
  Bath,
  Car,
  Waves,
  Trees,
  Calendar,
  Maximize,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPropertyById, fetchProperties, Property } from "@/lib/api";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch the property from the API
  const {
    data: property,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchPropertyById(Number(id)),
    enabled: !!id,
  });

  // Fetch similar properties for the bottom section
  const { data: similarData } = useQuery({
    queryKey: ["similarProperties"],
    queryFn: () => fetchProperties({ page: 1 }),
  });
  const similarProperties = (similarData?.results || [])
    .filter((p) => p.id !== Number(id))
    .slice(0, 3);

  // Format price
  const formatPrice = (price: string, status: string) => {
    const numPrice = parseFloat(price);
    if (status === "rent" || status === "rented") {
      return `$${numPrice.toLocaleString()}/mo`;
    }
    return `$${numPrice.toLocaleString()}`;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sale: "For Sale",
      rent: "For Rent",
      sold: "Sold",
      rented: "Rented",
    };
    return labels[status] || status;
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      house: "House",
      apartment: "Apartment",
      condo: "Condo",
      townhouse: "Townhouse",
      land: "Land",
      commercial: "Commercial",
    };
    return labels[type] || type;
  };

  // Collect all image URLs from the property
  const images: string[] =
    property?.images && property.images.length > 0
      ? property.images.map((img) => img.image)
      : property?.primary_image
      ? [property.primary_image]
      : [];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextLightboxImage = () =>
    setLightboxIndex((prev) => (prev + 1) % images.length);
  const prevLightboxImage = () =>
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-real-red mb-4" />
            <p className="text-gray-600">Loading property...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error / not found state ────────────────────────────────────────────────
  if (error || !property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-real-dark-blue mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you're looking for doesn't exist or could not be
              loaded.
            </p>
            <Link to="/properties">
              <Button className="bg-real-red hover:bg-real-red/90 text-white gap-2">
                <ArrowLeft size={18} />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isAvailable =
    property.status === "sale" || property.status === "rent";

  return (
    <Layout>
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate("/properties")}
          className="flex items-center gap-2 text-real-red hover:text-real-dark-blue transition font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </button>
      </div>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden h-96 lg:h-[500px]">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setLightboxOpen(true);
                    setLightboxIndex(currentImageIndex);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Home size={64} className="text-gray-400" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}

              {/* Status badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                  isAvailable ? "bg-real-red" : "bg-gray-500"
                }`}
              >
                {getStatusLabel(property.status)}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex
                        ? "border-real-red"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {getPropertyTypeLabel(property.property_type)}
              </span>
              {property.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-real-dark-blue mb-4">
              {property.title}
            </h1>

            {/* Key details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-real-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-semibold text-gray-800">
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign
                  className="text-real-red flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="text-gray-600 text-sm">Price</p>
                  <p className="font-bold text-real-red text-2xl">
                    {formatPrice(property.price, property.status)}
                  </p>
                </div>
              </div>

              {property.square_feet && (
                <div className="flex items-start gap-3">
                  <Maximize
                    className="text-real-red flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="text-gray-600 text-sm">Size</p>
                    <p className="font-semibold text-gray-800">
                      {property.square_feet.toLocaleString()} sq ft
                    </p>
                  </div>
                </div>
              )}

              {property.year_built && (
                <div className="flex items-start gap-3">
                  <Calendar
                    className="text-real-red flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="text-gray-600 text-sm">Year Built</p>
                    <p className="font-semibold text-gray-800">
                      {property.year_built}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Beds / Baths */}
            {(property.bedrooms > 0 || property.bathrooms > 0) && (
              <div className="flex gap-4 mb-6 p-3 bg-white rounded-lg">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bed size={18} className="text-real-red" />
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span className="text-sm text-gray-500">Beds</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bath size={18} className="text-real-red" />
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span className="text-sm text-gray-500">Baths</span>
                  </div>
                )}
                {property.parking_spaces > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Car size={18} className="text-real-red" />
                    <span className="font-semibold">
                      {property.parking_spaces}
                    </span>
                    <span className="text-sm text-gray-500">Parking</span>
                  </div>
                )}
              </div>
            )}

            {/* Map link */}
            {property.google_maps_url && (
              <a
                href={property.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <Button
                  variant="outline"
                  className="w-full border-real-red text-real-red hover:bg-real-red hover:text-white transition-colors gap-2"
                >
                  <Map size={16} />
                  View on Google Maps
                </Button>
              </a>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-real-red hover:bg-real-red/90 text-white py-6 text-lg gap-2"
                onClick={() =>
                  window.open(
                    `https://wa.me/233000000000?text=I'm interested in ${property.title}`
                  )
                }
              >
                <MessageCircle size={20} />
                WhatsApp Now
              </Button>
              <a
                href="tel:+233000000000"
                className="flex items-center justify-center gap-2 w-full bg-real-dark-blue hover:bg-real-dark-blue/90 text-white py-3 rounded-lg font-semibold text-center transition"
              >
                <Phone size={20} />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description & Features */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-real-dark-blue mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {property.description}
              </p>

              {/* Features */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-real-dark-blue mb-4">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.has_garage && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car size={18} className="text-real-red flex-shrink-0" />
                      <span className="text-gray-700">Garage</span>
                    </div>
                  )}
                  {property.has_pool && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Waves
                        size={18}
                        className="text-real-red flex-shrink-0"
                      />
                      <span className="text-gray-700">Swimming Pool</span>
                    </div>
                  )}
                  {property.has_garden && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Trees
                        size={18}
                        className="text-real-red flex-shrink-0"
                      />
                      <span className="text-gray-700">Garden</span>
                    </div>
                  )}
                  {property.lot_size && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Maximize
                        size={18}
                        className="text-real-red flex-shrink-0"
                      />
                      <span className="text-gray-700">
                        Lot: {property.lot_size.toLocaleString()} sq ft
                      </span>
                    </div>
                  )}
                  {property.parking_spaces > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Car size={18} className="text-real-red flex-shrink-0" />
                      <span className="text-gray-700">
                        {property.parking_spaces} Parking Space
                        {property.parking_spaces > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* No features fallback */}
                {!property.has_garage &&
                  !property.has_pool &&
                  !property.has_garden &&
                  !property.lot_size &&
                  property.parking_spaces === 0 && (
                    <p className="text-gray-500 italic">
                      No additional features listed.
                    </p>
                  )}
              </div>
            </div>

            {/* Property Details Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg h-fit">
              <h3 className="text-2xl font-bold text-real-dark-blue mb-4">
                Property Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold capitalize">
                    {getPropertyTypeLabel(property.property_type)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`font-semibold ${
                      isAvailable ? "text-real-red" : "text-gray-500"
                    }`}
                  >
                    {getStatusLabel(property.status)}
                  </span>
                </div>
                {property.bedrooms > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Bedrooms</span>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Bathrooms</span>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Area</span>
                    <span className="font-semibold">
                      {property.square_feet.toLocaleString()} sq ft
                    </span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Year Built</span>
                    <span className="font-semibold">{property.year_built}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Country</span>
                  <span className="font-semibold">{property.country}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">ZIP Code</span>
                  <span className="font-semibold">{property.zip_code}</span>
                </div>
              </div>

              {isAvailable && (
                <Button
                  className="w-full mt-6 bg-real-red hover:bg-real-red/90 text-white py-3 text-lg"
                  onClick={() =>
                    window.open(
                      `https://wa.me/233000000000?text=I'm interested in ${property.title} — please send more details`
                    )
                  }
                >
                  Inquire Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-4xl">
            <img
              src={images[lightboxIndex]}
              alt="Lightbox"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextLightboxImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition"
                >
                  <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {lightboxIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-real-dark-blue mb-8">
              Explore More Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <Link to={`/properties/${prop.id}`} key={prop.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group cursor-pointer">
                    <div className="relative h-40 overflow-hidden bg-gray-200">
                      {prop.primary_image ? (
                        <img
                          src={prop.primary_image}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <Home size={40} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 mb-1 group-hover:text-real-red transition line-clamp-2">
                        {prop.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {prop.city}, {prop.state}
                      </p>
                      <p className="text-real-red font-bold text-lg mt-auto">
                        {formatPrice(prop.price, prop.status)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
