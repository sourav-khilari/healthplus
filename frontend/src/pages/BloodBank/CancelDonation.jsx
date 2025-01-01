import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";

const CancelDonationRequest = () => {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Corrected API endpoint
      const response = await axiosInstance.post("/cancelDonationRequest", {
        requestId,
      });
      setMessage(response.data.message || "Request canceled successfully.");
    } catch (error) {
      console.error("Error canceling request:", error);
      setMessage("Failed to cancel request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl mb-4">Cancel Donation Request</h1>
      <form onSubmit={handleCancel}>
        <div>
          <label>Request ID</label>
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Canceling..." : "Cancel Request"}
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default CancelDonationRequest;
