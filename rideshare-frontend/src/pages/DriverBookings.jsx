import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DriverBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null); // Tracks which booking chat is open

  // --- 1. FETCH INCOMING REQUESTS ---
  const fetchIncomingRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/bookings/driver", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch driver bookings", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, []);

  // --- 2. ACCEPT / REJECT LOGIC ---
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status`, null, {
        params: { status: newStatus },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`Booking ${newStatus.toLowerCase()} successfully!`);
      fetchIncomingRequests(); 
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-600 font-semibold">Loading requests...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Incoming Ride Requests</h1>
      
      {bookings.length === 0 ? (
        <div className="p-10 bg-gray-50 rounded-xl text-center border-2 border-dashed">
          <p className="text-gray-500">No one has requested a ride yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            // Check if ride is expired
            const isExpired = new Date(booking.ride.departureTime) < new Date();

            return (
              <div key={booking.id} className="bg-white p-5 rounded-xl shadow-md border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                      {booking.ride.source} → {booking.ride.destination}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                      booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    Passenger: {booking.passenger?.name || "Anonymous"}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    Seats Requested: {booking.seatsBooked}
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {/* Action Buttons for Pending */}
                  {booking.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                        className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-sm"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, "REJECTED")}
                        className="flex-1 md:flex-none bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition shadow-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {/* Chat Button: Only if ACCEPTED and NOT EXPIRED */}
                  {booking.status === "ACCEPTED" && !isExpired && (
                    <button 
                      onClick={() => setActiveChat(booking)}
                      className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
                    >
                      💬 Chat
                    </button>
                  )}

                  {/* Visual indication if ride is expired */}
                  {booking.status === "ACCEPTED" && isExpired && (
                    <span className="text-gray-400 text-sm italic font-medium">Ride Completed (Chat Closed)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CHAT MODAL OVERLAY */}
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
 * Chat Modal Component
 * Internal component to handle the messaging interface
 */
function ChatModal({ booking, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email"); // Get current user email

  useEffect(() => {
    const loadChat = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/chat/${booking.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Chat Debug:", res.data); // Look at your console to see the field name!
        setMessages(res.data);
      } catch (err) {
        console.error("Chat fetch failed", err);
      }
    };

    loadChat();
    const interval = setInterval(loadChat, 3000);
    return () => clearInterval(interval);
  }, [booking.id, token]);

  const sendMsg = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(`http://localhost:8080/chat/send/${booking.id}`, text, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/plain"
        }
      });
      setText("");
    } catch (err) {
      alert("Message failed to send");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px]">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold">Chat with {booking.passenger?.name}</h3>
            <p className="text-[10px] opacity-80 uppercase tracking-widest">{booking.ride.source} Ride</p>
          </div>
          <button onClick={onClose} className="text-2xl hover:text-gray-200 transition">&times;</button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
          {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-10 italic">No messages yet.</p>}
          
          {messages.map((m, i) => {
             // LOGIC: Check if the message is from ME (the Driver)
             // Check against email or senderName depending on your backend
             const isMe = m.senderEmail === userEmail || m.senderName === booking.ride.driver.name;

             return (
               <div 
                 key={i} 
                 className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${
                   isMe 
                     ? 'bg-blue-600 text-white self-end rounded-tr-none' 
                     : 'bg-white text-gray-800 self-start rounded-tl-none border border-gray-200'
                 }`}
               >
                 <p className={`text-[10px] font-bold mb-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                    {m.senderName}
                 </p>
                 {/* FIXED: We check for .content OR .message OR .text */}
                 <p className="text-sm leading-relaxed break-words">
                   {m.content || m.message || m.text} 
                 </p>
               </div>
             );
          })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t flex gap-2">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
            className="flex-1 border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-800" 
            placeholder="Write your message..."
          />
          <button 
            onClick={sendMsg} 
            className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}