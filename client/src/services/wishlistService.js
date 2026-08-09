import API from './api';

export const wishlistService = {
  /**
   * Fetch all saved listings in the authenticated user's wishlist
   */
  async getWishlist() {
    const response = await API.get('/wishlist');
    return response.data;
  },

  /**
   * Add a listing to the authenticated user's wishlist
   * @param {string} listingId - ID of the listing to save
   */
  async addToWishlist(listingId) {
    const response = await API.post(`/wishlist/${listingId}`);
    return response.data;
  },

  /**
   * Remove a listing from the authenticated user's wishlist
   * @param {string} listingId - ID of the listing to remove
   */
  async removeFromWishlist(listingId) {
    const response = await API.delete(`/wishlist/${listingId}`);
    return response.data;
  },
};