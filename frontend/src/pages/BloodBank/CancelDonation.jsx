import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
import "../../styles/CancelDonationRequest.css"; // Import custom styles

const CancelDonationRequest = () => {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.post(
        "/hospital/cancelDonationRequest",
        { requestId }
      );
      setMessage(response.data.message || "Request canceled successfully.");
    } catch (error) {
      console.error("Error canceling request:", error);
      setMessage("Failed to cancel request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-donation-container">
      <h1 className="title">Cancel Donation Request</h1>
      <form onSubmit={handleCancel} className="blood-form-container">
        <div className="input-group">
          <label className="label">Request ID</label>
          <input
            type="text"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            required
            className="blood-input-field"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Canceling..." : "Cancel Request"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CancelDonationRequest;
