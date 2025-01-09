import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

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

  // Function to fetch user donation requests
  const fetchRequests = async () => {
    if (isTokenExpired) return; // Prevent infinite loop if token is expired

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        "/users/getUserDonationRequests"
      );
      setRequests(response.data?.data?.donationRequests || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      if (err.response?.status === 401) {
        // Token expired or unauthorized
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

  // Function to submit a new blood donation request
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
      fetchRequests(); // Refresh the list after submitting
      alert(response.data.message); // Show success message from the backend
    } catch (err) {
      console.error("Error submitting donation request:", err);
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

  // Function to cancel a donation request
  const handleCancelRequest = async (requestId) => {
    try {
      const response = await axiosInstance.post(
        "/users/cancelDonationRequest",
        {
          requestId,
        }
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      alert(response.data.message); // Show success message from the backend
    } catch (err) {
      console.error("Error cancelling donation request:", err);
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

  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-2xl mb-6">Blood Bank Dashboard</h1>

      {/* Error Notification */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* New Donation Request Form */}
      <div className="border p-4 rounded-md mb-6">
        <h2 className="text-xl mb-4">Submit a New Blood Donation Request</h2>
        <input
          type="text"
          placeholder="Blood Group (e.g., A+, B-, O+)"
          className="border p-2 rounded-md mb-2 w-full"
          value={newRequest.bloodGroup}
          onChange={(e) =>
            setNewRequest({ ...newRequest, bloodGroup: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="border p-2 rounded-md mb-2 w-full"
          value={newRequest.phone}
          onChange={(e) =>
            setNewRequest({ ...newRequest, phone: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-2 rounded-md mb-2 w-full"
          value={newRequest.address}
          onChange={(e) =>
            setNewRequest({ ...newRequest, address: e.target.value })
          }
        />
        <button
          onClick={handleSubmitRequest}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={isTokenExpired}
        >
          Submit Request
        </button>
      </div>

      {/* Donation Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div>Loading donation requests...</div>
        ) : requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="border p-4 rounded-md shadow-md bg-white"
            >
              <h3 className="font-semibold">
                Blood Group: {request.bloodGroup}
              </h3>
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
                  className="bg-red-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-red-600"
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
