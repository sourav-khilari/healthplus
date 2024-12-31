import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const DonateBlood = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    donorName: "",
    contact: "",
    donationDate: "",
    area: "", // Added area field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDonateBlood = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/donate-blood",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error donating blood:", error);
      alert("Failed to register donation");
    }
  };

  return (
    <div className="donate-blood">
      <h2>Donate Blood</h2>
      <Form onSubmit={handleDonateBlood}>
        <Form.Group controlId="bloodGroup">
          <Form.Label>Blood Group</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="donorName">
          <Form.Label>Donor Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Name"
            name="donorName"
            value={formData.donorName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="contact">
          <Form.Label>Contact Information</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Contact Info"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="donationDate">
          <Form.Label>Donation Date</Form.Label>
          <Form.Control
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* Added area input field */}
        <Form.Group controlId="area">
          <Form.Label>Area</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Your Area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Donate Blood
        </Button>
      </Form>
    </div>
  );
};

export default DonateBlood;
