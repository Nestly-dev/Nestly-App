// API utility for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error',
      0,
      { originalError: error }
    );
  }
}

// API methods for different resources
export const api = {
  // Hotels
  getHotels: (params = {}) => apiRequest('/hotels', { params }),
  getHotel: (id) => apiRequest(`/hotels/${id}`),
  updateHotel: (id, data) => apiRequest(`/hotels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Rooms
  getRooms: (params = {}) => apiRequest('/hotels/rooms', { params }),
  getRoom: (id) => apiRequest(`/hotels/rooms/${id}`),
  createRoom: (data) => apiRequest('/hotels/rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRoom: (id, data) => apiRequest(`/hotels/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRoom: (id) => apiRequest(`/hotels/rooms/${id}`, {
    method: 'DELETE',
  }),

  // Bookings
  getBookings: (params = {}) => apiRequest('/hotel/booking', { params }),
  getBooking: (id) => apiRequest(`/hotel/booking/${id}`),
  createBooking: (data) => apiRequest('/hotel/booking', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateBooking: (id, data) => apiRequest(`/hotel/booking/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteBooking: (id) => apiRequest(`/hotel/booking/${id}`, {
    method: 'DELETE',
  }),

  // Reviews
  getReviews: (params = {}) => apiRequest('/hotel/user-reviews', { params }),
  getReview: (id) => apiRequest(`/hotel/user-reviews/${id}`),
  createReview: (data) => apiRequest('/hotel/user-reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateReview: (id, data) => apiRequest(`/hotel/user-reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteReview: (id) => apiRequest(`/hotel/user-reviews/${id}`, {
    method: 'DELETE',
  }),

  // Media
  getMedia: (params = {}) => apiRequest('/hotel/media', { params }),
  getMediaItem: (id) => apiRequest(`/hotel/media/${id}`),
  uploadMedia: (data) => apiRequest('/hotel/media', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMedia: (id, data) => apiRequest(`/hotel/media/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMedia: (id) => apiRequest(`/hotel/media/${id}`, {
    method: 'DELETE',
  }),

  // Pricing
  getPricing: (params = {}) => apiRequest('/hotels/pricing-availability', { params }),
  updatePricing: (id, data) => apiRequest(`/hotels/pricing-availability/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Complaints
  getComplaints: (params = {}) => apiRequest('/client/complaints', { params }),
  getComplaint: (id) => apiRequest(`/client/complaints/${id}`),
  createComplaint: (data) => apiRequest('/client/complaints', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateComplaint: (id, data) => apiRequest(`/client/complaints/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Profile
  getProfile: () => apiRequest('/profile'),
  updateProfile: (data) => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Auth
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
};

export { ApiError }; 