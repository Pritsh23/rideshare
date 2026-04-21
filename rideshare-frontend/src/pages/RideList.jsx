import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function RideList() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 search inputs
  const [search, setSearch] = useState({
    source: "",
    destination: ""
  });

  // 🚀 Search rides
  const searchRides = async () => {
  setLoading(true);
  try {
    // Get the current time in the format the backend expects
    const currentDateTime = new Date().toISOString().split('.')[0]; 

    const res = await apiClient.get(
      `/rides/search`, {
        params: {
          source: search.source,
          destination: search.destination,
          date: currentDateTime, // Use current time instead of 2025
          maxPrice: 10000
        }
      }
    );

    console.log("SEARCH RESULT:", res.data);
    setRides(res.data || []);
  } catch (err) {
    console.error("Error searching rides:", err);
    alert("Error fetching rides");
  } finally {
    setLoading(false);
  }
};

  // 🚀 Book ride
  const bookRide = async (rideId) => {
    try {
      await apiClient.post(`/bookings/create/${rideId}?seats=1`);
      alert("Ride booked successfully!");
      searchRides(); // refresh
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-4">

      {/* 🔍 SEARCH UI */}
      <h1 className="text-2xl font-bold mb-4">Search Ride</h1>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="From"
          value={search.source}
          onChange={(e) =>
            setSearch({ ...search, source: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <input
          placeholder="To"
          value={search.destination}
          onChange={(e) =>
            setSearch({ ...search, destination: e.target.value })
          }
          className="p-2 border rounded w-full"
        />

        <button
          onClick={searchRides}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* 🚗 RESULTS */}
      {loading ? (
        <p>Loading...</p>
      ) : rides.length === 0 ? (
        <p>No rides found.</p>
      ) : (
        rides.map((ride) => (
          <div key={ride.id} className="border p-3 mb-3 rounded">

            <p><strong>{ride.source} → {ride.destination}</strong></p>

            <p>
              Departure:{" "}
              {new Date(ride.departureTime).toLocaleString()}
            </p>

            <p>Available Seats: {ride.availableSeats}</p>

            <p>Price: ₹{ride.pricePerSeat}</p>

            {/* 🔥 BOOK BUTTON */}
            <button
              onClick={() => bookRide(ride.id)}
              disabled={ride.availableSeats === 0}
              className={`mt-2 px-3 py-1 rounded text-white ${
                ride.availableSeats === 0
                  ? "bg-gray-400"
                  : "bg-green-600"
              }`}
            >
              {ride.availableSeats === 0 ? "Full" : "Book Ride"}
            </button>

          </div>
        ))
      )}
    </div>
  );
}