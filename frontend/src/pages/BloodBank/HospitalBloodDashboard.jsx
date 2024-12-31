import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const HospitalBloodDashboard = () => {
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
      );
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to mark request as read
  const handleMarkAsRead = async (requestId) => {
    try {
      const response = await axiosInstance.post("/markRequestAsRead", {
        requestId,
      });
      // Optimistically update the status in the UI
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "read" } : req
        )
      );
    } catch (err) {
      console.error("Error marking request as read:", err);
      setError("Failed to mark request as read. Please try again.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl mb-4">Hospital Dashboard</h1>
      {loading && <div>Loading donation requests...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className={`border p-4 rounded-md shadow-md ${
                request.status === "read" ? "bg-gray-100" : "bg-white"
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
              {request.status !== "read" && (
                <button
                  onClick={() => handleMarkAsRead(request._id)}
                  className="btn btn-primary mt-2"
                >
                  Mark as Read
                </button>
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

export default HospitalBloodDashboard;
