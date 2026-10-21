// API Client service for SmartTheater Review 4 Prototype
const BASE_URL = '/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `HTTP error ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Movies
  async getMovies() {
    return handleResponse(await fetch(`${BASE_URL}/movies`));
  },

  async getMovieById(id) {
    return handleResponse(await fetch(`${BASE_URL}/movies/${id}`));
  },

  // Shows & Seats
  async getShowSeats(showId) {
    return handleResponse(await fetch(`${BASE_URL}/shows/${showId}/seats`));
  },

  // Bookings
  async createBooking(bookingData) {
    return handleResponse(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
    );
  },

  async getBooking(bookingId) {
    return handleResponse(await fetch(`${BASE_URL}/bookings/${bookingId}`));
  },

  // Support Tickets
  async createTicket(ticketData) {
    return handleResponse(
      await fetch(`${BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      })
    );
  },

  async getTickets(status = null) {
    const url = status && status !== 'all' 
      ? `${BASE_URL}/tickets?status=${encodeURIComponent(status)}`
      : `${BASE_URL}/tickets`;
    return handleResponse(await fetch(url));
  },

  async updateTicketStatus(ticketId, status) {
    return handleResponse(
      await fetch(`${BASE_URL}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
    );
  },

  async getTicketStats() {
    return handleResponse(await fetch(`${BASE_URL}/tickets/stats`));
  },

  // Health check
  async checkHealth() {
    return handleResponse(await fetch(`${BASE_URL}/health`));
  }
};
