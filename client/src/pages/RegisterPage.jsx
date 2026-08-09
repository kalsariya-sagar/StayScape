import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Home } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-500 mb-2">
            <div className="bg-brand-500 text-white p-2 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">StayScape</span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Join StayScape to book unique stays and host your space
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-md disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
          </button>
        </form>

        {/* Footer Redirect */}
        <div className="text-center pt-4 border-t border-gray-100 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;