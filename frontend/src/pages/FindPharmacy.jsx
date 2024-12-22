import { useState, useEffect } from "react";
import "../styles/FindPharmacy.css"; // Ensure to create appropriate CSS
import axios from "axios";

const MedicineStore = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          fetchPharmacies(lat, lng); // Fetch pharmacies using user's location
        },
        (error) => {
          setLoading(false);
          setError("Error getting location.");
          console.error("Error getting location:", error);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Function to fetch nearby pharmacies based on location
  const fetchPharmacies = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/pharmacy`,
        {
          params: { lat, lng },
        }
      );
      setPharmacies(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching pharmacies.");
      console.error("Error fetching pharmacies:", error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="medicine-store-page">
      <h1>Nearby Pharmacy Locator</h1>
      {loading && (
        <div id="loading">Loading your location and nearby pharmacies...</div>
      )}
      {error && <div id="error">{error}</div>}
      <div id="pharmacy-list">
        {pharmacies.length === 0 && !loading && !error && (
          <p>No pharmacies found nearby.</p>
        )}
        {pharmacies.map((pharmacy, index) => {
          const { name, address_line1, address_line2, contact } =
            pharmacy.properties;
          const lat = pharmacy.geometry.coordinates[1];
          const lng = pharmacy.geometry.coordinates[0];

          return (
            <div key={index} className="pharmacy">
              <h2>{name || "Unknown Pharmacy"}</h2>
              <p>
                <strong>Address:</strong> {address_line1 || "Not available"},{" "}
                {address_line2 || ""}
              </p>
              <p>
                <strong>Contact:</strong> {contact || "Not available"}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicineStore;
