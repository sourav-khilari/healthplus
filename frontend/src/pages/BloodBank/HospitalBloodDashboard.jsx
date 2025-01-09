import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/HospitalBloodDashboard.css"; // Import the custom CSS file

const HospitalBloodDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch donation requests
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = "/hospital/getDonationRequestsForHospital";
      const response = await axiosInstance.get(endpoint);
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to update request status
  const updateRequestStatus = async (requestId, newStatus) => {
    const endpointMap = {
      accepted: "/hospital/acceptDonationRequest",
      declined: "/hospital/declineDonationRequest",
      read: "/hospital/markRequestAsRead",
    };

    try {
      await axiosInstance.post(endpointMap[newStatus], { requestId });

      // Optimistically update the status in the UI
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (err) {
      console.error(`Error updating request to ${newStatus}:`, err);
      setError(`Failed to update request. Please try again.`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="hospital-dashboard-container">
      <h1 className="title">Hospital BloodBank Dashboard</h1>

      {loading && (
        <div className="loading-message">Loading donation requests...</div>
      )}
      {error && <div className="error-message">{error}</div>}

      <div className="requests-grid">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className={`request-card ${
                request.status === "read" || request.status === "accepted"
                  ? "read-accepted"
                  : request.status === "declined"
                  ? "declined"
                  : "pending"
              }`}
            >
              <h3 className="blood-group">Blood Group: {request.bloodGroup}</h3>
              <p className="donor-info">
                <strong>Donor:</strong> {request.donorId?.name || "N/A"}
              </p>
              <p className="donor-info">
                <strong>Phone:</strong> {request.donorId?.phone || "N/A"}
              </p>
              <p className="donor-info">
                <strong>Address:</strong> {request.address || "Not provided"}
              </p>
              <p className="status">
                <strong>Status:</strong>{" "}
                <span
                  className={`status-text ${
                    request.status === "accepted"
                      ? "accepted-status"
                      : request.status === "declined"
                      ? "declined-status"
                      : "pending-status"
                  }`}
                >
                  {request.status}
                </span>
              </p>

              {/* Action Buttons */}
              {request.status === "pending" && (
                <div className="action-buttons">
                  <button
                    onClick={() => updateRequestStatus(request._id, "accepted")}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateRequestStatus(request._id, "declined")}
                    className="decline-btn"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => updateRequestStatus(request._id, "read")}
                    className="read-btn"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-requests-message">
            No pending donation requests.
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalBloodDashboard;
