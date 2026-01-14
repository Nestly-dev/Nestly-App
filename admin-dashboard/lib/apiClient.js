// Enhanced API client with authentication and hotel-specific requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Token management
export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('hotel_data');
    }
  },

  getUserData: () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user_data');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  setUserData: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(data));
    }
  },

  getHotelData: () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('hotel_data');
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  setHotelData: (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hotel_data', JSON.stringify(data));
    }
  },
};

// Helper function to handle API responses
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorData = {};

    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => '');
      errorData = { message: text };
    }

    // If unauthorized, clear tokens
    if (response.status === 401) {
      tokenManager.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }

    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

// Generic API request function with authentication
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = tokenManager.getToken();

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
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
export const apiClient = {
  // ============ AUTHENTICATION ============
  auth: {
    login: async (credentials) => {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });


      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;

      // Store token and user data
      if (token) {
        tokenManager.setToken(token);
      }
      if (user) {
        tokenManager.setUserData(user);
      }

      return { token, user, ...response };
    },

    logout: async () => {
      try {
        await apiRequest('/auth/logout', {
          method: 'POST',
        });
      } finally {
        tokenManager.removeToken();
      }
    },

    forgotPassword: (email) => apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

    resetPassword: (token, password) => apiRequest(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  },

  // ============ HOTEL AUTHENTICATION (ID-based) ============
  hotelAuth: {
    login: async (hotel_id, password) => {
      const response = await apiRequest('/hotel-auth/login', {
        method: 'POST',
        body: JSON.stringify({ hotel_id, password }),
      });

      // Backend returns { success, status, message, data: { token, hotel } }
      const token = response.data?.token || response.token;
      const hotel = response.data?.hotel || response.hotel;

      // Store token and hotel data
      if (token) {
        tokenManager.setToken(token);
      }
      if (hotel) {
        tokenManager.setHotelData(hotel);
        // Also set as user data for compatibility
        tokenManager.setUserData({
          id: hotel.id,
          username: hotel.name,
          email: hotel.email,
          role: 'hotel',
        });
      }

      return { token, hotel, ...response };
    },

    setPassword: (hotel_id, new_password) => apiRequest('/hotel-auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ hotel_id, new_password }),
    }),

    getMe: () => apiRequest('/hotel-auth/me'),
  },

  // ============ HOTELS ============
  hotels: {
    getAll: () => apiRequest('/hotels/all-hotels'),

    getProfile: (hotelId) => apiRequest(`/hotels/profile/${hotelId}`),

    register: (data) => apiRequest('/hotels/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, data) => apiRequest(`/hotels/update/${hotelId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (hotelId) => apiRequest(`/hotels/delete/${hotelId}`, {
      method: 'DELETE',
    }),

    // Get hotels managed by current user
    getMyHotels: async () => {
      const userData = tokenManager.getUserData();
      if (!userData || !userData.id) {
        throw new Error('User not authenticated');
      }

      // Get all hotels and filter by hotel manager
      const allHotels = await apiRequest('/hotels/all-hotels');
      return allHotels;
    },
  },

  // ============ ROOMS ============
  rooms: {
    getAll: (hotelId) => apiRequest(`/hotels/rooms/${hotelId}`),

    getById: (hotelId, roomTypeId) => apiRequest(`/hotels/rooms/${hotelId}/${roomTypeId}`),

    create: (hotelId, data) => apiRequest(`/hotels/rooms/register/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, roomTypeId, data) => apiRequest(`/hotels/rooms/update/${hotelId}/${roomTypeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (hotelId, roomTypeId) => apiRequest(`/hotels/rooms/delete/${hotelId}/${roomTypeId}`, {
      method: 'DELETE',
    }),
  },

  // ============ BOOKINGS ============
  bookings: {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/hotels/booking${queryString ? '?' + queryString : ''}`);
    },

    getByHotel: (hotelId) => apiRequest(`/hotels/booking?hotel_id=${hotelId}`),

    getById: (bookingId) => apiRequest(`/hotels/booking/${bookingId}`),

    create: (hotelId, data) => apiRequest(`/hotels/booking/create/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (bookingId, data) => apiRequest(`/hotels/booking/update/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    cancel: (bookingId) => apiRequest(`/hotels/booking/cancel/${bookingId}`, {
      method: 'PATCH',
    }),

    verifyPayment: (bookingId) => apiRequest(`/hotels/booking/${bookingId}/verify-payment`),
  },

  // ============ REVIEWS ============
  reviews: {
    getByHotel: (hotelId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiRequest(`/hotels/reviews/${hotelId}${queryString ? '?' + queryString : ''}`);
    },

    create: (hotelId, data) => apiRequest(`/hotels/reviews/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, reviewId, data) => apiRequest(`/hotels/reviews/${hotelId}/${reviewId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (hotelId, reviewId) => apiRequest(`/hotels/reviews/${hotelId}/${reviewId}`, {
      method: 'DELETE',
    }),
  },

  // ============ MEDIA ============
  media: {
    getByHotel: (hotelId) => apiRequest(`/hotels/Media/${hotelId}`),

    upload: async (hotelId, formData) => {
      const token = tokenManager.getToken();
      const url = `${API_BASE_URL}/hotels/Media/${hotelId}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData for file upload
      });

      return handleResponse(response);
    },

    delete: (hotelId, mediaId) => apiRequest(`/hotels/Media/${hotelId}/${mediaId}`, {
      method: 'DELETE',
    }),
  },

  // ============ AVAILABILITY & PRICING ============
  availability: {
    get: (hotelId) => apiRequest(`/hotels/availability/${hotelId}`),

    create: (hotelId, data) => apiRequest(`/hotels/availability/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, data) => apiRequest(`/hotels/availability/${hotelId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  },

  priceModifiers: {
    get: (hotelId) => apiRequest(`/hotels/discounts/${hotelId}`),

    create: (hotelId, data) => apiRequest(`/hotels/discounts/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, modifierId, data) => apiRequest(`/hotels/discounts/${hotelId}/${modifierId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (hotelId, modifierId) => apiRequest(`/hotels/discounts/${hotelId}/${modifierId}`, {
      method: 'DELETE',
    }),
  },

  // ============ POSTS ============
  posts: {
    getByHotel: (hotelId) => apiRequest(`/hotels/posts/${hotelId}`),

    create: (hotelId, data) => apiRequest(`/hotels/posts/${hotelId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (hotelId, postId, data) => apiRequest(`/hotels/posts/${hotelId}/${postId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (hotelId, postId) => apiRequest(`/hotels/posts/${hotelId}/${postId}`, {
      method: 'DELETE',
    }),
  },

  // ============ VIDEOS ============
  videos: {
    getAll: () => apiRequest('/content/videos'),

    getById: (videoId) => apiRequest(`/content/videos/${videoId}`),

    create: (data) => apiRequest('/content/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (videoId, data) => apiRequest(`/content/videos/${videoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

    delete: (videoId) => apiRequest(`/content/videos/${videoId}`, {
      method: 'DELETE',
    }),

    like: (videoId) => apiRequest(`/content/videos/${videoId}/like`, {
      method: 'POST',
    }),

    save: (videoId) => apiRequest(`/content/videos/${videoId}/save`, {
      method: 'POST',
    }),
  },

  // ============ PROFILE ============
  profile: {
    get: () => apiRequest('/profile'),

    update: (data) => apiRequest('/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  },

  // ============ COMPLAINTS ============
  complaints: {
    getAll: () => apiRequest('/complaints'),

    create: (data) => apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  // ============ ANALYTICS ============
  analytics: {
    // Get comprehensive hotel analytics
    getHotelAnalytics: async (hotelId) => {
      try {
        const [bookings, reviews, media, rooms] = await Promise.all([
          apiRequest(`/hotels/booking?hotel_id=${hotelId}`),
          apiRequest(`/hotels/reviews/${hotelId}`),
          apiRequest(`/hotels/Media/${hotelId}`),
          apiRequest(`/hotels/rooms/${hotelId}`),
        ]);

        // Calculate analytics
        const totalBookings = Array.isArray(bookings) ? bookings.length : 0;
        const totalRevenue = Array.isArray(bookings)
          ? bookings.reduce((sum, booking) => sum + (booking.total_price || 0), 0)
          : 0;

        const activeCustomers = Array.isArray(bookings)
          ? new Set(bookings.map(b => b.user_id)).size
          : 0;

        const mediaViews = Array.isArray(media)
          ? media.reduce((sum, item) => sum + (item.view_count || 0), 0)
          : 0;

        const averageRating = Array.isArray(reviews) && reviews.length > 0
          ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
          : 0;

        return {
          totalBookings,
          totalRevenue,
          activeCustomers,
          mediaViews,
          averageRating,
          totalReviews: Array.isArray(reviews) ? reviews.length : 0,
          totalRooms: Array.isArray(rooms) ? rooms.length : 0,
          bookings: bookings || [],
          reviews: reviews || [],
          media: media || [],
          rooms: rooms || [],
        };
      } catch (error) {
        console.error('Error fetching hotel analytics:', error);
        return {
          totalBookings: 0,
          totalRevenue: 0,
          activeCustomers: 0,
          mediaViews: 0,
          averageRating: 0,
          totalReviews: 0,
          totalRooms: 0,
          bookings: [],
          reviews: [],
          media: [],
          rooms: [],
        };
      }
    },

    // Get booking trends over time
    getBookingTrends: async (hotelId, days = 30) => {
      try {
        const bookings = await apiRequest(`/hotels/booking?hotel_id=${hotelId}`);

        if (!Array.isArray(bookings)) return [];

        const now = new Date();
        const trends = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const dayBookings = bookings.filter(b => {
            const bookingDate = new Date(b.created_at).toISOString().split('T')[0];
            return bookingDate === dateStr;
          });

          const revenue = dayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

          trends.push({
            date: dateStr,
            bookings: dayBookings.length,
            revenue: revenue,
          });
        }

        return trends;
      } catch (error) {
        console.error('Error fetching booking trends:', error);
        return [];
      }
    },
  },

  // Export API_BASE_URL for use in components
  API_BASE_URL,
};

export { ApiError, API_BASE_URL };
