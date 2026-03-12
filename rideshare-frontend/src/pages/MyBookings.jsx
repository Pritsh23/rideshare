import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
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
              <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {booking.ride.source} → {booking.ride.destination}
                  </h3>
                  <p className="text-sm text-gray-600">{booking.ride.departureTime}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Seats:</span> {booking.numberOfSeats}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Price:</span> ${booking.totalPrice}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
