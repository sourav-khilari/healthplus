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
        "/hospital/getDonationRequestsForHospital"
      );
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Only call fetchRequests once on component mount
  useEffect(() => {
    fetchRequests();
  }, []); // Empty dependency array to ensure it runs only once

  // Handle marking a request as read
  const handleMarkAsRead = async (requestId) => {
    try {
      await axiosInstance.post("/hospital/markRequestAsRead", { requestId });

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

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Hospital Dashboard
      </h1>

      {loading && (
        <div className="text-center text-gray-500">
          Loading donation requests...
        </div>
      )}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className={`border p-6 rounded-lg shadow-lg ${
                request.status === "read" ? "bg-gray-100" : "bg-white"
              } hover:shadow-xl transition duration-300 ease-in-out`}
            >
              <h3 className="font-semibold text-xl mb-2">
                Blood Group: {request.bloodGroup}
              </h3>
              <p className="text-gray-700">
                <strong>Donor:</strong> {request.donorId?.name || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {request.donorId?.phone || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {request.address || "Not provided"}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    request.status === "read"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {request.status}
                </span>
              </p>

              {request.status !== "read" && (
                <button
                  onClick={() => handleMarkAsRead(request._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4 w-full hover:bg-blue-600 transition duration-200"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No pending donation requests.
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalBloodDashboard;
