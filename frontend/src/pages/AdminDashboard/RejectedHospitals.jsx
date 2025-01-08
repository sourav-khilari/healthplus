import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const RejectedHospitals = () => {
  const [rejectedHospitals, setRejectedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRejectedHospitals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/superadmin/getRejectedHospitals"
      );
      setRejectedHospitals(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch rejected hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedHospitals();
  }, []);

  if (loading) return <p>Loading rejected hospitals...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Rejected Hospitals</h2>
      <ul>
        {rejectedHospitals.map((hospital) => (
          <li key={hospital._id}>{hospital.name}</li>
        ))}
      </ul>
    </section>
  );
};

export default RejectedHospitals;
