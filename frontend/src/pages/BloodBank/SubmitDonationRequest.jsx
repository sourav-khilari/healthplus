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
        donationDate, // If you want to keep the donation date
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
    <div className="container mx-auto mt-6">
      <h1 className="text-2xl mb-4">Submit Blood Donation Request</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Blood Group</label>
          <input
            type="text"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="input"
          />
        </div>
        <div>
          <label>Donation Date</label>
          <input
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
      {message && <p className="mt-4 text-blue-500">{message}</p>}
    </div>
  );
};

export default SubmitDonationRequest;
