import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor";
import "../../styles/RejectedHospitals.css"; // Import custom styles

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

  if (loading)
    return <p className="loading-text">Loading rejected hospitals...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <section className="rejectedHospitals-container">
      <h2 className="rejectedHospitals-title">Rejected Hospitals</h2>
      <ul className="rejectedHospitals-list">
        {rejectedHospitals.map((hospital) => (
          <li key={hospital._id} className="hospital-item">
            {hospital.name}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RejectedHospitals;
