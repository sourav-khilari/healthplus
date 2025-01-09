import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/BloodBankDashboard.css"; // Import custom styles

const BloodBankDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRequest, setNewRequest] = useState({
    bloodGroup: "",
    phone: "",
    address: "",
  });

  const [isTokenExpired, setIsTokenExpired] = useState(false); // Token expiration flag

  const fetchRequests = async () => {
    if (isTokenExpired) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/users/getUserDonationRequests"
      );
      setRequests(response.data?.data?.donationRequests || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsTokenExpired(true);
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message || "Failed to load donation requests."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!newRequest.bloodGroup || !newRequest.phone || !newRequest.address) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/users/submitBloodDonationRequest",
        newRequest
      );
      setNewRequest({ bloodGroup: "", phone: "", address: "" });
      fetchRequests();
      alert(response.data.message);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsTokenExpired(true);
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message || "Failed to submit donation request."
        );
      }
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post(
        "/users/cancelDonationRequest",
        { requestId }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      alert(response.data.message);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsTokenExpired(true);
        setError("Your session has expired. Please log in again.");
      } else {
        setError(
          err.response?.data?.message || "Failed to cancel donation request."
        );
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="blood-bank-dashboard">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Blood Bank Dashboard
      </h1>

      {/* Error Notification */}
      {error && <div className="error-text mb-4">{error}</div>}

      {/* New Donation Request Form */}
      <div className="blood-form-container p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4 text-white">
          Submit a New Blood Donation Request
        </h2>
        <input
          type="text"
          placeholder="Blood Group (e.g., A+, B-, O+)"
          className="blood-input-field mb-4"
          value={newRequest.bloodGroup}
          onChange={(e) =>
            setNewRequest({ ...newRequest, bloodGroup: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="blood-input-field mb-4"
          value={newRequest.phone}
          onChange={(e) =>
            setNewRequest({ ...newRequest, phone: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          className="blood-input-field mb-4"
          value={newRequest.address}
          onChange={(e) =>
            setNewRequest({ ...newRequest, address: e.target.value })
          }
        />
        <button
          onClick={handleSubmitRequest}
          className="submit-btn"
          disabled={isTokenExpired}
        >
          Submit Request
        </button>
      </div>

      {/* Donation Requests List */}
      <div className="requests-container grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading donation requests...</div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="request-item shadow-lg p-6 rounded-md"
            >
              <h3 className="font-semibold text-xl">{request.bloodGroup}</h3>
              <p>
                <strong>Phone:</strong> {request.phone}
              </p>
              <p>
                <strong>Address:</strong> {request.address}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>

              {request.status === "pending" && (
                <button
                  onClick={() => handleCancelRequest(request._id)}
                  className="cancel-btn"
                  disabled={isTokenExpired}
                >
                  Cancel Request
                </button>
              )}
            </div>
          ))
        ) : (
          <div>No donation requests found.</div>
        )}
      </div>
    </div>
  );
};

export default BloodBankDashboard;
