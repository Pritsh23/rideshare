import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // DRIVER / PASSENGER

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* 🚗 DRIVER UI */}
      {role === "DRIVER" ? (
        <div className="space-y-3">

          <button
            onClick={() => navigate("/create-ride")}
            className="block w-full bg-blue-600 text-white p-2 rounded"
          >
            Create Ride
          </button>

          <button
            onClick={() => navigate("/my-rides")}
            className="block w-full bg-green-600 text-white p-2 rounded"
          >
            My Rides
          </button>

          {/* 🔥 MAIN FEATURE */}
          <button
            onClick={() => navigate("/driver-bookings")}
            className="block w-full bg-purple-600 text-white p-2 rounded"
          >
            Manage Bookings
          </button>

        </div>
      ) : (
        /* 👤 PASSENGER UI */
        <div className="space-y-3">

          <button
            onClick={() => navigate("/rides")}
            className="block w-full bg-blue-600 text-white p-2 rounded"
          >
            View Rides
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="block w-full bg-green-600 text-white p-2 rounded"
          >
            My Bookings
          </button>

        </div>
      )}
    </div>
  );
}