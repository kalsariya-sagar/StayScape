import api from './api';

export const listingService = {
  async getAllListings(params = {}) {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  async getListingById(id) {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  async createListing(formData) {
    const response = await api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateListing(id, formData) {
    const response = await api.put(`/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteListing(id) {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
};