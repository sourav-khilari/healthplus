import { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap"; // Bootstrap components for styling

const RequestBloodDonation = () => {
  const [formData, setFormData] = useState({
    bloodGroup: "",
    quantity: "",
    contactInfo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRequestBlood = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/request-blood",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error requesting blood:", error);
      alert("Failed to request blood");
    }
  };

  return (
    <div className="request-blood">
      <h2>Request Blood </h2>
      <Form onSubmit={handleRequestBlood}>
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

        <Form.Group controlId="quantity">
          <Form.Label>Quantity (in units)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="contactInfo">
          <Form.Label>Contact Information</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Request Blood
        </Button>
      </Form>
    </div>
  );
};

export default RequestBloodDonation;
