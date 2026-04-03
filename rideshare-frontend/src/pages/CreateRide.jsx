import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CreateRide() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // none/pending/approved
  const [reqData, setReqData] = useState({ vehicleNumber: "", licenseNumber: "" });
  const [form, setForm] = useState({ from: "", to: "", date: "", time: "", seats: 1, price: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/driver/me");
        if (!res.data) {
          setStatus("none");
        } else {
          setStatus(res.data.status === "APPROVED" ? "approved" : "pending");
        }
      } catch (err) {
        setStatus("none");
      }
    })();
  }, []);

  const submitDriverRequest = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      console.log("REQ DATA:", reqData);
  await apiClient.post(
  `/driver/apply?licenseNumber=${encodeURIComponent(reqData.licenseNumber)}&vehicleNumber=${encodeURIComponent(reqData.vehicleNumber)}`
);
      setStatus("pending");
      setMessage("Applied; waiting admin approval.");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      setMessage(`Could not submit request: ${serverMsg}`);
    }
  };

  const submitRide = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Combine date and time into departureTime
      const departureDateTime = new Date(`${form.date}T${form.time}`);
      
      // Calculate availabilityEndTime (2 hours after departure)
      const availabilityEndTime = new Date(departureDateTime.getTime() + 2 * 60 * 60 * 1000);
      
      const rideData = {
        source: form.from,
        destination: form.to,
        departureTime: departureDateTime.toISOString(),
        availabilityEndTime: availabilityEndTime.toISOString(),
        totalSeats: form.seats,
        pricePerSeat: form.price
      };
      
      await apiClient.post("/rides/create", rideData);
      navigate("/rides");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      setMessage(`Unable to create ride: ${serverMsg}`);
    }
  };

  if (status === "loading") return <p>Checking driver status...</p>;

  if (status !== "approved") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Driver application</h1>
        {status === "pending" && <p className="mb-4 text-orange-600">Status: pending</p>}
        <form onSubmit={submitDriverRequest} className="space-y-3">
          <input
            name="vehicleNumber"
            value={reqData.vehicleNumber}
            onChange={(e) => setReqData({ ...reqData, vehicleNumber: e.target.value })}
            placeholder="Vehicle number"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="licenseNumber"
            value={reqData.licenseNumber}
            onChange={(e) => setReqData({ ...reqData, licenseNumber: e.target.value })}
            placeholder="License number"
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {status === "pending" ? "Re-submit request" : "Submit request"}
          </button>
        </form>
        {message && <p className="text-sm mt-3">{message}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Ride</h1>
      {message && <p className="text-red-600 mb-3">{message}</p>}
      <form onSubmit={submitRide} className="space-y-3">
        <input name="from" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required placeholder="From" className="w-full p-2 border rounded" />
        <input name="to" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required placeholder="To" className="w-full p-2 border rounded" />
        <input type="date" name="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="w-full p-2 border rounded" />
        <input type="time" name="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required className="w-full p-2 border rounded" />
        <label htmlFor=""><b>Available seat</b></label>
        <input type="number" name="seats" value={form.seats} min="1" onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} required className="w-full p-2 border rounded" />
          <label htmlFor=""><b>Price per seat</b></label>
        <input type="number" name="price" value={form.price} min="0" onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Create Ride
        </button>
      </form>
    </div>
  );
}
