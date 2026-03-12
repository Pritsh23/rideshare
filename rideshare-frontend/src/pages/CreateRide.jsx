import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rideAPI } from '../services/api';

export default function CreateRide() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureTime: '',
    pricePerSeat: '',
    totalSeats: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await rideAPI.createRide({
        ...formData,
        pricePerSeat: parseFloat(formData.pricePerSeat),
        totalSeats: parseInt(formData.totalSeats),
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create ride. Please try again.');
      console.error('Create ride error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Ride</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">From</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Departure location"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">To</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Destination"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Departure Date & Time</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price per Seat ($)</label>
              <input
                type="number"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                min="1"
                max="8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="4"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ride'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
