/**
 * SmartTheater API Client
 * Interacts with FastAPI backend endpoints.
 */

const BASE_URL = '/api';

// Helper to attach JWT token if present
function getAuthHeaders() {
  const token = localStorage.getItem('smarttheater_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      errorDetail = response.statusText || errorDetail;
    }
    throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
  }

  // Handle 204 No Content
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  getMe: async () => {
    return request('/auth/me');
  },

  // Movies & Shows
  getMovies: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies${query ? `?${query}` : ''}`);
  },
  getMovieDetail: async (id) => {
    return request(`/movies/${id}`);
  },
  getMovieShows: async (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies/${id}/shows${query ? `?${query}` : ''}`);
  },
  getShowSeats: async (showId) => {
    return request(`/shows/${showId}/seats`);
  },

  // Bookings
  createBooking: async (payload) => {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getBookingDetail: async (bookingId) => {
    return request(`/bookings/${bookingId}`);
  },

  // Support Tickets (Customer)
  submitTicket: async (payload) => {
    return request('/support-tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyTickets: async () => {
    return request('/support-tickets');
  },

  // Support Tickets (Staff)
  getAllTickets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/support-tickets/all${query ? `?${query}` : ''}`);
  },
  updateTicket: async (ticketId, payload) => {
    return request(`/support-tickets/${ticketId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // Analytics (Admin)
  getAnalyticsDashboard: async () => {
    return request('/analytics/dashboard');
  },
};
