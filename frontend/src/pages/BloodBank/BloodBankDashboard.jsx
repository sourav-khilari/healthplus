import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const BloodBankDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRequest, setNewRequest] = useState({ bloodGroup: "", address: "" });

  // Function to fetch user donation requests
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/user/getUserDonationRequests");
      setRequests(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching donation requests:", err);
      setError("Failed to load donation requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to submit a new blood donation request
  const handleSubmitRequest = async () => {
    if (!newRequest.bloodGroup || !newRequest.address) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await axiosInstance.post("/user/submitBloodDonationRequest", newRequest);
      setNewRequest({ bloodGroup: "", address: "" });
      fetchRequests(); // Refresh the list after submitting
    } catch (err) {
      console.error("Error submitting donation request:", err);
      setError("Failed to submit donation request. Please try again.");
    }
  };

  // Function to cancel a donation request
  const handleCancelRequest = async (requestId) => {
    try {
      await axiosInstance.post("/user/cancelDonationRequest", { requestId });
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
    } catch (err) {
      console.error("Error cancelling donation request:", err);
      setError("Failed to cancel donation request. Please try again.");
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
                <strong>Address:</strong> {request.address}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>

              {request.status === "pending" && (
                <button
                  onClick={() => handleCancelRequest(request._id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-red-600"
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
