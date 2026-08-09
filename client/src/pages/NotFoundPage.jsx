import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-50 text-brand-500 mb-2">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        
        <h1 className="text-6xl font-black text-gray-900 tracking-tight">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
          <p className="text-sm text-gray-500">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Go back home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;