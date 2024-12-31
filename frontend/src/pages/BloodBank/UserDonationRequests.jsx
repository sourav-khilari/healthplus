import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

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
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl mb-4">Your Donation Requests</h1>
      {loading && <div>Loading requests...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {requests.length > 0 ? (
        <ul className="list-disc list-inside">
          {requests.map((req) => (
            <li key={req._id}>
              <strong>Request ID:</strong> {req._id} <br />
              <strong>Blood Group:</strong> {req.bloodGroup} <br />
              <strong>Date:</strong> {formatDate(req.createdAt)} <br />
              <strong>Status:</strong> {req.status || "Not specified"}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <div>No donation requests found.</div>
      )}
    </div>
  );
};

export default UserDonationRequests;
