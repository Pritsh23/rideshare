import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">🚗 Rideshare</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-semibold">
                Dashboard
              </Link>
              {user?.role === 'PASSENGER' && (
                <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-semibold">
                  My Bookings
                </Link>
              )}
              {user?.role === 'PASSENGER' && (
                <Link to="/create-ride" className="text-gray-700 hover:text-blue-600 font-semibold">
                  Create Ride
                </Link>
              )}
              <div className="flex items-center gap-4">
                <span className="text-gray-700">{user?.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
