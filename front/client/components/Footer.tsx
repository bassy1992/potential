import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-real-dark-blue text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">POTENTIAL INVESTMENT</h3>
            <p className="text-gray-300 text-sm mb-4">
              Premium real estate investment opportunities in prime locations.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-real-red transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-real-red transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-real-red transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-real-red transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-real-red transition">
                  Properties
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-real-red transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-real-red transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-real-red transition">
                  Property Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-real-red transition">
                  Valuation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-real-red transition">
                  Investment Consultation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-real-red transition">
                  Legal Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={18} className="flex-shrink-0 mt-0.5" />
                <a href="tel:+233000000000" className="hover:text-real-red transition">
                  +233 (0) 000 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={18} className="flex-shrink-0 mt-0.5" />
                <a href="mailto:info@potential.com" className="hover:text-real-red transition">
                  info@potential.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-real-light-blue pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              &copy; 2024 Potential Investment Real Estate Ltd. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0 text-sm text-gray-300">
              <a href="#" className="hover:text-real-red transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-real-red transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
