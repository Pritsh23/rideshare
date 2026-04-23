import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  // --- 1. STATE ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ source: "", destination: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // --- 2. FETCH USER PROFILE FROM BACKEND ---
  useEffect(() => {
    const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // console.log("DATABASE RESPONSE:", res.data); // <--- ADD THIS LINE
    setUser(res.data);
    setLoading(false);
  } catch (err) {
    console.error("Fetch failed:", err);
    setLoading(false);
  }
};
    fetchUserData();
  }, []);

  // --- 3. SEARCH LOGIC ---
 const handleSearch = async () => {
  if (!search.source || !search.destination) {
    alert("Please enter both source and destination");
    return;
  }
  
  try {
    const token = localStorage.getItem("token");
    
    // We create these to satisfy the @RequestParam requirements in your Java Controller
    const currentDateTime = new Date().toISOString().split('.')[0]; // Formats to 'YYYY-MM-DDTHH:MM:SS'
    const defaultMaxPrice = 5000.0;

    const res = await axios.get(`http://localhost:8080/api/rides/search`, {
      params: { 
        source: search.source, 
        destination: search.destination,
        date: currentDateTime, // Matches @RequestParam LocalDateTime date
        maxPrice: defaultMaxPrice // Matches @RequestParam Double maxPrice
      },
      headers: { 
        Authorization: `Bearer ${token}` // Ensures the request is authenticated
      }
    });

    console.log("Search Results from DB:", res.data);
    setResults(res.data);
    setSearched(true);
  } catch (err) {
    console.error("Search failed", err);
    alert("Search failed. Check console for details.");
  }
};

  if (loading) return <div className="p-10 text-center text-xl font-semibold">Loading your profile...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
         Hello, {user?.name || "User"}!
        </h1>
        <p className="text-gray-500 font-medium">Find a ride or offer one to others.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SEARCH & RESULTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Find a Ride</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="From (Source)"
                className="flex-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                value={search.source}
                onChange={(e) => setSearch({ ...search, source: e.target.value })}
              />
              <input
                type="text"
                placeholder="To (Destination)"
                className="flex-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                value={search.destination}
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
              />
              <button 
                onClick={handleSearch}
                className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700 transition shadow-md"
              >
                Search
              </button>
            </div>
          </div>

          {/* SEARCH RESULTS LIST */}
          <div className="mt-6">
            {searched ? (
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-700">Available Rides:</h3>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((ride) => (
                      <div key={ride.id} className="p-5 bg-white border rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition">
                        <div>
                          <p className="font-bold text-xl text-gray-800">{ride.source} → {ride.destination}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            📅 {ride.departureTime} | 💺 {ride.availableSeats} Seats left
                          </p>
                        </div>
                        <button 
                          onClick={() => navigate(`/book/${ride.id}`)}
                          className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-gray-50 rounded-xl border-2 border-dashed">
                    <p className="text-gray-500 text-lg">No rides matching your route. Try a different location!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400 italic">
                Enter your locations above to start searching for rides.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR ACTIONS */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-700 mb-2">My Journey</h2>
          
          <button 
            onClick={() => navigate("/create-ride")} 
            className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:brightness-110 text-left font-bold transition"
          >
            🚗 Offer a New Ride
          </button>
          
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 space-y-1">
            <button onClick={() => navigate("/my-rides")} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition text-gray-700 font-semibold flex items-center gap-2">
              📋 My Offered Rides
            </button>
            <button onClick={() => navigate("/my-bookings")} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition text-gray-700 font-semibold flex items-center gap-2">
              🎟️ My Booked Rides
            </button>
            <button onClick={() => navigate("/driver-bookings")} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition text-gray-700 font-semibold flex items-center gap-2">
              🔔 Incoming Requests
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}