import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH RIDES CREATED BY DRIVER ---
  const fetchMyRides = async () => {
    try {
      const token = localStorage.getItem("token");
      // This calls your @GetMapping("/my") in RideController
      const res = await axios.get("http://localhost:8080/api/rides/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("My Rides Data:", res.data);
      setRides(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch rides:", err);
      setLoading(false);
    }
  };
  const handleDeleteRide = async (rideId) => {
  if (!window.confirm("Are you sure you want to delete this ride? This action cannot be undone.")) return;

  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`http://localhost:8080/api/rides/${rideId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(res.data);
    fetchMyRides(); // Refresh the list after deletion
  } catch (err) {
    console.error("Delete failed:", err);
    alert(err.response?.data || "Failed to delete ride.");
  }
};

  useEffect(() => {
    fetchMyRides();
  }, []);

  // --- 2. UPDATE BOOKING STATUS (Accept/Reject) ---
  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/bookings/${bookingId}/status`,
        null, 
        {
          params: { status: status },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(`Booking ${status.toLowerCase()} successfully!`);
      fetchMyRides(); 
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update booking status.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading your rides...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Offered Rides</h1>

      {rides.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow border border-dashed">
          <p className="text-gray-500">You haven't offered any rides yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rides.map((ride) => {
            // Check if ride is expired (past departure time)
            const isExpired = new Date(ride.departureTime) < new Date();
            const bookingCount = ride.bookings ? ride.bookings.length : 0;

            return (
              <div 
                key={ride.id} 
                className={`p-6 rounded-xl shadow-md border transition ${
                  isExpired ? 'bg-gray-50 border-gray-200 opacity-80' : 'bg-white border-gray-100'
                }`}
              >
                {/* RIDE INFO */}
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-blue-700">
                        {ride.source} → {ride.destination}
                      </h2>
                      {isExpired && (
                        <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      📅 {new Date(ride.departureTime).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    
                    {/* 📊 INFORMATION: BOOKING COUNT */}
                    <div className="mt-2 flex gap-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                         bookingCount > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                       }`}>
                         Total Requests: {bookingCount}
                       </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-700">Seats: {ride.bookedSeats || 0} / {ride.totalSeats}</p>
                    <p className="text-green-600 text-sm font-semibold">Available: {ride.availableSeats}</p>
                    {/* --- INSERT THE DELETE BUTTON HERE --- */}
  <button 
    onClick={() => handleDeleteRide(ride.id)}
    className="mt-3 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-md border border-red-200 hover:bg-red-600 hover:text-white transition font-bold"
  >
    🗑️ Delete Ride
  </button>
                  </div>
                </div>

                {/* BOOKING REQUESTS FOR THIS RIDE */}
                <div>
                  <h3 className="text-md font-bold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">
                    Passenger Details & Requests
                  </h3>
                  
                  {ride.bookings && ride.bookings.length > 0 ? (
                    <div className="space-y-3">
                      {ride.bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div>
                            <p className="font-bold text-gray-800">{booking.passenger?.name || "Unknown Passenger"}</p>
                            <p className="text-sm text-gray-500">Seats requested: {booking.seatsBooked}</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                              booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>

                          {/* ACTIONS (Disabled if ride is expired) */}
                          {booking.status === "PENDING" && !isExpired && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, "ACCEPTED")}
                                className="bg-green-600 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-green-700 transition"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, "REJECTED")}
                                className="bg-red-500 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-red-600 transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {booking.status === "ACCEPTED" && (
                             <div className="flex flex-col items-end">
                               <span className="text-[10px] text-gray-400 font-bold uppercase">Contact</span>
                               <div className="text-sm font-bold text-blue-600">
                                 📞 {booking.passenger?.phone || "No Phone"}
                               </div>
                             </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic py-2">No bookings for this ride yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}