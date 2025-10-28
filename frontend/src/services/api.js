// Enhanced API service - simplified for preview environment
class ApiService {
  constructor() {
    // In preview environment, all API calls go through the same domain
    this.baseUrl = '';  // Relative URLs - preview automatically proxies /api to backend
  }

  async makeRequest(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, timeout = 15000 } = options;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`/api${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error (${response.status}): ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${method} /api${endpoint}`, error);
      throw error;
    }
  }
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log(`API request successful via fallback URL: ${this.fallbackUrl}`);
      return await response.json();
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
  }
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
  }
};

// Game type service
export const gameTypeService = {
  getAll: async () => {
    return await apiService.makeRequest('/game-types');
  }
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
  }
};

// Settings service
export const settingsService = {
  get: async () => {
    return await apiService.makeRequest('/settings');
  }
};

// Convenience function for creating bookings (backward compatibility)
export const createBooking = bookingService.create;

// Export the api service instance as well
export default apiService;