import api from './api';

export const reviewService = {
  async createReview(listingId, reviewData) {
    const response = await api.post(`/reviews/${listingId}`, reviewData);
    return response.data;
  },

  async deleteReview(listingId, reviewId) {
    const response = await api.delete(`/reviews/${listingId}/${reviewId}`);
    return response.data;
  },

  async getListingReviews(listingId) {
    const response = await api.get(`/reviews/${listingId}`);
    return response.data;
  },
};