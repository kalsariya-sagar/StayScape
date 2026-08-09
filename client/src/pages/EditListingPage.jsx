import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { Upload, X, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Beachfront',
  'Cabins',
  'Amazing Pools',
  'Iconic Cities',
  'Castles',
  'Domes',
  'Luxe',
  'Trending',
  'Tiny Homes',
];

const AMENITIES_LIST = [
  'WiFi',
  'TV',
  'Parking',
  'Air Conditioning',
  'Kitchen',
  'Washer',
  'Pool',
  'Hot tub',
];

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    country: '',
    category: 'Beachfront',
    amenities: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setFetching(true);
        const response = await listingService.getListingById(id);
        const data = response.data || response;

        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          location: data.location || '',
          city: data.city || '',
          country: data.country || '',
          category: data.category || 'Beachfront',
          amenities: data.amenities || [],
        });

        setExistingImages(data.images || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch listing details for editing.');
      } finally {
        setFetching(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleRemoveExistingImage = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
    setDeletedImages((prev) => [...prev, imageId]);
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setNewImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      setError('Please fill in all required fields.');
      return;
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      setError('Please provide at least one photo of your stay.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      if (formData.city) data.append('city', formData.city);
      if (formData.country) data.append('country', formData.country);
      data.append('category', formData.category);

      formData.amenities.forEach((amenity) => {
        data.append('amenities', amenity);
      });

      deletedImages.forEach((imageId) => {
        data.append('deletedImages', imageId);
      });

      newImages.forEach((image) => {
        data.append('images', image);
      });

      await listingService.updateListing(id, data);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Your Listing</h1>
        <p className="text-gray-500 mt-1">Update information and photos for your property.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-200 p-8 rounded-3xl shadow-sm">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Listing Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            required
          ></textarea>
        </div>

        {/* Location & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
              Full Address / Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
              Price per Night ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="1"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-gray-900 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Amenities Offered
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AMENITIES_LIST.map((amenity) => {
              const isSelected = formData.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`p-3 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image Management */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Property Photos
          </label>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Existing Photos</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {existingImages.map((img) => (
                  <div key={img._id || img.url} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={img.url} alt="Listing" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img._id)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Photos */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-gray-50/50 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Add new photos</p>
          </div>

          {/* New Photo Previews */}
          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {newImagePreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-500 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-brand-600 transition-colors shadow-md disabled:opacity-50"
        >
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditListingPage;