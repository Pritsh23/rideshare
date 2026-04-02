import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function RideList() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/rides');
        setRides(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
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
            {ride.from} → {ride.to} | {ride.date} | seats {ride.seats} | ${ride.price}
          </div>
        ))
      )}
    </div>
  );
}