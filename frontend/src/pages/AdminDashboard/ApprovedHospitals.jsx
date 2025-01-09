import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/ApprovedHospitals.css";

const ApprovedHospitals = () => {
  const [approvedHospitals, setApprovedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApprovedHospitals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/superadmin/getApprovedHospitals"
      );
      setApprovedHospitals(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch approved hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedHospitals();
  }, []);

  if (loading) return <p>Loading approved hospitals...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="approved-hospitals">
      <section>
        <h2>Approved Hospitals</h2>
        <ul>
          {approvedHospitals.map((hospital) => (
            <li key={hospital._id}>{hospital.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ApprovedHospitals;
