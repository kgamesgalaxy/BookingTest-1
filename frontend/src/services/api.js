// Enhanced API service with fallback mechanism
class ApiService {
  constructor() {
    this.primaryUrl = process.env.REACT_APP_BACKEND_URL;
    this.fallbackUrl = 'http://localhost:8001';
  }

  async makeRequest(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, timeout = 10000 } = options;
    
    // Try primary URL first (emergent agent)
    if (this.primaryUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(`${this.primaryUrl}/api${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log(`API request successful via primary URL: ${this.primaryUrl}`);
          return await response.json();
        } else {
          throw new Error(`Primary URL failed: ${response.status}`);
        }
      } catch (primaryError) {
        console.warn('Primary backend URL failed, trying fallback:', primaryError.message);
        
        // Try fallback URL (localhost)
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // Shorter timeout for localhost
          
          const response = await fetch(`${this.fallbackUrl}/api${endpoint}`, {
            method,
            headers: {
              'Content-Type': 'application/json',
              ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            console.log(`API request successful via fallback URL: ${this.fallbackUrl}`);
            return await response.json();
          } else {
            throw new Error(`Fallback URL also failed: ${response.status}`);
          }
        } catch (fallbackError) {
          throw new Error(`Both primary and fallback URLs failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
        }
      }
    } else {
      // No primary URL, use fallback directly
      const response = await fetch(`${this.fallbackUrl}/api${endpoint}`, {
        method,
        headers: {
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