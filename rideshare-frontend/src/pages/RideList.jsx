import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RideList() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await axios.get('/api/rides');
        // Filter out expired rides
        const now = new Date();
        const validRides = (res.data || []).filter(ride => {
          const availabilityEndTime = new Date(ride.availabilityEndTime);
          return availabilityEndTime > now;
        });
        setRides(validRides);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
    // Auto-refresh every 30 seconds to remove expired rides
    const interval = setInterval(fetchRides, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading rides...</p>;

  return (
    <div>
      <h1>Available rides</h1>
      {rides.length === 0 ? (
        <p>No rides yet.</p>
      ) : (
        rides.map((ride) => (
          <div key={ride.id ?? ride._id}>
            <p><strong>{ride.source} → {ride.destination}</strong></p>
            <p>Departure: {new Date(ride.departureTime).toLocaleString()}</p>
            <p>Available until: {new Date(ride.availabilityEndTime).toLocaleString()}</p>
            <p>Available seats: {ride.availableSeats} | Price: ${ride.pricePerSeat}/seat</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}