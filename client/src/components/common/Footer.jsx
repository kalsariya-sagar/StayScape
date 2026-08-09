import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full block relative z-10 bg-gray-50 border-t border-gray-200 mt-auto py-12 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 text-brand-500">
              <div className="bg-brand-500 text-white p-1.5 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">StayScape</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              Find unique vacation rentals, cabins, beachfront villas, and luxury stays around the world.
            </p>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
            </ul>
          </div>

          {/* Hosting Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Hosting</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/listings/new" className="hover:underline">StayScape your home</Link></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
            </ul>
          </div>

          {/* StayScape Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">StayScape</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} StayScape, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;