import { Link } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F261a98e6df434ad1ad15c1896e5c6aa3%2F634f87507ad640d694acfdc4f49aca8f?format=webp&width=200"
              alt="Potential Investment Real Estate Ltd"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-real-red font-medium transition">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-real-red font-medium transition">
              Properties
            </Link>
            <a href="#about" className="text-gray-700 hover:text-real-red font-medium transition">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-real-red font-medium transition">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+233000000000"
              className="flex items-center gap-2 text-real-dark-blue hover:text-real-red transition"
            >
              <Phone size={18} />
              <span className="text-sm font-medium">Call</span>
            </a>
            <Button
              className="bg-real-red hover:bg-real-red/90 text-white gap-2"
              onClick={() => window.open(`https://wa.me/233000000000?text=I'm interested in your properties`)}
            >
              <MessageCircle size={18} />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-real-red font-medium transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="block text-gray-700 hover:text-real-red font-medium transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <a href="#about" className="block text-gray-700 hover:text-real-red font-medium transition py-2">
              About
            </a>
            <a href="#contact" className="block text-gray-700 hover:text-real-red font-medium transition py-2">
              Contact
            </a>
            <div className="pt-2 space-y-2">
              <a
                href="tel:+233000000000"
                className="block text-real-dark-blue hover:text-real-red transition font-medium py-2"
              >
                📞 Call Us
              </a>
              <Button
                className="w-full bg-real-red hover:bg-real-red/90 text-white gap-2"
                onClick={() => window.open(`https://wa.me/233000000000?text=I'm interested in your properties`)}
              >
                <MessageCircle size={18} />
                WhatsApp
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
