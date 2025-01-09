import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/UserDonationRequests.css"; // Import the custom CSS file

const UserDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get("/getUserDonationRequests");
        setRequests(response.data?.data?.donationRequests || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Customize date format as needed
  };

  return (
    <div className="user-requests-container">
      <h1 className="requests-header">Your Donation Requests</h1>
      {loading && <div className="loading-message">Loading requests...</div>}
      {error && <div className="error-message">{error}</div>}
      {requests.length > 0 ? (
        <ul className="requests-list">
          {requests.map((req) => (
            <li key={req._id} className="request-item">
              <strong className="request-label">Request ID:</strong> {req._id}{" "}
              <br />
              <strong className="request-label">Blood Group:</strong>{" "}
              {req.bloodGroup} <br />
              <strong className="request-label">Date:</strong>{" "}
              {formatDate(req.createdAt)} <br />
              <strong className="request-label">Status:</strong>{" "}
              {req.status || "Not specified"}
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <div className="no-requests-message">No donation requests found.</div>
        )
      )}
    </div>
  );
};

export default UserDonationRequests;
