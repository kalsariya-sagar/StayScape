import API from './api';

export const userService = {
  /**
   * Fetch public user profile along with hosted listings by user ID
   * @param {string} userId - User ID
   */
  async getUserProfile(userId) {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Update profile information for current user
   * @param {Object} userData - Updated user profile fields (firstName, lastName, bio, etc.)
   */
  async updateUserProfile(userData) {
    const response = await API.put('/users/profile', userData);
    return response.data;
  },

  /**
   * Upload or update profile avatar image
   * @param {FormData} formData - Multipart form data containing the 'avatar' image file
   */
  async updateUserAvatar(formData) {
    const response = await API.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};