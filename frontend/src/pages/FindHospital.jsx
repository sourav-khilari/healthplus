import { useState, useEffect } from "react";
import axiosInstance from "../axios/axios_interceptor.js";

const FindHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Axios instance

  // Function to fetch hospitals
  const fetchHospitals = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/hospitals?lat=${lat}&lng=${lng}`
      );
      setHospitals(response.data);
    } catch (fetchError) {
      setError("Error fetching hospitals. Please try again later.");
      console.error("Error fetching hospitals:", fetchError);
    } finally {
      setLoading(false);
    }
  };

  // Get user's location and fetch hospitals
  const getUserLocation = () => {
    setLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          fetchHospitals(lat, lng);
        },
        (locationError) => {
          setLoading(false);
          setError(
            "Failed to access location. Please enable location services."
          );
          console.error("Error getting location:", locationError);
        }
      );
    } else {
      setLoading(false);
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        Nearby Hospital Locator
      </h1>

      {loading && (
        <div className="text-center text-xl text-gray-500">
          Loading your location and nearby hospitals...
        </div>
      )}

      {error && (
        <div className="text-center text-red-600">
          {error}
          <button
            onClick={getUserLocation}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {!loading && !error && hospitals.length === 0 && (
          <p className="text-center text-lg text-gray-500">
            No hospitals found nearby.
          </p>
        )}

        {!loading &&
          hospitals.map((hospital, index) => {
            const { name, address_line1, address_line2, contact } =
              hospital.properties || {};
            const lat = hospital.geometry.coordinates[1];
            const lng = hospital.geometry.coordinates[0];

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <h2 className="text-2xl font-semibold text-blue-500 mb-2">
                  {name || "Unknown Hospital"}
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

export default FindHospital;
