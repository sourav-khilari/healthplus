import { useState } from "react";
import axiosInstance from "../../axios/axios_interceptor.js";
const SubmitDonationRequest = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axiosInstance.post("/submitBloodDonationRequest", {
        bloodGroup,
        phone,
        address,
        donationDate,
      });
      setMessage(response.data.message || "Request submitted successfully.");
    } catch (error) {
      console.error("Error submitting donation request:", error);
      setMessage("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-container">
      <h1 className="donation-header">Submit Blood Donation Request</h1>
      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label className="form-label">Blood Group</label>
          <input
            type="text"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Donation Date</label>
          <input
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SubmitDonationRequest;
