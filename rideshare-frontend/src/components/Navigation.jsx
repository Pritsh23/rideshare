import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
 const navigate = useNavigate();

const handleCreateRide = async () => {

try {

const res = await axios.get("http://localhost:8080/driver-status");

if(res.data === true){

navigate("/create-ride");

}else{

navigate("/driver-request");

}

} catch(err){

console.error(err);

}

};

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
              <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-semibold">
                My Bookings
              </Link>
             <button onClick={handleCreateRide}>
Create Ride
</button>
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
