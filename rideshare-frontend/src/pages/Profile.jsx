import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
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
    // TODO: Add API call to update profile
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

          {!isEditing ? (
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Role</label>
                  <p className="text-gray-600 capitalize">
                    {user?.role === 'DRIVER' ? 'Driver' : 'Passenger'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
