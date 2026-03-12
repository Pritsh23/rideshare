import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      <div className="flex flex-col items-center justify-center min-h-screen text-center text-white px-4">
        <div className="text-7xl mb-4">🚗</div>
        <h1 className="text-5xl font-bold mb-4">Welcome to Rideshare</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Find affordable rides, connect with drivers, and share the journey. Your ride, your way.
        </p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-transparent border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
