import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const userName = localStorage.getItem("userName"); 

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🚗 Ridemate</Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* Options available to ALL users */}
            
            <Link to="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/view-rides" className="hover:text-blue-600 font-medium">View Rides</Link>
            
            <Link to="/create-ride" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Offer a Ride
            </Link>

          

            <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
              Logout
            </button>
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