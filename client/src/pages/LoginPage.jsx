import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Home } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login({ usernameOrEmail, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-500 mb-2">
            <div className="bg-brand-500 text-white p-2 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">StayScape</span>
          </Link>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your StayScape account</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="usernameOrEmail"
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-xs font-semibold uppercase text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-md disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;