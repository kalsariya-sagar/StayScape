import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import {
  Home,
  Search,
  Globe,
  Menu,
  Heart,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-brand-500 flex-shrink-0">
            <div className="bg-brand-500 text-white p-2 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight hidden sm:inline">
              StayScape
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-shadow max-w-xs sm:max-w-md w-full mx-2"
          >
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand-500 text-white p-2 rounded-full hover:bg-brand-600 transition-colors ml-2 flex-shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center space-x-3">
            <Link
              to="/listings/new"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>StayScape your home</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Dropdown User Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 border border-gray-300 rounded-full p-1.5 pl-3 hover:shadow-md transition-shadow"
              >
                <Menu className="w-4 h-4 text-gray-600" />
                <Avatar user={user} size="sm" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                        </p>
                      </div>

                      <Link
                        to={`/users/${user?._id || user?.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Wishlist</span>
                      </Link>

                      <Link
                        to="/listings/new"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium md:hidden"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Host Your Home</span>
                      </Link>

                      <hr className="my-1 border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log in</span>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-500 hover:bg-brand-50 font-semibold"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Sign up</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;