import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rideAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    source: '',
    destination: '',
    date: '',
  });

  // Auto-refresh rides every 30 seconds to remove expired ones
  useEffect(() => {
    const interval = setInterval(() => {
      if (rides.length > 0) {
        const now = new Date();
        const validRides = rides.filter(ride => {
          const availabilityEndTime = new Date(ride.availabilityEndTime);
          return availabilityEndTime > now;
        });
        if (validRides.length !== rides.length) {
          setRides(validRides);
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [rides]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await rideAPI.searchRides(searchFilters);
      // Filter out expired rides
      const now = new Date();
      const validRides = response.data.filter(ride => {
        const availabilityEndTime = new Date(ride.availabilityEndTime);
        return availabilityEndTime > now;
      });
      setRides(validRides);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.email}</h1>
          <p className="text-blue-100">Find your next ride</p>
        </div>

        <div className="p-8">
          {user?.role === 'PASSENGER' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Find a Ride</h2>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">From</label>
                  <input
                    type="text"
                    name="source"
                    value={searchFilters.source}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Source"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">To</label>
                  <input
                    type="text"
                    name="destination"
                    value={searchFilters.destination}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Destination"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={searchFilters.date}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {user?.role === 'DRIVER' && (
            <div className="mb-8">
              <a
                href="/create-ride"
                className="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                + Create a New Ride
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map(ride => (
              <div key={ride.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{ride.source} → {ride.destination}</h3>
                    <p className="text-sm text-gray-600">Departure: {new Date(ride.departureTime).toLocaleString()}</p>
                    <p className="text-xs text-orange-600 font-semibold">Available until: {new Date(ride.availabilityEndTime).toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {ride.availableSeats} seats
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Price:</span> ${ride.pricePerSeat}/seat
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Driver:</span> {ride.driver?.name}
                  </p>
                </div>
                {user?.role === 'PASSENGER' && (
                  <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Now
                  </button>
                )}
              </div>
            ))}
          </div>

          {rides.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No rides found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
