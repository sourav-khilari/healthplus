import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const BloodBankDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch donation requests
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/getDonationRequestsForHospital"
      ); // Assuming same route for blood bank
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to accept a donation request
  const handleAccept = async (requestId) => {
    try {
      await axiosInstance.post("/acceptDonationRequest", { requestId });

      // Optimistically update the request status to "accepted"
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: "accepted" }
            : request
        )
      );
    } catch (err) {
      console.error("Error accepting donation request:", err);
      setError("Failed to accept donation request. Please try again.");
    }
  };

  // Function to decline a donation request
  const handleDecline = async (requestId) => {
    try {
      await axiosInstance.post("/declineDonationRequest", { requestId });

      // Optimistically update the request status to "declined"
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: "declined" }
            : request
        )
      );
    } catch (err) {
      console.error("Error declining donation request:", err);
      setError("Failed to decline donation request. Please try again.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl mb-4">Blood Bank Dashboard</h1>
      {loading && <div>Loading donation requests...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className={`border p-4 rounded-md shadow-md ${
                request.status === "accepted"
                  ? "bg-green-100"
                  : request.status === "declined"
                  ? "bg-red-100"
                  : "bg-white"
              }`}
            >
              <h3 className="font-semibold">
                Blood Group: {request.bloodGroup}
              </h3>
              <p>
                <strong>Donor:</strong> {request.donorId.name}
              </p>
              <p>
                <strong>Phone:</strong> {request.donorId.phone}
              </p>
              <p>
                <strong>Address:</strong> {request.address}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              {request.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="btn btn-success mt-2"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleDecline(request._id)}
                    className="btn btn-danger mt-2 ml-2"
                  >
                    Decline Request
                  </button>
                </>
              )}
              {request.status === "accepted" && (
                <span className="text-green-600 mt-2">Request Accepted</span>
              )}
              {request.status === "declined" && (
                <span className="text-red-600 mt-2">Request Declined</span>
              )}
            </div>
          ))
        ) : (
          <div>No pending donation requests.</div>
        )}
      </div>
    </div>
  );
};

export default BloodBankDashboard;
