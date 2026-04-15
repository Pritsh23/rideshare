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

export default function DriverBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await apiClient.get("/bookings/driver");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Accept / Reject
  const updateStatus = async (bookingId, status) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/status?status=${status}`);
      fetchBookings(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Group bookings by ride
  const grouped = bookings.reduce((acc, b) => {
    const rideId = b.ride.id;

    if (!acc[rideId]) {
      acc[rideId] = {
        ride: b.ride,
        bookings: [],
      };
    }

    acc[rideId].bookings.push(b);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>

      {Object.values(grouped).length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        Object.values(grouped).map((group) => (
          <div key={group.ride.id} className="border p-4 mb-4 rounded">

            {/* 🚗 Ride Info */}
            <h2 className="text-lg font-semibold">
              {group.ride.source} → {group.ride.destination}
            </h2>

            <hr className="my-2" />

            {/* 👤 Passengers */}
            {group.bookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center mb-2">

                <div>
                  <p><b>{b.passenger.name}</b></p>
                  <p>Seats: {b.seatsBooked}</p>
                  <p>Status: {b.status}</p>
                </div>

                {/* 🔥 ACTION BUTTONS */}
                {b.status === "PENDING" && (
                  <div className="space-x-2">
                    <button
                      onClick={() => updateStatus(b.id, "ACCEPTED")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(b.id, "REJECTED")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}