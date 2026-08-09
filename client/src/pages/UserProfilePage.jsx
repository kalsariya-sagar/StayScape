import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import ListingGrid from '../components/listings/ListingGrid';
import Avatar from '../components/common/Avatar';
import { Mail, Calendar, ShieldCheck, Home } from 'lucide-react';

const UserProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [hostedListings, setHostedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  const isSelf =
    currentUser && (currentUser._id === id || currentUser.id === id);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await userService.getUserProfile(id);
      const userData = data.data?.user || data.data || data;
      const listingsData = data.data?.listings || data.listings || [];

      setProfile(userData);
      setHostedListings(listingsData);

      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setBio(userData.bio || '');
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err.message || 'Failed to load user profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      await userService.updateUserProfile({
        firstName,
        lastName,
        bio,
      });

      await refreshUser();
      await fetchUserProfile();
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-8">
        <div className="flex gap-8 items-center">
          <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || 'User profile not found'}
        </h2>
        <Link to="/" className="text-brand-500 font-semibold hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  const fullName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ''}`
    : profile.username;

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Sidebar Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm sticky top-28">
            <div className="flex flex-col items-center text-center">
              <Avatar user={profile} size="xl" className="mb-4" />

              <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
              <p className="text-sm text-gray-500">@{profile.username}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 w-full space-y-2 text-left text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Identity Verified</span>
                </div>
                {joinedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined {joinedDate}</span>
                  </div>
                )}
                {profile.email && isSelf && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
              </div>

              {isSelf && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full border border-gray-300 rounded-xl py-2.5 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-2 space-y-10">
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="bg-white border border-gray-200 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Edit Your Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                  About You / Bio
                </label>
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a little bit about yourself, travel preferences, or hosting style..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-brand-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border border-gray-200/80 p-6 rounded-3xl">
              <h2 className="text-xl font-bold text-gray-900 mb-2">About {fullName}</h2>
              <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">
                {profile.bio || 'No bio details provided yet.'}
              </p>
            </div>
          )}

          {/* Hosted Listings Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Home className="w-6 h-6 text-brand-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {fullName}'s Listings
                </h2>
              </div>
              {isSelf && (
                <Link
                  to="/listings/new"
                  className="text-sm font-semibold text-brand-500 hover:underline"
                >
                  + Add New Listing
                </Link>
              )}
            </div>

            <ListingGrid listings={hostedListings} loading={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;