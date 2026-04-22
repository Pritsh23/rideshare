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
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [bookingStatuses, setBookingStatuses] = useState({});

  const [search, setSearch] = useState({
    source: "",
    destination: ""
  });

  useEffect(() => {
    searchRides();
  }, []);

  const searchRides = async () => {
    setLoading(true);
    try {
      const currentDateTime = new Date().toISOString().split('.')[0];
      const res = await apiClient.get(`/rides/search`, {
        params: {
          source: search.source,
          destination: search.destination,
          date: currentDateTime,
          maxPrice: 10000
        }
      });
      setRides(res.data || []);
    } catch (err) {
      console.error("Error searching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (rideId) => {
    if (!paymentMethod) {
      alert("Please select COD or ONLINE payment method!");
      return;
    }

    try {
      await apiClient.post(`/bookings/create/${rideId}`, {}, {
        params: { seats: 1, paymentMethod: paymentMethod }
      });

      try {
        await apiClient.post(`/payments/complete/${rideId}`, null, {
          params: { method: paymentMethod }
        });
        alert("Booking and Payment Successful! 🎉");
      } catch (payErr) {
        alert("Ride booked (Unpaid). Payment API Error.");
      }
      searchRides();
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.message || "Check parameters"));
    }
  };

  // Helper to format the Date
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Find a Ride</h1>

      {/* SEARCH UI */}
      <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap gap-3 mb-6">
        <input
          placeholder="From"
          value={search.source}
          onChange={(e) => setSearch({ ...search, source: e.target.value })}
          className="p-2 border rounded flex-1 min-w-[200px]"
        />
        <input
          placeholder="To"
          value={search.destination}
          onChange={(e) => setSearch({ ...search, destination: e.target.value })}
          className="p-2 border rounded flex-1 min-w-[200px]"
        />
        <button onClick={searchRides} className="bg-blue-600 text-white px-6 py-2 rounded">Search</button>
      </div>

      {/* PAYMENT SELECTOR */}
      <div className="mb-6 p-3 border-l-4 border-blue-500 bg-blue-50 flex items-center justify-between">
        <div>
          <label className="font-bold mr-2">Payment Method:</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="">select</option>
            <option value="ONLINE">UPI</option>
            <option value="COD">CASH</option>
          </select>
        </div>
        <span className="text-xs font-bold bg-blue-200 px-2 py-1 rounded text-blue-800">
          Mode: {paymentMethod}
        </span>
      </div>

      {/* RESULTS */}
      <h2 className="text-xl font-semibold mb-3">Available Rides</h2>
      {loading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {rides.map((ride) => (
            <div key={ride.id} className="border p-4 rounded-xl shadow-sm bg-white hover:border-blue-300 transition">
              <div className="flex justify-between items-start border-b pb-3 mb-3">
                <div>
                  <p className="text-lg font-bold text-gray-800">{ride.source} → {ride.destination}</p>
                  {/* 📅 DEPARTURE TIME */}
                  <p className="text-sm font-medium text-blue-600">
                    🕒 {formatDateTime(ride.departureTime)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">₹{ride.pricePerSeat}</p>
                  <p className="text-xs text-gray-500">Available Seats: {ride.availableSeats}/{ride.totalSeats}</p>
                </div>
              </div>

             {/* 👤 RIDER/DRIVER INFORMATION */}
<div className="flex justify-between items-center">
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {/* Updated line below: uses ride.driver.name */}
      <span className="text-sm font-semibold text-gray-700">
        Driver: {ride.driver?.name || "Unknown Driver"}
      </span>
      <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">
        ⭐ {ride.driver?.rating || "5.0"}
      </span>
    </div>
    
    {/* Updated line below: uses ride.driver.phone */}
    <p className="text-xs text-gray-500">
      📞 {ride.driver?.phone || "No Contact Shared"}
    </p>
  </div>

  <button
    onClick={() => bookRide(ride.id)}
    // ... remaining button code ...
  >
    {bookingStatuses[ride.id] ? "Booked" : ride.availableSeats === 0 ? "Full" : "Book & Pay"}
  </button>
</div>
            </div>
          ))}
          {rides.length === 0 && <p className="text-center text-gray-500">No rides found for this route.</p>}
        </div>
      )}
    </div>
  );
}