 // API service for production and preview environments
class ApiService {
  constructor() {
    // Determine the base URL based on environment
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const isProduction = process.env.NODE_ENV === 'production';
    const hostname = typeof window !== 'undefined' && window.location && window.location.hostname
      ? window.location.hostname
      : '';
    const isNetlify = hostname.includes('netlify.app') || hostname.includes('netlify.com');

    // Use environment variable if set
    // If running on Netlify (preview) or in a production build without a backend URL, use the Railway domain.
    // Otherwise (local development), default to localhost backend.
    if (backendUrl) {
      this.baseUrl = backendUrl;
    } else if (isNetlify || isProduction) {
      // Production environment - use Railway domain
      this.baseUrl = 'https://kgamesgalaxy-production.up.railway.app';
    } else {
      // Local development - default to localhost backend
      this.baseUrl = 'http://localhost:8001';
    }

    console.log('🔧 API Service initialized');
    console.log('📍 Base URL:', this.baseUrl || 'Using relative paths (proxy mode)');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🌐 Hostname:', hostname);
  }

  async makeRequest(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, timeout = 15000 } = options;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Construct full URL
      const url = this.baseUrl ? `${this.baseUrl}/api${endpoint}` : `/api${endpoint}`;

      console.log(`🌐 API Request: ${method} ${url}`);
      if (body) {
        // Avoid logging potentially sensitive full payloads in production, but helpful in dev
        try {
          const safeBodyLog = process.env.NODE_ENV === 'production' ? '[REDACTED]' : JSON.stringify(body);
          console.log('🔎 Request body:', safeBodyLog);
        } catch (e) {
          console.log('🔎 Request body: [unserializable]');
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Try to parse JSON error if possible, else fall back to text
        let errorDetail;
        try {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await response.json();
            errorDetail = JSON.stringify(json);
          } else {
            errorDetail = await response.text();
          }
        } catch (e) {
          errorDetail = '[unavailable]';
        }
        console.error(`❌ API Error: ${method} ${url} - Status ${response.status}`);
        console.error('❗ Error details:', errorDetail);
        const err = new Error(`API error (${response.status}): ${response.statusText || 'Unknown error'}`);
        err.status = response.status;
        err.details = errorDetail;
        throw err;
      }

      // Parse JSON response safely
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.warn(`⚠️ Failed to parse JSON response from ${url}`, e);
        data = null;
      }
      console.log(`✅ API Success: ${method} ${url}`, { status: response.status });
      return data;
    } catch (error) {
      // Distinguish timeout/abort from other errors
      if (error && error.name === 'AbortError') {
        console.error(`⏱️ API Timeout: ${method} ${endpoint} (${timeout}ms)`);
        throw new Error(`Request timeout after ${timeout}ms. Please check your connection.`);
      }
      // Add more context for network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(`🌐 Network error when calling ${method} ${endpoint}:`, error);
        throw new Error('Network error: Unable to reach the server. Please check your internet connection or try again later.');
      }
      console.error(`❌ API Request Failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }
}

const apiService = new ApiService();

// Booking service
export const bookingService = {
  create: async (bookingData) => {
    return await apiService.makeRequest('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  },

  getAll: async () => {
    return await apiService.makeRequest('/bookings');
  },

  getById: async (id) => {
    return await apiService.makeRequest(`/bookings/${id}`);
  },

  getByReference: async (referenceNumber) => {
    return await apiService.makeRequest(`/bookings/reference/${referenceNumber}`);
  },

  cancelByReference: async (referenceNumber) => {
    return await apiService.makeRequest(`/bookings/reference/${referenceNumber}/cancel`, {
      method: 'POST',
    });
  },

  update: async (id, data) => {
    return await apiService.makeRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  delete: async (id) => {
    return await apiService.makeRequest(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  calculatePrice: async (priceData) => {
    return await apiService.makeRequest('/bookings/calculate-price', {
      method: 'POST',
      body: priceData,
    });
  },
};

// Availability service
export const availabilityService = {
  getByDate: async (date) => {
    let dateStr = date;
    if (date instanceof Date) {
      // Format as local YYYY-MM-DD to avoid timezone shifting from toISOString()
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${d}`;
    }
    return await apiService.makeRequest(`/availability/${dateStr}`);
  },
};

// Game type service
export const gameTypeService = {
  getAll: async () => {
    return await apiService.makeRequest('/game-types');
  },
};

// Gallery service
export const galleryService = {
  getAll: async () => {
    return await apiService.makeRequest('/gallery');
  },

  create: async (imageData) => {
    return await apiService.makeRequest('/gallery', {
      method: 'POST',
      body: imageData,
    });
  },
};

// Settings service
export const settingsService = {
  get: async () => {
    return await apiService.makeRequest('/settings');
  },
};

// Convenience function for creating bookings (backward compatibility)
export const createBooking = bookingService.create;

// Export the api service instance as well
export default apiService;