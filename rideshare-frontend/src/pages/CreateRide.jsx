import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function CreateRide() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [reqData, setReqData] = useState({
    vehicleNumber: "",
    licenseNumber: "",
  });

  const [form, setForm] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seats: 1,
    price: "",
  });

  const [message, setMessage] = useState("");

  // 🔄 Check driver status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await apiClient.get("/driver/me");

        if (!res.data) {
          setStatus("none");
        } else {
          setStatus(
            res.data.status === "APPROVED" ? "approved" : "pending"
          );
        }
      } catch (err) {
        setStatus("none");
      }
    };

    checkStatus();

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🚗 Apply for driver
  const submitDriverRequest = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await apiClient.post(
        `/driver/apply?licenseNumber=${encodeURIComponent(
          reqData.licenseNumber
        )}&vehicleNumber=${encodeURIComponent(
          reqData.vehicleNumber
        )}`
      );

      setStatus("pending");
      setMessage("Applied successfully! Waiting for approval.");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setMessage(`Error: ${serverMsg}`);
    }
  };

  // 🚀 Create Ride
  const submitRide = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const rideData = {
        source: form.from,
        destination: form.to,

        // ✅ IMPORTANT FIX (no toISOString)
        departureTime: `${form.date}T${form.time}`,
        availabilityEndTime: `${form.date}T${form.time}`,

        totalSeats: form.seats,
        pricePerSeat: form.price,
      };

      console.log("RIDE DATA:", rideData);

      const res = await apiClient.post("/rides/create", rideData);

      console.log("Created Ride:", res.data);

      setMessage("Ride created successfully 🚗");

      setTimeout(() => {
        navigate("/rides");
      }, 1500);
    } catch (err) {
      console.log("FULL ERROR:", err.response);

      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setMessage(`Unable to create ride: ${serverMsg}`);
    }
  };

  if (status === "loading") return <p>Checking driver status...</p>;

  // 🚫 Not approved → show driver form
  if (status !== "approved") {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Driver Application</h1>

        {status === "pending" && (
          <p className="mb-4 text-orange-600">Status: Pending</p>
        )}

        <form onSubmit={submitDriverRequest} className="space-y-3">
          <input
            value={reqData.vehicleNumber}
            onChange={(e) =>
              setReqData({ ...reqData, vehicleNumber: e.target.value })
            }
            placeholder="Vehicle number"
            required
            className="w-full p-2 border rounded"
          />

          <input
            value={reqData.licenseNumber}
            onChange={(e) =>
              setReqData({ ...reqData, licenseNumber: e.target.value })
            }
            placeholder="License number"
            required
            className="w-full p-2 border rounded"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Request
          </button>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    );
  }

  // ✅ Approved → Create Ride Form
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Ride</h1>

      {message && (
        <p
          className={`mb-3 ${
            message.includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={submitRide} className="space-y-3">
        <input
          placeholder="From"
          value={form.from}
          onChange={(e) =>
            setForm({ ...form, from: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          placeholder="To"
          value={form.to}
          onChange={(e) =>
            setForm({ ...form, to: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="time"
          value={form.time}
          onChange={(e) =>
            setForm({ ...form, time: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          min="1"
          value={form.seats}
          onChange={(e) =>
            setForm({ ...form, seats: Number(e.target.value) })
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
          className="w-full p-2 border rounded"
          required
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Create Ride
        </button>
      </form>
    </div>
  );
}