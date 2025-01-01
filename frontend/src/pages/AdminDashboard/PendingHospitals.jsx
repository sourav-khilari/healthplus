import { useState, useEffect } from "react";
import axios from "axios";

const PendingHospitals = () => {
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingHospitals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/superadmin/getPendingHospitals"
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
      await axios.post(
        "http://localhost:8000/api/v1/superadmin/approveOrDeclineHospital",
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
