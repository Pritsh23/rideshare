import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming your apiClient is set up elsewhere, otherwise use this:
const apiClient = axios.create({ baseURL: "http://localhost:8080/api" });
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Matches @GetMapping("/my") in your controller
      const response = await apiClient.get('/bookings/my');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await apiClient.delete(`/bookings/${bookingId}`);
      alert(response.data); // Shows the success + refund message from backend
      fetchBookings(); // Refresh the list
    } catch (error) {
      alert(error.response?.data || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">You haven't booked any rides yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {booking.ride.source} → {booking.ride.destination}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    📅 {new Date(booking.ride.departureTime).toLocaleString()}
                  </p>

                  <div className="space-y-2 border-t pt-4">
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-semibold">Seats Booked:</span> 
                      <span>{booking.seatsBooked}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between">
                      <span className="font-semibold">Total Price:</span> 
                      <span className="text-green-600 font-bold">₹{booking.ride.pricePerSeat * booking.seatsBooked}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(booking.id)}
                  className="mt-6 w-full bg-white border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition font-semibold"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}