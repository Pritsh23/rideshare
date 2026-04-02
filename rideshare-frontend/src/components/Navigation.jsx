import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🚗 Rideshare</Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/my-bookings" className="hover:text-blue-600">My Bookings</Link>
            <Link to="/create-ride" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Create Ride
            </Link>
            <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
