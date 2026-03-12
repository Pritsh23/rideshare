import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getUsers: () => apiClient.get('/auth/admin/users'),
};

// Ride APIs
export const rideAPI = {
  createRide: (rideData) => 
    axios.post(`${API_BASE_URL.replace('/api', '')}/rides/create`, rideData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  searchRides: (filters) => 
    axios.get(`${API_BASE_URL.replace('/api', '')}/rides/search`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  getRideDetails: (rideId) => 
    axios.get(`${API_BASE_URL.replace('/api', '')}/rides/${rideId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  getRidesByDriver: () =>
    axios.get(`${API_BASE_URL.replace('/api', '')}/rides/driver/my-rides`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

// Booking APIs
export const bookingAPI = {
  bookRide: (rideId, seats) => 
    axios.post(`${API_BASE_URL.replace('/api', '')}/passenger/bookings/book/${rideId}`, null, {
      params: { seats },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  getMyBookings: () =>
    axios.get(`${API_BASE_URL.replace('/api', '')}/passenger/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  updateBookingStatus: (bookingId, status) =>
    axios.put(`${API_BASE_URL.replace('/api', '')}/passenger/bookings/update/${bookingId}`, null, {
      params: { status },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
};

export default apiClient;
