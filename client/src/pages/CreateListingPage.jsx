import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../services/listingService';
import { Upload, X, Home, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';

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

const CreateListingPage = () => {
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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      setError('Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image of your stay.');
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

      images.forEach((image) => {
        data.append('images', image);
      });

      const response = await listingService.createListing(data);
      const createdListing = response.data || response;
      navigate(`/listings/${createdListing._id || createdListing.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create listing. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">StayScape Your Home</h1>
        <p className="text-gray-500 mt-1">
          Share your space with travelers from around the world.
        </p>
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
            placeholder="e.g. Cozy Beachfront Cottage with Panoramic Ocean Views"
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
            placeholder="Describe what makes your stay special..."
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
              placeholder="e.g. 123 Ocean Drive, Malibu, CA"
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
              placeholder="e.g. 150"
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
              placeholder="e.g. Malibu"
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
              placeholder="e.g. United States"
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Upload Property Photos *
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-gray-50/50 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, or WEBP up to 5MB each</p>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
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
          {loading ? 'Creating Listing...' : 'Publish Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;