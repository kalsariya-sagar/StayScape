import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, ArrowLeft, CheckCircle2, Home } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await authService.forgotPassword(email.trim());
      setMessage(res.message || 'Instructions sent to your email address.');
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
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
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your account email to receive reset instructions
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl text-center">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="text-sm font-medium">{message}</p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:underline pt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Log in</span>
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Log in</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;