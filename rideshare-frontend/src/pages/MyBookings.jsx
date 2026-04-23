import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API Client Setup
const apiClient = axios.create({ baseURL: "http://localhost:8080" });
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // Track open chat

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get('/api/bookings/my');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const response = await apiClient.delete(`/api/bookings/${bookingId}`);
      alert(response.data);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data || "Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">You haven't booked any rides yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => {
              // Logic: Chat expires after departure time
              const isExpired = new Date(booking.ride.departureTime) < new Date();

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between border border-gray-100">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {booking.ride.source} → {booking.ride.destination}
                      </h3>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      📅 {new Date(booking.ride.departureTime).toLocaleString()}
                    </p>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-600">Driver:</span>
                        <span className="text-gray-800 font-medium">{booking.ride.driver?.name || "N/A"}</span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-600">Contact:</span>
                        <span className="text-blue-600 font-bold">
                          {booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED' 
                            ? booking.ride.driver?.phone 
                            : "Locked"}
                        </span>
                      </div>

                      <p className="text-gray-700 flex justify-between text-sm">
                        <span className="font-semibold">Seats:</span> 
                        <span>{booking.seatsBooked}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    {/* CHAT BUTTON: Only if ACCEPTED and NOT EXPIRED */}
                    {(booking.status === 'ACCEPTED' || booking.status === 'CONFIRMED') && !isExpired && (
                      <button
                        onClick={() => setActiveChat(booking)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-bold flex items-center justify-center gap-2"
                      >
                        💬 Chat with Driver
                      </button>
                    )}

                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="w-full bg-white border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-50 transition font-semibold text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CHAT MODAL */}
      {activeChat && (
        <ChatModal 
          booking={activeChat} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
}

/**
 * Chat Modal Component (Internal)
 */
function ChatModal({ booking, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
   const loadChat = async () => {
  try {
    const res = await apiClient.get(`/chat/${booking.id}`);
    console.log("CHAT DATA FROM BACKEND:", res.data); // <--- Add this
    setMessages(res.data);
  } catch (err) { console.error(err); }
};
    loadChat();
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, [booking.id]);

  const sendMsg = async () => {
    if (!text.trim()) return;
    try {
      await apiClient.post(`/chat/send/${booking.id}`, text, {
        headers: { "Content-Type": "text/plain" }
      });
      setText("");
    } catch (err) { alert("Failed to send message"); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold">Chat with {booking.ride.driver.name}</h3>
            <p className="text-[10px] opacity-80">Driver Profile</p>
          </div>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
       {/* --- Replace the old messages.map with this one --- */}
<div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
  {messages.map((m, i) => {
    // Check if the message was sent by the current user (Passenger)
    const isMe = m.senderEmail === localStorage.getItem("email");

    return (
      <div 
        key={i} 
        className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${
          isMe 
            ? 'bg-green-600 text-white self-end rounded-tr-none' // PASSENGER: Green background, white text, right aligned
            : 'bg-white text-gray-800 self-start rounded-tl-none border border-gray-200' // DRIVER: White background, dark text, left aligned
        }`}
      >
        {/* Name Label */}
        <p className={`text-[10px] font-bold mb-1 ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
          {isMe ? "You" : m.senderName}
        </p>
        
        {/* Message Content */}
        <p className="text-sm leading-relaxed break-words">
          {m.content || m.message}
        </p>
      </div>
    );
  })}
</div>
        <div className="p-4 bg-white border-t flex gap-2">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            className="flex-1 border border-gray-200 p-3 rounded-xl outline-none" 
            placeholder="Type to driver..."
          />
          <button onClick={sendMsg} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold">Send</button>
        </div>
      </div>
    </div>
  );
}