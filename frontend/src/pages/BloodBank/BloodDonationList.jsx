import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap"; // Bootstrap components for styling

const BloodDonationList = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/blood-donations"
        );
        setDonations(response.data.donations); // Assuming the response has a donations array
      } catch (error) {
        console.error("Error fetching blood donations:", error);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="donation-list">
      <h2>Available Blood Donations</h2>
      <div className="donations-container">
        {donations.map((donation) => (
          <Card key={donation._id} style={{ width: "18rem", margin: "1rem" }}>
            <Card.Body>
              <Card.Title>{donation.bloodGroup}</Card.Title>
              <Card.Text>
                Donor Name: {donation.donorName}
                <br />
                Contact: {donation.contact}
                <br />
                Expiry Date: {donation.expiryDate}
              </Card.Text>
              <Button variant="primary">Request Blood</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BloodDonationList;
