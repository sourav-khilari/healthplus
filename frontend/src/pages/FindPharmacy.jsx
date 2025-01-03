import { useState, useEffect } from "react";
import axiosInstance from "../axios/axios_interceptor.js";

const MedicineStore = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      const response = await axiosInstance.get(
        `/users/pharmacy?lat=${lat}&lng=${lng}`
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
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Nearby Pharmacy Locator
      </h1>

      {loading && (
        <div className="text-center text-xl text-gray-500">
          Loading your location and nearby pharmacies...
        </div>
      )}

      {error && <div className="text-center text-red-600">{error}</div>}

      <div className="space-y-6 mt-6">
        {pharmacies.length === 0 && !loading && !error && (
          <p className="text-center text-lg text-gray-500">
            No pharmacies found nearby.
          </p>
        )}

        {pharmacies.map((pharmacy, index) => {
          const { name, address_line1, address_line2, contact } =
            pharmacy.properties;
          const lat = pharmacy.geometry.coordinates[1];
          const lng = pharmacy.geometry.coordinates[0];

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                {name || "Unknown Pharmacy"}
              </h2>
              <p className="text-gray-600">
                <strong>Address:</strong> {address_line1 || "Not available"},{" "}
                {address_line2 || ""}
              </p>
              <p className="text-gray-600">
                <strong>Contact:</strong> {contact || "Not available"}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-4 inline-block"
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
