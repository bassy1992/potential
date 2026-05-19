import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Home, DollarSign, Phone, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useState } from "react";

const propertyDatabase: Record<string, any> = {
  "1": {
    id: 1,
    title: "East Legon Hills Residential",
    price: "$850,000",
    contactPrice: false,
    size: "100 x 100 ft (approx 2,480 sqm)",
    location: "East Legon, Accra",
    status: "Available",
    description: "Premium residential plots in the most sought-after location with excellent road access and proximity to quality schools and shopping centers.",
    fullDescription: "Located in the heart of East Legon Hills, this exclusive residential property offers a perfect opportunity for homeowners and investors. The plot is well-developed with clear boundaries and ready for immediate construction. The neighborhood boasts excellent infrastructure, security, and a vibrant community of professionals.",
    amenities: [
      "Gated community",
      "24/7 Security",
      "Tarred roads",
      "Proximity to schools",
      "Shopping centers nearby",
      "Good drainage"
    ],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    plotSizes: [
      { size: "70 x 100 ft", price: "$580,000" },
      { size: "100 x 100 ft", price: "$850,000" },
      { size: "100 x 150 ft", price: "$1,200,000" }
    ]
  },
  "2": {
    id: 2,
    title: "Spintex Commercial Land",
    price: "$1,200,000",
    contactPrice: false,
    size: "150 x 200 ft (approx 2,787 sqm)",
    location: "Spintex, Accra",
    status: "Available",
    description: "Commercial land suitable for mixed-use development with high visibility and excellent foot traffic.",
    fullDescription: "This prime commercial land in Spintex is strategically located along a major commercial corridor. Perfect for office buildings, shopping complexes, hotels, or mixed-use developments. The property offers excellent potential for business ventures with continuous foot traffic and visibility.",
    amenities: [
      "High visibility",
      "Excellent foot traffic",
      "Tarred roads",
      "Utilities nearby",
      "Zoned for commercial use",
      "Easy access to major roads"
    ],
    images: [
      "https://images.unsplash.com/photo-1577411217556-ec69f45e42ba?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop"
    ],
    plotSizes: [
      { size: "100 x 150 ft", price: "$800,000" },
      { size: "150 x 200 ft", price: "$1,200,000" }
    ]
  },
  "3": {
    id: 3,
    title: "Tema Industrial Zone",
    price: "Contact for Price",
    contactPrice: true,
    size: "200 x 300 ft (approx 5,574 sqm)",
    location: "Tema, Greater Accra",
    status: "Available",
    description: "Large industrial land with excellent logistics access and proximity to the port.",
    fullDescription: "This expansive industrial land in Tema is ideal for manufacturing, warehousing, or logistics operations. Close proximity to Tema Port provides excellent export/import capabilities. The area is well-developed with supporting infrastructure and a strong industrial ecosystem.",
    amenities: [
      "Near Tema Port",
      "Good road network",
      "Industrial zoning",
      "Utility infrastructure",
      "24/7 Security",
      "Logistics access"
    ],
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&h=600&fit=crop"
    ],
    plotSizes: [
      { size: "Custom sizes available", price: "Contact for details" }
    ]
  },
  "4": {
    id: 4,
    title: "Cantonments Luxury Residential",
    price: "$1,500,000",
    contactPrice: false,
    size: "120 x 120 ft (approx 1,337 sqm)",
    location: "Cantonments, Accra",
    status: "Available",
    description: "Ultra-luxury residential development in the most prestigious location.",
    fullDescription: "Located in exclusive Cantonments, this luxury residential plot offers the ultimate in prestige and lifestyle. The neighborhood is home to high-net-worth individuals, foreign diplomats, and business leaders. Enjoy pristine surroundings, excellent security, and proximity to the finest restaurants and shopping.",
    amenities: [
      "Ultra-secure gated community",
      "24/7 armed security",
      "Beautifully landscaped",
      "Premium finishes",
      "Diplomatic area",
      "World-class amenities"
    ],
    images: [
      "https://images.unsplash.com/photo-1512217524528-d895f33bafa1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f5d?w=800&h=600&fit=crop"
    ],
    plotSizes: [
      { size: "100 x 100 ft", price: "$1,200,000" },
      { size: "120 x 120 ft", price: "$1,500,000" },
      { size: "150 x 150 ft", price: "$2,200,000" }
    ]
  },
  "5": {
    id: 5,
    title: "Osu Commercial Plot",
    price: "$950,000",
    contactPrice: false,
    size: "80 x 100 ft (approx 743 sqm)",
    location: "Osu, Accra",
    status: "Sold",
    description: "Perfect for boutique offices and retail spaces in bustling commercial district.",
    fullDescription: "This commercial plot in vibrant Osu is perfect for boutique offices, galleries, retail shops, or restaurants. The area is known for its trendy atmosphere, quality businesses, and cosmopolitan crowd.",
    amenities: [
      "Prime business location",
      "High foot traffic",
      "Diverse business ecosystem",
      "Parking available",
      "Good road access"
    ],
    images: [
      "https://images.unsplash.com/photo-1486634046266-53cb14faf2a2?w=800&h=600&fit=crop"
    ],
    plotSizes: []
  },
  "6": {
    id: 6,
    title: "West Hills Agricultural Land",
    price: "$350,000",
    contactPrice: false,
    size: "500 x 500 ft (approx 23,094 sqm)",
    location: "Weija, Accra",
    status: "Available",
    description: "Large agricultural land for farming, agribusiness, or eco-tourism projects.",
    fullDescription: "This substantial agricultural land in Weija is perfect for crop farming, livestock raising, agro-processing, or eco-tourism ventures. The land is fertile, well-watered, and suitable for various agricultural activities.",
    amenities: [
      "Fertile soil",
      "Water access",
      "Good drainage",
      "Low land value",
      "Agricultural zoning",
      "Peaceful setting"
    ],
    images: [
      "https://images.unsplash.com/photo-1498066882519-e8cccb2a1b7e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop"
    ],
    plotSizes: [
      { size: "500 x 500 ft", price: "$350,000" },
      { size: "1000 x 1000 ft", price: "$1,350,000" }
    ]
  }
};

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const property = propertyDatabase[id || ""];

  if (!property) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-real-dark-blue mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

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
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => {
                  setLightboxOpen(true);
                  setLightboxIndex(currentImageIndex);
                }}
              />
              {property.images.length > 1 && (
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
                </>
              )}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? "border-real-red" : "border-gray-300"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h1 className="text-3xl font-bold text-real-dark-blue mb-2">{property.title}</h1>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-4 ${
              property.status === "Available" ? "bg-real-red" : "bg-gray-500"
            }`}>
              {property.status}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-real-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-semibold text-gray-800">{property.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Home className="text-real-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">Size</p>
                  <p className="font-semibold text-gray-800">{property.size}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="text-real-red flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-gray-600 text-sm">Price</p>
                  <p className="font-bold text-real-red text-2xl">{property.price}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-real-red hover:bg-real-red/90 text-white py-6 text-lg gap-2"
                onClick={() => window.open(`https://wa.me/233000000000?text=I'm interested in ${property.title}`)}
              >
                <MessageCircle size={20} />
                WhatsApp Now
              </Button>
              <a
                href="tel:+233000000000"
                className="block w-full bg-real-dark-blue hover:bg-real-dark-blue/90 text-white py-3 rounded-lg font-semibold text-center transition gap-2 flex items-center justify-center"
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
            {/* Description */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-real-dark-blue mb-4">About This Property</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {property.fullDescription}
              </p>

              {/* Amenities */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-real-dark-blue mb-4">Features & Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-real-red rounded-full flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Plot Sizes & Pricing */}
            {property.plotSizes.length > 0 && property.status === "Available" && (
              <div className="bg-white p-8 rounded-lg shadow-lg h-fit">
                <h3 className="text-2xl font-bold text-real-dark-blue mb-4">Available Plot Sizes</h3>
                <div className="space-y-3">
                  {property.plotSizes.map((plot, idx) => (
                    <div key={idx} className="p-4 border border-gray-300 rounded-lg hover:border-real-red transition">
                      <p className="font-semibold text-gray-800 mb-1">{plot.size}</p>
                      <p className="text-real-red font-bold text-lg">{plot.price}</p>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-6 bg-real-red hover:bg-real-red/90 text-white py-3 text-lg"
                  onClick={() => window.open(`https://wa.me/233000000000?text=I'm interested in the ${property.title} - specifically the available plot sizes`)}
                >
                  Inquire About Sizes
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-4xl">
            <img
              src={property.images[lightboxIndex]}
              alt="Lightbox"
              className="w-full h-auto max-h-[80vh] object-contain"
            />

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
              {lightboxIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Similar Properties */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-real-dark-blue mb-8">Explore More Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(propertyDatabase)
              .slice(0, 3)
              .map(([key, prop]) => (
                <Link to={`/properties/${key}`} key={key}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group cursor-pointer">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-800 mb-2 group-hover:text-real-red transition line-clamp-2">
                        {prop.title}
                      </h3>
                      <p className="text-real-red font-bold text-lg">{prop.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
