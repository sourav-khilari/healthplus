import { useState, useEffect } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const PendingHospitals = () => {
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingHospitals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/superadmin/getPendingHospitals"
      );
      setPendingHospitals(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch pending hospitals.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrReject = async (hospitalId, action) => {
    try {
      await axiosInstance.post(
        "/superadmin/approveOrDeclineHospital",
        {
          hospitalId,
          action,
        }
      );
      alert(`Hospital ${action}ed successfully.`);
      fetchPendingHospitals();
    } catch (err) {
      setError("Failed to update hospital status.");
    }
  };

  useEffect(() => {
    fetchPendingHospitals();
  }, []);

  if (loading) return <p>Loading pending hospitals...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Pending Hospitals</h2>
      <ul>
        {pendingHospitals.map((hospital) => (
          <li key={hospital._id}>
            {hospital.name}
            <div>
              <button
                onClick={() => handleApproveOrReject(hospital._id, "approve")}
              >
                Approve
              </button>
              <button
                onClick={() => handleApproveOrReject(hospital._id, "reject")}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PendingHospitals;
