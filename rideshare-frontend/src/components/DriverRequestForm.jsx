import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DriverRequestForm = () => {

  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8080/driver-request",{
licenseNumber,
vehicleNumber
});

alert("Request sent to admin for approval");

  };

  return (
    <div>
      <h2>Driver Application</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />

        <br/>

        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <br/>

        <button type="submit">
          Submit
        </button>

      </form>
    </div>
  );
};

export default DriverRequestForm;